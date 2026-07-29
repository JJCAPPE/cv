import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const OUTPUT_DIR = fileURLToPath(
  new URL("../public/media/projects/deskinator/", import.meta.url),
);

const WIDTH = 2400;
const HEIGHT = 1350;

const palette = {
  bg: "#0b0b0a",
  bgGreen: "#0c100d",
  panel: "#161614",
  surface: "#1d1d1a",
  surface2: "#24241f",
  line: "#4b4a41",
  lineSoft: "#34342e",
  fg: "#f1efe8",
  muted: "#aaa79f",
  subtle: "#77746d",
  accent: "#e6d12a",
  accentDark: "#8f8214",
  warmTop: "#ece8dc",
  warmFront: "#cbc5b7",
  warmSide: "#aaa496",
  warmDark: "#777268",
  ink: "#11110f",
};

/*
 * Source ledger
 *
 * Every visible engineering label below comes from one of these records.
 * Report-only software concepts are deliberately excluded from the default path.
 */
const sourceLedger = {
  hardware: [
    {
      label: "BODY ENVELOPE",
      value: "200 × 220 × 75.4 MM",
      source: "deliverables/images/cad-final.pdf",
    },
    {
      label: "WHEEL SPACING",
      value: "165.5 MM",
      source: "deliverables/images/cad-final.pdf",
    },
    {
      label: "SENSOR DATUM",
      value: "+216.55 MM / ±119.84 MM",
      source: "config.py Geometry + cad-final.pdf",
    },
    {
      label: "SENSOR MOUNT",
      value: "70 × 40 × 20 MM / 4 × Ø2.5",
      source: "deliverables/images/cad-sensor-mount.pdf",
    },
    {
      label: "VACUUM SCOOP",
      value: "204 MM / 101.66 MM / 18.18 MM / R40",
      source: "deliverables/images/cad-vacuum.pdf",
    },
    {
      label: "REMOVABLE TRAY",
      value: "110.32 × 65 MM / 4 MM WALL",
      source: "deliverables/images/cad-tray.pdf",
    },
    {
      label: "ELECTRONICS",
      value:
        "RASPBERRY PI 4B / 2 × A4988 / 3 × APDS9960 / 2 × NEMA17 / MOSFET / LED",
      source: "deliverables/images/wiring.png + report.typ BOM",
    },
    {
      label: "POWER",
      value: "12 V PACK + 5 V PACK",
      source: "deliverables/images/wiring.png + report.typ BOM",
    },
  ],
  software: [
    {
      label: "SUPERVISORY LOOP",
      value: "50 HZ / 20 MS",
      source: "main.py run() + config.py Algo.FUSE_HZ",
    },
    {
      label: "STATE PATH",
      value: "WAIT_START > BOUNDARY_DISCOVERY > COVERAGE > DONE",
      source: "main.py",
    },
    {
      label: "SENSE + STABILIZE",
      value:
        "_read_sensors_fast() / _filter_sensor() / SimpleOdometry / compute_sensor_world_position()",
      source: "main.py + slam/simple_odom.py + hw/table_detector.py",
    },
    {
      label: "INFER + PLAN",
      value:
        "SimpleRectangleFit.fit() / get_inset_rectangle() / build_lanes() / final perimeter",
      source: "planning/coverage.py",
    },
    {
      label: "EVIDENCE",
      value: "SweptMap 5 MM / telemetry / visualizer 5 HZ",
      source: "planning/map2d.py + main.py",
    },
    {
      label: "HARDWARE TIMING",
      value: "1/16 MICROSTEP / 10 μS STEP / 10 KHZ CAP",
      source: "hw/stepper.py",
    },
    {
      label: "VACUUM OUTPUT",
      value: "25 KHZ PWM",
      source: "hw/vacuum.py",
    },
    {
      label: "OPTIONAL IMU",
      value: "--imu / MPU6050 / EKFFusion",
      source: "main.py",
    },
  ],
};

const esc = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

function attrString(attrs = {}) {
  return Object.entries(attrs)
    .filter(([, value]) => value !== undefined && value !== null && value !== false)
    .map(([key, value]) => {
      const name = {
        className: "class",
        markerStart: "marker-start",
        markerEnd: "marker-end",
        textAnchor: "text-anchor",
        dominantBaseline: "dominant-baseline",
        strokeWidth: "stroke-width",
        strokeDasharray: "stroke-dasharray",
        strokeLinecap: "stroke-linecap",
        strokeLinejoin: "stroke-linejoin",
        fillOpacity: "fill-opacity",
        strokeOpacity: "stroke-opacity",
        vectorEffect: "vector-effect",
        ariaHidden: "aria-hidden",
      }[key] ?? key;
      return `${name}="${esc(value)}"`;
    })
    .join(" ");
}

function el(name, attrs = {}, children = "") {
  const renderedAttrs = attrString(attrs);
  return `<${name}${renderedAttrs ? ` ${renderedAttrs}` : ""}>${children}</${name}>`;
}

function empty(name, attrs = {}) {
  const renderedAttrs = attrString(attrs);
  return `<${name}${renderedAttrs ? ` ${renderedAttrs}` : ""}/>`;
}

const group = (children, attrs = {}) => el("g", attrs, children);
const path = (d, attrs = {}) => empty("path", { d, ...attrs });
const rect = (x, y, width, height, attrs = {}) =>
  empty("rect", { x, y, width, height, ...attrs });
const line = (x1, y1, x2, y2, attrs = {}) =>
  empty("line", { x1, y1, x2, y2, ...attrs });
const circle = (cx, cy, r, attrs = {}) =>
  empty("circle", { cx, cy, r, ...attrs });
const ellipse = (cx, cy, rx, ry, attrs = {}) =>
  empty("ellipse", { cx, cy, rx, ry, ...attrs });
const polygon = (points, attrs = {}) =>
  empty("polygon", {
    points: points.map(([x, y]) => `${x},${y}`).join(" "),
    ...attrs,
  });
const polyline = (points, attrs = {}) =>
  empty("polyline", {
    points: points.map(([x, y]) => `${x},${y}`).join(" "),
    ...attrs,
  });

function text(x, y, value, attrs = {}) {
  return el("text", { x, y, ...attrs }, esc(value));
}

function multilineText(x, y, lines, attrs = {}, lineHeight = 24) {
  return el(
    "text",
    { x, y, ...attrs },
    lines
      .map((value, index) =>
        el(
          "tspan",
          { x, dy: index === 0 ? 0 : lineHeight },
          esc(value),
        ),
      )
      .join(""),
  );
}

function defs() {
  const style = `
    .display{font-family:"Arial Narrow","Barlow Condensed","Helvetica Neue",sans-serif;font-stretch:condensed}
    .sans{font-family:"Geist","Helvetica Neue",Arial,sans-serif}
    .mono{font-family:"Geist Mono","SFMono-Regular",Menlo,Consolas,monospace}
    .outline{stroke:${palette.ink};stroke-width:3;stroke-linejoin:round;vector-effect:non-scaling-stroke}
    .fine{stroke:${palette.line};stroke-width:1.5;fill:none;vector-effect:non-scaling-stroke}
    .fine-soft{stroke:${palette.lineSoft};stroke-width:1;fill:none;vector-effect:non-scaling-stroke}
    .axis{stroke:${palette.accent};stroke-width:2;fill:none;stroke-linecap:round;vector-effect:non-scaling-stroke}
    .axis-dash{stroke:${palette.accent};stroke-width:1.5;fill:none;stroke-dasharray:10 9;stroke-linecap:round;vector-effect:non-scaling-stroke}
    .muted-line{stroke:${palette.muted};stroke-width:1.25;fill:none;vector-effect:non-scaling-stroke}
    .label{fill:${palette.fg};font-size:22px;letter-spacing:.08em}
    .micro{fill:${palette.muted};font-size:15px;letter-spacing:.12em}
    .tiny{fill:${palette.subtle};font-size:12px;letter-spacing:.1em}
    .accent-text{fill:${palette.accent}}
    .dim{fill:${palette.muted};font-size:15px;letter-spacing:.08em}
    .part-number{fill:${palette.ink};font-size:14px;font-weight:700}
  `.trim();

  return el(
    "defs",
    {},
    [
      el("style", {}, style),
      el(
        "marker",
        {
          id: "arrow-accent",
          viewBox: "0 0 10 10",
          refX: 8,
          refY: 5,
          markerWidth: 6,
          markerHeight: 6,
          orient: "auto-start-reverse",
        },
        path("M 0 0 L 10 5 L 0 10 z", { fill: palette.accent }),
      ),
      el(
        "marker",
        {
          id: "arrow-muted",
          viewBox: "0 0 10 10",
          refX: 8,
          refY: 5,
          markerWidth: 5,
          markerHeight: 5,
          orient: "auto-start-reverse",
        },
        path("M 0 0 L 10 5 L 0 10 z", { fill: palette.muted }),
      ),
      el(
        "pattern",
        {
          id: "datum-grid",
          width: 64,
          height: 64,
          patternUnits: "userSpaceOnUse",
        },
        [
          line(0, 0, 64, 0, {
            stroke: palette.lineSoft,
            strokeWidth: 1,
            strokeOpacity: 0.52,
          }),
          line(0, 0, 0, 64, {
            stroke: palette.lineSoft,
            strokeWidth: 1,
            strokeOpacity: 0.52,
          }),
          circle(0, 0, 2, { fill: palette.line }),
        ].join(""),
      ),
      el(
        "pattern",
        {
          id: "raster-grid",
          width: 16,
          height: 16,
          patternUnits: "userSpaceOnUse",
        },
        [
          line(0, 0, 16, 0, {
            stroke: palette.accent,
            strokeWidth: 0.7,
            strokeOpacity: 0.18,
          }),
          line(0, 0, 0, 16, {
            stroke: palette.accent,
            strokeWidth: 0.7,
            strokeOpacity: 0.18,
          }),
        ].join(""),
      ),
      el(
        "linearGradient",
        { id: "left-fade", x1: 0, y1: 0, x2: 1, y2: 0 },
        [
          empty("stop", { offset: "0%", "stop-color": palette.bg }),
          empty("stop", {
            offset: "48%",
            "stop-color": palette.bg,
            "stop-opacity": 0.96,
          }),
          empty("stop", {
            offset: "74%",
            "stop-color": palette.bg,
            "stop-opacity": 0.22,
          }),
          empty("stop", {
            offset: "100%",
            "stop-color": palette.bg,
            "stop-opacity": 0,
          }),
        ].join(""),
      ),
    ].join(""),
  );
}

function svgDocument({ title, description, content, background = palette.bg }) {
  const titleId = "svg-title";
  const descriptionId = "svg-description";
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" aria-labelledby="${titleId} ${descriptionId}">`,
    el("title", { id: titleId }, esc(title)),
    el("desc", { id: descriptionId }, esc(description)),
    el(
      "metadata",
      { id: "source-ledger" },
      esc(JSON.stringify(sourceLedger)),
    ),
    defs(),
    rect(0, 0, WIDTH, HEIGHT, { fill: background }),
    content,
    `</svg>`,
    "",
  ].join("\n");
}

function isoBox(
  x,
  y,
  width,
  depth,
  height,
  {
    top = palette.warmTop,
    front = palette.warmFront,
    side = palette.warmSide,
    stroke = palette.ink,
    strokeWidth = 3,
    opacity = 1,
    className = "",
  } = {},
) {
  const dx = depth * 0.56;
  const dy = depth * 0.32;
  const topPoints = [
    [x, y],
    [x + width, y],
    [x + width + dx, y - dy],
    [x + dx, y - dy],
  ];
  const frontPoints = [
    [x, y],
    [x + width, y],
    [x + width, y + height],
    [x, y + height],
  ];
  const sidePoints = [
    [x + width, y],
    [x + width + dx, y - dy],
    [x + width + dx, y + height - dy],
    [x + width, y + height],
  ];
  const shared = {
    stroke,
    strokeWidth,
    strokeLinejoin: "round",
    vectorEffect: "non-scaling-stroke",
  };

  return group(
    [
      polygon(sidePoints, { fill: side, ...shared }),
      polygon(frontPoints, { fill: front, ...shared }),
      polygon(topPoints, { fill: top, ...shared }),
    ].join(""),
    { opacity, className },
  );
}

function openTray(x, y, scale = 1) {
  const outer = isoBox(x, y, 280, 180, 48, {
    top: palette.warmFront,
    front: palette.warmSide,
    side: palette.warmDark,
  });
  const dx = 180 * 0.56;
  const dy = 180 * 0.32;
  const inner = polygon(
    [
      [x + 24, y - 4],
      [x + 252, y - 4],
      [x + 252 + dx - 24, y - dy + 17],
      [x + dx - 4, y - dy + 17],
    ],
    {
      fill: palette.bg,
      stroke: palette.ink,
      strokeWidth: 3,
      strokeLinejoin: "round",
      vectorEffect: "non-scaling-stroke",
    },
  );
  const duct = [
    path(
      `M ${x + 40} ${y - 17} L ${x + 126} ${y - 52} L ${x + 180} ${
        y - 27
      } L ${x + 98} ${y + 4} Z`,
      {
        fill: palette.warmTop,
        stroke: palette.ink,
        strokeWidth: 2.5,
        strokeLinejoin: "round",
        vectorEffect: "non-scaling-stroke",
      },
    ),
    path(
      `M ${x + 180} ${y - 27} Q ${x + 218} ${y - 44} ${x + 246} ${
        y - 69
      } L ${x + 224} ${y - 18} Z`,
      {
        fill: palette.warmSide,
        stroke: palette.ink,
        strokeWidth: 2.5,
        vectorEffect: "non-scaling-stroke",
      },
    ),
  ].join("");

  return group([outer, inner, duct].join(""), {
    transform: `scale(${scale})`,
  });
}

function sensorMount(x, y, flip = 1) {
  const stemPath =
    flip > 0
      ? `M ${x + 18} ${y + 22} Q ${x + 28} ${y + 70} ${x + 72} ${
          y + 94
        } L ${x + 108} ${y + 94} Q ${x + 143} ${y + 65} ${x + 152} ${
          y + 22
        } Z`
      : `M ${x + 18} ${y + 22} Q ${x + 28} ${y + 65} ${x + 63} ${
          y + 94
        } L ${x + 99} ${y + 94} Q ${x + 143} ${y + 70} ${x + 152} ${
          y + 22
        } Z`;

  return group(
    [
      path(stemPath, {
        fill: palette.warmSide,
        stroke: palette.ink,
        strokeWidth: 3,
        strokeLinejoin: "round",
        vectorEffect: "non-scaling-stroke",
      }),
      rect(x, y, 170, 27, {
        rx: 13.5,
        fill: palette.warmTop,
        stroke: palette.ink,
        strokeWidth: 3,
        vectorEffect: "non-scaling-stroke",
      }),
      ...[20, 63, 106, 150].map((offset) =>
        circle(x + offset, y + 13.5, 4.5, {
          fill: palette.ink,
        }),
      ),
      isoBox(x + 45, y + 94, 78, 36, 17, {
        top: palette.surface2,
        front: palette.panel,
        side: palette.ink,
        stroke: palette.ink,
        strokeWidth: 2,
      }),
      rect(x + 60, y + 101, 48, 5, {
        fill: palette.accent,
        opacity: 0.9,
      }),
    ].join(""),
  );
}

function wheelAndMotor(x, y, side = "left") {
  const motorX = side === "left" ? x + 42 : x - 146;
  return group(
    [
      ellipse(x, y, 55, 84, {
        fill: palette.ink,
        stroke: palette.warmFront,
        strokeWidth: 5,
        vectorEffect: "non-scaling-stroke",
      }),
      ellipse(x, y, 31, 56, {
        fill: palette.surface,
        stroke: palette.warmDark,
        strokeWidth: 3,
        vectorEffect: "non-scaling-stroke",
      }),
      line(
        side === "left" ? x + 5 : x - 5,
        y,
        side === "left" ? motorX + 8 : motorX + 92,
        y,
        { className: "axis" },
      ),
      isoBox(motorX, y - 45, 96, 70, 90, {
        top: palette.warmTop,
        front: palette.warmFront,
        side: palette.warmSide,
        strokeWidth: 2.5,
      }),
      rect(motorX + 13, y - 17, 70, 34, {
        fill: palette.surface2,
        stroke: palette.ink,
        strokeWidth: 2,
        vectorEffect: "non-scaling-stroke",
      }),
      text(motorX + 48, y + 6, "NEMA17", {
        className: "mono tiny",
        textAnchor: "middle",
        fill: palette.fg,
      }),
    ].join(""),
  );
}

function vacuumScoop(x, y) {
  return group(
    [
      path(
        `M ${x} ${y + 50} Q ${x + 72} ${y + 5} ${x + 235} ${y - 8} ` +
          `Q ${x + 350} ${y - 23} ${x + 465} ${y - 8} ` +
          `Q ${x + 628} ${y + 5} ${x + 700} ${y + 50} ` +
          `Q ${x + 350} ${y + 91} ${x} ${y + 50} Z`,
        {
          fill: palette.warmFront,
          stroke: palette.ink,
          strokeWidth: 3.5,
          strokeLinejoin: "round",
          vectorEffect: "non-scaling-stroke",
        },
      ),
      path(
        `M ${x + 82} ${y + 42} L ${x + 273} ${y - 74} ` +
          `Q ${x + 350} ${y - 110} ${x + 427} ${y - 74} ` +
          `L ${x + 618} ${y + 42}`,
        {
          fill: "none",
          stroke: palette.ink,
          strokeWidth: 3,
          strokeLinejoin: "round",
          vectorEffect: "non-scaling-stroke",
        },
      ),
      ellipse(x + 350, y - 73, 79, 47, {
        fill: palette.surface,
        stroke: palette.ink,
        strokeWidth: 3,
        vectorEffect: "non-scaling-stroke",
      }),
      ellipse(x + 350, y - 73, 48, 28, {
        fill: palette.bg,
        stroke: palette.accent,
        strokeWidth: 3,
        vectorEffect: "non-scaling-stroke",
      }),
      path(
        `M ${x + 350} ${y - 73} C ${x + 388} ${y - 105} ${
          x + 403
        } ${y - 66} ${x + 350} ${y - 73} ` +
          `C ${x + 316} ${y - 35} ${x + 299} ${y - 78} ${x + 350} ${
            y - 73
          }`,
        {
          fill: palette.accent,
          fillOpacity: 0.78,
          stroke: palette.ink,
          strokeWidth: 1.8,
          vectorEffect: "non-scaling-stroke",
        },
      ),
      line(x + 38, y + 50, x + 662, y + 50, {
        stroke: palette.ink,
        strokeWidth: 4,
        vectorEffect: "non-scaling-stroke",
      }),
    ].join(""),
  );
}

function componentLabel(x, y, label, width = 104) {
  return group(
    [
      rect(x, y, width, 27, {
        fill: palette.ink,
        stroke: palette.accent,
        strokeWidth: 1.5,
        vectorEffect: "non-scaling-stroke",
      }),
      text(x + width / 2, y + 18, label, {
        className: "mono",
        fill: palette.fg,
        "font-size": 12,
        "letter-spacing": ".09em",
        textAnchor: "middle",
      }),
    ].join(""),
  );
}

function electronicsDeck(bodyY) {
  const plateY = bodyY - 172;
  return group(
    [
      isoBox(208, plateY, 520, 286, 18, {
        top: palette.surface,
        front: palette.panel,
        side: palette.ink,
        stroke: palette.warmDark,
        strokeWidth: 2.5,
      }),
      line(466, plateY - 134, 466, bodyY - 12, {
        className: "axis-dash",
      }),
      isoBox(250, plateY - 116, 238, 116, 27, {
        top: palette.surface2,
        front: palette.panel,
        side: palette.ink,
        stroke: palette.ink,
        strokeWidth: 2.5,
      }),
      rect(278, plateY - 99, 88, 44, {
        fill: palette.ink,
        stroke: palette.accent,
        strokeWidth: 2,
        vectorEffect: "non-scaling-stroke",
      }),
      ...[0, 1, 2, 3].map((index) =>
        line(
          386 + index * 13,
          plateY - 95,
          386 + index * 13,
          plateY - 54,
          {
            stroke: palette.accent,
            strokeWidth: 2,
            vectorEffect: "non-scaling-stroke",
          },
        ),
      ),
      componentLabel(296, plateY - 139, "RASPBERRY PI 4B", 150),
      isoBox(534, plateY - 104, 76, 62, 34, {
        top: palette.warmTop,
        front: palette.warmFront,
        side: palette.warmSide,
        strokeWidth: 2,
      }),
      isoBox(628, plateY - 104, 76, 62, 34, {
        top: palette.warmTop,
        front: palette.warmFront,
        side: palette.warmSide,
        strokeWidth: 2,
      }),
      componentLabel(555, plateY - 128, "A4988", 67),
      componentLabel(649, plateY - 128, "A4988", 67),
      isoBox(730, plateY - 92, 70, 50, 22, {
        top: palette.surface2,
        front: palette.panel,
        side: palette.ink,
        stroke: palette.ink,
        strokeWidth: 2,
      }),
      rect(748, plateY - 80, 34, 19, {
        fill: palette.ink,
        stroke: palette.accent,
        strokeWidth: 1.5,
        vectorEffect: "non-scaling-stroke",
      }),
      componentLabel(720, plateY - 168, "GESTURE APDS", 126),
      line(783, plateY - 141, 765, plateY - 94, {
        className: "axis-dash",
      }),
      isoBox(782, plateY - 24, 54, 38, 20, {
        top: palette.surface2,
        front: palette.panel,
        side: palette.ink,
        stroke: palette.ink,
        strokeWidth: 2,
      }),
      componentLabel(769, plateY - 57, "MOSFET", 78),
      isoBox(324, plateY - 247, 210, 74, 48, {
        top: palette.surface2,
        front: palette.ink,
        side: palette.panel,
        stroke: palette.warmDark,
        strokeWidth: 2.5,
      }),
      isoBox(558, plateY - 247, 154, 74, 48, {
        top: palette.surface2,
        front: palette.ink,
        side: palette.panel,
        stroke: palette.warmDark,
        strokeWidth: 2.5,
      }),
      rect(345, plateY - 236, 168, 8, { fill: palette.accent }),
      rect(577, plateY - 236, 116, 8, { fill: palette.accent }),
      componentLabel(369, plateY - 283, "12 V PACK", 118),
      componentLabel(579, plateY - 283, "5 V PACK", 108),
      circle(861, plateY - 66, 11, {
        fill: palette.accent,
        stroke: palette.ink,
        strokeWidth: 2,
        vectorEffect: "non-scaling-stroke",
      }),
      line(861, plateY - 55, 861, plateY - 18, {
        stroke: palette.warmFront,
        strokeWidth: 4,
        vectorEffect: "non-scaling-stroke",
      }),
      componentLabel(832, plateY - 103, "LED", 58),
      componentLabel(224, plateY - 31, "SCHEMATIC DECK", 138),
    ].join(""),
  );
}

function hardwareCore({ detail = "full" } = {}) {
  const bodyY = 514;
  const bodyX = 160;
  const bodyW = 600;
  const bodyD = 330;
  const bodyH = 205;
  const bodyDx = bodyD * 0.56;
  const bodyDy = bodyD * 0.32;

  const body = group(
    [
      isoBox(bodyX, bodyY, bodyW, bodyD, bodyH, {
        top: palette.warmTop,
        front: palette.warmFront,
        side: palette.warmSide,
        strokeWidth: 4,
      }),
      path(
        `M ${bodyX + 26} ${bodyY + 28} L ${bodyX + bodyW - 26} ${
          bodyY + 28
        }`,
        {
          stroke: palette.warmDark,
          strokeWidth: 2,
          strokeDasharray: "34 16",
          vectorEffect: "non-scaling-stroke",
        },
      ),
      path(
        `M ${bodyX + bodyW + 20} ${bodyY + 5} L ${
          bodyX + bodyW + bodyDx - 16
        } ${bodyY - bodyDy + 10}`,
        {
          stroke: palette.warmDark,
          strokeWidth: 2,
          strokeDasharray: "34 16",
          vectorEffect: "non-scaling-stroke",
        },
      ),
      componentLabel(bodyX + 205, bodyY + 84, "200 × 220 BODY", 190),
    ].join(""),
  );

  const wheelLayerY = bodyY + bodyH + 122;
  const leftWheelX = bodyX + 104;
  const rightWheelX = bodyX + bodyW - 28;
  const sensorY = bodyY + bodyH + 213;
  const trayX = bodyX + bodyW + 390;
  const trayY = bodyY + 73;
  const scoopX = bodyX - 40;
  const scoopY = bodyY + bodyH + 413;

  const axes = group(
    [
      line(bodyX + 16, wheelLayerY, bodyX + bodyW + 42, wheelLayerY, {
        className: "axis-dash",
        markerStart: "url(#arrow-accent)",
        markerEnd: "url(#arrow-accent)",
      }),
      line(bodyX + 455, bodyY - 500, bodyX + 455, scoopY + 72, {
        className: "axis-dash",
        strokeOpacity: 0.72,
      }),
      line(
        bodyX + bodyW + bodyDx - 8,
        bodyY + 21,
        trayX + 12,
        trayY - 22,
        {
          className: "axis-dash",
          markerEnd: "url(#arrow-accent)",
        },
      ),
      line(bodyX + 290, bodyY + bodyH + 20, bodyX + 80, sensorY + 44, {
        className: "axis-dash",
        markerEnd: "url(#arrow-accent)",
      }),
      line(bodyX + 480, bodyY + bodyH + 20, bodyX + 504, sensorY + 44, {
        className: "axis-dash",
        markerEnd: "url(#arrow-accent)",
      }),
    ].join(""),
  );

  const sensors = group(
    [
      sensorMount(bodyX - 98, sensorY, 1),
      sensorMount(bodyX + bodyW - 104, sensorY, -1),
      text(bodyX - 13, sensorY + 143, "APDS9960 / LEFT", {
        className: "mono micro",
        textAnchor: "middle",
      }),
      text(bodyX + bodyW - 18, sensorY + 143, "APDS9960 / RIGHT", {
        className: "mono micro",
        textAnchor: "middle",
      }),
    ].join(""),
  );

  const motors = group(
    [
      wheelAndMotor(leftWheelX, wheelLayerY, "left"),
      wheelAndMotor(rightWheelX, wheelLayerY, "right"),
      text(bodyX + bodyW / 2, wheelLayerY - 98, "165.5 MM WHEEL AXIS", {
        className: "mono micro accent-text",
        textAnchor: "middle",
      }),
    ].join(""),
  );

  const tray = group(
    [
      openTray(trayX, trayY),
      componentLabel(trayX + 58, trayY + 83, "REMOVABLE TRAY", 144),
    ].join(""),
  );

  const scoop = group(
    [
      vacuumScoop(scoopX, scoopY),
      componentLabel(scoopX + 258, scoopY + 102, "204 MM SCOOP", 146),
      componentLabel(scoopX + 295, scoopY - 142, "12 V FAN / R40", 142),
    ].join(""),
  );

  const detailMarks =
    detail === "full"
      ? group(
          [
            line(
              bodyX + bodyW + bodyDx + 44,
              bodyY - bodyDy,
              bodyX + bodyW + bodyDx + 44,
              bodyY + bodyH - bodyDy,
              {
                className: "muted-line",
                markerStart: "url(#arrow-muted)",
                markerEnd: "url(#arrow-muted)",
              },
            ),
            text(
              bodyX + bodyW + bodyDx + 62,
              bodyY + bodyH / 2 - bodyDy,
              "75.4 MM",
              {
                className: "mono dim",
                transform: `rotate(90 ${bodyX + bodyW + bodyDx + 62} ${
                  bodyY + bodyH / 2 - bodyDy
                })`,
                textAnchor: "middle",
              },
            ),
            polyline(
              [
                [bodyX + bodyDx / 2, bodyY - bodyDy / 2 - 16],
                [bodyX + bodyDx / 2 - 96, bodyY - bodyDy / 2 - 74],
                [bodyX + bodyDx / 2 - 208, bodyY - bodyDy / 2 - 74],
              ],
              {
                className: "muted-line",
                markerStart: "url(#arrow-muted)",
              },
            ),
            text(
              bodyX + bodyDx / 2 - 214,
              bodyY - bodyDy / 2 - 84,
              "220 MM BODY DEPTH",
              {
                className: "mono dim",
              },
            ),
          ].join(""),
        )
      : "";

  return group(
    [
      axes,
      electronicsDeck(bodyY),
      body,
      tray,
      motors,
      sensors,
      scoop,
      detailMarks,
    ].join(""),
    { "data-master": "hardware" },
  );
}

function partIndex(x, y, number, title, detail, targetX, targetY, side = "right") {
  const elbowX = side === "right" ? x - 54 : x + 54;
  const lineEndX = side === "right" ? x - 10 : x + 10;
  const anchor = side === "right" ? "start" : "end";
  return group(
    [
      polyline(
        [
          [targetX, targetY],
          [elbowX, y - 6],
          [lineEndX, y - 6],
        ],
        {
          className: "muted-line",
          markerStart: "url(#arrow-muted)",
        },
      ),
      circle(x, y - 6, 18, {
        fill: palette.accent,
        stroke: palette.ink,
        strokeWidth: 2,
        vectorEffect: "non-scaling-stroke",
      }),
      text(x, y - 1, String(number).padStart(2, "0"), {
        className: "mono part-number",
        textAnchor: "middle",
      }),
      text(x + (side === "right" ? 32 : -32), y - 6, title, {
        className: "mono",
        fill: palette.fg,
        "font-size": 16,
        "letter-spacing": ".08em",
        textAnchor: anchor,
      }),
      text(x + (side === "right" ? 32 : -32), y + 17, detail, {
        className: "mono",
        fill: palette.muted,
        "font-size": 12,
        "letter-spacing": ".07em",
        textAnchor: anchor,
      }),
    ].join(""),
  );
}

function hardwareMaster() {
  const title = "Deskinator documented hardware system explosion";
  const description =
    "A CAD-style exploded system view of the documented Deskinator enclosure, sensor mounts, wheel and motor axis, vacuum scoop, removable tray, Raspberry Pi, drivers, sensors, batteries, fan, MOSFET, and LED.";

  const datumPanel = group(
    [
      rect(88, 884, 438, 336, {
        fill: palette.panel,
        stroke: palette.line,
        strokeWidth: 1.5,
        vectorEffect: "non-scaling-stroke",
      }),
      text(120, 926, "CONFIG DATUM", {
        className: "mono micro accent-text",
      }),
      text(120, 974, "ORIGIN", { className: "mono tiny" }),
      text(294, 974, "AXLE MIDPOINT", { className: "mono micro" }),
      text(120, 1014, "+X", { className: "mono tiny" }),
      text(294, 1014, "FORWARD", { className: "mono micro" }),
      text(120, 1054, "+Y", { className: "mono tiny" }),
      text(294, 1054, "LEFT", { className: "mono micro" }),
      text(120, 1094, "EDGE SENSORS", { className: "mono tiny" }),
      text(294, 1094, "+216.55 / ±119.84 MM", {
        className: "mono micro",
      }),
      text(120, 1134, "VACUUM FOOTPRINT", { className: "mono tiny" }),
      text(294, 1134, "200 × 140 MM", { className: "mono micro" }),
      line(120, 1170, 492, 1170, { className: "fine" }),
      text(120, 1198, "DIMENSIONS: CAD + CONFIG.PY", {
        className: "mono tiny accent-text",
      }),
    ].join(""),
  );

  const legend = group(
    [
      text(88, 92, "DESKINATOR / HARDWARE", {
        className: "mono micro accent-text",
      }),
      text(88, 154, "SYSTEM", {
        className: "display",
        fill: palette.fg,
        "font-size": 72,
        "font-weight": 700,
        "letter-spacing": "-.02em",
      }),
      text(88, 218, "EXPLOSION", {
        className: "display",
        fill: palette.fg,
        "font-size": 72,
        "font-weight": 700,
        "letter-spacing": "-.02em",
      }),
      multilineText(
        90,
        278,
        [
          "DOCUMENTED GEOMETRY",
          "SCHEMATIC ELECTRONIC VOLUMES",
          "NOT AN ASSEMBLY MANUAL",
        ],
        { className: "mono micro" },
        28,
      ),
      line(88, 382, 410, 382, { className: "axis" }),
      text(88, 420, "KNOWN SERVICE / SEPARATION AXES", {
        className: "mono tiny",
      }),
      line(88, 452, 410, 452, { className: "axis-dash" }),
      text(88, 490, "SYSTEM RELATIONSHIP / NO MOUNTING CLAIM", {
        className: "mono tiny",
      }),
    ].join(""),
  );

  const indexed = group(
    [
      partIndex(
        2050,
        140,
        1,
        "POWER",
        "12 V + 5 V PACKS",
        1235,
        155,
      ),
      partIndex(
        2050,
        236,
        2,
        "CONTROL",
        "RASPBERRY PI 4B",
        1110,
        310,
      ),
      partIndex(
        2050,
        332,
        3,
        "MOTOR DRIVE",
        "2 × A4988",
        1430,
        333,
      ),
      partIndex(
        2050,
        574,
        4,
        "ENCLOSURE",
        "200 × 220 × 75.4 MM",
        1320,
        622,
      ),
      partIndex(
        2050,
        690,
        5,
        "TRAY",
        "110.32 × 65 MM",
        1880,
        666,
      ),
      partIndex(
        2050,
        844,
        6,
        "DRIVE AXIS",
        "2 × NEMA17 / 165.5 MM",
        1370,
        842,
      ),
      partIndex(
        2050,
        972,
        7,
        "EDGE SENSING",
        "2 × MOUNT + APDS9960",
        1590,
        1022,
      ),
      partIndex(
        2050,
        1122,
        8,
        "VACUUM PATH",
        "204 MM SCOOP / FAN / MOSFET",
        1260,
        1180,
      ),
    ].join(""),
  );

  const content = [
    rect(0, 0, WIDTH, HEIGHT, { fill: "url(#datum-grid)", opacity: 0.28 }),
    legend,
    datumPanel,
    group(hardwareCore({ detail: "full" }), {
      transform: "translate(520 14) scale(0.92)",
    }),
    indexed,
    text(2310, 1290, "DOCUMENTED SYSTEM / PLATE H-01", {
      className: "mono tiny",
      textAnchor: "end",
    }),
  ].join("");

  return svgDocument({ title, description, content, background: palette.bgGreen });
}

function stackPlane({
  y,
  title,
  subtitle,
  accent = false,
  children = "",
  opacity = 1,
}) {
  return group(
    [
      isoBox(170, y, 1080, 230, 48, {
        top: accent ? "#24251c" : palette.surface,
        front: accent ? "#1d1e17" : palette.panel,
        side: palette.ink,
        stroke: accent ? palette.accentDark : palette.line,
        strokeWidth: 2.5,
        opacity,
      }),
      text(210, y + 31, title, {
        className: "mono",
        fill: accent ? palette.accent : palette.fg,
        "font-size": 22,
        "font-weight": 650,
        "letter-spacing": ".11em",
      }),
      text(505, y + 31, subtitle, {
        className: "mono",
        fill: palette.muted,
        "font-size": 13,
        "letter-spacing": ".08em",
      }),
      children,
    ].join(""),
  );
}

function nodeBox(x, y, width, label, detail, { active = false } = {}) {
  return group(
    [
      rect(x, y, width, 65, {
        fill: active ? palette.accent : palette.bg,
        stroke: active ? palette.accent : palette.line,
        strokeWidth: 1.5,
        vectorEffect: "non-scaling-stroke",
      }),
      text(x + 15, y + 25, label, {
        className: "mono",
        fill: active ? palette.ink : palette.fg,
        "font-size": 14,
        "font-weight": 650,
        "letter-spacing": ".07em",
      }),
      text(x + 15, y + 47, detail, {
        className: "mono",
        fill: active ? palette.ink : palette.muted,
        "font-size": 11,
        "letter-spacing": ".05em",
      }),
    ].join(""),
  );
}

function softwareCore({ detail = "full" } = {}) {
  const ys = {
    sense: 110,
    stabilize: 320,
    control: 530,
    plan: 740,
    execute: 950,
  };
  const full = detail === "full";

  const senseNodes = full
    ? group(
        [
          nodeBox(650, ys.sense - 91, 172, "EDGE APDS9960", "LEFT + RIGHT"),
          nodeBox(842, ys.sense - 91, 162, "GESTURE APDS", "START / STOP"),
          nodeBox(1024, ys.sense - 91, 184, "STEP COUNTS", "LEFT + RIGHT"),
          ...[736, 923, 1116].map((x) =>
            line(x, ys.sense - 25, x, ys.sense + 2, {
              className: "axis",
              markerEnd: "url(#arrow-accent)",
            }),
          ),
        ].join(""),
      )
    : group(
        [
          nodeBox(722, ys.sense - 78, 218, "APDS9960 ×3", "EDGE + GESTURE"),
          nodeBox(964, ys.sense - 78, 216, "STEP COUNTS", "LEFT + RIGHT"),
        ].join(""),
      );

  const stabilizeNodes = full
    ? group(
        [
          nodeBox(
            548,
            ys.stabilize - 91,
            205,
            "_FILTER_SENSOR()",
            "EWMA / HYSTERESIS",
          ),
          nodeBox(773, ys.stabilize - 91, 211, "FAST DEBOUNCE", "BOUNDARY RESPONSE"),
          nodeBox(
            1004,
            ys.stabilize - 91,
            222,
            "SIMPLEODOMETRY",
            "MIDPOINT INTEGRATION",
          ),
          nodeBox(
            696,
            ys.stabilize + 69,
            266,
            "WORLD PROJECTION",
            "SENSOR OFFSETS > X,Y",
          ),
        ].join(""),
      )
    : group(
        [
          nodeBox(690, ys.stabilize - 78, 246, "FILTER + DEBOUNCE", "HYSTERESIS"),
          nodeBox(
            960,
            ys.stabilize - 78,
            244,
            "ODOMETRY + WORLD",
            "MIDPOINT + PROJECT",
          ),
        ].join(""),
      );

  const stateX = [485, 690, 945, 1138];
  const stateLabels = [
    ["WAIT_START", "GESTURE GATE"],
    ["BOUNDARY_DISCOVERY", "EDGE POINTS"],
    ["COVERAGE", "ORIENTED WAYPOINTS"],
    ["DONE", "SAFE SHUTDOWN"],
  ];
  const controlNodes = group(
    [
      ...stateLabels.map(([label, sub], index) =>
        nodeBox(
          stateX[index],
          ys.control - 88,
          index === 1 ? 235 : index === 2 ? 175 : 178,
          label,
          sub,
          { active: index === 1 },
        ),
      ),
      ...[0, 1, 2].map((index) =>
        line(
          stateX[index] + (index === 1 ? 235 : index === 2 ? 175 : 178),
          ys.control - 55,
          stateX[index + 1] - 12,
          ys.control - 55,
          { className: "axis", markerEnd: "url(#arrow-accent)" },
        ),
      ),
    ].join(""),
  );

  const planNodes = full
    ? group(
        [
          nodeBox(
            470,
            ys.plan - 90,
            225,
            "RECTANGLEFIT.FIT()",
            "RANSAC + SVD REFIT",
          ),
          nodeBox(715, ys.plan - 90, 206, "ORTHOGONAL RECT", "SCORED 4-LINE FIT"),
          nodeBox(
            941,
            ys.plan - 90,
            234,
            "GET_INSET_RECTANGLE()",
            "GEOMETRY SAFE OFFSET",
          ),
          nodeBox(607, ys.plan + 68, 226, "BUILD_LANES()", "4 START VARIANTS"),
          nodeBox(
            853,
            ys.plan + 68,
            236,
            "ORIENTATION WAYPOINTS",
            "FINAL PERIMETER",
          ),
        ].join(""),
      )
    : group(
        [
          nodeBox(690, ys.plan - 78, 246, "RECTANGLE FIT", "RANSAC + SVD"),
          nodeBox(960, ys.plan - 78, 244, "INSET + LANES", "WAYPOINTS + PERIMETER"),
        ].join(""),
      );

  const executeNodes = full
    ? group(
        [
          nodeBox(470, ys.execute - 90, 222, "STEPPERDRIVE", "COMMAND + UPDATE(DT)", {
            active: true,
          }),
          nodeBox(712, ys.execute - 90, 188, "VACUUM PWM", "25 KHZ / DUTY 0.8"),
          nodeBox(920, ys.execute - 90, 186, "SWEPTMAP", "5 MM RASTER"),
          nodeBox(1126, ys.execute - 90, 166, "TELEMETRY", "CSV ROWS"),
          nodeBox(850, ys.execute + 67, 196, "VISUALIZER", "OPTIONAL / 5 HZ"),
          rect(1070, ys.execute + 70, 185, 60, {
            fill: "url(#raster-grid)",
            stroke: palette.accentDark,
            strokeWidth: 1.5,
            vectorEffect: "non-scaling-stroke",
          }),
          path(
            `M 1084 ${ys.execute + 111} L 1114 ${ys.execute + 91} L 1144 ${
              ys.execute + 111
            } L 1174 ${ys.execute + 91} L 1204 ${
              ys.execute + 111
            } L 1234 ${ys.execute + 91}`,
            {
              className: "axis",
              strokeWidth: 3,
            },
          ),
        ].join(""),
      )
    : group(
        [
          nodeBox(626, ys.execute - 78, 236, "STEPPERDRIVE", "COMMAND + UPDATE", {
            active: true,
          }),
          nodeBox(886, ys.execute - 78, 204, "VACUUM + MAP", "PWM + 5 MM"),
          nodeBox(1114, ys.execute - 78, 162, "TELEMETRY", "EVIDENCE"),
        ].join(""),
      );

  const pulseLayer = full
    ? group(
        [
          rect(468, 1164, 824, 105, {
            fill: palette.ink,
            stroke: palette.accent,
            strokeWidth: 2,
            vectorEffect: "non-scaling-stroke",
          }),
          text(500, 1202, "STEPPERDRIVE PULSE THREAD", {
            className: "mono",
            fill: palette.accent,
            "font-size": 17,
            "font-weight": 650,
            "letter-spacing": ".1em",
          }),
          text(500, 1234, "HARDWARE TIMING BOUNDARY", {
            className: "mono tiny",
          }),
          text(836, 1202, "1/16 MICROSTEP", {
            className: "mono micro",
          }),
          text(836, 1234, "10 μS STEP / ≤ 10 KHZ", {
            className: "mono micro",
          }),
          path(
            `M 1120 1242 v -20 h 18 v -22 h 18 v 22 h 18 v -22 h 18 v 42`,
            {
              className: "axis",
              strokeWidth: 3,
            },
          ),
          line(582, ys.execute - 25, 582, 1162, {
            className: "axis",
            markerEnd: "url(#arrow-accent)",
          }),
        ].join(""),
      )
    : "";

  const spine = group(
    [
      line(105, 88, 105, 1038, {
        className: "axis",
        strokeWidth: 4,
        markerEnd: "url(#arrow-accent)",
      }),
      ...Object.values(ys).map((y) =>
        group(
          [
            circle(105, y + 3, 10, {
              fill: palette.accent,
              stroke: palette.ink,
              strokeWidth: 2,
              vectorEffect: "non-scaling-stroke",
            }),
            line(115, y + 3, 166, y + 3, {
              className: "axis",
              markerEnd: "url(#arrow-accent)",
            }),
          ].join(""),
        ),
      ),
      text(70, 560, "50 HZ / 20 MS", {
        className: "mono",
        fill: palette.accent,
        "font-size": 17,
        "font-weight": 650,
        "letter-spacing": ".12em",
        transform: "rotate(-90 70 560)",
        textAnchor: "middle",
      }),
      text(33, 560, "SYNCHRONOUS SUPERVISORY LOOP", {
        className: "mono tiny",
        transform: "rotate(-90 33 560)",
        textAnchor: "middle",
      }),
    ].join(""),
  );

  const optionalImu = full
    ? group(
        [
          path(
            `M 1434 88 H 1542 V ${ys.stabilize - 58} H 1434`,
            {
              className: "axis-dash",
              markerEnd: "url(#arrow-accent)",
            },
          ),
          rect(1542, 84, 250, 142, {
            fill: palette.panel,
            stroke: palette.accentDark,
            strokeWidth: 1.5,
            strokeDasharray: "9 8",
            vectorEffect: "non-scaling-stroke",
          }),
          text(1572, 122, "OPTIONAL / --imu", {
            className: "mono micro accent-text",
          }),
          text(1572, 159, "MPU6050", { className: "mono micro" }),
          text(1572, 190, "EKFFUSION", { className: "mono micro" }),
          text(1572, 221, "NOT DEFAULT", { className: "mono tiny" }),
        ].join(""),
      )
    : "";

  const odomFeedback = full
    ? group(
        [
          path(
            `M 692 ${ys.execute - 12} H 1380 V ${ys.stabilize - 56} H 1236`,
            {
              className: "axis-dash",
              markerEnd: "url(#arrow-accent)",
            },
          ),
          text(1404, 650, "dSL / dSR", {
            className: "mono tiny accent-text",
            transform: "rotate(-90 1404 650)",
            textAnchor: "middle",
          }),
        ].join(""),
      )
    : "";

  return group(
    [
      spine,
      stackPlane({
        y: ys.sense,
        title: "SENSE",
        subtitle: "PHYSICAL INPUTS",
        children: senseNodes,
      }),
      stackPlane({
        y: ys.stabilize,
        title: "STABILIZE",
        subtitle: "QUALIFIED SIGNAL + POSE",
        children: stabilizeNodes,
      }),
      stackPlane({
        y: ys.control,
        title: "CONTROL STATE",
        subtitle: "MAIN.PY RUNTIME PATH",
        accent: true,
        children: controlNodes,
      }),
      stackPlane({
        y: ys.plan,
        title: "INFER + PLAN",
        subtitle: "TABLE GEOMETRY + ROUTE",
        children: planNodes,
      }),
      stackPlane({
        y: ys.execute,
        title: "EXECUTE + EVIDENCE",
        subtitle: "ACTUATION + OBSERVABILITY",
        children: executeNodes,
      }),
      pulseLayer,
      optionalImu,
      odomFeedback,
    ].join(""),
    { "data-master": "software" },
  );
}

function softwareMaster() {
  const title = "Deskinator executable software stack";
  const description =
    "A layered software diagram showing sensing, stabilization, the four main controller states, rectangle fitting and coverage planning, execution and evidence, the synchronous 50 hertz supervisory loop, and the separate StepperDrive pulse thread.";

  const content = [
    rect(690, 90, 1610, 1160, {
      fill: "url(#datum-grid)",
      opacity: 0.24,
    }),
    group(softwareCore({ detail: "full" }), {
      transform: "translate(690 34) scale(0.94)",
    }),
    rect(0, 0, 1050, HEIGHT, { fill: "url(#left-fade)" }),
    group(
      [
        text(2312, 84, "SOFTWARE / EXPLODED", {
          className: "mono micro",
          textAnchor: "end",
        }),
        text(2312, 112, "EXECUTABLE DEFAULT PATH", {
          className: "mono tiny",
          textAnchor: "end",
        }),
        text(2312, 1280, "2400 × 1350 / SYSTEM MASTER", {
          className: "mono tiny",
          textAnchor: "end",
        }),
      ].join(""),
    ),
  ].join("");

  return svgDocument({ title, description, content, background: palette.bgGreen });
}

function coverChrome(label, descriptor) {
  return group(
    [
      text(86, 84, "DESKINATOR / ROBOTICS SYSTEM", {
        className: "mono micro accent-text",
      }),
      line(86, 112, 334, 112, { className: "axis" }),
      text(2312, 84, label, {
        className: "mono micro",
        textAnchor: "end",
      }),
      text(2312, 112, descriptor, {
        className: "mono tiny",
        textAnchor: "end",
      }),
      text(2312, 1280, "2400 × 1350 / SYSTEM MASTER", {
        className: "mono tiny",
        textAnchor: "end",
      }),
    ].join(""),
  );
}

function coverA() {
  const title = "Deskinator documented hardware explosion";
  const description =
    "A hardware-led exploded CAD composition showing documented mechanical geometry, schematic electronic volumes, and known separation axes without claiming unknown internal mounts.";

  const ledger = group(
    [
      rect(86, 244, 548, 500, {
        fill: palette.panel,
        stroke: palette.line,
        strokeWidth: 1.5,
        vectorEffect: "non-scaling-stroke",
      }),
      text(118, 286, "DOCUMENTED SYSTEM EXPLOSION", {
        className: "mono micro accent-text",
      }),
      text(118, 326, "CAD-DERIVED GEOMETRY", {
        className: "mono tiny",
      }),
      text(118, 350, "SCHEMATIC ELECTRONIC VOLUMES", {
        className: "mono tiny",
      }),
      line(118, 372, 602, 372, { className: "fine" }),
      ...[
        ["BODY ENVELOPE", "200 × 220 × 75.4 MM"],
        ["WHEEL AXIS", "165.5 MM"],
        ["EDGE SENSOR DATUM", "+216.55 / ±119.84 MM"],
        ["VACUUM SYSTEM", "204 MM SCOOP / R40"],
        ["REMOVABLE TRAY", "110.32 × 65 MM"],
      ].map(([label, value], index) => {
        const y = 412 + index * 58;
        return group(
          [
            text(118, y, label, { className: "mono tiny" }),
            text(602, y, value, {
              className: "mono micro",
              textAnchor: "end",
            }),
          ].join(""),
        );
      }),
      line(118, 686, 602, 686, { className: "fine" }),
      text(118, 718, "NO UNKNOWN MOUNTING CLAIMS", {
        className: "mono tiny accent-text",
      }),
    ].join(""),
  );

  const content = [
    rect(700, 100, 1600, 1150, {
      fill: "url(#datum-grid)",
      opacity: 0.28,
    }),
    ledger,
    group(hardwareCore({ detail: "full" }), {
      transform: "translate(700 16) scale(0.95)",
    }),
    coverChrome("HARDWARE / EXPLODED", "DOCUMENTED SYSTEM VIEW"),
  ].join("");

  return svgDocument({ title, description, content, background: palette.bgGreen });
}

function coverB() {
  const title = "Deskinator cover option B, Matter Logic";
  const description =
    "An interlocked full-stack composition where the documented hardware explosion transitions into the current synchronous software planes and lower pulse timing layer.";

  const software = group(softwareCore({ detail: "compact" }), {
    transform: "translate(1130 18) scale(0.65)",
    opacity: 0.82,
  });
  const hardware = group(hardwareCore({ detail: "cover" }), {
    transform: "translate(980 450) scale(0.66)",
  });

  const bridge = group(
    [
      path(
        "M 1510 374 C 1410 488 1408 610 1500 704 C 1570 778 1550 908 1504 1030",
        {
          className: "axis",
          strokeWidth: 4,
          markerEnd: "url(#arrow-accent)",
        },
      ),
      text(1388, 610, "20 MS", {
        className: "mono micro accent-text",
        transform: "rotate(-90 1388 610)",
        textAnchor: "middle",
      }),
      rect(1442, 676, 130, 30, {
        fill: palette.accent,
        stroke: palette.ink,
        strokeWidth: 2,
        vectorEffect: "non-scaling-stroke",
      }),
      text(1507, 696, "MATTER > LOGIC", {
        className: "mono",
        fill: palette.ink,
        "font-size": 11,
        "font-weight": 700,
        "letter-spacing": ".08em",
        textAnchor: "middle",
      }),
    ].join(""),
  );

  const content = [
    rect(1010, 100, 1290, 1135, {
      fill: "url(#datum-grid)",
      opacity: 0.23,
    }),
    software,
    hardware,
    bridge,
    rect(0, 0, 1110, HEIGHT, { fill: "url(#left-fade)" }),
    coverChrome("MATTER / LOGIC", "HARDWARE + SOFTWARE INTERLOCK"),
  ].join("");

  return svgDocument({ title, description, content, background: palette.bgGreen });
}

function orthographicRobot(x, y, scale = 1) {
  const front = group(
    [
      rect(x, y, 300, 205, {
        fill: palette.warmFront,
        stroke: palette.ink,
        strokeWidth: 3,
        vectorEffect: "non-scaling-stroke",
      }),
      sensorMount(x - 42, y + 224, 1),
      sensorMount(x + 172, y + 224, -1),
      ellipse(x + 65, y + 224, 38, 24, {
        fill: palette.ink,
        stroke: palette.warmFront,
        strokeWidth: 2,
        vectorEffect: "non-scaling-stroke",
      }),
      ellipse(x + 235, y + 224, 38, 24, {
        fill: palette.ink,
        stroke: palette.warmFront,
        strokeWidth: 2,
        vectorEffect: "non-scaling-stroke",
      }),
      line(x, y - 30, x + 300, y - 30, {
        className: "muted-line",
        markerStart: "url(#arrow-muted)",
        markerEnd: "url(#arrow-muted)",
      }),
      text(x + 150, y - 43, "200 MM", {
        className: "mono dim",
        textAnchor: "middle",
      }),
      text(x + 150, y + 344, "FRONT DATUM", {
        className: "mono tiny",
        textAnchor: "middle",
      }),
    ].join(""),
  );

  return group(front, { transform: `scale(${scale})` });
}

function coverageFootprint(x, y, width, height) {
  const lanes = [];
  const laneCount = 7;
  for (let index = 0; index < laneCount; index += 1) {
    const laneY = y + 34 + index * 35;
    if (index % 2 === 0) {
      lanes.push(
        polyline(
          [
            [x + 38, laneY],
            [x + width - 38, laneY],
            [x + width - 22, laneY + 17],
          ],
          { className: "axis" },
        ),
      );
    } else {
      lanes.push(
        polyline(
          [
            [x + width - 38, laneY],
            [x + 38, laneY],
            [x + 22, laneY + 17],
          ],
          { className: "axis" },
        ),
      );
    }
  }

  return group(
    [
      rect(x, y, width, height, {
        fill: palette.panel,
        stroke: palette.warmFront,
        strokeWidth: 2,
        vectorEffect: "non-scaling-stroke",
      }),
      rect(x + 18, y + 18, width - 36, height - 36, {
        fill: "url(#raster-grid)",
        stroke: palette.line,
        strokeWidth: 1.5,
        vectorEffect: "non-scaling-stroke",
      }),
      ...lanes,
      text(x + 18, y - 18, "COVERAGE FOOTPRINT", {
        className: "mono micro accent-text",
      }),
      text(x + width, y + height + 27, "5 MM RASTER / 20 MM OVERLAP", {
        className: "mono tiny",
        textAnchor: "end",
      }),
    ].join(""),
  );
}

function coverC() {
  const title = "Deskinator cover option C, System Atlas";
  const description =
    "An editorial technical atlas combining a compact exploded robot, an orthographic datum view, documented dimensions, the four controller states, and a coverage footprint.";

  const stateSpine = group(
    [
      text(1260, 736, "RUNTIME STATE", {
        className: "mono micro accent-text",
      }),
      ...[
        ["WAIT_START", 786],
        ["BOUNDARY_DISCOVERY", 850],
        ["COVERAGE", 914],
        ["DONE", 978],
      ].map(([label, y], index) =>
        group(
          [
            circle(1270, y - 6, 8, {
              fill: index === 1 ? palette.accent : palette.surface,
              stroke: palette.accent,
              strokeWidth: 2,
              vectorEffect: "non-scaling-stroke",
            }),
            index < 3
              ? line(1270, y + 4, 1270, y + 48, {
                  className: "axis",
                  markerEnd: "url(#arrow-accent)",
                })
              : "",
            text(1302, y, label, {
              className: "mono micro",
              fill: index === 1 ? palette.accent : palette.fg,
            }),
          ].join(""),
        ),
      ),
      text(1260, 1044, "50 HZ / 20 MS", {
        className: "mono tiny accent-text",
      }),
    ].join(""),
  );

  const ledger = group(
    [
      rect(1605, 762, 480, 330, {
        fill: palette.panel,
        stroke: palette.line,
        strokeWidth: 1.5,
        vectorEffect: "non-scaling-stroke",
      }),
      text(1639, 806, "DOCUMENTED DATUM", {
        className: "mono micro accent-text",
      }),
      ...[
        ["BODY", "200 × 220 × 75.4 MM"],
        ["WHEEL AXIS", "165.5 MM"],
        ["EDGE SENSORS", "+216.55 / ±119.84 MM"],
        ["SCOOP", "204 MM / R40"],
        ["VACUUM", "200 × 140 MM"],
        ["LANE OVERLAP", "20 MM"],
      ].map(([label, value], index) => {
        const y = 852 + index * 39;
        return group(
          [
            text(1639, y, label, { className: "mono tiny" }),
            text(2048, y, value, {
              className: "mono micro",
              textAnchor: "end",
            }),
          ].join(""),
        );
      }),
    ].join(""),
    { transform: "translate(0 90)" },
  );

  const content = [
    rect(1030, 118, 1260, 1010, {
      fill: "url(#datum-grid)",
      opacity: 0.26,
    }),
    group(hardwareCore({ detail: "cover" }), {
      transform: "translate(1340 -12) scale(0.47)",
    }),
    orthographicRobot(1850, 930, 0.58),
    coverageFootprint(1530, 520, 500, 270),
    stateSpine,
    ledger,
    rect(0, 0, 1110, HEIGHT, { fill: "url(#left-fade)" }),
    coverChrome("SYSTEM / ATLAS", "DATUM + STATE + COVERAGE"),
  ].join("");

  return svgDocument({ title, description, content, background: palette.bgGreen });
}

const outputs = [
  ["deskinator-hardware-exploded.svg", hardwareMaster()],
  ["deskinator-software-exploded.svg", softwareMaster()],
  ["deskinator-cover-a-exploded.svg", coverA()],
  ["deskinator-cover-b-matter-logic.svg", coverB()],
  ["deskinator-cover-c-system-atlas.svg", coverC()],
];

await mkdir(OUTPUT_DIR, { recursive: true });
await Promise.all(
  outputs.map(([filename, content]) =>
    writeFile(new URL(filename, `file://${OUTPUT_DIR}/`), content, "utf8"),
  ),
);

for (const [filename] of outputs) {
  console.log(`generated ${filename}`);
}

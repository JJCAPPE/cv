import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  circle,
  group,
  isoPlate,
  line,
  multilineText,
  path,
  rect,
  svgDocument,
  text,
  wrapWords,
} from "./svg-kit.mjs";

const WIDTH = 2400;
const HEIGHT = 1350;

const palette = {
  bg: "#0b0b0a",
  panel: "#161614",
  surface: "#1d1d1a",
  surface2: "#292923",
  line: "#4b4a41",
  lineSoft: "#34342e",
  fg: "#f1efe8",
  muted: "#aaa79f",
  subtle: "#77746d",
  accent: "#e6d12a",
  accentDark: "#8f8214",
  ink: "#11110f",
  faceTop: "#ece8dc",
  faceFront: "#c9c3b5",
  faceSide: "#a9a395",
};

/*
 * Replace this configuration from the project's truth ledger.
 * Set PLACEHOLDER_MODE to false before production use.
 */
const PLACEHOLDER_MODE = true;

const SYSTEM = {
  project: "PROJECT NAME",
  descriptor: "SOURCE-GROUNDED SOFTWARE / ML SYSTEM",
  cadence: "REPLACE WITH VERIFIED RUNTIME OR ARTIFACT BOUNDARY",
  layers: [
    {
      id: "input",
      index: "01",
      title: "DOCUMENTED INPUT",
      detail: "replace with source boundary",
      source: "REPLACE WITH path: symbol or artifact",
      nodes: ["SOURCE A", "SOURCE B"],
    },
    {
      id: "transform",
      index: "02",
      title: "VERIFIED TRANSFORM",
      detail: "replace with actual preprocessing",
      source: "REPLACE WITH path: symbol or artifact",
      nodes: ["VALIDATE", "NORMALIZE"],
    },
    {
      id: "state",
      index: "03",
      title: "STATE / ORCHESTRATION",
      detail: "replace with implemented control boundary",
      source: "REPLACE WITH path: symbol or artifact",
      nodes: ["STATE", "POLICY"],
    },
    {
      id: "compute",
      index: "04",
      title: "INFER / COMPUTE",
      detail: "replace with current model or algorithm",
      source: "REPLACE WITH path: symbol or artifact",
      nodes: ["MODEL", "DECISION"],
    },
    {
      id: "output",
      index: "05",
      title: "OUTPUT / EVIDENCE",
      detail: "replace with persisted or observed result",
      source: "REPLACE WITH path: symbol or artifact",
      nodes: ["OUTPUT", "TELEMETRY"],
    },
  ],
  optional: {
    label: "OPTIONAL / OFFLINE",
    detail: "replace or remove",
    source: "REPLACE WITH path: symbol or artifact",
  },
  facts: [
    {
      label: "DEFAULT PATH",
      value: "REPLACE WITH VERIFIED FLOW",
      source: "REPLACE WITH path: symbol or artifact",
    },
    {
      label: "RUNTIME",
      value: "REPLACE WITH VERIFIED TIMING",
      source: "REPLACE WITH path: symbol or artifact",
    },
    {
      label: "EVIDENCE",
      value: "REPLACE WITH VERIFIED ARTIFACT",
      source: "REPLACE WITH path: symbol or artifact",
    },
  ],
};

const args = process.argv.slice(2);
const allowPlaceholders = args.includes("--allow-placeholders");
const outputArgument = args.find((value) => !value.startsWith("--"));
const outputDirectory = resolve(
  process.cwd(),
  outputArgument ?? "generated-technical-visuals",
);

function validateSystem() {
  if (PLACEHOLDER_MODE && !allowPlaceholders) {
    throw new Error(
      "Replace the starter configuration, set PLACEHOLDER_MODE to false, then regenerate. Use --allow-placeholders only to preview the starter.",
    );
  }

  if (SYSTEM.layers.length < 2 || SYSTEM.layers.length > 6) {
    throw new Error("The starter supports two to six system layers.");
  }

  const ids = new Set();
  for (const layer of SYSTEM.layers) {
    if (!layer.id || ids.has(layer.id)) {
      throw new Error(`Layer IDs must be present and unique: ${layer.id}`);
    }
    ids.add(layer.id);
    if (!layer.title || !layer.source || !layer.nodes?.length) {
      throw new Error(`Layer ${layer.id} needs a title, source, and nodes.`);
    }
  }
}

function panelLabel(x, y, index, title, detail, compact = false) {
  const titleLines = wrapWords(title, compact ? 22 : 28, 2);
  return group(
    [
      rect(x, y, 44, 44, {
        rx: 4,
        fill: palette.accent,
        stroke: palette.ink,
        strokeWidth: 2,
      }),
      text(x + 22, y + 28, index, {
        className: "mono",
        fill: palette.ink,
        fontSize: compact ? 13 : 15,
        fontWeight: 700,
        textAnchor: "middle",
      }),
      multilineText(
        x + 62,
        y + 16,
        titleLines,
        {
          className: "display",
          fill: palette.fg,
          fontSize: compact ? 17 : 21,
          fontWeight: 700,
          letterSpacing: ".06em",
        },
        compact ? 17 : 20,
      ),
      compact
        ? ""
        : text(x + 62, y + 58, detail, {
            className: "mono",
            fill: palette.muted,
            fontSize: 13,
            letterSpacing: ".04em",
          }),
    ].join(""),
  );
}

function nodeChip(x, y, width, label, active = false) {
  const lines = wrapWords(label, Math.max(9, Math.floor(width / 10)), 2);
  return group(
    [
      rect(x, y, width, 48, {
        rx: 4,
        fill: active ? palette.accent : palette.panel,
        stroke: active ? palette.ink : palette.line,
        strokeWidth: active ? 2 : 1.5,
      }),
      multilineText(
        x + 14,
        y + (lines.length === 1 ? 30 : 20),
        lines,
        {
          className: "mono",
          fill: active ? palette.ink : palette.fg,
          fontSize: 13,
          fontWeight: active ? 700 : 500,
          letterSpacing: ".05em",
        },
        15,
      ),
    ].join(""),
  );
}

function layerPlate(layer, x, y, width, compact = false, active = false) {
  const skew = compact ? 58 : 82;
  const height = compact ? 78 : 104;
  const labelX = x + (compact ? 42 : 58);
  const labelY = y + (compact ? 20 : 24);
  const nodeStart = x + (compact ? 405 : 520);
  const nodeArea = width - (compact ? 445 : 570);
  const gap = compact ? 12 : 16;
  const nodeWidth = Math.max(
    112,
    (nodeArea - gap * (layer.nodes.length - 1)) / layer.nodes.length,
  );

  const nodes = layer.nodes
    .slice(0, 4)
    .map((label, index) =>
      nodeChip(
        nodeStart + index * (nodeWidth + gap),
        y + (compact ? 22 : 34),
        nodeWidth,
        label,
        active && index === 0,
      ),
    )
    .join("");

  return group(
    [
      isoPlate({
        x,
        y,
        width,
        height,
        skew,
        thickness: compact ? 11 : 15,
        top: active ? palette.surface2 : palette.surface,
        front: palette.panel,
        side: active ? palette.accentDark : palette.surface2,
        stroke: palette.ink,
      }),
      panelLabel(
        labelX,
        labelY,
        layer.index,
        layer.title,
        layer.detail,
        compact,
      ),
      nodes,
    ].join(""),
  );
}

function explodedStack({
  x,
  y,
  width,
  gap,
  compact = false,
  activeLayer = 3,
}) {
  const layers = SYSTEM.layers
    .map((layer, index) =>
      layerPlate(
        layer,
        x,
        y + index * gap,
        width,
        compact,
        index === activeLayer,
      ),
    )
    .join("");

  const spineX = x + width + (compact ? 92 : 126);
  const firstY = y + (compact ? 38 : 52);
  const lastY =
    y + (SYSTEM.layers.length - 1) * gap + (compact ? 38 : 52);
  const markers = SYSTEM.layers
    .map((_, index) =>
      circle(spineX, y + index * gap + (compact ? 38 : 52), 7, {
        fill: index <= activeLayer ? palette.accent : palette.panel,
        stroke: palette.accent,
        strokeWidth: 2,
      }),
    )
    .join("");

  return group(
    [
      layers,
      line(spineX, firstY, spineX, lastY, {
        className: "active-line",
        markerEnd: "url(#arrow-active)",
      }),
      markers,
    ].join(""),
  );
}

function optionalBranch(x, y, width = 420) {
  return group(
    [
      path(`M ${x} ${y} C ${x + 80} ${y}, ${x + 80} ${y + 92}, ${x + 160} ${y + 92}`, {
        className: "optional-line",
        markerEnd: "url(#arrow-muted)",
      }),
      rect(x + 174, y + 58, width, 70, {
        rx: 4,
        fill: palette.panel,
        stroke: palette.line,
        strokeWidth: 1.5,
      }),
      text(x + 194, y + 84, SYSTEM.optional.label, {
        className: "mono",
        fill: palette.fg,
        fontSize: 14,
        fontWeight: 700,
        letterSpacing: ".08em",
      }),
      text(x + 194, y + 108, SYSTEM.optional.detail, {
        className: "mono",
        fill: palette.muted,
        fontSize: 12,
      }),
    ].join(""),
  );
}

function header(kicker, title, subtitle) {
  return group(
    [
      text(96, 86, kicker, {
        className: "mono",
        fill: palette.accent,
        fontSize: 15,
        fontWeight: 700,
        letterSpacing: ".14em",
      }),
      text(96, 142, title, {
        className: "display",
        fill: palette.fg,
        fontSize: 48,
        fontWeight: 700,
        letterSpacing: ".045em",
      }),
      text(98, 180, subtitle, {
        className: "mono",
        fill: palette.muted,
        fontSize: 15,
        letterSpacing: ".06em",
      }),
    ].join(""),
  );
}

function edgeCoordinates(label) {
  return group(
    [
      line(72, 56, 72, 1274, { className: "fine-soft" }),
      line(56, 1260, 2328, 1260, { className: "fine-soft" }),
      text(86, 1238, label, {
        className: "mono",
        fill: palette.subtle,
        fontSize: 12,
        letterSpacing: ".12em",
      }),
      text(2308, 1238, "X", {
        className: "mono",
        fill: palette.accent,
        fontSize: 12,
      }),
      text(52, 78, "Y", {
        className: "mono",
        fill: palette.accent,
        fontSize: 12,
      }),
    ].join(""),
  );
}

function masterContent() {
  return [
    header("SYSTEM MASTER / VERIFIED PATH", SYSTEM.project, SYSTEM.descriptor),
    explodedStack({
      x: 270,
      y: 235,
      width: 1650,
      gap: 182,
      compact: false,
      activeLayer: Math.min(3, SYSTEM.layers.length - 1),
    }),
    optionalBranch(360, 1110, 470),
    text(1650, 1212, SYSTEM.cadence, {
      className: "mono",
      fill: palette.muted,
      fontSize: 14,
      textAnchor: "end",
      letterSpacing: ".06em",
    }),
    edgeCoordinates("MASTER / EXPLODED EXECUTION STACK"),
  ].join("");
}

function coverChrome(code, title) {
  return group(
    [
      text(96, 86, `COVER ${code}`, {
        className: "mono",
        fill: palette.accent,
        fontSize: 15,
        fontWeight: 700,
        letterSpacing: ".16em",
      }),
      text(96, 1260, title, {
        className: "mono",
        fill: palette.muted,
        fontSize: 13,
        letterSpacing: ".12em",
      }),
      line(96, 118, 430, 118, { className: "fine" }),
    ].join(""),
  );
}

function coverAContent() {
  return [
    coverChrome("A / STACK", "EXPLODED SYSTEM / COPY-SAFE LEFT"),
    explodedStack({
      x: 1030,
      y: 226,
      width: 1030,
      gap: 175,
      compact: true,
      activeLayer: Math.min(3, SYSTEM.layers.length - 1),
    }),
    optionalBranch(1250, 1110, 330),
    edgeCoordinates("A / ASSEMBLY"),
  ].join("");
}

function flowCard(layer, x, y, side, active) {
  const width = 430;
  const cardX = side === "left" ? x - width - 74 : x + 74;
  const lineEnd = side === "left" ? cardX + width : cardX;
  return group(
    [
      line(x, y + 43, lineEnd, y + 43, {
        stroke: active ? palette.accent : palette.line,
        strokeWidth: active ? 2.5 : 1.5,
        vectorEffect: "non-scaling-stroke",
      }),
      rect(cardX, y, width, 86, {
        rx: 5,
        fill: active ? palette.surface2 : palette.panel,
        stroke: active ? palette.accent : palette.line,
        strokeWidth: active ? 2 : 1.5,
      }),
      text(cardX + 20, y + 30, `${layer.index} / ${layer.title}`, {
        className: "display",
        fill: palette.fg,
        fontSize: 18,
        fontWeight: 700,
        letterSpacing: ".05em",
      }),
      text(cardX + 20, y + 58, layer.nodes.slice(0, 2).join(" · "), {
        className: "mono",
        fill: active ? palette.accent : palette.muted,
        fontSize: 12,
        letterSpacing: ".04em",
      }),
    ].join(""),
  );
}

function coverBContent() {
  const spineX = 1650;
  const startY = 250;
  const step = 190;
  const active = Math.min(3, SYSTEM.layers.length - 1);
  const cards = SYSTEM.layers
    .map((layer, index) =>
      flowCard(
        layer,
        spineX,
        startY + index * step,
        index % 2 === 0 ? "left" : "right",
        index === active,
      ),
    )
    .join("");
  const dots = SYSTEM.layers
    .map((_, index) =>
      circle(spineX, startY + index * step + 43, 9, {
        fill: index <= active ? palette.accent : palette.panel,
        stroke: palette.accent,
        strokeWidth: 2,
      }),
    )
    .join("");

  return [
    coverChrome("B / FLOW", "DATA-TO-DECISION SPINE / COPY-SAFE LEFT"),
    line(
      spineX,
      startY + 43,
      spineX,
      startY + (SYSTEM.layers.length - 1) * step + 43,
      {
        className: "active-line",
        markerEnd: "url(#arrow-active)",
      },
    ),
    cards,
    dots,
    optionalBranch(1680, 1068, 330),
    edgeCoordinates("B / LOGIC"),
  ].join("");
}

function ledgerRows(x, y, width) {
  return SYSTEM.facts
    .slice(0, 4)
    .map((fact, index) => {
      const rowY = y + index * 88;
      return group(
        [
          line(x, rowY, x + width, rowY, { className: "fine-soft" }),
          text(x, rowY + 28, fact.label, {
            className: "mono",
            fill: palette.accent,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: ".1em",
          }),
          multilineText(
            x,
            rowY + 54,
            wrapWords(fact.value, 40, 2),
            {
              className: "mono",
              fill: palette.fg,
              fontSize: 13,
            },
            16,
          ),
        ].join(""),
      );
    })
    .join("");
}

function coverCContent() {
  return [
    coverChrome("C / ATLAS", "SYSTEM + EVIDENCE LEDGER / COPY-SAFE LEFT"),
    explodedStack({
      x: 1170,
      y: 170,
      width: 830,
      gap: 132,
      compact: true,
      activeLayer: Math.min(3, SYSTEM.layers.length - 1),
    }),
    rect(1050, 900, 1030, 320, {
      rx: 5,
      fill: palette.panel,
      stroke: palette.line,
      strokeWidth: 1.5,
    }),
    text(1090, 948, "VERIFIED SYSTEM LEDGER", {
      className: "display",
      fill: palette.fg,
      fontSize: 22,
      fontWeight: 700,
      letterSpacing: ".08em",
    }),
    ledgerRows(1090, 974, 940),
    edgeCoordinates("C / EVIDENCE"),
  ].join("");
}

function document(id, title, description, content) {
  return svgDocument({
    id,
    title,
    description,
    content,
    palette,
    width: WIDTH,
    height: HEIGHT,
  });
}

const outputs = [
  [
    "technical-system-master.svg",
    document(
      "technical-system-master",
      `${SYSTEM.project} system master`,
      "Source-grounded exploded execution stack with verified default and optional system paths.",
      masterContent(),
    ),
  ],
  [
    "technical-cover-a-stack.svg",
    document(
      "technical-cover-a-stack",
      `${SYSTEM.project} cover A`,
      "Exploded stack cover with a copy-safe region on the left.",
      coverAContent(),
    ),
  ],
  [
    "technical-cover-b-flow.svg",
    document(
      "technical-cover-b-flow",
      `${SYSTEM.project} cover B`,
      "Data-to-decision flow cover with a copy-safe region on the left.",
      coverBContent(),
    ),
  ],
  [
    "technical-cover-c-atlas.svg",
    document(
      "technical-cover-c-atlas",
      `${SYSTEM.project} cover C`,
      "Editorial system atlas cover with a copy-safe region on the left.",
      coverCContent(),
    ),
  ],
];

validateSystem();
await mkdir(outputDirectory, { recursive: true });
await Promise.all(
  outputs.map(([name, content]) =>
    writeFile(resolve(outputDirectory, name), content, "utf8"),
  ),
);

console.log(`Wrote ${outputs.length} deterministic SVG files to ${outputDirectory}`);

const ATTRIBUTE_NAMES = {
  ariaHidden: "aria-hidden",
  className: "class",
  dominantBaseline: "dominant-baseline",
  fillOpacity: "fill-opacity",
  fontSize: "font-size",
  fontWeight: "font-weight",
  letterSpacing: "letter-spacing",
  markerEnd: "marker-end",
  patternUnits: "patternUnits",
  strokeDasharray: "stroke-dasharray",
  strokeLinecap: "stroke-linecap",
  strokeLinejoin: "stroke-linejoin",
  strokeOpacity: "stroke-opacity",
  strokeWidth: "stroke-width",
  textAnchor: "text-anchor",
  vectorEffect: "vector-effect",
};

export function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function attributes(values = {}) {
  return Object.entries(values)
    .filter(([, value]) => value !== undefined && value !== null && value !== false)
    .map(([key, value]) => {
      const name = ATTRIBUTE_NAMES[key] ?? key;
      return `${name}="${escapeXml(value)}"`;
    })
    .join(" ");
}

export function element(name, values = {}, children = "") {
  const rendered = attributes(values);
  return `<${name}${rendered ? ` ${rendered}` : ""}>${children}</${name}>`;
}

export function empty(name, values = {}) {
  const rendered = attributes(values);
  return `<${name}${rendered ? ` ${rendered}` : ""}/>`;
}

export const group = (children, values = {}) =>
  element("g", values, children);

export const rect = (x, y, width, height, values = {}) =>
  empty("rect", { x, y, width, height, ...values });

export const line = (x1, y1, x2, y2, values = {}) =>
  empty("line", { x1, y1, x2, y2, ...values });

export const path = (d, values = {}) =>
  empty("path", { d, ...values });

export const circle = (cx, cy, r, values = {}) =>
  empty("circle", { cx, cy, r, ...values });

export const text = (x, y, value, values = {}) =>
  element("text", { x, y, ...values }, escapeXml(value));

export function multilineText(
  x,
  y,
  lines,
  values = {},
  lineHeight = 24,
) {
  return element(
    "text",
    { x, y, ...values },
    lines
      .map((value, index) =>
        element(
          "tspan",
          { x, dy: index === 0 ? 0 : lineHeight },
          escapeXml(value),
        ),
      )
      .join(""),
  );
}

export function assetIds(id) {
  return {
    grid: `${id}-grid`,
    arrow: `${id}-arrow`,
    arrowDashed: `${id}-arrow-dashed`,
  };
}

function definitions(id, palette) {
  const ids = assetIds(id);
  const styles = `
    .display{font-family:"Arial Narrow","Barlow Condensed","Helvetica Neue",Arial,sans-serif;font-stretch:condensed}
    .sans{font-family:"Geist","Helvetica Neue",Arial,sans-serif}
    .mono{font-family:"Geist Mono","SFMono-Regular",Menlo,Consolas,monospace}
    .lane-title{fill:${palette.fg};font-size:36px;font-weight:700;letter-spacing:.06em}
    .node-label{fill:${palette.fg};font-size:17px;font-weight:650;letter-spacing:.055em}
    .node-detail{fill:${palette.muted};font-size:13px;letter-spacing:.045em}
    .micro{fill:${palette.muted};font-size:14px;letter-spacing:.11em}
    .tiny{fill:${palette.subtle};font-size:12px;letter-spacing:.09em}
    .solid-path{fill:none;stroke:${palette.accent};stroke-width:2.5;stroke-linecap:square;stroke-linejoin:miter;vector-effect:non-scaling-stroke}
    .active-path{fill:none;stroke:${palette.accent};stroke-width:4;stroke-linecap:square;stroke-linejoin:miter;vector-effect:non-scaling-stroke}
    .intervention-path{fill:none;stroke:${palette.muted};stroke-width:2.5;stroke-dasharray:14 12;stroke-linecap:square;vector-effect:non-scaling-stroke}
    .active-intervention-path{fill:none;stroke:${palette.accent};stroke-width:4;stroke-dasharray:14 12;stroke-linecap:square;vector-effect:non-scaling-stroke}
  `.trim();

  return element(
    "defs",
    {},
    [
      element("style", {}, styles),
      element(
        "pattern",
        {
          id: ids.grid,
          width: 48,
          height: 48,
          patternUnits: "userSpaceOnUse",
        },
        [
          line(0, 0, 48, 0, {
            stroke: palette.lineSoft,
            strokeWidth: 1,
            strokeOpacity: 0.36,
          }),
          line(0, 0, 0, 48, {
            stroke: palette.lineSoft,
            strokeWidth: 1,
            strokeOpacity: 0.36,
          }),
        ].join(""),
      ),
      element(
        "marker",
        {
          id: ids.arrow,
          viewBox: "0 0 10 10",
          refX: 8,
          refY: 5,
          markerWidth: 7,
          markerHeight: 7,
          orient: "auto",
        },
        path("M 0 0 L 10 5 L 0 10 z", { fill: palette.accent }),
      ),
      element(
        "marker",
        {
          id: ids.arrowDashed,
          viewBox: "0 0 10 10",
          refX: 8,
          refY: 5,
          markerWidth: 7,
          markerHeight: 7,
          orient: "auto",
        },
        path("M 0 0 L 10 5 L 0 10 z", { fill: palette.muted }),
      ),
    ].join(""),
  );
}

export function svgDocument({
  id,
  title,
  description,
  content,
  palette,
  provenance,
  transparent = false,
  width = 2400,
  height = 1350,
}) {
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;
  const ids = assetIds(id);
  const background = transparent
    ? ""
    : [
        rect(0, 0, width, height, { fill: palette.bg }),
        rect(0, 0, width, height, {
          fill: `url(#${ids.grid})`,
          opacity: 0.52,
          ariaHidden: true,
        }),
      ].join("");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    element(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: `0 0 ${width} ${height}`,
        width,
        height,
        role: "img",
        "aria-labelledby": `${titleId} ${descriptionId}`,
      },
      [
        element("title", { id: titleId }, escapeXml(title)),
        element("desc", { id: descriptionId }, escapeXml(description)),
        element(
          "metadata",
          { id: `${id}-provenance` },
          escapeXml(JSON.stringify(provenance)),
        ),
        definitions(id, palette),
        background,
        content,
      ].join(""),
    ),
    "",
  ].join("\n");
}

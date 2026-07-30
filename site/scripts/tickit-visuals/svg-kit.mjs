const ATTRIBUTE_NAMES = {
  ariaHidden: "aria-hidden",
  className: "class",
  dominantBaseline: "dominant-baseline",
  fillOpacity: "fill-opacity",
  fontSize: "font-size",
  fontWeight: "font-weight",
  letterSpacing: "letter-spacing",
  markerEnd: "marker-end",
  markerStart: "marker-start",
  paintOrder: "paint-order",
  patternUnits: "patternUnits",
  shapeRendering: "shape-rendering",
  strokeDasharray: "stroke-dasharray",
  strokeLinecap: "stroke-linecap",
  strokeLinejoin: "stroke-linejoin",
  strokeOpacity: "stroke-opacity",
  strokeWidth: "stroke-width",
  textAnchor: "text-anchor",
  vectorEffect: "vector-effect"
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

export const group = (children, values = {}) => element("g", values, children);

export const rect = (x, y, width, height, values = {}) =>
  empty("rect", { x, y, width, height, ...values });

export const line = (x1, y1, x2, y2, values = {}) =>
  empty("line", { x1, y1, x2, y2, ...values });

export const path = (d, values = {}) => empty("path", { d, ...values });

export const circle = (cx, cy, r, values = {}) =>
  empty("circle", { cx, cy, r, ...values });

export const polygon = (points, values = {}) =>
  empty("polygon", {
    points: points.map(([x, y]) => `${x},${y}`).join(" "),
    ...values
  });

export const polyline = (points, values = {}) =>
  empty("polyline", {
    points: points.map(([x, y]) => `${x},${y}`).join(" "),
    ...values
  });

export const text = (x, y, value, values = {}) =>
  element("text", { x, y, ...values }, escapeXml(value));

export function multilineText(x, y, lines, values = {}, lineHeight = 22) {
  return group(
    lines
      .map((value, index) =>
        text(x, y + index * lineHeight, value, values)
      )
      .join("")
  );
}

export function wrapWords(value, maxCharacters = 20, maxLines = 2) {
  const words = String(value).trim().split(/\s+/).filter(Boolean);
  const lines = [];

  for (const word of words) {
    const current = lines.at(-1);
    if (!current || `${current} ${word}`.length > maxCharacters) {
      lines.push(word);
    } else {
      lines[lines.length - 1] = `${current} ${word}`;
    }
  }

  if (lines.length <= maxLines) {
    return lines;
  }

  const visible = lines.slice(0, maxLines);
  visible[maxLines - 1] = `${visible[maxLines - 1].slice(
    0,
    Math.max(1, maxCharacters - 1)
  )}…`;
  return visible;
}

function marker(id, color) {
  return element(
    "marker",
    {
      id,
      viewBox: "0 0 10 10",
      refX: 8.5,
      refY: 5,
      markerWidth: 4,
      markerHeight: 4,
      orient: "auto-start-reverse"
    },
    path("M 0 0 L 10 5 L 0 10 z", { fill: color })
  );
}

function definitions(palette) {
  const styles = `
    .display{font-family:"Arial Narrow","Helvetica Neue",Arial,sans-serif;font-stretch:condensed}
    .sans{font-family:"Helvetica Neue",Arial,sans-serif}
    .mono{font-family:"SFMono-Regular",Menlo,Consolas,monospace}
    .current-line{fill:none;stroke:${palette.current};stroke-width:3;stroke-linecap:square;stroke-linejoin:miter;vector-effect:non-scaling-stroke}
    .history-line{fill:none;stroke:${palette.history};stroke-width:3;stroke-linecap:square;stroke-linejoin:miter;vector-effect:non-scaling-stroke}
    .structure-line{fill:none;stroke:${palette.line};stroke-width:2;stroke-linecap:square;stroke-linejoin:miter;vector-effect:non-scaling-stroke}
    .fine-line{fill:none;stroke:${palette.lineSoft};stroke-width:1.25;vector-effect:non-scaling-stroke}
  `.trim();

  return element(
    "defs",
    {},
    [
      element("style", {}, styles),
      element(
        "pattern",
        {
          id: "technical-grid",
          width: 54,
          height: 54,
          patternUnits: "userSpaceOnUse"
        },
        [
          line(0, 0, 54, 0, {
            stroke: palette.lineSoft,
            strokeWidth: 1,
            strokeOpacity: 0.4
          }),
          line(0, 0, 0, 54, {
            stroke: palette.lineSoft,
            strokeWidth: 1,
            strokeOpacity: 0.4
          })
        ].join("")
      ),
      marker("arrow-current", palette.current),
      marker("arrow-history", palette.history)
    ].join("")
  );
}

export function svgDocument({
  id,
  title,
  description,
  content,
  metadata,
  palette,
  width = 2400,
  height = 1350,
  transparent = false
}) {
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;
  const background = transparent
    ? ""
    : [
        rect(0, 0, width, height, { fill: palette.bg }),
        rect(0, 0, width, height, {
          fill: "url(#technical-grid)",
          opacity: 0.5,
          ariaHidden: true
        })
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
        shapeRendering: "geometricPrecision"
      },
      [
        element("title", { id: titleId }, escapeXml(title)),
        element("desc", { id: descriptionId }, escapeXml(description)),
        element("metadata", {}, escapeXml(JSON.stringify(metadata))),
        definitions(palette),
        background,
        content
      ].join("")
    ),
    ""
  ].join("\n");
}

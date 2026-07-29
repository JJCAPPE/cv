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

export const polygon = (points, values = {}) =>
  empty("polygon", {
    points: points.map(([x, y]) => `${x},${y}`).join(" "),
    ...values,
  });

export const text = (x, y, value, values = {}) =>
  element("text", { x, y, ...values }, escapeXml(value));

export function multilineText(
  x,
  y,
  lines,
  values = {},
  lineHeight = 22,
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

export function wrapWords(value, maxCharacters = 20, maxLines = 2) {
  const words = String(value).trim().split(/\s+/).filter(Boolean);
  const lines = [];

  for (const word of words) {
    const last = lines.at(-1);
    if (!last || `${last} ${word}`.length > maxCharacters) {
      lines.push(word);
    } else {
      lines[lines.length - 1] = `${last} ${word}`;
    }
  }

  if (lines.length <= maxLines) {
    return lines;
  }

  const visible = lines.slice(0, maxLines);
  visible[maxLines - 1] = `${visible[maxLines - 1].slice(
    0,
    Math.max(1, maxCharacters - 1),
  )}…`;
  return visible;
}

export function isoPlate({
  x,
  y,
  width,
  height,
  skew = 76,
  thickness = 15,
  top,
  front,
  side,
  stroke,
}) {
  const a = [x, y];
  const b = [x + width, y];
  const c = [x + width + skew, y + height];
  const d = [x + skew, y + height];
  const drop = ([px, py]) => [px, py + thickness];
  const contour = {
    stroke,
    strokeWidth: 3,
    strokeLinejoin: "round",
    vectorEffect: "non-scaling-stroke",
  };

  return group(
    [
      polygon([d, c, drop(c), drop(d)], { fill: front, ...contour }),
      polygon([b, c, drop(c), drop(b)], { fill: side, ...contour }),
      polygon([a, b, c, d], { fill: top, ...contour }),
    ].join(""),
  );
}

function definitions(palette) {
  const styles = `
    .display{font-family:"Arial Narrow","Barlow Condensed","Helvetica Neue",Arial,sans-serif;font-stretch:condensed}
    .sans{font-family:"Geist","Helvetica Neue",Arial,sans-serif}
    .mono{font-family:"Geist Mono","SFMono-Regular",Menlo,Consolas,monospace}
    .label{fill:${palette.fg};font-size:22px;letter-spacing:.08em}
    .micro{fill:${palette.muted};font-size:15px;letter-spacing:.11em}
    .tiny{fill:${palette.subtle};font-size:12px;letter-spacing:.1em}
    .accent{fill:${palette.accent}}
    .fine{fill:none;stroke:${palette.line};stroke-width:1.5;vector-effect:non-scaling-stroke}
    .fine-soft{fill:none;stroke:${palette.lineSoft};stroke-width:1;vector-effect:non-scaling-stroke}
    .active-line{fill:none;stroke:${palette.accent};stroke-width:2.5;stroke-linecap:round;vector-effect:non-scaling-stroke}
    .optional-line{fill:none;stroke:${palette.muted};stroke-width:1.75;stroke-dasharray:10 9;stroke-linecap:round;vector-effect:non-scaling-stroke}
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
          width: 48,
          height: 48,
          patternUnits: "userSpaceOnUse",
        },
        [
          line(0, 0, 48, 0, {
            stroke: palette.lineSoft,
            strokeWidth: 1,
            strokeOpacity: 0.38,
          }),
          line(0, 0, 0, 48, {
            stroke: palette.lineSoft,
            strokeWidth: 1,
            strokeOpacity: 0.38,
          }),
        ].join(""),
      ),
      element(
        "marker",
        {
          id: "arrow-active",
          viewBox: "0 0 10 10",
          refX: 8,
          refY: 5,
          markerWidth: 6,
          markerHeight: 6,
          orient: "auto-start-reverse",
        },
        path("M 0 0 L 10 5 L 0 10 z", { fill: palette.accent }),
      ),
      element(
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
    ].join(""),
  );
}

export function svgDocument({
  id,
  title,
  description,
  content,
  palette,
  width = 2400,
  height = 1350,
}) {
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;

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
        definitions(palette),
        rect(0, 0, width, height, { fill: palette.bg }),
        rect(0, 0, width, height, {
          fill: "url(#technical-grid)",
          opacity: 0.42,
          ariaHidden: true,
        }),
        content,
      ].join(""),
    ),
    "",
  ].join("\n");
}

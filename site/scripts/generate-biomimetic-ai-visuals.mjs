import { createHash } from "node:crypto";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  assetIds,
  circle,
  group,
  line,
  multilineText,
  path,
  rect,
  svgDocument,
  text,
} from "./biomimetic-ai-visuals/svg-kit.mjs";

const WIDTH = 2400;
const HEIGHT = 1350;
const PLACEHOLDER_MODE = false;
const SCRIPT_DIRECTORY = dirname(fileURLToPath(import.meta.url));
const PROJECT_DIRECTORY = resolve(SCRIPT_DIRECTORY, "..");
const LEDGER_PATH = resolve(
  SCRIPT_DIRECTORY,
  "biomimetic-ai-visuals/truth-ledger.json",
);
const outputDirectory = resolve(
  PROJECT_DIRECTORY,
  process.argv[2] ?? "public/media/projects/biomimetic-ai/technical",
);

const palette = {
  bg: "#0b0b0a",
  panel: "#161614",
  surface: "#1d1d1a",
  surface2: "#292923",
  line: "#4b4a41",
  lineBright: "#77746d",
  lineSoft: "#34342e",
  fg: "#f1efe8",
  muted: "#aaa79f",
  subtle: "#7f7c75",
  accent: "#e6d12a",
  accentDark: "#8f8214",
  ink: "#11110f",
};

const filenames = {
  overview: "biomimetic-ai-adaptability-atlas.svg",
  compositionality: "biomimetic-ai-compositionality-layer.svg",
  continualLearning: "biomimetic-ai-continual-learning-layer.svg",
  plasticity: "biomimetic-ai-plasticity-layer.svg",
};

const ledger = JSON.parse(await readFile(LEDGER_PATH, "utf8"));
const facts = new Map(ledger.facts.map((fact) => [fact.id, fact]));

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

async function validateLedger() {
  if (PLACEHOLDER_MODE) {
    throw new Error("Production visuals cannot run in placeholder mode.");
  }

  if (!ledger.project || !Array.isArray(ledger.facts) || !ledger.facts.length) {
    throw new Error("The truth ledger needs a project name and facts.");
  }

  const allowedScopes = new Set([
    "default",
    "optional",
    "offline",
    "historical",
    "proposed",
  ]);
  const allowedConfidence = new Set(["verified", "qualified", "excluded"]);
  const factIds = new Set();

  for (const fact of ledger.facts) {
    if (
      !fact.id ||
      !fact.display ||
      !fact.claim ||
      !fact.source ||
      !fact.notes ||
      !Array.isArray(fact.surfaces) ||
      !fact.surfaces.length
    ) {
      throw new Error(`Truth-ledger fact is incomplete: ${fact.id ?? "unknown"}`);
    }
    if (factIds.has(fact.id)) {
      throw new Error(`Duplicate truth-ledger fact ID: ${fact.id}`);
    }
    if (!allowedScopes.has(fact.scope)) {
      throw new Error(`Unsupported scope for ${fact.id}: ${fact.scope}`);
    }
    if (!allowedConfidence.has(fact.confidence)) {
      throw new Error(
        `Unsupported confidence for ${fact.id}: ${fact.confidence}`,
      );
    }
    factIds.add(fact.id);
  }

  const exclusionIds = new Set();
  for (const exclusion of ledger.exclusions ?? []) {
    if (!exclusion.id || !exclusion.reason || !exclusion.source) {
      throw new Error("Every exclusion needs an ID, reason, and source.");
    }
    if (exclusionIds.has(exclusion.id)) {
      throw new Error(`Duplicate truth-ledger exclusion ID: ${exclusion.id}`);
    }
    exclusionIds.add(exclusion.id);
  }

  for (const source of ledger.sources ?? []) {
    const sourcePath = resolve(PROJECT_DIRECTORY, source.path);
    await stat(sourcePath);
    const sourceHash = sha256(await readFile(sourcePath));
    if (sourceHash !== source.sha256) {
      throw new Error(`Source hash changed: ${source.path}`);
    }
  }
}

function display(renderedClaims, id) {
  const fact = facts.get(id);
  if (!fact) {
    throw new Error(`Missing truth-ledger fact: ${id}`);
  }
  renderedClaims.add(id);
  return fact.display;
}

function mark(renderedClaims, id) {
  display(renderedClaims, id);
}

function provenance(renderedClaims, asset) {
  return {
    project: ledger.project,
    asset,
    generator: "scripts/generate-biomimetic-ai-visuals.mjs",
    ledger: "scripts/biomimetic-ai-visuals/truth-ledger.json",
    renderedClaims: ledger.facts
      .filter((fact) => renderedClaims.has(fact.id))
      .map((fact) => fact.id),
    exclusions: (ledger.exclusions ?? []).map((item) => item.id),
    sources: ledger.sources.map((source) => ({
      path: source.path,
      sha256: source.sha256,
    })),
  };
}

function laneFrame(y, focused = false) {
  return group(
    [
      rect(64, y, 2272, 245, {
        fill: focused ? palette.bg : palette.panel,
        fillOpacity: focused ? 0.98 : 0.82,
        stroke: focused ? palette.accent : palette.line,
        strokeWidth: focused ? 3 : 1.5,
        vectorEffect: "non-scaling-stroke",
      }),
      line(392, y, 392, y + 245, {
        stroke: focused ? palette.accentDark : palette.line,
        strokeWidth: 1.5,
        vectorEffect: "non-scaling-stroke",
      }),
    ].join(""),
  );
}

function laneLabel(renderedClaims, factId, y, focused) {
  const [index, ...titleParts] = display(renderedClaims, factId).split(" ");
  const title = titleParts.join(" ");

  return group(
    [
      rect(96, y + 42, 58, 58, {
        fill: palette.accent,
        stroke: palette.ink,
        strokeWidth: 2,
      }),
      text(125, y + 79, index, {
        className: "mono",
        fill: palette.ink,
        fontSize: 17,
        fontWeight: 750,
        textAnchor: "middle",
      }),
      text(178, y + 82, title, {
        className: "display lane-title",
        fill: focused ? palette.accent : palette.fg,
      }),
      line(96, y + 177, 344, y + 177, {
        stroke: palette.line,
        strokeWidth: 1.5,
        vectorEffect: "non-scaling-stroke",
      }),
      text(96, y + 206, display(renderedClaims, "independent-evidence-label"), {
        className: "mono tiny",
      }),
    ].join(""),
  );
}

function nodeBox({
  renderedClaims,
  factId,
  x,
  y,
  width,
  height,
  lines,
  focused = false,
  dashed = false,
  detail,
}) {
  const label = display(renderedClaims, factId);
  const visibleLines = lines ?? [label];
  const labelY = y + (detail ? 31 : (height - (visibleLines.length - 1) * 20) / 2 + 6);

  return group(
    [
      rect(x, y, width, height, {
        fill: focused ? palette.surface2 : palette.surface,
        stroke: focused ? palette.accent : palette.lineBright,
        strokeWidth: focused ? 2.5 : 1.5,
        strokeDasharray: dashed ? "12 10" : undefined,
        vectorEffect: "non-scaling-stroke",
      }),
      multilineText(
        x + 20,
        labelY,
        visibleLines,
        {
          className: "mono node-label",
          fill: focused ? palette.fg : palette.fg,
        },
        21,
      ),
      detail
        ? text(x + 20, y + height - 18, detail, {
            className: "mono node-detail",
          })
        : "",
    ].join(""),
  );
}

function connector({
  id,
  d,
  focused,
  dashed = false,
  arrow = true,
}) {
  const ids = assetIds(id);
  const className = dashed
    ? focused
      ? "active-intervention-path"
      : "intervention-path"
    : focused
      ? "active-path"
      : "solid-path";
  const marker = dashed && !focused ? ids.arrowDashed : ids.arrow;

  return path(d, {
    className,
    markerEnd: arrow ? `url(#${marker})` : undefined,
  });
}

function composeLane({ id, renderedClaims, focused = false }) {
  const y = 215;
  mark(renderedClaims, "compose-connectors");

  return group(
    [
      laneFrame(y, focused),
      laneLabel(renderedClaims, "compose-lane", y, focused),
      nodeBox({
        renderedClaims,
        factId: "known-primitives",
        x: 430,
        y: y + 40,
        width: 300,
        height: 68,
        focused,
      }),
      nodeBox({
        renderedClaims,
        factId: "study-examples",
        x: 430,
        y: y + 137,
        width: 300,
        height: 68,
        focused,
      }),
      nodeBox({
        renderedClaims,
        factId: "mlc-transformer",
        x: 820,
        y: y + 88,
        width: 365,
        height: 72,
        focused,
      }),
      nodeBox({
        renderedClaims,
        factId: "novel-query",
        x: 1320,
        y: y + 88,
        width: 300,
        height: 72,
        focused,
      }),
      nodeBox({
        renderedClaims,
        factId: "rule-application",
        x: 1780,
        y: y + 88,
        width: 350,
        height: 72,
        focused,
      }),
      connector({
        id,
        focused,
        d: `M 730 ${y + 74} H 772 V ${y + 124} H 820`,
      }),
      connector({
        id,
        focused,
        d: `M 730 ${y + 171} H 772 V ${y + 124} H 820`,
      }),
      connector({
        id,
        focused,
        d: `M 1185 ${y + 124} H 1320`,
      }),
      connector({
        id,
        focused,
        d: `M 1620 ${y + 124} H 1780`,
      }),
      circle(772, y + 124, 7, {
        fill: focused ? palette.accent : palette.lineBright,
      }),
    ].join(""),
    { id: `${id}-compose` },
  );
}

function retainLane({ id, renderedClaims, focused = false }) {
  const y = 486;
  mark(renderedClaims, "retain-connectors");

  return group(
    [
      laneFrame(y, focused),
      laneLabel(renderedClaims, "retain-lane", y, focused),
      nodeBox({
        renderedClaims,
        factId: "sequential-tasks",
        x: 430,
        y: y + 88,
        width: 300,
        height: 72,
        focused,
      }),
      nodeBox({
        renderedClaims,
        factId: "sluggish-units",
        x: 850,
        y: y + 40,
        width: 390,
        height: 68,
        focused,
      }),
      nodeBox({
        renderedClaims,
        factId: "hebbian-gating",
        x: 850,
        y: y + 137,
        width: 390,
        height: 68,
        focused,
      }),
      nodeBox({
        renderedClaims,
        factId: "task-representation-separation",
        x: 1570,
        y: y + 72,
        width: 560,
        height: 104,
        focused,
      }),
      connector({
        id,
        focused,
        d: `M 730 ${y + 124} H 790 V ${y + 74} H 850`,
      }),
      connector({
        id,
        focused,
        d: `M 730 ${y + 124} H 790 V ${y + 171} H 850`,
      }),
      connector({
        id,
        focused,
        d: `M 1240 ${y + 74} H 1378 V ${y + 124} H 1570`,
      }),
      connector({
        id,
        focused,
        d: `M 1240 ${y + 171} H 1378 V ${y + 124} H 1570`,
      }),
      circle(790, y + 124, 7, {
        fill: focused ? palette.accent : palette.lineBright,
      }),
      circle(1378, y + 124, 7, {
        fill: focused ? palette.accent : palette.lineBright,
      }),
    ].join(""),
    { id: `${id}-retain` },
  );
}

function renewLane({ id, renderedClaims, focused = false }) {
  const y = 757;
  mark(renderedClaims, "renew-connectors");

  return group(
    [
      laneFrame(y, focused),
      laneLabel(renderedClaims, "renew-lane", y, focused),
      nodeBox({
        renderedClaims,
        factId: "prolonged-training",
        x: 430,
        y: y + 72,
        width: 340,
        height: 104,
        focused,
      }),
      nodeBox({
        renderedClaims,
        factId: "dormant-units",
        x: 875,
        y: y + 27,
        width: 360,
        height: 56,
        focused,
      }),
      nodeBox({
        renderedClaims,
        factId: "effective-rank-loss",
        x: 875,
        y: y + 95,
        width: 360,
        height: 56,
        focused,
      }),
      nodeBox({
        renderedClaims,
        factId: "weight-dynamics",
        x: 875,
        y: y + 163,
        width: 360,
        height: 56,
        focused,
      }),
      nodeBox({
        renderedClaims,
        factId: "continual-backpropagation",
        x: 1580,
        y: y + 49,
        width: 520,
        height: 68,
        focused,
        dashed: true,
      }),
      nodeBox({
        renderedClaims,
        factId: "reinitialize-less-used",
        x: 1580,
        y: y + 145,
        width: 520,
        height: 68,
        focused,
        dashed: true,
      }),
      connector({
        id,
        focused,
        d: `M 770 ${y + 124} H 820 V ${y + 55} H 875`,
      }),
      connector({
        id,
        focused,
        d: `M 770 ${y + 124} H 875`,
      }),
      connector({
        id,
        focused,
        d: `M 770 ${y + 124} H 820 V ${y + 191} H 875`,
      }),
      connector({
        id,
        focused,
        dashed: true,
        d: `M 1235 ${y + 124} H 1492 V ${y + 83} H 1580`,
      }),
      connector({
        id,
        focused,
        dashed: true,
        d: `M 1840 ${y + 117} V ${y + 145}`,
      }),
      circle(820, y + 124, 7, {
        fill: focused ? palette.accent : palette.lineBright,
      }),
    ].join(""),
    { id: `${id}-renew` },
  );
}

function header(id, renderedClaims) {
  const ids = assetIds(id);
  return group(
    [
      text(96, 72, display(renderedClaims, "literature-synthesis"), {
        className: "mono micro",
        fill: palette.accent,
        fontWeight: 700,
      }),
      text(96, 150, display(renderedClaims, "project-title"), {
        className: "display",
        fill: palette.fg,
        fontSize: 64,
        fontWeight: 700,
        letterSpacing: ".045em",
      }),
      line(1680, 67, 1760, 67, {
        stroke: palette.accent,
        strokeWidth: 2.5,
        markerEnd: `url(#${ids.arrow})`,
      }),
      text(1786, 72, display(renderedClaims, "study-line-legend"), {
        className: "mono tiny",
      }),
      line(1680, 105, 1760, 105, {
        stroke: palette.muted,
        strokeWidth: 2.5,
        strokeDasharray: "14 12",
        markerEnd: `url(#${ids.arrowDashed})`,
      }),
      text(1786, 110, display(renderedClaims, "intervention-line-legend"), {
        className: "mono tiny",
      }),
    ].join(""),
  );
}

function footer(renderedClaims) {
  const facts = [
    ["paper-pages", 96],
    ["cover-memo-pages", 854],
    ["source-lines", 1612],
  ];

  return group(
    [
      line(64, 1041, 2336, 1041, {
        stroke: palette.line,
        strokeWidth: 1.5,
        vectorEffect: "non-scaling-stroke",
      }),
      text(96, 1104, display(renderedClaims, "conclusion-boundary"), {
        className: "display",
        fill: palette.fg,
        fontSize: 27,
        fontWeight: 700,
        letterSpacing: ".045em",
      }),
      ...facts.map(([factId, x]) =>
        group(
          [
            rect(x, 1172, 640, 88, {
              fill: palette.panel,
              stroke: palette.line,
              strokeWidth: 1.5,
            }),
            text(x + 24, 1208, display(renderedClaims, factId), {
              className: "mono",
              fill: palette.accent,
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: ".07em",
            }),
            text(x + 24, 1238, display(renderedClaims, "artifact-verification-label"), {
              className: "mono tiny",
            }),
          ].join(""),
        ),
      ),
      text(96, 1310, display(renderedClaims, "source-led-boundary-label"), {
        className: "mono tiny",
      }),
    ].join(""),
  );
}

function renderMaster() {
  const id = "biomimetic-ai-adaptability-atlas";
  const renderedClaims = new Set();
  const content = [
    header(id, renderedClaims),
    composeLane({ id, renderedClaims }),
    retainLane({ id, renderedClaims }),
    renewLane({ id, renderedClaims }),
    footer(renderedClaims),
  ].join("");

  return {
    renderedClaims,
    svg: svgDocument({
      id,
      title: "Forging Adaptability evidence atlas",
      description:
        "Three independent evidence lanes summarize MLC compositional episodes, PFC-inspired context mechanisms, and plasticity decline with a separately documented continual-backpropagation intervention.",
      content,
      palette,
      provenance: provenance(renderedClaims, filenames.overview),
      width: WIDTH,
      height: HEIGHT,
    }),
  };
}

function renderFocus({ key, lane, title, description }) {
  const id = `biomimetic-ai-${key}-layer`;
  const renderedClaims = new Set();
  const content = lane({ id, renderedClaims, focused: true });

  return {
    renderedClaims,
    svg: svgDocument({
      id,
      title,
      description,
      content,
      palette,
      provenance: provenance(renderedClaims, filenames[key]),
      transparent: true,
      width: WIDTH,
      height: HEIGHT,
    }),
  };
}

function validateRenderedClaims(assetClaims) {
  const rendered = new Set(
    Object.values(assetClaims).flatMap((claims) => [...claims]),
  );
  const required = ledger.facts.filter(
    (fact) =>
      fact.confidence !== "excluded" &&
      fact.surfaces.some((surface) =>
        ["master", "cover", "companion"].includes(surface),
      ),
  );
  const missing = required.filter((fact) => !rendered.has(fact.id));

  if (missing.length) {
    throw new Error(
      `Unrendered truth-ledger claims: ${missing.map((fact) => fact.id).join(", ")}`,
    );
  }
}

function validateOutput(svg, filename) {
  const forbidden = [
    /80\.7/,
    /82\.4/,
    /100%/,
    /\bAGI\b/i,
    /automatic retraining/i,
    /[\u2013\u2014]/,
  ];

  for (const pattern of forbidden) {
    if (pattern.test(svg)) {
      throw new Error(`Forbidden claim or character in ${filename}: ${pattern}`);
    }
  }
}

await validateLedger();

const master = renderMaster();
const compositionality = renderFocus({
  key: "compositionality",
  lane: composeLane,
  title: "Compositionality focus layer",
  description:
    "A highlighted MLC evidence lane shows known primitives and study examples leading to a novel query and systematic rule application.",
});
const continualLearning = renderFocus({
  key: "continualLearning",
  lane: retainLane,
  title: "Continual-learning focus layer",
  description:
    "A highlighted evidence lane shows sequential tasks passing through sluggish task units and Hebbian context gating toward separated task representations.",
});
const plasticity = renderFocus({
  key: "plasticity",
  lane: renewLane,
  title: "Plasticity focus layer",
  description:
    "A highlighted evidence lane shows prolonged standard training, three reported decline markers, and a dashed, separately documented continual-backpropagation intervention.",
});

const outputs = {
  [filenames.overview]: master.svg,
  [filenames.compositionality]: compositionality.svg,
  [filenames.continualLearning]: continualLearning.svg,
  [filenames.plasticity]: plasticity.svg,
};

validateRenderedClaims({
  overview: master.renderedClaims,
  compositionality: compositionality.renderedClaims,
  continualLearning: continualLearning.renderedClaims,
  plasticity: plasticity.renderedClaims,
});

await mkdir(outputDirectory, { recursive: true });
for (const [filename, svg] of Object.entries(outputs)) {
  validateOutput(svg, filename);
  await writeFile(resolve(outputDirectory, filename), svg, "utf8");
}

console.log(
  `Generated ${Object.keys(outputs).length} biomimetic AI visuals in ${outputDirectory}`,
);

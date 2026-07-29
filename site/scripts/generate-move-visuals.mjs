import { readFile, mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  circle,
  group,
  line,
  multilineText,
  path,
  polygon,
  rect,
  svgDocument,
  text,
  wrapWords,
} from "./move-visuals/svg-kit.mjs";

const WIDTH = 2400;
const HEIGHT = 1350;
const SCRIPT_DIRECTORY = dirname(fileURLToPath(import.meta.url));
const LEDGER_PATH = resolve(
  SCRIPT_DIRECTORY,
  "move-visuals/truth-ledger.json",
);
const OUTPUT_DIRECTORY = resolve(
  process.cwd(),
  process.argv[2] ?? "public/media/projects/move",
);

const palette = {
  bg: "#0b0b0a",
  panel: "#161614",
  panelRaised: "#1e1e1a",
  panelDeep: "#10100f",
  surface: "#23231f",
  line: "#55534a",
  lineSoft: "#33332e",
  fg: "#f1efe8",
  muted: "#aaa79f",
  subtle: "#76736b",
  accent: "#e6d12a",
  ink: "#11110f",
  historical: "#6f6c65",
  faceFront: "#171714",
  faceSide: "#25241f",
};

const SURFACES = {
  agentMaster: "move-agent-interface-exploded",
  agentRequest: "move-agent-interface-request-layer",
  agentRuntime: "move-agent-interface-runtime-layer",
  agentResponse: "move-agent-interface-response-layer",
  skillMaster: "move-skill-adg-exploded",
  skillResolve: "move-skill-adg-resolve-layer",
  skillContext: "move-skill-adg-context-layer",
  skillAuthority: "move-skill-adg-authority-layer",
};

const OUTPUTS = [
  {
    surface: SURFACES.agentMaster,
    filename: "move-agent-interface-exploded.svg",
    title: "MOVE agent and interface exploded system",
    description:
      "Three source-led planes trace an authenticated React request through FastAPI, Databricks Model Serving, the governed MOVE agent, a versioned response contract, and typed UI renderers.",
    transparent: false,
    render: agentMaster,
  },
  {
    surface: SURFACES.agentRequest,
    filename: "move-agent-interface-request-layer.svg",
    title: "MOVE request boundary layer",
    description:
      "Transparent companion layer isolating the authenticated React, ChatTransport, FastAPI, and ServingEndpointBackend request boundary.",
    transparent: true,
    render: agentRequestPlane,
  },
  {
    surface: SURFACES.agentRuntime,
    filename: "move-agent-interface-runtime-layer.svg",
    title: "MOVE governed runtime layer",
    description:
      "Transparent companion layer isolating Databricks Model Serving, request governance, safe tool execution, evidence coverage, and bounded review.",
    transparent: true,
    render: agentRuntimePlane,
  },
  {
    surface: SURFACES.agentResponse,
    filename: "move-agent-interface-response-layer.svg",
    title: "MOVE typed return layer",
    description:
      "Transparent companion layer isolating the versioned agent contract, response adapter, UI events, and typed message renderers.",
    transparent: true,
    render: agentResponsePlane,
  },
  {
    surface: SURFACES.skillMaster,
    filename: "move-skill-adg-exploded.svg",
    title: "MOVE skills and ADG exploded system",
    description:
      "Three source-led planes show file-backed skill resolution, bounded ADG context composition, and code-owned tool selection and execution authority.",
    transparent: false,
    render: skillMaster,
  },
  {
    surface: SURFACES.skillResolve,
    filename: "move-skill-adg-resolve-layer.svg",
    title: "MOVE skill resolution layer",
    description:
      "Transparent companion layer isolating manifest-bound file packages, bounded request history, skill matching, and load caps.",
    transparent: true,
    render: skillResolvePlane,
  },
  {
    surface: SURFACES.skillContext,
    filename: "move-skill-adg-context-layer.svg",
    title: "MOVE skill context composition layer",
    description:
      "Transparent companion layer isolating reconstructed state, ADG navigation, phase contracts, selected content sections, and the bounded skill context envelope.",
    transparent: true,
    render: skillContextPlane,
  },
  {
    surface: SURFACES.skillAuthority,
    filename: "move-skill-adg-authority-layer.svg",
    title: "MOVE skill tool authority layer",
    description:
      "Transparent companion layer isolating tool ranking hints, deterministic selection, schema limits, and SafeToolExecutor policy authority.",
    transparent: true,
    render: skillAuthorityPlane,
  },
];

const ledger = JSON.parse(await readFile(LEDGER_PATH, "utf8"));
const claimsById = validateLedger(ledger);
const renderedClaims = new Map(
  OUTPUTS.map(({ surface }) => [surface, new Set()]),
);

function validateLedger(value) {
  const allowedScopes = new Set([
    "default",
    "optional",
    "historical",
  ]);
  const allowedConfidence = new Set(["verified", "qualified"]);
  const outputSurfaces = new Set(OUTPUTS.map(({ surface }) => surface));
  const placeholder = /\b(?:TODO|TBD|REPLACE|PLACEHOLDER)\b/i;

  if (value?.schema_version !== "move.visual_truth.v1") {
    throw new Error("The MOVE visual truth ledger has an unsupported schema.");
  }
  if (!value.snapshots || !value.sources || !Array.isArray(value.claims)) {
    throw new Error("The MOVE visual truth ledger is incomplete.");
  }

  for (const [sourceId, source] of Object.entries(value.sources)) {
    if (
      !sourceId ||
      !source?.repo ||
      !source?.path ||
      !source?.symbol ||
      !source?.snapshot
    ) {
      throw new Error(`Source reference ${sourceId} is incomplete.`);
    }
    if (value.snapshots[source.repo] !== source.snapshot) {
      throw new Error(
        `Source reference ${sourceId} does not match its pinned snapshot.`,
      );
    }
  }

  const byId = new Map();
  for (const claim of value.claims) {
    if (!claim?.id || byId.has(claim.id)) {
      throw new Error(`Claim IDs must be present and unique: ${claim?.id}`);
    }
    if (
      !claim.display ||
      !claim.claim ||
      !Array.isArray(claim.source_refs) ||
      claim.source_refs.length === 0 ||
      !Array.isArray(claim.surfaces) ||
      claim.surfaces.length === 0 ||
      !claim.notes
    ) {
      throw new Error(`Claim ${claim.id} is missing required evidence fields.`);
    }
    if (placeholder.test(`${claim.display} ${claim.claim}`)) {
      throw new Error(`Claim ${claim.id} contains placeholder text.`);
    }
    if (!allowedScopes.has(claim.scope)) {
      throw new Error(`Claim ${claim.id} has unsupported scope ${claim.scope}.`);
    }
    if (!allowedConfidence.has(claim.confidence)) {
      throw new Error(
        `Claim ${claim.id} has unsupported confidence ${claim.confidence}.`,
      );
    }
    for (const sourceRef of claim.source_refs) {
      if (!value.sources[sourceRef]) {
        throw new Error(
          `Claim ${claim.id} references missing source ${sourceRef}.`,
        );
      }
    }
    if (
      !claim.surfaces.some(
        (surface) =>
          outputSurfaces.has(surface) ||
          surface === "move-case-study" ||
          surface === "move-cover",
      )
    ) {
      throw new Error(`Claim ${claim.id} has no recognized rendered surface.`);
    }
    byId.set(claim.id, claim);
  }

  const exclusionIds = new Set();
  for (const exclusion of value.exclusions ?? []) {
    if (!exclusion?.id || exclusionIds.has(exclusion.id)) {
      throw new Error(
        `Exclusion IDs must be present and unique: ${exclusion?.id}`,
      );
    }
    exclusionIds.add(exclusion.id);
    if (
      !exclusion.reason ||
      !Array.isArray(exclusion.source_refs) ||
      exclusion.source_refs.length === 0
    ) {
      throw new Error(`Exclusion ${exclusion.id} is incomplete.`);
    }
    for (const sourceRef of exclusion.source_refs) {
      if (!value.sources[sourceRef]) {
        throw new Error(
          `Exclusion ${exclusion.id} references missing source ${sourceRef}.`,
        );
      }
    }
  }

  return byId;
}

function recordClaim(surface, id) {
  const entry = claimsById.get(id);
  if (!entry) {
    throw new Error(`Rendered claim ${id} is not present in the truth ledger.`);
  }
  if (!entry.surfaces.includes(surface)) {
    throw new Error(
      `Claim ${id} is not approved for rendered surface ${surface}.`,
    );
  }
  renderedClaims.get(surface)?.add(id);
  return entry;
}

function claim(surface, id) {
  return recordClaim(surface, id).display;
}

function claimText(surface, id, x, y, values = {}) {
  return text(x, y, claim(surface, id), values);
}

function chip(
  surface,
  id,
  {
    x,
    y,
    width,
    height = 66,
    accent = false,
    fontSize = 14,
    maxCharacters,
  },
) {
  const entry = recordClaim(surface, id);
  const label = entry.display;
  const optional = entry.scope === "optional";
  const historical = entry.scope === "historical";
  const renderedFontSize = Math.round(fontSize * 1.25);
  const lines = wrapWords(
    label,
    maxCharacters ??
      Math.max(
        9,
        Math.floor((width - 32) / (renderedFontSize * 0.62)),
      ),
    2,
  );
  const foreground = accent
    ? palette.ink
    : historical
      ? palette.historical
      : palette.fg;
  const stroke = accent
    ? palette.ink
    : historical
      ? palette.historical
      : optional
        ? palette.muted
        : palette.line;

  return group(
    [
      rect(x, y, width, height, {
        rx: 5,
        fill: accent
          ? palette.accent
          : historical
            ? palette.panelDeep
            : palette.panel,
        stroke,
        strokeWidth: accent ? 2.5 : 1.5,
        strokeDasharray: optional ? "10 8" : historical ? "3 8" : undefined,
      }),
      multilineText(
        x + 16,
        y + (lines.length === 1 ? height / 2 + 5 : height / 2 - 5),
        lines,
        {
          className: "mono",
          fill: foreground,
          fontSize: renderedFontSize,
          fontWeight: accent ? 750 : 620,
          letterSpacing: ".035em",
        },
        renderedFontSize + 4,
      ),
    ].join(""),
  );
}

function strip(
  surface,
  id,
  {
    x,
    y,
    width,
    accent = false,
    fontSize = 12,
    align = "start",
  },
) {
  const entry = recordClaim(surface, id);
  const label = entry.display;
  const optional = entry.scope === "optional";
  const historical = entry.scope === "historical";
  const fill = accent
    ? palette.accent
    : historical
      ? palette.panelDeep
      : palette.panelRaised;
  const foreground = accent
    ? palette.ink
    : historical
      ? palette.historical
      : palette.muted;
  return group(
    [
      rect(x, y, width, 36, {
        rx: 3,
        fill,
        stroke: historical
          ? palette.historical
          : optional
            ? palette.muted
            : accent
              ? palette.ink
              : palette.line,
        strokeWidth: 1.25,
        strokeDasharray: optional ? "9 8" : historical ? "3 8" : undefined,
      }),
      text(align === "middle" ? x + width / 2 : x + 13, y + 23, label, {
        className: "mono",
        fill: foreground,
        fontSize,
        fontWeight: accent ? 750 : 600,
        letterSpacing: ".045em",
        textAnchor: align,
      }),
    ].join(""),
  );
}

function flowArrow(surface, claimId, x1, y1, x2, y2) {
  recordClaim(surface, claimId);
  return line(x1, y1, x2, y2, {
    className: "active-line",
    markerEnd: "url(#arrow-active)",
  });
}

function curvedArrow(surface, claimId, d) {
  const entry = recordClaim(surface, claimId);
  const isOptional = entry.scope === "optional";
  const className = isOptional ? "optional-line" : "active-line";
  const markerEnd = isOptional
    ? "url(#arrow-muted)"
    : "url(#arrow-active)";
  return path(d, { className, markerEnd });
}

function blockedPath(surface, claimId, d) {
  recordClaim(surface, claimId);
  return path(d, {
    fill: "none",
    stroke: palette.accent,
    strokeWidth: 2.5,
    strokeLinecap: "round",
  });
}

function planeShell(surface, labelId, { x, y, width, height, skew = 84 }) {
  const top = [
    [x, y],
    [x + width, y],
    [x + width + skew, y + height],
    [x + skew, y + height],
  ];
  const drop = 18;
  const front = [
    [x + skew, y + height],
    [x + width + skew, y + height],
    [x + width + skew, y + height + drop],
    [x + skew, y + height + drop],
  ];
  const side = [
    [x + width, y],
    [x + width + skew, y + height],
    [x + width + skew, y + height + drop],
    [x + width, y + drop],
  ];

  return group(
    [
      polygon(front, {
        fill: palette.faceFront,
        stroke: palette.ink,
        strokeWidth: 3,
        strokeLinejoin: "round",
      }),
      polygon(side, {
        fill: palette.faceSide,
        stroke: palette.ink,
        strokeWidth: 3,
        strokeLinejoin: "round",
      }),
      polygon(top, {
        fill: palette.surface,
        stroke: palette.ink,
        strokeWidth: 3,
        strokeLinejoin: "round",
      }),
      line(x + 176, y + 70, x + width - 26, y + 70, {
        className: "fine-line",
      }),
      circle(x + 60, y + 45, 12, {
        fill: palette.accent,
        stroke: palette.ink,
        strokeWidth: 2,
      }),
      claimText(surface, labelId, x + 176, y + 49, {
        className: "display",
        fill: palette.fg,
        fontSize: 24,
        fontWeight: 750,
        letterSpacing: ".08em",
      }),
    ].join(""),
  );
}

function masterHeader(surface, titleId, subtitleId) {
  return group(
    [
      claimText(surface, "common-project", 540, 68, {
        className: "mono",
        fill: palette.accent,
        fontSize: 14,
        fontWeight: 700,
        letterSpacing: ".14em",
      }),
      claimText(surface, "common-snapshot", 1960, 68, {
        className: "mono",
        fill: palette.subtle,
        fontSize: 12,
        letterSpacing: ".1em",
        textAnchor: "end",
      }),
      claimText(surface, titleId, 540, 137, {
        className: "display",
        fill: palette.fg,
        fontSize: 54,
        fontWeight: 750,
        letterSpacing: ".055em",
      }),
      claimText(surface, subtitleId, 544, 178, {
        className: "mono",
        fill: palette.muted,
        fontSize: 14,
        letterSpacing: ".07em",
      }),
      line(330, 195, 2070, 195, { className: "fine-line" }),
    ].join(""),
  );
}

function masterGuides() {
  return group(
    [
      line(305, 218, 305, 1198, {
        stroke: palette.lineSoft,
        strokeWidth: 1.25,
        strokeDasharray: "5 12",
      }),
      line(2095, 218, 2095, 1198, {
        stroke: palette.lineSoft,
        strokeWidth: 1.25,
        strokeDasharray: "5 12",
      }),
      line(290, 232, 320, 232, { className: "fine-line" }),
      line(2080, 232, 2110, 232, { className: "fine-line" }),
      line(290, 1188, 320, 1188, { className: "fine-line" }),
      line(2080, 1188, 2110, 1188, { className: "fine-line" }),
      text(278, 242, "Y", {
        className: "mono",
        fill: palette.subtle,
        fontSize: 11,
        textAnchor: "end",
      }),
      text(2121, 1203, "X", {
        className: "mono",
        fill: palette.subtle,
        fontSize: 11,
      }),
    ].join(""),
  );
}

function masterFooter(surface, includeHistorical = false) {
  const items = [
    strip(surface, "common-default", {
      x: 540,
      y: 1270,
      width: 330,
      accent: true,
      fontSize: 11,
    }),
    strip(surface, "common-optional", {
      x: 890,
      y: 1270,
      width: 390,
      fontSize: 11,
    }),
  ];
  if (includeHistorical) {
    items.push(
      strip(surface, "common-historical", {
        x: 1300,
        y: 1270,
        width: 380,
        fontSize: 11,
      }),
    );
  }
  return group(items.join(""));
}

function agentRequestPlane(surface) {
  const y = 235;
  return group(
    [
      planeShell(surface, "agent-plane-request", {
        x: 260,
        y,
        width: 1800,
        height: 220,
      }),
      flowArrow(surface, "agent-edge-request", 816, 351, 842, 351),
      flowArrow(surface, "agent-edge-request", 1037, 351, 1063, 351),
      flowArrow(surface, "agent-edge-request", 1245, 351, 1271, 351),
      flowArrow(surface, "agent-edge-request", 1491, 351, 1517, 351),
      chip(surface, "agent-user", {
        x: 650,
        y: 316,
        width: 166,
        height: 70,
        fontSize: 13,
      }),
      chip(surface, "agent-react", {
        x: 842,
        y: 316,
        width: 195,
        height: 70,
        fontSize: 13,
      }),
      chip(surface, "agent-transport", {
        x: 1063,
        y: 316,
        width: 182,
        height: 70,
        fontSize: 14,
      }),
      chip(surface, "agent-fastapi", {
        x: 1271,
        y: 316,
        width: 220,
        height: 70,
        fontSize: 13,
      }),
      chip(surface, "agent-serving-backend", {
        x: 1517,
        y: 316,
        width: 350,
        height: 70,
        accent: true,
        fontSize: 13,
      }),
      strip(surface, "agent-no-direct", {
        x: 650,
        y: 405,
        width: 380,
        accent: true,
        fontSize: 11,
      }),
      blockedPath(
        surface,
        "agent-edge-no-direct",
        "M 1038 423 C 1160 423, 1260 423, 1370 423",
      ),
      line(1190, 407, 1210, 439, {
        stroke: palette.accent,
        strokeWidth: 3,
      }),
      line(1210, 407, 1190, 439, {
        stroke: palette.accent,
        strokeWidth: 3,
      }),
      curvedArrow(
        surface,
        "agent-edge-history",
        "M 1380 386 C 1380 410, 1400 422, 1430 422",
      ),
      chip(surface, "agent-history", {
        x: 1430,
        y: 399,
        width: 420,
        height: 47,
        fontSize: 12,
      }),
      claimText(surface, "agent-history-status", 1842, 438, {
        className: "mono",
        fill: palette.muted,
        fontSize: 9.5,
        letterSpacing: ".05em",
        textAnchor: "end",
      }),
      curvedArrow(
        surface,
        "agent-edge-request",
        "M 1867 351 C 1995 351, 2024 445, 1960 584",
      ),
    ].join(""),
  );
}

function agentRuntimePlane(surface) {
  const y = 535;
  const rowY = 650;
  return group(
    [
      planeShell(surface, "agent-plane-runtime", {
        x: 260,
        y,
        width: 1800,
        height: 270,
      }),
      chip(surface, "agent-serving", {
        x: 720,
        y: 557,
        width: 310,
        height: 58,
        accent: true,
        fontSize: 13,
      }),
      strip(surface, "agent-responses-task", {
        x: 1050,
        y: 568,
        width: 205,
        fontSize: 11,
      }),
      chip(surface, "agent-responses-agent", {
        x: 1275,
        y: 557,
        width: 300,
        height: 58,
        fontSize: 13,
      }),
      flowArrow(surface, "agent-edge-serving", 1030, 586, 1050, 586),
      flowArrow(surface, "agent-edge-serving", 1255, 586, 1275, 586),
      flowArrow(surface, "agent-edge-runtime", 770, 683, 788, 683),
      flowArrow(surface, "agent-edge-runtime", 938, 683, 956, 683),
      flowArrow(surface, "agent-edge-runtime", 1146, 683, 1164, 683),
      flowArrow(surface, "agent-edge-runtime", 1384, 683, 1402, 683),
      flowArrow(surface, "agent-edge-runtime", 1582, 683, 1600, 683),
      flowArrow(surface, "agent-edge-runtime", 1780, 683, 1798, 683),
      chip(surface, "agent-validate", {
        x: 620,
        y: rowY,
        width: 150,
        height: 66,
        fontSize: 12,
      }),
      chip(surface, "agent-identity", {
        x: 788,
        y: rowY,
        width: 150,
        height: 66,
        fontSize: 12,
      }),
      chip(surface, "agent-route", {
        x: 956,
        y: rowY,
        width: 190,
        height: 66,
        fontSize: 12,
      }),
      chip(surface, "agent-context", {
        x: 1164,
        y: rowY,
        width: 220,
        height: 66,
        fontSize: 12,
      }),
      chip(surface, "agent-executor", {
        x: 1402,
        y: rowY,
        width: 180,
        height: 66,
        accent: true,
        fontSize: 13,
      }),
      chip(surface, "agent-evidence", {
        x: 1600,
        y: rowY,
        width: 180,
        height: 66,
        fontSize: 12,
      }),
      chip(surface, "agent-repair", {
        x: 1798,
        y: rowY,
        width: 168,
        height: 66,
        fontSize: 12,
      }),
      chip(surface, "agent-sql", {
        x: 1065,
        y: 742,
        width: 180,
        height: 43,
        fontSize: 11,
      }),
      chip(surface, "agent-docs", {
        x: 1260,
        y: 742,
        width: 235,
        height: 43,
        fontSize: 11,
      }),
      curvedArrow(
        surface,
        "agent-edge-evidence",
        "M 1155 742 C 1200 720, 1330 720, 1460 716",
      ),
      curvedArrow(
        surface,
        "agent-edge-evidence",
        "M 1378 742 C 1410 730, 1445 724, 1490 716",
      ),
      strip(surface, "agent-state-off", {
        x: 650,
        y: 748,
        width: 350,
        fontSize: 10.5,
      }),
      strip(surface, "agent-mlflow", {
        x: 1515,
        y: 748,
        width: 430,
        fontSize: 10.5,
      }),
      curvedArrow(
        surface,
        "agent-edge-runtime-response",
        "M 1966 683 C 2040 705, 2020 842, 1885 932",
      ),
    ].join(""),
  );
}

function agentResponsePlane(surface) {
  const y = 865;
  return group(
    [
      planeShell(surface, "agent-plane-response", {
        x: 260,
        y,
        width: 1800,
        height: 240,
      }),
      flowArrow(surface, "agent-edge-response", 930, 957, 952, 957),
      flowArrow(surface, "agent-edge-response", 1242, 957, 1264, 957),
      flowArrow(surface, "agent-edge-response", 1519, 957, 1541, 957),
      flowArrow(surface, "agent-edge-response", 1741, 957, 1763, 957),
      chip(surface, "agent-contract", {
        x: 620,
        y: 920,
        width: 310,
        height: 74,
        accent: true,
        fontSize: 14,
      }),
      chip(surface, "agent-adapter", {
        x: 952,
        y: 920,
        width: 290,
        height: 74,
        fontSize: 13,
      }),
      chip(surface, "agent-events", {
        x: 1264,
        y: 920,
        width: 255,
        height: 74,
        fontSize: 12,
      }),
      chip(surface, "agent-ondata", {
        x: 1541,
        y: 920,
        width: 200,
        height: 74,
        fontSize: 13,
      }),
      chip(surface, "agent-renderers", {
        x: 1763,
        y: 920,
        width: 255,
        height: 74,
        fontSize: 12,
      }),
      strip(surface, "agent-contract-fields", {
        x: 620,
        y: 1015,
        width: 610,
        fontSize: 10.5,
      }),
      strip(surface, "agent-renderer-kinds", {
        x: 1250,
        y: 1015,
        width: 768,
        accent: true,
        fontSize: 10.5,
      }),
      strip(surface, "agent-public-summary", {
        x: 620,
        y: 1062,
        width: 540,
        fontSize: 10.5,
      }),
    ].join(""),
  );
}

function agentMaster(surface) {
  return [
    masterHeader(surface, "agent-title", "agent-subtitle"),
    masterGuides(),
    agentRequestPlane(surface),
    agentRuntimePlane(surface),
    agentResponsePlane(surface),
    masterFooter(surface),
  ].join("");
}

function skillResolvePlane(surface) {
  return group(
    [
      planeShell(surface, "skills-plane-resolve", {
        x: 260,
        y: 235,
        width: 1800,
        height: 230,
      }),
      strip(surface, "skills-target", {
        x: 650,
        y: 257,
        width: 345,
        accent: true,
        fontSize: 11,
      }),
      flowArrow(surface, "skills-edge-resolve", 850, 362, 870, 362),
      flowArrow(surface, "skills-edge-resolve", 1120, 362, 1140, 362),
      flowArrow(surface, "skills-edge-resolve", 1420, 362, 1440, 362),
      flowArrow(surface, "skills-edge-resolve", 1740, 362, 1760, 362),
      chip(surface, "skills-manifest", {
        x: 620,
        y: 325,
        width: 230,
        height: 74,
        fontSize: 12,
      }),
      chip(surface, "skills-pair", {
        x: 870,
        y: 325,
        width: 250,
        height: 74,
        fontSize: 12,
      }),
      chip(surface, "skills-history", {
        x: 1140,
        y: 325,
        width: 280,
        height: 74,
        fontSize: 12,
      }),
      chip(surface, "skills-composition", {
        x: 1440,
        y: 325,
        width: 300,
        height: 74,
        fontSize: 12,
      }),
      chip(surface, "skills-loaded", {
        x: 1760,
        y: 325,
        width: 210,
        height: 74,
        accent: true,
        fontSize: 13,
      }),
      strip(surface, "skills-yaml", {
        x: 870,
        y: 415,
        width: 238,
        fontSize: 10.5,
      }),
      strip(surface, "skills-markdown", {
        x: 1124,
        y: 415,
        width: 270,
        fontSize: 10.5,
      }),
      curvedArrow(
        surface,
        "skills-edge-delta",
        "M 852 433 C 960 433, 1030 408, 1140 395",
      ),
      strip(surface, "skills-delta", {
        x: 620,
        y: 415,
        width: 232,
        fontSize: 10,
      }),
      strip(surface, "skills-draft", {
        x: 1480,
        y: 415,
        width: 350,
        fontSize: 10.5,
      }),
      curvedArrow(
        surface,
        "skills-edge-resolve-context",
        "M 1970 362 C 2030 390, 2025 492, 1940 590",
      ),
    ].join(""),
  );
}

function skillContextPlane(surface) {
  return group(
    [
      planeShell(surface, "skills-plane-context", {
        x: 260,
        y: 535,
        width: 1800,
        height: 285,
      }),
      flowArrow(surface, "skills-edge-state-adg", 925, 607, 947, 607),
      flowArrow(surface, "skills-edge-state-adg", 1227, 607, 1249, 607),
      chip(surface, "skills-state", {
        x: 650,
        y: 570,
        width: 275,
        height: 74,
        fontSize: 12,
      }),
      chip(surface, "skills-adg", {
        x: 947,
        y: 570,
        width: 280,
        height: 74,
        accent: true,
        fontSize: 13,
      }),
      chip(surface, "skills-phase-contracts", {
        x: 1249,
        y: 570,
        width: 270,
        height: 74,
        fontSize: 12,
      }),
      strip(surface, "skills-not-funnel", {
        x: 1541,
        y: 587,
        width: 410,
        fontSize: 10.5,
      }),
      flowArrow(surface, "skills-edge-context", 930, 715, 952, 715),
      flowArrow(surface, "skills-edge-context", 1282, 715, 1304, 715),
      chip(surface, "skills-current", {
        x: 650,
        y: 678,
        width: 280,
        height: 74,
        fontSize: 12,
      }),
      chip(surface, "skills-successors", {
        x: 952,
        y: 678,
        width: 330,
        height: 74,
        fontSize: 12,
      }),
      chip(surface, "skills-context-schema", {
        x: 1304,
        y: 678,
        width: 300,
        height: 74,
        accent: true,
        fontSize: 14,
      }),
      strip(surface, "skills-context-cap", {
        x: 1624,
        y: 678,
        width: 330,
        accent: true,
        fontSize: 10.5,
      }),
      strip(surface, "skills-followup-only", {
        x: 650,
        y: 769,
        width: 340,
        fontSize: 10,
      }),
      strip(surface, "skills-context-payload", {
        x: 1006,
        y: 769,
        width: 650,
        fontSize: 10,
      }),
      strip(surface, "skills-state-off", {
        x: 1672,
        y: 769,
        width: 282,
        fontSize: 10,
      }),
      curvedArrow(
        surface,
        "skills-edge-context-authority",
        "M 1954 715 C 2035 742, 2010 845, 1890 928",
      ),
    ].join(""),
  );
}

function skillAuthorityPlane(surface) {
  return group(
    [
      planeShell(surface, "skills-plane-authority", {
        x: 260,
        y: 870,
        width: 1800,
        height: 255,
      }),
      flowArrow(surface, "skills-edge-authority", 970, 961, 994, 961),
      flowArrow(surface, "skills-edge-authority", 1294, 961, 1318, 961),
      flowArrow(surface, "skills-edge-authority", 1518, 961, 1542, 961),
      chip(surface, "skills-hints", {
        x: 620,
        y: 922,
        width: 350,
        height: 78,
        fontSize: 12,
      }),
      chip(surface, "skills-selector", {
        x: 994,
        y: 922,
        width: 300,
        height: 78,
        fontSize: 14,
      }),
      chip(surface, "skills-schema-budget", {
        x: 1318,
        y: 922,
        width: 200,
        height: 78,
        accent: true,
        fontSize: 13,
      }),
      chip(surface, "skills-executor", {
        x: 1542,
        y: 922,
        width: 410,
        height: 78,
        accent: true,
        fontSize: 15,
      }),
      strip(surface, "skills-intersection", {
        x: 994,
        y: 1018,
        width: 524,
        fontSize: 10.5,
      }),
      strip(surface, "skills-executor-rules", {
        x: 1542,
        y: 1018,
        width: 410,
        fontSize: 9.5,
      }),
      strip(surface, "skills-shadow", {
        x: 620,
        y: 1068,
        width: 575,
        fontSize: 10,
      }),
      strip(surface, "skills-no-authority", {
        x: 1215,
        y: 1068,
        width: 737,
        accent: true,
        fontSize: 10,
      }),
      chip(surface, "skills-instruction-rag", {
        x: 650,
        y: 1152,
        width: 555,
        height: 48,
        fontSize: 11,
      }),
    ].join(""),
  );
}

function skillMaster(surface) {
  return [
    masterHeader(surface, "skills-title", "skills-subtitle"),
    masterGuides(),
    skillResolvePlane(surface),
    skillContextPlane(surface),
    skillAuthorityPlane(surface),
    masterFooter(surface, true),
  ].join("");
}

const generated = OUTPUTS.map((output) => {
  const content = output.render(output.surface);
  const claimIds = [...(renderedClaims.get(output.surface) ?? [])].sort();
  return {
    ...output,
    content: svgDocument({
      id: output.surface,
      title: output.title,
      description: output.description,
      content,
      transparent: output.transparent,
      palette,
      width: WIDTH,
      height: HEIGHT,
      metadata: {
        schema_version: ledger.schema_version,
        surface: output.surface,
        source_ledger: "scripts/move-visuals/truth-ledger.json",
        generator: "scripts/generate-move-visuals.mjs",
        snapshots: ledger.snapshots,
        claim_ids: claimIds,
      },
    }),
  };
});

for (const claimEntry of ledger.claims) {
  for (const surface of claimEntry.surfaces) {
    if (
      renderedClaims.has(surface) &&
      !renderedClaims.get(surface).has(claimEntry.id)
    ) {
      throw new Error(
        `Claim ${claimEntry.id} is approved for ${surface} but was not rendered.`,
      );
    }
  }
}

await mkdir(OUTPUT_DIRECTORY, { recursive: true });
await Promise.all(
  generated.map(({ filename, content }) =>
    writeFile(resolve(OUTPUT_DIRECTORY, filename), content, "utf8"),
  ),
);

console.log(
  `Wrote ${generated.length} deterministic MOVE SVG files to ${OUTPUT_DIRECTORY}`,
);

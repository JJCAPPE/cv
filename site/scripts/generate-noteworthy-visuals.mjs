import { mkdir, readFile, writeFile } from "node:fs/promises";
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
} from "./noteworthy-visuals/svg-kit.mjs";

const WIDTH = 2400;
const HEIGHT = 1350;
const SCRIPT_DIRECTORY = dirname(fileURLToPath(import.meta.url));
const LEDGER_PATH = resolve(
  SCRIPT_DIRECTORY,
  "noteworthy-visuals/truth-ledger.json",
);
const OUTPUT_DIRECTORY = resolve(
  process.cwd(),
  process.argv[2] ?? "public/media/projects/ai-notes-or-ocr/technical",
);

const palette = {
  bg: "#0a0b0d",
  panel: "#14171a",
  panelRaised: "#1b2024",
  panelDeep: "#0e1114",
  surface: "#232a2f",
  line: "#536069",
  lineSoft: "#2a3238",
  fg: "#f2efe7",
  muted: "#a8adb0",
  subtle: "#707a80",
  accent: "#e9cf3e",
  secondary: "#71d0c6",
  proposed: "#ef8b68",
  historical: "#767a7c",
  ink: "#11130f",
  page: "#ebe7dc",
  pageInk: "#252723",
  definition: "#a82722",
  example: "#3b9691",
};

const SURFACES = {
  master: "noteworthy-agent-exploded",
  ingest: "noteworthy-agent-ingest-layer",
  generation: "noteworthy-agent-generation-layer",
  compile: "noteworthy-agent-compile-layer",
  output: "noteworthy-agent-output-layer",
  proposed: "noteworthy-agent-proposed-layer",
  document: "noteworthy-document-exploded",
};

const OUTPUTS = [
  {
    surface: SURFACES.master,
    filename: "noteworthy-agent-exploded.svg",
    title: "NoteWorthy current execution atlas",
    description:
      "Exploded source-led system tracing image preparation and validation through Gemini streamed LaTeX generation, template composition, configurable HTTP compilation, PDF verification, and browser output. Historical Socket.IO and Docker latexmk paths are isolated below the current execution spine.",
    transparent: false,
    render: renderAgentMaster,
  },
  {
    surface: SURFACES.ingest,
    filename: "noteworthy-agent-ingest-layer.svg",
    title: "NoteWorthy ingest and request boundary",
    description:
      "Transparent aligned layer isolating client compression, the current SSE request, server image guards, and request-specific temporary storage cleanup.",
    transparent: true,
    render: (surface) => renderIngest(surface, true),
  },
  {
    surface: SURFACES.generation,
    filename: "noteworthy-agent-generation-layer.svg",
    title: "NoteWorthy multimodal generation boundary",
    description:
      "Transparent aligned layer isolating parallel Gemini file uploads, processing and model selections, streamed LaTeX generation, the generation deadline, and deterministic body cleanup.",
    transparent: true,
    render: (surface) => renderGeneration(surface, true),
  },
  {
    surface: SURFACES.compile,
    filename: "noteworthy-agent-compile-layer.svg",
    title: "NoteWorthy composition and compiler boundary",
    description:
      "Transparent aligned layer isolating template insertion, the configured HTTP compiler fallback chain, bounded retries, and PDF magic-byte verification.",
    transparent: true,
    render: (surface) => renderCompile(surface, true),
  },
  {
    surface: SURFACES.output,
    filename: "noteworthy-agent-output-layer.svg",
    title: "NoteWorthy output and persistence boundary",
    description:
      "Transparent aligned layer isolating browser PDF and LaTeX exports plus the optional authenticated SavedPdf and PDF-combination path.",
    transparent: true,
    render: (surface) => renderOutput(surface, true),
  },
  {
    surface: SURFACES.proposed,
    filename: "noteworthy-agent-proposed-layer.svg",
    title: "NoteWorthy proposed conceptual ML-CV layer",
    description:
      "Transparent aligned proposed layer, visibly disconnected from the current runtime, showing conceptual perspective and illumination normalization, a math-aware layout graph, region uncertainty, compile-repair, and render-regression evaluation.",
    transparent: true,
    render: renderProposed,
  },
  {
    surface: SURFACES.document,
    filename: "noteworthy-document-exploded.svg",
    title: "NoteWorthy supplied source to render artifact",
    description:
      "Exploded document view linking the supplied 7,237-line LaTeX source, its imported dependencies and macro grammar, TikZ and PGFPlots structures, and selected pages from the supplied 110-page generated PDF.",
    transparent: false,
    render: renderDocument,
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
    "offline",
    "proposed",
  ]);
  const allowedConfidence = new Set(["verified", "qualified"]);
  const allowedSurfaceTypes = new Set([
    "master",
    "cover",
    "companion",
    "caption",
  ]);
  const outputSurfaces = new Set(OUTPUTS.map(({ surface }) => surface));
  const placeholder = /\b(?:TODO|TBD|REPLACE|PLACEHOLDER)\b/i;

  if (value?.schema_version !== "noteworthy.visual_truth.v1") {
    throw new Error("Unsupported NoteWorthy visual truth ledger schema.");
  }
  if (!value.snapshots || !value.sources || !Array.isArray(value.claims)) {
    throw new Error("The NoteWorthy visual truth ledger is incomplete.");
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
      !claim.source ||
      !Array.isArray(claim.source_refs) ||
      claim.source_refs.length === 0 ||
      !Array.isArray(claim.surfaces) ||
      claim.surfaces.length === 0 ||
      !Array.isArray(claim.rendered_surfaces) ||
      claim.rendered_surfaces.length === 0 ||
      !claim.notes
    ) {
      throw new Error(`Claim ${claim.id} is missing evidence fields.`);
    }
    if (placeholder.test(`${claim.display} ${claim.claim}`)) {
      throw new Error(`Claim ${claim.id} contains placeholder text.`);
    }
    if (!allowedScopes.has(claim.scope)) {
      throw new Error(
        `Claim ${claim.id} has unsupported scope ${claim.scope}.`,
      );
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
    if (claim.surfaces.some((surface) => !allowedSurfaceTypes.has(surface))) {
      throw new Error(`Claim ${claim.id} has an unsupported surface type.`);
    }
    if (
      claim.rendered_surfaces.some((surface) => !outputSurfaces.has(surface))
    ) {
      throw new Error(`Claim ${claim.id} has an unknown rendered surface.`);
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
    throw new Error(`Rendered claim ${id} is missing from the ledger.`);
  }
  if (!entry.rendered_surfaces.includes(surface)) {
    throw new Error(
      `Claim ${id} is not approved for rendered surface ${surface}.`,
    );
  }
  renderedClaims.get(surface)?.add(id);
  return entry;
}

function labelClaim(
  surface,
  id,
  x,
  y,
  {
    maxCharacters = 28,
    maxLines = 2,
    lineHeight = 23,
    fill = palette.fg,
    fontSize = 18,
    fontWeight = 650,
    letterSpacing = 0.4,
    className = "mono",
  } = {},
) {
  const claim = recordClaim(surface, id);
  return multilineText(
    x,
    y,
    wrapWords(claim.display, maxCharacters, maxLines),
    {
      className,
      fill,
      fontSize,
      fontWeight,
      letterSpacing,
    },
    lineHeight,
  );
}

function headerBlock(surface, labelId, titleValue, subtitle) {
  return group(
    [
      labelClaim(surface, labelId, 112, 94, {
        fill: palette.accent,
        fontSize: 16,
        maxCharacters: 45,
        maxLines: 1,
      }),
      text(112, 164, titleValue, {
        className: "display",
        fill: palette.fg,
        fontSize: 64,
        fontWeight: 720,
        letterSpacing: -2,
      }),
      text(112, 208, subtitle, {
        className: "mono",
        fill: palette.muted,
        fontSize: 17,
        letterSpacing: 0.6,
      }),
      line(112, 244, 2288, 244, {
        stroke: palette.line,
        strokeWidth: 1.5,
      }),
      text(2288, 94, "2400 × 1350 / SVG MASTER", {
        className: "mono",
        fill: palette.subtle,
        fontSize: 14,
        textAnchor: "end",
        letterSpacing: 1,
      }),
      text(2288, 126, "SOLID DEFAULT  ·  DASH OPTIONAL", {
        className: "mono",
        fill: palette.subtle,
        fontSize: 14,
        textAnchor: "end",
        letterSpacing: 0.7,
      }),
    ].join(""),
  );
}

function panelFrame({
  x,
  y,
  width,
  height,
  index,
  titleValue,
  subtitle,
  children,
  active = false,
  activeColor = palette.accent,
  frameColor = palette.line,
}) {
  const border = active ? activeColor : frameColor;
  const topFace = [
    [x, y],
    [x + 18, y - 18],
    [x + width + 18, y - 18],
    [x + width, y],
  ];
  const sideFace = [
    [x + width, y],
    [x + width + 18, y - 18],
    [x + width + 18, y + height - 18],
    [x + width, y + height],
  ];

  return group(
    [
      rect(x + 16, y + 16, width, height, {
        rx: 7,
        fill: palette.panelDeep,
        opacity: 0.76,
      }),
      polygon(topFace, {
        fill: active ? "#3b3821" : palette.surface,
        stroke: border,
        strokeWidth: active ? 2.4 : 1.4,
      }),
      polygon(sideFace, {
        fill: active ? "#282717" : palette.panelDeep,
        stroke: border,
        strokeWidth: active ? 2.4 : 1.4,
      }),
      rect(x, y, width, height, {
        rx: 7,
        fill: active ? "#17191a" : palette.panel,
        stroke: border,
        strokeWidth: active ? 2.4 : 1.4,
      }),
      rect(x, y, width, 88, {
        rx: 7,
        fill: active ? "#22231b" : palette.panelRaised,
      }),
      line(x, y + 88, x + width, y + 88, {
        stroke: border,
        strokeWidth: 1.2,
      }),
      text(x + 24, y + 34, index, {
        className: "mono",
        fill: active ? activeColor : palette.secondary,
        fontSize: 14,
        fontWeight: 700,
        letterSpacing: 1.3,
      }),
      text(x + 24, y + 65, titleValue, {
        className: "display",
        fill: palette.fg,
        fontSize: 28,
        fontWeight: 720,
        letterSpacing: -0.4,
      }),
      text(x + width - 24, y + 34, subtitle, {
        className: "mono",
        fill: palette.subtle,
        fontSize: 12,
        textAnchor: "end",
        letterSpacing: 0.9,
      }),
      line(x + width - 50, y + height - 18, x + width - 18, y + height - 18, {
        stroke: active ? activeColor : frameColor,
        strokeWidth: 1.2,
      }),
      line(x + width - 18, y + height - 50, x + width - 18, y + height - 18, {
        stroke: active ? activeColor : frameColor,
        strokeWidth: 1.2,
      }),
      children,
    ].join(""),
  );
}

function claimNode(
  surface,
  id,
  x,
  y,
  width,
  height,
  { active = false, activeColor = palette.accent, index = "•" } = {},
) {
  const claim = claimsById.get(id);
  const optional = claim?.scope === "optional";
  const proposed = claim?.scope === "proposed";
  const border = active
    ? activeColor
    : proposed
      ? palette.proposed
      : palette.line;
  const scopeLabel = proposed
    ? "PROPOSED"
    : optional
      ? "OPTIONAL"
      : "DEFAULT";
  const node = [
    rect(x, y, width, height, {
      rx: 5,
      fill: active ? "#24231a" : palette.panelDeep,
      stroke: optional ? palette.muted : border,
      strokeWidth: active ? 2 : 1.2,
      strokeDasharray: proposed ? "7 6" : optional ? "10 8" : undefined,
    }),
    text(x + 16, y + 25, index, {
      className: "mono",
      fill: active
        ? activeColor
        : proposed
          ? palette.proposed
          : palette.secondary,
      fontSize: 12,
      fontWeight: 700,
    }),
    text(x + width - 16, y + 25, scopeLabel, {
      className: "mono",
      fill: palette.subtle,
      fontSize: 10,
      fontWeight: 650,
      textAnchor: "end",
      letterSpacing: 0.8,
    }),
    labelClaim(surface, id, x + 16, y + 54, {
      maxCharacters: Math.max(18, Math.floor(width / 13)),
      maxLines: 2,
      fontSize: width < 410 ? 15 : 16,
      lineHeight: 21,
      fill: palette.fg,
    }),
  ];
  return group(node.join(""));
}

function panelSpine(
  x,
  top,
  bottom,
  active,
  activeColor = palette.accent,
  idleColor = palette.secondary,
) {
  return group(
    [
      line(x, top, x, bottom, {
        stroke: active ? activeColor : idleColor,
        strokeWidth: active ? 3 : 2,
        strokeOpacity: active ? 1 : 0.75,
      }),
      circle(x, top, 7, {
        fill: active ? activeColor : idleColor,
      }),
      circle(x, bottom, 7, {
        fill: active ? activeColor : idleColor,
      }),
    ].join(""),
  );
}

function renderIngest(surface, active = false) {
  const x = 100;
  const y = 338;
  const width = 470;
  const height = 594;
  const children = [
    panelSpine(x + 38, y + 122, y + 544, active),
    claimNode(surface, "client_prep", x + 70, y + 116, 366, 92, {
      active,
      index: "I.1",
    }),
    claimNode(surface, "sse_request", x + 70, y + 228, 366, 92, {
      active,
      index: "I.2",
    }),
    claimNode(surface, "route_guards", x + 70, y + 340, 366, 92, {
      active,
      index: "I.3",
    }),
    claimNode(surface, "temp_cleanup", x + 70, y + 452, 366, 92, {
      active,
      index: "I.4",
    }),
  ];
  return panelFrame({
    x,
    y,
    width,
    height,
    index: "01",
    titleValue: "INGEST + GUARD",
    subtitle: "BROWSER → NODE ROUTE",
    children: children.join(""),
    active,
  });
}

function renderGeneration(surface, active = false) {
  const x = 620;
  const y = 274;
  const width = 520;
  const height = 658;
  const children = [
    panelSpine(x + 40, y + 123, y + 610, active),
    claimNode(surface, "parallel_upload", x + 74, y + 116, 410, 86, {
      active,
      index: "G.1",
    }),
    claimNode(surface, "generation_modes", x + 74, y + 220, 410, 86, {
      active,
      index: "G.2",
    }),
    claimNode(surface, "model_selection", x + 74, y + 324, 410, 86, {
      active,
      index: "G.3",
    }),
    claimNode(surface, "streamed_body", x + 74, y + 428, 410, 86, {
      active,
      index: "G.4",
    }),
    claimNode(surface, "body_cleanup", x + 74, y + 532, 410, 86, {
      active,
      index: "G.5",
    }),
  ];
  return panelFrame({
    x,
    y,
    width,
    height,
    index: "02",
    titleValue: "MULTIMODAL GENERATE",
    subtitle: "GEMINI FILE + STREAM",
    children: children.join(""),
    active,
  });
}

function renderCompile(surface, active = false) {
  const x = 1190;
  const y = 338;
  const width = 500;
  const height = 594;
  const children = [
    panelSpine(x + 40, y + 134, y + 492, active),
    claimNode(surface, "template_compose", x + 74, y + 128, 390, 104, {
      active,
      index: "C.1",
    }),
    claimNode(surface, "compiler_chain", x + 74, y + 258, 390, 104, {
      active,
      index: "C.2",
    }),
    claimNode(surface, "retry_verify", x + 74, y + 388, 390, 104, {
      active,
      index: "C.3",
    }),
    text(x + 74, y + 535, "CONFIGURED TARGETS STAY OUTSIDE THE APP", {
      className: "mono",
      fill: palette.subtle,
      fontSize: 11,
      letterSpacing: 0.7,
    }),
  ];
  return panelFrame({
    x,
    y,
    width,
    height,
    index: "03",
    titleValue: "COMPOSE + COMPILE",
    subtitle: "TEMPLATE → HTTP",
    children: children.join(""),
    active,
  });
}

function renderOutput(surface, active = false) {
  const x = 1740;
  const y = 274;
  const width = 560;
  const height = 658;
  const children = [
    panelSpine(x + 42, y + 138, y + 488, active),
    claimNode(surface, "output_exports", x + 78, y + 132, 442, 132, {
      active,
      index: "O.1",
    }),
    claimNode(surface, "saved_pdf_option", x + 78, y + 296, 442, 132, {
      active,
      index: "O.2",
    }),
    group(
      [
        rect(x + 92, y + 470, 300, 122, {
          rx: 4,
          fill: palette.page,
          stroke: active ? palette.accent : palette.line,
          strokeWidth: active ? 2 : 1.2,
        }),
        rect(x + 112, y + 490, 104, 15, {
          fill: palette.definition,
          opacity: 0.88,
        }),
        rect(x + 112, y + 520, 250, 8, {
          fill: palette.pageInk,
          opacity: 0.5,
        }),
        rect(x + 112, y + 540, 220, 8, {
          fill: palette.pageInk,
          opacity: 0.34,
        }),
        rect(x + 112, y + 566, 250, 11, {
          fill: palette.example,
          opacity: 0.72,
        }),
        text(x + 418, y + 537, "%PDF", {
          className: "mono",
          fill: active ? palette.accent : palette.secondary,
          fontSize: 20,
          fontWeight: 750,
        }),
      ].join(""),
    ),
  ];
  return panelFrame({
    x,
    y,
    width,
    height,
    index: "04",
    titleValue: "OUTPUT + LIBRARY",
    subtitle: "BROWSER / OPTIONAL DB",
    children: children.join(""),
    active,
  });
}

function currentSpine() {
  const segments = [
    "M 570 634 C 592 634 598 603 620 603",
    "M 1140 603 C 1162 603 1168 634 1190 634",
    "M 1690 634 C 1712 634 1718 603 1740 603",
  ];
  return group(
    [
      ...segments.map((d) =>
        path(d, {
          className: "active-line",
          markerEnd: "url(#arrow-active)",
        }),
      ),
      circle(595, 620, 5, { fill: palette.accent }),
      circle(1165, 620, 5, { fill: palette.accent }),
      circle(1715, 620, 5, { fill: palette.accent }),
    ].join(""),
    { ariaHidden: true },
  );
}

function renderHistorical(surface) {
  const heading = recordClaim(surface, "historical_scope");
  const socket = recordClaim(surface, "historical_socket");
  const latexmk = recordClaim(surface, "historical_latexmk");
  return group(
    [
      line(112, 1008, 2288, 1008, {
        stroke: palette.line,
        strokeWidth: 1.2,
      }),
      text(112, 1048, heading.display, {
        className: "mono",
        fill: palette.historical,
        fontSize: 15,
        fontWeight: 700,
        letterSpacing: 1.1,
      }),
      path("M 112 1117 H 2288", {
        className: "optional-line",
        stroke: palette.historical,
        strokeOpacity: 0.62,
      }),
      rect(238, 1078, 478, 106, {
        rx: 4,
        fill: palette.panelDeep,
        stroke: palette.historical,
        strokeWidth: 1.2,
        strokeDasharray: "9 8",
        opacity: 0.76,
      }),
      text(262, 1108, "TRANSPORT", {
        className: "mono",
        fill: palette.subtle,
        fontSize: 11,
        letterSpacing: 1,
      }),
      multilineText(
        262,
        1143,
        wrapWords(socket.display, 28, 2),
        {
          className: "mono",
          fill: palette.historical,
          fontSize: 17,
          fontWeight: 650,
        },
        21,
      ),
      rect(1684, 1078, 478, 106, {
        rx: 4,
        fill: palette.panelDeep,
        stroke: palette.historical,
        strokeWidth: 1.2,
        strokeDasharray: "9 8",
        opacity: 0.76,
      }),
      text(1708, 1108, "COMPILER", {
        className: "mono",
        fill: palette.subtle,
        fontSize: 11,
        letterSpacing: 1,
      }),
      multilineText(
        1708,
        1143,
        wrapWords(latexmk.display, 28, 2),
        {
          className: "mono",
          fill: palette.historical,
          fontSize: 17,
          fontWeight: 650,
        },
        21,
      ),
      text(
        1200,
        1246,
        "REPOSITORY RAILS / NOT THE CURRENT CLIENT OR DEFAULT COMPILER",
        {
          className: "mono",
          fill: palette.subtle,
          fontSize: 12,
          textAnchor: "middle",
          letterSpacing: 0.8,
        },
      ),
    ].join(""),
  );
}

function renderAgentMaster(surface) {
  return [
    headerBlock(
      surface,
      "current_scope",
      "NOTEWORTHY / EXECUTION ATLAS",
      "IMAGE NOTES → STREAMED LATEX BODY → COMPOSED SOURCE → VERIFIED PDF BYTES",
    ),
    currentSpine(),
    renderIngest(surface),
    renderGeneration(surface),
    renderCompile(surface),
    renderOutput(surface),
    renderHistorical(surface),
  ].join("");
}

function proposedPanelFrame({
  x,
  y,
  width,
  height,
  index,
  titleValue,
  subtitle,
  children,
  active,
}) {
  return panelFrame({
    x,
    y,
    width,
    height,
    index,
    titleValue,
    subtitle,
    children,
    active,
    activeColor: palette.proposed,
    frameColor: palette.proposed,
  });
}

function proposedClaimNode(surface, id, x, y, width, height, options = {}) {
  return claimNode(surface, id, x, y, width, height, {
    ...options,
    activeColor: palette.proposed,
  });
}

function renderProposedNormalize(surface, active = false) {
  const x = 76;
  const y = 348;
  const width = 400;
  const height = 520;
  const children = [
    panelSpine(
      x + 34,
      y + 132,
      y + 412,
      active,
      palette.proposed,
      palette.proposed,
    ),
    proposedClaimNode(
      surface,
      "proposed_normalization",
      x + 62,
      y + 172,
      304,
      148,
      {
      active,
        index: "P.1",
      },
    ),
    text(x + 62, y + 450, "DESIGN HYPOTHESIS / NOT IMPLEMENTED", {
      className: "mono",
      fill: palette.subtle,
      fontSize: 11,
      letterSpacing: 0.8,
    }),
  ];

  return proposedPanelFrame({
    x,
    y,
    width,
    height,
    index: "01",
    titleValue: "NORMALIZE",
    subtitle: "CONCEPTUAL INPUT",
    children: children.join(""),
    active,
  });
}

function renderProposedLayout(surface, active = false) {
  const x = 512;
  const y = 310;
  const width = 400;
  const height = 558;
  const children = [
    panelSpine(
      x + 34,
      y + 132,
      y + 432,
      active,
      palette.proposed,
      palette.proposed,
    ),
    proposedClaimNode(surface, "proposed_layout", x + 62, y + 172, 304, 150, {
      active,
      index: "P.2",
    }),
    group(
      [
        rect(x + 72, y + 448, 92, 54, {
          rx: 3,
          fill: "#291b18",
          stroke: palette.proposed,
          strokeWidth: 1.2,
          strokeDasharray: "6 5",
        }),
        rect(x + 178, y + 448, 78, 54, {
          rx: 3,
          fill: "#172321",
          stroke: palette.secondary,
          strokeWidth: 1.2,
        }),
        rect(x + 270, y + 448, 72, 54, {
          rx: 3,
          fill: palette.panelDeep,
          stroke: palette.line,
          strokeWidth: 1.2,
        }),
        text(x + 118, y + 480, "01", {
          className: "mono",
          fill: palette.fg,
          fontSize: 13,
          textAnchor: "middle",
        }),
        text(x + 217, y + 480, "02", {
          className: "mono",
          fill: palette.fg,
          fontSize: 13,
          textAnchor: "middle",
        }),
        text(x + 306, y + 480, "03", {
          className: "mono",
          fill: palette.fg,
          fontSize: 13,
          textAnchor: "middle",
        }),
      ].join(""),
    ),
  ];

  return proposedPanelFrame({
    x,
    y,
    width,
    height,
    index: "02",
    titleValue: "STRUCTURE",
    subtitle: "CONCEPTUAL GRAPH",
    children: children.join(""),
    active,
  });
}

function renderProposedUncertainty(surface, active = false) {
  const x = 948;
  const y = 272;
  const width = 488;
  const height = 596;
  const children = [
    panelSpine(
      x + 36,
      y + 132,
      y + 522,
      active,
      palette.proposed,
      palette.proposed,
    ),
    proposedClaimNode(
      surface,
      "proposed_uncertainty",
      x + 66,
      y + 180,
      384,
      156,
      {
        active,
        index: "P.3",
      },
    ),
    ...[0.28, 0.54, 0.76].map((ratio, index) =>
      group(
        [
          rect(x + 82, y + 382 + index * 42, 350, 22, {
            rx: 2,
            fill: palette.panelDeep,
            stroke: palette.line,
            strokeWidth: 1,
          }),
          rect(x + 82, y + 382 + index * 42, Math.round(350 * ratio), 22, {
            rx: 2,
            fill: palette.proposed,
            opacity: 0.45 + index * 0.15,
          }),
        ].join(""),
      ),
    ),
    text(x + 66, y + 552, "NO NUMERIC CONFIDENCE IS CLAIMED", {
      className: "mono",
      fill: palette.subtle,
      fontSize: 10,
      letterSpacing: 0.65,
    }),
  ];

  return proposedPanelFrame({
    x,
    y,
    width,
    height,
    index: "03",
    titleValue: "UNCERTAINTY",
    subtitle: "CONCEPTUAL MAP",
    children: children.join(""),
    active,
  });
}

function renderProposedRepair(surface, active = false) {
  const x = 1472;
  const y = 310;
  const width = 412;
  const height = 558;
  const children = [
    panelSpine(
      x + 34,
      y + 132,
      y + 470,
      active,
      palette.proposed,
      palette.proposed,
    ),
    proposedClaimNode(
      surface,
      "proposed_compile_repair",
      x + 62,
      y + 190,
      316,
      170,
      {
        active,
        index: "P.4",
      },
    ),
    path(`M ${x + 110} ${y + 418} H ${x + 322}`, {
      className: "proposed-line",
      markerEnd: "url(#arrow-proposed)",
    }),
  ];

  return proposedPanelFrame({
    x,
    y,
    width,
    height,
    index: "04",
    titleValue: "REPAIR",
    subtitle: "CONCEPTUAL LOOP",
    children: children.join(""),
    active,
  });
}

function renderProposedRegression(surface, active = false) {
  const x = 1920;
  const y = 348;
  const width = 404;
  const height = 520;
  const children = [
    panelSpine(
      x + 34,
      y + 128,
      y + 438,
      active,
      palette.proposed,
      palette.proposed,
    ),
    proposedClaimNode(
      surface,
      "proposed_render_regression",
      x + 62,
      y + 184,
      308,
      168,
      {
        active,
        index: "P.5",
      },
    ),
  ];

  return proposedPanelFrame({
    x,
    y,
    width,
    height,
    index: "05",
    titleValue: "REGRESSION",
    subtitle: "CONCEPTUAL GATE",
    children: children.join(""),
    active,
  });
}

function proposedSpine() {
  const segments = [
    "M 476 606 C 490 606 498 589 512 589",
    "M 912 589 C 926 589 934 570 948 570",
    "M 1436 570 C 1450 570 1458 589 1472 589",
    "M 1884 589 C 1898 589 1906 606 1920 606",
  ];

  return group(
    segments
      .map((d) =>
        path(d, {
          className: "proposed-line",
          markerEnd: "url(#arrow-proposed)",
        }),
      )
      .join(""),
    { ariaHidden: true },
  );
}

function renderProposedBoundaryRail() {
  const columns = [
    {
      x: 112,
      width: 650,
      label: "STATUS",
      titleValue: "Proposed / conceptual",
      detail: "disconnected overlay · dashed paths · distinct coral signal",
    },
    {
      x: 874,
      width: 650,
      label: "IMPLEMENTATION",
      titleValue: "No shipped code path",
      detail: "not present in client · route · Gemini integration · compiler",
    },
    {
      x: 1636,
      width: 652,
      label: "EVIDENCE",
      titleValue: "No measured values",
      detail: "no accuracy · confidence · latency · quality claim",
    },
  ];

  return group(
    [
      rect(76, 954, 2248, 268, {
        rx: 6,
        fill: palette.panelDeep,
        stroke: palette.proposed,
        strokeWidth: 1.4,
        strokeDasharray: "10 7",
      }),
      text(112, 990, "PROPOSED BOUNDARY / REPEATED IN THE LAYER ITSELF", {
        className: "mono",
        fill: palette.proposed,
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: 1,
      }),
      ...columns.flatMap((column, index) => [
        rect(column.x, 1020, column.width, 150, {
          rx: 4,
          fill: palette.panel,
          stroke: index === 1 ? palette.secondary : palette.line,
          strokeWidth: 1.2,
        }),
        text(column.x + 22, 1052, column.label, {
          className: "mono",
          fill: palette.subtle,
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 0.9,
        }),
        text(column.x + 22, 1094, column.titleValue, {
          className: "display",
          fill: palette.fg,
          fontSize: 25,
          fontWeight: 700,
          letterSpacing: -0.35,
        }),
        multilineText(
          column.x + 22,
          1130,
          wrapWords(column.detail, Math.floor(column.width / 11), 2),
          {
            className: "mono",
            fill: palette.muted,
            fontSize: 13,
          },
          20,
        ),
      ]),
      path("M 762 1095 H 858", {
        className: "proposed-line",
        markerEnd: "url(#arrow-proposed)",
      }),
      path("M 1524 1095 H 1620", {
        className: "proposed-line",
        markerEnd: "url(#arrow-proposed)",
      }),
    ].join(""),
  );
}

function renderProposed(surface) {
  return [
    group(
      [
        labelClaim(surface, "proposed_scope", 112, 94, {
          fill: palette.proposed,
          fontSize: 16,
          maxCharacters: 52,
          maxLines: 1,
        }),
        text(112, 164, "NOTEWORTHY / PROPOSED ML-CV", {
          className: "display",
          fill: palette.fg,
          fontSize: 64,
          fontWeight: 720,
          letterSpacing: -2,
        }),
        text(
          112,
          208,
          "CONCEPTUAL EXTENSION / DISCONNECTED FROM THE SOURCE-VERIFIED RUNTIME",
          {
            className: "mono",
            fill: palette.muted,
            fontSize: 17,
            letterSpacing: 0.6,
          },
        ),
        line(112, 244, 2288, 244, {
          stroke: palette.line,
          strokeWidth: 1.5,
        }),
        text(2288, 94, "2400 × 1350 / ALIGNED OVERLAY", {
          className: "mono",
          fill: palette.subtle,
          fontSize: 14,
          textAnchor: "end",
          letterSpacing: 1,
        }),
        text(2288, 126, "DASHED CORAL = PROPOSED / NOT SHIPPED", {
          className: "mono",
          fill: palette.proposed,
          fontSize: 14,
          textAnchor: "end",
          letterSpacing: 0.8,
        }),
      ].join(""),
    ),
    proposedSpine(),
    renderProposedNormalize(surface, true),
    renderProposedLayout(surface, true),
    renderProposedUncertainty(surface, true),
    renderProposedRepair(surface, true),
    renderProposedRegression(surface, true),
    renderProposedBoundaryRail(),
    text(
      1200,
      1284,
      "PROPOSED / CONCEPTUAL  ·  NOT SHIPPED  ·  NO MEASURED RESULTS",
      {
        className: "mono",
        fill: palette.subtle,
        fontSize: 13,
        textAnchor: "middle",
        letterSpacing: 0.85,
      },
    ),
  ].join("");
}

function documentPanel({ x, y, width, height, index, titleValue, children }) {
  return panelFrame({
    x,
    y,
    width,
    height,
    index,
    titleValue,
    subtitle: "SUPPLIED ARTIFACT",
    children,
    active: false,
  });
}

function sourceArtifactPanel(surface) {
  const x = 100;
  const y = 310;
  const width = 610;
  const height = 798;
  recordClaim(surface, "artifact_dependencies");
  const codeLines = [
    "\\documentclass{report}",
    "\\input{preamble}",
    "\\input{macros}",
    "\\input{letterfonts}",
    "% document hierarchy",
    "\\chapter{Vector Fields}",
    "\\section{Vector Fields}",
    "\\dfn{...}{...}",
    "\\begin{tikzpicture}",
    "  \\begin{axis}[...]",
  ];
  const children = [
    labelClaim(surface, "artifact_source", x + 28, y + 128, {
      maxCharacters: 40,
      maxLines: 1,
      fill: palette.accent,
      fontSize: 18,
    }),
    rect(x + 28, y + 158, width - 56, 430, {
      rx: 4,
      fill: "#0b0d0f",
      stroke: palette.line,
      strokeWidth: 1.2,
    }),
    ...codeLines.map((value, index) =>
      text(x + 54, y + 194 + index * 34, value || " ", {
        className: "mono",
        fill:
          index >= 1 && index <= 3
            ? palette.secondary
            : index >= 7
              ? palette.accent
              : palette.fg,
        fontSize: 17,
      }),
    ),
    line(x + 46, y + 178, x + 46, y + 554, {
      stroke: palette.lineSoft,
      strokeWidth: 1,
    }),
    labelClaim(surface, "artifact_dependencies", x + 28, y + 642, {
      maxCharacters: 38,
      maxLines: 1,
      fontSize: 17,
    }),
    text(x + 28, y + 684, "SOURCE BOUNDARY", {
      className: "mono",
      fill: palette.subtle,
      fontSize: 11,
      letterSpacing: 1,
    }),
    multilineText(
      x + 28,
      y + 719,
      [
        "The supplied file is offered as-is.",
        "Its imported files and two images are not bundled.",
      ],
      {
        className: "sans",
        fill: palette.muted,
        fontSize: 17,
      },
      28,
    ),
  ];
  return documentPanel({
    x,
    y,
    width,
    height,
    index: "01",
    titleValue: "SOURCE CORPUS",
    children: children.join(""),
  });
}

function grammarArtifactPanel(surface) {
  const x = 760;
  const y = 250;
  const width = 790;
  const height = 858;
  const grammar = recordClaim(surface, "artifact_grammar");
  const hierarchy = recordClaim(surface, "artifact_hierarchy");
  const macroNames = grammar.display.split(" / ");
  const children = [
    multilineText(
      x + 34,
      y + 134,
      wrapWords(hierarchy.display, 34, 1),
      {
        className: "mono",
        fill: palette.accent,
        fontSize: 18,
        fontWeight: 700,
      },
      22,
    ),
    group(
      [
        rect(x + 34, y + 172, 722, 108, {
          rx: 4,
          fill: palette.panelDeep,
          stroke: palette.line,
          strokeWidth: 1.2,
        }),
        text(x + 58, y + 207, "\\chapter", {
          className: "mono",
          fill: palette.secondary,
          fontSize: 17,
          fontWeight: 700,
        }),
        text(x + 218, y + 207, "→", {
          className: "mono",
          fill: palette.accent,
          fontSize: 20,
        }),
        text(x + 270, y + 207, "\\section", {
          className: "mono",
          fill: palette.secondary,
          fontSize: 17,
          fontWeight: 700,
        }),
        text(x + 430, y + 207, "→", {
          className: "mono",
          fill: palette.accent,
          fontSize: 20,
        }),
        text(x + 482, y + 207, "macro block", {
          className: "mono",
          fill: palette.secondary,
          fontSize: 17,
          fontWeight: 700,
        }),
        text(x + 58, y + 248, "REPORT HIERARCHY / NUMBERED STRUCTURE", {
          className: "mono",
          fill: palette.subtle,
          fontSize: 11,
          letterSpacing: 0.9,
        }),
      ].join(""),
    ),
    text(x + 34, y + 326, "DOCUMENT GRAMMAR", {
      className: "mono",
      fill: palette.subtle,
      fontSize: 11,
      letterSpacing: 1,
    }),
    ...macroNames.map((value, index) => {
      const column = index % 3;
      const row = Math.floor(index / 3);
      const chipX = x + 34 + column * 242;
      const chipY = y + 350 + row * 102;
      return group(
        [
          rect(chipX, chipY, 218, 76, {
            rx: 4,
            fill: index % 2 === 0 ? "#221817" : "#15211f",
            stroke: index % 2 === 0 ? palette.definition : palette.example,
            strokeWidth: 1.2,
          }),
          text(chipX + 20, chipY + 47, `\\${value}`, {
            className: "mono",
            fill: palette.fg,
            fontSize: 20,
            fontWeight: 700,
          }),
        ].join(""),
      );
    }),
    labelClaim(surface, "artifact_graphics", x + 34, y + 616, {
      maxCharacters: 40,
      maxLines: 1,
      fill: palette.accent,
      fontSize: 18,
    }),
    group(
      [
        rect(x + 34, y + 650, 722, 140, {
          rx: 4,
          fill: palette.panelDeep,
          stroke: palette.line,
          strokeWidth: 1.2,
        }),
        path(
          `M ${x + 62} ${y + 748} C ${x + 160} ${y + 610}, ${x + 258} ${y + 790}, ${x + 356} ${y + 690} S ${x + 572} ${y + 620}, ${x + 714} ${y + 734}`,
          {
            fill: "none",
            stroke: palette.secondary,
            strokeWidth: 3,
          },
        ),
        line(x + 62, y + 748, x + 714, y + 748, {
          stroke: palette.line,
          strokeWidth: 1,
        }),
        line(x + 62, y + 674, x + 62, y + 748, {
          stroke: palette.line,
          strokeWidth: 1,
        }),
        text(x + 674, y + 682, "PGFPLOTS", {
          className: "mono",
          fill: palette.subtle,
          fontSize: 10,
          textAnchor: "end",
          letterSpacing: 0.8,
        }),
      ].join(""),
    ),
  ];
  return documentPanel({
    x,
    y,
    width,
    height,
    index: "02",
    titleValue: "STRUCTURE + GRAPHICS",
    children: children.join(""),
  });
}

function miniPage(x, y, width, height, pageNumber, emphasis) {
  return group(
    [
      rect(x + 10, y + 10, width, height, {
        fill: palette.panelDeep,
        opacity: 0.65,
      }),
      rect(x, y, width, height, {
        rx: 2,
        fill: palette.page,
        stroke: palette.line,
        strokeWidth: 1.1,
      }),
      rect(x + 18, y + 20, width - 36, 12, {
        fill: emphasis === "red" ? palette.definition : palette.example,
        opacity: 0.9,
      }),
      rect(x + 18, y + 52, width - 52, 6, {
        fill: palette.pageInk,
        opacity: 0.38,
      }),
      rect(x + 18, y + 70, width - 36, 6, {
        fill: palette.pageInk,
        opacity: 0.26,
      }),
      rect(x + 18, y + 98, width - 36, height - 132, {
        fill: emphasis === "red" ? "#f3dedd" : "#dcefed",
        stroke: emphasis === "red" ? palette.definition : palette.example,
        strokeWidth: 1,
      }),
      path(
        `M ${x + 34} ${y + height - 64} C ${x + width * 0.35} ${y + height - 160}, ${x + width * 0.62} ${y + height - 20}, ${x + width - 30} ${y + height - 102}`,
        {
          fill: "none",
          stroke: emphasis === "red" ? palette.definition : palette.example,
          strokeWidth: 2,
        },
      ),
      text(x + width - 16, y + height - 12, String(pageNumber), {
        className: "mono",
        fill: palette.pageInk,
        fontSize: 11,
        textAnchor: "end",
      }),
    ].join(""),
  );
}

function renderArtifactPanel(surface) {
  const x = 1600;
  const y = 310;
  const width = 700;
  const height = 798;
  const pdf = recordClaim(surface, "artifact_pdf");
  const previews = recordClaim(surface, "artifact_previews");
  const pages = [15, 42, 75, 83, 100];
  const children = [
    multilineText(
      x + 32,
      y + 130,
      wrapWords(pdf.display, 38, 1),
      {
        className: "mono",
        fill: palette.accent,
        fontSize: 18,
        fontWeight: 700,
      },
      22,
    ),
    text(x + 32, y + 168, "612 × 792 PT / PORTRAIT / NO CROP", {
      className: "mono",
      fill: palette.subtle,
      fontSize: 11,
      letterSpacing: 0.8,
    }),
    miniPage(x + 52, y + 216, 192, 250, pages[0], "blue"),
    miniPage(x + 258, y + 190, 192, 250, pages[1], "red"),
    miniPage(x + 464, y + 216, 192, 250, pages[2], "blue"),
    miniPage(x + 156, y + 482, 192, 250, pages[3], "red"),
    miniPage(x + 362, y + 456, 192, 250, pages[4], "blue"),
    multilineText(
      x + 32,
      y + 758,
      wrapWords(previews.display, 42, 1),
      {
        className: "mono",
        fill: palette.secondary,
        fontSize: 17,
        fontWeight: 700,
      },
      22,
    ),
  ];
  return documentPanel({
    x,
    y,
    width,
    height,
    index: "03",
    titleValue: "RENDER EVIDENCE",
    children: children.join(""),
  });
}

function renderDocument(surface) {
  return [
    group(
      [
        text(112, 92, "SUPPLIED SOURCE → STRUCTURE → RENDER", {
          className: "mono",
          fill: palette.accent,
          fontSize: 16,
          fontWeight: 700,
          letterSpacing: 1,
        }),
        text(112, 164, "NOTEWORTHY / DOCUMENT ARTIFACT", {
          className: "display",
          fill: palette.fg,
          fontSize: 64,
          fontWeight: 720,
          letterSpacing: -2,
        }),
        text(
          112,
          208,
          "BYTE-STABLE TEX + PDF EVIDENCE / COUNTS ARE ARTIFACT FACTS",
          {
            className: "mono",
            fill: palette.muted,
            fontSize: 17,
            letterSpacing: 0.6,
          },
        ),
        line(112, 244, 2288, 244, {
          stroke: palette.line,
          strokeWidth: 1.5,
        }),
      ].join(""),
    ),
    path("M 710 704 C 728 704 742 662 760 662", {
      className: "active-line",
      markerEnd: "url(#arrow-active)",
    }),
    path("M 1550 662 C 1568 662 1582 704 1600 704", {
      className: "active-line",
      markerEnd: "url(#arrow-active)",
    }),
    sourceArtifactPanel(surface),
    grammarArtifactPanel(surface),
    renderArtifactPanel(surface),
    text(
      1200,
      1248,
      "SOURCE AS-IS  ·  STRUCTURAL COUNTS  ·  CURATED FULL-PAGE PREVIEWS",
      {
        className: "mono",
        fill: palette.subtle,
        fontSize: 13,
        textAnchor: "middle",
        letterSpacing: 0.9,
      },
    ),
  ].join("");
}

await mkdir(OUTPUT_DIRECTORY, { recursive: true });

for (const output of OUTPUTS) {
  const content = output.render(output.surface);
  const expected = ledger.claims
    .filter((claim) => claim.rendered_surfaces.includes(output.surface))
    .map((claim) => claim.id);
  const rendered = renderedClaims.get(output.surface) ?? new Set();
  const missing = expected.filter((id) => !rendered.has(id));

  if (missing.length > 0) {
    throw new Error(
      `${output.filename} did not render approved claims: ${missing.join(", ")}`,
    );
  }

  const svg = svgDocument({
    id: output.surface,
    title: output.title,
    description: output.description,
    content,
    transparent: output.transparent,
    palette,
    width: WIDTH,
    height: HEIGHT,
    metadata: {
      generator: "scripts/generate-noteworthy-visuals.mjs",
      ledger: "scripts/noteworthy-visuals/truth-ledger.json",
      ledger_schema: ledger.schema_version,
      snapshots: ledger.snapshots,
      rendered_claim_ids: [...rendered],
      exclusions: ledger.exclusions.map((entry) => entry.id),
    },
  });

  await writeFile(resolve(OUTPUT_DIRECTORY, output.filename), svg, "utf8");
}

console.log(
  `Generated ${OUTPUTS.length} deterministic NoteWorthy SVGs in ${OUTPUT_DIRECTORY}`,
);

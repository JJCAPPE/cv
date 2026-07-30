import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  circle,
  group,
  line,
  multilineText,
  polygon,
  polyline,
  rect,
  svgDocument,
  text,
  wrapWords
} from "./tickit-visuals/svg-kit.mjs";

const WIDTH = 2400;
const HEIGHT = 1350;
const SCRIPT_DIRECTORY = dirname(fileURLToPath(import.meta.url));
const LEDGER_PATH = resolve(
  SCRIPT_DIRECTORY,
  "tickit-visuals/truth-ledger.json"
);
const OUTPUT_DIRECTORY = resolve(
  process.cwd(),
  process.argv[2] ?? "public/media/projects/tickit"
);

const palette = {
  bg: "#0b0b0a",
  panel: "#161614",
  panelRaised: "#1e1e1a",
  panelDeep: "#10100f",
  line: "#5a584f",
  lineSoft: "#34332e",
  fg: "#f1efe8",
  muted: "#aaa79f",
  subtle: "#77746d",
  current: "#e6d12a",
  currentInk: "#11110f",
  history: "#6f9ec4",
  historyFill: "#15212b",
  historyInk: "#0c1116"
};

const SURFACES = {
  platformMaster: "tickit-platform-exploded",
  platformInterface: "tickit-platform-interface-layer",
  platformService: "tickit-platform-service-layer",
  platformOperations: "tickit-platform-operations-layer",
  historyMaster: "tickit-commerce-intelligence-exploded",
  historyCommerce: "tickit-commerce-intelligence-commerce-layer",
  historyAccess: "tickit-commerce-intelligence-access-layer",
  historyIntelligence: "tickit-commerce-intelligence-intelligence-layer"
};

const OUTPUTS = [
  {
    surface: SURFACES.platformMaster,
    filename: "tickit-platform-exploded.svg",
    title: "TickIT current platform exploded system",
    description:
      "Three source-verified planes show public and organizer interfaces, authenticated organization-scoped Rails services, and PostgreSQL plus PostGIS event operations.",
    transparent: false,
    render: platformMaster
  },
  {
    surface: SURFACES.platformInterface,
    filename: "tickit-platform-interface-layer.svg",
    title: "TickIT current product interface layer",
    description:
      "Transparent companion plate isolating public event discovery and organizer event, ticket, team, invitation, and checker-routine surfaces.",
    transparent: true,
    render: platformInterfacePlane
  },
  {
    surface: SURFACES.platformService,
    filename: "tickit-platform-service-layer.svg",
    title: "TickIT current request and service layer",
    description:
      "Transparent companion plate isolating typed Next.js clients, Rails route boundaries, Devise JWT, organization scoping, place resolution, and current controllers.",
    transparent: true,
    render: platformServicePlane
  },
  {
    surface: SURFACES.platformOperations,
    filename: "tickit-platform-operations-layer.svg",
    title: "TickIT current operations and data layer",
    description:
      "Transparent companion plate isolating PostgreSQL and PostGIS event state, ticket catalog, membership, invitations, checker routines, and the event-created checker job.",
    transparent: true,
    render: platformOperationsPlane
  },
  {
    surface: SURFACES.historyMaster,
    filename: "tickit-commerce-intelligence-exploded.svg",
    title: "TickIT implemented commerce, access, and intelligence system",
    description:
      "Three implemented product planes show ticket purchasing with Stripe, QR access and friend sharing with surviving Rails and Next.js implementation details, and organizer spend analytics and planning.",
    transparent: false,
    render: historyMaster
  },
  {
    surface: SURFACES.historyCommerce,
    filename: "tickit-commerce-intelligence-commerce-layer.svg",
    title: "TickIT implemented commerce layer",
    description:
      "Transparent companion plate isolating the implemented attendee ticket-purchase and Stripe payment-processing boundary.",
    transparent: true,
    render: historyCommercePlane
  },
  {
    surface: SURFACES.historyAccess,
    filename: "tickit-commerce-intelligence-access-layer.svg",
    title: "TickIT implemented access layer",
    description:
      "Transparent companion plate separating delivered QR validation, friend sharing, and attendee access management from the token-generation and viewer details preserved in surviving Rails and client artifacts.",
    transparent: true,
    render: historyAccessPlane
  },
  {
    surface: SURFACES.historyIntelligence,
    filename: "tickit-commerce-intelligence-intelligence-layer.svg",
    title: "TickIT implemented organizer intelligence layer",
    description:
      "Transparent companion plate isolating implemented customer spend tracking, analytics, dashboards, predictions, forecasts, operational metrics, and event cost planning.",
    transparent: true,
    render: historyIntelligencePlane
  }
];

const ledger = JSON.parse(await readFile(LEDGER_PATH, "utf8"));
const claimsById = validateLedger(ledger);
const renderedClaims = new Map(
  OUTPUTS.map(({ surface }) => [surface, new Set()])
);

function validateLedger(value) {
  const outputSurfaces = new Set(OUTPUTS.map(({ surface }) => surface));
  const placeholder = /\b(?:TODO|TBD|REPLACE|PLACEHOLDER|LOREM)\b/i;

  if (value?.schema_version !== "tickit.visual_truth.v1") {
    throw new Error("The TickIT visual truth ledger has an unsupported schema.");
  }
  if (
    !value.snapshots ||
    !value.evidence_classes ||
    !Array.isArray(value.allowed_surfaces) ||
    !value.sources ||
    !Array.isArray(value.claims)
  ) {
    throw new Error("The TickIT visual truth ledger is incomplete.");
  }

  const allowedSurfaces = new Set(value.allowed_surfaces);
  for (const surface of outputSurfaces) {
    if (!allowedSurfaces.has(surface)) {
      throw new Error(`Output surface ${surface} is absent from allowed_surfaces.`);
    }
  }

  for (const [sourceId, source] of Object.entries(value.sources)) {
    if (
      !sourceId ||
      !source?.repo ||
      !source?.path ||
      !source?.symbol ||
      !source?.snapshot ||
      !source?.source_type
    ) {
      throw new Error(`Source reference ${sourceId} is incomplete.`);
    }
    if (value.snapshots[source.repo] !== source.snapshot) {
      throw new Error(
        `Source reference ${sourceId} does not match its pinned snapshot.`
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
      !claim.evidence_class ||
      !claim.confidence ||
      !claim.implementation_source_availability ||
      !Array.isArray(claim.surfaces) ||
      claim.surfaces.length === 0 ||
      !claim.notes
    ) {
      throw new Error(`Claim ${claim.id} is missing required evidence fields.`);
    }
    if (placeholder.test(`${claim.display} ${claim.claim}`)) {
      throw new Error(`Claim ${claim.id} contains placeholder text.`);
    }

    const evidence = value.evidence_classes[claim.evidence_class];
    if (!evidence) {
      throw new Error(
        `Claim ${claim.id} has unsupported evidence class ${claim.evidence_class}.`
      );
    }
    if (
      evidence.confidence !== claim.confidence ||
      evidence.implementation_source_availability !==
        claim.implementation_source_availability
    ) {
      throw new Error(
        `Claim ${claim.id} does not match its evidence-class confidence contract.`
      );
    }

    for (const sourceRef of claim.source_refs) {
      if (!value.sources[sourceRef]) {
        throw new Error(
          `Claim ${claim.id} references missing source ${sourceRef}.`
        );
      }
    }
    for (const surface of claim.surfaces) {
      if (!allowedSurfaces.has(surface)) {
        throw new Error(
          `Claim ${claim.id} references unknown surface ${surface}.`
        );
      }
    }
    if (
      !claim.surfaces.some(
        (surface) =>
          outputSurfaces.has(surface) ||
          surface === "tickit-cover" ||
          surface === "tickit-case-study"
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
        `Exclusion IDs must be present and unique: ${exclusion?.id}`
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
          `Exclusion ${exclusion.id} references missing source ${sourceRef}.`
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
      `Claim ${id} is not approved for rendered surface ${surface}.`
    );
  }
  renderedClaims.get(surface)?.add(id);
  return entry;
}

function evidenceStyle(entry) {
  if (
    entry.evidence_class === "author_verified_shipped" ||
    entry.evidence_class === "implementation_artifact"
  ) {
    return {
      accent: palette.history,
      fill: palette.historyFill,
      foreground: palette.fg,
      lineClass: "history-line",
      marker: "url(#arrow-history)"
    };
  }
  return {
    accent: palette.current,
    fill: palette.panel,
    foreground: palette.fg,
    lineClass: "current-line",
    marker: "url(#arrow-current)"
  };
}

function claimText(surface, id, x, y, values = {}) {
  const entry = recordClaim(surface, id);
  return group(
    text(x, y, entry.display, values),
    { "data-claim-id": id }
  );
}

function moduleBox(
  surface,
  id,
  { x, y, width, height = 68, fontSize = 17, maxCharacters, emphasis = false }
) {
  const entry = recordClaim(surface, id);
  const style = evidenceStyle(entry);
  const lines = wrapWords(
    entry.display,
    maxCharacters ??
      Math.max(10, Math.floor((width - 34) / (fontSize * 0.61))),
    2
  );
  const renderedY =
    y + (lines.length === 1 ? height / 2 + 6 : height / 2 - 5);
  const fill = emphasis ? style.accent : style.fill;
  const foreground =
    emphasis
      ? entry.evidence_class === "current_snapshot"
        ? palette.currentInk
        : palette.historyInk
      : style.foreground;

  return group(
    [
      rect(x, y, width, height, {
        rx: 4,
        fill,
        stroke: style.accent,
        strokeWidth: emphasis ? 2.5 : 1.5,
        strokeDasharray: style.dash
      }),
      rect(x, y, width, 6, {
        fill: style.accent,
        opacity: 1
      }),
      multilineText(
        x + 17,
        renderedY,
        lines,
        {
          className: "mono",
          fill: foreground,
          fontSize,
          fontWeight: emphasis ? 760 : 620,
          letterSpacing: 0.5
        },
        fontSize + 5
      ),
      line(x + width - 22, y + height - 12, x + width - 10, y + height - 12, {
        stroke: style.accent,
        strokeWidth: 2,
        strokeDasharray: style.dash
      })
    ].join(""),
    { "data-claim-id": id }
  );
}

function connectorGroup(surface, id, paths, { arrow = false } = {}) {
  const entry = recordClaim(surface, id);
  const style = evidenceStyle(entry);
  return group(
    paths
      .map((points) =>
        polyline(points, {
          className: style.lineClass,
          markerEnd: arrow ? style.marker : undefined
        })
      )
      .join(""),
    {
      "data-claim-id": id,
      fill: "none"
    }
  );
}

function planeShell(surface, labelId, { y, evidenceClass }) {
  const entry = recordClaim(surface, labelId);
  const style = evidenceStyle(entry);
  if (entry.evidence_class !== evidenceClass) {
    throw new Error(`Plane ${labelId} has an unexpected evidence class.`);
  }

  const x = 274;
  const width = 1852;
  const height = 240;
  const skew = 72;
  const face = [
    [x + skew, y],
    [x + width, y],
    [x + width - skew, y + height],
    [x, y + height]
  ];
  const bottomFace = [
    [x, y + height],
    [x + width - skew, y + height],
    [x + width - skew, y + height + 13],
    [x, y + height + 13]
  ];
  const labelLines = wrapWords(entry.display, 20, 2);

  return group(
    [
      polygon(bottomFace, {
        fill: palette.panelDeep,
        stroke: palette.lineSoft,
        strokeWidth: 1.5
      }),
      polygon(face, {
        fill:
          evidenceClass === "author_verified_shipped"
            ? palette.historyFill
            : palette.panel,
        fillOpacity: 0.96,
        stroke: style.accent,
        strokeWidth: 2.25
      }),
      line(x + 34, y + 21, x + width - 104, y + 21, {
        stroke: style.accent,
        strokeWidth: 1,
        strokeOpacity: 0.55
      }),
      line(x + 28, y + height - 24, x + width - 112, y + height - 24, {
        stroke: palette.lineSoft,
        strokeWidth: 1
      }),
      multilineText(
        70,
        y + 84,
        labelLines,
        {
          className: "mono",
          fill: style.accent,
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: 1
        },
        25
      ),
      line(70, y + 126, x + 12, y + 126, {
        stroke: style.accent,
        strokeWidth: 1.5
      })
    ].join(""),
    { "data-claim-id": labelId }
  );
}

function railTag(surface, id, x, y, width = 420) {
  const entry = recordClaim(surface, id);
  const style = evidenceStyle(entry);
  return group(
    [
      line(x, y + 18, x + width, y + 18, {
        stroke: style.accent,
        strokeWidth: 2,
        strokeDasharray: style.dash
      }),
      rect(x, y - 5, 10, 10, {
        fill: style.accent,
        opacity: 1
      }),
      text(x + 24, y + 6, entry.display, {
        className: "mono",
        fill: style.accent,
        fontSize: 14,
        fontWeight: 700,
        letterSpacing: 1
      })
    ].join(""),
    { "data-claim-id": id }
  );
}

function registrationMarks(color = palette.line) {
  const corners = [
    [46, 46, 1, 1],
    [WIDTH - 46, 46, -1, 1],
    [46, HEIGHT - 46, 1, -1],
    [WIDTH - 46, HEIGHT - 46, -1, -1]
  ];
  return group(
    corners
      .map(([x, y, dx, dy]) =>
        [
          line(x, y, x + dx * 54, y, {
            stroke: color,
            strokeWidth: 2
          }),
          line(x, y, x, y + dy * 54, {
            stroke: color,
            strokeWidth: 2
          }),
          circle(x, y, 5, {
            fill: palette.bg,
            stroke: color,
            strokeWidth: 2
          })
        ].join("")
      )
      .join(""),
    { ariaHidden: true }
  );
}

function masterGuides(accent) {
  const ticks = [];
  for (let x = 250; x <= 2150; x += 95) {
    ticks.push(
      line(x, 211, x, x % 190 === 60 ? 226 : 220, {
        stroke: palette.lineSoft,
        strokeWidth: 1
      })
    );
  }
  return group(
    [
      line(250, 211, 2150, 211, {
        stroke: palette.lineSoft,
        strokeWidth: 1
      }),
      ...ticks,
      line(2290, 236, 2290, 1132, {
        stroke: accent,
        strokeWidth: 1,
        strokeDasharray: "4 12",
        strokeOpacity: 0.48
      }),
      circle(2290, 236, 7, {
        fill: palette.bg,
        stroke: accent,
        strokeWidth: 1.5
      }),
      circle(2290, 1132, 7, {
        fill: palette.bg,
        stroke: accent,
        strokeWidth: 1.5
      })
    ].join(""),
    { ariaHidden: true }
  );
}

function masterHeader(
  surface,
  { projectId, snapshotId, titleId, subtitleId, accent }
) {
  return [
    claimText(surface, projectId, 250, 74, {
      className: "mono",
      fill: accent,
      fontSize: 15,
      fontWeight: 700,
      letterSpacing: 1.2
    }),
    claimText(surface, snapshotId, 2150, 74, {
      className: "mono",
      fill: palette.muted,
      fontSize: 14,
      fontWeight: 620,
      letterSpacing: 0.8,
      textAnchor: "end"
    }),
    claimText(surface, titleId, 250, 139, {
      className: "display",
      fill: palette.fg,
      fontSize: 52,
      fontWeight: 720,
      letterSpacing: -1.5
    }),
    claimText(surface, subtitleId, 254, 182, {
      className: "mono",
      fill: palette.muted,
      fontSize: 16,
      fontWeight: 600,
      letterSpacing: 1
    }),
    line(250, 198, 2150, 198, {
      stroke: accent,
      strokeWidth: 2
    })
  ].join("");
}

function legendItem(surface, id, x, y) {
  const entry = recordClaim(surface, id);
  const style = evidenceStyle(entry);
  return group(
    [
      line(x, y, x + 74, y, {
        stroke: style.accent,
        strokeWidth: 4,
        strokeDasharray: style.dash
      }),
      text(x + 94, y + 6, entry.display, {
        className: "mono",
        fill: style.accent,
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: 0.7
      })
    ].join(""),
    { "data-claim-id": id }
  );
}

function masterFooter(surface, boundaryId) {
  return [
    line(250, 1198, 2150, 1198, {
      stroke: palette.lineSoft,
      strokeWidth: 1.5
    }),
    legendItem(surface, "legend-current", 250, 1243),
    legendItem(surface, "legend-shipped", 905, 1243),
    legendItem(surface, "legend-qr-implementation", 1590, 1243),
    claimText(surface, boundaryId, 250, 1304, {
      className: "mono",
      fill: palette.muted,
      fontSize: 13,
      fontWeight: 620,
      letterSpacing: 0.8
    })
  ].join("");
}

const PLATFORM_INTERFACE_Y = 250;
const PLATFORM_SERVICE_Y = 535;
const PLATFORM_OPERATIONS_Y = 820;

function platformInterfacePlane(surface) {
  const content = [
    registrationMarks(palette.current),
    planeShell(surface, "interface-plane", {
      y: PLATFORM_INTERFACE_Y,
      evidenceClass: "current_snapshot"
    }),
    railTag(surface, "interface-rail", 352, PLATFORM_INTERFACE_Y + 41, 530),
    moduleBox(surface, "interface-public-event", {
      x: 430,
      y: PLATFORM_INTERFACE_Y + 72,
      width: 330,
      emphasis: true
    }),
    moduleBox(surface, "interface-event-setup", {
      x: 800,
      y: PLATFORM_INTERFACE_Y + 72,
      width: 330
    }),
    moduleBox(surface, "interface-event-details", {
      x: 1170,
      y: PLATFORM_INTERFACE_Y + 72,
      width: 300
    }),
    moduleBox(surface, "interface-ticket-management", {
      x: 1510,
      y: PLATFORM_INTERFACE_Y + 72,
      width: 300
    }),
    moduleBox(surface, "interface-event-team", {
      x: 610,
      y: PLATFORM_INTERFACE_Y + 155,
      width: 300,
      height: 58
    }),
    moduleBox(surface, "interface-invitations", {
      x: 960,
      y: PLATFORM_INTERFACE_Y + 155,
      width: 300,
      height: 58
    }),
    moduleBox(surface, "interface-routines", {
      x: 1310,
      y: PLATFORM_INTERFACE_Y + 155,
      width: 400,
      height: 58
    })
  ];

  if (surface !== SURFACES.platformMaster) {
    content.push(
      connectorGroup(
        surface,
        "flow-public-discovery",
        [
          [
            [740, PLATFORM_INTERFACE_Y + 140],
            [740, PLATFORM_SERVICE_Y - 35],
            [920, PLATFORM_SERVICE_Y - 35],
            [920, PLATFORM_SERVICE_Y + 72]
          ]
        ],
        { arrow: true }
      ),
      connectorGroup(
        surface,
        "flow-organizer-clients",
        [
          [
            [1360, PLATFORM_INTERFACE_Y + 213],
            [1360, PLATFORM_SERVICE_Y - 35],
            [1040, PLATFORM_SERVICE_Y - 35],
            [1040, PLATFORM_SERVICE_Y + 65],
            [580, PLATFORM_SERVICE_Y + 65],
            [580, PLATFORM_SERVICE_Y + 72]
          ]
        ],
        { arrow: true }
      )
    );
  }

  return content.join("");
}

function platformServicePlane(surface) {
  const content = [
    registrationMarks(palette.current),
    planeShell(surface, "service-plane", {
      y: PLATFORM_SERVICE_Y,
      evidenceClass: "current_snapshot"
    }),
    railTag(surface, "service-rail", 352, PLATFORM_SERVICE_Y + 41, 660),
    moduleBox(surface, "service-api-clients", {
      x: 430,
      y: PLATFORM_SERVICE_Y + 72,
      width: 300,
      emphasis: true
    }),
    moduleBox(surface, "service-public-api", {
      x: 770,
      y: PLATFORM_SERVICE_Y + 72,
      width: 300
    }),
    moduleBox(surface, "service-business-api", {
      x: 1110,
      y: PLATFORM_SERVICE_Y + 72,
      width: 300
    }),
    moduleBox(surface, "service-admin-api", {
      x: 1450,
      y: PLATFORM_SERVICE_Y + 72,
      width: 300
    }),
    moduleBox(surface, "service-jwt", {
      x: 510,
      y: PLATFORM_SERVICE_Y + 155,
      width: 300,
      height: 58
    }),
    moduleBox(surface, "service-org-scope", {
      x: 850,
      y: PLATFORM_SERVICE_Y + 155,
      width: 300,
      height: 58
    }),
    moduleBox(surface, "service-location", {
      x: 1190,
      y: PLATFORM_SERVICE_Y + 155,
      width: 340,
      height: 58,
      fontSize: 15
    }),
    moduleBox(surface, "service-controllers", {
      x: 1570,
      y: PLATFORM_SERVICE_Y + 155,
      width: 440,
      height: 58,
      fontSize: 15
    }),
    connectorGroup(
      surface,
      "flow-auth-scope",
      [
        [
          [810, PLATFORM_SERVICE_Y + 184],
          [850, PLATFORM_SERVICE_Y + 184]
        ],
        [
          [1150, PLATFORM_SERVICE_Y + 184],
          [1168, PLATFORM_SERVICE_Y + 225],
          [1552, PLATFORM_SERVICE_Y + 225],
          [1570, PLATFORM_SERVICE_Y + 184]
        ]
      ],
      { arrow: true }
    )
  ];

  if (surface !== SURFACES.platformMaster) {
    content.push(
      connectorGroup(
        surface,
        "flow-public-discovery",
        [
          [
            [740, PLATFORM_INTERFACE_Y + 140],
            [740, PLATFORM_SERVICE_Y - 35],
            [920, PLATFORM_SERVICE_Y - 35],
            [920, PLATFORM_SERVICE_Y + 72]
          ]
        ],
        { arrow: true }
      ),
      connectorGroup(
        surface,
        "flow-organizer-clients",
        [
          [
            [1360, PLATFORM_INTERFACE_Y + 213],
            [1360, PLATFORM_SERVICE_Y - 35],
            [1040, PLATFORM_SERVICE_Y - 35],
            [1040, PLATFORM_SERVICE_Y + 65],
            [580, PLATFORM_SERVICE_Y + 65],
            [580, PLATFORM_SERVICE_Y + 72]
          ]
        ],
        { arrow: true }
      ),
      connectorGroup(
        surface,
        "flow-place-persistence",
        [
          [
            [1360, PLATFORM_SERVICE_Y + 213],
            [1360, PLATFORM_OPERATIONS_Y - 24],
            [1195, PLATFORM_OPERATIONS_Y + 72]
          ]
        ],
        { arrow: true }
      ),
      connectorGroup(
        surface,
        "flow-controller-persistence",
        [
          [
            [1790, PLATFORM_SERVICE_Y + 213],
            [1790, PLATFORM_OPERATIONS_Y - 42],
            [1530, PLATFORM_OPERATIONS_Y + 72]
          ]
        ],
        { arrow: true }
      )
    );
  }

  return content.join("");
}

function platformOperationsPlane(surface) {
  const content = [
    registrationMarks(palette.current),
    planeShell(surface, "operations-plane", {
      y: PLATFORM_OPERATIONS_Y,
      evidenceClass: "current_snapshot"
    }),
    railTag(surface, "operations-rail", 352, PLATFORM_OPERATIONS_Y + 41, 570),
    moduleBox(surface, "operations-postgres", {
      x: 430,
      y: PLATFORM_OPERATIONS_Y + 72,
      width: 300,
      emphasis: true
    }),
    moduleBox(surface, "operations-events", {
      x: 770,
      y: PLATFORM_OPERATIONS_Y + 72,
      width: 250
    }),
    moduleBox(surface, "operations-locations", {
      x: 1060,
      y: PLATFORM_OPERATIONS_Y + 72,
      width: 300
    }),
    moduleBox(surface, "operations-tickets", {
      x: 1400,
      y: PLATFORM_OPERATIONS_Y + 72,
      width: 340
    }),
    moduleBox(surface, "operations-members", {
      x: 500,
      y: PLATFORM_OPERATIONS_Y + 155,
      width: 280,
      height: 58
    }),
    moduleBox(surface, "operations-invitations", {
      x: 820,
      y: PLATFORM_OPERATIONS_Y + 155,
      width: 250,
      height: 58
    }),
    moduleBox(surface, "operations-routines", {
      x: 1110,
      y: PLATFORM_OPERATIONS_Y + 155,
      width: 360,
      height: 58,
      fontSize: 15
    }),
    moduleBox(surface, "operations-job", {
      x: 1510,
      y: PLATFORM_OPERATIONS_Y + 155,
      width: 390,
      height: 58,
      fontSize: 15
    }),
    connectorGroup(
      surface,
      "flow-event-created-routine",
      [
        [
          [895, PLATFORM_OPERATIONS_Y + 140],
          [895, PLATFORM_OPERATIONS_Y + 228],
          [1870, PLATFORM_OPERATIONS_Y + 228],
          [1870, PLATFORM_OPERATIONS_Y + 155]
        ],
        [
          [1290, PLATFORM_OPERATIONS_Y + 213],
          [1290, PLATFORM_OPERATIONS_Y + 228],
          [1510, PLATFORM_OPERATIONS_Y + 228]
        ],
        [
          [1510, PLATFORM_OPERATIONS_Y + 201],
          [1490, PLATFORM_OPERATIONS_Y + 228],
          [640, PLATFORM_OPERATIONS_Y + 228],
          [640, PLATFORM_OPERATIONS_Y + 213]
        ]
      ],
      { arrow: true }
    )
  ];

  if (surface !== SURFACES.platformMaster) {
    content.push(
      connectorGroup(
        surface,
        "flow-place-persistence",
        [
          [
            [1360, PLATFORM_SERVICE_Y + 213],
            [1360, PLATFORM_OPERATIONS_Y - 24],
            [1210, PLATFORM_OPERATIONS_Y + 72]
          ]
        ],
        { arrow: true }
      ),
      connectorGroup(
        surface,
        "flow-controller-persistence",
        [
          [
            [1790, PLATFORM_SERVICE_Y + 213],
            [1790, PLATFORM_OPERATIONS_Y - 42],
            [1570, PLATFORM_OPERATIONS_Y + 72]
          ]
        ],
        { arrow: true }
      )
    );
  }

  return content.join("");
}

function platformMasterConnections(surface) {
  return [
    connectorGroup(
      surface,
      "flow-public-discovery",
      [
        [
          [740, PLATFORM_INTERFACE_Y + 140],
          [740, PLATFORM_SERVICE_Y - 35],
          [920, PLATFORM_SERVICE_Y - 35],
          [920, PLATFORM_SERVICE_Y + 72]
        ]
      ],
      { arrow: true }
    ),
    connectorGroup(
      surface,
      "flow-organizer-clients",
      [
        [
          [1360, PLATFORM_INTERFACE_Y + 213],
          [1360, PLATFORM_SERVICE_Y - 35],
          [1040, PLATFORM_SERVICE_Y - 35],
          [1040, PLATFORM_SERVICE_Y + 65],
          [580, PLATFORM_SERVICE_Y + 65],
          [580, PLATFORM_SERVICE_Y + 72]
        ]
      ],
      { arrow: true }
    ),
    connectorGroup(
      surface,
      "flow-place-persistence",
      [
        [
          [1360, PLATFORM_SERVICE_Y + 213],
          [1360, PLATFORM_OPERATIONS_Y - 24],
          [1210, PLATFORM_OPERATIONS_Y + 72]
        ]
      ],
      { arrow: true }
    ),
    connectorGroup(
      surface,
      "flow-controller-persistence",
      [
        [
          [1790, PLATFORM_SERVICE_Y + 213],
          [1790, PLATFORM_OPERATIONS_Y - 42],
          [1570, PLATFORM_OPERATIONS_Y + 72]
        ]
      ],
      { arrow: true }
    )
  ].join("");
}

function platformMaster(surface) {
  return [
    registrationMarks(palette.current),
    masterHeader(surface, {
      projectId: "platform-project",
      snapshotId: "platform-snapshot",
      titleId: "platform-title",
      subtitleId: "platform-subtitle",
      accent: palette.current
    }),
    masterGuides(palette.current),
    platformInterfacePlane(surface),
    platformServicePlane(surface),
    platformOperationsPlane(surface),
    platformMasterConnections(surface),
    masterFooter(surface, "platform-boundary")
  ].join("");
}

const HISTORY_COMMERCE_Y = 250;
const HISTORY_ACCESS_Y = 535;
const HISTORY_INTELLIGENCE_Y = 820;

function historyCommercePlane(surface) {
  return [
    registrationMarks(palette.history),
    planeShell(surface, "commerce-plane", {
      y: HISTORY_COMMERCE_Y,
      evidenceClass: "author_verified_shipped"
    }),
    railTag(surface, "commerce-rail", 352, HISTORY_COMMERCE_Y + 41, 640),
    moduleBox(surface, "commerce-attendee", {
      x: 520,
      y: HISTORY_COMMERCE_Y + 105,
      width: 300
    }),
    moduleBox(surface, "commerce-purchase", {
      x: 1010,
      y: HISTORY_COMMERCE_Y + 105,
      width: 340,
      emphasis: true
    }),
    moduleBox(surface, "commerce-stripe", {
      x: 1540,
      y: HISTORY_COMMERCE_Y + 105,
      width: 390
    }),
    connectorGroup(
      surface,
      "flow-commerce",
      [
        [
          [820, HISTORY_COMMERCE_Y + 139],
          [1010, HISTORY_COMMERCE_Y + 139]
        ],
        [
          [1350, HISTORY_COMMERCE_Y + 139],
          [1540, HISTORY_COMMERCE_Y + 139]
        ]
      ],
      { arrow: true }
    )
  ].join("");
}

function historyAccessPlane(surface) {
  return [
    registrationMarks(palette.history),
    planeShell(surface, "access-plane", {
      y: HISTORY_ACCESS_Y,
      evidenceClass: "author_verified_shipped"
    }),
    railTag(surface, "access-rail", 352, HISTORY_ACCESS_Y + 41, 570),
    moduleBox(surface, "access-qr-generation", {
      x: 420,
      y: HISTORY_ACCESS_Y + 68,
      width: 300,
      height: 62,
      emphasis: true
    }),
    moduleBox(surface, "access-qr-validation", {
      x: 770,
      y: HISTORY_ACCESS_Y + 68,
      width: 300,
      height: 62
    }),
    moduleBox(surface, "access-friend-sharing", {
      x: 1120,
      y: HISTORY_ACCESS_Y + 68,
      width: 300,
      height: 62
    }),
    moduleBox(surface, "access-management", {
      x: 1470,
      y: HISTORY_ACCESS_Y + 68,
      width: 390,
      height: 62
    }),
    connectorGroup(
      surface,
      "flow-access",
      [
        [
          [570, HISTORY_ACCESS_Y + 144],
          [1665, HISTORY_ACCESS_Y + 144]
        ],
        [
          [570, HISTORY_ACCESS_Y + 130],
          [570, HISTORY_ACCESS_Y + 144]
        ],
        [
          [920, HISTORY_ACCESS_Y + 130],
          [920, HISTORY_ACCESS_Y + 144]
        ],
        [
          [1270, HISTORY_ACCESS_Y + 130],
          [1270, HISTORY_ACCESS_Y + 144]
        ],
        [
          [1665, HISTORY_ACCESS_Y + 130],
          [1665, HISTORY_ACCESS_Y + 144]
        ]
      ]
    ),
    railTag(surface, "access-detail-rail", 352, HISTORY_ACCESS_Y + 178, 325),
    moduleBox(surface, "access-detail-rails", {
      x: 700,
      y: HISTORY_ACCESS_Y + 157,
      width: 260,
      height: 58,
      fontSize: 14
    }),
    moduleBox(surface, "access-detail-client", {
      x: 1000,
      y: HISTORY_ACCESS_Y + 157,
      width: 270,
      height: 58,
      fontSize: 14
    }),
    moduleBox(surface, "access-detail-viewer", {
      x: 1310,
      y: HISTORY_ACCESS_Y + 157,
      width: 290,
      height: 58,
      fontSize: 13
    }),
    moduleBox(surface, "access-detail-validation", {
      x: 1640,
      y: HISTORY_ACCESS_Y + 157,
      width: 330,
      height: 58,
      fontSize: 13
    }),
    connectorGroup(surface, "flow-access-detail", [
      [
        [960, HISTORY_ACCESS_Y + 186],
        [1000, HISTORY_ACCESS_Y + 186]
      ],
      [
        [1270, HISTORY_ACCESS_Y + 186],
        [1310, HISTORY_ACCESS_Y + 186]
      ],
      [
        [1600, HISTORY_ACCESS_Y + 186],
        [1640, HISTORY_ACCESS_Y + 186]
      ]
    ])
  ].join("");
}

function historyIntelligencePlane(surface) {
  return [
    registrationMarks(palette.history),
    planeShell(surface, "intelligence-plane", {
      y: HISTORY_INTELLIGENCE_Y,
      evidenceClass: "author_verified_shipped"
    }),
    railTag(surface, "intelligence-rail", 352, HISTORY_INTELLIGENCE_Y + 41, 700),
    moduleBox(surface, "intelligence-spend", {
      x: 430,
      y: HISTORY_INTELLIGENCE_Y + 68,
      width: 340,
      height: 62,
      emphasis: true
    }),
    moduleBox(surface, "intelligence-analytics", {
      x: 830,
      y: HISTORY_INTELLIGENCE_Y + 68,
      width: 320,
      height: 62
    }),
    moduleBox(surface, "intelligence-dashboard", {
      x: 1210,
      y: HISTORY_INTELLIGENCE_Y + 68,
      width: 340,
      height: 62
    }),
    moduleBox(surface, "intelligence-spending-prediction", {
      x: 500,
      y: HISTORY_INTELLIGENCE_Y + 155,
      width: 300,
      height: 58,
      fontSize: 15
    }),
    moduleBox(surface, "intelligence-inventory-forecast", {
      x: 840,
      y: HISTORY_INTELLIGENCE_Y + 155,
      width: 300,
      height: 58,
      fontSize: 15
    }),
    moduleBox(surface, "intelligence-operational-metrics", {
      x: 1180,
      y: HISTORY_INTELLIGENCE_Y + 155,
      width: 300,
      height: 58,
      fontSize: 15
    }),
    moduleBox(surface, "intelligence-cost-planning", {
      x: 1520,
      y: HISTORY_INTELLIGENCE_Y + 155,
      width: 320,
      height: 58,
      fontSize: 15
    }),
    connectorGroup(
      surface,
      "flow-intelligence",
      [
        [
          [770, HISTORY_INTELLIGENCE_Y + 99],
          [830, HISTORY_INTELLIGENCE_Y + 99]
        ],
        [
          [1150, HISTORY_INTELLIGENCE_Y + 99],
          [1210, HISTORY_INTELLIGENCE_Y + 99]
        ],
        [
          [1380, HISTORY_INTELLIGENCE_Y + 130],
          [1380, HISTORY_INTELLIGENCE_Y + 143],
          [650, HISTORY_INTELLIGENCE_Y + 143],
          [650, HISTORY_INTELLIGENCE_Y + 155]
        ],
        [
          [990, HISTORY_INTELLIGENCE_Y + 143],
          [990, HISTORY_INTELLIGENCE_Y + 155]
        ],
        [
          [1330, HISTORY_INTELLIGENCE_Y + 143],
          [1330, HISTORY_INTELLIGENCE_Y + 155]
        ],
        [
          [1680, HISTORY_INTELLIGENCE_Y + 143],
          [1680, HISTORY_INTELLIGENCE_Y + 155]
        ]
      ],
      { arrow: true }
    )
  ].join("");
}

function historyMasterRelationship(surface) {
  return connectorGroup(
    surface,
    "flow-history-relationship",
    [
      [
        [2070, HISTORY_COMMERCE_Y + 120],
        [2190, HISTORY_COMMERCE_Y + 120],
        [2190, HISTORY_INTELLIGENCE_Y + 120],
        [2070, HISTORY_INTELLIGENCE_Y + 120]
      ],
      [
        [2190, HISTORY_ACCESS_Y + 120],
        [2070, HISTORY_ACCESS_Y + 120]
      ]
    ]
  );
}

function historyMaster(surface) {
  return [
    registrationMarks(palette.history),
    masterHeader(surface, {
      projectId: "history-project",
      snapshotId: "history-snapshot",
      titleId: "history-title",
      subtitleId: "history-subtitle",
      accent: palette.history
    }),
    masterGuides(palette.history),
    historyCommercePlane(surface),
    historyAccessPlane(surface),
    historyIntelligencePlane(surface),
    historyMasterRelationship(surface),
    masterFooter(surface, "history-boundary")
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
        source_ledger: "scripts/tickit-visuals/truth-ledger.json",
        generator: "scripts/generate-tickit-visuals.mjs",
        snapshots: ledger.snapshots,
        claim_ids: claimIds
      }
    })
  };
});

for (const claimEntry of ledger.claims) {
  for (const surface of claimEntry.surfaces) {
    if (
      renderedClaims.has(surface) &&
      !renderedClaims.get(surface).has(claimEntry.id)
    ) {
      throw new Error(
        `Claim ${claimEntry.id} is approved for ${surface} but was not rendered.`
      );
    }
  }
}

await mkdir(OUTPUT_DIRECTORY, { recursive: true });
await Promise.all(
  generated.map(({ filename, content }) =>
    writeFile(resolve(OUTPUT_DIRECTORY, filename), content, "utf8")
  )
);

console.log(
  `Wrote ${generated.length} deterministic TickIT SVG files to ${OUTPUT_DIRECTORY}`
);

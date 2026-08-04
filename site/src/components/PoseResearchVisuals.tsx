"use client";

import {
  Fragment,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import {
  contextualSimilarity,
  DEMO_K,
  DEMO_POINTS,
  perturbDemoQuery,
  rankQuery,
  type DemoEmbeddingPoint,
  type DemoPointShape,
  type Matrix,
} from "@/lib/contextualSimilarity";
import { useMotionActivity } from "@/hooks/useMotionActivity";
import styles from "./PoseResearchVisuals.module.css";

const JOINT_NAMES = [
  "head",
  "neck",
  "leftShoulder",
  "leftElbow",
  "leftWrist",
  "rightShoulder",
  "rightElbow",
  "rightWrist",
  "pelvis",
  "leftHip",
  "leftKnee",
  "leftAnkle",
  "rightHip",
  "rightKnee",
  "rightAnkle",
] as const;

type JointName = (typeof JOINT_NAMES)[number];
type Joint = readonly [number, number];
type Pose = Record<JointName, Joint>;
type CorruptionType = "jitter" | "mask" | "dropout";

const LIMBS: readonly (readonly [JointName, JointName])[] = [
  ["head", "neck"],
  ["neck", "leftShoulder"],
  ["leftShoulder", "leftElbow"],
  ["leftElbow", "leftWrist"],
  ["neck", "rightShoulder"],
  ["rightShoulder", "rightElbow"],
  ["rightElbow", "rightWrist"],
  ["neck", "pelvis"],
  ["pelvis", "leftHip"],
  ["leftHip", "leftKnee"],
  ["leftKnee", "leftAnkle"],
  ["pelvis", "rightHip"],
  ["rightHip", "rightKnee"],
  ["rightKnee", "rightAnkle"],
];

const MASKED_JOINTS: readonly (readonly JointName[])[] = [
  [],
  ["rightWrist"],
  ["rightElbow", "rightWrist"],
  ["rightElbow", "rightWrist", "leftKnee", "leftAnkle"],
  [
    "rightShoulder",
    "rightElbow",
    "rightWrist",
    "leftKnee",
    "leftAnkle",
    "leftWrist",
  ],
];

const DROPPED_FRAMES: readonly (readonly number[])[] = [
  [],
  [4],
  [1, 4],
  [1, 3, 4],
  [0, 1, 3, 4],
];

const CORRUPTION_LABELS: Record<CorruptionType, string> = {
  jitter: "Joint jitter",
  mask: "Joint / limb mask",
  dropout: "Frame dropout",
};

const SEVERITY_LABELS = ["Clean", "Low", "Medium", "High", "Severe"] as const;

function joint(x: number, y: number): Joint {
  return [
    Math.round(x * 1_000) / 1_000,
    Math.round(y * 1_000) / 1_000,
  ];
}

function makePose(frame: number): Pose {
  const phase = (frame / 6) * Math.PI * 2;
  const sway = Math.sin(phase) * 8;
  const lift = (Math.cos(phase) + 1) * 13;
  const counter = Math.sin(phase + Math.PI) * 18;

  return {
    head: joint(150 + sway * 0.2, 36),
    neck: joint(150 + sway * 0.3, 64),
    leftShoulder: joint(128 + sway * 0.25, 76),
    leftElbow: joint(108 - lift * 0.55, 104 - lift),
    leftWrist: joint(92 - lift, 132 - lift * 1.65),
    rightShoulder: joint(172 + sway * 0.25, 76),
    rightElbow: joint(192 + lift * 0.4, 103 + lift * 0.22),
    rightWrist: joint(207 + lift * 0.7, 133 + lift * 0.45),
    pelvis: joint(150 + sway, 145),
    leftHip: joint(138 + sway, 145),
    leftKnee: joint(
      128 + sway + counter * 0.32,
      194 - Math.max(counter, 0) * 0.2,
    ),
    leftAnkle: joint(119 + sway + counter * 0.58, 249),
    rightHip: joint(162 + sway, 145),
    rightKnee: joint(
      173 + sway - counter * 0.32,
      194 - Math.max(-counter, 0) * 0.2,
    ),
    rightAnkle: joint(181 + sway - counter * 0.58, 249),
  };
}

const POSE_FRAMES = Array.from({ length: 6 }, (_, frame) => makePose(frame));

function jitterPose(pose: Pose, frame: number, severity: number): Pose {
  const jittered: Pose = { ...pose };

  JOINT_NAMES.forEach((joint, index) => {
    const [x, y] = pose[joint];
    const xNoise =
      Math.sin((index + 1) * 4.19 + frame * 2.73) * severity * 4.1;
    const yNoise =
      Math.cos((index + 1) * 3.37 + frame * 3.11) * severity * 3.4;
    jittered[joint] = [
      Math.round((x + xNoise) * 1_000) / 1_000,
      Math.round((y + yNoise) * 1_000) / 1_000,
    ];
  });

  return jittered;
}

function Skeleton({
  pose,
  hiddenJoints = [],
  variant,
}: {
  pose: Pose;
  hiddenJoints?: readonly JointName[];
  variant: "clean" | "observed" | "trail" | "dropped";
}) {
  const hidden = new Set(hiddenJoints);

  return (
    <g className={styles.skeleton} data-variant={variant}>
      {LIMBS.map(([start, end]) =>
        hidden.has(start) || hidden.has(end) ? null : (
          <line
            key={`${start}-${end}`}
            x1={pose[start][0]}
            y1={pose[start][1]}
            x2={pose[end][0]}
            y2={pose[end][1]}
          />
        ),
      )}
      {JOINT_NAMES.map((joint) =>
        hidden.has(joint) ? null : (
          <circle
            key={joint}
            cx={pose[joint][0]}
            cy={pose[joint][1]}
            r={joint === "head" ? 7 : 3.4}
          />
        ),
      )}
      {hiddenJoints.map((joint) => (
        <g
          className={styles.missingJoint}
          key={`missing-${joint}`}
          transform={`translate(${pose[joint][0]} ${pose[joint][1]})`}
        >
          <line x1="-5" y1="-5" x2="5" y2="5" />
          <line x1="-5" y1="5" x2="5" y2="-5" />
        </g>
      ))}
    </g>
  );
}

export function PoseCorruptionLab() {
  const titleId = useId();
  const descriptionId = useId();
  const { isActive, reducedMotion, ref: motionRef } =
    useMotionActivity<HTMLDivElement>();
  const [corruption, setCorruption] = useState<CorruptionType>("jitter");
  const [severity, setSeverity] = useState(2);
  const [frame, setFrame] = useState(0);
  const [playing, setPlaying] = useState(true);
  const isPlaying = playing && isActive;
  const cleanPose = POSE_FRAMES[frame];
  const observedPose =
    corruption === "jitter"
      ? jitterPose(cleanPose, frame, severity)
      : cleanPose;
  const hiddenJoints =
    corruption === "mask" ? MASKED_JOINTS[severity] : MASKED_JOINTS[0];
  const dropped =
    corruption === "dropout" && DROPPED_FRAMES[severity].includes(frame);
  const previousFrames = [
    (frame + POSE_FRAMES.length - 2) % POSE_FRAMES.length,
    (frame + POSE_FRAMES.length - 1) % POSE_FRAMES.length,
  ];

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const interval = window.setInterval(() => {
      setFrame((current) => (current + 1) % POSE_FRAMES.length);
    }, 720);

    return () => window.clearInterval(interval);
  }, [isPlaying]);

  function stepFrame(direction: -1 | 1) {
    setPlaying(false);
    setFrame(
      (current) =>
        (current + direction + POSE_FRAMES.length) % POSE_FRAMES.length,
    );
  }

  return (
    <div
      ref={motionRef}
      className={`${styles.visual} ${styles.poseLab}`}
      data-motion-paused={!isActive}
    >
      <div className={styles.visualHeader}>
        <div>
          <p className={styles.visualKicker}>Interactive 01</p>
          <h2>Pose corruption lab</h2>
        </div>
        <p className={styles.demoFlag}>Planned protocol / simulation</p>
      </div>

      <div className={styles.poseCanvas}>
        <svg
          viewBox="0 0 720 340"
          role="img"
          aria-labelledby={`${titleId} ${descriptionId}`}
        >
          <title id={titleId}>Clean and corrupted pose sequence</title>
          <desc id={descriptionId}>
            A clean animated skeleton is compared with an observed skeleton
            under the selected synthetic corruption and severity.
          </desc>
          <line className={styles.poseDivider} x1="360" y1="18" x2="360" y2="322" />
          <text className={styles.svgLabel} x="22" y="26">
            CLEAN REFERENCE
          </text>
          <text className={styles.svgLabel} x="384" y="26">
            OBSERVED QUERY
          </text>
          <line className={styles.floorLine} x1="28" y1="304" x2="332" y2="304" />
          <line className={styles.floorLine} x1="388" y1="304" x2="692" y2="304" />

          <g transform="translate(26 35)">
            {previousFrames.map((trailFrame, index) => (
              <g
                key={`clean-trail-${trailFrame}`}
                opacity={index === 0 ? 0.08 : 0.15}
              >
                <Skeleton pose={POSE_FRAMES[trailFrame]} variant="trail" />
              </g>
            ))}
            <Skeleton pose={cleanPose} variant="clean" />
          </g>

          <g transform="translate(386 35)">
            {previousFrames.map((trailFrame, index) => {
              const trailPose =
                corruption === "jitter"
                  ? jitterPose(POSE_FRAMES[trailFrame], trailFrame, severity)
                  : POSE_FRAMES[trailFrame];
              return (
                <g
                  key={`observed-trail-${trailFrame}`}
                  opacity={index === 0 ? 0.06 : 0.12}
                >
                  <Skeleton pose={trailPose} variant="trail" />
                </g>
              );
            })}
            <Skeleton
              pose={observedPose}
              hiddenJoints={hiddenJoints}
              variant={dropped ? "dropped" : "observed"}
            />
            {dropped ? (
              <text className={styles.dropoutLabel} x="150" y="166" textAnchor="middle">
                FRAME DROPPED
              </text>
            ) : null}
          </g>
        </svg>
      </div>

      <div className={styles.controls}>
        <div className={styles.controlGroup}>
          <span className={styles.controlLabel}>Corruption</span>
          <div className={styles.segmented} role="group" aria-label="Corruption type">
            {(Object.keys(CORRUPTION_LABELS) as CorruptionType[]).map((type) => (
              <button
                key={type}
                type="button"
                aria-pressed={corruption === type}
                onClick={() => setCorruption(type)}
              >
                {CORRUPTION_LABELS[type]}
              </button>
            ))}
          </div>
        </div>

        <label className={styles.rangeControl}>
          <span>
            <span className={styles.controlLabel}>Severity</span>
            <output>{SEVERITY_LABELS[severity]}</output>
          </span>
          <input
            type="range"
            aria-label="Corruption severity"
            min="0"
            max="4"
            step="1"
            value={severity}
            onChange={(event) => setSeverity(Number(event.target.value))}
          />
        </label>

        <div className={styles.playback}>
          <button
            type="button"
            onClick={() => stepFrame(-1)}
            aria-label="Previous pose frame"
          >
            ←
          </button>
          <button
            type="button"
            disabled={reducedMotion}
            onClick={() => setPlaying((current) => !current)}
          >
            {reducedMotion ? "Motion reduced" : isPlaying ? "Pause" : "Play"}
          </button>
          <button
            type="button"
            onClick={() => stepFrame(1)}
            aria-label="Next pose frame"
          >
            →
          </button>
          <span aria-live="polite">
            Frame {frame + 1}/{POSE_FRAMES.length}
          </span>
        </div>

        <div className={styles.frameTimeline} aria-label="Select pose frame">
          {POSE_FRAMES.map((_, frameIndex) => {
            const frameDropped =
              corruption === "dropout" &&
              DROPPED_FRAMES[severity].includes(frameIndex);
            return (
              <button
                type="button"
                key={frameIndex}
                aria-label={`Show frame ${frameIndex + 1}${
                  frameDropped ? ", dropped at this severity" : ""
                }`}
                aria-pressed={frameIndex === frame}
                data-dropped={frameDropped ? "true" : undefined}
                onClick={() => {
                  setPlaying(false);
                  setFrame(frameIndex);
                }}
              >
                {String(frameIndex + 1).padStart(2, "0")}
              </button>
            );
          })}
        </div>
      </div>

      <p className={styles.visualNote}>
        Explanatory simulation of the proposed corruptions—not a model output
        or measured robustness result. Use the frame controls for a static
        comparison.
      </p>
    </div>
  );
}

type NeighborhoodMode = "pairwise" | "contextual";

const QUERY_IDS = ["R1", "S1", "T1"] as const;

function PointGlyph({
  point,
  isQuery,
  isRanked,
}: {
  point: DemoEmbeddingPoint;
  isQuery: boolean;
  isRanked: boolean;
}) {
  return (
    <g
      className={styles.embeddingPoint}
      data-label={point.label.toLowerCase()}
      data-query={isQuery ? "true" : undefined}
      data-ranked={isRanked ? "true" : undefined}
      transform={`translate(${point.x} ${point.y})`}
    >
      {isQuery ? <circle className={styles.queryHalo} r="22" /> : null}
      {point.shape === "circle" ? <circle r="8" /> : null}
      {point.shape === "square" ? (
        <rect x="-8" y="-8" width="16" height="16" />
      ) : null}
      {point.shape === "triangle" ? (
        <polygon points="0,-10 9,7 -9,7" />
      ) : null}
      <text x="0" y="27" textAnchor="middle">
        {point.id}
      </text>
    </g>
  );
}

function ShapeMark({ shape }: { shape: DemoPointShape }) {
  return <span className={styles.shapeMark} data-shape={shape} aria-hidden="true" />;
}

export function NeighborhoodExplorer() {
  const titleId = useId();
  const descriptionId = useId();
  const { isActive, ref: motionRef } = useMotionActivity<HTMLDivElement>();
  const [queryId, setQueryId] = useState<(typeof QUERY_IDS)[number]>("R1");
  const [noise, setNoise] = useState(2);
  const [mode, setMode] = useState<NeighborhoodMode>("pairwise");
  const points = useMemo(
    () => perturbDemoQuery(DEMO_POINTS, queryId, noise / 4),
    [noise, queryId],
  );
  const result = useMemo(
    () =>
      contextualSimilarity(
        points.map((point) => point.embedding),
        { k: DEMO_K },
      ),
    [points],
  );
  const queryIndex = points.findIndex((point) => point.id === queryId);
  const matrix =
    mode === "pairwise" ? result.similarity : result.contextual;
  const ranking = rankQuery(matrix, queryIndex, points);
  const topRanking = ranking.slice(0, 5);
  const rankedIndices = new Set(topRanking.slice(0, 4).map(({ index }) => index));
  const neighborhoodIndices = new Set([
    queryIndex,
    ...topRanking.map(({ index }) => index),
  ]);
  const contextualEdges: { start: number; end: number; kind: "shared" | "reciprocal" }[] = [];

  if (mode === "contextual") {
    points.forEach((_, row) => {
      points.forEach((__, column) => {
        if (
          column <= row ||
          !neighborhoodIndices.has(row) ||
          !neighborhoodIndices.has(column)
        ) {
          return;
        }
        if (result.reciprocal[row][column] > 0) {
          contextualEdges.push({ start: row, end: column, kind: "reciprocal" });
        } else if (result.w1[row][column] > 0.34) {
          contextualEdges.push({ start: row, end: column, kind: "shared" });
        }
      });
    });
  }

  const first = ranking[0];
  const scoreName = mode === "pairwise" ? "cosine score" : "contextual score";

  return (
    <div
      ref={motionRef}
      className={`${styles.visual} ${styles.neighborhoodExplorer}`}
      data-motion-paused={!isActive}
    >
      <div className={styles.visualHeader}>
        <div>
          <p className={styles.visualKicker}>Interactive 02</p>
          <h3>Neighborhood explorer</h3>
        </div>
        <p className={styles.demoFlag}>Synthetic intuition demo</p>
      </div>

      <div className={styles.neighborhoodControls}>
        <div className={styles.controlGroup}>
          <span className={styles.controlLabel}>Query sequence</span>
          <div className={styles.segmented} role="group" aria-label="Query sequence">
            {QUERY_IDS.map((id) => (
              <button
                key={id}
                type="button"
                aria-pressed={queryId === id}
                onClick={() => setQueryId(id)}
              >
                {id}
              </button>
            ))}
          </div>
        </div>

        <label className={styles.rangeControl}>
          <span>
            <span className={styles.controlLabel}>Query corruption</span>
            <output>{noise * 25}%</output>
          </span>
          <input
            type="range"
            aria-label="Synthetic query corruption"
            min="0"
            max="4"
            step="1"
            value={noise}
            onChange={(event) => setNoise(Number(event.target.value))}
          />
        </label>

        <div className={styles.controlGroup}>
          <span className={styles.controlLabel}>Ranking signal</span>
          <div className={styles.segmented} role="group" aria-label="Ranking signal">
            <button
              type="button"
              aria-pressed={mode === "pairwise"}
              onClick={() => setMode("pairwise")}
            >
              Pairwise cosine
            </button>
            <button
              type="button"
              aria-pressed={mode === "contextual"}
              onClick={() => setMode("contextual")}
            >
              Contextual
            </button>
          </div>
        </div>
      </div>

      <div className={styles.neighborhoodBody}>
        <div className={styles.embeddingCanvas}>
          <svg
            viewBox="0 0 650 430"
            role="img"
            aria-labelledby={`${titleId} ${descriptionId}`}
          >
            <title id={titleId}>{`Synthetic embedding neighborhood for query ${queryId}`}</title>
            <desc id={descriptionId}>
              Twelve motion embeddings in three labeled classes. Lines show the
              selected query ranking and, in contextual mode, shared and
              reciprocal neighborhood relations.
            </desc>
            <path className={styles.embeddingAxis} d="M40 392H612M40 392V38" />
            <path className={styles.embeddingGrid} d="M40 294H612M40 196H612M40 98H612M184 38V392M328 38V392M472 38V392" />

            {contextualEdges.map((edge) => (
              <line
                key={`${edge.kind}-${edge.start}-${edge.end}`}
                className={styles.contextEdge}
                data-kind={edge.kind}
                x1={points[edge.start].x}
                y1={points[edge.start].y}
                x2={points[edge.end].x}
                y2={points[edge.end].y}
              />
            ))}

            {topRanking.slice(0, 4).map(({ point, index }, rank) => (
              <line
                key={`rank-${point.id}`}
                className={styles.rankEdge}
                data-rank={rank + 1}
                x1={points[queryIndex].x}
                y1={points[queryIndex].y}
                x2={points[index].x}
                y2={points[index].y}
              />
            ))}

            {points.map((point, index) => (
              <PointGlyph
                key={point.id}
                point={point}
                isQuery={index === queryIndex}
                isRanked={rankedIndices.has(index)}
              />
            ))}
          </svg>
        </div>

        <aside className={styles.rankingPanel} aria-label="Current synthetic ranking">
          <div className={styles.legend}>
            <span>
              <ShapeMark shape="circle" /> Reach
            </span>
            <span>
              <ShapeMark shape="square" /> Squat
            </span>
            <span>
              <ShapeMark shape="triangle" /> Turn
            </span>
          </div>
          <p className={styles.rankingStatus} aria-live="polite">
            At {noise * 25}% simulated corruption, {mode} ranking places{" "}
            <strong>{first.point.id}</strong> ({first.point.label}) first.
          </p>
          <ol className={styles.rankingList}>
            {topRanking.map(({ point, score }, index) => (
              <li key={point.id}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span>
                  <strong>{point.id}</strong>
                  <small>{point.label}</small>
                </span>
                <output aria-label={`${scoreName} ${score.toFixed(2)}`}>
                  {score.toFixed(2)}
                </output>
              </li>
            ))}
          </ol>
          <div className={styles.edgeLegend}>
            <span>
              <i data-edge="rank" /> Current rank
            </span>
            {mode === "contextual" ? (
              <>
                <span>
                  <i data-edge="reciprocal" /> Reciprocal
                </span>
                <span>
                  <i data-edge="shared" /> Shared context
                </span>
              </>
            ) : null}
          </div>
        </aside>
      </div>

      <p className={styles.visualNote}>
        The points are deterministic teaching data. They show how a perturbed
        pairwise score and a neighborhood-derived score can order the same
        batch differently; they do not predict an experimental outcome.
      </p>
    </div>
  );
}

type MatrixStage =
  | "similarity"
  | "neighborhood"
  | "w1"
  | "reciprocal"
  | "w2"
  | "contextual";

const MATRIX_STAGES: readonly {
  id: MatrixStage;
  label: string;
  equation: string;
  summary: string;
}[] = [
  {
    id: "similarity",
    label: "Cosine",
    equation: "S = ZZᵀ",
    summary: "Every normalized embedding is compared with every other embedding.",
  },
  {
    id: "neighborhood",
    label: "Top-k",
    equation: "N = 𝟙[D ≤ dₖ + ε]",
    summary: "An expanded top-k mask records which sequences count as local neighbors.",
  },
  {
    id: "w1",
    label: "Shared",
    equation: "W₁ = ½(M₊ + M₋) ⊙ N",
    summary: "Neighbor and non-neighbor agreement are combined, then gated by N.",
  },
  {
    id: "reciprocal",
    label: "Reciprocal",
    equation: "R = Nₖ⁄₂ ⊙ Nₖ⁄₂ᵀ",
    summary: "The stricter graph keeps only mutual half-neighborhood relations.",
  },
  {
    id: "w2",
    label: "Expand",
    equation: "W₂ = RW₁ / R1",
    summary: "Each row borrows evidence from its reciprocal neighbors.",
  },
  {
    id: "contextual",
    label: "Symmetric",
    equation: "W = ½(W₂ + W₂ᵀ)",
    summary: "The final contextual score gives both directions equal weight.",
  },
];

type MatrixCellStyle = CSSProperties & {
  "--matrix-value": number;
};

function getStageMatrix(
  stage: MatrixStage,
  result: ReturnType<typeof contextualSimilarity>,
): Matrix {
  if (stage === "similarity") {
    return result.similarity;
  }
  if (stage === "neighborhood") {
    return result.neighborhood;
  }
  if (stage === "w1") {
    return result.w1;
  }
  if (stage === "reciprocal") {
    return result.reciprocal;
  }
  if (stage === "w2") {
    return result.w2;
  }
  return result.contextual;
}

export function ContextualMatrixExplorer() {
  const [stage, setStage] = useState<MatrixStage>("similarity");
  const [activeCell, setActiveCell] = useState({ row: 0, column: 1 });
  const cellRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const result = useMemo(
    () =>
      contextualSimilarity(
        DEMO_POINTS.map((point) => point.embedding),
        { k: DEMO_K },
      ),
    [],
  );
  const stageDefinition =
    MATRIX_STAGES.find((candidate) => candidate.id === stage) ??
    MATRIX_STAGES[0];
  const matrix = getStageMatrix(stage, result);
  const activeValue = matrix[activeCell.row][activeCell.column];
  const activeRow = DEMO_POINTS[activeCell.row];
  const activeColumn = DEMO_POINTS[activeCell.column];

  function focusCell(row: number, column: number) {
    const boundedRow = Math.min(Math.max(row, 0), DEMO_POINTS.length - 1);
    const boundedColumn = Math.min(
      Math.max(column, 0),
      DEMO_POINTS.length - 1,
    );
    setActiveCell({ row: boundedRow, column: boundedColumn });
    cellRefs.current[boundedRow * DEMO_POINTS.length + boundedColumn]?.focus();
  }

  function handleCellKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    row: number,
    column: number,
  ) {
    const movement: Partial<Record<string, readonly [number, number]>> = {
      ArrowUp: [-1, 0],
      ArrowDown: [1, 0],
      ArrowLeft: [0, -1],
      ArrowRight: [0, 1],
    };
    const delta = movement[event.key];

    if (!delta) {
      return;
    }

    event.preventDefault();
    focusCell(row + delta[0], column + delta[1]);
  }

  return (
    <div className={`${styles.visual} ${styles.matrixExplorer}`}>
      <div className={styles.visualHeader}>
        <div>
          <p className={styles.visualKicker}>Interactive 03</p>
          <h3>Contextual matrix microscope</h3>
        </div>
        <p className={styles.demoFlag}>3 classes × 4 samples / k = 4</p>
      </div>

      <div className={styles.stageSelector} role="group" aria-label="Matrix stage">
        {MATRIX_STAGES.map((candidate, index) => (
          <button
            key={candidate.id}
            type="button"
            aria-pressed={candidate.id === stage}
            onClick={() => setStage(candidate.id)}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            {candidate.label}
          </button>
        ))}
      </div>

      <div className={styles.matrixBody}>
        <div className={styles.matrixViewport}>
          <div
            className={styles.matrixGrid}
            role="grid"
            aria-label={`${stageDefinition.label} matrix for a fixed synthetic balanced batch`}
            aria-rowcount={DEMO_POINTS.length}
            aria-colcount={DEMO_POINTS.length}
          >
            <span className={styles.matrixCorner} aria-hidden="true">
              i/j
            </span>
            {DEMO_POINTS.map((point) => (
              <span className={styles.matrixColumnLabel} key={`column-${point.id}`}>
                {point.id}
              </span>
            ))}

            {DEMO_POINTS.map((rowPoint, row) => (
              <Fragment key={rowPoint.id}>
                <span className={styles.matrixRowLabel}>{rowPoint.id}</span>
                {DEMO_POINTS.map((columnPoint, column) => {
                  const value = matrix[row][column];
                  const intensity =
                    stage === "similarity"
                      ? Math.min(Math.max((value + 1) / 2, 0), 1)
                      : Math.min(Math.max(value, 0), 1);
                  const stableIntensity =
                    Math.round(intensity * 1_000_000) / 1_000_000;
                  const selected =
                    row === activeCell.row && column === activeCell.column;
                  const sameClass = rowPoint.label === columnPoint.label;
                  const classes = [
                    styles.matrixCell,
                    row % DEMO_K === DEMO_K - 1 ? styles.matrixRowBreak : "",
                    column % DEMO_K === DEMO_K - 1
                      ? styles.matrixColumnBreak
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ");

                  return (
                    <button
                      key={`${rowPoint.id}-${columnPoint.id}`}
                      ref={(node) => {
                        cellRefs.current[row * DEMO_POINTS.length + column] =
                          node;
                      }}
                      type="button"
                      role="gridcell"
                      className={classes}
                      style={
                        {
                          "--matrix-value": stableIntensity,
                        } as MatrixCellStyle
                      }
                      tabIndex={selected ? 0 : -1}
                      data-selected={selected ? "true" : undefined}
                      data-same-class={sameClass ? "true" : undefined}
                      data-high={stableIntensity > 0.55 ? "true" : undefined}
                      aria-label={`${rowPoint.id} to ${columnPoint.id}: ${value.toFixed(2)}`}
                      onFocus={() => setActiveCell({ row, column })}
                      onPointerEnter={() => setActiveCell({ row, column })}
                      onKeyDown={(event) =>
                        handleCellKeyDown(event, row, column)
                      }
                    >
                      <span>{value.toFixed(1)}</span>
                    </button>
                  );
                })}
              </Fragment>
            ))}
          </div>
        </div>

        <aside className={styles.matrixExplanation}>
          <p className={styles.matrixEquation}>{stageDefinition.equation}</p>
          <p>{stageDefinition.summary}</p>
          <div className={styles.cellReadout} aria-live="polite">
            <span>Focused pair</span>
            <strong>
              {activeRow.id} ↔ {activeColumn.id}
            </strong>
            <output>{activeValue.toFixed(3)}</output>
            <small>
              {activeRow.label} / {activeColumn.label}
              {activeRow.label === activeColumn.label
                ? " — same synthetic class"
                : " — different synthetic classes"}
            </small>
          </div>
          <div className={styles.matrixLegend} aria-hidden="true">
            <span>Lower</span>
            <i />
            <span>Higher</span>
          </div>
          <p className={styles.keyboardHint}>
            Focus the matrix, then use arrow keys to inspect adjacent cells.
          </p>
        </aside>
      </div>

      <p className={styles.visualNote}>
        This fixed 12-sequence batch is intentionally small. The browser mirrors
        the construction order for explanation only; training-scale contextual
        computation is cubic in batch size.
      </p>
    </div>
  );
}

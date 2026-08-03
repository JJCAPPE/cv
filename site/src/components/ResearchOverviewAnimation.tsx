"use client";

import { useEffect, useId, useRef, useState } from "react";
import styles from "./ResearchOverviewAnimation.module.css";

type ResearchOverviewAnimationProps = {
  variant?: "hero" | "rail";
};

const LIMBS = [
  [50, 18, 50, 42],
  [50, 42, 32, 58],
  [32, 58, 20, 88],
  [20, 88, 13, 116],
  [50, 42, 68, 58],
  [68, 58, 80, 88],
  [80, 88, 87, 116],
  [50, 42, 50, 94],
  [50, 94, 36, 105],
  [36, 105, 30, 141],
  [50, 94, 64, 105],
  [64, 105, 70, 141],
] as const;

const JOINTS = [
  [50, 18, 6],
  [50, 42, 3],
  [32, 58, 3],
  [20, 88, 3],
  [13, 116, 3],
  [68, 58, 3],
  [80, 88, 3],
  [87, 116, 3],
  [50, 94, 3],
  [36, 105, 3],
  [30, 141, 3],
  [64, 105, 3],
  [70, 141, 3],
] as const;

function MiniPose({
  className,
  transform,
}: {
  className: string;
  transform: string;
}) {
  return (
    <g className={className} transform={transform}>
      {LIMBS.map(([x1, y1, x2, y2]) => (
        <line key={`${x1}-${y1}-${x2}-${y2}`} x1={x1} y1={y1} x2={x2} y2={y2} />
      ))}
      {JOINTS.map(([cx, cy, r]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} />
      ))}
    </g>
  );
}

export function ResearchOverviewAnimation({
  variant = "hero",
}: ResearchOverviewAnimationProps) {
  const overviewRef = useRef<HTMLElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const overview = overviewRef.current;

    if (!overview) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        overview.dataset.visibilityPaused = String(!entry.isIntersecting);
      },
      { rootMargin: "12% 0px", threshold: 0.01 },
    );

    observer.observe(overview);

    return () => observer.disconnect();
  }, []);

  return (
    <figure
      ref={overviewRef}
      className={styles.overview}
      data-paused={paused}
      data-visibility-paused="true"
      data-variant={variant}
    >
      <div className={styles.header}>
        <div>
          <p>System view / research question</p>
          <strong>Pose → context → retrieval</strong>
        </div>
        <button
          type="button"
          aria-pressed={paused}
          onClick={() => setPaused((current) => !current)}
        >
          {paused ? "Play sequence" : "Pause sequence"}
        </button>
      </div>

      <div
        className={styles.flow}
        role="img"
        aria-labelledby={`${titleId} ${descriptionId}`}
      >
        <span className={styles.visuallyHidden} id={titleId}>
          Research pipeline from corrupted pose sequence to contextual motion
          retrieval
        </span>
        <span className={styles.visuallyHidden} id={descriptionId}>
          A noisy pose query passes through a temporal encoder, joins a
          contextual neighborhood graph, and is ranked against a clean motion
          gallery. This is an explanatory animation, not a measured result.
        </span>

        <div className={styles.stage} data-stage="query" aria-hidden="true">
          <div className={styles.stageLabel}>
            <span>01</span>
            <p>Noisy query</p>
          </div>
          <svg className={styles.stageGraphic} viewBox="0 0 210 180">
            <line className={styles.floor} x1="12" y1="160" x2="198" y2="160" />
            <MiniPose
              className={styles.poseTrail}
              transform="translate(8 18) scale(.78)"
            />
            <MiniPose
              className={styles.poseTrail}
              transform="translate(68 18) scale(.78)"
            />
            <MiniPose
              className={styles.poseQuery}
              transform="translate(110 18) scale(.78)"
            />
            <g className={styles.noiseMarks}>
              <path d="M152 82l10 10m0-10-10 10" />
              <path d="M181 118l10 10m0-10-10 10" />
              <circle cx="161" cy="91" r="14" />
            </g>
          </svg>
          <p className={styles.stageNote}>jitter / mask / frame loss</p>
        </div>

        <div className={styles.stage} data-stage="encoder" aria-hidden="true">
          <div className={styles.stageLabel}>
            <span>02</span>
            <p>Temporal encoder</p>
          </div>
          <svg className={styles.stageGraphic} viewBox="0 0 210 180">
            <g className={styles.sequenceTokens}>
              {[34, 48, 64, 82, 101, 121].map((height, index) => (
                <rect
                  key={height}
                  x={18 + index * 18}
                  y={142 - height}
                  width="9"
                  height={height}
                />
              ))}
            </g>
            <path className={styles.flowLine} d="M132 92h39" />
            <path className={styles.flowArrow} d="m165 84 9 8-9 8" />
            <circle className={styles.embeddingRing} cx="181" cy="92" r="21" />
            <circle className={styles.embeddingPoint} cx="181" cy="92" r="5" />
            <text className={styles.svgText} x="18" y="161">
              T × J × C
            </text>
            <text className={styles.svgText} x="170" y="128">
              ‖z‖₂=1
            </text>
          </svg>
          <p className={styles.stageNote}>sequence → normalized z</p>
        </div>

        <div className={styles.stage} data-stage="context" aria-hidden="true">
          <div className={styles.stageLabel}>
            <span>03</span>
            <p>Local context</p>
          </div>
          <svg className={styles.stageGraphic} viewBox="0 0 210 180">
            <g className={styles.contextEdges}>
              <line x1="102" y1="91" x2="46" y2="46" />
              <line x1="102" y1="91" x2="164" y2="46" />
              <line x1="102" y1="91" x2="169" y2="128" />
              <line x1="102" y1="91" x2="42" y2="132" />
              <line x1="46" y1="46" x2="164" y2="46" />
              <line x1="42" y1="132" x2="169" y2="128" />
            </g>
            <g className={styles.contextNodes}>
              <circle cx="46" cy="46" r="9" />
              <circle cx="164" cy="46" r="9" />
              <circle cx="169" cy="128" r="9" />
              <circle cx="42" cy="132" r="9" />
              <circle className={styles.queryNode} cx="102" cy="91" r="13" />
            </g>
            <text className={styles.queryLabel} x="98" y="95">
              q
            </text>
            <text className={styles.svgText} x="18" y="165">
              shared + reciprocal neighbors
            </text>
          </svg>
          <p className={styles.stageNote}>pairwise distance + consensus</p>
        </div>

        <div className={styles.stage} data-stage="gallery" aria-hidden="true">
          <div className={styles.stageLabel}>
            <span>04</span>
            <p>Clean gallery</p>
          </div>
          <div className={styles.ranking}>
            <div className={styles.rank} data-rank="match">
              <span>01</span>
              <i />
              <p>same motion</p>
            </div>
            <div className={styles.rank}>
              <span>02</span>
              <i />
              <p>near neighbor</p>
            </div>
            <div className={styles.rank}>
              <span>03</span>
              <i />
              <p>other motion</p>
            </div>
          </div>
          <p className={styles.stageNote}>ranked by contextual similarity</p>
        </div>
      </div>

      <figcaption>
        <span>Corrupted query → clean-gallery retrieval</span>
        <span>Explanatory animation / not measured output</span>
      </figcaption>
    </figure>
  );
}

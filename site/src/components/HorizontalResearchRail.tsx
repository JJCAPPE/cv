"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useLayoutEffect,
  useRef,
  type MouseEvent,
} from "react";
import type { ScrollTrigger as ScrollTriggerInstance } from "gsap/ScrollTrigger";
import type { ResearchShowcaseItem } from "@/content/research";
import {
  alignCurrentHash,
  mountGsapScrollEnhancement,
  observeScrollGeometry,
} from "@/lib/gsapScroll";
import { ResearchOverviewAnimation } from "./ResearchOverviewAnimation";
import styles from "./HorizontalResearchRail.module.css";

export type HorizontalShowcaseItem = Omit<
  ResearchShowcaseItem,
  "updatedAt"
>;

type HorizontalResearchRailProps = {
  items: HorizontalShowcaseItem[];
  sectionId?: string;
  anchorId?: string;
  heading?: string;
  description?: string;
  navigationLabel?: string;
  skipTargetId?: string;
  skipLabel?: string;
  dataNamespace?: "project" | "research";
};

const WIDE_MOTION_QUERY =
  "(min-width: 961px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const RESEARCH_EAGER_HASHES = ["#research", "#notes", "#contact"];
const PROJECT_EAGER_HASHES = ["#work", "#research", "#notes", "#contact"];

function normalizeDashes(value: string) {
  return value.replace(/[\u2013\u2014]/g, "-");
}

export function HorizontalResearchRail({
  items,
  sectionId = "research",
  anchorId,
  heading = "Research",
  description =
    "Studies on robust learning, from noisy motion embeddings to biologically inspired adaptability.",
  navigationLabel = "Research navigation",
  skipTargetId = "notes",
  skipLabel = "Skip research showcase",
  dataNamespace = "research",
}: HorizontalResearchRailProps) {
  const railRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const previousButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const triggerRef = useRef<ScrollTriggerInstance>(null);
  const updateTriggerRef = useRef<(() => void) | null>(null);
  const activeIndexRef = useRef(0);
  const eagerHashes =
    dataNamespace === "project" ? PROJECT_EAGER_HASHES : RESEARCH_EAGER_HASHES;
  const headingId = `${sectionId}-heading`;

  const setActiveIndex = useCallback(
    (requestedIndex: number) => {
      const rail = railRef.current;
      const lastIndex = Math.max(items.length - 1, 0);
      const index = Math.min(Math.max(requestedIndex, 0), lastIndex);

      activeIndexRef.current = index;

      if (previousButtonRef.current) {
        previousButtonRef.current.disabled = index === 0;
      }

      if (nextButtonRef.current) {
        nextButtonRef.current.disabled = index === lastIndex;
      }

      if (statusRef.current && items[index]) {
        statusRef.current.textContent = `${normalizeDashes(items[index].title)} selected`;
      }

      rail
        ?.querySelectorAll<HTMLElement>("[data-showcase-panel]")
        .forEach((panel, panelIndex) => {
          panel.dataset.active = String(panelIndex === index);
        });
    },
    [items],
  );

  useLayoutEffect(() => {
    const rail = railRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;

    if (!rail || !viewport || !track || items.length === 0) {
      return;
    }

    setActiveIndex(0);

    const panels = Array.from(
      rail.querySelectorAll<HTMLElement>("[data-showcase-panel]"),
    );
    const observer = new IntersectionObserver(
      () => {
        if (rail.dataset.enhanced === "true") {
          return;
        }

        const viewportCenter =
          viewport.getBoundingClientRect().left + viewport.clientWidth / 2;
        const closestPanel = panels.reduce(
          (closest, panel, index) => {
            const bounds = panel.getBoundingClientRect();
            const distance = Math.abs(
              bounds.left + bounds.width / 2 - viewportCenter,
            );

            return distance < closest.distance
              ? { index, distance }
              : closest;
          },
          { index: 0, distance: Number.POSITIVE_INFINITY },
        );

        setActiveIndex(closestPanel.index);
      },
      {
        root: viewport,
        threshold: [0.45, 0.7, 0.9],
      },
    );

    panels.forEach((panel) => observer.observe(panel));

    if (items.length < 2) {
      return () => observer.disconnect();
    }

    const teardown = mountGsapScrollEnhancement({
      target: rail,
      eagerHashes,
      mediaQuery: WIDE_MOTION_QUERY,
      prepare: () => {
        rail.dataset.enhanced = "pending";
      },
      reset: () => {
        delete rail.dataset.enhanced;
        triggerRef.current = null;
        updateTriggerRef.current = null;
      },
      setup: ({ gsap, ScrollTrigger }) => {
        const media = gsap.matchMedia();
        const context = gsap.context(() => {
          media.add(WIDE_MOTION_QUERY, () => {
            rail.dataset.enhanced = "true";

            const lockTrackWidth = () => {
              const trackStyle = window.getComputedStyle(track);
              const panelsWidth = panels.reduce(
                (width, panel) => width + panel.getBoundingClientRect().width,
                0,
              );
              const gap = Number.parseFloat(trackStyle.columnGap) || 0;
              const padding =
                (Number.parseFloat(trackStyle.paddingLeft) || 0) +
                (Number.parseFloat(trackStyle.paddingRight) || 0);

              track.style.width = `${Math.ceil(
                panelsWidth + gap * Math.max(panels.length - 1, 0) + padding,
              )}px`;
            };

            lockTrackWidth();

            const distance = () =>
              Math.max(track.clientWidth - viewport.clientWidth, 0);

            if (distance() === 0) {
              delete rail.dataset.enhanced;
              return;
            }

            const panelStops = () => {
              const leadingInset = panels[0]?.offsetLeft ?? 0;

              return panels.map((panel) =>
                Math.min(
                  Math.max(panel.offsetLeft - leadingInset, 0),
                  distance(),
                ),
              );
            };

            const timeline = gsap.timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: rail,
                start: "top top",
                end: () => `+=${distance()}`,
                pin: rail,
                scrub: true,
                fastScrollEnd: true,
                invalidateOnRefresh: true,
                anticipatePin: 1,
                onUpdate: (trigger) => {
                  const position = trigger.progress * distance();
                  const stops = panelStops();
                  const closestIndex = stops.reduce(
                    (closest, stop, index) =>
                      Math.abs(stop - position) <
                      Math.abs(stops[closest] - position)
                        ? index
                        : closest,
                    0,
                  );

                  if (closestIndex !== activeIndexRef.current) {
                    setActiveIndex(closestIndex);
                  }
                },
              },
            });

            timeline.to(track, { x: () => -distance(), duration: 1 }, 0);

            panels.forEach((panel, index) => {
              const motionMedia = panel.querySelector<HTMLElement>(
                "[data-showcase-media]",
              );
              const copy = panel.querySelector<HTMLElement>(
                "[data-showcase-copy]",
              );

              if (motionMedia) {
                timeline.fromTo(
                  motionMedia,
                  { xPercent: index % 2 === 0 ? -3 : 3 },
                  {
                    xPercent: index % 2 === 0 ? 3 : -3,
                    duration: 1,
                  },
                  0,
                );
              }

              if (copy && index > 0) {
                const revealAt = Math.max(
                  index / Math.max(panels.length - 1, 1) - 0.2,
                  0,
                );

                timeline.fromTo(
                  copy,
                  { x: 64, opacity: 0.45 },
                  { x: 0, opacity: 1, duration: 0.2 },
                  revealAt,
                );
              }
            });

            triggerRef.current = timeline.scrollTrigger ?? null;
            updateTriggerRef.current = () => ScrollTrigger.update();

            const alignHash = () => alignCurrentHash(eagerHashes);
            const disconnectGeometry = observeScrollGeometry({
              elements: [rail, viewport],
              refresh: () => {
                lockTrackWidth();
                ScrollTrigger.refresh();
              },
              alignHash,
            });
            const handleHashChange = () => {
              if (eagerHashes.includes(window.location.hash)) {
                lockTrackWidth();
                ScrollTrigger.refresh();
                window.requestAnimationFrame(alignHash);
              }
            };

            window.addEventListener("hashchange", handleHashChange);

            return () => {
              delete rail.dataset.enhanced;
              track.style.removeProperty("width");
              disconnectGeometry();
              window.removeEventListener("hashchange", handleHashChange);
              triggerRef.current = null;
              updateTriggerRef.current = null;
            };
          });
        }, rail);

          return () => {
            context.revert();
            media.revert();
            triggerRef.current = null;
            updateTriggerRef.current = null;
          };
      },
    });

    return () => {
      observer.disconnect();
      teardown();
    };
  }, [eagerHashes, items.length, setActiveIndex]);

  function scrollToItem(index: number, requestedBehavior: ScrollBehavior) {
    const rail = railRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const trigger = triggerRef.current;
    const panels = rail?.querySelectorAll<HTMLElement>(
      "[data-showcase-panel]",
    );
    const panel = panels?.item(
      Math.min(Math.max(index, 0), Math.max(items.length - 1, 0)),
    );

    if (!rail || !viewport || !track || !panel) {
      return;
    }

    const panelIndex = Array.from(panels ?? []).indexOf(panel);
    const behavior = window.matchMedia(REDUCED_MOTION_QUERY).matches
      ? "auto"
      : requestedBehavior;

    setActiveIndex(panelIndex);

    if (rail.dataset.enhanced === "true" && trigger) {
      const distance = Math.max(track.scrollWidth - viewport.clientWidth, 0);
      const leadingInset = panels?.item(0).offsetLeft ?? 0;
      const panelPosition = Math.min(
        Math.max(panel.offsetLeft - leadingInset, 0),
        distance,
      );
      const progress = distance === 0 ? 0 : panelPosition / distance;
      const targetScroll =
        trigger.start + (trigger.end - trigger.start) * progress;
      const root = document.documentElement;
      const inlineScrollBehavior = root.style.scrollBehavior;

      root.style.scrollBehavior = "auto";
      window.scrollTo({ top: targetScroll, behavior: "auto" });
      root.style.scrollBehavior = inlineScrollBehavior;
      updateTriggerRef.current?.();
      trigger.animation?.progress(progress);
      return;
    }

    viewport.scrollTo({
      left:
        panel.offsetLeft - (viewport.clientWidth - panel.clientWidth) / 2,
      behavior,
    });
  }

  function skipShowcase(event: MouseEvent<HTMLAnchorElement>) {
    const target = document.getElementById(skipTargetId);

    if (!target) {
      return;
    }

    event.preventDefault();
    const oldURL = window.location.href;
    window.history.pushState(null, "", `#${skipTargetId}`);
    window.dispatchEvent(
      new HashChangeEvent("hashchange", {
        oldURL,
        newURL: window.location.href,
      }),
    );
    target.dataset.restoreFocus = "true";
    target.scrollIntoView({ behavior: "auto", block: "start" });
    target.focus({ preventScroll: true });
    window.setTimeout(() => {
      delete target.dataset.restoreFocus;
    }, 2_000);
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      {anchorId ? (
        <span id={anchorId} className={styles.anchor} aria-hidden="true" />
      ) : null}
      <a
        className={styles.skipLink}
        href={`#${skipTargetId}`}
        onClick={skipShowcase}
      >
        {skipLabel}
      </a>
      <section
        id={sectionId}
        ref={railRef}
        className={styles.rail}
        aria-labelledby={headingId}
        tabIndex={-1}
      >
        <header className={styles.header}>
          <h2 id={headingId} data-section-heading>
            {heading}
          </h2>
          <p>{description}</p>
        </header>

        <div className={styles.controls} aria-label={navigationLabel}>
          <button
            ref={previousButtonRef}
            type="button"
            onClick={() => scrollToItem(activeIndexRef.current - 1, "smooth")}
          >
            <span aria-hidden="true">←</span> Previous
          </button>
          <button
            ref={nextButtonRef}
            type="button"
            onClick={() => scrollToItem(activeIndexRef.current + 1, "smooth")}
          >
            Next <span aria-hidden="true">→</span>
          </button>
        </div>
        <p ref={statusRef} className={styles.srOnly} aria-live="polite">
          {normalizeDashes(items[0].title)} selected
        </p>

        <div
          ref={viewportRef}
          className={styles.viewport}
          data-showcase-viewport
          data-research-viewport={
            dataNamespace === "research" ? "" : undefined
          }
          data-project-viewport={dataNamespace === "project" ? "" : undefined}
        >
          <div
            ref={trackRef}
            className={styles.track}
            data-showcase-track
            data-research-track={
              dataNamespace === "research" ? "" : undefined
            }
            data-project-track={dataNamespace === "project" ? "" : undefined}
          >
            {items.map((item, index) => (
              <article
                key={item.slug}
                className={styles.panel}
                data-showcase-panel
                data-research-panel={
                  dataNamespace === "research" ? "" : undefined
                }
                data-project-panel={
                  dataNamespace === "project" ? "" : undefined
                }
                data-active={index === 0}
              >
                <div className={styles.mediaFrame}>
                  <div
                    className={`${styles.mediaMotion} ${
                      item.media.kind === "image" ? styles.mediaOverscan : ""
                    }`}
                    data-showcase-media={
                      item.media.kind === "image" ? "true" : undefined
                    }
                  >
                    {item.media.kind === "contextual-overview" ? (
                      <ResearchOverviewAnimation variant="rail" />
                    ) : (
                      <Image
                        className={`${styles.image} ${
                          item.media.fit === "contain"
                            ? styles.imageContain
                            : ""
                        }`}
                        src={item.media.src}
                        alt={normalizeDashes(item.media.alt)}
                        width={item.media.width}
                        height={item.media.height}
                        sizes="(max-width: 960px) 88vw, 52vw"
                      />
                    )}
                  </div>
                </div>

                <div className={styles.copy} data-showcase-copy>
                  <div className={styles.meta}>
                    <span>{normalizeDashes(item.type)}</span>
                    <span>{normalizeDashes(item.year)}</span>
                  </div>
                  <h3>
                    <Link
                      href={item.href}
                      onFocus={() => {
                        if (railRef.current?.dataset.enhanced === "true") {
                          scrollToItem(index, "auto");
                        }
                      }}
                    >
                      {normalizeDashes(item.title)}
                    </Link>
                  </h3>
                  <p>{normalizeDashes(item.summary)}</p>
                  <Link
                    href={item.href}
                    className={styles.action}
                    onFocus={() => {
                      if (railRef.current?.dataset.enhanced === "true") {
                        scrollToItem(index, "auto");
                      }
                    }}
                  >
                    {item.actionLabel} <span aria-hidden="true">↗</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

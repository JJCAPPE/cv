"use client";

import { useLayoutEffect, useRef, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ScrollTrigger as ScrollTriggerInstance } from "gsap/ScrollTrigger";
import {
  alignCurrentHash,
  mountGsapScrollEnhancement,
  observeScrollGeometry,
} from "@/lib/gsapScroll";
import styles from "./HorizontalProjectRail.module.css";

export type HorizontalProjectRailProject = {
  slug: string;
  title: string;
  summary: string;
  year: string;
  type: string;
  cover: {
    src: string;
    alt: string;
    width: number;
    height: number;
    fit?: "cover" | "contain";
    railFit?: "cover" | "contain";
    railLayout?: "split" | "background";
  };
};

type HorizontalProjectRailProps = {
  projects: HorizontalProjectRailProject[];
};

const DESKTOP_MOTION_QUERY =
  "(min-width: 768px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)";
const EAGER_HASHES = ["#work", "#research", "#notes", "#contact"];

function normalizeDashes(value: string) {
  return value.replace(/[\u2013\u2014]/g, "-");
}

function formatProjectPosition(value: number) {
  return String(value).padStart(2, "0");
}

export function HorizontalProjectRail({
  projects,
}: HorizontalProjectRailProps) {
  const railRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressTextRef = useRef<HTMLSpanElement>(null);
  const progressFillRef = useRef<HTMLSpanElement>(null);
  const triggerRef = useRef<ScrollTriggerInstance>(null);
  const updateTriggerRef = useRef<(() => void) | null>(null);

  useLayoutEffect(() => {
    const rail = railRef.current;
    const track = trackRef.current;

    if (!rail || !track || projects.length < 2) {
      return;
    }

    return mountGsapScrollEnhancement({
      target: rail,
      eagerHashes: EAGER_HASHES,
      mediaQuery: DESKTOP_MOTION_QUERY,
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
          media.add(DESKTOP_MOTION_QUERY, () => {
            rail.dataset.enhanced = "true";
            const distance = () =>
              Math.max(track.scrollWidth - rail.clientWidth, 0);

            if (distance() === 0) {
              delete rail.dataset.enhanced;
              return;
            }

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
              },
            });

            timeline.to(track, { x: () => -distance(), duration: 1 }, 0);
            if (progressFillRef.current) {
              timeline.fromTo(
                progressFillRef.current,
                { scaleX: 0 },
                { scaleX: 1, duration: 1 },
                0,
              );
            }
            triggerRef.current = timeline.scrollTrigger ?? null;
            updateTriggerRef.current = () => ScrollTrigger.update();

            const panels = gsap.utils.toArray<HTMLElement>(
              "[data-project-panel]",
              rail,
            );

            const panelInterval = 1 / Math.max(panels.length - 1, 1);

            panels.forEach((panel, index) => {
              const copy = panel.querySelector<HTMLElement>(
                "[data-project-copy]",
              );
              const image = panel.querySelector<HTMLElement>(
                "[data-project-image]",
              );

              if (copy && index > 0) {
                const revealStart = Math.max((index - 0.86) * panelInterval, 0);

                timeline.fromTo(
                  copy,
                  { x: 72 },
                  {
                    x: 0,
                    duration: panelInterval * 0.3,
                  },
                  revealStart,
                );
              }

              if (image) {
                if (image.dataset.projectImageMotion === "static") {
                  gsap.set(image, { xPercent: 0, scale: 1 });
                } else {
                  const imageStart = Math.max((index - 1) * panelInterval, 0);
                  const imageEnd = Math.min((index + 1) * panelInterval, 1);

                  timeline.fromTo(
                    image,
                    { xPercent: -2.5, scale: 1.055 },
                    {
                      xPercent: 2.5,
                      scale: 1.055,
                      duration: Math.max(imageEnd - imageStart, 0.01),
                    },
                    imageStart,
                  );
                }
              }
            });

            let displayedProject = -1;
            const updateProgress = () => {
              if (!progressTextRef.current) {
                return;
              }

              const currentProject = Math.min(
                Math.round(timeline.progress() * (projects.length - 1)) + 1,
                projects.length,
              );

              if (currentProject === displayedProject) {
                return;
              }

              displayedProject = currentProject;

              progressTextRef.current.textContent = `${formatProjectPosition(
                currentProject,
              )} / ${formatProjectPosition(projects.length)}`;
            };

            timeline.eventCallback("onUpdate", updateProgress);
            updateProgress();

            const alignHash = () => alignCurrentHash(EAGER_HASHES);
            const disconnectGeometry = observeScrollGeometry({
              elements: [rail, track],
              refresh: () => ScrollTrigger.refresh(),
              alignHash,
            });
            const handleHashChange = () => {
              if (EAGER_HASHES.includes(window.location.hash)) {
                ScrollTrigger.refresh();
                window.requestAnimationFrame(alignHash);
              }
            };

            window.addEventListener("hashchange", handleHashChange);

            return () => {
              delete rail.dataset.enhanced;
              disconnectGeometry();
              window.removeEventListener("hashchange", handleHashChange);
              triggerRef.current = null;
              updateTriggerRef.current = null;
              if (progressTextRef.current) {
                progressTextRef.current.textContent = `${formatProjectPosition(
                  projects.length,
                )} projects`;
              }
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
  }, [projects.length]);

  function scrollFocusedProjectIntoView(index: number) {
    const rail = railRef.current;
    const track = trackRef.current;
    const trigger = triggerRef.current;

    if (
      !rail ||
      !track ||
      !trigger ||
      !window.matchMedia(DESKTOP_MOTION_QUERY).matches
    ) {
      return;
    }

    const panels = rail.querySelectorAll<HTMLElement>("[data-project-panel]");
    const panel = panels.item(index);
    const distance = Math.max(track.scrollWidth - rail.clientWidth, 0);

    if (!panel || distance === 0) {
      return;
    }

    const panelProgress = Math.min(Math.max(panel.offsetLeft / distance, 0), 1);
    const targetScroll =
      trigger.start + (trigger.end - trigger.start) * panelProgress;

    window.scrollTo({ top: targetScroll, behavior: "auto" });
    updateTriggerRef.current?.();
    trigger.animation?.progress(panelProgress);
  }

  function skipFeaturedWork(event: MouseEvent<HTMLAnchorElement>) {
    const target = document.getElementById("research");

    if (!target) {
      return;
    }

    event.preventDefault();
    const oldURL = window.location.href;
    window.history.pushState(null, "", "#research");
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

  if (projects.length === 0) {
    return null;
  }

  return (
    <>
      <span id="work" className={styles.anchor} aria-hidden="true" />
      <a
        className={styles.skipLink}
        href="#research"
        onClick={skipFeaturedWork}
      >
        Skip featured work
      </a>
      <section
        id="featured-work"
        ref={railRef}
        className={styles.rail}
        aria-labelledby="selected-work-heading"
      >
        <header className={styles.header}>
          <h2 id="selected-work-heading" data-section-heading>
            Selected work
          </h2>
          <div className={styles.orientation} aria-hidden="true">
            <span ref={progressTextRef}>
              {formatProjectPosition(projects.length)} projects
            </span>
            <span className={styles.progressTrack}>
              <span ref={progressFillRef} className={styles.progressFill} />
            </span>
          </div>
        </header>
        <div ref={trackRef} className={styles.track} data-project-track>
          {projects.map((project, index) => (
            <article
              key={project.slug}
              className={styles.panel}
              data-project-panel
              data-project-layout={project.cover.railLayout ?? "split"}
            >
              <Link
                href={`/projects/${project.slug}`}
                className={styles.panelLink}
                aria-label={`View ${normalizeDashes(project.title)}`}
                onFocus={() => scrollFocusedProjectIntoView(index)}
              >
                <figure className={styles.media}>
                  <Image
                    className={`${styles.image} ${
                      project.cover.railFit === "contain"
                        ? styles.imageRailContain
                        : project.cover.fit === "contain"
                          ? styles.imageContain
                          : ""
                    } ${
                      project.slug === "rowing-biomechanics"
                        ? styles.rowingImage
                        : ""
                    }`}
                    data-project-image
                    data-project-image-motion={
                      project.cover.railFit === "contain" &&
                      project.cover.railLayout !== "background"
                        ? "static"
                        : undefined
                    }
                    src={project.cover.src}
                    alt={normalizeDashes(project.cover.alt)}
                    width={project.cover.width}
                    height={project.cover.height}
                    sizes={
                      project.cover.railLayout === "background"
                        ? "(max-width: 767px) 100vw, 92vw"
                        : "(max-width: 767px) 100vw, 62vw"
                    }
                  />
                </figure>

                <div className={styles.copy} data-project-copy>
                  <div className={styles.meta}>
                    <span>{normalizeDashes(project.type)}</span>
                    <span>{normalizeDashes(project.year)}</span>
                  </div>
                  <h3 className={styles.title}>
                    {normalizeDashes(project.title)}
                  </h3>
                  <p className={styles.summary}>
                    {normalizeDashes(project.summary)}
                  </p>
                  <span className={styles.action} aria-hidden="true">
                    View project
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

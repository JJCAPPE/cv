"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import type { ScrollTrigger as ScrollTriggerInstance } from "gsap/ScrollTrigger";
import type { ResearchShowcaseItem } from "@/content/research";
import {
  mountGsapScrollEnhancement,
  observeScrollGeometry,
} from "@/lib/gsapScroll";
import { ResearchOverviewAnimation } from "./ResearchOverviewAnimation";
import styles from "./ResearchFileRelay.module.css";

type FileRelayItem = Omit<ResearchShowcaseItem, "updatedAt">;

type ResearchFileRelayProps = {
  items: FileRelayItem[];
  sectionId?: string;
  heading?: string;
  eyebrow?: string;
  description?: string;
  itemNoun?: string;
  controlsLabel?: string;
  navigationLabel?: string;
};

const DESKTOP_MOTION_QUERY =
  "(min-width: 961px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)";

function formatPosition(value: number) {
  return String(value).padStart(2, "0");
}

function normalizeDashes(value: string) {
  return value.replace(/[\u2013\u2014]/g, "-");
}

export function ResearchFileRelay({
  items,
  sectionId = "research-relay",
  heading = "Research",
  eyebrow = "Research archive",
  description =
    "Three lines of inquiry across motion, noisy observations, and adaptable learning systems.",
  itemNoun = "file",
  controlsLabel = "Choose research file",
  navigationLabel = "Research navigation",
}: ResearchFileRelayProps) {
  const relayRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const previousButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<ScrollTriggerInstance>(null);
  const updateTriggerRef = useRef<(() => void) | null>(null);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const headingId = `${sectionId}-heading`;

  const activateItem = useCallback(
    (requestedIndex: number) => {
      const relay = relayRef.current;
      const lastIndex = Math.max(items.length - 1, 0);
      const index = Math.min(Math.max(requestedIndex, 0), lastIndex);
      const enhanced = relay?.dataset.enhanced === "true";

      activeIndexRef.current = index;
      setActiveIndex((currentIndex) =>
        currentIndex === index ? currentIndex : index,
      );

      const focusedPanel = document.activeElement?.closest<HTMLElement>(
        "[data-relay-panel]",
      );

      if (
        enhanced &&
        focusedPanel &&
        focusedPanel !==
          relay?.querySelectorAll<HTMLElement>("[data-relay-panel]").item(index)
      ) {
        relay
          ?.querySelector<HTMLButtonElement>(
            `[data-relay-control="${index}"]`,
          )
          ?.focus({ preventScroll: true });
      }

      relay
        ?.querySelectorAll<HTMLElement>("[data-relay-panel]")
        .forEach((panel, panelIndex) => {
          const isActive = panelIndex === index;

          panel.dataset.active = String(isActive);
          if (enhanced) {
            panel.toggleAttribute("inert", !isActive);
            panel.setAttribute("aria-hidden", String(!isActive));
          } else {
            panel.removeAttribute("inert");
            panel.removeAttribute("aria-hidden");
          }
        });

      if (previousButtonRef.current) {
        previousButtonRef.current.disabled = index === 0;
      }

      if (nextButtonRef.current) {
        nextButtonRef.current.disabled = index === lastIndex;
      }
    },
    [items.length],
  );

  useLayoutEffect(() => {
    const relay = relayRef.current;
    const viewport = viewportRef.current;
    const stage = stageRef.current;

    if (!relay || !viewport || !stage || items.length === 0) {
      return;
    }

    const panels = Array.from(
      relay.querySelectorAll<HTMLElement>("[data-relay-panel]"),
    );
    const visibility = new Map<Element, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        if (relay.dataset.enhanced === "true") {
          return;
        }

        entries.forEach((entry) => {
          visibility.set(entry.target, entry.intersectionRatio);
        });

        const closestIndex = panels.reduce(
          (closest, panel, index) =>
            (visibility.get(panel) ?? 0) > (visibility.get(panels[closest]) ?? 0)
              ? index
              : closest,
          0,
        );

        activateItem(closestIndex);
      },
      {
        root: viewport,
        threshold: [0.35, 0.55, 0.75],
      },
    );

    panels.forEach((panel) => observer.observe(panel));
    activateItem(0);

    if (items.length < 2) {
      return () => observer.disconnect();
    }

    const teardown = mountGsapScrollEnhancement({
      target: relay,
      mediaQuery: DESKTOP_MOTION_QUERY,
      prepare: () => {
        relay.dataset.enhanced = "pending";
      },
      reset: () => {
        delete relay.dataset.enhanced;
        triggerRef.current = null;
        updateTriggerRef.current = null;
        activateItem(activeIndexRef.current);
      },
      setup: ({ gsap, ScrollTrigger }) => {
        const context = gsap.context(() => {
          relay.dataset.enhanced = "true";

          const spineWidth = () => {
            const spine = panels[0]?.querySelector<HTMLElement>(
              "[data-relay-spine]",
            );

            return spine?.getBoundingClientRect().width || 56;
          };
          const positionPanels = () => {
            const width = spineWidth();

            panels.forEach((panel, index) => {
              panel.style.right = `${index * width}px`;
            });
          };
          const parkedPosition = (panelIndex: number) =>
            Math.max(
              stage.clientWidth -
                (panels.length - panelIndex) * spineWidth(),
              0,
            );
          const stepCount = Math.max(panels.length - 1, 1);
          const syncPanelPositions = (timelineProgress: number) => {
            const timelinePosition = timelineProgress * stepCount;
            const width = spineWidth();

            panels.forEach((panel, index) => {
              const parked = index === 0 ? 0 : parkedPosition(index);
              const revealed = index * width;
              const revealProgress =
                index === 0
                  ? 1
                  : Math.min(
                      Math.max(timelinePosition - (index - 1), 0),
                      1,
                    );

              gsap.set(panel, {
                x: parked + (revealed - parked) * revealProgress,
              });
            });
          };

          positionPanels();
          gsap.set(panels, {
            zIndex: (index: number) => index + 1,
          });
          syncPanelPositions(0);

          const timeline = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: relay,
              start: "top top",
              end: () =>
                `+=${Math.round(window.innerHeight * stepCount * 0.9)}`,
              pin: relay,
              scrub: true,
              fastScrollEnd: true,
              invalidateOnRefresh: true,
              anticipatePin: 1,
              onUpdate: (trigger) => {
                const nextIndex = Math.min(
                  Math.round(trigger.progress * stepCount),
                  panels.length - 1,
                );

                if (nextIndex !== activeIndexRef.current) {
                  activateItem(nextIndex);
                }
              },
            },
          });

          panels.slice(1).forEach((panel, panelOffset) => {
            const panelIndex = panelOffset + 1;

            timeline.fromTo(
              panel,
              {
                x: () => parkedPosition(panelIndex),
              },
              {
                duration: 1,
                immediateRender: false,
                x: () => panelIndex * spineWidth(),
              },
              panelOffset,
            );
          });

          triggerRef.current = timeline.scrollTrigger ?? null;
          updateTriggerRef.current = () => ScrollTrigger.update();
          activateItem(0);

          const disconnectGeometry = observeScrollGeometry({
            elements: [relay, viewport, stage],
            refresh: () => {
              positionPanels();
              ScrollTrigger.refresh();
              syncPanelPositions(timeline.progress());
            },
          });

          return () => {
            delete relay.dataset.enhanced;
            disconnectGeometry();
            triggerRef.current = null;
            updateTriggerRef.current = null;
            panels.forEach((panel) => {
              panel.style.removeProperty("right");
              panel.removeAttribute("inert");
              panel.removeAttribute("aria-hidden");
            });
          };
        }, relay);

        return () => context.revert();
      },
    });

    return () => {
      observer.disconnect();
      teardown();
    };
  }, [activateItem, items.length]);

  function scrollToItem(index: number, requestedBehavior: ScrollBehavior) {
    const relay = relayRef.current;
    const viewport = viewportRef.current;
    const trigger = triggerRef.current;
    const panels = relay?.querySelectorAll<HTMLElement>("[data-relay-panel]");
    const lastIndex = Math.max(items.length - 1, 0);
    const targetIndex = Math.min(Math.max(index, 0), lastIndex);
    const panel = panels?.item(targetIndex);

    if (!relay || !viewport || !panel) {
      return;
    }

    activateItem(targetIndex);

    if (relay.dataset.enhanced === "true" && trigger) {
      const progress = lastIndex === 0 ? 0 : targetIndex / lastIndex;
      const targetScroll =
        trigger.start + (trigger.end - trigger.start) * progress;
      const root = document.documentElement;

      root.classList.add(styles.instantScroll);
      window.scrollTo({ top: targetScroll, behavior: "auto" });
      window.requestAnimationFrame(() => {
        root.classList.remove(styles.instantScroll);
      });
      updateTriggerRef.current?.();
      trigger.animation?.progress(progress);
      return;
    }

    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches
      ? "auto"
      : requestedBehavior;

    viewport.scrollTo({
      behavior,
      left:
        panel.offsetLeft - (viewport.clientWidth - panel.clientWidth) / 2,
    });
  }

  if (items.length === 0) {
    return null;
  }

  const activeItem = items[activeIndex] ?? items[0];

  return (
    <section
      id={sectionId}
      ref={relayRef}
      className={styles.relay}
      aria-labelledby={headingId}
    >
      <header className={styles.header}>
        <p className={styles.eyebrow}>
          {eyebrow} / {formatPosition(items.length)} {itemNoun}
          {items.length === 1 ? "" : "s"}
        </p>
        <h1 id={headingId}>{heading}</h1>
        <p className={styles.intro}>{description}</p>
      </header>

      <div className={styles.controls}>
        <div
          className={styles.fileControls}
          role="group"
          aria-label={controlsLabel}
        >
          {items.map((item, index) => (
            <button
              key={item.slug}
              type="button"
              aria-label={`Show ${normalizeDashes(item.title)}`}
              aria-pressed={index === activeIndex}
              data-active={index === activeIndex}
              data-relay-control={index}
              onClick={() => scrollToItem(index, "smooth")}
            >
              {formatPosition(index + 1)}
            </button>
          ))}
        </div>
        <div
          className={styles.stepControls}
          role="group"
          aria-label={navigationLabel}
        >
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
      </div>

      <p className={styles.srOnly} aria-live="polite">
        {normalizeDashes(activeItem.title)} selected
      </p>

      <div ref={viewportRef} className={styles.viewport}>
        <div ref={stageRef} className={styles.stage}>
          {items.map((item, index) => (
            <article
              key={item.slug}
              className={styles.folio}
              aria-labelledby={`${sectionId}-item-${item.slug}`}
              data-active={index === 0}
              data-relay-panel
              onFocusCapture={() => {
                if (relayRef.current?.dataset.enhanced === "true") {
                  scrollToItem(index, "auto");
                }
              }}
            >
              <div
                className={styles.spine}
                data-relay-spine
                aria-hidden="true"
              >
                <span>{formatPosition(index + 1)}</span>
                <span className={styles.spineTitle}>
                  {normalizeDashes(item.title)}
                </span>
              </div>

              <div className={styles.folioBody}>
                <div className={styles.mediaFrame}>
                  {item.media.kind === "contextual-overview" ? (
                    <ResearchOverviewAnimation
                      active={index === activeIndex}
                      variant="rail"
                    />
                  ) : (
                    <Image
                      className={`${styles.image} ${
                        item.media.fit === "contain" ? styles.imageContain : ""
                      }`}
                      src={item.media.src}
                      alt={normalizeDashes(item.media.alt)}
                      width={item.media.width}
                      height={item.media.height}
                      loading={index === 0 ? "eager" : undefined}
                      fetchPriority={index === 0 ? "high" : undefined}
                      sizes="(max-width: 960px) 88vw, 54vw"
                    />
                  )}
                </div>

                <div className={styles.copy}>
                  <div className={styles.meta}>
                    <span>{normalizeDashes(item.type)}</span>
                    <span>{normalizeDashes(item.year)}</span>
                  </div>
                  <h2 id={`${sectionId}-item-${item.slug}`}>
                    <Link href={item.href}>
                      {normalizeDashes(item.title)}
                    </Link>
                  </h2>
                  <p>{normalizeDashes(item.summary)}</p>
                  <Link href={item.href} className={styles.action}>
                    {item.actionLabel} <span aria-hidden="true">↗</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";

type ProjectsShowcaseProps = {
  children: ReactNode;
  projectCount: number;
};

const DESKTOP_MOTION_QUERY =
  "(min-width: 768px) and (prefers-reduced-motion: no-preference)";

function formatProjectNumber(index: number) {
  return String(index + 1).padStart(2, "0");
}

export function ProjectsShowcase({
  children,
  projectCount,
}: ProjectsShowcaseProps) {
  const galleryRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const gallery = galleryRef.current;
    const stage = stageRef.current;

    if (!gallery || !stage || projectCount < 2) {
      return;
    }

    const cards = Array.from(
      stage.querySelectorAll<HTMLElement>("[data-project-card]"),
    );

    if (cards.length < 2) {
      return;
    }

    let cancelled = false;
    let teardown: (() => void) | undefined;

    void (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);

      if (cancelled) {
        return;
      }

      gsap.registerPlugin(ScrollTrigger);

      const media = gsap.matchMedia();
      const context = gsap.context(() => {
        media.add(DESKTOP_MOTION_QUERY, () => {
          gallery.dataset.enhanced = "true";

          cards.forEach((card, index) => {
            gsap.set(card, {
              xPercent: index === 0 ? 0 : index % 2 === 1 ? 106 : -106,
              zIndex: index + 1,
            });
          });

          let displayedIndex = -1;
          const updateProgress = (nextIndex: number) => {
            if (nextIndex === displayedIndex) {
              return;
            }

            displayedIndex = nextIndex;

            if (progressRef.current) {
              progressRef.current.textContent = `${formatProjectNumber(
                displayedIndex,
              )} / ${formatProjectNumber(cards.length - 1)}`;
            }
          };

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: gallery,
              start: () => {
                const headerHeight =
                  document.querySelector<HTMLElement>(".site-header")
                    ?.offsetHeight ?? 0;

                return `top top+=${headerHeight}`;
              },
              end: () =>
                `+=${Math.round(
                  window.innerHeight * Math.max(cards.length - 1, 1) * 0.55,
                )}`,
              pin: gallery,
              scrub: 0.8,
              invalidateOnRefresh: true,
              anticipatePin: 1,
            },
          });

          cards.slice(1).forEach((card, index) => {
            timeline.to(
              card,
              {
                xPercent: 0,
                duration: 1,
                ease: "power2.inOut",
              },
              index,
            );
          });

          timeline.eventCallback("onUpdate", () => {
            updateProgress(
              Math.min(
                Math.round(timeline.progress() * (cards.length - 1)),
                cards.length - 1,
              ),
            );
          });
          updateProgress(0);

          const handleFocusIn = (event: FocusEvent) => {
            const target = event.target;

            if (!(target instanceof Element)) {
              return;
            }

            const card = target.closest<HTMLElement>("[data-project-card]");
            const cardIndex = card ? cards.indexOf(card) : -1;
            const trigger = timeline.scrollTrigger;

            if (cardIndex < 0 || !trigger) {
              return;
            }

            const progress = cardIndex / (cards.length - 1);
            const targetScroll =
              trigger.start + (trigger.end - trigger.start) * progress;

            window.scrollTo({ top: targetScroll, behavior: "auto" });
            ScrollTrigger.update();
            timeline.progress(progress);
          };

          stage.addEventListener("focusin", handleFocusIn);

          return () => {
            delete gallery.dataset.enhanced;
            stage.removeEventListener("focusin", handleFocusIn);
            if (progressRef.current) {
              progressRef.current.textContent = `${formatProjectNumber(
                cards.length - 1,
              )} projects`;
            }
          };
        });
      }, gallery);

      teardown = () => {
        context.revert();
        media.revert();
      };
    })();

    return () => {
      cancelled = true;
      teardown?.();
    };
  }, [projectCount]);

  return (
    <section
      ref={galleryRef}
      className="project-gallery"
      aria-labelledby="projects-heading"
    >
      <header className="projects-intro">
        <div className="projects-intro__heading">
          <h1 id="projects-heading">Projects</h1>
        </div>
        <p className="projects-intro__description">
          Software, ML, robotics, and product work shaped by measurable
          constraints.
        </p>
        <p className="projects-intro__progress">
          <span ref={progressRef}>
            {formatProjectNumber(projectCount - 1)} projects
          </span>
        </p>
      </header>
      <div ref={stageRef} className="project-gallery__stage">
        {children}
      </div>
    </section>
  );
}

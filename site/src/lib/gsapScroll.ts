type GsapModule = typeof import("gsap");
type ScrollTriggerModule = typeof import("gsap/ScrollTrigger");

type GsapScrollModules = {
  gsap: GsapModule["gsap"];
  ScrollTrigger: ScrollTriggerModule["ScrollTrigger"];
};

type GsapScrollEnhancementOptions = {
  eagerHashes?: string[];
  mediaQuery: string;
  prepare: () => void;
  reset: () => void;
  rootMargin?: string;
  setup: (modules: GsapScrollModules) => () => void;
  target: Element;
};

type GeometryObserverOptions = {
  alignHash?: () => void;
  elements: Element[];
  refresh: () => void;
};

const nextAnimationFrame = () =>
  new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => resolve());
  });

export function alignCurrentHash(allowedHashes: string[]) {
  if (!allowedHashes.includes(window.location.hash)) {
    return;
  }

  const id = window.location.hash.slice(1);
  const target = document.getElementById(id);

  target?.scrollIntoView({ behavior: "auto", block: "start" });
  if (target?.dataset.restoreFocus === "true") {
    target.focus({ preventScroll: true });
  }
}

export function observeScrollGeometry({
  alignHash,
  elements,
  refresh,
}: GeometryObserverOptions) {
  let active = true;
  let frame: number | null = null;
  let previousGeometry = "";

  const measure = () =>
    elements
      .map(
        (element) =>
          `${element.clientWidth}:${element.clientHeight}:${element.scrollWidth}:${element.scrollHeight}`,
      )
      .join("|");

  previousGeometry = measure();

  const schedule = () => {
    if (!active || frame !== null) {
      return;
    }

    frame = window.requestAnimationFrame(() => {
      frame = null;
      const nextGeometry = measure();

      if (nextGeometry === previousGeometry) {
        return;
      }

      previousGeometry = nextGeometry;
      refresh();

      if (alignHash) {
        window.requestAnimationFrame(alignHash);
      }
    });
  };

  const observer = new ResizeObserver(schedule);
  elements.forEach((element) => observer.observe(element));
  window.addEventListener("orientationchange", schedule);
  void document.fonts?.ready.then(schedule);
  if (alignHash) {
    window.requestAnimationFrame(alignHash);
  }

  return () => {
    active = false;
    observer.disconnect();
    window.removeEventListener("orientationchange", schedule);
    if (frame !== null) {
      window.cancelAnimationFrame(frame);
    }
  };
}

export function mountGsapScrollEnhancement({
  eagerHashes = [],
  mediaQuery,
  prepare,
  reset,
  rootMargin = "200% 0px",
  setup,
  target,
}: GsapScrollEnhancementOptions) {
  const media = window.matchMedia(mediaQuery);
  let cancelled = false;
  let loading = false;
  let shouldInitialize = eagerHashes.includes(window.location.hash);
  let modulesPromise: Promise<GsapScrollModules> | null = null;
  let teardown: (() => void) | undefined;

  const loadModules = () => {
    modulesPromise ??= (async () => {
      const { gsap } = await import("gsap");

      // Keep module evaluation and ScrollTrigger setup out of one long task on
      // throttled devices while the story is still inside its preload margin.
      await nextAnimationFrame();
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");

      return { gsap, ScrollTrigger };
    })();

    return modulesPromise;
  };

  const initialize = async () => {
    if (
      cancelled ||
      loading ||
      teardown ||
      !shouldInitialize ||
      !media.matches
    ) {
      return;
    }

    loading = true;
    prepare();

    try {
      const modules = await loadModules();

      await nextAnimationFrame();

      if (cancelled || !media.matches) {
        reset();
        return;
      }

      modules.gsap.registerPlugin(modules.ScrollTrigger);
      teardown = setup(modules);
    } catch (error) {
      reset();
      console.error("Scroll enhancement failed to load.", error);
    } finally {
      loading = false;
    }
  };

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) {
        return;
      }

      shouldInitialize = true;
      observer.disconnect();
      void initialize();
    },
    { rootMargin, threshold: 0.01 },
  );

  const handleCapabilityChange = () => {
    if (media.matches) {
      void initialize();
      return;
    }

    teardown?.();
    teardown = undefined;
    reset();
  };
  const handleHashChange = () => {
    if (!eagerHashes.includes(window.location.hash)) {
      return;
    }

    shouldInitialize = true;
    observer.disconnect();
    void initialize();
  };
  const handlePageShow = () => {
    if (!eagerHashes.includes(window.location.hash)) {
      return;
    }

    shouldInitialize = true;
    observer.disconnect();
    void initialize();
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => alignCurrentHash(eagerHashes));
    });
  };

  media.addEventListener("change", handleCapabilityChange);
  window.addEventListener("hashchange", handleHashChange);
  window.addEventListener("pageshow", handlePageShow);

  if (shouldInitialize) {
    void initialize();
  } else {
    observer.observe(target);
  }

  return () => {
    cancelled = true;
    observer.disconnect();
    media.removeEventListener("change", handleCapabilityChange);
    window.removeEventListener("hashchange", handleHashChange);
    window.removeEventListener("pageshow", handlePageShow);
    teardown?.();
    reset();
  };
}

type GsapModule = typeof import("gsap");
type ScrollTriggerModule = typeof import("gsap/ScrollTrigger");

type GsapScrollEnhancementOptions = {
  mediaQuery: string;
  prepare: () => void;
  reset: () => void;
  setup: (modules: {
    gsap: GsapModule["gsap"];
    ScrollTrigger: ScrollTriggerModule["ScrollTrigger"];
  }) => () => void;
};

export function mountGsapScrollEnhancement({
  mediaQuery,
  prepare,
  reset,
  setup,
}: GsapScrollEnhancementOptions) {
  const media = window.matchMedia(mediaQuery);
  let cancelled = false;
  let loading = false;
  let teardown: (() => void) | undefined;

  const initialize = async () => {
    if (cancelled || loading || teardown || !media.matches) {
      return;
    }

    loading = true;
    prepare();

    try {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);

      if (cancelled) {
        return;
      }

      if (!media.matches) {
        reset();
        return;
      }

      gsap.registerPlugin(ScrollTrigger);
      teardown = setup({ gsap, ScrollTrigger });
    } catch (error) {
      reset();
      console.error("Scroll enhancement failed to load.", error);
    } finally {
      loading = false;
    }
  };

  const handleMotionPreference = () => {
    if (media.matches) {
      void initialize();
    } else if (!teardown) {
      reset();
    }
  };

  media.addEventListener("change", handleMotionPreference);
  void initialize();

  return () => {
    cancelled = true;
    media.removeEventListener("change", handleMotionPreference);
    teardown?.();
    reset();
  };
}

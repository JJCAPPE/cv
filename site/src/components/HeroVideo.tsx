"use client";

import { useEffect, useState } from "react";
import { useMotionActivity } from "@/hooks/useMotionActivity";

type HeroVideoProps = {
  desktopSrc: string;
  mobileSrc: string;
};

const MOBILE_QUERY =
  "(max-width: 767px), ((pointer: coarse) and (orientation: landscape) and (max-height: 500px))";

export function HeroVideo({ desktopSrc, mobileSrc }: HeroVideoProps) {
  const { isActive, ref } = useMotionActivity<HTMLVideoElement>({
    rootMargin: "10% 0px",
  });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const video = ref.current;

    if (!video) {
      return;
    }

    if (isActive) {
      if (!video.src) {
        video.src = window.matchMedia(MOBILE_QUERY).matches
          ? mobileSrc
          : desktopSrc;
        video.load();
      }
      void video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  }, [desktopSrc, isActive, mobileSrc, ref]);

  useEffect(() => {
    const video = ref.current;

    return () => {
      if (video) {
        video.pause();
        video.removeAttribute("src");
        video.load();
      }
    };
  }, [ref]);

  return (
    <video
      ref={ref}
      className="home-hero__video"
      data-hero-video
      data-ready={isReady}
      disablePictureInPicture
      loop
      muted
      onCanPlay={() => setIsReady(true)}
      playsInline
      preload="none"
    />
  );
}

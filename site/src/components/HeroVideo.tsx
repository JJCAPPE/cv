"use client";

import { useEffect, useRef } from "react";

type HeroVideoProps = {
  poster?: string;
  src: string;
};

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export function HeroVideo({ poster, src }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    const motionPreference = window.matchMedia(REDUCED_MOTION_QUERY);
    let isVisible = true;

    const syncPlayback = () => {
      if (motionPreference.matches || document.hidden || !isVisible) {
        video.pause();
        return;
      }

      void video.play().catch(() => undefined);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        syncPlayback();
      },
      { rootMargin: "10% 0px", threshold: 0.01 },
    );

    observer.observe(video);
    motionPreference.addEventListener("change", syncPlayback);
    document.addEventListener("visibilitychange", syncPlayback);
    syncPlayback();

    return () => {
      observer.disconnect();
      motionPreference.removeEventListener("change", syncPlayback);
      document.removeEventListener("visibilitychange", syncPlayback);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      className="home-hero__video"
      autoPlay
      data-hero-video
      disablePictureInPicture
      loop
      muted
      playsInline
      poster={poster}
      preload="metadata"
    >
      <source src={src} type="video/mp4" />
      Your browser does not support embedded video.
    </video>
  );
}

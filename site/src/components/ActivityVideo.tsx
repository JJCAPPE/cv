"use client";

import { useEffect, useRef } from "react";
import { useMotionActivity } from "@/hooks/useMotionActivity";

type ActivityVideoProps = {
  ariaLabel: string;
  className: string;
  poster?: string;
  src: string;
};

export function ActivityVideo({
  ariaLabel,
  className,
  poster,
  src,
}: ActivityVideoProps) {
  const { isActive, ref } = useMotionActivity<HTMLVideoElement>();
  const userPaused = useRef(false);

  useEffect(() => {
    const video = ref.current;

    if (!video) {
      return;
    }

    if (isActive && !userPaused.current) {
      void video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  }, [isActive, ref]);

  return (
    <video
      ref={ref}
      className={className}
      controls
      loop
      muted
      onPause={() => {
        if (isActive) {
          userPaused.current = true;
        }
      }}
      onPlay={() => {
        userPaused.current = false;
      }}
      playsInline
      poster={poster}
      preload="metadata"
      aria-label={ariaLabel}
    >
      <source src={src} type="video/mp4" />
      Your browser does not support embedded video.
    </video>
  );
}

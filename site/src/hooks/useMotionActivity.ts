"use client";

import { useEffect, useRef, useState } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

type NetworkConnection = EventTarget & {
  saveData?: boolean;
};

type NavigatorWithConnection = Navigator & {
  connection?: NetworkConnection;
};

type MotionActivityOptions = {
  rootMargin?: string;
};

type MotionActivity = {
  isActive: boolean;
  reducedMotion: boolean;
  saveData: boolean;
};

export function useMotionActivity<T extends HTMLElement = HTMLElement>({
  rootMargin = "12% 0px",
}: MotionActivityOptions = {}): MotionActivity & {
  ref: React.RefObject<T | null>;
} {
  const ref = useRef<T>(null);
  const [activity, setActivity] = useState({
    isActive: false,
    reducedMotion: false,
    saveData: false,
  });

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const motionPreference = window.matchMedia(REDUCED_MOTION_QUERY);
    const connection = (navigator as NavigatorWithConnection).connection;
    let isIntersecting = false;

    const sync = () => {
      const reducedMotion = motionPreference.matches;
      const saveData = Boolean(connection?.saveData);

      setActivity({
        isActive:
          isIntersecting && !document.hidden && !reducedMotion && !saveData,
        reducedMotion,
        saveData,
      });
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
        sync();
      },
      { rootMargin, threshold: 0.01 },
    );

    observer.observe(element);
    motionPreference.addEventListener("change", sync);
    connection?.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    sync();

    return () => {
      observer.disconnect();
      motionPreference.removeEventListener("change", sync);
      connection?.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [rootMargin]);

  return { ref, ...activity };
}

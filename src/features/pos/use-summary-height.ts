"use client";
import { useLayoutEffect, useRef } from "react";

/** Fit the desktop work panel below its actual position, including text zoom. */
export function useSummaryHeight(enabled: boolean) {
  const ref = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const element = ref.current;
    if (!enabled || !element) return;
    let frame = 0;
    const measure = () => {
      const available =
        window.innerHeight -
        Math.max(16, element.getBoundingClientRect().top) -
        20;
      const header = element.querySelector<HTMLElement>(".card-header");
      const footer = element.querySelector<HTMLElement>(".summary-footer");
      const minimum =
        (header?.offsetHeight ?? 0) + (footer?.offsetHeight ?? 0) + 96;
      // In unusually short/zoomed windows keep the entire panel reachable by page scroll.
      const height =
        available >= minimum ? `${Math.floor(available)}px` : "none";
      if (element.style.getPropertyValue("--summary-height") !== height)
        element.style.setProperty("--summary-height", height);
    };
    const schedule = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(measure);
    };
    const observer = new ResizeObserver(schedule);
    if (element.parentElement) observer.observe(element.parentElement);
    for (const child of element.querySelectorAll(
      ".card-header, .summary-footer",
    ))
      observer.observe(child);
    window.addEventListener("resize", schedule);
    window.addEventListener("scroll", schedule, { passive: true });
    measure();
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule);
    };
  }, [enabled]);
  return ref;
}

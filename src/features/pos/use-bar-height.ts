"use client";
import { useLayoutEffect, type RefObject } from "react";

// One measured source of truth for wrapping text, safe-area changes and text resize.
export function useOrderBarHeight(
  ref: RefObject<HTMLDivElement | null>,
  active: boolean,
) {
  useLayoutEffect(() => {
    const element = ref.current;
    if (!active || !element) return;
    const root = document.documentElement;
    const update = () => {
      const height = `${Math.ceil(element.getBoundingClientRect().height)}px`;
      if (root.style.getPropertyValue("--mobile-order-height") !== height)
        root.style.setProperty("--mobile-order-height", height);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => {
      observer.disconnect();
      root.style.removeProperty("--mobile-order-height");
    };
  }, [active, ref]);
}

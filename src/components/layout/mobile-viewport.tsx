"use client";
import { useEffect } from "react";

/** Presentation only: keep a mobile form and its actions inside the visual viewport. */
export function MobileViewport() {
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;
    const media = window.matchMedia("(max-width: 900px)");
    const root = document.documentElement;
    let frame = 0;
    let restingHeight = window.innerHeight;
    let restingWidth = window.innerWidth;
    function update() {
      const active = document.activeElement;
      const editing =
        active instanceof HTMLElement &&
        active.matches(
          'textarea, [contenteditable="true"], input:not([type="checkbox"]):not([type="radio"]):not([type="button"]):not([type="submit"]):not([readonly]):not([disabled])',
        );
      if (!editing || Math.abs(window.innerWidth - restingWidth) > 80) {
        restingHeight = window.innerHeight;
        restingWidth = window.innerWidth;
      }
      const keyboard =
        media.matches &&
        editing &&
        Math.abs(viewport!.scale - 1) < 0.05 &&
        Math.max(restingHeight, window.innerHeight) - viewport!.height >
          Math.max(120, restingHeight * 0.18);
      root.toggleAttribute("data-mobile-keyboard", Boolean(keyboard));
      if (keyboard) {
        root.style.setProperty("--visual-height", `${viewport!.height}px`);
        root.style.setProperty("--visual-top", `${viewport!.offsetTop}px`);
      } else {
        root.style.removeProperty("--visual-height");
        root.style.removeProperty("--visual-top");
      }
    }
    function schedule() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    }
    viewport.addEventListener("resize", schedule);
    viewport.addEventListener("scroll", schedule);
    window.addEventListener("resize", schedule);
    document.addEventListener("focusin", schedule);
    document.addEventListener("focusout", schedule);
    media.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      viewport.removeEventListener("resize", schedule);
      viewport.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("focusin", schedule);
      document.removeEventListener("focusout", schedule);
      media.removeEventListener("change", schedule);
      root.removeAttribute("data-mobile-keyboard");
      root.style.removeProperty("--visual-height");
      root.style.removeProperty("--visual-top");
    };
  }, []);
  return null;
}

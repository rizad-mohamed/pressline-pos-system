"use client";
import { useLayoutEffect, useRef, useState, type HTMLAttributes } from "react";

/** Retain native, named keyboard scrolling and reveal the affordance only on overflow. */
export function ScrollTable(props: HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState(false);
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const measure = () =>
      setOverflow(element.scrollWidth > element.clientWidth + 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    const table = element.querySelector("table");
    if (table) observer.observe(table);
    return () => observer.disconnect();
  }, []);
  return <div {...props} ref={ref} data-overflow={overflow} />;
}

"use client";
import { useId, useState } from "react";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

/** CSS changes presentation; controls and their owning feature state stay mounted. */
export function AdaptiveFilters({
  children,
  summary,
}: {
  children: React.ReactNode;
  summary: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  return (
    <div
      className="toolbar adaptive-toolbar"
      data-expanded={expanded}
      id={id}
      onFocusCapture={(event) => {
        if (
          event.target instanceof HTMLElement &&
          event.target.closest(".field:not(.search-field)")
        )
          setExpanded(true);
      }}
    >
      {children}
      <Button
        className="mobile-filter-toggle"
        variant="outline"
        aria-expanded={expanded}
        aria-controls={id}
        onClick={() => setExpanded(!expanded)}
      >
        <SlidersHorizontal size={16} />
        Filters & sort
        <ChevronDown size={16} aria-hidden="true" />
      </Button>
      <p className="mobile-filter-summary small muted" role="status">
        {summary}
      </p>
    </div>
  );
}

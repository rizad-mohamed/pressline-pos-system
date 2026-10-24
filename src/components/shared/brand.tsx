import { cn } from "@/lib/utils";

export function BrandMark() {
  return (
    <svg
      viewBox="0 0 40 44"
      fill="none"
      aria-hidden="true"
      className="pressline-mark"
    >
      <path
        d="M8 3h18l8 8v30H8V3Z"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path
        d="M26 3v9h8M15 20h12M15 26h12M15 32h7"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 10v26"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <span className={cn("brand", compact && "brand-compact")}>
      <BrandMark />
      <span className="brand-word">
        pressline<span className="brand-dot">.</span>
      </span>
    </span>
  );
}

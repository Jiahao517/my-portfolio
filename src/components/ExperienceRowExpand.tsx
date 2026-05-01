"use client";

import { useState } from "react";

function ChevronDown({ expanded }: { expanded: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        transition: "transform 0.25s ease",
        transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
        flexShrink: 0,
      }}
    >
      <path
        d="M4 6L8 10L12 6"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ExperienceRowExpand({ description }: { description: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <button
      type="button"
      className={`experience__desc-wrap${expanded ? " experience__desc-wrap--open" : ""}`}
      onClick={() => setExpanded((v) => !v)}
      aria-expanded={expanded}
    >
      <p className="experience__desc">{description}</p>
      <span className="experience__expand-icon" aria-hidden>
        <ChevronDown expanded={expanded} />
      </span>
    </button>
  );
}

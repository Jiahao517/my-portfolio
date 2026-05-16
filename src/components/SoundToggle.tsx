// src/components/SoundToggle.tsx
"use client";

import { useSound } from "@/lib/sound";

export function SoundToggle() {
  const { enabled, active, toggle } = useSound();

  if (!active) return null;

  return (
    <button
      type="button"
      aria-label={enabled ? "关闭声音" : "开启声音"}
      aria-pressed={enabled}
      onClick={toggle}
      style={{
        position: "fixed",
        right: 16,
        bottom: 16,
        zIndex: 60,
        width: 40,
        height: 40,
        display: "grid",
        placeItems: "center",
        borderRadius: 9999,
        background: "rgba(23, 23, 23, 0.85)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        color: "#fff",
        cursor: "pointer",
        transition: "background-color 200ms ease, transform 200ms ease",
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = "scale(0.94)";
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      {enabled ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M4 9v6h4l5 4V5L8 9H4Z"
            fill="currentColor"
          />
          <path
            d="M16 8a5 5 0 0 1 0 8M18.5 5.5a9 9 0 0 1 0 13"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M4 9v6h4l5 4V5L8 9H4Z"
            fill="currentColor"
          />
          <path
            d="m16 9 5 6m0-6-5 6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      )}
    </button>
  );
}

"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type CSSProperties,
} from "react";

interface BorderGlowProps {
  children: ReactNode;
  colors?: string[];
  borderRadius?: number;
  borderWidth?: number;
  /** Distance (px) from edge at which glow becomes fully active */
  edgeSensitivity?: number;
  /** Soft glow blur radius (px) */
  glowRadius?: number;
  /** 0 — 1, opacity multiplier */
  glowIntensity?: number;
  /** Visible arc of the cone, in degrees */
  coneSpread?: number;
  className?: string;
  style?: CSSProperties;
}

export function BorderGlow({
  children,
  colors = ["#c084fc", "#f472b6", "#38bdf8"],
  borderRadius = 28,
  borderWidth = 1.5,
  edgeSensitivity = 30,
  glowRadius = 40,
  glowIntensity = 1,
  coneSpread = 25,
  className = "",
  style,
}: BorderGlowProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [angle, setAngle] = useState(0);
  const [opacity, setOpacity] = useState(0);
  const [glowPos, setGlowPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;

      // distance from the nearest edge of the rectangle
      const dx = Math.min(px, rect.width - px);
      const dy = Math.min(py, rect.height - py);
      const edgeDist = Math.min(dx, dy);

      // 0 when far inside, 1 when at/over the edge or just outside
      const proximity = Math.max(
        0,
        Math.min(1, 1 - edgeDist / edgeSensitivity)
      );

      // angle from card center to cursor (0deg = top, clockwise)
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rad = Math.atan2(py - cy, px - cx);
      const deg = (rad * 180) / Math.PI + 90;

      setAngle(deg);
      setOpacity(proximity * glowIntensity);
      setGlowPos({ x: px, y: py });
    };

    const onLeave = () => {
      setOpacity(0);
      setGlowPos(null);
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    // also listen on document so we can detect "just outside" the box
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [edgeSensitivity, glowIntensity]);

  const c1 = colors[0] ?? "#c084fc";
  const c2 = colors[Math.floor(colors.length / 2)] ?? "#f472b6";
  const c3 = colors[colors.length - 1] ?? "#38bdf8";
  const half = coneSpread / 2;

  // Conic gradient that produces a soft cone pointing toward the cursor.
  // Centered at the angle, fades to transparent on both sides.
  const cone = `conic-gradient(from ${angle - 180}deg at 50% 50%,
      transparent ${180 - half * 2}deg,
      ${c1} ${180 - half}deg,
      ${c2} 180deg,
      ${c3} ${180 + half}deg,
      transparent ${180 + half * 2}deg
    )`;

  return (
    <div
      ref={wrapperRef}
      className={className}
      style={{
        position: "relative",
        borderRadius,
        ...style,
      }}
    >
      {/* Border ring layer: conic gradient masked to a rounded-rect ring */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          borderRadius,
          padding: borderWidth,
          background: cone,
          opacity,
          transition: "opacity 200ms ease-out",
          pointerEvents: "none",
          // ring mask via mask-composite
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          maskComposite: "exclude",
          zIndex: 2,
        }}
      />

      {/* Outer soft halo extending slightly beyond the border */}
      {glowPos && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: -glowRadius / 2,
            borderRadius: borderRadius + glowRadius / 2,
            pointerEvents: "none",
            opacity: opacity * 0.55,
            transition: "opacity 200ms ease-out",
            background: `radial-gradient(circle ${glowRadius}px at ${
              glowPos.x + glowRadius / 2
            }px ${glowPos.y + glowRadius / 2}px,
              ${c2}88 0%,
              ${c1}44 35%,
              transparent 70%)`,
            filter: `blur(${glowRadius / 4}px)`,
            zIndex: 1,
          }}
        />
      )}

      {/* Content */}
      <div
        style={{
          position: "relative",
          borderRadius,
          overflow: "hidden",
          height: "100%",
          zIndex: 3,
        }}
      >
        {children}
      </div>
    </div>
  );
}

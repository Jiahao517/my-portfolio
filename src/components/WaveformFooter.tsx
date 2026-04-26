"use client";

import { useEffect, useRef, useState } from "react";

const WAVES = [
  { color: "#4FA3FF", amp: 36, freq: 1.6, phase: 0.0, opacity: 0.95 },
  { color: "#5DDDD3", amp: 30, freq: 1.9, phase: 0.6, opacity: 0.9 },
  { color: "#A78BFA", amp: 42, freq: 1.3, phase: 1.2, opacity: 0.85 },
  { color: "#7CB7FF", amp: 24, freq: 2.4, phase: 1.8, opacity: 0.8 },
  { color: "#FF8AC2", amp: 32, freq: 1.1, phase: 2.4, opacity: 0.75 },
  { color: "#80E6B7", amp: 22, freq: 2.7, phase: 3.0, opacity: 0.7 },
] as const;

const W = 1440;
const H = 220;
const SAMPLES = 180;

/** Envelope: 0 at edges, 1 at center — gives the atomic.black "spindle" shape. */
function envelope(u: number) {
  return Math.pow(Math.sin(u * Math.PI), 1.6);
}

function buildPath(t: number, w: (typeof WAVES)[number], speed: number) {
  const pts: string[] = [];
  for (let i = 0; i <= SAMPLES; i++) {
    const u = i / SAMPLES;
    const x = u * W;
    const k = u * Math.PI * 2 * w.freq;
    const env = envelope(u);
    const y = H / 2 + Math.sin(k + t * speed + w.phase) * w.amp * env;
    pts.push(`${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  return pts.join(" ");
}

export function WaveformFooter() {
  const [paths, setPaths] = useState<string[]>(() => WAVES.map((w) => buildPath(0, w, 1)));
  const [hover, setHover] = useState(false);
  const reqRef = useRef<number>(0);
  const tRef = useRef(0);

  useEffect(() => {
    let last = performance.now();
    const speedTarget = () => (hover ? 3.2 : 1.0);
    let speed = 1;
    const loop = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      speed += (speedTarget() - speed) * Math.min(1, dt * 4);
      tRef.current += dt;
      setPaths(WAVES.map((w) => buildPath(tRef.current, w, speed)));
      reqRef.current = requestAnimationFrame(loop);
    };
    reqRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(reqRef.current);
  }, [hover]);

  return (
    <div
      className="waveform-footer"
      aria-hidden
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="waveform-footer__svg"
      >
        <line
          x1={0}
          y1={H / 2}
          x2={W}
          y2={H / 2}
          stroke="rgba(0,0,0,0.08)"
          strokeWidth={1}
        />
        {paths.map((d, i) => (
          <path
            key={i}
            d={d}
            stroke={WAVES[i].color}
            strokeOpacity={WAVES[i].opacity}
            strokeWidth={1.6}
            fill="none"
            strokeLinecap="round"
          />
        ))}
      </svg>
    </div>
  );
}

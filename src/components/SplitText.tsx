"use client";

import React, { useEffect, useRef, useState, CSSProperties, ElementType } from "react";

interface SplitTextProps {
  text: string;
  tag?: ElementType;
  className?: string;
  delay?: number;       // ms between each char
  duration?: number;    // s per char animation
  threshold?: number;
  rootMargin?: string;
}

export function SplitText({
  text,
  tag: Tag = "p",
  className = "",
  delay = 40,
  duration = 1.1,
  threshold = 0.1,
  rootMargin = "-60px",
}: SplitTextProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, rootMargin]);

  const chars = Array.from(text);

  return (
    <Tag ref={ref as React.RefObject<HTMLHeadingElement>} className={className} aria-label={text} style={{ display: "block" }}>
      {chars.map((ch, i) => (
        <span
          key={i}
          aria-hidden
          style={
            {
              display: "inline-block",
              whiteSpace: ch === " " ? "pre" : undefined,
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(32px)",
              transition: visible
                ? `opacity ${duration}s cubic-bezier(0.16,1,0.3,1) ${i * delay}ms, transform ${duration}s cubic-bezier(0.16,1,0.3,1) ${i * delay}ms`
                : "none",
            } as CSSProperties
          }
        >
          {ch}
        </span>
      ))}
    </Tag>
  );
}

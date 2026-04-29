"use client";

import { useEffect, useRef, useState, ElementType } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
const SKIP_CHARS = new Set([" ", "—", "，", "。", "、", "·"]);

function scramble(ch: string) {
  if (SKIP_CHARS.has(ch)) return ch;
  return CHARS[Math.floor(Math.random() * CHARS.length)] ?? ch;
}

interface DecryptedTextProps {
  text: string;
  tag?: ElementType;
  className?: string;
  speed?: number;        // ms per iteration tick
  maxIterations?: number;
  sequential?: boolean;
  threshold?: number;
  rootMargin?: string;
  encryptedClassName?: string;
}

export function DecryptedText({
  text,
  tag: Tag = "p",
  className = "",
  speed = 60,
  maxIterations = 10,
  sequential = true,
  threshold = 0.1,
  rootMargin = "-40px",
  encryptedClassName = "",
}: DecryptedTextProps) {
  const ref = useRef<HTMLElement>(null);
  const [displayChars, setDisplayChars] = useState<{ char: string; revealed: boolean }[]>(
    () => Array.from(text).map((ch) => ({ char: ch, revealed: false }))
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let hasRun = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const runAnimation = () => {
      if (hasRun) return;
      hasRun = true;

      const chars = Array.from(text);
      let revealedCount = 0;
      let iteration = 0;

      const tick = () => {
        if (sequential) {
          setDisplayChars(
            chars.map((ch, i) => ({
              char: i < revealedCount ? ch : scramble(ch),
              revealed: i < revealedCount,
            }))
          );
          iteration++;
          if (iteration >= maxIterations) {
            iteration = 0;
            revealedCount++;
          }
          if (revealedCount <= chars.length) {
            timeoutId = setTimeout(tick, speed);
          } else {
            setDisplayChars(chars.map((ch) => ({ char: ch, revealed: true })));
          }
        } else {
          setDisplayChars(
            chars.map((ch) => ({
              char: iteration >= maxIterations ? ch : scramble(ch),
              revealed: iteration >= maxIterations,
            }))
          );
          iteration++;
          if (iteration <= maxIterations) {
            timeoutId = setTimeout(tick, speed);
          }
        }
      };

      tick();
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          runAnimation();
          io.disconnect();
        }
      },
      { threshold, rootMargin }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [text, sequential, maxIterations, speed, threshold, rootMargin]);

  return (
    <Tag ref={ref as React.RefObject<HTMLParagraphElement>} className={className} aria-label={text}>
      {displayChars.map((item, i) => (
        <span
          key={i}
          aria-hidden
          className={!item.revealed && item.char !== " " ? encryptedClassName : undefined}
          style={{ whiteSpace: item.char === " " ? "pre" : undefined }}
        >
          {item.char}
        </span>
      ))}
    </Tag>
  );
}

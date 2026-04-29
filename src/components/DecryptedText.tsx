"use client";

import { useEffect, useRef, useState, ElementType } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";

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
  const animRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasRun = useRef(false);

  const scramble = (ch: string) =>
    ch === " " || ch === "—" || ch === "，" || ch === "。" || ch === "、" || ch === "·"
      ? ch
      : CHARS[Math.floor(Math.random() * CHARS.length)] ?? ch;

  const runAnimation = () => {
    if (hasRun.current) return;
    hasRun.current = true;

    const chars = Array.from(text);
    let revealedCount = 0;
    let iteration = 0;

    const tick = () => {
      if (sequential) {
        // reveal characters one by one
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
          animRef.current = setTimeout(tick, speed);
        } else {
          setDisplayChars(chars.map((ch) => ({ char: ch, revealed: true })));
        }
      } else {
        // all scramble then reveal together
        setDisplayChars(
          chars.map((ch) => ({
            char: iteration >= maxIterations ? ch : scramble(ch),
            revealed: iteration >= maxIterations,
          }))
        );
        iteration++;
        if (iteration <= maxIterations) {
          animRef.current = setTimeout(tick, speed);
        }
      }
    };

    tick();
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
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
      if (animRef.current) clearTimeout(animRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

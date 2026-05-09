"use client";

import { type CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import { ImageTrail } from "@/components/ImageTrail";

const TRAIL_IMAGES = [
  "/images/dingtalk/1.png",
  "/images/dingtalk/2.png",
  "/images/dingtalk/3.png",
  "/images/dingtalk/4.png",
  "/images/wencai/06.png",
  "/images/wencai/07.png",
  "/images/wencai/08.png",
  "/images/wencai/09.png",
  "/images/chuangxin/1.专利.png",
  "/images/chuangxin/2.专利.png",
  "/images/guifan/28.规范.png",
  "/images/guifan/29.规范.png",
];

function ArtFooterArrowUp() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 16" fill="none" aria-hidden="true">
      <path
        d="M0.826172 7.61719L7.35547 1.32031L7.5293 1.15234L7.70215 1.32031L14.1738 7.56152L14.3604 7.74121L14.1738 7.92187L13.5195 8.55273L13.3457 8.71973L13.1729 8.55273L8.24609 3.80176L8.24609 15.75L6.81152 15.75L6.81152 3.80078L1.82715 8.60742L1.6543 8.77539L1.48047 8.60742L0.826172 7.97656L0.639648 7.79688L0.826172 7.61719Z"
        fill="currentColor"
      />
      <path
        d="M0.826172 7.61719L7.35547 1.32031L7.5293 1.15234L7.70215 1.32031L14.1738 7.56152L14.3604 7.74121L14.1738 7.92187L13.5195 8.55273L13.3457 8.71973L13.1729 8.55273L8.24609 3.80176L8.24609 15.75L6.81152 15.75L6.81152 3.80078L1.82715 8.60742L1.6543 8.77539L1.48047 8.60742L0.826172 7.97656L0.639648 7.79688L0.826172 7.61719Z"
        stroke="currentColor"
        strokeWidth="0.5"
      />
    </svg>
  );
}

function buildCenterOutOrder(total: number) {
  const center = (total - 1) / 2;
  const indices = Array.from({ length: total }, (_, i) => i);

  indices.sort((a, b) => {
    const distanceA = Math.abs(a - center);
    const distanceB = Math.abs(b - center);

    if (distanceA !== distanceB) return distanceA - distanceB;
    return a - b;
  });

  const rank = Array.from({ length: total }, () => 0);
  indices.forEach((index, i) => {
    rank[index] = i;
  });

  return rank;
}

function splitChars(text: string, startIndex: number, order: number[]) {
  return Array.from(text).map((ch, i) => (
    <span
      key={`${ch}-${i}`}
      className="art-footer__char"
      style={{ "--char-order": order[startIndex + i] } as CSSProperties}
      aria-hidden="true"
    >
      <span className="art-footer__char-inner">{ch === " " ? "\u00A0" : ch}</span>
    </span>
  ));
}

function formatHangzhouTime() {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Shanghai",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return formatter.format(new Date());
}

function randomGlyphFor(char: string) {
  const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  if (char === " ") return " ";
  if (char === "/") return "/";
  if (char === ":") return ":";
  return glyphs[Math.floor(Math.random() * glyphs.length)] ?? "#";
}

function ScrambleRevealText({
  text,
  active,
  runId,
  className,
}: {
  text: string;
  active: boolean;
  runId: number;
  className?: string;
}) {
  const textRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const node = textRef.current;
    if (!node) return;

    if (!active) {
      node.textContent = text;
      return;
    }

    const targetChars = Array.from(text);
    const start = performance.now();
    const duration = 480;

    let frameId = 0;

    const update = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const revealCount = Math.floor(progress * targetChars.length);

      const mixed = targetChars
        .map((ch, i) => (i < revealCount ? ch : randomGlyphFor(ch)))
        .join("");

      node.textContent = mixed;

      if (progress < 1) {
        frameId = window.requestAnimationFrame(update);
      } else {
        node.textContent = text;
      }
    };

    frameId = window.requestAnimationFrame(update);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [active, runId, text]);

  return (
    <span ref={textRef} className={className}>
      {text}
    </span>
  );
}

const FOOTER_TITLE = "AI时代的设计工作流";

export function ArtFooter() {
  const [time, setTime] = useState(() => formatHangzhouTime());
  const [isVisualActive, setIsVisualActive] = useState(false);
  const [isMainVisible, setIsMainVisible] = useState(false);
  const [utilityStep, setUtilityStep] = useState(0);
  const [revealRunId, setRevealRunId] = useState(0);
  const visualRef = useRef<HTMLElement | null>(null);
  const sequenceTimersRef = useRef<number[]>([]);

  useEffect(() => {
    const update = () => setTime(formatHangzhouTime());
    update();

    const now = new Date();
    const delay = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
    let intervalId: number | undefined;

    const timeoutId = window.setTimeout(() => {
      update();
      intervalId = window.setInterval(update, 60_000);
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
      if (intervalId) window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const node = visualRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisualActive(entry.isIntersecting);
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -2% 0px",
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let resetTimer: number | undefined;
    sequenceTimersRef.current.forEach((id) => window.clearTimeout(id));
    sequenceTimersRef.current = [];

    if (!isVisualActive) {
      resetTimer = window.setTimeout(() => {
        setIsMainVisible(false);
        setUtilityStep(0);
      }, 0);
      return;
    }

    resetTimer = window.setTimeout(() => {
      setRevealRunId((value) => value + 1);
      setIsMainVisible(false);
      setUtilityStep(0);
    }, 0);

    const queue = (fn: () => void, delay: number) => {
      const id = window.setTimeout(fn, delay);
      sequenceTimersRef.current.push(id);
    };

    // Match reference feel: hold first, then main text, then 3 bottom lines in order.
    queue(() => setIsMainVisible(true), 720);
    queue(() => setUtilityStep(1), 1760);
    queue(() => setUtilityStep(2), 2060);
    queue(() => setUtilityStep(3), 2360);

    return () => {
      if (resetTimer) window.clearTimeout(resetTimer);
      sequenceTimersRef.current.forEach((id) => window.clearTimeout(id));
      sequenceTimersRef.current = [];
    };
  }, [isVisualActive]);

  const mobileSocialText = useMemo(
    () => ["AI 产品设计师", "为真实交付而设计"],
    [],
  );

  const nameOrder = useMemo(() => buildCenterOutOrder(Array.from(FOOTER_TITLE).length), []);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="art-footer">
      <section
        ref={visualRef}
        data-analytics-section="art-footer"
        className={`art-footer__visual-shell${isVisualActive ? " art-footer__visual-shell--active" : ""}`}
        style={{ position: "relative" }}
      >
        <ImageTrail items={TRAIL_IMAGES} containerRef={visualRef} threshold={80} />
        <div className="art-footer__visual-layer">
          <div className="art-footer__media-layer">
            <div className="art-footer__video-blur" aria-hidden />
            <video
              className="art-footer__video"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              poster="/images/art-footer-poster.jpg"
            >
              <source src="/videos/new_bg1.mp4" type="video/mp4" />
            </video>
          </div>

          <div className={`art-footer__text-layer${isMainVisible ? " art-footer__text-layer--main" : ""}`}>
            <div className="art-footer__mobile-utility">
              <button type="button" className="art-footer__top-button art-footer__top-button--mobile" onClick={scrollTop}>
                <span className="art-footer__top-button-icon">
                  <ArtFooterArrowUp />
                </span>
                <span className="art-footer__top-button-text">回到顶部</span>
              </button>
              <div className="art-footer__mobile-social">
                {mobileSocialText.map((line) => (
                  <span key={line}>{line}</span>
                ))}
                <a href="/privacy">隐私说明</a>
              </div>
            </div>

            <div className="art-footer__big-name" aria-label={FOOTER_TITLE}>
              <span className="art-footer__big-name-main">{splitChars(FOOTER_TITLE, 0, nameOrder)}</span>
            </div>

            <div className="art-footer__utility-row">
              <div
                className={`art-footer__time art-footer__reveal-item${utilityStep >= 1 ? " art-footer__reveal-item--visible" : ""}`}
              >
                <ScrambleRevealText text={`杭州 ${time}`} active={utilityStep >= 1} runId={revealRunId} />
              </div>

              <div
                className={`art-footer__role art-footer__reveal-item${utilityStep >= 2 ? " art-footer__reveal-item--visible" : ""}`}
              >
                <ScrambleRevealText
                  text="AI 产品设计师 / 为真实交付而设计"
                  active={utilityStep >= 2}
                  runId={revealRunId}
                />
                <a className="art-footer__privacy-link" href="/privacy">隐私说明</a>
              </div>

              <button
                type="button"
                className={`art-footer__top-button art-footer__top-button--desktop art-footer__reveal-item${utilityStep >= 3 ? " art-footer__reveal-item--visible" : ""}`}
                onClick={scrollTop}
              >
                <span className="art-footer__top-button-icon">
                  <ArtFooterArrowUp />
                </span>
                <ScrambleRevealText
                  text="回到顶部"
                  className="art-footer__top-button-text"
                  active={utilityStep >= 3}
                  runId={revealRunId}
                />
              </button>
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
}

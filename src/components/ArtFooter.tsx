"use client";

import { type CSSProperties, useEffect, useMemo, useRef, useState } from "react";

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

function splitChars(text: string, startIndex: number) {
  return Array.from(text).map((ch, i) => (
    <span
      key={`${ch}-${i}`}
      className="art-footer__char"
      style={{ "--char-i": startIndex + i } as CSSProperties}
      aria-hidden="true"
    >
      <span className="art-footer__char-inner">
        {ch === " " ? " " : ch}
      </span>
    </span>
  ));
}

function formatYerevanTime() {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Yerevan",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return formatter.format(new Date());
}

export function ArtFooter() {
  const [time, setTime] = useState("");
  const [isVisualActive, setIsVisualActive] = useState(false);
  const visualRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const update = () => setTime(formatYerevanTime());
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

  const mobileSocialText = useMemo(
    () => ["Creative Digital Designer.", "Working Worldwide."],
    [],
  );

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="art-footer">
      <section
        ref={visualRef}
        className={`art-footer__visual-shell${isVisualActive ? " art-footer__visual-shell--active" : ""}`}
      >
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
              <source src="/videos/art-footer-bg.mp4" type="video/mp4" />
              <source src="/videos/art-footer-bg.webm" type="video/webm" />
            </video>
          </div>

          <div className={`art-footer__text-layer${isVisualActive ? " art-footer__text-layer--active" : ""}`}>
            <div className="art-footer__mobile-utility">
              <button type="button" className="art-footer__top-button art-footer__top-button--mobile" onClick={scrollTop}>
                <span className="art-footer__top-button-icon">
                  <ArtFooterArrowUp />
                </span>
                <span className="art-footer__top-button-text">Back to top</span>
              </button>
              <div className="art-footer__mobile-social">
                {mobileSocialText.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </div>
            </div>

            <div className="art-footer__big-name" aria-label="Artiom Yakushev">
              <span className="art-footer__big-name-sans">
                {splitChars("Artiom", 0)}
              </span>
              <span className="art-footer__big-name-serif">
                {splitChars("Yakushev", 6)}
              </span>
            </div>

            <div className="art-footer__utility-row">
              <div className="art-footer__time art-footer__reveal-item art-footer__reveal-item--1">
                <span className="art-footer__time-city">Yerevan</span>
                <span className="art-footer__time-separator"> </span>
                <span className="art-footer__time-value">{time}</span>
              </div>

              <div className="art-footer__role art-footer__reveal-item art-footer__reveal-item--2">
                <span>Creative Digital Designer</span>
                <span className="art-footer__role-slash">/</span>
                <span>Working Worldwide</span>
              </div>

              <button
                type="button"
                className="art-footer__top-button art-footer__top-button--desktop art-footer__reveal-item art-footer__reveal-item--3"
                onClick={scrollTop}
              >
                <span className="art-footer__top-button-icon">
                  <ArtFooterArrowUp />
                </span>
                <span className="art-footer__top-button-text">Back to top</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
}

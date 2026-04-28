"use client";

import { useEffect, useState } from "react";
import styles from "./performula.module.css";

type Slide = { label: string; src?: string; color: string };

const SLIDES: Slide[] = [
  { label: "PERFORMULA", src: "https://a.storyblok.com/f/268243/2160x2160/3109bdcb48/studiogruhl_performula_00-tile.jpg", color: "#3a4a8c" },
  { label: "MOSS",       src: "https://a.storyblok.com/f/268243/3840x2160/0bce16422d/ts_projects.jpg",                  color: "#1f1f1f" },
  { label: "HIGHSNOBIETY",                                                                                              color: "#7a3a2e" },
  { label: "COLORSXSTUDIOS",                                                                                            color: "#c4b59a" },
  { label: "PROJECT 05",                                                                                                color: "#4a3a5c" },
  { label: "PROJECT 06",                                                                                                color: "#2a4a3a" },
  { label: "PROJECT 07",                                                                                                color: "#5c2a3a" },
];

export function ProgressNav() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    let raf = 0;
    function update() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? window.scrollY / max : 0;
      // Map scroll progress mostly to first slide; switch near end
      const idx = ratio < 0.92 ? 0 : Math.min(SLIDES.length - 1, Math.floor((ratio - 0.92) / (0.08 / (SLIDES.length - 1))) + 1);
      setActive(idx);
    }
    function onScroll() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    }
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className={styles.progressBar} aria-label="Project navigation">
      <div className={styles.slideTrack}>
        {SLIDES.map((s, i) => (
          <div
            key={s.label}
            className={`${styles.slide} ${i === active ? styles.active : ""}`}
            onClick={() => setActive(i)}
            role="button"
            tabIndex={0}
          >
            {s.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={s.src} alt={s.label} />
            ) : (
              <div className={styles.swatch} style={{ background: s.color }} />
            )}
            <span className={styles.slideLabel}>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

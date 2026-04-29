"use client";

import { useEffect, useRef, useState } from "react";
import { Magnet } from "@/components/Magnet";
import { SplitText } from "@/components/SplitText";
import { DecryptedText } from "@/components/DecryptedText";
import { ContactPopover } from "@/components/ContactPopover";

/**
 * HappyRobot-style full-screen background video hero.
 * Desktop: autoplay video. Mobile: poster only, tap-to-play (saves data + complies with iOS autoplay).
 * Keeps the original murynmukha hero copy as overlay text.
 */
export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 720px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const ensurePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().then(() => setPlaying(true)).catch(() => undefined);
  };

  useEffect(() => {
    if (!isMobile) ensurePlay();
  }, [isMobile]);

  return (
    <section className="hero-video">
      <video
        ref={videoRef}
        className="hero-video__media"
        poster="/images/hero-poster.jpg"
        muted
        loop
        playsInline
        preload={isMobile ? "metadata" : "auto"}
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
        {/* Fallback to a case study video so the page shows real motion before the user supplies hero.mp4 */}
        <source src="/images/case-twain.mp4" type="video/mp4" />
      </video>
      <div className="hero-video__scrim" aria-hidden />

      {isMobile && !playing ? (
        <button type="button" className="hero-video__play" onClick={ensurePlay} aria-label="播放">
          <svg width="28" height="32" viewBox="0 0 28 32" fill="currentColor" aria-hidden>
            <path d="M2 1.5v29l24-14.5L2 1.5z" />
          </svg>
        </button>
      ) : null}

      <div className="hero-video__inner">
        <SplitText
          text="我是 Gregory，把那些晦涩的技术，做成一眼就看懂的产品。"
          tag="h1"
          className="hero-video__title"
          delay={35}
          duration={1.1}
          threshold={0.05}
          rootMargin="0px"
        />
        <DecryptedText
          text="很早就加入初创团队 —— 通常在产品还没诞生之前。我把它定义出来、设计出来，再和工程师一起交付。15 年经验，其中 9 年在做 AI 产品。"
          tag="p"
          className="hero-video__subtitle"
          speed={40}
          maxIterations={8}
          sequential={true}
          threshold={0.05}
          rootMargin="0px"
        />
        <ContactPopover>
          <Magnet padding={60} magnetStrength={2}>
            <span className="case-study__btn hero-video__cta hero-video__cta--static">
              <span>与我联系</span>
            </span>
          </Magnet>
        </ContactPopover>
        <div className="hero-video__logos" aria-label="支持过的投资机构">
          <span className="hero-video__logos-label">由一线机构支持的初创团队</span>
          <span className="hero-video__logos-item">Sequoia</span>
          <span className="hero-video__logos-item">Y Combinator</span>
          <span className="hero-video__logos-item">Voiceflow</span>
          <span className="hero-video__logos-item">Chattermill</span>
          <span className="hero-video__logos-item">Twain</span>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Magnet } from "@/components/Magnet";
import { SplitText } from "@/components/SplitText";
import { DecryptedText } from "@/components/DecryptedText";
import { ContactPopover } from "@/components/ContactPopover";
import { ImageTrail } from "@/components/ImageTrail";

function ScrollMouse() {
  const dotRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.4 });
    tl.set(dot, { opacity: 0, y: 0 })
      .to(dot, { opacity: 1, duration: 0.2, ease: "none" })
      .to(dot, { y: 10, opacity: 0, duration: 0.9, ease: "power2.in" });
    return () => { tl.kill(); };
  }, []);

  return (
    <div className="hero-video__scroll-hint" aria-hidden>
      <svg width="26" height="40" viewBox="0 0 26 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="24" height="38" rx="12" stroke="currentColor" strokeWidth="1.5"/>
        <circle ref={dotRef} cx="13" cy="10" r="3" fill="currentColor"/>
      </svg>
    </div>
  );
}

const HERO_TRAIL_IMAGES = [
  "/images/case-dingtalk.png",
  "/images/case-wencai.png",
  "/images/case-chatspec.png",
  "/images/case-innovation.png",
  "/case-images/dingtalk/01.png",
  "/case-images/dingtalk/02.png",
  "/case-images/wencai/01.png",
  "/case-images/wencai/02.png",
  "/case-images/chat-spec/02.png",
  "/case-images/innovation/01.png",
  "/case-images/innovation/02.png",
];

export function HeroVideo({ trailImages = HERO_TRAIL_IMAGES }: { trailImages?: string[] }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
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
    <section ref={sectionRef} className="hero-video" data-analytics-section="hero" aria-label="Hero">
      <ImageTrail items={trailImages} containerRef={sectionRef} threshold={80} />
      <video
        ref={videoRef}
        className="hero-video__media"
        poster="/images/hero-poster.jpg"
        muted
        loop
        playsInline
        preload="metadata"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
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
          text="我是钟家豪，把复杂的 AI 能力，设计成用户看得懂的产品"
          tag="h1"
          className="hero-video__title"
          delay={35}
          duration={1.1}
          threshold={0.05}
          rootMargin="0px"
        />
        <DecryptedText
          text="主要做 AI 产品的设计，参与结构判断、规则定义与实现推进，关注完整交付。从智能投顾到 ChatUI 规范，到 AI 改变设计工作流，我持续关注 AI 产品里的信任、效率、表达与落地。"
          tag="p"
          className="hero-video__subtitle"
          speed={8}
          maxIterations={2}
          sequential={true}
          threshold={0.05}
          rootMargin="0px"
        />
        <div className="hero-video__logos" aria-label="专业标签">
          <span className="hero-video__logos-item">AI 产品</span>
          <span className="hero-video__logos-sep">｜</span>
          <span className="hero-video__logos-item">对话体验</span>
          <span className="hero-video__logos-sep">｜</span>
          <span className="hero-video__logos-item">设计系统</span>
          <span className="hero-video__logos-sep">｜</span>
          <span className="hero-video__logos-item">设计代码交付</span>
          <span className="hero-video__logos-sep">｜</span>
          <span className="hero-video__logos-item">设计奖&amp;专利</span>
        </div>
        <div className="hero-video__cta-trail-safe" data-no-trail>
          <ContactPopover>
            <Magnet padding={60} magnetStrength={6}>
              <span className="case-study__btn hero-video__cta hero-video__cta--static">
                <span>联系我</span>
              </span>
            </Magnet>
          </ContactPopover>
        </div>
      </div>
      <ScrollMouse />
    </section>
  );
}

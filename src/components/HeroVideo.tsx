"use client";

import { useEffect, useRef, useState } from "react";
import { Magnet } from "@/components/Magnet";
import { SplitText } from "@/components/SplitText";
import { DecryptedText } from "@/components/DecryptedText";
import { ContactPopover } from "@/components/ContactPopover";
import { ImageTrail } from "@/components/ImageTrail";

const HERO_TRAIL_IMAGES = [
  "/images/case-dingtalk.png",
  "/images/case-wencai.png",
  "/images/case-chatspec.png",
  "/images/case-innovation.png",
  "/images/case-voiceflow.png",
  "/images/dingtalk/1.png",
  "/images/dingtalk/2.png",
  "/images/wencai/06.png",
  "/images/wencai/07.png",
  "/images/guifan/28.规范.png",
  "/images/chuangxin/1.专利.png",
  "/images/chuangxin/2.专利.png",
];

export function HeroVideo() {
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
    <section ref={sectionRef} className="hero-video">
      <ImageTrail items={HERO_TRAIL_IMAGES} containerRef={sectionRef} threshold={80} />
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
        <ContactPopover>
          <Magnet padding={60} magnetStrength={6}>
            <span className="case-study__btn hero-video__cta hero-video__cta--static">
              <span>联系我</span>
            </span>
          </Magnet>
        </ContactPopover>
        <div className="hero-video__logos" aria-label="专业标签">
          <span className="hero-video__logos-item">AI 产品</span>
          <span className="hero-video__logos-sep">｜</span>
          <span className="hero-video__logos-item">对话体验</span>
          <span className="hero-video__logos-sep">｜</span>
          <span className="hero-video__logos-item">设计系统</span>
          <span className="hero-video__logos-sep">｜</span>
          <span className="hero-video__logos-item">落地交付</span>
          <span className="hero-video__logos-sep">｜</span>
          <span className="hero-video__logos-item">设计奖</span>
          <span className="hero-video__logos-sep">｜</span>
          <span className="hero-video__logos-item">专利</span>
        </div>
      </div>
    </section>
  );
}

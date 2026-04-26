"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/icons";
import { testimonials } from "@/data/testimonials";

const PILL_LABELS = [
  "产品策略",
  "用户研究",
  "UX / UI 设计",
  "设计系统",
  "对话式 UI",
  "数据可视化",
  "前端实现",
  "原型 / Demo",
];

export function SocialProof() {
  const [pillIdx, setPillIdx] = useState(0);
  const [tIdx, setTIdx] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  // Rotating service pill stack (cosmetic-light replacement of the original gsap-driven version)
  useEffect(() => {
    const id = window.setInterval(() => {
      setPillIdx((i) => (i + 1) % PILL_LABELS.length);
    }, 1800);
    return () => window.clearInterval(id);
  }, []);

  const t = testimonials[tIdx];

  const goto = (next: number, dir: 1 | -1) => {
    if (next < 0 || next >= testimonials.length || transitioning) return;
    setTransitioning(true);
    window.setTimeout(() => {
      setTIdx(next);
      setTransitioning(false);
    }, 220);
    void dir;
  };

  return (
    <div className="social-proof reveal-load reveal-load--active">
      <div className="social-proof__left">
        {/* Services Card */}
        <div className="sp-card sp-card--services">
          <div className="sp-services__wheel" aria-hidden>
            <div className="sp-wheel__track" />
          </div>
          <div className="sp-services__arrow" aria-hidden>
            <svg width="20" height="15" viewBox="0 0 20 15" fill="none">
              <path
                d="M1 7.5H19M12 1l7 6.5-7 6.5"
                stroke="#2B2525"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="sp-services__pill-stack" id="pillStack">
            {[-2, -1, 0, 1, 2].map((offset) => {
              const idx = (pillIdx + offset + PILL_LABELS.length) % PILL_LABELS.length;
              const isActive = offset === 0;
              return (
                <div
                  key={offset}
                  className={`sp-stack__card${isActive ? " sp-stack__card--active" : ""}`}
                >
                  <span>{PILL_LABELS[idx]}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Testimonial */}
      <div className="sp-card sp-card--testimonial" id="testimonialCard">
        <div className="sp-testimonial__header">
          <div className="sp-testimonial__author">
            <div className="sp-testimonial__avatar">
              <Image
                key={t.photo}
                src={t.photo}
                alt={t.name}
                width={56}
                height={56}
                style={{ opacity: transitioning ? 0.4 : 1, transition: "opacity .22s ease" }}
              />
            </div>
            <div className="sp-testimonial__details">
              <div className="sp-testimonial__name">{t.name}</div>
              <div className="sp-testimonial__role">{t.role}</div>
            </div>
          </div>
          <div className="sp-testimonial__nav">
            <button
              type="button"
              className="sp-testimonial__btn sp-testimonial__btn--prev"
              disabled={tIdx === 0}
              aria-label="上一条推荐"
              onClick={() => goto(tIdx - 1, -1)}
            >
              <ArrowLeftIcon />
            </button>
            <button
              type="button"
              className="sp-testimonial__btn sp-testimonial__btn--next"
              disabled={tIdx === testimonials.length - 1}
              aria-label="下一条推荐"
              onClick={() => goto(tIdx + 1, 1)}
            >
              <ArrowRightIcon fill="#002E71" />
            </button>
          </div>
        </div>
        <blockquote
          className="sp-testimonial__quote"
          style={{ opacity: transitioning ? 0 : 1, transform: transitioning ? "translateX(-6px)" : "translateX(0)", transition: "opacity .22s ease, transform .22s ease" }}
        >
          {t.quote.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </blockquote>
        <div className="sp-testimonial__dots">
          {testimonials.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`切换到第 ${i + 1} 条推荐`}
              className={i === tIdx ? "active" : undefined}
              onClick={() => goto(i, i > tIdx ? 1 : -1)}
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                margin: "0 3px",
                background: i === tIdx ? "#002E71" : "#C5D6E6",
                border: 0,
                padding: 0,
                cursor: "pointer",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

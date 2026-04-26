"use client";

import { useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/icons";
import { testimonials } from "@/data/testimonials";

const SERVICES = [
  { label: "前端实现", tone: "strong" },
  { label: "原型 / Demo", tone: "strong" },
  { label: "产品策略", tone: "base" },
  { label: "用户研究", tone: "strong" },
  { label: "UX / UI 设计", tone: "strong" },
];

export function SocialProof() {
  const [tIdx, setTIdx] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

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
        <div className="sp-card sp-card--services">
          <div className="sp-services__panel" aria-hidden />
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
          <div className="sp-services__list">
            {SERVICES.map((service) => (
              <div
                key={service.label}
                className={`sp-services__item sp-services__item--${service.tone}`}
              >
                <span>{service.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="sp-card sp-card--testimonial" id="testimonialCard">
        <div className="sp-testimonial__header">
          <div className="sp-testimonial__author">
            <div className="sp-testimonial__avatar">
              <img
                key={t.photo}
                alt=""
                src={t.photo}
                className="sp-testimonial__avatar-fill"
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
              className={`sp-testimonial__dot${i === tIdx ? " sp-testimonial__dot--active" : ""}`}
              onClick={() => goto(i, i > tIdx ? 1 : -1)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

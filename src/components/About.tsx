"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useMouseTilt } from "@/lib/useMouseTilt";
import { ContactAI } from "@/components/ContactAI";

const CONTACTS: {
  key: string;
  label: string;
  value: string;
  href?: string;
}[] = [
  {
    key: "email",
    label: "邮箱",
    value: "zjh532169990@163.com",
    href: "mailto:zjh532169990@163.com",
  },
  {
    key: "phone",
    label: "手机号",
    value: "17681828517",
    href: "tel:17681828517",
  },
  { key: "wechat", label: "微信", value: "Jiahao0517" },
];

export function About() {
  useMouseTilt("#aboutHeroPhoto", {
    glareSelector: ".about__hero-glare",
    maxTiltX: 2.5,
    maxTiltY: 3.25,
    scale: 1.01,
    perspective: 1000,
  });

  useMouseTilt(".contact-bento__card", {
    maxTiltX: 3,
    maxTiltY: 4,
    scale: 1.015,
    perspective: 1000,
  });

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const onCopy = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 1500);
    } catch {
      /* ignore */
    }
  };

  // Cross-card glow: track mouse on grid, update --mx/--my/--glow-intensity on every card
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const PROXIMITY = 80;   // px from edge — full glow
    const FADE_DIST = 240;  // px from edge — glow fades to 0

    const onMove = (e: MouseEvent) => {
      const cards = grid.querySelectorAll<HTMLElement>(".contact-bento__card");
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const localX = e.clientX - rect.left;
        const localY = e.clientY - rect.top;

        // Distance from cursor to the nearest point on the card's rectangle
        const dx = Math.max(0, Math.max(-localX, localX - rect.width));
        const dy = Math.max(0, Math.max(-localY, localY - rect.height));
        const dist = Math.hypot(dx, dy);

        const intensity =
          dist <= PROXIMITY
            ? 1
            : dist >= FADE_DIST
            ? 0
            : (FADE_DIST - dist) / (FADE_DIST - PROXIMITY);

        card.style.setProperty("--mx", `${localX}px`);
        card.style.setProperty("--my", `${localY}px`);
        card.style.setProperty("--glow-intensity", intensity.toFixed(3));
      });
    };

    const onLeave = () => {
      grid.querySelectorAll<HTMLElement>(".contact-bento__card").forEach((card) => {
        card.style.setProperty("--glow-intensity", "0");
      });
    };

    grid.addEventListener("mousemove", onMove);
    grid.addEventListener("mouseleave", onLeave);
    return () => {
      grid.removeEventListener("mousemove", onMove);
      grid.removeEventListener("mouseleave", onLeave);
    };
  }, []);


  return (
    <section id="about" className="section about-section">
      <div className="centered about__section-shell">
        <div className="about__header reveal-scroll">
          <h2 className="about__heading shiny-hover">关于我</h2>
        </div>

        <div className="about__main">
          <div className="about__body">
            <div className="about__content">
              <p>
                我是一名关注 AI 产品与复杂业务场景的体验设计师，具备 AI+金融、AI Agent 与企业协同产品设计经验。
              </p>
              <p>
                过去几年，我持续参与大模型能力在实际业务中的产品化落地，重点关注 AI 产品中的用户信任、任务效率、交互范式与结果交付。在同花顺阶段，我主要负责 AI+金融方向的产品设计，推动智能投顾场景下的交互范式升级；在钉钉阶段，我参与 AIX 与悟空等 AI 项目，并开始将 AI Coding 纳入设计工作流，推进调研、规则沉淀、设计还原与真实交付。
              </p>
              <p>
                我习惯从模糊问题中拆解关键矛盾，并推动问题从发现、评审到上线落地。目前已累计提出 300 多个产品与体验问题，其中 57% 已完成优化落地。同时，我也持续关注创新设计与方法沉淀，曾获得多项设计奖项，并申请一项产品相关专利。
              </p>
            </div>
          </div>

          <div className="about__media-column">
            <div className="about__hero-photo reveal-scroll" id="aboutHeroPhoto">
              <div className="about__hero-glare" />
              <Image
                src="/images/about-hero.png"
                alt="关于我"
                width={600}
                height={800}
                className="about__hero-img"
              />
            </div>

            <div className="about__photos" id="aboutPhotos">
              <div className="about__photo">
                <div className="about__image-placeholder about__image-placeholder--photo" aria-hidden />
              </div>
              <div className="about__photo">
                <div className="about__image-placeholder about__image-placeholder--photo" aria-hidden />
              </div>
              <div className="about__photo">
                <div className="about__image-placeholder about__image-placeholder--photo" aria-hidden />
              </div>
            </div>
          </div>
        </div>

        <ContactAI />

        <div className="about__footer reveal-scroll">
          <div className="about__cta-card contact-bento">
            <div className="about__cta-title shiny-hover shiny-hover--blue">
              联系我
            </div>
            <div className="contact-bento__grid" ref={gridRef}>
              {CONTACTS.filter((c) => c.key !== "wechat").map((c) => (
                <div
                  key={c.key}
                  className={`contact-bento__card contact-bento__card--${c.key}`}
                >
                  <span className="contact-bento__label">{c.label}</span>
                  <div className="contact-bento__value-row">
                    {c.href ? (
                      <a
                        href={c.href}
                        className="contact-bento__value contact-bento__value--link"
                      >
                        {c.value}
                      </a>
                    ) : (
                      <span className="contact-bento__value">{c.value}</span>
                    )}
                    <button
                      type="button"
                      className="about__icon-btn contact-bento__copy"
                      onClick={() => onCopy(c.key, c.value)}
                      aria-label={`复制${c.label}`}
                    >
                      <Image
                        src={copiedKey === c.key ? "/images/check.svg" : "/images/icon-copy.svg"}
                        alt=""
                        width={20}
                        height={20}
                      />
                    </button>
                  </div>
                </div>
              ))}

              <div
                className="contact-bento__card contact-bento__card--wechat"
              >
                <div className="contact-bento__wechat-head">
                  <span className="contact-bento__label">微信</span>
                </div>
                <div className="contact-bento__qr">
                  <Image
                    src="/images/wechat-qr.png"
                    alt="微信二维码"
                    width={220}
                    height={220}
                    className="contact-bento__qr-img"
                  />
                </div>
                <div className="contact-bento__value-row contact-bento__value-row--wechat">
                  <span className="contact-bento__value">Jiahao0517</span>
                  <button
                    type="button"
                    className="about__icon-btn contact-bento__copy"
                    onClick={() => onCopy("wechat", "Jiahao0517")}
                    aria-label="复制微信"
                  >
                    <Image
                      src={copiedKey === "wechat" ? "/images/check.svg" : "/images/icon-copy.svg"}
                      alt=""
                      width={20}
                      height={20}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

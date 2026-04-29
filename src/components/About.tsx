"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useMouseTilt } from "@/lib/useMouseTilt";

const CONTACTS: {
  key: string;
  label: string;
  value: string;
  hint: string;
  href?: string;
}[] = [
  {
    key: "email",
    label: "邮箱",
    value: "zjh532169990@163.com",
    hint: "Email",
    href: "mailto:zjh532169990@163.com",
  },
  {
    key: "phone",
    label: "手机号",
    value: "17681828517",
    hint: "Phone",
    href: "tel:17681828517",
  },
  { key: "wechat", label: "微信", value: "Jiahao0517", hint: "WeChat" },
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
      setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 1800);
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
                我学的是软件工程与业务分析。最早几年都在写规格说明、流程图，坐在业务方与工程师之间。业务与系统分析师、UX 设计师与研究员，每个角色都是软件如何被造出来的不同切面。
              </p>
              <p>
                这条路把我推向了产品设计。我做过完整的链条：系统架构、产品策略、融资 Deck，到最后界面长什么样、为什么这样工作。
              </p>
              <p>
                你只需要一个人来主理设计，从研究到上线。没有交接，没有翻译损耗。上线的就是设计的样子。难的部分我也会陪着走过：转型、融资、那次差点上不了的发版。
              </p>
              <p>
                工作之外，我喜欢 Streamline Moderne 与构成主义建筑。这两种流派在结构与大胆之间的平衡，正是我做设计时的思考方式。
              </p>
              <p>
                我选早期阶段，因为那是一个设计师能塑造整个产品的地方。小团队、完整 ownership，从首个原型到那份完成融资的 Deck。
              </p>
            </div>
          </div>

          <div className="about__media-column">
            <div className="about__hero-photo reveal-scroll" id="aboutHeroPhoto">
              <div className="about__hero-glare" />
              <div className="about__image-placeholder about__image-placeholder--hero" aria-hidden />
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
                  <span className="contact-bento__hint">{c.hint}</span>
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
                      <Image src="/images/icon-copy.svg" alt="" width={20} height={20} />
                    </button>
                  </div>
                  {copiedKey === c.key ? (
                    <span className="contact-bento__copied">已复制</span>
                  ) : null}
                </div>
              ))}

              <div
                className="contact-bento__card contact-bento__card--wechat"
              >
                <div className="contact-bento__wechat-head">
                  <span className="contact-bento__hint">WeChat</span>
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
                    <Image src="/images/icon-copy.svg" alt="" width={20} height={20} />
                  </button>
                </div>
                {copiedKey === "wechat" ? (
                  <span className="contact-bento__copied">已复制</span>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

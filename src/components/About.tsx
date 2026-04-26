"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowRightIcon } from "@/components/icons";

export function About() {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText("gregory.murynmukha@gmail.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

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
          <div className="about__cta-card">
            <div className="about__cta-title shiny-hover shiny-hover--blue">
              告诉我你正在做什么。<br className="about__cta-br" />
              看看是不是合适。
            </div>
            <div className="about__cta-controls">
              <div className="about__email-pill">
                <span className="about__email-text">gregory.murynmukha@gmail.com</span>
                <button className="about__icon-btn" onClick={onCopy} aria-label="复制邮箱">
                  <Image src="/images/icon-copy.svg" alt="" width={24} height={24} />
                </button>
                {copied ? <span className="about__email-copied">已复制</span> : null}
              </div>
              <a
                href="https://calendar.app.google/e1nq9HDsCKAYrq6S7"
                target="_blank"
                rel="noopener"
                className="case-study__btn about__book-btn"
              >
                <span>预约一次聊聊</span>
                <ArrowRightIcon />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

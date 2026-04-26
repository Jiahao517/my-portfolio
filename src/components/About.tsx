"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowRightIcon } from "@/components/icons";

const AI_PROMPT =
  "我正在评估 Gregory Muryn-Mukha (https://www.murynmukha.com)，看他是否适合我们公司创始产品设计师的岗位。请阅读他的作品集网站，告诉我：他的设计能力范围、最适合哪个阶段的公司，以及如果我聘请他实际能拿到什么成果。请给出具体细节，引用他的案例与经历。";

const AI_LINKS = [
  { href: `https://chatgpt.com/?q=${encodeURIComponent(AI_PROMPT)}`, icon: "/images/ai-icon-1.svg", label: "ChatGPT" },
  { href: `https://claude.ai/new?q=${encodeURIComponent(AI_PROMPT)}`, icon: "/images/ai-icon-2.svg", label: "Claude" },
  { href: `https://www.perplexity.ai/search?q=${encodeURIComponent(AI_PROMPT)}`, icon: "/images/ai-icon-3.svg", label: "Perplexity" },
  { href: `https://www.google.com/search?udm=50&aep=11&q=${encodeURIComponent(AI_PROMPT)}`, icon: "/images/ai-icon-4.svg", label: "Gemini" },
  { href: `https://x.com/i/grok?text=${encodeURIComponent(AI_PROMPT)}`, icon: "/images/ai-icon-5.svg", label: "Grok" },
] as const;

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
      <div className="centered">
        <h2 className="about__heading shiny-hover reveal-scroll">关于我</h2>

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

          <div className="about__hero-photo" id="aboutHeroPhoto">
            <div className="about__hero-glare" />
            <Image src="/images/about-hero.png" alt="Gregory 坐在橙色椅子上" width={700} height={1360} />
          </div>

          <div className="about__photos" id="aboutPhotos">
            <div className="about__photo">
              <Image src="/images/about-3.png" alt="Gregory 在画廊" width={600} height={800} />
            </div>
            <div className="about__photo">
              <Image src="/images/about-2.png" alt="Gregory 在橙色椅子上" width={600} height={800} />
            </div>
            <div className="about__photo">
              <Image src="/images/about-4.png" alt="Gregory 与一只猫工作" width={600} height={800} />
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

          <div className="about__ask-ai">
            <div className="about__ask-ai-title">用 AI 问问关于 Gregory 的事</div>
            <div className="about__ai-pill">
              {AI_LINKS.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noopener"
                  className="about__icon-btn"
                  aria-label={l.label}
                >
                  <Image src={l.icon} alt="" width={20} height={20} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { useState } from "react";
import { WaveformFooter } from "@/components/WaveformFooter";

const CTA_TEXT = "我已准备好聊聊你的项目";

function ScrambleChar({ ch, index }: { ch: string; index: number }) {
  return (
    <span
      className="footer-cta__char"
      style={{ transitionDelay: `${index * 18}ms` }}
      aria-hidden
    >
      {ch}
    </span>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  const [emailCopied, setEmailCopied] = useState(false);

  const goTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const copyEmail = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText("gregory.murynmukha@gmail.com");
      setEmailCopied(true);
      window.setTimeout(() => setEmailCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  return (
    <footer className="atomic-footer">
      <div className="atomic-footer__topbar">
        <div className="atomic-footer__topbar-cell atomic-footer__topbar-cell--left">
          <span className="atomic-footer__topbar-icon" aria-hidden>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" />
              <path d="M3 12h18M12 3a13 13 0 0 1 0 18M12 3a13 13 0 0 0 0 18" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </span>
          <span className="atomic-footer__topbar-label">
            <span>EST.</span>
            <span>2010</span>
          </span>
        </div>

        <div className="atomic-footer__topbar-cell atomic-footer__topbar-cell--center">
          <button type="button" className="atomic-footer__gotop" onClick={goTop} aria-label="回到顶部">
            <span className="atomic-footer__gotop-icon" aria-hidden>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="atomic-footer__gotop-label">
              <span>回到</span>
              <span>顶部</span>
            </span>
          </button>
        </div>

        <div className="atomic-footer__topbar-cell atomic-footer__topbar-cell--right">
          <span className="atomic-footer__topbar-icon" aria-hidden>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" />
              <path d="M14.5 9.5a3.5 3.5 0 1 0 0 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </span>
          <span className="atomic-footer__topbar-label">
            <span>{year} ©</span>
            <span>版权所有</span>
          </span>
        </div>
      </div>

      <div className="atomic-footer__brand">
        <div className="atomic-footer__brand-mark">
          <Image
            src="/images/signature.svg"
            alt="Gregory Muryn-Mukha"
            width={360}
            height={140}
            className="atomic-footer__signature"
          />
        </div>
        <div className="atomic-footer__brand-tags">
          <span className="atomic-footer__brand-tag atomic-footer__brand-tag--muted">© Gregory</span>
          <span className="atomic-footer__brand-tag">
            <span>独立产品</span>
            <span>设计师</span>
          </span>
        </div>
      </div>

      <WaveformFooter />

      <div className="atomic-footer__bottom">
        <div className="atomic-footer__bottom-left">
          <span className="atomic-footer__bottom-icons" aria-hidden>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.4" />
              <path d="M7 12h10M12 7v10" stroke="currentColor" strokeWidth="1.4" />
            </svg>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" />
              <path d="M3 12h18M12 3a13 13 0 0 1 0 18M12 3a13 13 0 0 0 0 18" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </span>
          <p className="atomic-footer__bottom-blurb">
            服务范围横跨从复杂 SaaS 产品<br />
            到精致品牌官网的各种项目
          </p>
        </div>

        <h2 className="footer-cta">
          <span className="footer-cta__text" aria-label={CTA_TEXT}>
            {Array.from(CTA_TEXT).map((ch, i) => (
              <ScrambleChar key={i} ch={ch} index={i} />
            ))}
          </span>
        </h2>

        <div className="atomic-footer__bottom-right">
          <span className="atomic-footer__contacts-label">联系方式</span>
          <a href="#" onClick={copyEmail} className="atomic-footer__email" aria-live="polite">
            {emailCopied ? "已复制 ✓" : "gregory.murynmukha@gmail.com"}
          </a>
          <div className="atomic-footer__socials">
            <a
              href="https://t.me/murynmukha"
              target="_blank"
              rel="noopener"
              className="atomic-footer__social"
              aria-label="Telegram"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="m21 4-9.5 16.5-2.6-7.4L2 11.2 21 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="m9 14 3-3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a
              href="https://www.behance.net/murynmukha"
              target="_blank"
              rel="noopener"
              className="atomic-footer__social"
              aria-label="Behance"
            >
              <span style={{ fontWeight: 700, fontSize: 13, letterSpacing: "-0.02em" }}>Bē</span>
            </a>
            <a
              href="https://linkedin.com/in/murynmukha"
              target="_blank"
              rel="noopener"
              className="atomic-footer__social"
              aria-label="LinkedIn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4.98 3a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.5h4V21H3V9.5Zm6 0h3.8v1.6h.05a4.17 4.17 0 0 1 3.75-2.06c4 0 4.74 2.64 4.74 6.07V21h-4v-5.6c0-1.34-.02-3.06-1.86-3.06s-2.15 1.45-2.15 2.96V21H9V9.5Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

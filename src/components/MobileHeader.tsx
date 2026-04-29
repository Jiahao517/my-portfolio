"use client";

import { useEffect, useRef, useState } from "react";
import { useNavTheme } from "@/lib/useNavTheme";
import { ContactPopover } from "@/components/ContactPopover";

const NAV = [
  { id: "services", label: "服务" },
  { id: "work", label: "作品" },
  { id: "experience", label: "经历" },
  { id: "publications", label: "发表" },
  { id: "about", label: "关于" },
] as const;

export function MobileHeader() {
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("services");
  const [emailLabel, setEmailLabel] = useState("邮箱");
  const lastY = useRef(0);
  const isDarkTheme = useNavTheme();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y > lastY.current && y > 60) setHidden(true);
      else if (y < lastY.current) setHidden(false);
      lastY.current = y;

      const sections = document.querySelectorAll<HTMLElement>(".section[id]");
      const threshold = y + window.innerHeight * 0.3;
      let current = "services";
      sections.forEach((s) => {
        if (s.offsetTop <= threshold) current = s.id;
      });
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
  }, [open]);

  const copyEmail = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText("gregory.murynmukha@gmail.com");
      setEmailLabel("已复制");
      setTimeout(() => setEmailLabel("邮箱"), 1800);
    } catch {
      /* ignore */
    }
  };

  return (
    <>
      <header
        className={`mobile-header${isDarkTheme ? " mobile-header--dark" : " mobile-header--light"}`}
        style={{ transform: hidden ? "translateY(-100%)" : "translateY(0)" }}
      >
        <button
          className="menu-toggle"
          aria-label="菜单"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </button>
        <nav className="mobile-header__nav">
          {NAV.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              className={`mobile-header__link${active === n.id ? " active" : ""}`}
              data-section={n.id}
            >
              {n.label}
            </a>
          ))}
        </nav>
        <ContactPopover placement="below">
          <button className="mobile-header__contact-btn" aria-label="联系我">
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
              <rect x="8" y="9" width="16" height="13" rx="1.5" stroke="currentColor" strokeWidth="2" />
              <path d="m9 11 6.6 5.3a1 1 0 0 0 1.2 0L23 11" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
        </ContactPopover>
      </header>

      <div className="mobile-menu" aria-hidden={!open}>
        {NAV.map((n) => (
          <a
            key={n.id}
            href={`#${n.id}`}
            className="mobile-menu-link"
            onClick={() => setOpen(false)}
          >
            {n.label}
          </a>
        ))}
        <div className="mobile-menu-bottom">
          <a
            href="https://linkedin.com/in/murynmukha"
            target="_blank"
            rel="noopener"
            className="mobile-menu-link"
          >
            LinkedIn
          </a>
          <a href="#" onClick={copyEmail} className="mobile-menu-link" id="mobileMenuCopyEmail">
            {emailLabel}
          </a>
        </div>
      </div>
    </>
  );
}

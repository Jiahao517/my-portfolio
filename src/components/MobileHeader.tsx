"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

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
      <header className="mobile-header" style={{ transform: hidden ? "translateY(-100%)" : "translateY(0)" }}>
        <a href="#services" className="mobile-logo">
          <Image src="/images/signature.svg" alt="Gregory Muryn-Mukha" width={98} height={38} />
        </a>
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

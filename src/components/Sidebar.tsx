"use client";

import { useEffect, useRef, useState } from "react";
import { useNavTheme } from "@/lib/useNavTheme";

const NAV = [
  { id: "services", label: "服务" },
  { id: "work", label: "作品" },
  { id: "experience", label: "经历" },
  { id: "publications", label: "发表" },
  { id: "about", label: "关于" },
] as const;

export function Sidebar() {
  const [active, setActive] = useState<string>("services");
  const [copied, setCopied] = useState(false);
  const onceRef = useRef(false);
  const isDarkTheme = useNavTheme();

  useEffect(() => {
    if (onceRef.current) return;
    onceRef.current = true;
    const update = () => {
      const sections = document.querySelectorAll<HTMLElement>(".section[id]");
      const threshold = window.scrollY + window.innerHeight * 0.3;
      let current = "services";
      sections.forEach((s) => {
        if (s.offsetTop <= threshold) current = s.id;
      });
      setActive(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const onCopyEmail = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText("gregory.murynmukha@gmail.com");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  return (
    <aside className={`sidebar reveal-load reveal-load--active${isDarkTheme ? " sidebar--dark" : " sidebar--light"}`}>
      <div className="sidebar-top">
        <nav className="sidebar-nav">
          {NAV.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`nav-link reveal-load reveal-load--active${active === item.id ? " active" : ""}`}
              data-section={item.id}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
      <div className="sidebar-bottom">
        <a
          href="https://linkedin.com/in/murynmukha"
          target="_blank"
          rel="noopener"
          className="sidebar-external reveal-load reveal-load--active"
        >
          LinkedIn
        </a>
        <a
          href="#"
          onClick={onCopyEmail}
          className="sidebar-external sidebar-email reveal-load reveal-load--active"
          id="sidebarCopyEmail"
        >
          {copied ? "已复制" : "邮箱"}
        </a>
      </div>
    </aside>
  );
}

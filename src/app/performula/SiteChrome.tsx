"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const STUDIO_LOGO = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 409 409" className="h-9 w-9">
    <path fill="#fff" d="M314.651 153.2h-12.34v7.98h12.34zM173.17 190.49c-9.66 6.26-16.57 16.84-16.57 26.25 0 7.79 5 11.2 10.34 11.2 8.13 0 10.77-6.01 20.02-6.01 6.62 0 11.61 5.4 11.61 11.54 0 9.24-7.93 17.5-19.27 17.5-17.57 0-27.73-13.74-27.73-30.84 0-11.46 7.31-25.15 18.54-32.17z" />
    <path fill="#fff" d="M302.31 151.51c-22.97 0-40.65-22.72-40.65-41.1 0-14.37 22.03-7.9 22.03-21.98 0-5.53-4.67-11.12-12.29-11.12-10.17 0-17.03 9.26-17.03 21.02 0 6.82 2.94 19.19 7.84 26.94l-1.82 1.26c-19.33-21.64-27.92-57.22-72.25-57.22-32.12 0-58.18 25.63-58.18 59.56 0 80.92 137.19 96.85 137.19 155.9 0 32.46-28.81 50.18-56.64 50.18-44.12 0-79.48-33.57-79.48-75.22 0-50.51 39.26-92.38 93-92.38 47.16 0 77.51 31.34 77.51 60.63 0 34.17-29.4 66.97-87.2 66.97S107.89 264 107.89 211.53c0-47.37 37.02-82.15 85.64-82.15 58.76 0 81.87 34.78 116.56 34.78 16.21 0 27.21-6.46 27.21-15.95 0-6.12-4.71-10.31-11.22-10.31-9.6 0-12.74 13.59-23.76 13.59s7.77 8.06 7.77 8.06c-34.58 0-57.99-34.78-116.56-34.78-73.63 0-121.94 42.17-121.94 88.64 0 53.23 57.98 86.13 142.75 86.13s122.88-33.87 122.88-71.29-45.91-65.52-113.19-65.52c-56.49 0-97.6 44.53-97.6 96.98 0 45.4 37.88 79.82 84.08 79.82s79.05-34.58 79.05-73.37c0-67-128.23-90.98-128.23-155.07 0-21.53 15.58-37.21 34.63-37.21 30.02 0 40.75 31.62 62.09 55.85 11.92 13.54 26.14 24.78 46.13 26.89l-1.86-5.15z" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="16" height="12" viewBox="0 0 16 12" fill="none" className="text-white">
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M10.707.293a1 1 0 1 0-1.414 1.414L12.586 5H1a1 1 0 0 0 0 2h11.586l-3.293 3.293a1 1 0 1 0 1.414 1.414L15.5 7l.026-.026C15.896 6.604 16 6.5 16 6s-.105-.605-.474-.974L15.5 5z"
      clipRule="evenodd"
    />
  </svg>
);

const NAV_ITEMS = [
  { label: "Index" },
  { label: "Projects", expandable: true },
  { label: "About" },
  { label: "News" },
  { label: "Contact" },
];

const PROJECT_THUMBS = [
  { name: "Spellbound", src: "https://a.storyblok.com/f/268243/601x600/aa10b1d8a4/thumbnails-spellbound.jpg" },
  { name: "Moss", src: "https://a.storyblok.com/f/268243/601x600/8e7c9b18a3/thumbnails-moss.jpg" },
  { name: "Performula", src: "https://a.storyblok.com/f/268243/601x600/0a7fd3eecf/thumbnails-performula.jpg" },
  { name: "Highsnobiety", src: "https://a.storyblok.com/f/268243/601x600/cb1c4e2de1/thumbnails-highsnobiety.jpg" },
  { name: "ColorsXStudios", src: "https://a.storyblok.com/f/268243/601x600/282a9b76a2/thumbnails-colors.jpg" },
];

type Thumb = { src: string; ar: number };

export function SiteChrome({ thumbs }: { thumbs: Thumb[] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  const lastScrollRef = useRef(0);
  const stripRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? y / max : 0;
      setProgress(Math.min(1, Math.max(0, p)));
      setShowProgress(y > 80);

      const last = lastScrollRef.current;
      const delta = y - last;
      if (y < 40) {
        setHeaderHidden(false);
      } else if (delta > 4) {
        setHeaderHidden(true);
      } else if (delta < -4) {
        setHeaderHidden(false);
      }
      lastScrollRef.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const activeIdx = Math.round(progress * (thumbs.length - 1));

  // Continuously slide the strip so that the point under the page-progress
  // cursor sits in the horizontal center of the viewport.
  useEffect(() => {
    const wrap = stripRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;
    const items = itemRefs.current.filter(Boolean) as HTMLButtonElement[];
    if (items.length === 0) return;
    const pos = progress * (items.length - 1);
    const i = Math.min(items.length - 1, Math.floor(pos));
    const t = pos - i;
    const a = items[i];
    const b = items[Math.min(items.length - 1, i + 1)];
    const aCenter = a.offsetLeft + a.offsetWidth / 2;
    const bCenter = b.offsetLeft + b.offsetWidth / 2;
    const targetCenter = aCenter + (bCenter - aCenter) * t;
    const center = wrap.clientWidth / 2;
    inner.style.transform = `translate3d(${center - targetCenter}px,0,0)`;
  }, [progress, showProgress, thumbs.length]);

  return (
    <>
      {/* Floating pill header */}
      <header
        className={`pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center px-3 transition-all duration-300 ${
          headerHidden && !menuOpen ? "-translate-y-6 opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        <div className="pointer-events-auto flex w-[min(94vw,390px)] items-center justify-between rounded-[14px] bg-neutral-800/90 px-3 py-2 backdrop-blur-md ring-1 ring-white/10">
          <button
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full transition-colors hover:bg-white/10"
          >
            {menuOpen ? (
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M22 20.6 12.1 10.7a1 1 0 0 0-1.4 1.4l9.9 9.9a1 1 0 0 0 1.4-1.4Z" fill="#fff" />
                <path d="M20.6 10.7 10.7 20.6a1 1 0 0 0 1.4 1.4l9.9-9.9a1 1 0 0 0-1.4-1.4Z" fill="#fff" />
              </svg>
            ) : (
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M8 11h16M8 16h16M8 21h16" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>
          <a href="#" aria-label="Studio Gruhl" className="grid h-10 w-10 place-items-center">
            {STUDIO_LOGO}
          </a>
          <a
            href="#contact"
            aria-label="Contact"
            className="grid h-10 w-10 place-items-center rounded-full transition-colors hover:bg-white/10"
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect x="8" y="9" width="16" height="13" rx="1.5" stroke="#fff" strokeWidth="2" />
              <path d="m9 11 6.6 5.3a1 1 0 0 0 1.2 0L23 11" stroke="#fff" strokeWidth="2" />
            </svg>
          </a>
        </div>
      </header>

      {/* Menu overlay */}
      <div
        className={`fixed inset-0 z-40 ${menuOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!menuOpen}
      >
        <button
          aria-label="Close"
          onClick={() => setMenuOpen(false)}
          className="absolute inset-0 transition-[backdrop-filter,background-color,opacity] duration-500 ease-out"
          style={{
            backgroundColor: menuOpen ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0)",
            backdropFilter: menuOpen ? "blur(12px)" : "blur(0px)",
            WebkitBackdropFilter: menuOpen ? "blur(12px)" : "blur(0px)",
            opacity: menuOpen ? 1 : 0,
          }}
        />
        <div
          className={`relative mx-auto mt-3 w-[min(94vw,390px)] overflow-hidden rounded-[14px] bg-neutral-800/95 shadow-2xl ring-1 ring-white/10 transition-all duration-500 ease-out ${
            menuOpen ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
          }`}
        >
          <div className="flex flex-col">
            {/* Spacer matching the header pill height so menu items are not covered */}
            <div aria-hidden className="h-[60px]" />
            <div className="px-6">
              {NAV_ITEMS.map((item) => (
                <div key={item.label}>
                  <a
                    href="#"
                    className="flex items-center justify-between border-t border-white/15 py-5 text-lg font-medium uppercase tracking-wide first:border-t-0 hover:text-white/60"
                  >
                    <span>{item.label}</span>
                    <ArrowIcon />
                  </a>
                  {item.expandable && (
                    <div className="-mx-6 border-t border-white/15">
                      <div className="flex gap-3 overflow-x-auto px-6 py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {PROJECT_THUMBS.map((p) => (
                          <a key={p.name} href="#" className="shrink-0 text-center">
                            <div className="grid h-20 w-20 place-items-center overflow-hidden rounded-2xl bg-neutral-800 text-xs uppercase">
                              {p.name.slice(0, 2)}
                            </div>
                            <div className="mt-2 text-[11px] uppercase tracking-wider text-white/70">{p.name}</div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <a
                href="https://manage.kmail-lists.com/subscriptions/subscribe?a=RLE9g5&g=Tp7ZaR"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center border-t border-white/15 py-6 text-lg font-medium uppercase tracking-wide hover:text-white/60"
              >
                Join Our Newsletter
              </a>
            </div>
            <div className="grid grid-cols-3 border-t border-white/15">
              {[
                { label: "Instagram", href: "https://www.instagram.com/studiogruhl/" },
                { label: "Are.na", href: "https://www.are.na/studio-gruhl/channels" },
                { label: "LinkedIn", href: "https://www.linkedin.com/company/studiogruhl/" },
              ].map((s, i) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`grid place-items-center py-5 text-xs uppercase tracking-widest text-white/80 hover:text-white ${
                    i > 0 ? "border-l border-white/15" : ""
                  }`}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom progress thumbnails */}
      <div
        className={`pointer-events-none fixed inset-x-0 bottom-3 z-40 flex justify-center px-4 transition-all duration-300 ${
          showProgress ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
      >
        <div
          ref={stripRef}
          className="pointer-events-auto relative w-[min(96vw,720px)] overflow-hidden rounded-2xl bg-neutral-900/85 px-3 py-2 backdrop-blur-md ring-1 ring-white/10"
        >
          {/* Center indicator line */}
          <div className="pointer-events-none absolute inset-y-1 left-1/2 z-10 w-px -translate-x-1/2 bg-white/70" />
          <div
            ref={innerRef}
            className="flex h-14 items-center gap-1.5"
            style={{ willChange: "transform" }}
          >
            {thumbs.map((t, i) => {
              const h = 56;
              const w = Math.max(24, Math.round(h * t.ar));
              const isActive = activeIdx === i;
              return (
                <button
                  key={i}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  onClick={() => {
                    const max = document.documentElement.scrollHeight - window.innerHeight;
                    window.scrollTo({
                      top: (max * i) / Math.max(1, thumbs.length - 1),
                      behavior: "smooth",
                    });
                  }}
                  style={{ width: w, height: h }}
                  className={`relative shrink-0 overflow-hidden rounded-md transition ${
                    isActive ? "opacity-100" : "opacity-60 hover:opacity-90"
                  }`}
                  aria-label={`Jump to image ${i + 1}`}
                >
                  <Image
                    src={t.src}
                    alt=""
                    fill
                    sizes="160px"
                    className="object-cover"
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

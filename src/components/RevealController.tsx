"use client";

import { useEffect } from "react";

/** Adds `reveal-scroll--active` to `.reveal-scroll` elements when they enter the viewport. */
export function RevealController() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal-scroll:not(.reveal-scroll--visible)");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("reveal-scroll--visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-scroll--visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px 5% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}

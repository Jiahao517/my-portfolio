"use client";

import { gsap } from "gsap";
import { useEffect, useRef, type RefObject } from "react";
import "./ImageTrail.css";

function lerp(a: number, b: number, n: number) {
  return (1 - n) * a + n * b;
}

function getLocalPos(e: MouseEvent | TouchEvent, rect: DOMRect) {
  const clientX = "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
  const clientY = "touches" in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
  return { x: clientX - rect.left, y: clientY - rect.top };
}

interface ImageTrailProps {
  items: string[];
  containerRef: RefObject<HTMLElement | null>;
  threshold?: number;
}

export function ImageTrail({ items, containerRef, threshold = 80 }: ImageTrailProps) {
  const poolRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pool = poolRef.current;
    const eventTarget = containerRef.current;
    if (!pool || !eventTarget) return;

    const imgs = Array.from(pool.querySelectorAll<HTMLDivElement>(".trail-img"));
    let imgPos = 0;
    let zVal = 1;
    let mousePos = { x: 0, y: 0 };
    let lastMousePos = { x: 0, y: 0 };
    let cacheMousePos = { x: 0, y: 0 };
    let rafId: number;
    let started = false;

    const showNext = () => {
      zVal++;
      imgPos = imgPos < imgs.length - 1 ? imgPos + 1 : 0;
      const el = imgs[imgPos];
      const inner = el.querySelector<HTMLDivElement>(".trail-img-inner");
      const w = el.offsetWidth;
      const h = el.offsetHeight;

      gsap.killTweensOf(el);

      gsap
        .timeline()
        .fromTo(
          el,
          {
            opacity: 1,
            scale: 0,
            zIndex: zVal,
            x: cacheMousePos.x - w / 2,
            y: cacheMousePos.y - h / 2,
          },
          {
            duration: 0.4,
            ease: "power1",
            scale: 1,
            x: mousePos.x - w / 2,
            y: mousePos.y - h / 2,
          },
          0
        )
        .fromTo(
          inner,
          { scale: 2.8, filter: "brightness(250%)" },
          { duration: 0.4, ease: "power1", scale: 1, filter: "brightness(100%)" },
          0
        )
        .to(
          el,
          { duration: 0.4, ease: "power2", opacity: 0, scale: 0.2 },
          0.45
        );
    };

    const render = () => {
      const dx = mousePos.x - lastMousePos.x;
      const dy = mousePos.y - lastMousePos.y;
      const dist = Math.hypot(dx, dy);
      cacheMousePos.x = lerp(cacheMousePos.x, mousePos.x, 0.1);
      cacheMousePos.y = lerp(cacheMousePos.y, mousePos.y, 0.1);
      if (dist > threshold) {
        showNext();
        lastMousePos = { ...mousePos };
      }
      rafId = requestAnimationFrame(render);
    };

    const onMove = (e: MouseEvent | TouchEvent) => {
      if ((e.target as Element).closest?.("[data-no-trail]")) return;
      const rect = eventTarget.getBoundingClientRect();
      mousePos = getLocalPos(e, rect);
      if (!started) {
        cacheMousePos = { ...mousePos };
        started = true;
        rafId = requestAnimationFrame(render);
      }
    };

    eventTarget.addEventListener("mousemove", onMove as EventListener);
    eventTarget.addEventListener("touchmove", onMove as EventListener);

    return () => {
      cancelAnimationFrame(rafId);
      eventTarget.removeEventListener("mousemove", onMove as EventListener);
      eventTarget.removeEventListener("touchmove", onMove as EventListener);
      gsap.killTweensOf(imgs);
    };
  }, [items, containerRef, threshold]);

  return (
    <div
      ref={poolRef}
      aria-hidden
      style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "visible" }}
    >
      {items.map((url, i) => (
        <div className="trail-img" key={i}>
          <div className="trail-img-inner" style={{ backgroundImage: `url(${url})` }} />
        </div>
      ))}
    </div>
  );
}

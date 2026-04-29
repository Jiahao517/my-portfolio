"use client";

import { useEffect, useRef, useCallback } from "react";

interface TrailImage {
  id: number;
  src: string;
  x: number;
  y: number;
  rotation: number;
  el: HTMLDivElement;
}

interface ImageTrailProps {
  images: string[];
  /** Container element ref — trail is confined to this element */
  containerRef: React.RefObject<HTMLElement | null>;
  /** px moved before spawning next image */
  threshold?: number;
  /** ms before image fades out */
  lifetime?: number;
  /** image width in px */
  imageWidth?: number;
  /** image height in px */
  imageHeight?: number;
}

export function ImageTrail({
  images,
  containerRef,
  threshold = 80,
  lifetime = 700,
  imageWidth = 180,
  imageHeight = 120,
}: ImageTrailProps) {
  const poolRef = useRef<HTMLDivElement | null>(null);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const indexRef = useRef(0);
  const idRef = useRef(0);
  const activeRef = useRef<TrailImage[]>([]);

  const spawnImage = useCallback(
    (x: number, y: number) => {
      const container = containerRef.current;
      const pool = poolRef.current;
      if (!container || !pool) return;

      const rect = container.getBoundingClientRect();
      const localX = x - rect.left;
      const localY = y - rect.top;

      const src = images[indexRef.current % images.length];
      indexRef.current++;

      const rotation = (Math.random() - 0.5) * 24;
      const id = idRef.current++;

      const el = document.createElement("div");
      el.style.cssText = `
        position: absolute;
        pointer-events: none;
        width: ${imageWidth}px;
        height: ${imageHeight}px;
        left: ${localX - imageWidth / 2}px;
        top: ${localY - imageHeight / 2}px;
        transform: rotate(${rotation}deg) scale(0.8);
        opacity: 0;
        transition: opacity 0.15s ease, transform 0.15s ease;
        z-index: 10;
        border-radius: 6px;
        overflow: hidden;
        will-change: transform, opacity;
      `;

      const img = document.createElement("img");
      img.src = src;
      img.style.cssText = "width:100%;height:100%;object-fit:cover;display:block;";
      el.appendChild(img);
      pool.appendChild(el);

      const item: TrailImage = { id, src, x: localX, y: localY, rotation, el };
      activeRef.current.push(item);

      // Trigger enter animation
      requestAnimationFrame(() => {
        el.style.opacity = "1";
        el.style.transform = `rotate(${rotation}deg) scale(1)`;
      });

      // Schedule fade-out
      setTimeout(() => {
        el.style.transition = "opacity 0.4s ease, transform 0.4s ease";
        el.style.opacity = "0";
        el.style.transform = `rotate(${rotation}deg) scale(0.85)`;

        setTimeout(() => {
          el.remove();
          activeRef.current = activeRef.current.filter((t) => t.id !== id);
        }, 400);
      }, lifetime);
    },
    [images, containerRef, lifetime, imageWidth, imageHeight],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const last = lastPosRef.current;

      if (last) {
        const dx = clientX - last.x;
        const dy = clientY - last.y;
        if (Math.sqrt(dx * dx + dy * dy) < threshold) return;
      }

      lastPosRef.current = { x: clientX, y: clientY };
      spawnImage(clientX, clientY);
    };

    const onMouseLeave = () => {
      lastPosRef.current = null;
    };

    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseleave", onMouseLeave);
    return () => {
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [containerRef, spawnImage, threshold]);

  return (
    <div
      ref={poolRef}
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        borderRadius: "inherit",
      }}
    />
  );
}

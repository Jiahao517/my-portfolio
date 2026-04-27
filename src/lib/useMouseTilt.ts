"use client";

import { useEffect } from "react";

type MouseTiltOptions = {
  targetSelector?: string;
  glareSelector?: string;
  maxTiltX?: number;
  maxTiltY?: number;
  scale?: number;
  perspective?: number;
};

type TiltRuntime = {
  root: HTMLElement;
  target: HTMLElement;
  glare: HTMLElement | null;
  raf: number | null;
  pointerX: number;
  pointerY: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function useMouseTilt(selector: string, options: MouseTiltOptions = {}) {
  const {
    targetSelector,
    glareSelector,
    maxTiltX = 5,
    maxTiltY = 7,
    scale = 1.015,
    perspective = 1000,
  } = options;

  useEffect(() => {
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canHover || reducedMotion) return;

    const roots = Array.from(document.querySelectorAll<HTMLElement>(selector));
    if (roots.length === 0) return;

    const runtimes = roots
      .map((root): TiltRuntime | null => {
        const target = targetSelector
          ? root.querySelector<HTMLElement>(targetSelector)
          : root;
        if (!target) return null;
        const glare = glareSelector ? root.querySelector<HTMLElement>(glareSelector) : null;
        return { root, target, glare, raf: null as number | null, pointerX: 0, pointerY: 0 };
      })
      .filter((entry): entry is TiltRuntime => entry !== null);

    if (runtimes.length === 0) return;

    const cleanups: Array<() => void> = [];

    const reset = (runtime: TiltRuntime) => {
      runtime.target.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`;
      if (runtime.glare) runtime.glare.style.opacity = "0";
    };

    runtimes.forEach((runtime) => {
      const update = () => {
        runtime.raf = null;
        const rect = runtime.root.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        const x = clamp((runtime.pointerX - rect.left) / rect.width, 0, 1);
        const y = clamp((runtime.pointerY - rect.top) / rect.height, 0, 1);
        const normalizedX = x * 2 - 1;
        const normalizedY = y * 2 - 1;

        const rotateX = -normalizedY * maxTiltX;
        const rotateY = normalizedX * maxTiltY;

        runtime.target.style.transform =
          `perspective(${perspective}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(${scale})`;

        if (runtime.glare) {
          runtime.glare.style.opacity = "1";
          runtime.glare.style.background =
            `radial-gradient(circle at ${(x * 100).toFixed(1)}% ${(y * 100).toFixed(1)}%, rgba(255,255,255,0.18) 0%, transparent 62%)`;
        }
      };

      const onPointerMove = (event: PointerEvent) => {
        runtime.pointerX = event.clientX;
        runtime.pointerY = event.clientY;
        if (runtime.raf !== null) return;
        runtime.raf = window.requestAnimationFrame(update);
      };

      const onPointerLeave = () => {
        if (runtime.raf !== null) {
          window.cancelAnimationFrame(runtime.raf);
          runtime.raf = null;
        }
        reset(runtime);
      };

      runtime.root.addEventListener("pointermove", onPointerMove);
      runtime.root.addEventListener("pointerleave", onPointerLeave);
      runtime.root.addEventListener("pointercancel", onPointerLeave);
      reset(runtime);

      cleanups.push(() => {
        runtime.root.removeEventListener("pointermove", onPointerMove);
        runtime.root.removeEventListener("pointerleave", onPointerLeave);
        runtime.root.removeEventListener("pointercancel", onPointerLeave);
        if (runtime.raf !== null) window.cancelAnimationFrame(runtime.raf);
      });
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [glareSelector, maxTiltX, maxTiltY, perspective, scale, selector, targetSelector]);
}

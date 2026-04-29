"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/icons";
import { testimonials } from "@/data/testimonials";

const SERVICES = [
  "前端实现",
  "原型 / Demo",
  "产品策略",
  "用户研究",
  "UX / UI 设计",
];

const DESCRIPTIONS = [
  "用 React、Next.js 把设计落地为可交付产品。掌握组件化、动效与性能优化。",
  "快速搭建可点击原型与演示，验证概念，争取资源与用户反馈。",
  "和创始人一起厘清目标、用户与优先级，决定 v1 做什么、v2 做什么。",
  "用户访谈、可用性测试、行为分析，把研究洞察转化为设计决定。",
  "体验流程、视觉系统、交互细节，构建从功能到品牌一致的产品语言。",
];

export function SocialProof() {
  const [tIdx, setTIdx] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const wheelRootRef = useRef<HTMLDivElement>(null);

  const t = testimonials[tIdx];

  const goto = (next: number, dir: 1 | -1) => {
    if (next < 0 || next >= testimonials.length || transitioning) return;
    setTransitioning(true);
    window.setTimeout(() => {
      setTIdx(next);
      setTransitioning(false);
    }, 220);
    void dir;
  };

  useEffect(() => {
    const root = wheelRootRef.current;
    if (!root) return;

    const track = root.querySelector<HTMLDivElement>(".sp-wheel__track");
    const arrow = root.querySelector<HTMLDivElement>(".sp-services__arrow");
    const wheelContainer = root.querySelector<HTMLDivElement>(".sp-services__wheel");
    const pillStack = root.querySelector<HTMLDivElement>(".sp-services__pill-stack");
    if (!track || !arrow || !wheelContainer || !pillStack) return;

    const services = SERVICES;
    const descriptions = DESCRIPTIONS;
    const N = services.length;

    // ---------- Pill stack ----------
    type StackSpec = {
      w: number;
      h: number;
      bg: number;
      r: string;
      shadow: string;
      stroke: string;
      pad: string;
      scale: number;
      opacity: number;
      yOff: number;
    };
    const S: Record<"top2" | "top1" | "active" | "bot1" | "bot2", StackSpec> = {
      top2: { w: 134, h: 20, bg: 0.24, r: "14px 14px 0 0", shadow: "0 -12px 8px 0 rgba(255,243,244,0.35)", stroke: "none", pad: "0", scale: 1, opacity: 1, yOff: 0 },
      top1: { w: 184, h: 28, bg: 0.44, r: "18px 18px 0 0", shadow: "0 -12px 8px 0 rgba(255,243,244,0.35)", stroke: "none", pad: "0", scale: 1, opacity: 1, yOff: 0 },
      active: { w: 260, h: 175, bg: 0.92, r: "32px", shadow: "0 -12px 8px 0 rgba(255,243,244,0.35)", stroke: "inset 0 -2px 0 0 rgba(255,206,209,0.32)", pad: "22px 28px 23px", scale: 1, opacity: 1, yOff: 0 },
      bot1: { w: 184, h: 28, bg: 0.44, r: "0 0 18px 18px", shadow: "none", stroke: "inset 0 -1.5px 0 0 rgba(255,222,224,0.32)", pad: "0", scale: 1, opacity: 1, yOff: 0 },
      bot2: { w: 134, h: 20, bg: 0.24, r: "0 0 14px 14px", shadow: "none", stroke: "inset 0 -1.5px 0 0 rgba(255,222,224,0.24)", pad: "0", scale: 1, opacity: 1, yOff: 0 },
    };

    const ANIM_DUR = 450;
    const ANIM_EASE = "cubic-bezier(0.4, 0, 0.2, 1)";
    const ANIM_TR = `all ${ANIM_DUR}ms ${ANIM_EASE}`;

    let elTop2 = root.querySelector<HTMLDivElement>("#stackTop2")!;
    let elTop1 = root.querySelector<HTMLDivElement>("#stackTop1")!;
    let elActive = root.querySelector<HTMLDivElement>("#stackActive")!;
    let elBot1 = root.querySelector<HTMLDivElement>("#stackBot1")!;
    let elBot2 = root.querySelector<HTMLDivElement>("#stackBot2")!;
    let elActiveText = elActive.querySelector("span") as HTMLSpanElement;
    let stackAnimating = false;

    function applyState(el: HTMLDivElement, s: StackSpec, animate: boolean) {
      el.style.transition = animate ? ANIM_TR : "none";
      el.style.width = s.w + "px";
      el.style.height = s.h + "px";
      el.style.background = `rgba(255,222,224,${s.bg})`;
      el.style.borderRadius = s.r;
      el.style.boxShadow =
        s.stroke !== "none" && s.shadow !== "none"
          ? `${s.stroke},${s.shadow}`
          : s.stroke !== "none"
          ? s.stroke
          : s.shadow;
      el.style.padding = s.pad;
      el.style.transform = `scale(${s.scale}) translateY(${s.yOff}px)`;
      el.style.opacity = String(s.opacity);
    }

    applyState(elTop2, S.top2, false);
    applyState(elTop1, S.top1, false);
    applyState(elActive, S.active, false);
    applyState(elBot1, S.bot1, false);
    applyState(elBot2, S.bot2, false);
    elActiveText.textContent = descriptions[0];

    function updateDescription(idx: number) {
      if (stackAnimating) return;
      stackAnimating = true;
      const nextText = descriptions[idx];

      applyState(elTop2, { ...S.bot2, scale: 0.5, opacity: 0, yOff: 20 }, false);
      pillStack!.appendChild(elTop2);

      const newSpan = document.createElement("span");
      newSpan.style.opacity = "0";
      newSpan.textContent = nextText;
      elBot1.appendChild(newSpan);
      elBot1.classList.add("sp-stack__card--active");

      elActiveText.style.transition = "opacity 0.15s ease-out";
      elActiveText.style.opacity = "0";

      void pillStack!.offsetHeight;

      requestAnimationFrame(() => {
        applyState(elTop1, S.top2, true);
        applyState(elActive, { ...S.top1, pad: "0" }, true);
        applyState(elBot1, S.active, true);
        applyState(elBot2, S.bot1, true);
        applyState(elTop2, S.bot2, true);
      });

      window.setTimeout(() => {
        elActive.classList.remove("sp-stack__card--active");
        if (elActiveText.parentNode) elActiveText.parentNode.removeChild(elActiveText);

        const oldTop2 = elTop2;
        elTop2 = elTop1;
        elTop1 = elActive;
        elActive = elBot1;
        elActiveText = newSpan;
        elBot1 = elBot2;
        elBot2 = oldTop2;

        void pillStack!.offsetHeight;
        elActiveText.style.transition = "opacity 0.2s ease-in";
        elActiveText.style.opacity = "1";

        window.setTimeout(() => {
          elActiveText.style.transition = "";
          stackAnimating = false;
        }, 220);
      }, ANIM_DUR + 10);
    }

    // ---------- Wheel ----------
    let CARD_H = wheelContainer.offsetHeight || 364;
    let CENTER_Y = CARD_H / 2;

    const R = 128;
    const STEP_DEG = 12;
    const DEG = Math.PI / 180;
    const CX = 64 - R;
    let CY = CENTER_Y;

    const BLUR = [0, 1, 2, 3, 4, 5];
    function getBlur(dist: number) {
      const i = Math.min(Math.floor(dist), BLUR.length - 2);
      const f = dist - i;
      return BLUR[i] + (BLUR[i + 1] - BLUR[i]) * f;
    }

    const COPIES = 5;
    const total = N * COPIES;
    const els: HTMLSpanElement[] = [];

    track.style.position = "absolute";
    track.style.inset = "0";
    track.innerHTML = "";

    for (let c = 0; c < COPIES; c++) {
      for (let i = 0; i < N; i++) {
        const el = document.createElement("span");
        el.className = "sp-wheel__item";
        el.textContent = services[i];
        el.style.transformOrigin = "left center";
        el.dataset.serviceIdx = String(i);
        track.appendChild(el);
        els.push(el);
      }
    }

    let currentIdx = 0;
    let scrollAngle = 0;
    let arrowNudge = 0;
    let activeNudge = 0;
    let hoveredEl: HTMLElement | null = null;
    let isAnimating = false;
    let sweepingEl: HTMLElement | null = null;

    function activeSlotIdx() {
      // Center the active slot in the middle of the COPIES list
      return Math.floor(COPIES / 2) * N + currentIdx;
    }

    function render() {
      const aSlot = activeSlotIdx();
      for (let i = 0; i < total; i++) {
        const el = els[i];
        const slotDiff = i - aSlot;
        const angleDeg = slotDiff * STEP_DEG - scrollAngle;
        const angleRad = angleDeg * DEG;

        const x = CX + R * Math.cos(angleRad);
        const y = CY + R * Math.sin(angleRad);
        const rot = angleDeg;

        const dist = Math.abs(angleDeg) / STEP_DEG;
        const nx = dist < 0.5 ? activeNudge : 0;

        el.style.left = (x + nx).toFixed(1) + "px";
        el.style.top = (y - 12.8).toFixed(1) + "px";
        el.style.transform = `rotate(${rot.toFixed(2)}deg)`;

        const isActive = dist < 0.5;
        const isHovered = el === hoveredEl && !isActive;

        if (isActive) {
          el.style.fontWeight = "600";
          if (el !== sweepingEl) {
            el.style.color = "var(--text-body)";
          }
          el.style.opacity = "1";
          el.style.filter = "none";
        } else if (isHovered) {
          el.style.fontWeight = "400";
          el.style.color = "var(--neutral-850)";
          el.style.opacity = "0.72";
          el.style.filter = "none";
        } else {
          el.style.fontWeight = "400";
          el.style.color = "var(--neutral-500)";
          el.style.opacity = "0.4";
          const blur = getBlur(dist);
          el.style.filter = blur > 0.3 ? `blur(${blur.toFixed(1)}px)` : "none";
        }

        el.style.visibility = Math.abs(angleDeg) > 70 ? "hidden" : "visible";
        el.style.cursor = isActive
          ? "default"
          : Math.abs(angleDeg) < 50
          ? "pointer"
          : "default";
      }

      if (arrow) {
        const stretchAmt = Math.abs(arrowNudge) / 16;
        const sx = 1 + stretchAmt * 0.22;
        const sy = 1 - stretchAmt * 0.16;
        arrow.style.transform = `translateY(-50%) translateX(${arrowNudge.toFixed(1)}px) scale(${sx.toFixed(3)}, ${sy.toFixed(3)})`;
      }
    }

    render();
    updateDescription(currentIdx);

    // ---------- Sweep gradient ----------
    const isNarrowMobile = window.matchMedia("(max-width: 553px)");
    const INTERVAL_DEFAULT = 5250;
    const SWEEP_DEFAULT = 4750;
    const NARROW_OFFSET = 3750;
    const INTERVAL = isNarrowMobile.matches ? INTERVAL_DEFAULT - NARROW_OFFSET : INTERVAL_DEFAULT;
    const NUDGE_DUR = 700;
    const sweepDur = isNarrowMobile.matches ? SWEEP_DEFAULT - NARROW_OFFSET : SWEEP_DEFAULT;

    let sweepRAF: number | null = null;
    let sweepElapsed = 0;
    let sweepLastTime = 0;
    let sweepPaused = false;

    function triggerSweep() {
      const aSlot = activeSlotIdx();
      const el = els[aSlot];
      if (!el) return;
      if (sweepingEl) clearSweep(sweepingEl);
      sweepingEl = el;
      sweepElapsed = 0;
      sweepPaused = false;
      el.style.backgroundImage =
        "linear-gradient(90deg, var(--text-body) 0%, var(--text-body) 44%, var(--accent-300) 50%, var(--text-body) 56%, var(--text-body) 100%)";
      el.style.backgroundSize = "200% auto";
      el.style.webkitBackgroundClip = "text";
      el.style.backgroundClip = "text";
      el.style.webkitTextFillColor = "transparent";
      el.style.backgroundPosition = "100% center";
      sweepLastTime = performance.now();
      sweepTick();
    }

    function sweepTick() {
      if (!sweepingEl) return;
      const now = performance.now();
      if (!sweepPaused) sweepElapsed += now - sweepLastTime;
      sweepLastTime = now;
      const p = Math.min(sweepElapsed / sweepDur, 1);
      const pos = 100 - 100 * p;
      sweepingEl.style.backgroundPosition = pos.toFixed(1) + "% center";
      if (p < 1) sweepRAF = requestAnimationFrame(sweepTick);
      else clearSweep(sweepingEl);
    }

    function pauseSweep() {
      sweepPaused = true;
    }
    function resumeSweep() {
      if (!sweepingEl) return;
      sweepPaused = false;
      sweepLastTime = performance.now();
    }
    function clearSweep(el: HTMLElement | null) {
      if (sweepRAF) {
        cancelAnimationFrame(sweepRAF);
        sweepRAF = null;
      }
      if (el) {
        el.style.backgroundImage = "";
        el.style.backgroundSize = "";
        el.style.webkitBackgroundClip = "";
        el.style.backgroundClip = "";
        el.style.webkitTextFillColor = "";
        el.style.backgroundPosition = "";
      }
      sweepingEl = null;
    }

    // ---------- Spring nudge ----------
    function springPushReturn(t: number) {
      if (t < 0.2) {
        const p = t / 0.2;
        return p * p * (3 - 2 * p);
      }
      const p = (t - 0.2) / 0.8;
      const decay = Math.exp(-5 * p);
      const osc = Math.cos(p * Math.PI * 2.5);
      return decay * osc;
    }

    function animateNudge() {
      const start = performance.now();
      const distance = 16;
      const arrowLead = 60;
      let sweepTriggered = false;

      function tick(now: number) {
        const elapsed = now - start;
        const arrowT = Math.min(elapsed / NUDGE_DUR, 1);
        arrowNudge = distance * springPushReturn(arrowT);
        const textElapsed = Math.max(0, elapsed - arrowLead);
        const textT = Math.min(textElapsed / (NUDGE_DUR - arrowLead), 1);
        activeNudge = distance * springPushReturn(textT);

        if (!sweepTriggered && elapsed >= 120) {
          sweepTriggered = true;
          updateDescription(currentIdx);
          triggerSweep();
        }
        render();

        if (elapsed < NUDGE_DUR) requestAnimationFrame(tick);
        else {
          arrowNudge = 0;
          activeNudge = 0;
          render();
        }
      }
      requestAnimationFrame(tick);
    }

    // ---------- Click to scroll ----------
    function scrollToService(targetIdx: number) {
      let diff = targetIdx - currentIdx;
      if (diff > N / 2) diff -= N;
      if (diff < -N / 2) diff += N;
      if (diff === 0) return;

      const steps = Math.abs(diff);
      const direction = diff > 0 ? 1 : -1;
      const totalDeg = steps * STEP_DEG * direction;

      isAnimating = true;
      const from = 0;
      const to = totalDeg;
      const start = performance.now();
      const dur = Math.min(300 + steps * 150, 900);
      let nudgeStarted = false;

      function tick(now: number) {
        const p = Math.min((now - start) / dur, 1);
        const e = 1 - Math.pow(1 - p, 3);
        scrollAngle = from + (to - from) * e;

        if (!nudgeStarted && p > 0.95) {
          nudgeStarted = true;
          currentIdx = targetIdx;
          scrollAngle = 0;
          isAnimating = false;
          resetTimer();
          animateNudge();
        }
        render();
        if (p < 1 && !nudgeStarted) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    const onClick = (e: Event) => {
      if (dragging) return;
      const target = (e.target as HTMLElement).closest(".sp-wheel__item") as HTMLElement | null;
      if (!target || isAnimating) return;
      const targetServiceIdx = parseInt(target.dataset.serviceIdx || "0", 10);
      if (targetServiceIdx === currentIdx) return;
      scrollToService(targetServiceIdx);
    };
    track.addEventListener("click", onClick);

    const onMouseOver = (e: Event) => {
      const target = (e.target as HTMLElement).closest(".sp-wheel__item") as HTMLElement | null;
      if (target && target !== hoveredEl) {
        hoveredEl = target;
        render();
      }
    };
    const onMouseOut = () => {
      if (hoveredEl) {
        hoveredEl = null;
        render();
      }
    };
    track.addEventListener("mouseover", onMouseOver);
    track.addEventListener("mouseout", onMouseOut);

    // ---------- Auto-advance ----------
    let paused = false;
    let timerElapsed = 0;
    let timerLastTime = performance.now();
    let timerRAF: number | null = null;

    const onMouseEnter = () => {
      paused = true;
      pauseSweep();
    };
    const onMouseLeave = () => {
      paused = false;
      timerLastTime = performance.now();
      hoveredEl = null;
      resumeSweep();
      render();
    };
    wheelContainer.addEventListener("mouseenter", onMouseEnter);
    wheelContainer.addEventListener("mouseleave", onMouseLeave);

    function advance() {
      const from = 0;
      const to = STEP_DEG;
      const start = performance.now();
      const dur = 600;
      let nudgeStarted = false;
      isAnimating = true;

      function tick(now: number) {
        const p = Math.min((now - start) / dur, 1);
        const e = 1 - Math.pow(1 - p, 3);
        scrollAngle = from + (to - from) * e;
        if (!nudgeStarted && p > 0.95) {
          nudgeStarted = true;
          currentIdx = (currentIdx + 1) % N;
          scrollAngle = 0;
          isAnimating = false;
          animateNudge();
        }
        render();
        if (p < 1 && !nudgeStarted) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    function timerTick() {
      const now = performance.now();
      if (!paused && !isAnimating) timerElapsed += now - timerLastTime;
      timerLastTime = now;
      if (timerElapsed >= INTERVAL) {
        timerElapsed = 0;
        advance();
      }
      timerRAF = requestAnimationFrame(timerTick);
    }
    function resetTimer() {
      timerElapsed = 0;
      timerLastTime = performance.now();
    }
    timerTick();
    triggerSweep();

    // ---------- Drag ----------
    let pointerDown = false;
    let dragging = false;
    let dragStartY = 0;
    const DRAG_THRESHOLD = 4;

    function onPointerDown(y: number) {
      if (isAnimating) return;
      pointerDown = true;
      dragging = false;
      dragStartY = y;
    }
    function onPointerMove(y: number) {
      if (!pointerDown) return;
      if (!dragging) {
        if (Math.abs(y - dragStartY) < DRAG_THRESHOLD) return;
        dragging = true;
        if (sweepingEl) clearSweep(sweepingEl);
      }
      const pxPerStep = R * Math.sin(STEP_DEG * DEG);
      scrollAngle = -(y - dragStartY) / pxPerStep * STEP_DEG;
      render();
    }
    function onPointerUp() {
      if (!pointerDown) return;
      pointerDown = false;
      if (!dragging) return;
      dragging = false;

      const stepsOffset = Math.round(scrollAngle / STEP_DEG);
      if (stepsOffset === 0) {
        animateSnapBack();
        return;
      }
      const targetIdx = ((currentIdx + stepsOffset) % N + N) % N;
      currentIdx = targetIdx;
      scrollAngle = scrollAngle - stepsOffset * STEP_DEG;

      const start = performance.now();
      const dur = 200;
      isAnimating = true;
      function tick(now: number) {
        const p = Math.min((now - start) / dur, 1);
        if (p < 1) requestAnimationFrame(tick);
        else {
          scrollAngle = 0;
          isAnimating = false;
          render();
          resetTimer();
          animateNudge();
        }
      }
      requestAnimationFrame(tick);
    }
    function animateSnapBack() {
      const start = performance.now();
      const dur = 300;
      isAnimating = true;
      function tick(now: number) {
        const p = Math.min((now - start) / dur, 1);
        if (p < 1) requestAnimationFrame(tick);
        else {
          scrollAngle = 0;
          isAnimating = false;
          render();
          triggerSweep();
        }
      }
      requestAnimationFrame(tick);
    }

    const onMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      onPointerDown(e.clientY);
    };
    const onMouseMove = (e: MouseEvent) => {
      if (pointerDown) {
        e.preventDefault();
        onPointerMove(e.clientY);
      }
    };
    const onMouseUp = () => onPointerUp();

    const onTouchStart = (e: TouchEvent) => onPointerDown(e.touches[0].clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (pointerDown) onPointerMove(e.touches[0].clientY);
    };
    const onTouchEnd = () => onPointerUp();

    wheelContainer.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    wheelContainer.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    wheelContainer.style.cursor = "grab";
    const onMouseDownCursor = () => {
      wheelContainer.style.cursor = "grabbing";
    };
    const onMouseUpCursor = () => {
      wheelContainer.style.cursor = "grab";
    };
    wheelContainer.addEventListener("mousedown", onMouseDownCursor);
    window.addEventListener("mouseup", onMouseUpCursor);

    const onResize = () => {
      CARD_H = wheelContainer.offsetHeight;
      CENTER_Y = CARD_H / 2;
      CY = CENTER_Y;
      render();
    };
    window.addEventListener("resize", onResize);

    return () => {
      if (timerRAF) cancelAnimationFrame(timerRAF);
      if (sweepRAF) cancelAnimationFrame(sweepRAF);
      track.removeEventListener("click", onClick);
      track.removeEventListener("mouseover", onMouseOver);
      track.removeEventListener("mouseout", onMouseOut);
      wheelContainer.removeEventListener("mouseenter", onMouseEnter);
      wheelContainer.removeEventListener("mouseleave", onMouseLeave);
      wheelContainer.removeEventListener("mousedown", onMouseDown);
      wheelContainer.removeEventListener("mousedown", onMouseDownCursor);
      wheelContainer.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mouseup", onMouseUpCursor);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="social-proof reveal-load reveal-load--active" ref={wheelRootRef}>
      <div className="social-proof__left">
        <div className="sp-card sp-card--services">
          <div className="sp-services__wheel" aria-hidden="true">
            <div className="sp-wheel__track" />
          </div>
          <div className="sp-services__arrow" aria-hidden="true">
            <svg width="20" height="15" viewBox="0 0 20 15" fill="none">
              <path
                d="M1 7.5H19M12 1l7 6.5-7 6.5"
                stroke="#2B2525"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="sp-services__pill-stack" id="pillStack">
            <div className="sp-stack__card" id="stackTop2" />
            <div className="sp-stack__card" id="stackTop1" />
            <div className="sp-stack__card sp-stack__card--active" id="stackActive">
              <span />
            </div>
            <div className="sp-stack__card" id="stackBot1" />
            <div className="sp-stack__card" id="stackBot2" />
          </div>
        </div>
      </div>

      <div className="sp-card sp-card--testimonial" id="testimonialCard">
        <div className="sp-testimonial__header">
          <div className="sp-testimonial__author">
            <div className="sp-testimonial__avatar">
              <Image
                key={t.photo}
                alt=""
                src={t.photo}
                width={56}
                height={56}
                className="sp-testimonial__avatar-fill"
                style={{ opacity: transitioning ? 0.4 : 1, transition: "opacity .22s ease" }}
              />
            </div>
            <div className="sp-testimonial__details">
              <div className="sp-testimonial__name">{t.name}</div>
              <div className="sp-testimonial__role">{t.role}</div>
            </div>
          </div>
          <div className="sp-testimonial__nav">
            <button
              type="button"
              className="sp-testimonial__btn sp-testimonial__btn--prev"
              disabled={tIdx === 0}
              aria-label="上一条推荐"
              onClick={() => goto(tIdx - 1, -1)}
            >
              <ArrowLeftIcon />
            </button>
            <button
              type="button"
              className="sp-testimonial__btn sp-testimonial__btn--next"
              disabled={tIdx === testimonials.length - 1}
              aria-label="下一条推荐"
              onClick={() => goto(tIdx + 1, 1)}
            >
              <ArrowRightIcon fill="#002E71" />
            </button>
          </div>
        </div>
        <blockquote
          className="sp-testimonial__quote"
          style={{ opacity: transitioning ? 0 : 1, transform: transitioning ? "translateX(-6px)" : "translateX(0)", transition: "opacity .22s ease, transform .22s ease" }}
        >
          {t.quote.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </blockquote>
        <div className="sp-testimonial__dots">
          {testimonials.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`切换到第 ${i + 1} 条推荐`}
              className={`sp-testimonial__dot${i === tIdx ? " sp-testimonial__dot--active" : ""}`}
              onClick={() => goto(i, i > tIdx ? 1 : -1)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/icons";

const TRAITS = [
  {
    title: "问题洞察",
    body: "我习惯主动从真实产品中发现体验问题，而不是只等待需求输入。面对用户反馈、线上数据或产品走查中的模糊问题，我会先拆解它背后的具体原因，判断它影响的是用户理解、操作效率、结果可信度还是业务转化，再结合影响范围和实现成本推动评审、排期与上线。过去我累计发现 300+ 个产品体验问题，其中 72% 已完成改进，这也让我形成了从问题识别、优先级判断到持续跟进落地的完整能力。",
  },
  {
    title: "落地取舍",
    body: "我不会只追求设计上的理想方案，而是会把方案放回真实项目环境中判断，结合项目阶段、开发成本、上线节奏和用户价值，找到当前阶段最合适的实现方式。对于高价值但成本较高的问题，我会用用户反馈、竞品分析或数据表现推动优先级；对于短期难以完整实现的方案，我会先拆出关键链路和低成本版本，保证核心体验先落地，再通过后续迭代逐步完善。",
  },
  {
    title: "方法沉淀",
    body: "面对复杂需求时，我通常不会一开始就进入界面细节，而是先理清判断路径、业务规则和设计边界。比如在 AI 对话、Agent 工具展示、Ask Human 决策、金融可视化等项目中，我会先梳理场景类型、触发条件、展示规则、异常状态和降级策略，再转化为页面结构和交互细节。这样不仅能减少团队反复沟通，也能让方案从单次交付变成后续可复用的方法资产。",
  },
  {
    title: "持续学习",
    body: "我对新技术和新工具保持开放态度，尤其是 AI Coding 出现后，我开始把 AI 系统性地带入调研、竞品分析、源码分析、代码走查、样式变量对齐和前端还原检查等工作中。在钉钉项目中，我也实际参与了从设计判断、方案生成、代码调整到官网发布的链路。对我来说，AI 不只是提升效率的工具，而是让设计师有机会从方案表达继续推进到实现、验证和真实交付。",
  },
  {
    title: "创新探索",
    body: "我长期关注 AI 产品、金融可视化、对话体验和智能交互方向的创新设计，过去参与过生成式 AI 投顾体验升级、ChatUI 组件库、AI 品牌设计和数字虚拟人开户专利等项目，也获得过设计奖项与专利。这些经历让我更关注创新与业务场景的结合：创新不只是概念表达，而是要解决真实问题，进入产品流程，并为用户体验和业务结果带来可验证的价值。",
  },
];

const SERVICES = [
  "结构判断",
  "规则设计",
  "对话体验",
  "信息表达",
  "专利设计",
  "设计奖项",
];

const DESCRIPTIONS = [
  "从业务目标、用户任务和产品形态出发，先判断产品应该如何组织，而不是直接进入界面绘制。",
  "把设计决策沉淀为组件、规范和可复用规则，让复杂系统后续还能持续扩展。",
  "设计 AI 的响应流程、过程反馈和操作方式，让用户知道系统在做什么、结果如何产生。",
  "把复杂数据、推理过程和多模态内容分层呈现，帮助用户更快理解和判断。",
  "参与 2 项专利设计，将虚拟人、图像识别和情绪反馈等能力转化为可执行的产品流程。",
  "获得 2 项设计奖，作品覆盖 AI 对话、金融可视化与品牌视觉等方向。",
];

export function SocialProof() {
  const [tIdx, setTIdx] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [activeServiceIdx, setActiveServiceIdx] = useState(0);
  const wheelRootRef = useRef<HTMLDivElement>(null);

  const t = TRAITS[tIdx];

  const goto = (next: number, dir: 1 | -1) => {
    if (next < 0 || next >= TRAITS.length || transitioning) return;
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
    if (!track || !arrow || !wheelContainer) return;

    const services = SERVICES;
    const N = services.length;

    // ---------- Wheel geometry ----------
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
      let activated = false;

      function tick(now: number) {
        const elapsed = now - start;
        const arrowT = Math.min(elapsed / NUDGE_DUR, 1);
        arrowNudge = distance * springPushReturn(arrowT);
        const textElapsed = Math.max(0, elapsed - arrowLead);
        const textT = Math.min(textElapsed / (NUDGE_DUR - arrowLead), 1);
        activeNudge = distance * springPushReturn(textT);

        if (!activated && elapsed >= 120) {
          activated = true;
          setActiveServiceIdx(currentIdx);
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
          <div className="sp-services__pill-stack">
            <div className="sp-stack__deco sp-stack__deco--top2" aria-hidden />
            <div className="sp-stack__deco sp-stack__deco--top1" aria-hidden />
            <div className="sp-stack__active">
              <span key={activeServiceIdx}>{DESCRIPTIONS[activeServiceIdx]}</span>
            </div>
            <div className="sp-stack__deco sp-stack__deco--bot1" aria-hidden />
            <div className="sp-stack__deco sp-stack__deco--bot2" aria-hidden />
          </div>
        </div>
      </div>

      <div className="sp-card sp-card--testimonial" id="testimonialCard">
        <div className="sp-testimonial__header">
          <div
            className="sp-testimonial__trait-title"
            style={{ opacity: transitioning ? 0 : 1, transition: "opacity .22s ease" }}
          >
            {t.title}
          </div>
          <div className="sp-testimonial__nav">
            <button
              type="button"
              className="sp-testimonial__btn sp-testimonial__btn--prev"
              disabled={tIdx === 0}
              aria-label="上一条"
              onClick={() => goto(tIdx - 1, -1)}
            >
              <ArrowLeftIcon />
            </button>
            <button
              type="button"
              className="sp-testimonial__btn sp-testimonial__btn--next"
              disabled={tIdx === TRAITS.length - 1}
              aria-label="下一条"
              onClick={() => goto(tIdx + 1, 1)}
            >
              <ArrowRightIcon fill="#002E71" />
            </button>
          </div>
        </div>
        <p
          className="sp-testimonial__trait-body"
          style={{ opacity: transitioning ? 0 : 1, transform: transitioning ? "translateX(-6px)" : "translateX(0)", transition: "opacity .22s ease, transform .22s ease" }}
        >
          {t.body}
        </p>
        <div className="sp-testimonial__dots">
          {TRAITS.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`切换到第 ${i + 1} 条`}
              className={`sp-testimonial__dot${i === tIdx ? " sp-testimonial__dot--active" : ""}`}
              onClick={() => goto(i, i > tIdx ? 1 : -1)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

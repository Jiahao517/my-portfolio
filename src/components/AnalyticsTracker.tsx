"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

type AnalyticsEventType = "page_view" | "heartbeat" | "scroll_depth" | "section_view" | "click";

interface AnalyticsPayload {
  type: AnalyticsEventType;
  sessionId: string;
  visitorId: string;
  timestamp: string;
  path: string;
  title?: string;
  referrer?: string;
  screen?: { width: number; height: number; dpr: number };
  viewport?: { width: number; height: number };
  device?: { userAgent: string; language: string; timezone: string };
  durationMs?: number;
  depth?: number;
  sectionId?: string;
  sectionLabel?: string;
  targetText?: string;
  targetRole?: string;
  targetHref?: string;
}

const VISITOR_KEY = "portfolio_analytics_visitor_id";
const SESSION_KEY = "portfolio_analytics_session_id";
const HEARTBEAT_MS = 5_000;
const MIN_HEARTBEAT_MS = 1_000;
const SCROLL_DEPTHS = [25, 50, 75, 100] as const;

export function AnalyticsTracker() {
  const pathname = usePathname();
  const activeSections = useRef(new Map<string, { startedAt: number; label: string }>());
  const lastHeartbeatAt = useRef<number | null>(null);

  useEffect(() => {
    if (!shouldTrack(pathname)) return;

    const send = createSender(pathname);
    lastHeartbeatAt.current = performance.now();
    send("page_view");

    const sendHeartbeat = () => {
      if (document.visibilityState !== "visible" || lastHeartbeatAt.current === null) return;
      const now = performance.now();
      const durationMs = Math.round(now - lastHeartbeatAt.current);
      if (durationMs >= MIN_HEARTBEAT_MS) {
        send("heartbeat", { durationMs });
        lastHeartbeatAt.current = now;
      }
    };

    const heartbeat = window.setInterval(() => {
      sendHeartbeat();
    }, HEARTBEAT_MS);

    const sentDepths = new Set<number>();
    const onScroll = () => {
      const depth = getScrollDepth();
      for (const threshold of SCROLL_DEPTHS) {
        if (depth >= threshold && !sentDepths.has(threshold)) {
          sentDepths.add(threshold);
          send("scroll_depth", { depth: threshold });
        }
      }
    };

    const onClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest("button,a,[role='button'],input[type='button'],input[type='submit']") : null;
      if (!target) return;
      send("click", {
        targetText: getTargetText(target),
        targetRole: getTargetRole(target),
        targetHref: target instanceof HTMLAnchorElement ? target.href : undefined,
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const now = performance.now();
        for (const entry of entries) {
          const sectionId = getSectionId(entry.target);
          const sectionLabel = getSectionLabel(entry.target, sectionId);
          if (entry.isIntersecting) {
            activeSections.current.set(sectionId, { startedAt: now, label: sectionLabel });
          } else {
            const active = activeSections.current.get(sectionId);
            if (!active) continue;
            activeSections.current.delete(sectionId);
            send("section_view", {
              sectionId,
              sectionLabel: active.label,
              durationMs: Math.round(now - active.startedAt),
            });
          }
        }
      },
      { threshold: 0.55 },
    );

    const sections = Array.from(document.querySelectorAll("main section, footer, [data-analytics-section]"));
    sections.forEach((section) => observer.observe(section));

    const flushSections = () => {
      const now = performance.now();
      for (const [sectionId, active] of activeSections.current.entries()) {
        send("section_view", {
          sectionId,
          sectionLabel: active.label,
          durationMs: Math.round(now - active.startedAt),
        });
        active.startedAt = now;
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        sendHeartbeat();
        flushSections();
        lastHeartbeatAt.current = null;
        return;
      }
      lastHeartbeatAt.current = performance.now();
    };

    const onPageHide = () => {
      sendHeartbeat();
      flushSections();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("click", onClick, { capture: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pagehide", onPageHide);
    onScroll();

    return () => {
      sendHeartbeat();
      window.clearInterval(heartbeat);
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onClick, { capture: true });
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pagehide", onPageHide);
      flushSections();
    };
  }, [pathname]);

  return null;
}

function createSender(pathname: string) {
  const visitorId = getPersistentId(VISITOR_KEY);
  const sessionId = getPersistentId(SESSION_KEY, true);

  return (type: AnalyticsEventType, data: Partial<AnalyticsPayload> = {}) => {
    const payload: AnalyticsPayload = {
      type,
      sessionId,
      visitorId,
      timestamp: new Date().toISOString(),
      path: pathname || window.location.pathname,
      title: document.title,
      referrer: document.referrer,
      screen: { width: window.screen.width, height: window.screen.height, dpr: window.devicePixelRatio || 1 },
      viewport: { width: window.innerWidth, height: window.innerHeight },
      device: {
        userAgent: navigator.userAgent,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      ...data,
    };

    const body = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/analytics/event", new Blob([body], { type: "application/json" }));
      return;
    }

    void fetch("/api/analytics/event", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      keepalive: true,
    });
  };
}

function shouldTrack(pathname: string | null) {
  if (!pathname) return false;
  return !pathname.startsWith("/admin") && !pathname.startsWith("/api");
}

function getPersistentId(key: string, sessionOnly = false) {
  const storage = sessionOnly ? window.sessionStorage : window.localStorage;
  const existing = storage.getItem(key);
  if (existing) return existing;
  const next = crypto.randomUUID();
  storage.setItem(key, next);
  return next;
}

function getScrollDepth() {
  const scrollTop = window.scrollY;
  const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  return Math.round((scrollTop / scrollable) * 100);
}

function getSectionId(target: Element) {
  return target.getAttribute("data-analytics-section") || target.id || target.className.toString().split(" ")[0] || target.tagName.toLowerCase();
}

function getSectionLabel(target: Element, fallback: string) {
  return (
    target.getAttribute("aria-label") ||
    target.querySelector("h1,h2,h3")?.textContent?.replace(/\s+/g, " ").trim().slice(0, 80) ||
    fallback
  );
}

function getTargetText(target: Element) {
  return (
    target.getAttribute("aria-label") ||
    target.textContent?.replace(/\s+/g, " ").trim().slice(0, 80) ||
    target.getAttribute("href") ||
    target.tagName.toLowerCase()
  );
}

function getTargetRole(target: Element) {
  if (target instanceof HTMLAnchorElement) return "link";
  if (target instanceof HTMLButtonElement) return "button";
  return target.getAttribute("role") || target.tagName.toLowerCase();
}

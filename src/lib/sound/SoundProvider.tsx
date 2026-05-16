// src/lib/sound/SoundProvider.tsx
"use client";

import { Howl, Howler } from "howler";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  MOBILE_BREAKPOINT_QUERY,
  SOUND_STORAGE_KEY,
  type SoundContextValue,
  type SoundId,
} from "./types";

export const SoundContext = createContext<SoundContextValue | null>(null);

const AMBIENT_FADE_MS = 400;
const AMBIENT_VOLUME = 0.35;
const ONESHOT_VOLUME = 0.6;

function getInitialActive(): boolean {
  if (typeof window === "undefined") return false;
  return !window.matchMedia(MOBILE_BREAKPOINT_QUERY).matches;
}

function getInitialEnabled(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia(MOBILE_BREAKPOINT_QUERY).matches) return false;
  return window.localStorage.getItem(SOUND_STORAGE_KEY) === "true";
}

export function SoundProvider({ children }: { children: ReactNode }) {
  // Both `active` and `enabled` are decided once at first client render via lazy
  // init. We deliberately do not track resize — switching between mobile and
  // desktop mid-session is rare and the spec accepts that cost.
  const [active] = useState<boolean>(getInitialActive);
  const [enabled, setEnabled] = useState<boolean>(getInitialEnabled);
  const [ready, setReady] = useState(false);

  const ambientRef = useRef<Howl | null>(null);
  const hoverRef = useRef<Howl | null>(null);
  const clickRef = useRef<Howl | null>(null);

  useEffect(() => {
    if (!active) return;

    ambientRef.current = new Howl({
      src: ["/sounds/ambient.mp3"],
      loop: true,
      volume: 0,
      html5: false,
      preload: true,
    });
    hoverRef.current = new Howl({
      src: ["/sounds/hover.mp3"],
      volume: ONESHOT_VOLUME,
      preload: true,
    });
    clickRef.current = new Howl({
      src: ["/sounds/click.mp3"],
      volume: ONESHOT_VOLUME,
      preload: true,
    });

    const onFirstGesture = () => {
      // iOS Safari: ensure AudioContext is resumed inside the gesture.
      const ctx = Howler.ctx;
      if (ctx && ctx.state === "suspended") void ctx.resume();
      setReady(true);
      window.removeEventListener("pointerdown", onFirstGesture);
      window.removeEventListener("keydown", onFirstGesture);
    };
    window.addEventListener("pointerdown", onFirstGesture, { once: true });
    window.addEventListener("keydown", onFirstGesture, { once: true });

    return () => {
      window.removeEventListener("pointerdown", onFirstGesture);
      window.removeEventListener("keydown", onFirstGesture);
      ambientRef.current?.unload();
      hoverRef.current?.unload();
      clickRef.current?.unload();
      ambientRef.current = null;
      hoverRef.current = null;
      clickRef.current = null;
    };
  }, [active]);

  // Drive ambient based on (enabled, ready, active).
  useEffect(() => {
    const ambient = ambientRef.current;
    if (!ambient || !active) return;
    if (enabled && ready) {
      if (!ambient.playing()) ambient.play();
      ambient.fade(ambient.volume(), AMBIENT_VOLUME, AMBIENT_FADE_MS);
    } else if (ambient.playing()) {
      const currentVolume = ambient.volume();
      ambient.fade(currentVolume, 0, AMBIENT_FADE_MS);
      // Stop after fade so we can resume cleanly later.
      window.setTimeout(() => {
        if (ambient.volume() === 0) ambient.stop();
      }, AMBIENT_FADE_MS + 50);
    }
  }, [enabled, ready, active]);

  const toggle = useCallback(() => {
    if (!active) return;
    setEnabled((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        window.localStorage.setItem(SOUND_STORAGE_KEY, String(next));
      }
      return next;
    });
  }, [active]);

  const play = useCallback(
    (id: SoundId) => {
      if (!active || !enabled || !ready) return;
      const target = id === "hover" ? hoverRef.current : clickRef.current;
      target?.play();
    },
    [active, enabled, ready],
  );

  const value = useMemo<SoundContextValue>(
    () => ({ enabled, ready, active, toggle, play }),
    [enabled, ready, active, toggle, play],
  );

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

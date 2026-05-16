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
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  MOBILE_BREAKPOINT_QUERY,
  SOUND_STORAGE_KEY,
  type SoundContextValue,
  type SoundId,
} from "./types";

export const SoundContext = createContext<SoundContextValue | null>(null);

// === Volume knobs ===========================================================
// Each sound has its own 0..1 volume. Tweak freely.
const AMBIENT_VOLUME = 1.0;
const HOVER_VOLUME = 0.25;
const CLICK_VOLUME = 0.3;
// ============================================================================

const AMBIENT_FADE_MS = 400;

// useSyncExternalStore subscribe that never fires (we don't track resize).
const noopSubscribe = () => () => {};

function getClientActive(): boolean {
  if (typeof window === "undefined") return false;
  return !window.matchMedia(MOBILE_BREAKPOINT_QUERY).matches;
}

function getInitialEnabled(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia(MOBILE_BREAKPOINT_QUERY).matches) return false;
  const stored = window.localStorage.getItem(SOUND_STORAGE_KEY);
  if (stored === "true") return true;
  if (stored === "false") return false;
  // No stored preference: default ON. Browser autoplay policy still requires
  // a user gesture before ambient produces sound, so practically this means
  // sound starts on the very first hover/click anywhere on the page.
  return true;
}

// Selector for elements that should auto-play hover/click sounds via delegation.
const SOUNDABLE_SELECTOR = "button, a[href], [role='button']";

function findSoundableTarget(event: Event): HTMLElement | null {
  const path = event.composedPath();
  for (const node of path) {
    if (!(node instanceof HTMLElement)) continue;
    if (node.dataset.soundIgnore === "true") return null;
    if (node.matches(SOUNDABLE_SELECTOR)) return node;
  }
  return null;
}

export function SoundProvider({ children }: { children: ReactNode }) {
  // `active` via useSyncExternalStore — SSR sees false consistently, client
  // computes the real value AFTER hydration, avoiding a hydration mismatch.
  // Subscribe is no-op because spec says mount-only decision.
  const active = useSyncExternalStore(noopSubscribe, getClientActive, () => false);
  const [enabled, setEnabled] = useState<boolean>(getInitialEnabled);
  const [ready, setReady] = useState(false);

  const ambientRef = useRef<Howl | null>(null);
  const hoverRef = useRef<Howl | null>(null);
  const clickRef = useRef<Howl | null>(null);
  // Refs mirror state so the document-level delegation handlers can read the
  // latest values without being re-attached on every state change.
  const enabledRef = useRef(enabled);
  const readyRef = useRef(ready);

  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);
  useEffect(() => {
    readyRef.current = ready;
  }, [ready]);

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
      volume: HOVER_VOLUME,
      preload: true,
    });
    clickRef.current = new Howl({
      src: ["/sounds/click.mp3"],
      volume: CLICK_VOLUME,
      preload: true,
    });

    const onFirstGesture = () => {
      const ctx = Howler.ctx;
      if (ctx && ctx.state === "suspended") void ctx.resume();
      setReady(true);
      window.removeEventListener("pointerdown", onFirstGesture);
      window.removeEventListener("keydown", onFirstGesture);
    };
    window.addEventListener("pointerdown", onFirstGesture, { once: true });
    window.addEventListener("keydown", onFirstGesture, { once: true });

    // Track the soundable element the cursor currently hovers. We only fire
    // hover.mp3 when the cursor actually crosses INTO a new soundable element,
    // not when it moves between children of the same one.
    let hoverTarget: HTMLElement | null = null;
    const onPointerDown = (e: PointerEvent) => {
      if (!enabledRef.current) return;
      const t = findSoundableTarget(e);
      if (!t) return;
      const ctx = Howler.ctx;
      if (ctx && ctx.state === "suspended") void ctx.resume();
      clickRef.current?.play();
    };
    const onMouseOver = (e: MouseEvent) => {
      if (!enabledRef.current || !readyRef.current) return;
      const t = findSoundableTarget(e);
      if (!t) return;
      // If we're crossing inside the same soundable element (between its
      // children), don't replay.
      if (t === hoverTarget) return;
      // If we're coming from within the same soundable (related is inside t),
      // we never actually left it — don't replay.
      const related = e.relatedTarget;
      if (related instanceof Node && t.contains(related)) return;
      hoverTarget = t;
      hoverRef.current?.play();
    };
    const onMouseOut = (e: MouseEvent) => {
      if (!hoverTarget) return;
      // Only clear when the cursor truly leaves the current hover target
      // (relatedTarget is null or outside of it). Movement to a child element
      // counts as "still hovering" and must not clear.
      const related = e.relatedTarget;
      if (related instanceof Node && hoverTarget.contains(related)) return;
      hoverTarget = null;
    };

    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("mouseover", onMouseOver, true);
    document.addEventListener("mouseout", onMouseOut, true);

    return () => {
      window.removeEventListener("pointerdown", onFirstGesture);
      window.removeEventListener("keydown", onFirstGesture);
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("mouseover", onMouseOver, true);
      document.removeEventListener("mouseout", onMouseOut, true);
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

  // Imperative play() is kept on the context for components that genuinely
  // want to trigger a sound on a non-interactive element. Most buttons now
  // get sound for free via the document-level delegation above.
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

# Portfolio Audio System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an opt-in audio layer to the portfolio — one ambient background loop plus hover/click feedback on primary interactive elements. Default state is muted; a corner toggle persists preference to localStorage. Mobile (viewport < 768px) is fully short-circuited: nothing loads, nothing renders.

**Architecture:** A React Context (`SoundProvider`) owns Howler.js instances and exposes `play()` / `toggle()` via a `useSound()` hook. A `<SoundToggle>` button (fixed bottom-right) flips the enabled state and fades ambient in/out. The provider mounts a one-shot first-gesture listener so ambient can start without an explicit Enter gate. Mobile guard runs on mount only — if the viewport is narrow, the provider returns null children for the toggle and `play` becomes a no-op.

**Tech Stack:** Next.js 16 (App Router), React 19, Howler.js 2.x, TypeScript.

**Reference spec:** `docs/superpowers/specs/2026-05-16-portfolio-audio-system-design.md`

**Testing note:** This project's `npm test` exists but the codebase has no `*.test.mts` files yet, and Howler interacts heavily with the DOM `AudioContext` which is impractical to mock. We rely on `npm run check` (lint + typecheck + build) plus manual verification against a documented scenario list. Each task that touches UI ends with a manual verification step run from the dev server. This deviates from strict TDD; the spec explicitly accepted this tradeoff.

---

## File Map

**New files:**
- `src/lib/sound/types.ts` — shared types
- `src/lib/sound/SoundProvider.tsx` — Context provider + Howler lifecycle
- `src/lib/sound/useSound.ts` — consumer hook
- `src/lib/sound/index.ts` — re-exports
- `src/components/SoundToggle.tsx` — corner UI
- `public/sounds/ambient.mp3` — ambient loop
- `public/sounds/hover.mp3` — short hover blip
- `public/sounds/click.mp3` — short click pop
- `public/sounds/CREDITS.md` — license/source notes

**Modified files:**
- `src/app/layout.tsx` — wrap children in `SoundProvider`, render `SoundToggle`
- `src/components/SiteChrome.tsx` — wire hover/click to top-pill buttons, menu drawer links, bottom thumb strip
- `src/components/ContactPopover.tsx` — wire hover/click to its trigger button
- `package.json` / `package-lock.json` — add `howler` + `@types/howler`

**Decided positioning:** `SiteChrome` uses a centered top pill (`top-3`) and a centered bottom thumbnail strip (`bottom-3`). The bottom-right corner is clear, so `SoundToggle` lives at `fixed bottom: 16px; right: 16px` with no collisions.

---

## Task 1: Install Howler.js

**Files:**
- Modify: `package.json`, `package-lock.json`

- [ ] **Step 1: Install runtime + types**

```bash
npm install howler@^2.2.4 @types/howler@^2.2.12
```

- [ ] **Step 2: Verify install**

```bash
node -e "console.log(require('howler').Howl ? 'ok' : 'fail')"
```

Expected output: `ok`

- [ ] **Step 3: Typecheck still passes**

```bash
npm run typecheck
```

Expected: exits 0, no errors.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: 添加 howler.js 用于音频系统

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 2: Source and place audio files

**Files:**
- Create: `public/sounds/ambient.mp3`
- Create: `public/sounds/hover.mp3`
- Create: `public/sounds/click.mp3`
- Create: `public/sounds/CREDITS.md`

- [ ] **Step 1: Create the sounds directory**

```bash
mkdir -p public/sounds
```

- [ ] **Step 2: Acquire three mp3 files**

Find 3 mp3 files matching these specs. Both Pixabay (https://pixabay.com/sound-effects/) and freesound.org with the CC0 filter are acceptable; both allow commercial use without attribution. Pixabay is preferred for ease — no account, no API key.

Requirements:

| Target path | Character | Duration | Target size |
|---|---|---|---|
| `public/sounds/ambient.mp3` | Soft ambient pad / drone, no melody, no strong rhythm, no abrupt start/end (so it loops cleanly) | 15–30s | ≤ 200KB |
| `public/sounds/hover.mp3` | Short UI blip / tick / pop, neutral pitch, no reverb tail | 60–200ms | ≤ 10KB |
| `public/sounds/click.mp3` | Short UI click, slightly more "thud" than hover so they're distinguishable | 80–250ms | ≤ 10KB |

Suggested Pixabay search URLs:
- Ambient: https://pixabay.com/sound-effects/search/ambient%20pad%20loop/
- Hover: https://pixabay.com/sound-effects/search/ui%20blip/
- Click: https://pixabay.com/sound-effects/search/ui%20click/

Save each at the exact target path. Rename freely — only the destination filename matters.

- [ ] **Step 3: Verify file sizes and that they play**

```bash
ls -lh public/sounds/*.mp3
afplay public/sounds/ambient.mp3 &
sleep 3 && killall afplay
afplay public/sounds/hover.mp3
afplay public/sounds/click.mp3
```

Expected: three files exist with sizes within targets above. Each plays audibly. Ambient sounds like a sustained pad (no melody bursting in); hover sounds shorter/lighter than click.

If any file fails the character check, replace it before continuing.

- [ ] **Step 4: Write the credits file**

Create `public/sounds/CREDITS.md` with this template, filling in the actual source URLs:

```markdown
# Audio Credits

Sounds in this directory are CC0 / Pixabay Content License — free for commercial use, no attribution required. Sources recorded here for traceability.

| File | Source URL | License |
|---|---|---|
| ambient.mp3 | <URL of the Pixabay/freesound page you downloaded from> | <CC0 / Pixabay Content License> |
| hover.mp3 | <URL> | <license> |
| click.mp3 | <URL> | <license> |

Replacement policy: you can swap any file at the same path; no code changes required.
```

- [ ] **Step 5: Commit**

```bash
git add public/sounds/
git commit -m "feat: 添加音频素材（ambient/hover/click）

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 3: Create the sound types module

**Files:**
- Create: `src/lib/sound/types.ts`

- [ ] **Step 1: Write the types file**

```ts
// src/lib/sound/types.ts

export type SoundId = "hover" | "click";

export type SoundContextValue = {
  /** User-facing toggle state. True = sounds may play. */
  enabled: boolean;
  /** True once Howler instances are created AND first user gesture has occurred. */
  ready: boolean;
  /** True when the provider has decided this device should run audio. False on mobile. */
  active: boolean;
  /** Flip enabled. Fades ambient in/out. Persists to localStorage. */
  toggle: () => void;
  /** Play a one-shot effect. No-op when disabled, not ready, or inactive. */
  play: (id: SoundId) => void;
};

export const SOUND_STORAGE_KEY = "portfolio:sound-enabled";
export const MOBILE_BREAKPOINT_QUERY = "(max-width: 767px)";
```

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```

Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add src/lib/sound/types.ts
git commit -m "feat: 添加音频系统类型定义

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 4: Create the SoundProvider

**Files:**
- Create: `src/lib/sound/SoundProvider.tsx`

- [ ] **Step 1: Write the provider**

```tsx
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

export function SoundProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);

  const ambientRef = useRef<Howl | null>(null);
  const hoverRef = useRef<Howl | null>(null);
  const clickRef = useRef<Howl | null>(null);

  // Decide once on mount: mobile = inactive, no Howler at all.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia(MOBILE_BREAKPOINT_QUERY).matches) {
      setActive(false);
      return;
    }
    setActive(true);

    const stored = window.localStorage.getItem(SOUND_STORAGE_KEY);
    if (stored === "true") setEnabled(true);

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
  }, []);

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
```

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```

Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add src/lib/sound/SoundProvider.tsx
git commit -m "feat: 实现 SoundProvider（Howler 生命周期 + 首手势解锁）

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 5: Create the useSound hook

**Files:**
- Create: `src/lib/sound/useSound.ts`
- Create: `src/lib/sound/index.ts`

- [ ] **Step 1: Write the hook**

```ts
// src/lib/sound/useSound.ts
"use client";

import { useContext } from "react";
import { SoundContext } from "./SoundProvider";
import type { SoundContextValue, SoundId } from "./types";

const NOOP_VALUE: SoundContextValue = {
  enabled: false,
  ready: false,
  active: false,
  toggle: () => {},
  play: (_id: SoundId) => {
    void _id;
  },
};

/**
 * Returns the sound context. When called outside a SoundProvider (SSR, mobile
 * short-circuit, or tests), returns a safe no-op object so leaf components
 * don't need null checks.
 */
export function useSound(): SoundContextValue {
  return useContext(SoundContext) ?? NOOP_VALUE;
}
```

- [ ] **Step 2: Write the index re-exports**

```ts
// src/lib/sound/index.ts
export { SoundProvider } from "./SoundProvider";
export { useSound } from "./useSound";
export type { SoundContextValue, SoundId } from "./types";
```

- [ ] **Step 3: Typecheck**

```bash
npm run typecheck
```

Expected: exits 0.

- [ ] **Step 4: Commit**

```bash
git add src/lib/sound/useSound.ts src/lib/sound/index.ts
git commit -m "feat: 添加 useSound hook 及统一导出

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 6: Create the SoundToggle component

**Files:**
- Create: `src/components/SoundToggle.tsx`

- [ ] **Step 1: Write the component**

```tsx
// src/components/SoundToggle.tsx
"use client";

import { useSound } from "@/lib/sound";

export function SoundToggle() {
  const { enabled, active, toggle, play } = useSound();

  if (!active) return null;

  const handleClick = () => {
    // Play click on the activating gesture before flipping state.
    if (enabled) play("click");
    toggle();
  };

  return (
    <button
      type="button"
      aria-label={enabled ? "关闭声音" : "开启声音"}
      aria-pressed={enabled}
      onClick={handleClick}
      onMouseEnter={() => play("hover")}
      style={{
        position: "fixed",
        right: 16,
        bottom: 16,
        zIndex: 60,
        width: 40,
        height: 40,
        display: "grid",
        placeItems: "center",
        borderRadius: 9999,
        background: "rgba(23, 23, 23, 0.85)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        color: "#fff",
        cursor: "pointer",
        transition: "background-color 200ms ease, transform 200ms ease",
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = "scale(0.94)";
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      {enabled ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M4 9v6h4l5 4V5L8 9H4Z"
            fill="currentColor"
          />
          <path
            d="M16 8a5 5 0 0 1 0 8M18.5 5.5a9 9 0 0 1 0 13"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M4 9v6h4l5 4V5L8 9H4Z"
            fill="currentColor"
          />
          <path
            d="m16 9 5 6m0-6-5 6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      )}
    </button>
  );
}
```

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```

Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/SoundToggle.tsx
git commit -m "feat: 添加 SoundToggle 角落按钮

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 7: Wire SoundProvider + SoundToggle into layout

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Update the layout to mount the provider and toggle**

Open `src/app/layout.tsx` and apply two edits.

First, add the imports near the existing component imports (after the `ContactModal` import line):

```tsx
import { SoundProvider } from "@/lib/sound";
import { SoundToggle } from "@/components/SoundToggle";
```

Then change the `<body>` block from:

```tsx
<body className="fonts-ready">
  <ContactModalProvider>{children}</ContactModalProvider>
  <AnalyticsTracker />
  <ClarityScript />
</body>
```

to:

```tsx
<body className="fonts-ready">
  <SoundProvider>
    <ContactModalProvider>{children}</ContactModalProvider>
    <SoundToggle />
  </SoundProvider>
  <AnalyticsTracker />
  <ClarityScript />
</body>
```

- [ ] **Step 2: Typecheck + build**

```bash
npm run typecheck && npm run build
```

Expected: both exit 0.

- [ ] **Step 3: Manual verification on dev server**

```bash
npm run dev
```

Then open `http://localhost:3000` in a desktop browser at viewport width > 768px and verify:

1. A round dark button is visible at the bottom-right corner.
2. The button does NOT overlap the bottom thumbnail strip (which is centered).
3. Clicking the button: ambient loop fades in within ~400ms. Button icon flips to "speaker on" (no slash).
4. Open DevTools → Network → filter by `mp3`. Three requests visible: `ambient.mp3`, `hover.mp3`, `click.mp3`.
5. Open DevTools → Application → Local Storage. Key `portfolio:sound-enabled` = `"true"`.
6. Hard-refresh the page. Network shows the mp3s loading again. Button shows the "enabled" icon, but ambient is silent until you click anywhere — then ambient starts.
7. Click the toggle again: ambient fades out cleanly within ~500ms. localStorage flips to `"false"`.
8. Resize browser to width < 768px and hard-refresh: toggle button is GONE; no `/sounds/*.mp3` requests in Network.

If any check fails, stop and diagnose before continuing.

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: 在 layout 挂载 SoundProvider 与 SoundToggle

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 8: Wire hover/click sounds into SiteChrome

**Files:**
- Modify: `src/components/SiteChrome.tsx`

Targets in this file: the menu button, the contact icon button (the trigger inside `ContactPopover`), each link in the drawer menu, and each thumbnail in the bottom strip.

- [ ] **Step 1: Add the hook import**

At the top of `src/components/SiteChrome.tsx`, after the existing imports, add:

```tsx
import { useSound } from "@/lib/sound";
```

- [ ] **Step 2: Call the hook inside the component**

Inside `export function SiteChrome(...)`, immediately after the `const isLight = variant === "light";` line, add:

```tsx
const { play } = useSound();
```

- [ ] **Step 3: Wire the menu toggle button**

Find the button rendered as `<button aria-label={menuOpen ? "Close menu" : "Open menu"} ...>` and add `onMouseEnter` + extend `onClick`:

Before:

```tsx
<button
  aria-label={menuOpen ? "Close menu" : "Open menu"}
  onClick={() => setMenuOpen((v) => !v)}
  className={`grid h-10 w-10 place-items-center rounded-full transition-colors ${hoverBtn}`}
>
```

After:

```tsx
<button
  aria-label={menuOpen ? "Close menu" : "Open menu"}
  onMouseEnter={() => play("hover")}
  onClick={() => {
    play("click");
    setMenuOpen((v) => !v);
  }}
  className={`grid h-10 w-10 place-items-center rounded-full transition-colors ${hoverBtn}`}
>
```

- [ ] **Step 4: Wire the contact icon button (inside ContactPopover)**

Find the `<button aria-label="Contact" ...>` button. Note this one has no existing `onClick` (ContactPopover wraps it). Add only `onMouseEnter`:

Before:

```tsx
<button
  aria-label="Contact"
  className={`grid h-10 w-10 place-items-center rounded-full transition-colors ${hoverBtn}`}
>
```

After:

```tsx
<button
  aria-label="Contact"
  onMouseEnter={() => play("hover")}
  className={`grid h-10 w-10 place-items-center rounded-full transition-colors ${hoverBtn}`}
>
```

(Click sound for this button will be added in Task 9 when we touch `ContactPopover`.)

- [ ] **Step 5: Wire the drawer menu links (both NAV_ITEMS and caseStudies blocks)**

Two `<Link>` elements need the same treatment. For the `NAV_ITEMS.map(...)` block, change:

Before:

```tsx
<Link
  href={item.href ?? "#"}
  className={`...`}
  style={{ color: menuItemColor(isActive) }}
  onClick={() => setMenuOpen(false)}
>
```

After:

```tsx
<Link
  href={item.href ?? "#"}
  className={`...`}
  style={{ color: menuItemColor(isActive) }}
  onMouseEnter={() => play("hover")}
  onClick={() => {
    play("click");
    setMenuOpen(false);
  }}
>
```

(Keep the existing className expression untouched — only adding the two handlers.)

For the `caseStudies.map(...)` block, change:

Before:

```tsx
<Link
  key={cs.slug}
  href={cs.href}
  className={`...`}
  style={{ color: menuItemColor(isActive) }}
  onClick={() => setMenuOpen(false)}
>
```

After:

```tsx
<Link
  key={cs.slug}
  href={cs.href}
  className={`...`}
  style={{ color: menuItemColor(isActive) }}
  onMouseEnter={() => play("hover")}
  onClick={() => {
    play("click");
    setMenuOpen(false);
  }}
>
```

- [ ] **Step 6: Wire the bottom thumbnail strip buttons**

Find the `thumbs.map(...)` block. Change the `<button>` from:

Before:

```tsx
<button
  key={i}
  ref={(el) => { itemRefs.current[i] = el; }}
  onClick={() => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: (max * i) / Math.max(1, thumbs.length - 1), behavior: "smooth" });
  }}
  style={{ width: w, height: h }}
  className={`relative shrink-0 overflow-hidden rounded-md transition ${isActive ? "opacity-100" : "opacity-60 hover:opacity-90"}`}
  aria-label={`Jump to image ${i + 1}`}
>
```

After:

```tsx
<button
  key={i}
  ref={(el) => { itemRefs.current[i] = el; }}
  onMouseEnter={() => play("hover")}
  onClick={() => {
    play("click");
    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: (max * i) / Math.max(1, thumbs.length - 1), behavior: "smooth" });
  }}
  style={{ width: w, height: h }}
  className={`relative shrink-0 overflow-hidden rounded-md transition ${isActive ? "opacity-100" : "opacity-60 hover:opacity-90"}`}
  aria-label={`Jump to image ${i + 1}`}
>
```

- [ ] **Step 7: Typecheck + build**

```bash
npm run typecheck && npm run build
```

Expected: both exit 0.

- [ ] **Step 8: Manual verification on dev server**

`npm run dev`, open `http://localhost:3000`, click the corner toggle to enable sound, then verify each interaction:

1. Hover the menu (hamburger) button → hover blip.
2. Click the menu button → click pop, drawer opens.
3. Inside the drawer, hover each menu item → hover blip per item.
4. Click any menu item → click pop, drawer closes.
5. Hover the contact icon button → hover blip.
6. Scroll the page down until the bottom thumbnail strip appears. Hover any thumbnail → hover blip. Click any thumbnail → click pop + smooth scroll.
7. Resize to mobile width and hard-refresh: hovering any of these elements produces NO sound (toggle should also be gone).

- [ ] **Step 9: Commit**

```bash
git add src/components/SiteChrome.tsx
git commit -m "feat: 给 SiteChrome 的导航与缩略图按钮接入 hover/click 音效

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 9: Wire hover/click sound into ContactPopover trigger

**Files:**
- Modify: `src/components/ContactPopover.tsx`

The popover renders an interactive trigger that wraps arbitrary children (the contact icon button in SiteChrome, the CTA button in CtaBlock). We attach hover + click on the popover's own click/hover handler so every consumer benefits.

- [ ] **Step 1: Read the file to confirm structure**

Use the Read tool on `src/components/ContactPopover.tsx`. Note the existing `handleToggle` on line ~75 — that's where to add the click sound. Confirm the file has a `"use client"` directive at the top (it must already, since it has interactive state).

- [ ] **Step 2: Add the hook import**

At the top of `src/components/ContactPopover.tsx`, alongside other imports, add:

```tsx
import { useSound } from "@/lib/sound";
```

- [ ] **Step 3: Use the hook and wire it into `handleToggle`**

Inside the component, near the top of the function body where other hooks like `useState` are called, add:

```tsx
const { play } = useSound();
```

Then find `handleToggle` (around line 75). Whatever its current body, add `play("click")` as the first line of the function, BEFORE any existing state mutation:

Example (your actual handleToggle body may differ — preserve its existing logic, only prepend the play call):

```tsx
const handleToggle = () => {
  play("click");
  // ... existing logic unchanged
};
```

- [ ] **Step 4: Attach hover to the trigger element**

Locate the JSX element whose `onClick` is `handleToggle` (around line 75). Add `onMouseEnter={() => play("hover")}` to that same element. Keep all other props intact.

If the trigger is a button:

```tsx
<button onClick={handleToggle} onMouseEnter={() => play("hover")} ...>
```

If the trigger is a non-button wrapper (e.g., a `<span>` or `<div>` with role), apply the same handler additions:

```tsx
<div onClick={handleToggle} onMouseEnter={() => play("hover")} ...>
```

- [ ] **Step 5: Typecheck + build**

```bash
npm run typecheck && npm run build
```

Expected: both exit 0.

- [ ] **Step 6: Manual verification on dev server**

`npm run dev`. Enable sound via the corner toggle. Then:

1. Hover the contact icon button in the top pill → hover blip (already wired in Task 8, now confirms no conflict).
2. Click the contact icon button → click pop, popover opens.
3. If CtaBlock is reachable in any page or sub-route — hover/click the "与我联系" button there should also fire hover + click sounds (CtaBlock wraps its CTA in `<ContactPopover>`, so it benefits automatically).

- [ ] **Step 7: Commit**

```bash
git add src/components/ContactPopover.tsx
git commit -m "feat: ContactPopover 触发器接入 hover/click 音效

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 10: Final end-to-end verification

**Files:** none modified

- [ ] **Step 1: Full check passes**

```bash
npm run check
```

Expected: lint + typecheck + build all exit 0.

- [ ] **Step 2: Run the full manual scenario list**

Start `npm run dev`. In a desktop browser (incognito so localStorage is clean):

1. ☐ Fresh load: page silent, corner toggle visible in muted state, no mp3 requests until you click anything? (Spec says mp3 should be preloaded by Howler — so they DO load immediately on desktop. That's fine. What you're verifying is that **no audio plays**.)
2. ☐ Click toggle: ambient fades in within ~400ms, click sound plays.
3. ☐ Hover any wired button (menu / contact icon / drawer item / thumbnail) → hover blip.
4. ☐ Click any wired button → click pop.
5. ☐ Reload the page: toggle remembers enabled state. Ambient does NOT auto-play. After any click/key gesture, ambient starts.
6. ☐ Click toggle off: ambient fades out within ~500ms. Hover/click sounds stop firing.
7. ☐ Reload again: toggle remembers disabled state. No ambient plays. (Howler preloads the mp3s regardless — that's fine; we're verifying playback, not network traffic, on desktop.)
8. ☐ Mobile viewport (DevTools responsive mode, 375px width), hard-reload: corner toggle is gone. Hover/click any element → no sound. Network tab: zero `/sounds/*.mp3` requests.
9. ☐ Console has no errors or warnings related to Howler.

- [ ] **Step 3: Tag the completion in git log**

```bash
git log --oneline -10
```

Expected: at least 8 commits from this plan (Tasks 1–9 each produced one). If any task was skipped or merged, that's fine as long as functionality verified above passes.

- [ ] **Step 4: Update CLAUDE.md with a one-line note about the audio system**

Open `CLAUDE.md`. In the "Architecture" section, add this line just after the "Section structure" code block (immediately before the "Data layer" section):

```markdown
**Audio system (`src/lib/sound/`):** Optional opt-in audio layer (ambient + hover/click via Howler.js). Default muted, toggle in bottom-right corner, preference in `localStorage['portfolio:sound-enabled']`, fully disabled on mobile (viewport < 768px). Files at `public/sounds/*.mp3`.
```

- [ ] **Step 5: Final commit**

```bash
git add CLAUDE.md
git commit -m "docs: 在 CLAUDE.md 中记录音频系统

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Done criteria

- All 10 tasks' commits exist.
- `npm run check` exits 0.
- Manual scenarios 1–9 in Task 10 all pass.
- Mobile viewport produces zero audio-related network requests and zero audio-related DOM nodes.
- `CLAUDE.md` mentions the audio system.

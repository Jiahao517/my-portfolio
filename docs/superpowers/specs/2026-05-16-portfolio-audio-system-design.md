# Portfolio Audio System (Plan A) — Design

**Date:** 2026-05-16
**Status:** Draft for review
**Reference:** Inspired by pacomepertant.com (Howler.js-based, 16 audio files, full-screen Enter gate). This project adopts a stripped-down version: 3 sounds, no Enter gate, corner toggle.

## Goal

Add a lightweight, opt-in audio layer to the portfolio:

- One ambient background loop
- Hover sound on interactive primary elements
- Click sound on primary actions
- Default state is **muted**. User opts in via a small corner button. Preference persists across visits.

The system must degrade gracefully (no errors if audio fails to load, no UI block before first user interaction, no autoplay violations).

## Non-goals

- Per-section identity sounds (case-study cards, ContactAI, etc.) — that's Plan B.
- Random variant pools (smiley1-4 style) — Plan C.
- Volume slider — single mute toggle only.
- Authoring our own audio — we use CC0 placeholders from freesound.org / Pixabay; user can swap files later without code changes.

## User-facing behavior

1. **First visit:** page loads silently. A small speaker-icon button sits fixed in the bottom-right corner (above the existing ContactAI floating chrome — needs coordination, see "Integration" below).
2. **User clicks the toggle:** ambient loop fades in over ~400ms; toggle icon flips to "speaker on"; localStorage records `portfolio:sound-enabled = "true"`.
3. **While enabled:** hovering nav links / primary buttons plays a short blip; clicking primary buttons plays a click sound.
4. **User clicks toggle again:** ambient fades out, hover/click sounds stop firing, localStorage flips to `"false"`.
5. **Return visit:** preference is read from localStorage. If `"true"`, the toggle shows enabled state — but ambient does NOT auto-start until the user produces any gesture on the page (click, key, etc.). This satisfies browser autoplay policy without a full-screen gate.
6. **Mobile (viewport < 768px):** toggle is still rendered, but ambient defaults to off even if localStorage says on (hover sounds are meaningless on touch). Click sounds still play when enabled.

## Architecture

Three pieces:

### 1. `src/lib/sound/SoundProvider.tsx` — React context

Owns the Howler instances and exposes state via context.

```ts
type SoundContextValue = {
  enabled: boolean;          // user toggle state
  ready: boolean;            // Howler loaded + first gesture seen
  toggle: () => void;        // flip enabled, fade ambient, persist
  play: (id: SoundId) => void; // play one-shot ('hover' | 'click')
};
type SoundId = 'hover' | 'click';
```

- Loads `ambient`, `hover`, `click` via Howler on mount (preload, low priority).
- Listens for the first user gesture (`pointerdown` / `keydown`) once globally, sets `ready = true`. Required because browsers block `AudioContext.resume()` until a gesture exists.
- When `enabled && ready`, calls `ambient.play()` with fade-in. When `enabled` flips off, fades out.
- Reads `localStorage['portfolio:sound-enabled']` on mount. Writes on toggle.
- Mobile guard: if `window.matchMedia('(max-width: 768px)').matches`, force `enabled = false` on mount regardless of stored value.

### 2. `src/lib/sound/useSound.ts` — Hook

Thin wrapper around `useContext`. Returns `{ play, enabled, toggle }`. Leaf components call `play('hover')` from `onMouseEnter`, `play('click')` from `onClick`.

If the provider is absent (e.g., during SSR), `play` is a no-op. No error.

### 3. `src/components/SoundToggle.tsx` — UI

Fixed corner button. Two SVG icons (speaker / speaker-muted). Animated icon swap. Click calls `toggle()` and itself produces a `click` sound when turning on.

Position: bottom-right, offset to avoid colliding with the existing `ContactPopover` floating button. Specifics:

- Desktop: `position: fixed; bottom: 24px; right: 24px` — but `ContactPopover` likely lives there. Move the sound toggle to `bottom: 24px; right: 88px` (left of contact button) OR stack vertically `bottom: 88px; right: 24px`. Decide during implementation by reading `ContactPopover.tsx`. Document the decision in the plan.
- Mobile: same offset rules adapted to existing mobile chrome.

The toggle is part of `SiteChrome` (or rendered next to it in `layout.tsx`).

## Audio files

Stored in `public/sounds/`:

- `ambient.mp3` — soft pad/drone loop, ~15-30s, ~80-150KB. Looping seamlessly.
- `hover.mp3` — short tick/blip, ~80-200ms, ~3-8KB.
- `click.mp3` — short click/pop, ~80-200ms, ~3-8KB.

**Format choice:** mp3 only (not ogg). Universal browser support, simpler than the dual-format fallback. Modern mp3 encoders produce files small enough that the ogg savings don't justify the complexity.

**Sourcing:** I will fetch 3 CC0 files from freesound.org or Pixabay during implementation. Filenames are stable so the user can drop in replacements without touching code. The plan will include the exact source URLs and license notes in `public/sounds/CREDITS.md`.

## Integration points

Files to touch:

- `src/app/layout.tsx` — wrap children in `<SoundProvider>`, render `<SoundToggle>` near existing chrome.
- `src/components/SiteChrome.tsx` — possibly the right home for `<SoundToggle>`. Verify during implementation.
- `src/components/Sidebar.tsx` (if it exists — `SiteChrome` may contain it) — attach `onMouseEnter={() => play('hover')}` to nav links.
- `src/components/CtaBlock.tsx` — primary CTA buttons get hover + click.
- `src/components/HeroBio.tsx` — primary buttons get hover + click.
- `src/components/ContactPopover.tsx` — coordinate position with `<SoundToggle>`.

**Out of scope for this plan:** ContactAI message-send sounds, case-study card hover sounds, section-enter sounds. Those are Plan B follow-ups.

## Error handling

- **Audio file 404 / decode failure:** Howler logs an error, `play()` becomes a no-op for that id. Toggle still works for the others. No UI error surfaced.
- **AudioContext blocked:** until first gesture, `ambient.play()` is queued. The "first gesture" listener handles this transparently.
- **Reduced motion / accessibility:** respect `prefers-reduced-motion: reduce` — when set, default to muted and persist that. (We don't disable the toggle; user can still opt in.)

## Persistence

- `localStorage` key: `portfolio:sound-enabled`
- Values: `"true"` | `"false"` | absent (treated as `false`)

## Testing

- **Manual:**
  - Fresh load (incognito) → silent, toggle visible.
  - Click toggle → ambient fades in, click sound plays.
  - Hover sidebar nav → hover blip.
  - Reload → toggle remembers, but ambient waits for first gesture.
  - Mobile viewport → ambient stays off even when enabled stored as true.
  - Toggle off → ambient fades out cleanly.
- **Automated:** `npm run check` (lint + typecheck + build). No new unit tests — Howler interactions are hard to mock and the value/cost ratio is low.

## Bundle impact

- `howler` package: ~30KB minified+gzipped.
- 3 mp3 files: ~100-200KB total, loaded lazily.
- Net cost is acceptable for a portfolio site.

## Risks

- **iOS Safari quirks:** AudioContext on iOS sometimes needs explicit `Howler.ctx.resume()` inside a gesture handler. Implementation should call this in the toggle's `onClick` to be safe.
- **ContactPopover collision:** if the corner button conflicts, the implementation pass will adjust positioning. Documented above.
- **Free audio quality:** placeholders from free libraries may sound generic. User can replace files without code changes — this is by design.

## Open questions

None blocking. Audio file selection happens during implementation; user will hear them on the dev server before commit.

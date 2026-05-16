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

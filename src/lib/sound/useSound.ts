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

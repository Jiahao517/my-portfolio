"use client";

import { useEffect, useState } from "react";

function isProbeInside(rect: DOMRect, probeY: number) {
  return rect.top <= probeY && rect.bottom >= probeY;
}

export function useNavTheme() {
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  useEffect(() => {
    const updateTheme = () => {
      const darkSections = document.querySelectorAll<HTMLElement>(".hero-video, .art-footer");
      const probeY = 48;

      const isDark = Array.from(darkSections).some((section) =>
        isProbeInside(section.getBoundingClientRect(), probeY),
      );

      setIsDarkTheme(isDark);
    };

    updateTheme();
    window.addEventListener("scroll", updateTheme, { passive: true });
    window.addEventListener("resize", updateTheme);

    return () => {
      window.removeEventListener("scroll", updateTheme);
      window.removeEventListener("resize", updateTheme);
    };
  }, []);

  return isDarkTheme;
}

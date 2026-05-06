"use client";

import { useEffect, useRef, useState } from "react";

type CaseFloatingVideoProps = {
  src: string;
};

export function CaseFloatingVideo({ src }: CaseFloatingVideoProps) {
  const [controlsVisible, setControlsVisible] = useState(false);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.volume = 0.8;
    void video.play().catch(() => {
      // Browsers may defer autoplay until the video is near the viewport.
    });
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      void video.play();
    } else {
      video.pause();
    }
  };

  const hasHover = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  return (
    <div
      className="relative overflow-hidden bg-neutral-950"
      onBlur={() => {
        if (hasHover()) setControlsVisible(false);
      }}
      onFocus={() => setControlsVisible(true)}
      onMouseEnter={() => setControlsVisible(true)}
      onMouseLeave={() => {
        if (hasHover()) setControlsVisible(false);
      }}
      onTouchStart={() => setControlsVisible(true)}
    >
      <video
        ref={videoRef}
        className="block h-auto w-full cursor-pointer"
        src={src}
        autoPlay
        controls={controlsVisible}
        muted={muted}
        loop
        playsInline
        preload="metadata"
        onClick={togglePlay}
        onVolumeChange={(event) => setMuted(event.currentTarget.muted)}
      />
    </div>
  );
}

"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { useMouseTilt } from "@/lib/useMouseTilt";
import type { CaseStudy } from "@/types/portfolio";

function CaseStudyCard({ cs }: { cs: CaseStudy }) {
  return (
    <div className="case-study">
      <div className="case-study__header">
        <div className="case-study__text">
          <h2 className="case-study__title shiny-hover">{cs.title}</h2>
          <p className="case-study__caption">
            <span className="case-study__caption-desc">{cs.caption}</span>
            <span className="case-study__caption-dot">&nbsp;・&nbsp;</span>
            <span className="case-study__caption-year">{cs.year}</span>
          </p>
        </div>
        <div className="case-study__buttons case-study__buttons--desktop">
          <Link
            href={cs.href}
            target={cs.externalHref ? "_blank" : undefined}
            rel={cs.externalHref ? "noopener noreferrer" : undefined}
            className="case-study__btn"
          >
            <span>{cs.ctaLabel}</span>
            <ArrowRightIcon />
          </Link>
        </div>
      </div>
      <Link
        href={cs.href}
        target={cs.externalHref ? "_blank" : undefined}
        rel={cs.externalHref ? "noopener noreferrer" : undefined}
        className="case-study__image-wrap"
        style={cs.imageBg ? { background: cs.imageBg } : undefined}
      >
        <div className="case-study__tilt">
          <div className="tilt-glare" />
          {cs.video ? (
            cs.cropVariant ? (
              <div className="case-study__crop-wrap">
                <video
                  className={`case-study__image case-study__image--crop-top case-study__image--${cs.cropVariant}`}
                  autoPlay
                  loop
                  muted
                  playsInline
                >
                  <source src={cs.video.src} type="video/mp4" />
                </video>
              </div>
            ) : (
              <div className="case-study__video-border">
                <video className="case-study__image" autoPlay loop muted playsInline>
                  <source src={cs.video.src} type="video/mp4" />
                </video>
              </div>
            )
          ) : cs.image ? (
            <Image
              src={cs.image.src}
              alt={cs.image.alt}
              className="case-study__image"
              width={2000}
              height={1194}
              sizes="(max-width: 1080px) 100vw, 1080px"
            />
          ) : null}
        </div>
      </Link>
      <div className="case-study__buttons case-study__buttons--mobile">
        <Link
          href={cs.href}
          target={cs.externalHref ? "_blank" : undefined}
          rel={cs.externalHref ? "noopener noreferrer" : undefined}
          className="case-study__btn case-study__btn--mobile-full"
        >
          <span>{cs.ctaLabel}</span>
          <ArrowRightIcon />
        </Link>
      </div>
    </div>
  );
}

export function CaseStudies({ studies }: { studies: CaseStudy[] }) {
  useMouseTilt(".case-study__image-wrap", {
    targetSelector: ".case-study__tilt",
    glareSelector: ".tilt-glare",
    maxTiltX: 1.375,
    maxTiltY: 1.875,
    scale: 1.012,
    perspective: 1100,
  });

  useEffect(() => {
    const studies = Array.from(document.querySelectorAll<HTMLElement>(".case-study"));
    if (studies.length < 2) return;

    studies.forEach((card, i) => {
      card.style.zIndex = String(i + 1);
    });

    function setStickyTops() {
      const viewH = window.innerHeight;
      for (const card of studies) {
        const cardH = card.offsetHeight;
        if (cardH <= viewH - 56 - 24) {
          card.style.top = "56px";
        } else {
          card.style.top = `${viewH - cardH - 24}px`;
        }
      }
    }

    function onScroll() {
      for (let i = 0; i < studies.length - 1; i++) {
        const card = studies[i];
        const next = studies[i + 1];
        const cardRect = card.getBoundingClientRect();
        const nextRect = next.getBoundingClientRect();

        const overlap = cardRect.bottom - nextRect.top;
        const cardH = cardRect.height;
        const progress = Math.max(0, Math.min(1, overlap / cardH));

        const opacity = Math.max(0, 1 - progress);
        const blur = progress * 6;
        const scale = 1 - progress * 0.07;

        card.style.opacity = opacity.toFixed(3);
        card.style.filter = blur > 0.2 ? `blur(${blur.toFixed(1)}px)` : "none";
        card.style.transform = `scale(${scale.toFixed(4)})`;

        const padTop = 72 - progress * 72;
        next.style.paddingTop = `${Math.max(0, padTop).toFixed(1)}px`;
      }
    }

    setStickyTops();
    onScroll();

    window.addEventListener("load", setStickyTops);
    window.addEventListener("resize", setStickyTops);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("load", setStickyTops);
      window.removeEventListener("resize", setStickyTops);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="case-studies section" id="work" data-analytics-section="case-studies">
      {studies.map((cs) => (
        <CaseStudyCard key={cs.slug} cs={cs} />
      ))}
    </div>
  );
}

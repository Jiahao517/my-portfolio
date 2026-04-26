"use client";

import Link from "next/link";
import { type CSSProperties, useEffect, useId, useMemo, useRef, useState } from "react";

const INFO_BLOCKS = [
  {
    label: "Email",
    links: [{ href: "mailto:artiomyakushev@gmail.com", text: "artiomyakushev@gmail.com" }],
  },
  {
    label: "Tg",
    links: [{ href: "https://t.me/artiomyakushev", text: "@artiomyakushev", external: true }],
  },
  {
    label: "Social",
    links: [
      { href: "https://www.awwwards.com/artiom-yakushev/", text: "Awwwards", external: true },
      { href: "https://www.behance.net/artiomyakushev", text: "Behance", external: true },
      { href: "https://www.instagram.com/artiom.yakushev/", text: "Instagram", external: true },
      { href: "https://www.linkedin.com/in/artiom-yakushev/", text: "Linkedin", external: true },
    ],
  },
] as const;

function ArtFooterLogoMark() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 34" fill="none" aria-hidden="true">
      <path
        d="M33.3238 17.0761C33.3238 7.23951 25.9574 0.446511 16.7824 0.446511C7.65154 0.446511 0.2851 7.23951 0.2851 17.0761C0.2851 26.8687 7.65154 33.5734 16.7824 33.5734C25.9574 33.5734 33.3238 26.8687 33.3238 17.0761ZM29.795 17.0761C29.795 24.9719 24.1047 30.3975 16.7824 30.3975C9.37185 30.3975 3.76982 24.9719 3.76982 17.0761C3.76982 9.09215 9.37185 3.66657 16.7824 3.66657C24.1047 3.66657 29.795 9.09215 29.795 17.0761ZM13.0771 25.2807L16.7383 18.7964H17.2235H19.6055V25.2807H23.8842V7.63651H17.4882C12.6801 7.63651 9.32774 8.73927 9.32774 13.2826C9.32774 15.7528 10.5187 17.2085 12.5037 18.0466L8.26909 25.2807H13.0771ZM13.6064 13.3268C13.6064 11.9152 14.621 11.033 16.5177 11.033H19.6055V15.4882H16.4736C14.4004 15.4882 13.6064 14.6942 13.6064 13.3268Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ArtFooterArrowUp() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 16" fill="none" aria-hidden="true">
      <path
        d="M0.826172 7.61719L7.35547 1.32031L7.5293 1.15234L7.70215 1.32031L14.1738 7.56152L14.3604 7.74121L14.1738 7.92187L13.5195 8.55273L13.3457 8.71973L13.1729 8.55273L8.24609 3.80176L8.24609 15.75L6.81152 15.75L6.81152 3.80078L1.82715 8.60742L1.6543 8.77539L1.48047 8.60742L0.826172 7.97656L0.639648 7.79688L0.826172 7.61719Z"
        fill="currentColor"
      />
      <path
        d="M0.826172 7.61719L7.35547 1.32031L7.5293 1.15234L7.70215 1.32031L14.1738 7.56152L14.3604 7.74121L14.1738 7.92187L13.5195 8.55273L13.3457 8.71973L13.1729 8.55273L8.24609 3.80176L8.24609 15.75L6.81152 15.75L6.81152 3.80078L1.82715 8.60742L1.6543 8.77539L1.48047 8.60742L0.826172 7.97656L0.639648 7.79688L0.826172 7.61719Z"
        stroke="currentColor"
        strokeWidth="0.5"
      />
    </svg>
  );
}

function ArtFooterMaskDesktop({ maskId }: { maskId: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 816" fill="none" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="1920" height="816">
          <rect width="1920" height="816" fill="white" />
          <path
            d="M598.102 510.56C517.922 510.56 489.422 583.14 489.422 662.18C489.422 745.02 521.342 795.94 591.262 795.94C650.542 795.94 689.681 754.52 689.682 701.32C689.682 645.08 650.541 607.46 599.621 607.46C565.042 607.46 542.622 623.04 530.082 642.8C531.222 582.38 554.402 542.1 594.302 542.1C620.522 542.1 639.141 556.16 643.321 582H684.741C679.801 545.9 653.582 510.56 598.102 510.56ZM380.358 510.56C321.459 510.56 282.319 547.42 283.459 602.52H323.738C323.738 558.06 351.099 542.1 379.219 542.1C409.239 542.1 427.479 559.58 427.479 587.32C427.478 635.2 371.238 684.6 276.618 756.8V791H476.118V755.28H327.919C408.099 698.66 468.898 643.56 468.898 583.14C468.898 536.4 431.278 510.56 380.358 510.56ZM591.262 640.52C624.702 640.52 648.262 665.6 648.262 702.84C648.262 739.7 624.322 764.019 590.882 764.02C557.062 764.02 533.882 740.46 533.882 702.84C533.882 665.6 557.442 640.52 591.262 640.52ZM26.1602 705.88H276.96V669.4H26.1602V705.88ZM25 487H69.0801L90.3604 426.58H210.06L231.72 487H278.84L175.1 211.5H127.22L25 487ZM408.712 201.512C330.88 201.512 268.088 259.04 268.088 343.264C268.088 426.736 330.88 483.888 408.712 483.888C486.92 483.888 549.712 426.736 549.712 343.264C549.712 259.04 486.92 201.512 408.712 201.512ZM408.712 227.832C471.88 227.832 520.76 274.08 520.76 343.264C520.76 411.32 471.88 457.944 408.712 457.944C344.416 457.944 296.664 411.32 296.664 343.264C296.664 274.08 344.416 227.832 408.712 227.832ZM416.232 262.8C372.992 262.8 346.296 271.072 346.296 310.176C346.296 329.352 355.32 342.512 373.368 350.408L338.024 412.824H375.248L406.08 356.8H432.776V412.824H466.24V262.8H416.232ZM196.76 390.1H103.28L149.64 258.62L196.76 390.1ZM432.776 330.856H408.712C387.656 330.856 379.76 323.712 379.76 310.552C379.76 295.512 391.416 289.496 409.84 289.496H432.776V330.856Z"
            fill="black"
          />
        </mask>
      </defs>
      <rect width="1920" height="816" fill="currentColor" mask={`url(#${maskId})`} />
    </svg>
  );
}

function ArtFooterMaskTablet({ maskId }: { maskId: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 768 312" fill="none" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="768" height="312">
          <rect width="768" height="312" fill="white" />
          <path
            d="M316.309 161.688C280.439 161.688 267.688 194.159 267.688 229.519C267.689 266.578 281.969 289.358 313.249 289.358C339.769 289.358 357.278 270.828 357.278 247.028C357.278 221.868 339.768 205.038 316.988 205.038C301.518 205.038 291.489 212.009 285.879 220.849C286.389 193.819 296.759 175.799 314.608 175.799C326.338 175.799 334.669 182.088 336.539 193.648H355.068C352.858 177.498 341.129 161.688 316.309 161.688ZM218.897 161.688C192.548 161.688 175.037 178.178 175.547 202.828H193.567C193.568 182.938 205.808 175.799 218.388 175.799C231.817 175.799 239.977 183.619 239.978 196.028C239.978 217.448 214.817 239.549 172.487 271.849V287.148H261.737V271.168H195.438C231.307 245.838 258.507 221.188 258.507 194.158C258.507 173.248 241.677 161.689 218.897 161.688ZM313.249 219.828C328.209 219.828 338.749 231.048 338.749 247.708C338.749 264.198 328.038 275.078 313.078 275.078C297.948 275.078 287.578 264.538 287.578 247.708C287.578 231.048 298.119 219.828 313.249 219.828ZM60.4404 249.068H172.64V232.748H60.4404V249.068ZM233.946 19.54C198.756 19.54 170.366 45.5499 170.366 83.6299C170.366 121.37 198.756 147.21 233.946 147.21C269.306 147.21 297.696 121.37 297.696 83.6299C297.696 45.55 269.306 19.5401 233.946 19.54ZM60.0547 146H79.7744L89.2949 118.97H142.845L152.535 146H173.614L127.205 22.75H105.785L60.0547 146ZM233.946 31.4404C262.506 31.4405 284.606 52.35 284.606 83.6299C284.606 114.4 262.506 135.48 233.946 135.48C204.876 135.48 183.286 114.4 183.286 83.6299C183.286 52.3499 204.876 31.4404 233.946 31.4404ZM237.347 47.25C217.797 47.25 205.727 50.99 205.727 68.6699C205.727 77.3398 209.806 83.2903 217.966 86.8604L201.986 115.08H218.816L232.756 89.75H244.826V115.08H259.956V47.25H237.347ZM136.895 102.65H95.0742L115.814 43.8301L136.895 102.65ZM244.826 78.0195H233.946C224.426 78.0195 220.856 74.7898 220.856 68.8398C220.857 62.04 226.126 59.3204 234.456 59.3203H244.826V78.0195Z"
            fill="black"
          />
        </mask>
      </defs>
      <rect width="768" height="312" fill="currentColor" mask={`url(#${maskId})`} />
    </svg>
  );
}

function ArtFooterMaskMobile({ maskId }: { maskId: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 290" fill="none" aria-hidden="true">
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="360" height="290">
          <rect width="360" height="290" fill="white" />
          <path
            d="M288.757 143.364C252.551 143.364 239.681 176.139 239.681 211.83C239.681 249.237 254.095 272.23 285.668 272.23C312.436 272.23 330.11 253.527 330.11 229.504C330.11 204.109 312.436 187.121 289.443 187.121C273.828 187.121 263.704 194.156 258.041 203.079C258.556 175.796 269.024 157.606 287.041 157.606C298.881 157.607 307.288 163.956 309.176 175.624H327.88C325.649 159.323 313.809 143.364 288.757 143.364ZM190.433 143.364C163.836 143.364 146.162 160.009 146.677 184.89H164.865C164.865 164.814 177.22 157.606 189.918 157.606C203.474 157.606 211.71 165.5 211.71 178.026C211.71 199.647 186.314 221.954 143.588 254.557V270H233.674V253.87H166.753C202.959 228.303 230.414 203.422 230.414 176.139C230.414 155.033 213.426 143.364 190.433 143.364ZM285.668 202.05C300.768 202.05 311.407 213.374 311.407 230.19C311.407 246.835 300.596 257.817 285.496 257.817C270.224 257.817 259.758 247.178 259.758 230.19C259.758 213.374 270.396 202.05 285.668 202.05ZM30.4912 231.563H143.742V215.091H30.4912V231.563ZM203.585 1.75488C168.066 1.7551 139.41 28.0089 139.41 66.4453C139.41 104.539 168.066 130.621 203.585 130.621C239.276 130.621 267.933 104.539 267.933 66.4453C267.932 28.0088 239.276 1.75488 203.585 1.75488ZM29.8594 129.031H49.7637L59.373 101.748H113.425L123.206 129.031H144.483L97.6387 4.62695H76.0176L29.8594 129.031ZM203.585 13.7666C232.412 13.7666 254.72 34.8725 254.72 66.4453C254.72 97.5036 232.413 118.781 203.585 118.781C174.243 118.781 152.451 97.5034 152.451 66.4453C152.451 34.8727 174.243 13.7668 203.585 13.7666ZM207.018 29.7246C187.284 29.7246 175.101 33.5001 175.101 51.3457C175.101 60.0968 179.22 66.1026 187.456 69.7061L171.326 98.1904H188.313L202.384 72.623H214.567V98.1904H229.839V29.7246H207.018ZM107.419 85.2754H65.207L86.1416 25.9043L107.419 85.2754ZM214.567 60.7832H203.585C193.976 60.7831 190.373 57.523 190.373 51.5176C190.373 44.6539 195.693 41.9082 204.101 41.9082H214.567V60.7832Z"
            fill="black"
          />
        </mask>
      </defs>
      <rect width="360" height="290" fill="currentColor" mask={`url(#${maskId})`} />
    </svg>
  );
}

function splitChars(text: string, startIndex: number) {
  return Array.from(text).map((ch, i) => (
    <span
      key={`${ch}-${i}`}
      className="art-footer__char"
      style={{ "--char-i": startIndex + i } as CSSProperties}
      aria-hidden="true"
    >
      <span className="art-footer__char-inner">
        {ch === " " ? " " : ch}
      </span>
    </span>
  ));
}

function formatYerevanTime() {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Yerevan",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return formatter.format(new Date());
}

export function ArtFooter() {
  const [time, setTime] = useState("");
  const [isVisualActive, setIsVisualActive] = useState(false);
  const visualRef = useRef<HTMLElement | null>(null);
  const maskBaseId = useId().replace(/:/g, "");

  useEffect(() => {
    const update = () => setTime(formatYerevanTime());
    update();

    const now = new Date();
    const delay = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
    let intervalId: number | undefined;

    const timeoutId = window.setTimeout(() => {
      update();
      intervalId = window.setInterval(update, 60_000);
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
      if (intervalId) window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const node = visualRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisualActive(entry.isIntersecting);
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -2% 0px",
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const mobileSocialText = useMemo(
    () => ["Creative Digital Designer.", "Working Worldwide."],
    [],
  );

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="art-footer">
      <section className="art-footer__stage">
        <div className="art-footer__stage-media" aria-hidden>
          <div className="art-footer__stage-video-blur" />
          <video
            className="art-footer__stage-video"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="/images/art-footer-poster.jpg"
          >
            <source src="/videos/art-footer-bg.mp4" type="video/mp4" />
            <source src="/videos/art-footer-bg.webm" type="video/webm" />
          </video>
        </div>
        <div className="art-footer__info-layer">
          <div className="art-footer__info-grid">
            <div className="art-footer__info-blocks">
              {INFO_BLOCKS.map((block) => (
                <div key={block.label} className="art-footer__info-block">
                  <div className="art-footer__info-label">{block.label}</div>
                  <div className="art-footer__info-links">
                    {block.links.map((link) => (
                      <a
                        key={link.text}
                        href={link.href}
                        target={"external" in link ? "_blank" : undefined}
                        rel={"external" in link ? "noopener" : undefined}
                        className="art-footer__medium-link"
                      >
                        <span>{link.text}</span>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        <div className="art-footer__mask-layer art-footer__mask-layer--desktop">
          <ArtFooterMaskDesktop maskId={`${maskBaseId}-desktop`} />
        </div>
        <div className="art-footer__mask-layer art-footer__mask-layer--tablet">
          <ArtFooterMaskTablet maskId={`${maskBaseId}-tablet`} />
        </div>
        <div className="art-footer__mask-layer art-footer__mask-layer--mobile">
          <ArtFooterMaskMobile maskId={`${maskBaseId}-mobile`} />
        </div>

        <Link href="/" className="art-footer__corner-logo" aria-label="Back home">
          <ArtFooterLogoMark />
        </Link>
      </section>

      <section
        ref={visualRef}
        className={`art-footer__visual-shell${isVisualActive ? " art-footer__visual-shell--active" : ""}`}
      >
        <div className="art-footer__spacer-footer" aria-hidden />

        <div className="art-footer__visual-layer">
          <div className="art-footer__media-layer">
            <div className="art-footer__video-blur" aria-hidden />
            <video
              className="art-footer__video"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              poster="/images/art-footer-poster.jpg"
            >
              <source src="/videos/art-footer-bg.mp4" type="video/mp4" />
              <source src="/videos/art-footer-bg.webm" type="video/webm" />
            </video>
          </div>

          <div className={`art-footer__text-layer${isVisualActive ? " art-footer__text-layer--active" : ""}`}>
            <div className="art-footer__mobile-utility">
              <button type="button" className="art-footer__top-button art-footer__top-button--mobile" onClick={scrollTop}>
                <span className="art-footer__top-button-icon">
                  <ArtFooterArrowUp />
                </span>
                <span className="art-footer__top-button-text">Back to top</span>
              </button>
              <div className="art-footer__mobile-social">
                {mobileSocialText.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </div>
            </div>

            <div className="art-footer__big-name" aria-label="Artiom Yakushev">
              <span className="art-footer__big-name-sans">
                {splitChars("Artiom", 0)}
              </span>
              <span className="art-footer__big-name-serif">
                {splitChars("Yakushev", 6)}
              </span>
            </div>

            <div className="art-footer__utility-row">
              <div className="art-footer__time art-footer__reveal-item art-footer__reveal-item--1">
                <span className="art-footer__time-city">Yerevan</span>
                <span className="art-footer__time-separator"> </span>
                <span className="art-footer__time-value">{time}</span>
              </div>

              <div className="art-footer__role art-footer__reveal-item art-footer__reveal-item--2">
                <span>Creative Digital Designer</span>
                <span className="art-footer__role-slash">/</span>
                <span>Working Worldwide</span>
              </div>

              <button
                type="button"
                className="art-footer__top-button art-footer__top-button--desktop art-footer__reveal-item art-footer__reveal-item--3"
                onClick={scrollTop}
              >
                <span className="art-footer__top-button-icon">
                  <ArtFooterArrowUp />
                </span>
                <span className="art-footer__top-button-text">Back to top</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
}

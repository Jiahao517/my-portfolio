import Image from "next/image";
import { ArrowRightIcon, GlobeIcon } from "@/components/icons";
import { caseStudies } from "@/data/case-studies";
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
        <div className="case-study__buttons">
          {cs.websiteHref ? (
            <a
              href={cs.websiteHref}
              target="_blank"
              rel="noopener"
              className="case-study__website-btn"
              aria-label="访问站点"
            >
              <GlobeIcon stroke="currentColor" />
            </a>
          ) : null}
          <a
            href={cs.href}
            target={cs.externalHref ? "_blank" : undefined}
            rel={cs.externalHref ? "noopener" : undefined}
            className="case-study__btn"
          >
            <span>{cs.ctaLabel}</span>
            <ArrowRightIcon />
          </a>
        </div>
      </div>
      <a
        href={cs.href}
        target={cs.externalHref ? "_blank" : undefined}
        rel={cs.externalHref ? "noopener" : undefined}
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
      </a>
    </div>
  );
}

export function CaseStudies() {
  return (
    <div className="case-studies section" id="work">
      {caseStudies.map((cs) => (
        <CaseStudyCard key={cs.slug} cs={cs} />
      ))}
    </div>
  );
}

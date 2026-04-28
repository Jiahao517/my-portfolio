import Link from "next/link";
import type { Metadata } from "next";
import styles from "./performula.module.css";
import { ProgressNav } from "./ProgressNav";

export const metadata: Metadata = {
  title: "Performula – Visual Identity & Art Direction",
  description:
    "Performula is a health start-up focused on highly customized nutrition supplements. Brand identity and art direction case study.",
};

const IMG = "https://a.storyblok.com/f/268243";

const HERO = `${IMG}/3840x2160/7ad828dd29/studiogruhl_performula_00-hero_desktop-thumbnail.jpg`;

const FULL_IMAGES: { src: string; alt: string }[] = [
  { src: `${IMG}/3840x2160/13504aac49/studiogruhl_performula_01-logo.jpg`, alt: "Performula logo" },
  { src: `${IMG}/3840x2223/d66f26078c/studiogruhl_performula_02-socials.png`, alt: "Social system" },
  { src: `${IMG}/3840x2160/fac496fc53/studiogruhl_performula_03-stories_slide-thumbnail.jpg`, alt: "Stories" },
  { src: `${IMG}/3840x2160/702c38a420/studiogruhl_performula_05-billboard_01.png`, alt: "Billboard" },
  { src: `${IMG}/3840x2160/d4cc66d455/studiogruhl_performula_12-package_float.jpg`, alt: "Packaging float" },
  { src: `${IMG}/3840x2160/91b6e7b55b/studiogruhl_performula_16-bag_placement.jpg`, alt: "Bag placement" },
  { src: `${IMG}/3840x2160/638abfb41a/studiogruhl_performula_17-website_desktop-thumbnail.jpg`, alt: "Website" },
  { src: `${IMG}/3840x2160/5474e6c7c8/studiogruhl_performula_28-ingredients_collection.jpg`, alt: "Ingredients" },
  { src: `${IMG}/3840x2160/a2b46c184e/studiogruhl_performula_25-laptop_mockup.jpg`, alt: "Laptop mockup" },
  { src: `${IMG}/3840x2160/26e1b42836/studiogruhl_performula_40-packaging_grid.jpg`, alt: "Packaging grid" },
];

const PAIR_IMAGES: { src: string; alt: string }[][] = [
  [
    { src: `${IMG}/1920x2160/b7771b3747/studiogruhl_performula_10-element.jpg`, alt: "Element" },
    { src: `${IMG}/1920x2160/884b2d2c0b/studiogruhl_performula_11-statistic.jpg`, alt: "Statistic" },
  ],
  [
    { src: `${IMG}/1920x2160/ece0ac3efb/studiogruhl_performula_14-packaging_open.jpg`, alt: "Packaging open" },
    { src: `${IMG}/1920x2160/a5a0508086/studiogruhl_performula_15-ingredient_closeup_01.jpg`, alt: "Ingredient closeup" },
  ],
  [
    { src: `${IMG}/1920x2160/00cf01b6e5/studiogruhl_performula_19-colors.jpg`, alt: "Colors" },
    { src: `${IMG}/1920x2160/56fa4d67ed/studiogruhl_performula_29-type_system-thumbnail.jpg`, alt: "Type system" },
  ],
  [
    { src: `${IMG}/1920x2160/f2ca7321e6/studiogruhl_performula_30-bottle-thumbnail.jpg`, alt: "Bottle" },
    { src: `${IMG}/1920x2160/49faa28667/studiogruhl_performula_33-ingredient_closeup.jpg`, alt: "Ingredient" },
  ],
];

export default function PerformulaPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.iconBtn} aria-label="Menu">
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="0" y1="2" x2="18" y2="2" />
            <line x1="0" y1="12" x2="18" y2="12" />
          </svg>
        </button>
        <Link href="/" className={styles.logo} aria-label="Home">𝓢</Link>
        <button className={styles.iconBtn} aria-label="Contact">
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="0.5" y="0.5" width="17" height="13" rx="1" />
            <path d="M0.5 1.5 L9 8 L17.5 1.5" />
          </svg>
        </button>
      </header>

      <section className={styles.hero}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO} alt="Performula hero" />
        <h1 className={styles.heroTitle}>Performula</h1>
      </section>

      <section className={styles.intro}>
        <div>
          <div className={styles.introLabel}>About</div>
          <h2 className={styles.introHeading}>
            A next-generation brand for anyone who wants to perform at their peak.
          </h2>
        </div>
        <div className={styles.introBody}>
          <p>
            Performula is a health start-up focused on creating highly customized nutrition
            supplements for their exclusive clientele. By analyzing their clients&apos; blood,
            they generate a personalized nutrition mix, selecting from an ever-growing list of
            over 200 nutrients and supplement ingredients.
          </p>
          <p>
            We chose a visual direction that reflects this futuristic, science-driven approach.
            The brand is anchored in a forward-looking tech aesthetic, while clinical precision
            is reflected in the underlying Swiss grid design, which connects all touchpoints
            from social to print in a holistic design system.
          </p>
          <p>
            We added elegance and mystique with a set of custom 3D visuals based on actual
            microscopic analyses of the ingredients. These were blended with an art direction
            inspired by fine jewellery, resulting in rich and artistic visual objects.
          </p>
          <p>
            For the art direction, we developed a new workflow using AI-generated imagery. This
            allowed us to maintain a consistent core direction, showcasing a range of talent in
            a way that truly highlights Performula as a next-generation brand.
          </p>
        </div>
      </section>

      <section className={styles.gallery}>
        {FULL_IMAGES.slice(0, 3).map((im) => (
          <div className="full" key={im.src}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={im.src} alt={im.alt} loading="lazy" />
          </div>
        ))}

        <div className="pair">
          {PAIR_IMAGES[0].map((im) => (
            <div key={im.src}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={im.src} alt={im.alt} loading="lazy" />
            </div>
          ))}
        </div>

        {FULL_IMAGES.slice(3, 6).map((im) => (
          <div className="full" key={im.src}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={im.src} alt={im.alt} loading="lazy" />
          </div>
        ))}

        <div className="pair">
          {PAIR_IMAGES[1].map((im) => (
            <div key={im.src}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={im.src} alt={im.alt} loading="lazy" />
            </div>
          ))}
        </div>

        {FULL_IMAGES.slice(6, 8).map((im) => (
          <div className="full" key={im.src}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={im.src} alt={im.alt} loading="lazy" />
          </div>
        ))}

        <div className="pair">
          {PAIR_IMAGES[2].map((im) => (
            <div key={im.src}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={im.src} alt={im.alt} loading="lazy" />
            </div>
          ))}
        </div>

        {FULL_IMAGES.slice(8).map((im) => (
          <div className="full" key={im.src}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={im.src} alt={im.alt} loading="lazy" />
          </div>
        ))}

        <div className="pair">
          {PAIR_IMAGES[3].map((im) => (
            <div key={im.src}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={im.src} alt={im.alt} loading="lazy" />
            </div>
          ))}
        </div>
      </section>

      <section className={styles.creditsSection}>
        <div className={styles.creditsBlock}>
          <h3>Project Information</h3>
          <p>
            Performula delivers personalized nutrition science to a global clientele,
            blending blood diagnostics with bespoke supplement formulation. The brand
            system spans social, print, packaging and digital — held together by a
            disciplined Swiss grid and a futuristic, jewellery-inspired visual language.
          </p>
        </div>
        <div className={styles.creditsBlock}>
          <h3>Creative Credits</h3>
          <p><strong>Studio</strong><br />Studio Gruhl</p>
          <p><strong>Disciplines</strong><br />Brand Identity, Art Direction, Packaging, Digital, 3D, Type System</p>
          <p><strong>Year</strong><br />2025</p>
        </div>
      </section>

      <ProgressNav />
    </div>
  );
}

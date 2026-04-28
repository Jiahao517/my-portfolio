import type { Metadata } from "next";
import Image from "next/image";
import { SiteChrome } from "./SiteChrome";

export const metadata: Metadata = {
  title: "Performula – Brand Identity & Design System by Studio Gruhl",
  description:
    "Studio Gruhl built a science-driven brand identity, AI-generated and 3D-rendered visuals, and a modular design system for health-tech start-up Performula.",
};

type MediaItem = { image: string; video?: string };
type Block = { type: "fullColumn" | "twoColumn"; items: MediaItem[] };

const BLOCKS: Block[] = [
  { type: "fullColumn", items: [{ image: "https://a.storyblok.com/f/268243/3840x2160/13504aac49/studiogruhl_performula_01-logo.jpg" }] },
  { type: "fullColumn", items: [{ image: "https://a.storyblok.com/f/268243/3840x2223/d66f26078c/studiogruhl_performula_02-socials.png" }] },
  { type: "fullColumn", items: [{ image: "https://a.storyblok.com/f/268243/3840x2160/fac496fc53/studiogruhl_performula_03-stories_slide-thumbnail.jpg", video: "https://pub-66de73ccfc0c40a498df7e4a14e4d263.r2.dev/STUDIOGRUHL_Performula_03-Stories_Slide-1080p.mp4" }] },
  { type: "fullColumn", items: [{ image: "https://a.storyblok.com/f/268243/3840x2160/85ce36f010/studiogruhl_performula_04-ingredient_360_01-thumbnail.jpg", video: "https://pub-66de73ccfc0c40a498df7e4a14e4d263.r2.dev/STUDIOGRUHL_Performula_04-Ingredient_360_01-1080p.mp4" }] },
  { type: "fullColumn", items: [{ image: "https://a.storyblok.com/f/268243/3840x2160/702c38a420/studiogruhl_performula_05-billboard_01.png" }] },
  { type: "fullColumn", items: [{ image: "https://a.storyblok.com/f/268243/3840x2160/91b6e7b55b/studiogruhl_performula_16-bag_placement.jpg" }] },
  { type: "fullColumn", items: [{ image: "https://a.storyblok.com/f/268243/3840x2160/d4cc66d455/studiogruhl_performula_12-package_float.jpg" }] },
  { type: "fullColumn", items: [{ image: "https://a.storyblok.com/f/268243/3840x2160/88d8b530fb/studiogruhl_performula_08-conference-thumbnail.jpg", video: "https://pub-66de73ccfc0c40a498df7e4a14e4d263.r2.dev/STUDIOGRUHL_Performula_08-Conference-1080p.mp4" }] },
  { type: "fullColumn", items: [{ image: "https://a.storyblok.com/f/268243/3840x2160/b5fab7dcd5/studiogruhl_performula_09-stories_main-thumbnail.jpg", video: "https://pub-66de73ccfc0c40a498df7e4a14e4d263.r2.dev/STUDIOGRUHL_Performula_09-Stories_Main-1080p.mp4" }] },
  { type: "twoColumn", items: [
    { image: "https://a.storyblok.com/f/268243/1920x2160/b7771b3747/studiogruhl_performula_10-element.jpg" },
    { image: "https://a.storyblok.com/f/268243/1920x2160/884b2d2c0b/studiogruhl_performula_11-statistic.jpg" },
  ]},
  { type: "fullColumn", items: [{ image: "https://a.storyblok.com/f/268243/3840x2160/ebaf0b4487/studiogruhl_performula_13-phone_mockup.jpg" }] },
  { type: "twoColumn", items: [
    { image: "https://a.storyblok.com/f/268243/1920x2160/ece0ac3efb/studiogruhl_performula_14-packaging_open.jpg" },
    { image: "https://a.storyblok.com/f/268243/1920x2160/a5a0508086/studiogruhl_performula_15-ingredient_closeup_01.jpg" },
  ]},
  { type: "fullColumn", items: [{ image: "https://a.storyblok.com/f/268243/3840x2160/638abfb41a/studiogruhl_performula_17-website_desktop-thumbnail.jpg", video: "https://pub-66de73ccfc0c40a498df7e4a14e4d263.r2.dev/STUDIOGRUHL_Performula_17-Website_Desktop-1080p.mp4" }] },
  { type: "twoColumn", items: [
    { image: "https://a.storyblok.com/f/268243/1920x2160/35695d5210/studiogruhl_performula_18-digital.png" },
    { image: "https://a.storyblok.com/f/268243/1920x2160/00cf01b6e5/studiogruhl_performula_19-colors.jpg" },
  ]},
  { type: "fullColumn", items: [{ image: "https://a.storyblok.com/f/268243/3840x2160/cca03fd435/studiogruhl_performula_20-ingredient_360_02-thumbnail.jpg", video: "https://pub-66de73ccfc0c40a498df7e4a14e4d263.r2.dev/STUDIOGRUHL_Performula_04-Ingredient_360_02-1080p.mp4" }] },
  { type: "fullColumn", items: [{ image: "https://a.storyblok.com/f/268243/3840x2160/1bbbf89ed5/studiogruhl_performula_21-ingredient_slide-thumbnail.jpg", video: "https://pub-66de73ccfc0c40a498df7e4a14e4d263.r2.dev/STUDIOGRUHL_Performula_21-Ingredient_Slide-1080p.mp4" }] },
  { type: "fullColumn", items: [{ image: "https://a.storyblok.com/f/268243/3840x2160/00bfe6019c/studiogruhl_performula_22-dooh_3up-thumbnail.jpg", video: "https://pub-66de73ccfc0c40a498df7e4a14e4d263.r2.dev/STUDIOGRUHL_Performula_22-DOOH_3Up-1080p.mp4" }] },
  { type: "twoColumn", items: [
    { image: "https://a.storyblok.com/f/268243/1920x2160/4958c0d56c/studiogruhl_performula_23-bag_360-thumbnail.jpg", video: "https://pub-66de73ccfc0c40a498df7e4a14e4d263.r2.dev/STUDIOGRUHL_Performula_23-Bag_360-1080p.mp4" },
    { image: "https://a.storyblok.com/f/268243/1920x2160/56dc5fdb67/studiogruhl_performula_24-ui_element-thumbnail.jpg", video: "https://pub-66de73ccfc0c40a498df7e4a14e4d263.r2.dev/STUDIOGRUHL_Performula_24-UI_Element-1080p.mp4" },
  ]},
  { type: "fullColumn", items: [{ image: "https://a.storyblok.com/f/268243/3840x2160/5474e6c7c8/studiogruhl_performula_28-ingredients_collection.jpg" }] },
  { type: "twoColumn", items: [
    { image: "https://a.storyblok.com/f/268243/1920x2160/4be6f98ad6/studiogruhl_performula_26-categories-thumbnail.jpg", video: "https://pub-66de73ccfc0c40a498df7e4a14e4d263.r2.dev/STUDIOGRUHL_Performula_26-Categories-720p.mp4" },
    { image: "https://a.storyblok.com/f/268243/1920x2160/9de8132ab9/studiogruhl_performula_27-dooh_1up_02.png" },
  ]},
  { type: "fullColumn", items: [{ image: "https://a.storyblok.com/f/268243/3840x2160/a2b46c184e/studiogruhl_performula_25-laptop_mockup.jpg" }] },
  { type: "twoColumn", items: [
    { image: "https://a.storyblok.com/f/268243/1920x2160/56fa4d67ed/studiogruhl_performula_29-type_system-thumbnail.jpg", video: "https://pub-66de73ccfc0c40a498df7e4a14e4d263.r2.dev/STUDIOGRUHL_Performula_29-Type_System-1080p.mp4" },
    { image: "https://a.storyblok.com/f/268243/1920x2160/f2ca7321e6/studiogruhl_performula_30-bottle-thumbnail.jpg", video: "https://pub-66de73ccfc0c40a498df7e4a14e4d263.r2.dev/STUDIOGRUHL_Performula_30-Bottle-1080p.mp4" },
  ]},
  { type: "fullColumn", items: [{ image: "https://a.storyblok.com/f/268243/3840x2160/26e1b42836/studiogruhl_performula_40-packaging_grid.jpg" }] },
  { type: "twoColumn", items: [
    { image: "https://a.storyblok.com/f/268243/1920x2160/190621f072/studiogruhl_performula_31-card.jpg" },
    { image: "https://a.storyblok.com/f/268243/1920x2160/83428e1d71/studiogruhl_performula_32-numbers-thumbnail.jpg", video: "https://pub-66de73ccfc0c40a498df7e4a14e4d263.r2.dev/STUDIOGRUHL_Performula_32-Numbers-1080p.mp4" },
  ]},
  { type: "fullColumn", items: [{ image: "https://a.storyblok.com/f/268243/3840x2160/4d037291f7/studiogruhl_performula_35-dooh_1_up_01.png" }] },
  { type: "twoColumn", items: [
    { image: "https://a.storyblok.com/f/268243/1920x2160/49faa28667/studiogruhl_performula_33-ingredient_closeup.jpg" },
    { image: "https://a.storyblok.com/f/268243/1920x2160/c23a0b0bbb/studiogruhl_performula_34-art_direction_02.jpg" },
  ]},
  { type: "fullColumn", items: [{ image: "https://a.storyblok.com/f/268243/3840x2160/336e0c21b5/studiogruhl_performula_38-website_mobile-thumbnail.jpg", video: "https://pub-66de73ccfc0c40a498df7e4a14e4d263.r2.dev/STUDIOGRUHL_Performula_38-Website_Mobile-1080p.mp4" }] },
  { type: "twoColumn", items: [
    { image: "https://a.storyblok.com/f/268243/1920x2160/749d84fefc/studiogruhl_performula_36-ui_button-thumbnail.jpg", video: "https://pub-66de73ccfc0c40a498df7e4a14e4d263.r2.dev/STUDIOGRUHL_Performula_36-UI_Button-720p.mp4" },
    { image: "https://a.storyblok.com/f/268243/1920x2160/2485fc6e50/studiogruhl_performula_37-icon-thumbnail.jpg", video: "https://pub-66de73ccfc0c40a498df7e4a14e4d263.r2.dev/STUDIOGRUHL_Performula_37-Icon-1080p.mp4" },
  ]},
  { type: "fullColumn", items: [{ image: "https://a.storyblok.com/f/268243/3840x2160/f72631c2af/studiogruhl_performula_39-packaging_stacked.jpg" }] },
];

const PROJECT_INFO = `Performula is a health start-up focused on creating highly customized nutrition supplements for their exclusive clientele. By analyzing their clients' blood, they generate a personalized nutrition mix, selecting from an ever-growing list of over 200 nutrients and supplement ingredients.

We chose a visual direction that reflects this futuristic, science-driven approach. The brand is anchored in a forward-looking tech aesthetic, while clinical precision is reflected in the underlying Swiss grid design, which connects all touchpoints from social to print in a holistic design system.

We added elegance and mystique with a set of custom 3D visuals based on actual microscopic analyses of the ingredients. These were blended with an art direction inspired by fine jewellery, resulting in rich and artistic visual objects.

For the art direction, we developed a new workflow using AI-generated imagery. This allowed us to maintain a consistent core direction, showcasing a range of talent in a way that truly highlights Performula as a next-generation brand for anyone who wants to perform at their peak.`;

const CREDITS = `Creative & Art Direction
Malte Gruhl

Design
Joma Frenzel
Emma Damiani`;

function Media({ item }: { item: MediaItem }) {
  if (item.video) {
    return (
      <video
        className="block h-auto w-full"
        src={item.video}
        poster={item.image}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />
    );
  }
  return (
    <Image
      src={item.image}
      alt=""
      width={3840}
      height={2160}
      sizes="100vw"
      className="block h-auto w-full"
      priority={false}
    />
  );
}

export default function PerformulaPage() {
  const thumbs = BLOCKS.flatMap((b) =>
    b.items.map((it) => {
      const m = it.image.match(/\/(\d+)x(\d+)\//);
      const w = m ? Number(m[1]) : 16;
      const h = m ? Number(m[2]) : 9;
      return { src: it.image, ar: w / h };
    }),
  );
  return (
    <>
      <SiteChrome thumbs={thumbs} />
      <main className="bg-black text-white">
        <section className="px-4 pt-32 pb-16 md:px-8 md:pt-40 md:pb-24">
          <h1 className="text-[10vw] font-bold uppercase leading-[0.9] tracking-[-0.04em] md:text-[8vw]">
            Performula
          </h1>
          <p className="mt-8 max-w-[22ch] text-[10vw] font-bold uppercase leading-[0.95] tracking-[-0.03em] md:mt-12 md:max-w-[28ch] md:text-[6vw]">
            A new brand design system for the health &amp; nutrition start-up, Performula.
          </p>
        </section>

        <div className="flex flex-col gap-2 px-2 md:gap-3 md:px-3">
          {BLOCKS.map((block, i) => (
            <div
              key={i}
              className={
                block.type === "twoColumn"
                  ? "grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-3"
                  : "grid grid-cols-1"
              }
            >
              {block.items.map((item, j) => (
                <div key={j} className="overflow-hidden bg-neutral-900">
                  <Media item={item} />
                </div>
              ))}
            </div>
          ))}
        </div>

        <section id="contact" className="grid grid-cols-1 gap-12 px-4 py-24 md:grid-cols-3 md:gap-16 md:px-10 md:py-32">
          <div>
            <h2 className="text-sm uppercase tracking-widest text-white/60">Project Information</h2>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-white/85 md:text-base">
              {PROJECT_INFO.split("\n\n").map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-sm uppercase tracking-widest text-white/60">Creative Credits</h2>
            <div className="mt-4 whitespace-pre-line text-sm leading-relaxed text-white/85 md:text-base">
              {CREDITS}
            </div>
          </div>
          <div>
            <h2 className="text-sm uppercase tracking-widest text-white/60">Project Images</h2>
            <a
              href="https://drive.google.com/open?id=14i2qbaFhlTbB45Hmg6IL2HwmP2Y0WFD7&usp=drive_fs"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-sm underline underline-offset-4 hover:text-white/60 md:text-base"
            >
              Download
            </a>
          </div>
        </section>

        <nav className="border-t border-white/15 px-4 py-8 md:px-10">
          {[
            { label: "返回首页", href: "/" },
            { label: "Projects", href: "/#case-studies" },
            { label: "About", href: "/#about" },
            { label: "Contact", href: "/#contact" },
          ].map((it) => (
            <a
              key={it.label}
              href={it.href}
              className="flex items-center justify-between border-t border-white/15 py-5 text-2xl uppercase tracking-tight transition-colors hover:text-white/60 md:text-3xl"
            >
              <span>{it.label}</span>
              <span className="text-white">→</span>
            </a>
          ))}
        </nav>

        <footer className="flex flex-wrap items-center justify-between gap-4 px-4 py-10 text-xs text-white/50 md:px-10">
          <span>© Studio Gruhl</span>
          <div className="flex gap-6">
            <a href="https://www.instagram.com/studiogruhl/" target="_blank" rel="noopener noreferrer" className="hover:text-white">Instagram</a>
            <a href="https://www.are.na/studio-gruhl/channels" target="_blank" rel="noopener noreferrer" className="hover:text-white">Are.na</a>
            <a href="https://www.linkedin.com/company/studiogruhl/" target="_blank" rel="noopener noreferrer" className="hover:text-white">LinkedIn</a>
          </div>
        </footer>
      </main>
    </>
  );
}

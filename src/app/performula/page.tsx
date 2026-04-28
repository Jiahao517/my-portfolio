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
  { type: "fullColumn", items: [{ image: "/images/wencai/04.png" }] },
  { type: "fullColumn", items: [{ image: "/images/wencai/05.png" }] },
  { type: "fullColumn", items: [{ image: "/images/wencai/06.png" }] },
  { type: "fullColumn", items: [{ image: "/images/wencai/07.png" }] },
  { type: "fullColumn", items: [{ image: "/images/wencai/08.png" }] },
  { type: "fullColumn", items: [{ image: "/images/wencai/09.png" }] },
  { type: "fullColumn", items: [{ image: "/images/wencai/10.png" }] },
  { type: "fullColumn", items: [{ image: "/images/wencai/11.png" }] },
  { type: "fullColumn", items: [{ image: "/images/wencai/12.png" }] },
  { type: "fullColumn", items: [{ image: "/images/wencai/13.png" }] },
  { type: "fullColumn", items: [{ image: "/images/wencai/14.png" }] },
  { type: "fullColumn", items: [{ image: "/images/wencai/15.png" }] },
  { type: "fullColumn", items: [{ image: "/images/wencai/16.png" }] },
  { type: "fullColumn", items: [{ image: "/images/wencai/17.png" }] },
  { type: "fullColumn", items: [{ image: "/images/wencai/18.png" }] },
  { type: "fullColumn", items: [{ image: "/images/wencai/19.png" }] },
  { type: "fullColumn", items: [{ image: "/images/wencai/20.png" }] },
  { type: "fullColumn", items: [{ image: "/images/wencai/21.png" }] },
  { type: "fullColumn", items: [{ image: "/images/wencai/21b.png" }] },
  { type: "fullColumn", items: [{ image: "/images/wencai/22.png" }] },
  { type: "fullColumn", items: [{ image: "/images/wencai/23.png" }] },
  { type: "fullColumn", items: [{ image: "/images/wencai/24.png" }] },
  { type: "fullColumn", items: [{ image: "/images/wencai/25.png" }] },
  { type: "fullColumn", items: [{ image: "/images/wencai/26.png" }] },
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
      width={1920}
      height={1080}
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

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CaseFooterNav } from "@/components/CaseFooterNav";
import { SiteChrome } from "@/components/SiteChrome";
import { WencaiBrandVideo } from "@/components/WencaiBrandVideo";

export const metadata: Metadata = {
  title: "问财智能投顾",
  description: "AI+金融，交互范式升级，让答案可理解、可验证",
};

type MediaItem = { image: string; video?: string };
type Block = { type: "fullColumn" | "twoColumn"; items: MediaItem[] };

const BLOCKS: Block[] = [
  { type: "fullColumn", items: [{ image: "/images/wencai/12.问财.png" }] },
  { type: "fullColumn", items: [{ image: "/images/wencai/13.问财.png" }] },
  { type: "fullColumn", items: [{ image: "/images/wencai/14.问财.png" }] },
  { type: "fullColumn", items: [{ image: "/images/wencai/15.问财.png" }] },
  { type: "fullColumn", items: [{ image: "/images/wencai/16.问财.png" }] },
  { type: "fullColumn", items: [{ image: "/images/wencai/17.问财.png" }] },
  { type: "fullColumn", items: [{ image: "/images/wencai/18.问财.png" }] },
  { type: "fullColumn", items: [{ image: "/images/wencai/19.问财.png" }] },
  { type: "fullColumn", items: [{ image: "/images/wencai/20.问财.png" }] },
  { type: "fullColumn", items: [{ image: "/images/wencai/21.问财.png" }] },
  { type: "fullColumn", items: [{ image: "/images/wencai/22.问财.png" }] },
  { type: "fullColumn", items: [{ image: "/images/wencai/23.问财.png" }] },
  { type: "fullColumn", items: [{ image: "/images/wencai/24.问财.png" }] },
  { type: "fullColumn", items: [{ image: "/images/wencai/25.问财.png" }] },
  { type: "fullColumn", items: [{ image: "/images/wencai/26.问财.png" }] },
  { type: "fullColumn", items: [{ image: "/images/wencai/27.问财.png" }] },
  { type: "fullColumn", items: [{ image: "/images/wencai/28.问财.png" }] },
  { type: "fullColumn", items: [{ image: "/images/wencai/29.问财.png" }] },
  { type: "fullColumn", items: [{ image: "/images/wencai/30.问财.png" }] },
  { type: "fullColumn", items: [{ image: "/images/wencai/31.问财.png" }] },
  { type: "fullColumn", items: [{ image: "/images/wencai/32.问财.png" }] },
  { type: "fullColumn", items: [{ image: "/images/wencai/33.问财.png" }] },
  { type: "fullColumn", items: [{ image: "/images/wencai/34.问财.png" }] },
  { type: "fullColumn", items: [{ image: "/images/wencai/35.问财.png" }] },
];

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

export default function WencaiPage() {
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
      <SiteChrome thumbs={thumbs} variant="light" />
      <main className="bg-black text-white">
        <section className="px-4 pt-32 pb-16 md:px-8 md:pt-40 md:pb-24">
          <h1 className="text-[10vw] font-bold leading-[0.9] tracking-[-0.04em] md:text-[8vw] pb-4">
            问财智能投顾
          </h1>
          <p className="mt-4 text-lg text-white/60">AI+金融，交互范式升级，让答案可理解、可验证 · &apos;23 − &apos;25</p>
        </section>

        <div className="flex flex-col gap-2 px-2 md:gap-3 md:px-3">
          {BLOCKS.map((block, i) => (
            <div key={i} className="contents">
              <div
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
              {block.items.some((item) => item.image === "/images/wencai/32.问财.png") ? (
                <div className="grid grid-cols-1">
                  <WencaiBrandVideo />
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <CaseFooterNav currentSlug="wencai" />

        <footer className="flex flex-wrap items-center justify-between gap-4 px-4 py-10 text-xs text-white/50 md:px-10">
          <span>© 钟家豪</span>
          <div className="flex gap-6">
            <a href="mailto:zjh532169990@163.com" className="hover:text-white">邮箱</a>
            <a href="tel:17681828517" className="hover:text-white">手机号</a>
            <Link href="/#about" className="hover:text-white">微信</Link>
          </div>
        </footer>
      </main>
    </>
  );
}

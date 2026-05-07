import type { Metadata } from "next";
import Image from "next/image";
import { CaseFooterNav } from "@/components/CaseFooterNav";
import { SiteChrome } from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "智能对话设计规范",
  description: "统一对话组件与规则，让设计直接进入开发与使用",
};

const IMAGES = [
  "/images/guifan/27.规范.png",
  "/images/guifan/28.规范.png",
  "/images/guifan/29.规范.png",
  "/images/guifan/30.规范.png",
  "/images/guifan/31.规范.png",
  "/images/guifan/32.规范.png",
  "/images/guifan/33.规范.png",
  "/images/guifan/34.规范.png",
  "/images/guifan/35.规范.png",
  "/images/guifan/36.规范.png",
];

export default function ChatSpecPage() {
  const thumbs = IMAGES.map((src) => ({ src, ar: 16 / 9 }));
  return (
    <>
      <SiteChrome thumbs={thumbs} variant="light" />
      <main className="bg-black text-white">
        <section className="px-4 pt-32 pb-16 md:px-8 md:pt-40 md:pb-24">
          <h1 className="text-[10vw] font-bold leading-[0.9] tracking-[-0.04em] md:text-[8vw] pb-4">
            智能对话设计规范
          </h1>
          <p className="md:mt-4 text-lg text-white/60">统一对话组件与规则，让设计直接进入开发与使用 · &apos;23 − &apos;25</p>
        </section>

        <div className="flex flex-col gap-2 px-2 md:gap-3 md:px-3">
          {IMAGES.map((src, i) => (
            <div key={i} className="overflow-hidden bg-neutral-900">
              <Image
                src={src}
                alt=""
                width={1920}
                height={1080}
                sizes="100vw"
                className="block h-auto w-full"
                priority={i === 0}
              />
            </div>
          ))}
        </div>

        <CaseFooterNav currentSlug="chat-spec" />
      </main>
    </>
  );
}

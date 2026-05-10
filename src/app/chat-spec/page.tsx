import type { Metadata } from "next";
import Image from "next/image";
import { CaseFooterNav } from "@/components/CaseFooterNav";
import { SiteChrome } from "@/components/SiteChrome";
import { caseImages } from "@/lib/caseImages";

export const metadata: Metadata = {
  title: "智能对话设计规范",
  description: "统一对话组件与规则，让设计直接进入开发与使用",
};

export default function ChatSpecPage() {
  const IMAGES = caseImages("chat-spec", 10);
  const thumbs = IMAGES.map(({ src, ar }) => ({ src, ar }));
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
          {IMAGES.map((image, i) => (
            <div key={i} className="overflow-hidden bg-neutral-900">
              <Image
                src={image.src}
                alt=""
                width={image.width}
                height={image.height}
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

import type { Metadata } from "next";
import Image from "next/image";
import { CaseFooterNav } from "@/components/CaseFooterNav";
import { SiteChrome } from "@/components/SiteChrome";
import { caseImages } from "@/lib/caseImages";

export const metadata: Metadata = {
  title: "钉钉 AI 产品实践",
  description: "设计即交付：把设计推进到结果",
};

export default function DingtalkPage() {
  const IMAGES = caseImages("dingtalk", 8);
  const thumbs = IMAGES.map(({ src, ar }) => ({ src, ar }));
  return (
    <>
      <SiteChrome thumbs={thumbs} variant="light" />
      <main className="bg-black text-white">
        <section className="px-4 pt-32 pb-16 md:px-8 md:pt-40 md:pb-24">
          <h1 className="text-[10vw] font-bold leading-[0.9] tracking-[-0.04em] md:text-[8vw] pb-4">
            钉钉 AI 产品实践
          </h1>
          <p className="md:mt-8 text-lg text-white/60">设计即交付：把设计推进到结果 · &apos;26</p>
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

        <CaseFooterNav currentSlug="dingtalk" />
      </main>
    </>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import { CaseFloatingVideo } from "@/components/CaseFloatingVideo";
import { CaseFooterNav } from "@/components/CaseFooterNav";
import { SiteChrome } from "@/components/SiteChrome";
import { caseImages } from "@/lib/caseImages";

export const metadata: Metadata = {
  title: "设计创新",
  description: "围绕业务问题做创新，并落到专利与设计成果中",
};

export default function InnovationPage() {
  const IMAGES = caseImages("innovation", 13);
  const imagesThumbs = IMAGES.map(({ src, ar }) => ({ src, ar }));
  // 视频插在第一张图后面，在 index 1 补一个占位缩略图保持导航条对齐
  const thumbs = [
    imagesThumbs[0],
    imagesThumbs[1],
    ...imagesThumbs.slice(1),
  ];
  return (
    <>
      <SiteChrome thumbs={thumbs} variant="light" />
      <main className="bg-black text-white">
        <section className="px-4 pt-32 pb-16 md:px-8 md:pt-40 md:pb-24">
          <h1 className="text-[10vw] font-bold leading-[0.9] tracking-[-0.04em] md:text-[8vw] pb-4">
            设计创新
          </h1>
          <p className="md:mt-4 text-lg text-white/60">围绕业务问题做创新，并落到专利与设计成果中 · &apos;21 − &apos;25</p>
        </section>

        <div className="flex flex-col gap-2 px-2 md:gap-3 md:px-3">
          {IMAGES.map((image, i) => (
            <div key={i} className="contents">
              <div className="overflow-hidden bg-neutral-900">
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
              {i === 0 ? (
                <div className="grid grid-cols-1">
                  <CaseFloatingVideo src="/videos/innovation-aime-brand.mp4" />
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <CaseFooterNav currentSlug="innovation" />
      </main>
    </>
  );
}

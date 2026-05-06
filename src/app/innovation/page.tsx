import type { Metadata } from "next";
import Image from "next/image";
import { CaseFloatingVideo } from "@/components/CaseFloatingVideo";
import { CaseFooterNav } from "@/components/CaseFooterNav";
import { SiteChrome } from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "设计创新",
  description: "围绕业务问题做创新，并落到专利与设计成果中",
};

const IMAGES = [
  "/images/chuangxin-ordered/01-46.专利.png",
  "/images/chuangxin-ordered/02-47.专利.png",
  "/images/chuangxin-ordered/03-48.专利.png",
  "/images/chuangxin-ordered/04-49.专利.png",
  "/images/chuangxin-ordered/05-50.专利.png",
  "/images/chuangxin-ordered/06-51.专利.png",
  "/images/chuangxin-ordered/07-52.专利.png",
  "/images/chuangxin-ordered/08-53.专利.png",
  "/images/chuangxin-ordered/09-54.专利.png",
  "/images/chuangxin-ordered/10-55.专利.png",
  "/images/chuangxin-ordered/11-56.专利.png",
  "/images/chuangxin-ordered/12-57.专利.png",
  "/images/chuangxin-ordered/13-58.专利.png",
];

export default function InnovationPage() {
  const thumbs = IMAGES.map((src) => ({ src, ar: 16 / 9 }));
  return (
    <>
      <SiteChrome thumbs={thumbs} variant="light" />
      <main className="bg-black text-white">
        <section className="px-4 pt-32 pb-16 md:px-8 md:pt-40 md:pb-24">
          <h1 className="text-[10vw] font-bold leading-[0.9] tracking-[-0.04em] md:text-[8vw] pb-4">
            设计创新
          </h1>
          <p className="mt-4 text-lg text-white/60">围绕业务问题做创新，并落到专利与设计成果中 · &apos;21 − &apos;25</p>
        </section>

        <div className="flex flex-col gap-2 px-2 md:gap-3 md:px-3">
          {IMAGES.map((src, i) => (
            <div key={i} className="contents">
              <div className="overflow-hidden bg-neutral-900">
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
              {src === "/images/chuangxin-ordered/01-46.专利.png" ? (
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

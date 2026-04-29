import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteChrome } from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "Invocable – 对话式 UI 的无代码构建器",
  description: "对话式 UI 的无代码构建器",
};

const IMAGES = [
  "/images/chuangxin/1.专利.png",
  "/images/chuangxin/2.专利.png",
  "/images/chuangxin/3.专利.png",
  "/images/chuangxin/4.专利.png",
  "/images/chuangxin/5.专利.png",
  "/images/chuangxin/6.专利.png",
  "/images/chuangxin/7.专利.png",
  "/images/chuangxin/8.专利.png",
  "/images/chuangxin/9.专利.png",
  "/images/chuangxin/10.专利.png",
  "/images/chuangxin/11.专利.png",
  "/images/chuangxin/12.专利.png",
  "/images/chuangxin/37.专利.png",
];

export default function InvocablePage() {
  const thumbs = IMAGES.map((src) => ({ src, ar: 16 / 9 }));
  return (
    <>
      <SiteChrome thumbs={thumbs} />
      <main className="bg-black text-white">
        <section className="px-4 pt-32 pb-16 md:px-8 md:pt-40 md:pb-24">
          <h1 className="text-[10vw] font-bold uppercase leading-[0.9] tracking-[-0.04em] md:text-[8vw]">
            Invocable
          </h1>
          <p className="mt-4 text-lg text-white/60">对话式 UI 的无代码构建器 · ’18 – 19</p>
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

        <nav className="border-t border-white/15 px-4 py-8 md:px-10 mt-16">
          {[
            { label: "返回首页", href: "/" },
            { label: "Projects", href: "/#case-studies" },
          ].map((it) => (
            <Link
              key={it.label}
              href={it.href}
              className="flex items-center justify-between border-t border-white/15 py-5 text-2xl uppercase tracking-tight transition-colors hover:text-white/60 md:text-3xl"
            >
              <span>{it.label}</span>
              <span className="text-white">→</span>
            </Link>
          ))}
        </nav>
      </main>
    </>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteChrome } from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "钉钉 AI 产品实践",
  description: "设计即交付：把设计推进到结果",
};

const IMAGES = [
  "/images/dingtalk/1.png",
  "/images/dingtalk/2.png",
  "/images/dingtalk/3.png",
  "/images/dingtalk/4.png",
  "/images/dingtalk/5.png",
  "/images/dingtalk/6.png",
  "/images/dingtalk/7.png",
  "/images/dingtalk/8.png",
];

export default function DingtalkPage() {
  const thumbs = IMAGES.map((src) => ({ src, ar: 16 / 9 }));
  return (
    <>
      <SiteChrome thumbs={thumbs} />
      <main className="bg-black text-white">
        <section className="px-4 pt-32 pb-16 md:px-8 md:pt-40 md:pb-24">
          <h1 className="text-[10vw] font-bold leading-[0.9] tracking-[-0.04em] md:text-[8vw] pb-4">
            钉钉 AI 产品实践
          </h1>
          <p className="mt-8 text-lg text-white/60">设计即交付：把设计推进到结果 · &apos;26</p>
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
            { label: "作品", href: "/#work" },
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

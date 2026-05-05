import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteChrome } from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "问财智能投顾",
  description: "AI+金融，交互范式升级，让答案可理解、可验证",
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

const PROJECT_INFO = `问财智能投顾项目围绕 AI+金融场景展开，重点解决大模型回答在专业决策中的可理解、可验证和可追溯问题。

设计上，我从用户任务、信息层级和风险提示出发，梳理问答过程中的输入、生成、引用、追问与结果呈现规则，让复杂金融信息能被更快理解。

项目同时沉淀了多轮对话、数据解释、图表辅助和异常状态的设计规范，帮助体验从单点页面延展到可复用的产品系统。

这些工作支持了智能投顾场景中的交互范式升级，也让我形成了从问题发现、规则定义到实现推进的完整方法。`;

const CREDITS = `产品体验设计
钟家豪

方向
AI 金融产品 / 对话体验 / 设计规范`;

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
      <SiteChrome thumbs={thumbs} />
      <main className="bg-black text-white">
        <section className="px-4 pt-32 pb-16 md:px-8 md:pt-40 md:pb-24">
          <h1 className="text-[10vw] font-bold leading-[0.9] tracking-[-0.04em] md:text-[8vw] pb-4">
            问财智能投顾
          </h1>
          <p className="mt-4 text-lg text-white/60">AI+金融，交互范式升级，让答案可理解、可验证 · &apos;23 − &apos;25</p>
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
            <h2 className="text-sm uppercase tracking-widest text-white/60">项目信息</h2>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-white/85 md:text-base">
              {PROJECT_INFO.split("\n\n").map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-sm uppercase tracking-widest text-white/60">项目角色</h2>
            <div className="mt-4 whitespace-pre-line text-sm leading-relaxed text-white/85 md:text-base">
              {CREDITS}
            </div>
          </div>
          <div>
            <h2 className="text-sm uppercase tracking-widest text-white/60">作品图片</h2>
            <p className="mt-4 text-sm leading-relaxed text-white/85 md:text-base">
              页面展示为项目关键页面与设计过程节选。
            </p>
          </div>
        </section>

        <nav className="border-t border-white/15 px-4 py-8 md:px-10">
          {[
            { label: "返回首页", href: "/" },
            { label: "作品", href: "/#work" },
            { label: "关于", href: "/#about" },
            { label: "联系", href: "/#about" },
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

        <footer className="flex flex-wrap items-center justify-between gap-4 px-4 py-10 text-xs text-white/50 md:px-10">
          <span>© 钟家豪</span>
          <div className="flex gap-6">
            <a href="mailto:zjh532169990@163.com" className="hover:text-white">Email</a>
            <a href="tel:17681828517" className="hover:text-white">Phone</a>
            <Link href="/#about" className="hover:text-white">WeChat</Link>
          </div>
        </footer>
      </main>
    </>
  );
}

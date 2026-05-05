import type { CaseStudy } from "@/types/portfolio";

export const caseStudies: CaseStudy[] = [
  {
    slug: "dingtalk",
    title: "钉钉 AI 产品实践",
    caption: "设计即交付：把设计推进到结果",
    year: "'26",
    href: "/dingtalk",
    image: { src: "/images/case-dingtalk.png", alt: "钉钉 AI 产品实践" },
    imageBg: "rgba(209, 227, 255, 0.88)",
    ctaLabel: "查看作品",
  },
  {
    slug: "wencai",
    title: "问财智能投顾",
    caption: "AI+金融，交互范式升级，让答案可理解、可验证",
    year: "'23 − '25",
    href: "/wencai",
    image: { src: "/images/case-wencai.png", alt: "问财智能投顾" },
    ctaLabel: "查看作品",
  },
  {
    slug: "chat-spec",
    title: "智能对话设计规范",
    caption: "统一对话组件与规则，让设计直接进入开发与使用",
    year: "'23 − '25",
    href: "/chat-spec",
    image: { src: "/images/case-chatspec.png", alt: "智能对话设计规范" },
    ctaLabel: "查看作品",
  },
  {
    slug: "innovation",
    title: "设计创新",
    caption: "围绕业务问题做创新，并落到专利与设计成果中",
    year: "'21 − '25",
    href: "/innovation",
    image: { src: "/images/case-innovation.png", alt: "设计创新" },
    ctaLabel: "查看作品",
  },
];

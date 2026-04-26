import type { PublicationCard, ToolCard } from "@/types/portfolio";

export const articles: PublicationCard[] = [
  {
    href: "https://medium.com/@gregory.murynmukha/your-ai-agent-can-read-your-codebase-it-doesnt-know-your-product-b5ea0cd77989",
    bg: "/images/pub-ai-context-bg.png",
    logo: "/images/pub-ai-context-logo.png",
    title: "你的 AI agent 能读你的代码库，但它并不懂你的产品。",
    caption:
      "如何把品牌、UX 模式与视觉语言喂给 AI 编码 agent —— 这些恰恰不在代码里",
  },
  {
    href: "https://medium.com/design-bootcamp/perception-based-color-palettes-for-customizable-ui-themes-33f596faf23d",
    bg: "/images/pub-colors-bg.png",
    logo: "/images/pub-colors-logo.png",
    logoBg: "#000000",
    title: "基于感知的色板：为可定制 UI 主题选对色彩空间",
    caption:
      "选择正确的色彩空间，基于人眼感知生成对比度一致的调色板",
  },
  {
    href: "https://dribbble.com/stories/2020/03/26/5-tips-dashboard-design",
    bg: "/images/pub-dashboard-bg.png",
    logo: "/images/pub-dashboard-logo.png",
    logoBg: "#FFACE6",
    title: "更好的仪表盘设计：5 条进阶建议",
    caption:
      "面向数据密集型仪表盘的实用模式：对齐、图表选型、层级与异常感知",
  },
];

export const tools: ToolCard[] = [
  {
    href: "https://github.com/gregorymm/design-tokens",
    logo: "/images/tool-design-tokens.png",
    logoAlt: "Design tokens",
    titleFull: "Design tokens · Claude Code 插件",
    titleShort: "Design tokens",
    captionFull: "把 Figma 变量提取为 W3C DTCG tokens",
    captionShort: "提取 tokens 至 W3C DTCG",
  },
  {
    href: "https://github.com/gregorymm/humanize-text",
    logo: "/images/tool-humanize-cc.png",
    logoAlt: "Humanize text",
    titleFull: "Humanize text · Claude Code 插件",
    titleShort: "Humanize text",
    captionFull: "评估并改写文本，去除 AI 写作痕迹",
    captionShort: "改写并去除 AI 痕迹",
  },
  {
    href: "https://github.com/gregorymm/design-review-plugin",
    logo: "/images/tool-review-cc.png",
    logoAlt: "Design review",
    titleFull: "Design review · Claude Code skill",
    titleShort: "Design review",
    captionFull: "按专业标准对 UI/UX 设计做评审",
    captionShort: "按专业标准评审设计",
  },
  {
    href: "https://github.com/gregorymm/job-scout",
    logo: "/images/tool-job-scout.png",
    logoAlt: "Job scout",
    titleFull: "Job scout · Claude Code skill",
    titleShort: "Job scout",
    captionFull: "抓取并按你的 CV 给职位排序",
    captionShort: "抓取并对职位排序",
  },
  {
    href: "https://www.figma.com/community/plugin/1620574471890652269/chromasmith",
    logo: "/images/tool-chromasmith.png",
    logoAlt: "Chromasmith",
    titleFull: "Chromasmith · Figma 插件",
    titleShort: "Chromasmith",
    captionFull: "由一个强调色出发，AI 生成 OKLAB 色板",
    captionShort: "AI OKLAB 色板生成器",
  },
  {
    href: "https://www.figma.com/community/plugin/1619710368646415057/humanize-text",
    logo: "/images/tool-humanize-figma.png",
    logoAlt: "Humanize text Figma",
    titleFull: "Humanize text · Figma 插件",
    titleShort: "Humanize text",
    captionFull: "重写 UI 中的文本图层，去除 AI 痕迹",
    captionShort: "重写 UI 文本去除 AI 痕迹",
  },
];

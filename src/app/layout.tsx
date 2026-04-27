import type { Metadata } from "next";
import localFont from "next/font/local";
import { Cormorant_Garamond, Inter, Manrope, Noto_Serif_SC } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "900"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const notoSerifSc = Noto_Serif_SC({
  variable: "--font-noto-serif-sc",
  subsets: ["latin"],
  weight: ["900"],
});

const fzFont140 = localFont({
  src: "./fonts/FZfont140.ttf",
  variable: "--font-fzfont140",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gregory Muryn-Mukha — 创始产品设计师",
  description: "创始产品设计师，专注于帮助早期初创公司定义、设计并交付高影响力产品。15 年经验，其中 9 年专注于 NLP 与生成式 AI。",
  metadataBase: new URL("https://murynmukha.com"),
  openGraph: {
    title: "Gregory Muryn-Mukha — 创始产品设计师",
    description: "创始产品设计师，专注于帮助早期初创公司定义、设计并交付高影响力产品。",
    type: "website",
    url: "https://murynmukha.com",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630 }],
  },
  icons: {
    icon: [
      { url: "/seo/favicon.ico", sizes: "48x48" },
      { url: "/seo/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/seo/apple-touch-icon.png",
  },
  manifest: "/seo/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      className={`${inter.variable} ${manrope.variable} ${cormorantGaramond.variable} ${notoSerifSc.variable} ${fzFont140.variable}`}
    >
      <head>
        <script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async />
      </head>
      <body className="fonts-ready">{children}</body>
    </html>
  );
}

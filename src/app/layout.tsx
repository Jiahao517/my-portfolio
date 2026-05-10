import type { Metadata } from "next";
import localFont from "next/font/local";
import { Cormorant_Garamond, Inter, Manrope, Noto_Serif_SC } from "next/font/google";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { ClarityScript } from "@/components/ClarityScript";
import { ContactModalProvider } from "@/components/ContactModal";
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
  src: "./fonts/FZfont140-subset.woff2",
  variable: "--font-fzfont140",
  display: "swap",
});

export const metadata: Metadata = {
  title: "钟家豪 — AI 产品体验设计师",
  description: "AI 产品体验设计师，关注复杂业务场景、对话体验、设计系统与产品落地交付。",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://zhongjiahao.com"),
  openGraph: {
    title: "钟家豪 — AI 产品体验设计师",
    description: "AI 产品体验设计师，关注复杂业务场景、对话体验、设计系统与产品落地交付。",
    type: "website",
    url: "/",
    images: [{ url: "/images/assistant-avatar.png", width: 180, height: 180 }],
  },
  icons: {
    icon: [
      { url: "/seo/favicon.png", type: "image/png", sizes: "180x180" },
      { url: "/seo/favicon.ico", sizes: "48x48" },
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
        {process.env.NODE_ENV === "development" ? (
          <script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async />
        ) : null}
      </head>
      <body className="fonts-ready">
        <ContactModalProvider>{children}</ContactModalProvider>
        <AnalyticsTracker />
        <ClarityScript />
      </body>
    </html>
  );
}

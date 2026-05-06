export type CaseStudy = {
  slug: string;
  title: string;
  caption: string;
  year: string;
  href: string;
  externalHref?: string;
  websiteHref?: string;
  image?: { src: string; alt: string };
  video?: { src: string };
  imageBg?: string;
  cropVariant?: "crop-1" | "crop-2";
  ctaLabel: string;
};

export type ExperienceRow = {
  logo: string;
  logoAlt: string;
  logoRadius?: number;
  title: string;
  company: string;
  period: string;
  description: string;
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

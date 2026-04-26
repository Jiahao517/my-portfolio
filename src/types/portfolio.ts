export type Testimonial = {
  name: string;
  role: string;
  photo: string;
  quote: string[];
};

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

export type PublicationCard = {
  href: string;
  bg: string;
  logo: string;
  logoBg?: string;
  title: string;
  caption: string;
};

export type ToolCard = {
  href: string;
  logo: string;
  logoAlt: string;
  titleFull: string;
  titleShort: string;
  captionFull: string;
  captionShort: string;
};

export type AiPill = {
  href: string;
  icon: string;
  label: string;
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

import Link from "next/link";
import { caseStudies } from "@/data/case-studies";

type CaseFooterNavProps = {
  currentSlug: string;
};

const FOOTER_LINKS = [
  { label: "返回首页", href: "/", slug: "home" },
  ...caseStudies.map((study) => ({
    label: study.title,
    href: study.href,
    slug: study.slug,
  })),
];

export function CaseFooterNav({ currentSlug }: CaseFooterNavProps) {
  return (
    <nav className="pt-8 pb-28 md:pb-32">
      {FOOTER_LINKS.map((item) => {
        const isCurrent = item.slug === currentSlug;

        return (
          <Link
            key={item.slug}
            href={item.href}
            className={`group flex items-center justify-between border-t border-white/15 px-4 py-5 text-2xl uppercase tracking-tight transition-colors md:px-10 md:text-3xl ${
              isCurrent ? "cursor-default" : "hover:bg-white/[0.04]"
            }`}
            aria-current={isCurrent ? "page" : undefined}
          >
            <span
              className={
                isCurrent
                  ? "text-white/35"
                  : "text-white transition-colors group-hover:text-white/60"
              }
            >
              {item.label}
            </span>
            <span
              className={
                isCurrent
                  ? "text-white/35"
                  : "text-white transition-[color,transform] group-hover:translate-x-1 group-hover:text-white/60"
              }
            >
              →
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

import type { SVGProps } from "react";

export function ArrowRightIcon({ fill = "#FFF1F2", ...props }: SVGProps<SVGSVGElement> & { fill?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.75 11C5.33579 11 5 11.3358 5 11.75C5 12.1642 5.33579 12.5 5.75 12.5L16.6487 12.5L13.1738 16.2698C12.9087 16.5881 12.9517 17.061 13.2699 17.3261C13.5881 17.5913 14.061 17.5483 14.3262 17.2301L18.8262 12.2301C19.0579 11.952 19.0579 11.548 18.8262 11.2698L14.3262 6.26984C14.061 5.95163 13.5881 5.90864 13.2699 6.17382C12.9517 6.43899 12.9087 6.91191 13.1738 7.23012L16.6487 11L5.75 11Z"
        fill={fill}
      />
    </svg>
  );
}

export function ArrowLeftIcon({ fill = "#002E71", ...props }: SVGProps<SVGSVGElement> & { fill?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.25 11C18.6642 11 19 11.3358 19 11.75C19 12.1642 18.6642 12.5 18.25 12.5L7.35127 12.5L10.8262 16.2698C11.0913 16.5881 11.0483 17.061 10.7301 17.3261C10.4119 17.5913 9.939 17.5483 9.67383 17.2301L5.17383 12.2301C4.94205 11.952 4.94205 11.548 5.17383 11.2698L9.67383 6.26984C9.939 5.95163 10.4119 5.90864 10.7301 6.17382C11.0483 6.43899 11.0913 6.91191 10.8262 7.23012L7.35129 11L18.25 11Z"
        fill={fill}
      />
    </svg>
  );
}

export function GlobeIcon({ stroke = "#6B6666", ...props }: SVGProps<SVGSVGElement> & { stroke?: string }) {
  return (
    <svg className="globe-svg" viewBox="0 0 22 22" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="11" cy="11" r="10" stroke={stroke} strokeWidth="1.5" />
      <line x1="1" y1="11" x2="21" y2="11" stroke={stroke} strokeWidth="1.5" />
      <ellipse className="globe-meridian" cx="11" cy="11" rx="10" ry="10" stroke={stroke} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      <ellipse className="globe-meridian m2" cx="11" cy="11" rx="10" ry="10" stroke={stroke} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

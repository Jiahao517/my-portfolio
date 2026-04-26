import { SequoiaLogo, YCombinatorLogo } from "@/components/icons";

export function LogosSection() {
  return (
    <div className="logos-section">
      <svg className="logos-section__divider" preserveAspectRatio="none" viewBox="0 0 100 1" aria-hidden>
        <line x1="0" y1="0.5" x2="100" y2="0.5" stroke="#F5F0F0" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="logos-section__content">
        <p className="logos-section__title">由一线机构支持的初创团队的创始设计师</p>
        <div className="logos-section__logos">
          <YCombinatorLogo />
          <SequoiaLogo />
        </div>
      </div>
      <svg className="logos-section__divider" preserveAspectRatio="none" viewBox="0 0 100 1" aria-hidden>
        <line x1="0" y1="0.5" x2="100" y2="0.5" stroke="#F5F0F0" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}

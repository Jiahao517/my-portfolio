import { GlobeIcon } from "@/components/icons";

/**
 * Murynmukha original hero text block (kept as a flow section after the video hero).
 * Pixel-aligned with original DOM/classes so the existing CSS does the work.
 */
export function HeroBio() {
  return (
    <>
      <h1 className="hero-name shiny-hover reveal-load reveal-load--active">
        我是 Gregory，把那些晦涩的技术，做成一眼就看懂的产品。
      </h1>
      <div className="hero-bio reveal-load reveal-load--active">
        <p>
          我很早就加入初创团队，通常在产品还没诞生之前。我把它定义出来、设计出来，再和工程师一起交付。没有交接、没有断档。15 年经验，其中 9 年在做 AI 产品。
        </p>
        <p className="hero-bio--location">
          <span className="globe-wrap">
            <GlobeIcon />
          </span>
          <span>柏林（Berlin）。可远程协作。</span>
        </p>
      </div>
    </>
  );
}

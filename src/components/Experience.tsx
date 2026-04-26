import Image from "next/image";
import { experience } from "@/data/experience";

export function Experience() {
  return (
    <section id="experience" className="section experience-section">
      <div className="centered">
        <h2 className="experience__heading shiny-hover reveal-scroll">经历</h2>
        <div className="experience__rows">
          {experience.map((row, i) => (
            <div key={i} className="experience__row reveal-scroll">
              <div className="experience__left">
                <Image
                  src={row.logo}
                  alt={row.logoAlt}
                  className="experience__logo"
                  style={{ borderRadius: row.logoRadius ?? 14 }}
                  width={56}
                  height={56}
                />
                <div className="experience__details">
                  <div className="experience__title">{row.title}</div>
                  <div className="experience__caption">
                    {row.company}
                    <span className="experience__caption-dot">&nbsp;・&nbsp;</span>
                    {row.period}
                  </div>
                </div>
              </div>
              <p className="experience__desc">{row.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { experience } from "@/data/experience";
import { ExperienceRowExpand } from "./ExperienceRowExpand";

export function Experience() {
  const visibleExperience = experience.slice(0, 4);

  return (
    <section id="experience" className="section experience-section">
      <div className="centered">
        <h2 className="experience__heading shiny-hover reveal-scroll">经历</h2>
        <div className="experience__rows">
          {visibleExperience.map((row, i) => (
            <div key={i} className="experience__row reveal-scroll">
              <div className="experience__left">
                <div
                  className={`experience__logo-wrap${i >= 2 ? " experience__logo-wrap--stroke" : ""}`}
                  style={{ borderRadius: row.logoRadius }}
                >
                  <img
                    src={row.logo}
                    alt={row.logoAlt}
                    className="experience__logo"
                    style={{ borderRadius: row.logoRadius }}
                  />
                </div>
                <div className="experience__details">
                  <div className="experience__title">{row.title}</div>
                  <div className="experience__caption">
                    {row.company}
                    <span className="experience__caption-dot">&nbsp;・&nbsp;</span>
                    {row.period}
                  </div>
                </div>
              </div>
              <ExperienceRowExpand description={row.description} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

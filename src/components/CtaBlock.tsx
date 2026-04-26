import { ArrowRightIcon } from "@/components/icons";

export function CtaBlock() {
  return (
    <section className="cta-block reveal-scroll">
      <div className="centered">
        <div className="cta-block__content">
          <span className="cta-block__label cta-block__label--desktop shiny-hover shiny-hover--blue">
            正在做点什么？聊聊吧
          </span>
          <span className="cta-block__label cta-block__label--mobile shiny-hover shiny-hover--blue">
            正在做点什么？聊聊吧
          </span>
          <a
            href="https://calendar.app.google/e1nq9HDsCKAYrq6S7"
            target="_blank"
            rel="noopener"
            className="case-study__btn cta-block__btn"
          >
            <span>预约一次聊聊</span>
            <ArrowRightIcon />
          </a>
        </div>
      </div>
    </section>
  );
}

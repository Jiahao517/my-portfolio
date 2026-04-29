"use client";

import { Magnet } from "@/components/Magnet";
import { ContactPopover } from "@/components/ContactPopover";

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
          <ContactPopover>
            <Magnet padding={60} magnetStrength={2}>
              <span className="case-study__btn cta-block__btn">
                <span>与我联系</span>
              </span>
            </Magnet>
          </ContactPopover>
        </div>
      </div>
    </section>
  );
}

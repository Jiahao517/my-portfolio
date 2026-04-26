import Image from "next/image";
import { articles, tools } from "@/data/publications";

export function Publications() {
  return (
    <section id="publications" className="section publications-section">
      <div className="centered">
        <h2 className="publications__heading shiny-hover reveal-scroll">发表</h2>
        <div className="publications__content">
          <div className="publications__articles reveal-scroll">
            {articles.map((a) => (
              <a key={a.href} href={a.href} target="_blank" rel="noopener" className="pub-article">
                <div className="pub-article__image pub-article__tilt">
                  <Image src={a.bg} alt="" className="pub-article__bg" width={296} height={296} />
                  <Image
                    src={a.logo}
                    alt=""
                    className="pub-article__logo"
                    width={112}
                    height={112}
                    style={a.logoBg ? { background: a.logoBg } : undefined}
                  />
                </div>
                <div className="pub-article__details">
                  <h3 className="pub-article__title">{a.title}</h3>
                  <p className="pub-article__caption">{a.caption}</p>
                </div>
              </a>
            ))}
          </div>

          <div className="publications__tools reveal-scroll">
            {tools.map((t) => (
              <a key={t.href} href={t.href} target="_blank" rel="noopener" className="pub-tool">
                <Image
                  src={t.logo}
                  alt={t.logoAlt}
                  className="pub-tool__logo"
                  width={56}
                  height={56}
                />
                <div className="pub-tool__details">
                  <div className="pub-tool__title">
                    <span className="pub-tool__title-full">{t.titleFull}</span>
                    <span className="pub-tool__title-short">{t.titleShort}</span>
                  </div>
                  <div className="pub-tool__caption">
                    <span className="pub-tool__caption-full">{t.captionFull}</span>
                    <span className="pub-tool__caption-short">{t.captionShort}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

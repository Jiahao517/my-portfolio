import { About } from "@/components/About";
import { ArtFooter } from "@/components/ArtFooter";
import { CaseStudies } from "@/components/CaseStudies";
import { ContactAI } from "@/components/ContactAI";
import { Experience } from "@/components/Experience";
import { HeroVideo } from "@/components/HeroVideo";
import { RevealController } from "@/components/RevealController";
import { SiteChrome } from "@/components/SiteChrome";
import { SocialProof } from "@/components/SocialProof";
import { caseStudies } from "@/data/case-studies";
import { publicImage } from "@/lib/caseImages";

export default function Home() {
  const studies = caseStudies.map((study) => ({
    ...study,
    image: study.image ? { ...study.image, src: publicImage(study.image.src) } : undefined,
  }));
  const heroTrailImages = [
    "/images/case-dingtalk.png",
    "/images/case-wencai.png",
    "/images/case-chatspec.png",
    "/images/case-innovation.png",
    "/case-images/dingtalk/01.png",
    "/case-images/dingtalk/02.png",
    "/case-images/wencai/01.png",
    "/case-images/wencai/02.png",
    "/case-images/chat-spec/02.png",
    "/case-images/innovation/01.png",
    "/case-images/innovation/02.png",
  ].map(publicImage);

  return (
    <>
      <SiteChrome thumbs={[]} variant="light" />

      <main className="content">
        <HeroVideo trailImages={heroTrailImages} />

        <section id="services" className="section section--hero" data-analytics-section="services">
          <div className="centered">
            <SocialProof />
          </div>
          <ContactAI />
          <div className="centered">
            <CaseStudies studies={studies} />
          </div>
        </section>

        <Experience />
        <About />

        <ArtFooter />
      </main>

      <RevealController />
    </>
  );
}

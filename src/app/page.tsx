import { About } from "@/components/About";
import { ArtFooter } from "@/components/ArtFooter";
import { CaseStudies } from "@/components/CaseStudies";
import { ContactAI } from "@/components/ContactAI";
import { Experience } from "@/components/Experience";
import { HeroVideo } from "@/components/HeroVideo";
import { RevealController } from "@/components/RevealController";
import { SiteChrome } from "@/components/SiteChrome";
import { SocialProof } from "@/components/SocialProof";

export default function Home() {
  return (
    <>
      <SiteChrome thumbs={[]} variant="light" />

      <main className="content">
        <HeroVideo />

        <section id="services" className="section section--hero">
          <div className="centered">
            <SocialProof />
            <CaseStudies />
          </div>
        </section>

        <Experience />
        <About />
        <ContactAI />

        <ArtFooter />
      </main>

      <RevealController />
    </>
  );
}

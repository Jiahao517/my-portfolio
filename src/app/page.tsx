import { About } from "@/components/About";
import { ArtFooter } from "@/components/ArtFooter";
import { CaseStudies } from "@/components/CaseStudies";
import { ContactAI } from "@/components/ContactAI";
import { CtaBlock } from "@/components/CtaBlock";
import { Experience } from "@/components/Experience";
import { HeroBio } from "@/components/HeroBio";
import { HeroVideo } from "@/components/HeroVideo";
import { LogosSection } from "@/components/LogosSection";
import { MobileHeader } from "@/components/MobileHeader";
import { Publications } from "@/components/Publications";
import { RevealController } from "@/components/RevealController";
import { Sidebar } from "@/components/Sidebar";
import { SocialProof } from "@/components/SocialProof";

export default function Home() {
  return (
    <>
      <MobileHeader />
      <Sidebar />

      <main className="content">
        <HeroVideo />

        <section id="services" className="section section--hero">
          <div className="centered">
            <HeroBio />
            <SocialProof />
            <LogosSection />
            <CaseStudies />
          </div>
        </section>

        <Experience />
        <CtaBlock />
        <Publications />
        <About />
        <ContactAI />

        <ArtFooter />
      </main>

      <RevealController />
    </>
  );
}

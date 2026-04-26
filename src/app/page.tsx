import { About } from "@/components/About";
import { ArtFooter } from "@/components/ArtFooter";
import { CaseStudies } from "@/components/CaseStudies";
import { ContactAI } from "@/components/ContactAI";
import { CtaBlock } from "@/components/CtaBlock";
import { Experience } from "@/components/Experience";
import { HeroBio } from "@/components/HeroBio";
import { HeroVideo } from "@/components/HeroVideo";
import { MobileHeader } from "@/components/MobileHeader";
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
            <CaseStudies />
          </div>
        </section>

        <Experience />
        <CtaBlock />
        <About />
        <ContactAI />

        <ArtFooter />
      </main>

      <RevealController />
    </>
  );
}

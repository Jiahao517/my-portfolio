import { About } from "@/components/About";
import { ArtFooter } from "@/components/ArtFooter";
import { CaseStudies } from "@/components/CaseStudies";
import { ContactAI } from "@/components/ContactAI";
import { Experience } from "@/components/Experience";
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

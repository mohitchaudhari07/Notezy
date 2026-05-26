import CTASection from "../../components/home/CTASection";
import ContactSection from "../../components/home/ContactSection";
import FAQSection from "../../components/home/FAQSection";
import Hero from "../../components/home/Hero";
import StatsSection from "../../components/home/StatsSection";
import TeamSection from "../../components/home/TeamSection";

export default function Home() {
  return (
    <>
      <Hero />
      <StatsSection />
      <TeamSection />
      <ContactSection />
      <FAQSection />
      <CTASection />
    </>
  );
}

import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import AboutSection from "@/components/landing/AboutSection";
import TeamSection from "@/components/landing/TeamSection";
import DemoSection from "@/components/landing/DemoSection";
import LandingFooter from "@/components/landing/LandingFooter";
import { useReveal } from "@/components/landing/useReveal";

export default function LandingPage() {
  useReveal();

  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <TeamSection />
      <DemoSection />
      <LandingFooter />
    </div>
  );
}

"use client";

import {
  LandingNav,
  Hero,
  StatsBar,
  Features,
  HowItWorks,
  TemplateShowcase,
  DeploySection,
  BuiltForBrands,
  FAQ,
  FinalCTA,
  Footer,
} from "@/components/landing";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--bg-primary)]">
      <LandingNav />
      <Hero />
      <StatsBar />
      <Features />
      <HowItWorks />
      <TemplateShowcase />
      <DeploySection />
      <BuiltForBrands />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { AboutTallowSection } from "./~components/-about-tallow-section";
import { CTASection } from "./~components/-cta-section";
import { FeaturesSection } from "./~components/-features-section";
import { IntroSection } from "./~components/-intro-section";

export const Route = createFileRoute("/_public/")({
  component: HomePage,
  head: () => ({
    meta: [
      {
        title: "Terra & Tallow | Cosméticos e produtos naturais artesanais",
      },
    ],
  }),
});

function HomePage() {
  return (
    <main>
      <IntroSection />
      <FeaturesSection />
      <AboutTallowSection />
      <CTASection />
    </main>
  );
}

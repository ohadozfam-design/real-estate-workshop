import { useState } from "react";
import HeroSection from "./components/HeroSection";
import LogisticsSection from "./components/LogisticsSection";
import TreasureMap from "./components/TreasureMap";
import InstructorSection from "./components/InstructorSection";
import ValueStack from "./components/ValueStack";
import OrderBumpCheckout from "./components/OrderBumpCheckout";
import StickyMobileCTA from "./components/StickyMobileCTA";

export default function App() {
  const [bumpSelected, setBumpSelected] = useState(false);

  return (
    <div className="relative min-h-screen">
      <main className="pb-24 lg:pb-0">
        <HeroSection />
        <SectionDivider />
        <LogisticsSection />
        <SectionDivider />
        <TreasureMap />
        <SectionDivider />
        <InstructorSection />
        <SectionDivider />
        <ValueStack />
        <OrderBumpCheckout bumpSelected={bumpSelected} onToggle={setBumpSelected} />
      </main>

      <footer className="border-t border-drift/15 px-5 py-10 text-center">
        <p className="mx-auto max-w-2xl text-xs leading-relaxed text-drift">
          כל הזכויות שמורות · הסדנה הינה תוכן חינוכי ופרקטי ואינה מהווה ייעוץ
          השקעות, ייעוץ מס או ייעוץ משפטי. תוצאות עשויות להשתנות בהתאם ליישום בפועל.
        </p>
      </footer>

      <StickyMobileCTA bumpSelected={bumpSelected} />
    </div>
  );
}

function SectionDivider() {
  return (
    <div className="mx-auto max-w-5xl px-5">
      <div className="hairline" />
    </div>
  );
}

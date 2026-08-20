import { useEffect, useState } from "react";
import HeroSection from "./components/HeroSection";
import LogisticsSection from "./components/LogisticsSection";
import CurriculumSection from "./components/CurriculumSection";
import InstructorSection from "./components/InstructorSection";
import ValueStack from "./components/ValueStack";
import FaqSection from "./components/FaqSection";
import OrderBumpCheckout from "./components/OrderBumpCheckout";
import StickyMobileCTA from "./components/StickyMobileCTA";
import ThankYouModal from "./components/ThankYouModal";

export default function App() {
  const [bumpSelected, setBumpSelected] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  // Detect the post-payment redirect (?checkout=success) on load.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("checkout") === "success") setShowThankYou(true);
  }, []);

  function closeThankYou() {
    setShowThankYou(false);
    // Clean the query param from the URL without a reload.
    window.history.replaceState({}, "", window.location.pathname);
  }

  return (
    <div className="relative min-h-screen">
      <main className="pb-24 lg:pb-0">
        <HeroSection />
        <SectionDivider />
        <LogisticsSection />
        <SectionDivider />
        <CurriculumSection />
        <SectionDivider />
        <InstructorSection />
        <SectionDivider />
        <ValueStack />
        <SectionDivider />
        <FaqSection />
        <OrderBumpCheckout bumpSelected={bumpSelected} onToggle={setBumpSelected} />
      </main>

      <footer className="border-t border-drift/15 px-5 py-10 text-center">
        <p className="text-lg font-extrabold tracking-tight text-cloud">
          וורקשופ כניסה לעולם הנדל״ן
        </p>
        <p className="mt-1 text-sm font-semibold text-drift">עם אוהד עוז</p>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-drift">
          כל הזכויות שמורות · הוורקשופ הינה תוכן חינוכי ופרקטי ואינה מהווה ייעוץ
          השקעות, ייעוץ מס או ייעוץ משפטי. תוצאות עשויות להשתנות בהתאם ליישום בפועל.
        </p>
      </footer>

      <StickyMobileCTA bumpSelected={bumpSelected} />
      <ThankYouModal open={showThankYou} onClose={closeThankYou} />
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

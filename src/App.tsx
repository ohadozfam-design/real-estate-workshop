import { useEffect, useState } from "react";
import HeroSection from "./components/HeroSection";
import LogisticsSection from "./components/LogisticsSection";
import CurriculumSection from "./components/CurriculumSection";
import InstructorSection from "./components/InstructorSection";
import ValueStack from "./components/ValueStack";
import StudentSuccess from "./components/StudentSuccess";
import CaseStudies from "./components/CaseStudies";
import FaqSection from "./components/FaqSection";
import OrderBumpCheckout from "./components/OrderBumpCheckout";
import StickyMobileCTA from "./components/StickyMobileCTA";
import ThankYouPage from "./components/ThankYouPage";
import { initTracking } from "./lib/track";

// Stripe's success_url redirects to /thank-you. We also accept the legacy
// ?checkout=success query param so older/cached checkout links keep working.
function isThankYouRoute() {
  if (typeof window === "undefined") return false;
  const path = window.location.pathname.replace(/\/+$/, "");
  if (path === "/thank-you") return true;
  return new URLSearchParams(window.location.search).get("checkout") === "success";
}

export default function App() {
  const [bumpSelected, setBumpSelected] = useState(false);
  const [thankYou] = useState(isThankYouRoute);

  // Analytics: page_view (once/session) + scroll-depth and time-on-page listeners.
  // Skip on the thank-you page so post-purchase visits don't skew landing metrics.
  useEffect(() => {
    if (thankYou) return;
    return initTracking();
  }, [thankYou]);

  if (thankYou) return <ThankYouPage />;

  return (
    <div className="relative min-h-screen">
      <main className="pb-24 lg:pb-0">
        <HeroSection />
        <CaseStudies />
        <LogisticsSection />
        <CurriculumSection />
        <StudentSuccess />
        <InstructorSection />
        <ValueStack />
        <FaqSection />
        <OrderBumpCheckout bumpSelected={bumpSelected} onToggle={setBumpSelected} />
      </main>

      <footer className="px-5 py-10 text-center">
        <p className="text-lg font-extrabold tracking-tight text-cloud">
          סדנת מנוע העסקאות ל2 נכסים בחודש
        </p>
        <p className="mt-1 text-sm font-semibold text-drift">עם אוהד עוז</p>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-drift">
          כל הזכויות שמורות · הסדנה הינה תוכן חינוכי ופרקטי ואינה מהווה ייעוץ
          השקעות, ייעוץ מס או ייעוץ משפטי. תוצאות עשויות להשתנות בהתאם ליישום בפועל.
        </p>
      </footer>

      <StickyMobileCTA bumpSelected={bumpSelected} />
    </div>
  );
}

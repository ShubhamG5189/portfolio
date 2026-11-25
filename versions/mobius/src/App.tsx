import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Loader from './components/Loader';
import Header, { Clock } from './components/Header';
import { IntroContext } from './components/IntroContext';
import HeroSection from './sections/HeroSection';
import ManifestoSection from './sections/ManifestoSection';
import FeatureMarquee from './sections/FeatureMarquee';
import ServicesSection from './sections/ServicesSection';
import NumbersSection from './sections/NumbersSection';
import WorkSection from './sections/WorkSection';
import { AboutSection, ClientsSection } from './sections/AboutSection';
import ProcessSection from './sections/ProcessSection';
import { ContactSection, Footer } from './sections/ContactSection';

export default function App() {
  const [introDone, setIntroDone] = useState(false);
  const finish = useCallback(() => setIntroDone(true), []);

  // smooth, weighted scrolling (skipped for visitors who prefer reduced motion)
  useEffect(() => {
    if (!introDone || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ autoRaf: true, anchors: true, lerp: 0.1 });
    if (import.meta.env.DEV) (window as unknown as { lenis: Lenis }).lenis = lenis; // handy for testing scroll positions
    return () => lenis.destroy();
  }, [introDone]);

  return (
    <IntroContext.Provider value={introDone}>
      {/* The page renders underneath the loader so the portrait can start downloading right away */}
      <AnimatePresence>{!introDone && <Loader key="loader" onDone={finish} />}</AnimatePresence>
      <Header />
      <main style={{ overflowX: 'clip' }}>
        <HeroSection />
        <ManifestoSection />
        <FeatureMarquee />
        <ServicesSection />
        <NumbersSection />
        <WorkSection />
        <AboutSection />
        <ClientsSection />
        <ProcessSection />
        <ContactSection />
      </main>
      <Footer />
      <Clock />
      {/* Visitor counts and real-world page speed, shown in the Vercel dashboard */}
      <Analytics />
      <SpeedInsights />
    </IntroContext.Provider>
  );
}

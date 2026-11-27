import { useCallback, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import HeroSection from './sections/HeroSection';
import WorkSection from './sections/WorkSection';
import ServicesSection from './sections/ServicesSection';
import GallerySection from './sections/GallerySection';
import ContactSection from './sections/ContactSection';
import Loader from './components/Loader';
import { IntroContext } from './components/IntroContext';

export default function App() {
  const [introDone, setIntroDone] = useState(false);
  const finish = useCallback(() => setIntroDone(true), []);

  return (
    <IntroContext.Provider value={introDone}>
      {/* The page renders underneath the intro so the portrait can start downloading right away */}
      <AnimatePresence>{!introDone && <Loader key="loader" onDone={finish} />}</AnimatePresence>
      {/* keyboard users: the first Tab press shows this link to jump past the hero */}
      <a
        href="#work"
        className="sr-only z-[200] rounded-full bg-gold px-5 py-3 font-body text-sm font-semibold uppercase tracking-[0.14em] text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to work
      </a>
      <main style={{ overflowX: 'clip' }}>
        <HeroSection />
        <WorkSection />
        <ServicesSection />
        <GallerySection />
        <ContactSection />
      </main>
      {/* Visitor counts and real-world page speed, shown in the Vercel dashboard */}
      <Analytics />
      <SpeedInsights />
    </IntroContext.Provider>
  );
}

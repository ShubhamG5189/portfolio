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

import { useEffect, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Hand } from 'lucide-react';
import FadeIn from './FadeIn';
import { startPortrait } from '../portrait/engine';
import { portraitFolder, site } from '../data/content';

const FALLBACK =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261031_040619_2f6f349e-a4a7-40db-8e9b-03b6acd8b99a.png&w=1024&q=92';

// `children` are drawn on top of the portrait and positioned relative to it (e.g. the handwritten "Welcome").
export default function LivingPortrait({ ready = true, children }: { ready?: boolean; children?: ReactNode }) {
  // Start the WebGL engine once the markup below is on the page; stop it when the component goes away.
  useEffect(() => startPortrait(portraitFolder), []);

  // The hint stays until the visitor first touches the face.
  const [hint, setHint] = useState(true);
  const [touch] = useState(() => typeof window !== 'undefined' && matchMedia('(pointer: coarse)').matches);
  useEffect(() => {
    const wrap = document.getElementById('magnetWrap');
    if (!wrap) return;
    const off = () => setHint(false);
    wrap.addEventListener('pointerdown', off);
    return () => wrap.removeEventListener('pointerdown', off);
  }, []);

  return (
    <div className="hero-portrait-wrap" id="magnetWrap">
      <FadeIn gate={ready} delay={0.6} y={30}>
        <div className="hero-portrait-inner" id="magnetInner">
          <img id="faceFallback" src={portraitFolder ? `${portraitFolder}rest.webp` : FALLBACK} alt={`Portrait for ${site.name}'s portfolio`} draggable={false} />
          <canvas id="faceGl" aria-hidden="true" />
        </div>
      </FadeIn>

      {children}

      {/* "poke me" hint: appears after the entrance, bobs gently, leaves on the first touch */}
      <AnimatePresence>
        {ready && hint && (
          <motion.div
            key="hint"
            className="pointer-events-none absolute bottom-[3%] left-1/2 z-10"
            style={{ x: '-50%' }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ delay: 1.6, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              className="flex items-center gap-2 whitespace-nowrap rounded-full border border-white/15 bg-[#0C0C0C]/70 px-4 py-2 text-[11px] font-medium uppercase tracking-widest text-[#D7E2EA] backdrop-blur-md sm:text-xs"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#B600A8] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#B600A8]" />
              </span>
              <Hand className="h-3.5 w-3.5" strokeWidth={1.8} />
              {touch ? 'Psst… tap or pull my face' : 'Psst… my eyes follow you. Poke or pull'}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

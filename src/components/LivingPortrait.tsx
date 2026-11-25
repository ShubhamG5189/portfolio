import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Hand } from 'lucide-react';
import FadeIn from './FadeIn';
import { startPortrait } from '../portrait/engine';
import { portraitFolder, site } from '../data/content';

const FALLBACK =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261031_040619_2f6f349e-a4a7-40db-8e9b-03b6acd8b99a.png&w=1024&q=92';

export default function LivingPortrait({ ready = true }: { ready?: boolean }) {
  // Start the WebGL engine once the markup below is on the page; stop it when the component goes away.
  useEffect(() => startPortrait(portraitFolder), []);

  // The hint stays until the visitor first touches her face.
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
          <div id="faceProps" aria-hidden="true">
            <svg id="faceFly" viewBox="0 0 32 32">
              <path className="wing" d="M15 15C12 9.500 4.500 8.500 2 13c2.500 4.500 10 4.500 13 2z" />
              <path className="wing r" d="M17 15c3-5.500 10.500-6.500 13-2-2.500 4.500-10 4.500-13 2z" />
              <ellipse cx="16" cy="19.500" rx="4" ry="6.500" />
              <circle cx="16" cy="11.500" r="3.300" />
            </svg>
            <svg id="faceHand" viewBox="0 0 32 32">
              <path className="open" d="M10.500 16.500V8.200a1.800 1.800 0 0 1 3.600 0V14v-8a1.800 1.800 0 0 1 3.600 0V14 7a1.800 1.800 0 0 1 3.600 0v8-5a1.800 1.800 0 0 1 3.600 0v10.500c0 5-3.400 8.500-8.400 8.500-3.600 0-5.700-1.600-7.600-4.600l-3.500-5.600c-.6-1 .1-2.200 1.200-2.400 1-.2 1.900.2 2.600 1z" />
              <path className="grab" d="M10.500 17v-3.300a1.800 1.800 0 0 1 3.600 0V14v-1.800a1.800 1.800 0 0 1 3.600 0V14v-1.300a1.800 1.800 0 0 1 3.600 0V14v-.3a1.800 1.800 0 0 1 3.600 0v6.800c0 5-3.400 8.500-8.400 8.500-3.600 0-5.700-1.600-7.600-4.600l-2.300-3.700c-.6-1 .1-2.200 1.200-2.400 1-.2 1.900.2 2.700 1z" />
            </svg>
          </div>
        </div>
      </FadeIn>

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
              {touch ? 'Psst… tap or pull my face' : 'Psst… poke, pull or tap my hair'}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

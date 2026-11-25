import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { site } from '../data/content';

// Pictures the portrait needs before it can appear: the resting face and the lids it wakes up with.
const ESSENTIAL = ['rest', 'closed', 'half'];
const MIN_MS = 1200; // always show the loader at least this long, so it doesn't flash
const MAX_MS = 7000; // never block the page longer than this, even on a slow connection

export default function Loader({ onDone }: { onDone: () => void }) {
  const [shown, setShown] = useState(0);
  const target = useRef(0);
  const done = useRef(false);

  useEffect(() => {
    const start = performance.now();
    const loaded = new Set<string>();
    let total = 58;
    const onProgress = (e: Event) => {
      const d = (e as CustomEvent<{ name: string; total: number }>).detail;
      loaded.add(d.name);
      total = d.total;
      const essentials = ESSENTIAL.every((n) => loaded.has(n));
      target.current = essentials ? 100 : Math.min(85, (loaded.size / ESSENTIAL.length) * 85 + (loaded.size / total) * 10);
    };
    window.addEventListener('portrait:progress', onProgress);

    let raf = 0;
    const tick = (now: number) => {
      const elapsed = now - start;
      if (elapsed > MAX_MS) target.current = 100;
      const cap = elapsed < MIN_MS ? Math.min(target.current, (elapsed / MIN_MS) * 99) : target.current;
      setShown((s) => Math.min(cap, s + (cap - s) * 0.1 + (cap > s ? 0.25 : 0)));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    document.documentElement.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('portrait:progress', onProgress);
      cancelAnimationFrame(raf);
      document.documentElement.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    if (shown >= 99.9 && !done.current) {
      done.current = true;
      setTimeout(onDone, 150);
    }
  }, [shown, onDone]);

  const pct = Math.round(shown);
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-end justify-between bg-white px-5 pb-5 md:px-8 md:pb-7"
      exit={{ y: '-100%' }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      aria-live="polite"
      aria-label={`Loading ${pct}%`}
    >
      <span className="text-[clamp(3rem,11vw,10rem)] font-bold leading-[0.8] tracking-[-0.06em]">{site.name}</span>
      <span className="text-[clamp(1.25rem,3vw,2.5rem)] font-semibold leading-none tracking-[-0.04em] tabular-nums">{pct}%</span>
    </motion.div>
  );
}

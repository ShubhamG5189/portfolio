import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { site } from '../data/content';

// Pictures the portrait needs before it can appear: the resting face and the lids it wakes up with.
const ESSENTIAL = ['rest', 'closed', 'half'];
const MIN_MS = 1400; // always show the intro at least this long, so it doesn't flash
const MAX_MS = 7000; // never block the page longer than this, even on a slow connection

// light streaks: [top %, delay s, colour]
const STREAKS: [number, number, string][] = [
  [10, 0, ''], [34, 0.5, 'violet'], [58, 1.1, ''], [80, 1.6, 'gold'], [22, 1.9, 'violet'], [70, 0.3, ''],
];

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
      setTimeout(onDone, 200);
    }
  }, [shown, onDone]);

  const pct = Math.round(shown);
  const name = site.name.toUpperCase();

  return (
    <motion.div
      className="scanlines fixed inset-0 z-[100] flex flex-col justify-between overflow-hidden bg-night px-6 pb-7 pt-6 md:px-10 md:pb-10 md:pt-8"
      initial={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
      exit={{ clipPath: 'polygon(0 0, 100% 0, 100% 0%, 0 14%)' }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      aria-live="polite"
      aria-label={`Loading ${pct}%`}
    >
      {/* violet stage light + streaks */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(60% 50% at 70% 35%, rgb(140 107 255 / 0.28), transparent 70%)' }}
      />
      {STREAKS.map(([top, delay, tone], i) => (
        <span key={i} aria-hidden="true" className={`streak ${tone}`} style={{ top: `${top}%`, animationDelay: `${delay}s` }} />
      ))}

      <p className="relative font-body text-xs font-medium uppercase tracking-[0.3em] text-mist-dim">Loading the studio</p>

      <div className="relative">
        <motion.h1
          initial={{ opacity: 0, letterSpacing: '0.12em' }}
          animate={{ opacity: 1, letterSpacing: '0.02em' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-black uppercase leading-[0.82] text-mist"
          style={{ fontSize: 'clamp(4.5rem, 21vw, 22rem)' }}
        >
          <span className="rgb-split" data-text={name}>{name}</span>
        </motion.h1>
      </div>

      <div className="relative flex flex-col gap-4">
        <div className="flex items-end justify-between">
          <span className="font-body text-xs font-medium uppercase tracking-[0.3em] text-mist-dim">3D creator</span>
          <span className="font-display font-black leading-none text-mist tabular-nums" style={{ fontSize: 'clamp(2.75rem, 8vw, 7rem)' }}>
            {String(pct).padStart(3, '0')}
          </span>
        </div>
        <div className="h-[2px] w-full bg-mist/10">
          <div className="h-full bg-gold" style={{ width: `${shown}%` }} />
        </div>
      </div>
    </motion.div>
  );
}

import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import { navLinks, site } from '../data/content';
import { useIntroDone } from './IntroContext';

// Fixed header: your name + intro sentence (the sentence fades away once you scroll), links on the right.
export default function Header() {
  const ready = useIntroDone();
  const { scrollY } = useScroll();
  const introOpacity = useTransform(scrollY, [0, 160], [1, 0]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-start justify-between gap-6 bg-white px-5 pb-3 pt-4 md:bg-transparent md:px-8 md:pb-0 md:pt-6"
    >
      <p className="pointer-events-auto max-w-[19rem] text-[15px] font-medium leading-[1.3] tracking-[-0.01em]">
        <a href="#" className="font-bold tracking-[-0.03em]">{site.name}</a>{' '}
        <motion.span style={{ opacity: introOpacity }} className="hidden sm:inline">{site.intro}</motion.span>
      </p>
      <nav aria-label="Main" className="pointer-events-auto">
        <ul className="flex gap-4 text-[12px] font-bold uppercase tracking-[0.02em] md:gap-10">
          {navLinks.map((l) => (
            <li key={l.label}>
              <a href={l.href} className="underline-offset-4 hover:underline">{l.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </motion.header>
  );
}

// Small live clock fixed in the bottom-right corner.
export function Clock() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: site.timezone });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="pointer-events-none fixed bottom-4 right-5 z-50 hidden items-baseline gap-2 text-[11px] font-semibold uppercase tracking-[0.02em] sm:flex md:right-8">
      <span className="text-muted">{site.name}</span>
      <span className="tabular-nums">{time}</span>
    </div>
  );
}

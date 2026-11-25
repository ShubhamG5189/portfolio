import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useRef } from 'react';
import { aboutParagraphs, manifesto } from '../data/content';

// a fixed pseudo-random scatter position for each word, so the layout is the same on every visit
const rand = (i: number, salt: number) => {
  const v = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return v - Math.floor(v);
};

function Word({ word, i, progress }: { word: string; i: number; progress: MotionValue<number> }) {
  const dx = (rand(i, 1) - 0.5) * 80; // vw
  const dy = (rand(i, 2) - 0.5) * 70; // vh
  const end = 0.55 + rand(i, 3) * 0.15; // words land at slightly different moments
  const x = useTransform(progress, [0.05, end], [`${dx}vw`, '0vw']);
  const y = useTransform(progress, [0.05, end], [`${dy}vh`, '0vh']);
  return (
    <motion.span style={{ x, y }} className="inline-block will-change-transform">
      {word}&nbsp;
    </motion.span>
  );
}

// Words start scattered across the screen and fly together into one sentence as you scroll.
export default function ManifestoSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const words = manifesto.split(' ');

  return (
    <>
      <section ref={ref} className="relative h-[260vh]" aria-label="Manifesto">
        <div className="sticky top-0 flex h-screen items-center overflow-hidden px-5 md:pl-[14vw] md:pr-[10vw]">
          <p className="max-w-[17ch] text-[clamp(2.4rem,5.6vw,6rem)] font-semibold leading-[0.98] tracking-[-0.045em]">
            {words.map((w, i) => (
              <Word key={i} word={w} i={i} progress={scrollYProgress} />
            ))}
          </p>
        </div>
      </section>
      <div className="grid gap-6 px-5 pb-28 md:grid-cols-2 md:gap-10 md:pl-[14vw] md:pr-[30vw]">
        {aboutParagraphs.map((p) => (
          <p key={p.slice(0, 12)} className="text-[15px] font-medium leading-[1.45] text-muted">{p}</p>
        ))}
      </div>
    </>
  );
}

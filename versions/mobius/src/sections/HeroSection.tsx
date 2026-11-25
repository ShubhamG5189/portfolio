import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import LivingPortrait from '../components/LivingPortrait';
import MediaSlot from '../components/MediaSlot';
import { useIntroDone } from '../components/IntroContext';
import { useFitText } from '../components/useFitText';
import { heroPortraitTone, heroStack, site } from '../data/content';

// resting angle and offset of each card in the fan (back to front; the last one is your portrait card)
const FAN = [
  { r: -11, x: -9, y: 3 },
  { r: 8, x: 7, y: -2 },
  { r: -4, x: -3, y: 1 },
  { r: 2, x: 0, y: 0 },
];

function FanCard({ i, progress, ready, children }: { i: number; progress: ReturnType<typeof useScroll>['scrollYProgress']; ready: boolean; children: React.ReactNode }) {
  const f = FAN[i];
  // as you scroll, the fan opens wider and drifts up
  const rotate = useTransform(progress, [0, 1], [f.r, f.r * 2.4]);
  const x = useTransform(progress, [0, 1], [`${f.x}%`, `${f.x * 3.2}%`]);
  const y = useTransform(progress, [0, 1], [`${f.y}%`, `${-30 - i * 6}%`]);
  return (
    <motion.div
      className="absolute inset-0"
      style={{ rotate, x, y, zIndex: i }}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={ready ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
      transition={{ delay: 0.1 + i * 0.09, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function HeroSection() {
  const ready = useIntroDone();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const wordY = useTransform(scrollYProgress, [0, 1], ['0%', '-55%']);
  const { box, text, size } = useFitText(0.84, 0.5);

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[620px] overflow-hidden">
      {/* fanned stack, your Living Portrait on the front card */}
      <div className="absolute left-1/2 top-[46%] aspect-[4/5] w-[min(64vw,340px)] -translate-x-1/2 -translate-y-1/2 md:top-[45%] md:w-[clamp(280px,24vw,380px)]">
        {heroStack.map((m, i) => (
          <FanCard key={m.label} i={i} progress={scrollYProgress} ready={ready}>
            <MediaSlot item={m} className="h-full w-full shadow-[0_24px_50px_-20px_rgb(0_0_0_/_0.35)]" />
          </FanCard>
        ))}
        <FanCard i={3} progress={scrollYProgress} ready={ready}>
          <div className="portrait-card relative h-full w-full overflow-hidden rounded-[4px] shadow-[0_28px_60px_-22px_rgb(0_0_0_/_0.4)]" style={{ background: heroPortraitTone }}>
            <LivingPortrait ready={ready} />
          </div>
        </FanCard>
      </div>

      {/* giant wordmark */}
      <motion.div style={{ y: wordY }} className="absolute inset-x-0 bottom-0 flex items-start justify-between gap-4 px-4 md:px-7">
        <div ref={box} className="min-w-0 flex-1">
          <motion.h1
            initial={{ y: '30%', opacity: 0 }}
            animate={ready ? { y: '0%', opacity: 1 } : { y: '30%', opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="leading-none"
          >
            <span
              ref={text}
              className="inline-block whitespace-nowrap font-bold leading-[0.76] tracking-[-0.065em]"
              style={{ fontSize: size ? `${size}px` : '20vw', paddingBottom: '0.04em' }}
            >
              {site.name}
            </span>
            <span className="sr-only">, {site.role}</span>
          </motion.h1>
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="pt-[1.2vw] text-[clamp(1rem,2.2vw,2rem)] font-semibold tracking-[-0.03em]"
        >
          © {new Date().getFullYear()}
        </motion.p>
      </motion.div>
    </section>
  );
}

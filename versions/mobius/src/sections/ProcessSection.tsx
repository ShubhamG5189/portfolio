import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useRef } from 'react';
import { process } from '../data/content';

function Bar({ i, n, label, progress }: { i: number; n: number; label: string; progress: MotionValue<number> }) {
  const start = 0.08 + i * 0.16;
  const scaleX = useTransform(progress, [start, start + 0.18], [0, 1]);
  const left = (i / n) * 74; // bars step down and to the right, like a schedule
  return (
    <motion.div
      style={{ scaleX, left: `${left}%`, top: `${(i / n) * 100}%` }}
      className="absolute flex h-[22%] w-[26%] origin-left items-center rounded-[3px] bg-fg px-3"
    >
      <span className="truncate text-[12px] font-semibold text-white md:text-[13px]">{label}</span>
    </motion.div>
  );
}

// The phases draw themselves in as you scroll, then the descriptions sit underneath.
export default function ProcessSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  return (
    <section ref={ref} className="relative h-[220vh]" aria-labelledby="process-title">
      <div className="sticky top-0 flex h-screen flex-col justify-center gap-8 overflow-hidden px-5 py-16 md:gap-10 md:px-8">
        <div>
          <h2 id="process-title" className="text-[clamp(3rem,6.4vw,6.5rem)] font-semibold leading-[0.9] tracking-[-0.055em]">The Process</h2>
          <p className="mt-4 max-w-[34ch] text-[15px] font-medium leading-[1.45] text-muted">
            Four clear phases, from the first conversation to the final frame.
          </p>
        </div>

        <div className="relative h-[26vh] min-h-[160px]">
          {/* column grid */}
          <div aria-hidden="true" className="absolute inset-0 grid grid-cols-12">
            {Array.from({ length: 12 }, (_, i) => (
              <span key={i} className="border-l border-line last:border-r" />
            ))}
          </div>
          <div className="absolute inset-0" aria-hidden="true">
            {process.map((p, i) => (
              <Bar key={p.name} i={i} n={process.length} label={p.name} progress={scrollYProgress} />
            ))}
          </div>
        </div>

        <ol className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
          {process.map((p, i) => (
            <li key={p.name}>
              <span className="text-[12px] font-semibold tabular-nums text-muted">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-1 text-[clamp(1.25rem,2vw,1.75rem)] font-semibold tracking-[-0.035em]">{p.name}</h3>
              <p className="mt-2 max-w-[30ch] text-[13px] font-medium leading-[1.45] text-muted md:text-[14px]">{p.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

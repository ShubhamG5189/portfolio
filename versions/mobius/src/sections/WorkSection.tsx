import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import MediaSlot from '../components/MediaSlot';
import { projects } from '../data/content';

// Selected work as an index list; hovering a row floats its preview next to the cursor.
export default function WorkSection() {
  const [active, setActive] = useState<number | null>(null);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 300, damping: 30 }), y = useSpring(my, { stiffness: 300, damping: 30 });

  return (
    <section id="work" className="relative px-5 py-24 md:px-8 md:py-36">
      <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)]">
        <div className="md:sticky md:top-[16vh] md:self-start">
          <h2 className="text-[clamp(3rem,6.4vw,6.5rem)] font-semibold leading-[0.9] tracking-[-0.055em]">
            Selected
            <br />
            Work
          </h2>
          <p className="mt-6 max-w-[28ch] text-[15px] font-medium leading-[1.45] text-muted">
            A few recent projects across modeling, rendering and motion.
          </p>
        </div>

        <ul
          onPointerMove={(e) => { mx.set(e.clientX + 24); my.set(e.clientY - 90); }}
          onPointerLeave={() => setActive(null)}
          className="border-t border-line"
        >
          {projects.map((p, i) => (
            <li
              key={p.name}
              onPointerEnter={(e) => {
                if (e.pointerType !== 'mouse') return;
                mx.jump(e.clientX + 24); my.jump(e.clientY - 90); // start at the cursor, not the corner
                x.jump(e.clientX + 24); y.jump(e.clientY - 90);
                setActive(i);
              }}
            >
              <a
                href={p.link}
                className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 border-b border-line py-5 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_4rem_1.5rem] md:py-6"
              >
                <span className="text-[clamp(1.15rem,1.8vw,1.6rem)] font-semibold tracking-[-0.03em] transition-transform duration-300 [transition-timing-function:var(--ease-out)] group-hover:translate-x-2">
                  {p.name}
                </span>
                <span className="hidden text-[14px] font-medium text-muted md:block">{p.type}</span>
                <span className="text-[14px] font-medium tabular-nums text-muted">{p.year}</span>
                <ArrowUpRight className="hidden h-5 w-5 text-muted transition-colors group-hover:text-fg md:block" strokeWidth={2} />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            key="preview"
            style={{ x, y }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-none fixed left-0 top-0 z-40 hidden w-[280px] md:block"
            aria-hidden="true"
          >
            <MediaSlot item={projects[active].preview} className="aspect-[4/3] w-full shadow-[0_24px_50px_-20px_rgb(0_0_0_/_0.35)]" />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

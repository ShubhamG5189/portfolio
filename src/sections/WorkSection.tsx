import { motion, useScroll, useTransform } from 'framer-motion';
import { useLayoutEffect, useRef, useState } from 'react';
import { projects } from '../data/content';

// frame numbers along the timeline ruler, one every 200px
const FRAMES = Array.from({ length: 24 }, (_, i) => String((i + 1) * 10).padStart(3, '0'));

export default function WorkSection() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const [distance, setDistance] = useState(0);

  // how far the card track has to travel sideways
  useLayoutEffect(() => {
    const measure = () => {
      const t = track.current;
      if (t) setDistance(Math.max(0, t.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener('resize', measure);
    return () => { ro.disconnect(); window.removeEventListener('resize', measure); };
  }, []);

  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const rulerX = useTransform(scrollYProgress, [0, 1], [0, -distance * 0.55]); // the ruler drifts slower: depth

  return (
    <section
      id="work"
      ref={section}
      aria-label="Signature work"
      className="cut-rise relative z-20 bg-night"
      style={{ height: `calc(100vh + ${distance}px)` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(70% 55% at 30% 45%, rgb(140 107 255 / 0.16), transparent 70%)' }}
        />

        {/* heading follows the angle of the cut */}
        <h2
          className="absolute right-[-0.04em] top-[calc(var(--cut)*0.15)] origin-top-right whitespace-nowrap font-display font-black uppercase leading-[0.8] text-mist/[0.12]"
          style={{ fontSize: 'clamp(4.5rem, 15vw, 15rem)', transform: 'rotate(atan2(calc(-1 * var(--cut)), 100vw))' }}
        >
          Signature work
        </h2>

        {/* frame ruler */}
        <motion.div aria-hidden="true" style={{ x: rulerX }} className="ruler absolute bottom-[7vh] left-0 flex h-[22px] w-[4800px]">
          {FRAMES.map((f) => (
            <span
              key={f}
              className="relative h-full w-[200px] shrink-0 pl-2 pt-6 font-display text-[clamp(2.25rem,4.5vw,4rem)] font-semibold leading-none text-mist/20 tabular-nums"
            >
              {f}
            </span>
          ))}
        </motion.div>

        <motion.ol
          ref={track}
          style={{ x }}
          className="relative flex h-full w-max items-center gap-[16vw] pl-[12vw] md:gap-[12vw] md:pl-[42vw]"
        >
          {projects.map((p, i) => (
            <li key={p.name} className="shrink-0" style={{ transform: `translateY(${i % 2 ? 7 : -5}vh)` }}>
              <a
                href={p.link}
                target={p.link.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className="collectible block w-[min(68vw,300px)] md:w-[clamp(240px,22vw,320px)]"
              >
                <span className="card-surface block">
                  <img src={p.col2} alt={`${p.name} — ${p.category} project`} loading="lazy" className="aspect-[3/4] w-full rounded-[5px] object-cover" />
                </span>
                <span className="mt-5 block font-display text-[clamp(1.4rem,2vw,1.9rem)] font-black uppercase leading-none text-mist">
                  {p.name}
                </span>
                <span className="mt-2 block font-body text-xs font-medium uppercase tracking-[0.16em] text-mist-dim">{p.stats}</span>
              </a>
            </li>
          ))}
          {/* the timeline ends on an open slot */}
          <li className="w-[min(72vw,340px)] shrink-0 md:w-[clamp(260px,24vw,360px)]">
            <div className="flex aspect-[3/4] flex-col justify-end rounded-[10px] border-2 border-dashed border-gold/50 p-6">
              <p className="font-display text-[clamp(2rem,3.2vw,3rem)] font-black uppercase leading-[0.9] text-mist">Your project, next</p>
              <a
                href="/contact"
                className="mt-4 inline-flex items-center gap-2 font-body text-sm font-semibold uppercase tracking-[0.16em] text-gold underline-offset-[6px] hover:underline"
              >
                Start a project
              </a>
            </div>
          </li>
          {/* end spacer (padding is ignored when the browser measures the track) */}
          <li aria-hidden="true" className="w-[6vw] shrink-0 md:w-[10vw]" />
        </motion.ol>
      </div>
    </section>
  );
}

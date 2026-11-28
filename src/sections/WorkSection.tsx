import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowUpRight } from 'lucide-react';
import { projects, type Project } from '../data/content';
import WorkCard from '../components/WorkCard';
import ProjectViewer from '../components/ProjectViewer';

// a project opens at #work/<slug>, so the link can be shared and the phone's Back button closes it
const slugFromHash = () => {
  const m = window.location.hash.match(/^#work\/(.+)$/);
  return m && projects.some((p) => p.slug === m[1]) ? m[1] : null;
};

// frame numbers along the timeline ruler, one every 200px
const FRAMES = Array.from({ length: 40 }, (_, i) => String((i + 1) * 10).padStart(3, '0'));
const EASE = [0.16, 1, 0.3, 1] as const;

// the filter chips, in the order the disciplines appear in the folders
const ORDER = ['Graphic Design', 'Motion Graphics', 'AI Video & Image', '3D & Renders'];
const CATEGORIES = ['All', ...ORDER.filter((c) => projects.some((p) => p.category === c)),
  ...[...new Set(projects.map((p) => p.category))].filter((c) => !ORDER.includes(c))];

export default function WorkSection() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const [distance, setDistance] = useState(0);
  const [cat, setCat] = useState('All');
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();

  const list = useMemo(() => (cat === 'All' ? projects : projects.filter((p) => p.category === cat)), [cat]);

  // ---- viewer + #work/<slug> links ----
  const [openSlug, setOpenSlug] = useState<string | null>(slugFromHash);
  const pushed = useRef(false);
  useEffect(() => {
    const sync = () => { setOpenSlug(slugFromHash()); pushed.current = false; };
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);
  const open = useCallback((slug: string) => {
    window.history.pushState(null, '', `#work/${slug}`);
    pushed.current = true;
    setOpenSlug(slug);
  }, []);
  const go = useCallback((slug: string) => {
    window.history.replaceState(null, '', `#work/${slug}`);
    setOpenSlug(slug);
  }, []);
  const close = useCallback(() => {
    if (pushed.current) { pushed.current = false; window.history.back(); setOpenSlug(null); return; }
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
    setOpenSlug(null);
  }, []);

  // ---- how far the card track has to travel sideways ----
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
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });
  const x = useTransform(progress, [0, 1], [0, -distance]);
  const rulerX = useTransform(progress, [0, 1], [0, -distance * 0.55]); // the ruler drifts slower: depth
  const playhead = useTransform(progress, (v) => `${v * 100}%`);

  // which card is nearest the middle of the screen
  const items = useRef<(HTMLLIElement | null)[]>([]);
  useMotionValueEvent(x, 'change', (v) => {
    const mid = window.innerWidth / 2;
    let best = 0, bestD = Infinity;
    items.current.forEach((el, n) => {
      if (!el) return;
      const d = Math.abs(el.offsetLeft + el.offsetWidth / 2 + v - mid);
      if (d < bestD) { bestD = d; best = n; }
    });
    setActive((a) => (a === best ? a : best));
  });

  // picking a discipline starts the timeline from the beginning
  const pick = (c: string) => {
    if (c === cat) return;
    setCat(c);
    setActive(0);
    const s = section.current;
    if (s && window.scrollY > s.offsetTop) window.scrollTo({ top: s.offsetTop, behavior: reduce ? 'auto' : 'smooth' });
  };

  // ---- the round "View" cursor that follows the mouse over a card ----
  const cx = useMotionValue(-200);
  const cy = useMotionValue(-200);
  const sx = useSpring(cx, { stiffness: 500, damping: 40, mass: 0.5 });
  const sy = useSpring(cy, { stiffness: 500, damping: 40, mass: 0.5 });
  const [overCard, setOverCard] = useState(false);
  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    cx.set(e.clientX);
    cy.set(e.clientY);
    const hit = !!(e.target as HTMLElement).closest('[data-work-card]');
    if (hit !== overCard) setOverCard(hit);
  };

  items.current.length = list.length;
  const current = list[Math.min(active, list.length - 1)];

  return (
    <section
      id="work"
      ref={section}
      aria-label="Signature work"
      className="cut-rise relative z-20 bg-night"
      style={{ height: `calc(100vh + ${distance}px)` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden" onPointerMove={onMove} onPointerLeave={() => setOverCard(false)}>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(70% 55% at 30% 45%, rgb(140 107 255 / 0.16), transparent 70%)' }}
        />
        {/* film grain-ish vignette so the edges fall off into the night */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[5]" style={{ background: 'linear-gradient(90deg, rgb(15 11 24 / 0.85), transparent 14%, transparent 86%, rgb(15 11 24 / 0.85))' }} />

        {/* heading follows the angle of the cut */}
        <h2
          className="absolute right-[-0.04em] top-[calc(var(--cut)*0.15)] origin-top-right whitespace-nowrap font-display font-black uppercase leading-[0.8] text-mist/[0.12]"
          style={{ fontSize: 'clamp(4.5rem, 15vw, 15rem)', transform: 'rotate(atan2(calc(-1 * var(--cut)), 100vw))' }}
        >
          Signature work
        </h2>

        {/* discipline filter */}
        <div className="absolute inset-x-0 top-[calc(var(--cut)+1.5rem)] z-10 px-5 md:top-[calc(var(--cut)+3.5rem)] md:px-10">
          <div role="group" aria-label="Filter work by discipline" className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {CATEGORIES.map((c) => {
              const n = c === 'All' ? projects.length : projects.filter((p) => p.category === c).length;
              const on = c === cat;
              return (
                <button
                  key={c}
                  type="button"
                  aria-pressed={on}
                  onClick={() => pick(c)}
                  className={`relative shrink-0 rounded-full border px-4 py-2 font-body text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors duration-200 ${on ? 'border-gold text-ink' : 'border-mist/20 bg-night/60 text-mist/80 backdrop-blur hover:border-mist/50 hover:text-mist'}`}
                >
                  {on && <motion.span layoutId="work-chip" transition={{ duration: 0.45, ease: EASE }} className="absolute inset-0 rounded-full bg-gold" />}
                  <span className="relative">
                    {c} <span className={`tabular-nums ${on ? 'text-ink/60' : 'text-mist-dim'}`}>{n}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* frame ruler */}
        <motion.div aria-hidden="true" style={{ x: rulerX }} className="ruler absolute bottom-[7vh] left-0 flex h-[22px] w-[8000px]">
          {FRAMES.map((f) => (
            <span
              key={f}
              className="relative h-full w-[200px] shrink-0 pl-2 pt-6 font-display text-[clamp(2.25rem,4.5vw,4rem)] font-semibold leading-none text-mist/20 tabular-nums"
            >
              {f}
            </span>
          ))}
        </motion.div>

        {/* playhead: progress through the timeline, with the card in the middle named */}
        <div className="absolute inset-x-5 bottom-[calc(7vh+22px+1rem)] z-10 md:inset-x-10" aria-live="polite">
          <div className="mb-3 flex items-end justify-between gap-6">
            <p className="min-w-0 font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-mist-dim">
              <span className="sr-only">Now showing: </span>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={current?.slug}
                  className="block truncate"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  {current?.name}
                </motion.span>
              </AnimatePresence>
            </p>
            <p className="shrink-0 font-display text-2xl font-black tabular-nums leading-none text-mist md:text-3xl">
              {String(Math.min(active, list.length - 1) + 1).padStart(2, '0')}
              <span className="text-gold"> / </span>
              <span className="text-mist/40">{String(list.length).padStart(2, '0')}</span>
            </p>
          </div>
          <div className="relative h-px bg-mist/15">
            <motion.div className="absolute inset-y-0 left-0 bg-gold" style={{ width: playhead }} />
            <motion.div className="absolute top-1/2 h-3 w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold shadow-[0_0_12px_rgb(240_181_74/0.8)]" style={{ left: playhead }} />
          </div>
        </div>

        <motion.ol
          ref={track}
          style={{ x }}
          className="relative flex h-full w-max items-center gap-[16vw] pb-[16vh] pl-[12vw] pt-[22vh] md:gap-[9vw] md:pb-[12vh] md:pl-[38vw] md:pt-[20vh]"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {list.map((p, i) => (
              <TrackItem
                key={p.slug}
                project={p}
                index={projects.indexOf(p)}
                order={i}
                x={x}
                reduce={!!reduce}
                onOpen={open}
                refFn={(el) => { items.current[i] = el; }}
              />
            ))}
            {/* the timeline ends on an open slot */}
            <motion.li key="next" layout="position" className="w-[min(80vw,360px)] shrink-0 md:w-[clamp(300px,27vw,420px)]">
              <a
                href="/contact"
                className="group flex aspect-[808/632] flex-col justify-end rounded-[10px] border-2 border-dashed border-gold/50 p-6 transition-colors duration-300 hover:border-gold hover:bg-gold/[0.04]"
              >
                <span className="font-display text-[clamp(2rem,3.2vw,3rem)] font-black uppercase leading-[0.9] text-mist">Your project, next</span>
                <span className="mt-4 inline-flex items-center gap-2 font-body text-sm font-semibold uppercase tracking-[0.16em] text-gold">
                  Start a project <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </a>
            </motion.li>
          </AnimatePresence>
          {/* end spacer (padding is ignored when the browser measures the track) */}
          <li aria-hidden="true" className="w-[6vw] shrink-0 md:w-[10vw]" />
        </motion.ol>

        {/* round cursor over cards (mouse only) */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-30 hidden md:block"
          style={{ x: sx, y: sy }}
        >
          <motion.div
            className="-ml-11 -mt-11 flex h-[88px] w-[88px] items-center justify-center rounded-full bg-gold font-body text-[11px] font-bold uppercase tracking-[0.18em] text-ink shadow-[0_12px_40px_-8px_rgb(240_181_74/0.6)]"
            initial={false}
            animate={{ scale: overCard ? 1 : 0, opacity: overCard ? 1 : 0 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            View
          </motion.div>
        </motion.div>
      </div>
      {/* rendered on <body> so the section's diagonal clip can't cut it */}
      {createPortal(<AnimatePresence>{openSlug && <ProjectViewer key="viewer" slug={openSlug} onClose={close} onGo={go} />}</AnimatePresence>, document.body)}
    </section>
  );
}

// One stop on the timeline. As it passes the middle of the screen it grows to full size and
// brightens; cards further out sit a little smaller and dimmer, and their pictures drift.
function TrackItem({
  project,
  index,
  order,
  x,
  reduce,
  onOpen,
  refFn,
}: {
  project: Project;
  index: number;
  order: number;
  x: MotionValue<number>;
  reduce: boolean;
  onOpen: (slug: string) => void;
  refFn: (el: HTMLLIElement | null) => void;
}) {
  const li = useRef<HTMLLIElement | null>(null);
  // -1 (far left) … 0 (middle) … 1 (far right)
  const drift = useTransform(x, (v) => {
    const el = li.current;
    if (!el || reduce) return 0;
    const d = (el.offsetLeft + el.offsetWidth / 2 + v - window.innerWidth / 2) / window.innerWidth;
    return Math.max(-1, Math.min(1, d));
  });
  const scale = useTransform(drift, (d) => 1 - Math.min(Math.abs(d), 1) * 0.12);
  const opacity = useTransform(drift, (d) => 1 - Math.min(Math.abs(d), 1) * 0.45);
  const rotate = useTransform(drift, (d) => d * -2.5);

  return (
    <motion.li
      ref={(el) => { li.current = el; refFn(el); }}
      layout="position"
      className="shrink-0"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ duration: 0.6, ease: EASE, delay: Math.min(order, 4) * 0.05 }}
    >
      <div style={{ transform: `translateY(${order % 2 ? 3 : -3}vh)` }}>
        <motion.div style={reduce ? undefined : { scale, opacity, rotate }}>
          <WorkCard project={project} index={index} onOpen={onOpen} drift={drift} />
        </motion.div>
      </div>
    </motion.li>
  );
}

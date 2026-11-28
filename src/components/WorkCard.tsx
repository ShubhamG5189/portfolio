import { useRef, useState } from 'react';
import { motion, useTransform, type MotionValue } from 'framer-motion';
import type { Project } from '../data/content';

// One collectible card on the work timeline. The cover is a still picture; if the project has a
// `hoverVideo`, it plays on top while the cursor (or keyboard focus) is on the card.
// `drift` (-1 … 1, how far the card sits from the middle of the screen) slides the picture inside
// its frame a little, so the covers feel like windows rather than flat stickers.
export default function WorkCard({
  project: p,
  index,
  onOpen,
  drift,
}: {
  project: Project;
  index: number;
  onOpen: (slug: string) => void;
  drift: MotionValue<number>;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const imgX = useTransform(drift, [-1, 1], ['7%', '-7%']);

  const start = () => {
    const v = video.current;
    if (!v || !matchMedia('(hover: hover)').matches) return;
    v.play().catch(() => {});
  };
  const stop = () => {
    const v = video.current;
    if (!v) return;
    v.pause();
    setPlaying(false);
  };

  return (
    <a
      href={`#work/${p.slug}`}
      onClick={(e) => { e.preventDefault(); stop(); onOpen(p.slug); }}
      onPointerEnter={start}
      onPointerLeave={stop}
      onFocus={start}
      onBlur={stop}
      data-work-card=""
      aria-label={`Open ${p.name}, ${p.category}`}
      className="collectible group block w-[min(80vw,360px)] md:w-[clamp(300px,27vw,420px)] md:cursor-none"
    >
      <span className="card-surface block">
        <motion.span layoutId={`cover-${p.slug}`} className="relative block overflow-hidden rounded-[5px] bg-night-2">
          <motion.img
            src={p.cover}
            alt=""
            loading="lazy"
            style={{ x: imgX }}
            className="aspect-[808/632] w-full scale-[1.16] object-cover transition-[filter] duration-500 group-hover:brightness-110"
          />
          {p.hoverVideo && (
            <video
              ref={video}
              src={p.hoverVideo}
              muted
              loop
              playsInline
              preload="none"
              aria-hidden="true"
              onPlaying={() => setPlaying(true)}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${playing ? 'opacity-100' : 'opacity-0'}`}
            />
          )}
          {/* soft shade at the bottom so the tag reads on bright covers */}
          <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-night/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-100" />
          {/* "view" tag: always on touch screens, on keyboard focus elsewhere (the mouse gets the round cursor) */}
          <span className="pointer-events-none absolute bottom-3 left-3 translate-y-2 rounded-full bg-night/80 px-3 py-1.5 font-body text-[10px] font-semibold uppercase tracking-[0.18em] text-mist opacity-0 backdrop-blur transition-all duration-300 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100">
            View project
          </span>
        </motion.span>
      </span>
      <span className="mt-5 flex items-baseline justify-between gap-4 border-b border-mist/15 pb-2 font-body text-[11px] font-semibold uppercase tracking-[0.18em]">
        <span className="tabular-nums text-gold">{String(index + 1).padStart(2, '0')}</span>
        <span className="truncate text-mist-dim">{p.category}{p.year ? ` · ${p.year}` : ''}</span>
      </span>
      <span className="mt-3 block font-display text-[clamp(1.4rem,2vw,1.9rem)] font-black uppercase leading-none text-mist transition-colors duration-300 group-hover:text-gold">{p.name}</span>
      <span className="mt-2 block font-body text-xs font-medium uppercase tracking-[0.16em] text-mist-dim">{p.stats}</span>
    </a>
  );
}

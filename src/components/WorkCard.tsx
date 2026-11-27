import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { Project } from '../data/content';

// One collectible card on the work timeline. The cover is a still picture; if the project has a
// `hoverVideo`, it plays on top while the cursor (or keyboard focus) is on the card.
export default function WorkCard({ project: p, onOpen }: { project: Project; onOpen: (slug: string) => void }) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

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
      aria-label={`Open ${p.name}, ${p.stats}`}
      className="collectible group block w-[min(80vw,360px)] md:w-[clamp(300px,27vw,420px)]"
    >
      <span className="card-surface block">
        <motion.span layoutId={`cover-${p.slug}`} className="relative block overflow-hidden rounded-[5px]">
          <img src={p.cover} alt="" loading="lazy" className="aspect-[808/632] w-full object-cover" />
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
          {/* "view" tag that slides up on hover */}
          <span className="pointer-events-none absolute bottom-3 left-3 translate-y-2 rounded-full bg-night/80 px-3 py-1.5 font-body text-[10px] font-semibold uppercase tracking-[0.18em] text-mist opacity-0 backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
            View project
          </span>
        </motion.span>
      </span>
      <span className="mt-5 block font-display text-[clamp(1.4rem,2vw,1.9rem)] font-black uppercase leading-none text-mist">{p.name}</span>
      <span className="mt-2 block font-body text-xs font-medium uppercase tracking-[0.16em] text-mist-dim">{p.stats}</span>
    </a>
  );
}

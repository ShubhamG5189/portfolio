import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from 'lucide-react';
import { projects, type Media } from '../data/content';

const EASE = [0.22, 1, 0.36, 1] as const;

// Full-screen project viewer. The card's cover flies up into place (shared layoutId), the details
// rise in, and the project's pictures and videos follow in one scrolling column.
// Esc closes; ← → step between projects.
export default function ProjectViewer({ slug, onClose, onGo }: { slug: string; onClose: () => void; onGo: (slug: string) => void }) {
  const i = projects.findIndex((p) => p.slug === slug);
  const p = projects[i];
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];
  const scroller = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  // lock the page behind, focus the close button, keyboard shortcuts
  useEffect(() => {
    // (always unlock to '' on close: the intro may have locked the page first and already let go)
    const html = document.documentElement;
    html.style.overflow = 'hidden';
    closeBtn.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') onGo(next.slug);
      else if (e.key === 'ArrowLeft') onGo(prev.slug);
    };
    window.addEventListener('keydown', onKey);
    return () => { html.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [onClose, onGo, next.slug, prev.slug]);

  // switching project starts at the top
  useEffect(() => { scroller.current?.scrollTo({ top: 0 }); }, [slug]);

  if (!p) return null;
  const [first, ...rest]: Media[] = p.media.length ? p.media : [{ type: 'image', src: p.cover }];

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={p.name}
      className="fixed inset-0 z-[150]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.35, delay: 0.15 } }}
    >
      {/* backdrop: a night curtain that drops down */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-night"
        initial={{ clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' }}
        animate={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
        exit={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)' }}
        transition={{ duration: 0.6, ease: EASE }}
        onClick={onClose}
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(60% 50% at 25% 20%, rgb(140 107 255 / 0.14), transparent 70%)' }} />

      {/* top bar */}
      <motion.div
        className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-5 py-4 md:px-10 md:py-6"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.35, duration: 0.5, ease: EASE } }}
        exit={{ opacity: 0, transition: { duration: 0.15 } }}
      >
        <span className="font-display text-lg font-black tabular-nums text-mist/60">
          {String(i + 1).padStart(2, '0')} <span className="text-gold">/</span> {String(projects.length).padStart(2, '0')}
        </span>
        <button
          ref={closeBtn}
          type="button"
          onClick={onClose}
          className="group flex items-center gap-2 rounded-full border border-mist/20 bg-night/70 py-2 pl-4 pr-2 font-body text-xs font-semibold uppercase tracking-[0.16em] text-mist backdrop-blur transition-colors hover:border-gold hover:text-gold"
        >
          Close
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-mist/10 transition-transform duration-300 group-hover:rotate-90">
            <X className="h-4 w-4" strokeWidth={2.2} />
          </span>
        </button>
      </motion.div>

      {/* content */}
      <div ref={scroller} className="relative h-full overflow-y-auto overscroll-contain">
        <div className="mx-auto grid max-w-[1200px] grid-cols-[minmax(0,1fr)] gap-10 px-5 pb-24 pt-24 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16 md:px-10 md:pt-28">
          {/* details (sticky on wide screens) */}
          <motion.div
            key={`info-${p.slug}`}
            className="min-w-0 md:sticky md:top-28 md:self-start"
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            variants={{ show: { transition: { staggerChildren: 0.07, delayChildren: 0.3 } } }}
          >
            {[
              <p key="k" className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                {p.category}{p.year ? ` · ${p.year}` : ''}
              </p>,
              <h2 key="t" className="mt-3 font-display text-[clamp(2.6rem,6vw,5rem)] font-black uppercase leading-[0.86] text-mist">{p.name}</h2>,
              <p key="s" className="mt-4 font-body text-xs font-medium uppercase tracking-[0.16em] text-mist-dim">{p.stats}</p>,
              <p key="d" className="mt-6 max-w-[46ch] font-body text-base leading-relaxed text-mist/80">{p.description}</p>,
              p.link ? (
                <a
                  key="l"
                  href={p.link}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-7 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 font-body text-sm font-semibold uppercase tracking-[0.14em] text-ink transition-transform hover:-translate-y-0.5"
                >
                  {p.link.includes('behance.net') ? 'View on Behance' : 'See the full project'} <ArrowUpRight className="h-4 w-4" strokeWidth={2.4} />
                </a>
              ) : null,
            ].filter(Boolean).map((el, n) => (
              <motion.div
                key={n}
                variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } }}
              >
                {el}
              </motion.div>
            ))}
          </motion.div>

          {/* pictures and videos */}
          <div className="flex min-w-0 flex-col gap-5 md:gap-7">
            {/* the cover flies up from the card */}
            <motion.div layoutId={`cover-${p.slug}`} transition={{ duration: 0.7, ease: EASE }} className="overflow-hidden rounded-[10px]">
              <MediaItem m={first} alt={p.name} eager />
            </motion.div>
            {first.caption && <p className="-mt-3 font-body text-sm text-mist-dim md:-mt-5">{first.caption}</p>}
            {rest.map((m, n) => (
              <motion.figure
                key={`${p.slug}-${n}`}
                className="overflow-hidden rounded-[10px]"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, root: scroller, amount: 0.15 }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                <MediaItem m={m} alt={`${p.name}: picture ${n + 2}`} />
                {m.caption && <figcaption className="mt-2 font-body text-sm text-mist-dim">{m.caption}</figcaption>}
              </motion.figure>
            ))}

            {/* step to the neighbours */}
            {projects.length > 1 && (
              <nav aria-label="More projects" className="mt-8 grid grid-cols-2 gap-4 border-t border-mist/15 pt-6">
                <button type="button" onClick={() => onGo(prev.slug)} className="group min-w-0 text-left">
                  <span className="flex items-center gap-2 font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-mist-dim">
                    <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" /> Previous
                  </span>
                  <span className="mt-1 block truncate font-display text-xl font-black uppercase text-mist transition-colors group-hover:text-gold md:text-2xl">{prev.name}</span>
                </button>
                <button type="button" onClick={() => onGo(next.slug)} className="group min-w-0 text-right">
                  <span className="flex items-center justify-end gap-2 font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-mist-dim">
                    Next <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                  <span className="mt-1 block truncate font-display text-xl font-black uppercase text-mist transition-colors group-hover:text-gold md:text-2xl">{next.name}</span>
                </button>
              </nav>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function MediaItem({ m, alt, eager }: { m: Media; alt: string; eager?: boolean }) {
  if (m.type === 'embed') {
    return (
      <div className="relative w-full bg-black" style={{ aspectRatio: String(m.ratio ?? 16 / 9) }}>
        <iframe
          src={m.src}
          title={alt}
          loading={eager ? 'eager' : 'lazy'}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    );
  }
  if (m.type === 'video') {
    return <video src={m.src} autoPlay muted loop playsInline controls preload="metadata" className="block w-full bg-black" />;
  }
  return <img src={m.src} alt={alt} loading={eager ? 'eager' : 'lazy'} className="block w-full" />;
}

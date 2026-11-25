import { useEffect, useRef, useState } from 'react';
import { gallery } from '../data/content';

type Item = (typeof gallery)[number];
const half = Math.ceil(gallery.length / 2);
const row1 = gallery.slice(0, half);
const row2 = gallery.slice(half);

function Row({ items, x }: { items: Item[]; x: number }) {
  const tripled = [...items, ...items, ...items]; // enough tiles to never run out while sliding
  return (
    <ul className="flex gap-4" style={{ transform: `translateX(${x}px)`, willChange: 'transform' }}>
      {tripled.map((item, i) => (
        <li key={i} className="shrink-0" aria-hidden={i >= items.length ? true : undefined}>
          <figure>
            <img src={item.src} alt="" loading="lazy" className="h-[200px] w-[310px] rounded-md object-cover sm:h-[250px] sm:w-[390px]" />
            <figcaption className="mt-2.5 font-body text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">{item.caption}</figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}

// Two rows of work that slide in opposite directions as you scroll.
export default function GallerySection() {
  const ref = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      setOffset((window.scrollY - top + window.innerHeight) * 0.3);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section id="gallery" ref={ref} className="cut-fall relative z-30 overflow-hidden bg-paper pb-[calc(var(--cut)+5rem)] pt-[calc(var(--cut)+4rem)] text-ink md:pb-[calc(var(--cut)+6rem)]">
      <h2
        className="mb-10 px-5 font-display font-black uppercase leading-[0.85] sm:px-8 md:mb-14 md:px-10"
        style={{ fontSize: 'clamp(3rem, 9vw, 8rem)' }}
      >
        In motion
      </h2>
      <div className="flex flex-col gap-8">
        <Row items={row1} x={offset - 300} />
        <Row items={row2} x={-(offset - 300) - 600} />
      </div>
    </section>
  );
}

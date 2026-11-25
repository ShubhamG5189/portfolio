import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useRef } from 'react';
import ContactButton from '../components/ContactButton';
import { mediaFill } from '../components/MediaSlot';
import { numbers, site } from '../data/content';

// One rolling digit: a column of 0–9 that slides to its value, filled with the row's media.
function Digit({ value, fill, delay, go }: { value: number; fill: string; delay: number; go: boolean }) {
  return (
    <span className="relative inline-block h-[0.8em] overflow-hidden align-top">
      <motion.span
        className="media-text block"
        style={{ backgroundImage: fill, backgroundAttachment: 'fixed' }}
        initial={{ y: '0%' }}
        animate={{ y: go ? `-${value * 10}%` : '0%' }}
        transition={{ delay, duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {Array.from({ length: 10 }, (_, d) => (
          <span key={d} className="block h-[0.8em] leading-[0.8]">{d}</span>
        ))}
      </motion.span>
    </span>
  );
}

function Row({ n }: { n: (typeof numbers)[number] }) {
  const ref = useRef<HTMLDivElement>(null);
  const go = useInView(ref, { once: true, amount: 0.35 });
  const fill = mediaFill(n.media);
  const digits = String(n.value).split('').map(Number);
  const [first, ...rest] = n.title.split('\n');

  return (
    <div ref={ref} className="grid items-center gap-8 border-t border-line py-16 md:min-h-[90vh] md:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)] md:py-10">
      <div>
        <h3 className="text-[clamp(2rem,3.4vw,3.25rem)] font-semibold leading-[1] tracking-[-0.045em]">
          {n.value} {first}
          <br />
          {rest.join(' ')}
        </h3>
        <p className="mt-5 max-w-[36ch] text-[15px] font-medium leading-[1.45] text-muted">{n.text}</p>
        <a href={n.href} className="mt-7 inline-flex items-center gap-2 rounded-full bg-fg px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2a2a2a]">
          {n.cta}
          <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
        </a>
      </div>
      <div
        aria-label={`${n.value}`}
        role="img"
        className="flex justify-end whitespace-nowrap text-[clamp(11rem,40vw,38rem)] font-bold leading-[0.8] tracking-[-0.07em]"
      >
        {digits.map((d, i) => (
          <Digit key={i} value={d} fill={fill} delay={i * 0.12} go={go} />
        ))}
      </div>
    </div>
  );
}

export default function NumbersSection() {
  return (
    <section className="px-5 pt-24 md:px-8 md:pt-32" aria-labelledby="numbers-title">
      <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <h2 id="numbers-title" className="text-[clamp(2.6rem,5.4vw,5rem)] font-semibold leading-[0.95] tracking-[-0.05em]">
          {site.name}
          <br />
          in Numbers
        </h2>
        <ContactButton label="Let's work together" />
      </div>
      {numbers.map((n) => (
        <Row key={n.title} n={n} />
      ))}
    </section>
  );
}

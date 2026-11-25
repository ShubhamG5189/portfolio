import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import MediaSlot from '../components/MediaSlot';
import { featureMedia, marqueeText } from '../data/content';

// A big piece of media grows in the middle while a giant line of text slides past behind it.
export default function FeatureMarquee() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const x = useTransform(scrollYProgress, [0, 1], ['5%', '-55%']);
  const scale = useTransform(scrollYProgress, [0.15, 0.5], [0.62, 1]);
  const line = marqueeText.repeat(4);

  return (
    <section ref={ref} className="relative h-[220vh]" aria-label="Showreel">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.p
          aria-hidden="true"
          style={{ x }}
          className="absolute whitespace-nowrap text-[24vw] font-bold leading-none tracking-[-0.06em] md:text-[19vw]"
        >
          {line}
        </motion.p>
        <motion.div style={{ scale }} className="relative z-10 mx-auto w-[86vw] md:w-[min(60vw,1040px)]">
          <MediaSlot item={featureMedia} className="aspect-video w-full" />
        </motion.div>
      </div>
    </section>
  );
}

import { motion } from 'framer-motion';
import type { CSSProperties, ElementType, ReactNode } from 'react';

type Props = {
  children?: ReactNode;
  as?: ElementType;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  /** When given, the element waits for this to be true instead of animating on scroll into view. */
  gate?: boolean;
  className?: string;
  style?: CSSProperties;
  [key: string]: unknown;
};

// motion.create() is cached per element type so it is not rebuilt every render
const cache = new Map<ElementType, ElementType>();
const motionFor = (as: ElementType): ElementType => {
  let m = cache.get(as);
  if (!m) {
    m = motion.create(as as never) as unknown as ElementType;
    cache.set(as, m);
  }
  return m;
};

export default function FadeIn({ children, as = 'div', delay = 0, duration = 0.7, x = 0, y = 30, gate, ...rest }: Props) {
  const Comp = motionFor(as);
  const hidden = { opacity: 0, x, y };
  const shown = { opacity: 1, x: 0, y: 0 };
  const trigger =
    gate === undefined
      ? { whileInView: shown, viewport: { once: true, margin: '50px', amount: 0 } }
      : { animate: gate ? shown : hidden };
  return (
    <Comp initial={hidden} {...trigger} transition={{ delay, duration, ease: [0.25, 0.1, 0.25, 1] }} {...rest}>
      {children}
    </Comp>
  );
}

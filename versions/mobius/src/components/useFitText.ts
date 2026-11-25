import { useLayoutEffect, useRef, useState } from 'react';

// Measures a line of text and returns the font size (px) that makes it fill its box's width.
// `fill` is the share of the width to use; `maxVw` caps the size relative to the viewport.
export function useFitText(fill = 0.96, maxVw = 0.4) {
  const box = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLSpanElement>(null);
  const [size, setSize] = useState<number>();

  useLayoutEffect(() => {
    const fit = () => {
      const b = box.current, t = text.current;
      if (!b || !t) return;
      const current = parseFloat(getComputedStyle(t).fontSize);
      const width = t.getBoundingClientRect().width;
      if (!width) return;
      setSize(Math.min((current * b.clientWidth * fill) / width, window.innerWidth * maxVw));
    };
    fit();
    document.fonts?.ready.then(fit); // refit once the web font has loaded
    const ro = new ResizeObserver(fit);
    if (box.current) ro.observe(box.current);
    return () => ro.disconnect();
  }, [fill, maxVw]);

  return { box, text, size };
}

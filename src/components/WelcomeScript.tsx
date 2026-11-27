import { motion, useReducedMotion } from 'framer-motion';

const W = 640, H = 230;

// "Welcome" in a handwritten script that writes itself left to right, like a pen,
// then a flourish underline draws beneath it. A soft paper-coloured outline keeps it
// readable where it crosses the portrait.
export default function WelcomeScript({ start, delay = 0, className = '' }: { start: boolean; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  const write = { delay, duration: reduce ? 0 : 1.9, ease: [0.45, 0.05, 0.35, 1] as const };
  const swash = { delay: reduce ? 0 : delay + 1.6, duration: reduce ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={`pointer-events-none overflow-visible ${className}`} aria-hidden="true">
      <defs>
        {/* the "pen": a window that opens from left to right, its edge slightly slanted like handwriting */}
        <clipPath id="welcome-pen">
          <motion.polygon
            initial={{ points: `-40,0 -10,0 -40,${H} -70,${H}` }}
            animate={start ? { points: `-40,0 ${W + 70},0 ${W + 40},${H} -70,${H}` } : undefined}
            transition={write}
          />
        </clipPath>
      </defs>
      <g clipPath="url(#welcome-pen)">
        <text
          x="14"
          y="150"
          fontFamily="'Dancing Script', 'Brush Script MT', cursive"
          fontWeight={700}
          fontSize="168"
          fill="var(--violet-ink)"
          stroke="var(--paper)"
          strokeWidth="12"
          strokeLinejoin="round"
          paintOrder="stroke"
        >
          Welcome
        </text>
      </g>
      {/* flourish underline */}
      <motion.path
        d={`M 40 196 C 180 168, 360 214, ${W - 40} 176`}
        fill="none"
        stroke="var(--gold)"
        strokeWidth="7"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={start ? { pathLength: 1, opacity: 1 } : undefined}
        transition={swash}
      />
    </svg>
  );
}

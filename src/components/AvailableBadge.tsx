import { ArrowUpRight } from 'lucide-react';
import { site } from '../data/content';

// Top-left of the home page: the "S" monogram with a live "open for work" dot, inviting visitors in.
// Set `available` to false when you're fully booked: the dot turns grey and the text changes.
const available = true;

export default function AvailableBadge() {
  const initial = site.name[0].toUpperCase();
  const label = available ? 'Available for new projects' : 'Booked — say hi anyway';
  return (
    <a
      href="/contact"
      aria-label={`${label} — contact ${site.name[0].toUpperCase()}${site.name.slice(1)}`}
      className="contact-btn group flex shrink-0 items-center gap-2.5 rounded-full py-1 pr-1 sm:gap-3"
    >
      {/* monogram, same as the browser icon */}
      <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-[30%] bg-night font-display text-xl font-black leading-none text-gold transition-transform duration-300 [transition-timing-function:var(--ease-out)] group-hover:-rotate-6 md:h-10 md:w-10 md:text-2xl">
        {initial}
        {/* status dot */}
        <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-paper">
          {available && <span className="absolute h-2.5 w-2.5 animate-ping rounded-full bg-[#22c55e] opacity-70 motion-reduce:animate-none" />}
          <span className={`relative h-2.5 w-2.5 rounded-full ${available ? 'bg-[#16a34a]' : 'bg-[#9ca3af]'}`} />
        </span>
      </span>
      <span className="hidden items-center gap-1.5 font-body text-xs font-semibold uppercase tracking-[0.14em] underline-offset-[6px] group-hover:underline sm:flex md:text-[0.8rem]">
        <span className="md:hidden">{available ? 'Available' : 'Booked'}</span>
        <span className="hidden md:inline">{label}</span>
        <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={2.4} />
      </span>
    </a>
  );
}

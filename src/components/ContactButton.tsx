import { ArrowUpRight } from 'lucide-react';
import { site } from '../data/content';

// The class "contact-btn" matters: the Living Portrait shows heart eyes when it is hovered.
export default function ContactButton({ className = '' }: { className?: string }) {
  return (
    <a
      href={`mailto:${site.email}`}
      className={`contact-btn group inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 font-body text-sm font-semibold uppercase tracking-[0.14em] text-ink transition-colors duration-200 hover:bg-[#f7c96e] active:bg-[#e3a535] sm:px-8 sm:py-4 sm:text-[0.95rem] ${className}`}
    >
      Contact me
      <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={2.2} />
    </a>
  );
}

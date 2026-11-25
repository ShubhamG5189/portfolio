import { ArrowUp, ArrowUpRight } from 'lucide-react';
import AnimatedText from '../components/AnimatedText';
import ContactButton from '../components/ContactButton';
import { site } from '../data/content';

// The closing statement, then the ways to get in touch.
export default function ContactSection() {
  const year = new Date().getFullYear();
  return (
    <section id="contact" className="cut-rise scanlines relative z-40 overflow-hidden bg-night px-5 pb-10 pt-[calc(var(--cut)+5rem)] sm:px-8 md:px-10 md:pt-[calc(var(--cut)+7rem)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(60% 45% at 50% 30%, rgb(140 107 255 / 0.18), transparent 70%)' }}
      />
      <div className="relative mx-auto max-w-6xl">
        <AnimatedText
          text={site.about}
          className="max-w-[30ch] font-display font-extrabold uppercase leading-[0.98] text-mist"
          style={{ fontSize: 'clamp(1.9rem, 4.4vw, 4rem)' }}
        />

        <div className="mt-16 flex flex-col gap-8 md:mt-24 md:flex-row md:items-center md:justify-between">
          <a
            href={`mailto:${site.email}`}
            className="group inline-flex items-center gap-3 font-display font-black uppercase leading-none text-mist underline-offset-8 hover:underline"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 3.5rem)' }}
          >
            {site.email}
            <ArrowUpRight className="h-[0.8em] w-[0.8em] text-gold transition-transform duration-200 group-hover:-translate-y-1 group-hover:translate-x-1" strokeWidth={2.2} />
          </a>
          <ContactButton />
        </div>
      </div>

      <footer className="relative mx-auto mt-24 flex max-w-6xl flex-col items-start gap-6 border-t border-mist/15 pt-8 sm:flex-row sm:items-center sm:justify-between md:mt-32">
        <ul className="flex flex-wrap gap-x-7 gap-y-2">
          {site.socials.map((s) => (
            <li key={s.label}>
              <a href={s.href} className="font-body text-sm font-semibold uppercase tracking-[0.16em] text-mist underline-offset-[6px] hover:underline">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-6">
          <span className="font-body text-sm uppercase tracking-[0.16em] text-mist-dim">© {year} {site.name}</span>
          <a
            href="#"
            aria-label="Back to top"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-mist/40 text-mist transition-colors duration-200 hover:border-gold hover:text-gold"
          >
            <ArrowUp className="h-4 w-4" />
          </a>
        </div>
      </footer>
    </section>
  );
}

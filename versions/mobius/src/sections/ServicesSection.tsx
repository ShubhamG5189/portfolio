import { ArrowRight } from 'lucide-react';
import AnimatedText from '../components/AnimatedText';
import { services } from '../data/content';

const LETTERS = 'ABCDEFGH';

// Left column stays put while each service statement darkens word by word on the right.
export default function ServicesSection() {
  return (
    <section id="services" className="relative px-5 md:px-8">
      <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,2.3fr)]">
        <div className="top-0 flex flex-col justify-between pt-24 md:sticky md:h-screen md:pb-10 md:pt-[16vh]">
          <h2 className="text-xl font-semibold tracking-[-0.02em]">Services</h2>
          <div className="hidden md:block">
            <p className="mb-6 max-w-[22ch] text-[13px] font-medium leading-snug text-muted">
              Have something that needs to look its best in 3D? Let's make it together.
            </p>
            <a href="#contact" className="contact-btn group inline-flex items-center gap-3 text-2xl font-semibold tracking-[-0.03em]">
              Get started
              <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.2} />
            </a>
          </div>
        </div>

        <ol className="md:pt-[16vh]">
          {services.map((s, i) => (
            <li key={s.name} className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 pb-24 md:gap-x-8 md:pb-[34vh]">
              <span aria-hidden="true" className="text-[clamp(2rem,4.4vw,4rem)] font-medium leading-[1] tracking-[-0.04em] text-faint">
                {LETTERS[i]} /
              </span>
              <div>
                <h3 className="sr-only">{s.name}</h3>
                <AnimatedText
                  text={s.statement}
                  className="text-[clamp(1.9rem,3.9vw,3.75rem)] font-semibold leading-[1.02] tracking-[-0.04em]"
                />
                <ul className="mt-8 flex flex-wrap gap-2 md:mt-12">
                  {s.tags.map((t) => (
                    <li key={t} className="rounded-full bg-chip px-4 py-2 text-[13px] font-semibold tracking-[-0.01em]">{t}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

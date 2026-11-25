import { Fragment } from 'react';
import { services, tools } from '../data/content';

export default function ServicesSection() {
  return (
    <section id="services" className="relative z-20 bg-night px-5 pb-28 pt-20 sm:px-8 md:px-10 md:pb-40 md:pt-28">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-10 font-display font-black uppercase leading-[0.85] text-mist md:mb-16" style={{ fontSize: 'clamp(3rem, 9vw, 8rem)' }}>
          What I make
        </h2>

        <ul>
          {services.map((s) => (
            <li
              key={s.name}
              className="grid gap-3 border-t border-mist/15 py-7 md:grid-cols-[1fr_minmax(0,26rem)] md:items-baseline md:gap-10 md:py-9"
            >
              <h3 className="split-hover font-display font-black uppercase leading-[0.9] text-mist" style={{ fontSize: 'clamp(2.25rem, 6vw, 5.25rem)' }}>
                {s.name}
              </h3>
              <p className="max-w-[44ch] font-body text-base leading-relaxed text-mist-dim md:text-[1.05rem]">{s.description}</p>
            </li>
          ))}
        </ul>

        <div className="mt-16 border-t border-mist/15 pt-10 md:mt-24">
          <h3 className="font-body text-sm font-semibold uppercase tracking-[0.2em] text-mist-dim">Toolkit</h3>
          <p className="mt-4 font-display text-[clamp(1.75rem,3.6vw,3rem)] font-extrabold uppercase leading-tight text-mist">
            {tools.map((t, i) => (
              <Fragment key={t}>
                <span className="whitespace-nowrap">
                  {t}
                  {i < tools.length - 1 && <span className="px-3 text-gold" aria-hidden="true">/</span>}
                </span>{' '}
              </Fragment>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}

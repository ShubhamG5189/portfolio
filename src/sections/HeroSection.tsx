import FadeIn from '../components/FadeIn';
import ContactButton from '../components/ContactButton';
import LivingPortrait from '../components/LivingPortrait';
import { useIntroDone } from '../components/IntroContext';
import { useFitText } from '../components/useFitText';
import { navLinks, projects, site } from '../data/content';

export default function HeroSection() {
  const ready = useIntroDone(); // the hero plays its entrance once the intro wipes away
  const { box, text, size } = useFitText(1, 0.42);
  const name = site.name;

  return (
    <section className="relative h-screen min-h-[640px] overflow-hidden bg-paper text-ink">
      {/* the giant faded name behind the portrait */}
      <div ref={box} aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[13vh] select-none px-2 text-center md:top-[9vh]">
        <span
          ref={text}
          className="inline-block whitespace-nowrap font-display font-black uppercase leading-[0.8] text-paper-deep"
          style={{ fontSize: size ? `${size}px` : '30vw' }}
        >
          {name}
        </span>
      </div>

      <FadeIn
        as="nav"
        gate={ready}
        y={-16}
        duration={0.6}
        aria-label="Main"
        className="relative z-30 flex items-center justify-between px-5 pt-5 md:px-10 md:pt-7"
      >
        <a href="#" className="shrink-0 font-display text-lg font-black uppercase tracking-[0.04em] sm:text-xl md:text-2xl md:tracking-[0.06em]">
          {name}
        </a>
        <ul className="flex gap-3 sm:gap-7 md:gap-10">
          {navLinks.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                className="font-body text-[11px] font-semibold uppercase tracking-[0.08em] underline-offset-[6px] sm:text-sm sm:tracking-[0.16em] transition-colors hover:underline"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </FadeIn>

      <LivingPortrait ready={ready} />

      {/* introduction (left) and the one action (right); sits above the diagonal cut.
          The strip spans the full width across the face, so it lets the mouse through to the portrait;
          only its two blocks catch clicks. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[calc(var(--cut)+28px)] z-20 flex items-end justify-between gap-6 px-5 md:bottom-auto md:top-[38%] md:items-center md:px-10">
        <FadeIn gate={ready} delay={0.3} y={20} className="pointer-events-auto max-w-[44vw] md:max-w-[270px]">
          <a href="#work" aria-label={`See ${projects[0].name}`} className="collectible mb-6 hidden w-[118px] -rotate-[5deg] md:block">
            <span className="card-surface block">
              <img src={projects[0].col2} alt="" className="aspect-[3/4] w-full rounded-[5px] object-cover" />
            </span>
          </a>
          <h1 className="font-display text-[clamp(1.6rem,2.6vw,2.4rem)] font-black uppercase leading-[0.9]">
            {name}, 3D creator
          </h1>
          <p className="mt-3 font-body text-[0.95rem] leading-snug text-ink-soft first-letter:uppercase md:text-base">{site.tagline}.</p>
        </FadeIn>
        <FadeIn gate={ready} delay={0.45} y={20} className="pointer-events-auto shrink-0">
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  );
}

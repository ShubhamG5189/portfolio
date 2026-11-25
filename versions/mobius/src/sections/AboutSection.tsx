import MediaSlot from '../components/MediaSlot';
import { aboutMe, clientsCount, site } from '../data/content';

export function AboutSection() {
  return (
    <section id="about" className="px-5 py-24 md:px-8 md:py-36">
      <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)]">
        <h2 className="text-[clamp(3rem,6.4vw,6.5rem)] font-semibold leading-[0.9] tracking-[-0.055em]">About me</h2>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
          <div>
            <p className="max-w-[30ch] text-[clamp(1.35rem,2.1vw,1.9rem)] font-semibold leading-[1.15] tracking-[-0.035em]">{aboutMe.text}</p>
            <p className="mt-8 max-w-[44ch] text-[15px] font-medium leading-[1.45] text-muted first-letter:uppercase">{site.about}</p>
          </div>
          <figure>
            <MediaSlot item={aboutMe.photo} className="aspect-[4/5] w-full" />
            <figcaption className="mt-4">
              <span className="block text-lg font-semibold tracking-[-0.03em]">{site.name}</span>
              <span className="text-[14px] font-medium text-muted">{aboutMe.caption}</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

// Logo grid over a giant faded word.
export function ClientsSection() {
  return (
    <section className="relative overflow-hidden px-5 py-24 md:px-8 md:py-36" aria-labelledby="clients-title">
      <p aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center text-[26vw] font-bold leading-none tracking-[-0.07em] text-chip">
        Clients
      </p>
      <h2 id="clients-title" className="sr-only">Clients</h2>
      <ul className="relative grid grid-cols-2 gap-y-14 sm:grid-cols-3 md:grid-cols-4 md:gap-y-20">
        {Array.from({ length: clientsCount }, (_, i) => (
          <li key={i} className="flex h-16 items-center justify-center">
            <span className="flex items-center gap-2 text-[clamp(1.1rem,1.8vw,1.6rem)] font-bold tracking-[-0.05em] text-fg/80">
              <span aria-hidden="true" className="h-[1.1em] w-[1.1em] rounded-[30%] bg-fg/80" style={{ borderRadius: ['50%', '30%', '10%', '50% 0'][i % 4] }} />
              Client {String(i + 1).padStart(2, '0')}
            </span>
          </li>
        ))}
      </ul>
      <p className="relative mt-16 max-w-[26ch] text-[13px] font-medium leading-snug text-muted md:mt-24">
        Brands and studios I've had the chance to work with.
      </p>
    </section>
  );
}

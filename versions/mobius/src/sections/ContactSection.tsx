import { ArrowRight, ArrowUp } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useFitText } from '../components/useFitText';
import { contactForm, navLinks, site } from '../data/content';

// A fill-in-the-blanks message. Sending opens the visitor's email app with everything filled in.
export function ContactSection() {
  const [topic, setTopic] = useState('');
  const [budget, setBudget] = useState('');
  const [timing, setTiming] = useState('');

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get('name') || '').trim();
    const email = String(f.get('email') || '').trim();
    const body =
      `Hi ${site.name}, my name is ${name} and I'm reaching out about ${topic || 'a project'}. ` +
      `My budget is roughly ${budget || 'open'} and I'd like to start ${timing || 'soon'}. You can reach me at ${email}.`;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(`Project enquiry from ${name}`)}&body=${encodeURIComponent(body)}`;
  };

  const select = (value: string, set: (v: string) => void, options: string[], label: string, placeholder: string) => (
    <select aria-label={label} required value={value} onChange={(e) => set(e.target.value)} className={`blank ${value ? '' : 'empty'}`}>
      <option value="" disabled>{placeholder}</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );

  return (
    <section id="contact" className="px-5 py-24 md:px-8 md:py-36">
      <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)]">
        <div>
          <h2 className="text-[clamp(3rem,6.4vw,6.5rem)] font-semibold leading-[0.9] tracking-[-0.055em]">Let's talk</h2>
          <p className="mt-6 max-w-[28ch] text-[15px] font-medium leading-[1.45] text-muted">
            Fill in the blanks and send. Or write directly to{' '}
            <a href={`mailto:${site.email}`} className="text-fg underline underline-offset-4">{site.email}</a>.
          </p>
        </div>

        <form onSubmit={submit} className="text-[clamp(1.4rem,2.5vw,2.3rem)] font-semibold leading-[1.65] tracking-[-0.035em]">
          <p>
            Hi {site.name}, my name is{' '}
            <input name="name" required autoComplete="name" placeholder="your name" aria-label="Your name" className="blank w-[8ch]" />{' '}
            and I'm reaching out about {select(topic, setTopic, contactForm.topics, 'Project type', 'a project type')}. My budget is
            roughly {select(budget, setBudget, contactForm.budgets, 'Budget', 'a budget')} and I'd like to start{' '}
            {select(timing, setTiming, contactForm.timings, 'Start date', 'a time')}. You can reach me at{' '}
            <input name="email" type="email" required autoComplete="email" placeholder="your email" aria-label="Your email" className="blank w-[11ch]" />.
          </p>
          <button type="submit" className="contact-btn group mt-10 inline-flex items-center gap-3 rounded-full bg-fg py-2 pl-6 pr-2 text-base font-semibold tracking-normal text-white transition-colors hover:bg-[#2a2a2a]">
            Send message
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-fg">
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2.2} />
            </span>
          </button>
        </form>
      </div>
    </section>
  );
}

export function Footer() {
  const { box, text, size } = useFitText(0.84, 0.5);
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line px-5 pb-6 pt-16 md:px-8 md:pt-24">
      <div className="flex items-start justify-between gap-4">
        <div ref={box} className="min-w-0 flex-1">
          <span ref={text} className="inline-block whitespace-nowrap font-bold leading-[0.76] tracking-[-0.065em]" style={{ fontSize: size ? `${size}px` : '20vw' }}>
            {site.name}
          </span>
        </div>
        <p className="text-[clamp(1rem,2.2vw,2rem)] font-semibold tracking-[-0.03em]">© {year}</p>
      </div>

      <div className="mt-16 grid gap-10 sm:grid-cols-3 md:mt-24">
        <div>
          <h3 className="text-[12px] font-semibold uppercase text-muted">Social</h3>
          <ul className="mt-3 space-y-1">
            {site.socials.map((s) => (
              <li key={s.label}><a href={s.href} className="text-xl font-semibold tracking-[-0.03em] hover:underline hover:underline-offset-4">{s.label}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-[12px] font-semibold uppercase text-muted">Pages</h3>
          <ul className="mt-3 space-y-1">
            {navLinks.map((l) => (
              <li key={l.label}><a href={l.href} className="text-xl font-semibold tracking-[-0.03em] hover:underline hover:underline-offset-4">{l.label}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-[12px] font-semibold uppercase text-muted">Email</h3>
          <a href={`mailto:${site.email}`} className="mt-3 block text-xl font-semibold tracking-[-0.03em] hover:underline hover:underline-offset-4">{site.email}</a>
        </div>
      </div>

      <div className="mt-16 flex items-center justify-between gap-4 border-t border-line pt-5 text-[11px] font-semibold uppercase text-muted sm:pr-40">
        <span>© {year} {site.name}. All rights reserved.</span>
        <a href="#" className="flex items-center gap-1.5 text-fg hover:underline">Back to top <ArrowUp className="h-3.5 w-3.5" /></a>
      </div>
    </footer>
  );
}

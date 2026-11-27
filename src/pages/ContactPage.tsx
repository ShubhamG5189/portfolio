import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, Check, Copy, Mail, MessageCircle, Phone } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { useFitText } from '../components/useFitText';
import { contactForm, navLinks, site, whatsappLink } from '../data/content';

const EASE = [0.16, 1, 0.3, 1] as const;
const home = (href: string) => (href.startsWith('#') ? `/${href}` : href); // in-page links point back to the home page

type Fields = { name: string; email: string; phone: string; company: string; details: string; references: string };
const EMPTY: Fields = { name: '', email: '', phone: '', company: '', details: '', references: '' };

/* ---------- small building blocks ---------- */

// A headline line that rises out of its own mask.
function RiseLine({ children, delay }: { children: ReactNode; delay: number }) {
  return (
    <span className="block overflow-hidden pb-[0.04em]">
      <motion.span className="block" initial={{ y: '105%' }} animate={{ y: '0%' }} transition={{ delay, duration: 0.9, ease: EASE }}>
        {children}
      </motion.span>
    </span>
  );
}

// Fades its block in as it scrolls into view, one after another.
function Reveal({ children, i = 0, className = '' }: { children: ReactNode; i?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: 0.06 * i, duration: 0.7, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

// A pill-shaped choice (checkbox or radio underneath, so keyboards and screen readers work).
function Chip({ type, name, value, checked, onChange }: { type: 'checkbox' | 'radio'; name: string; value: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="cursor-pointer">
      <input type={type} name={name} value={value} checked={checked} onChange={onChange} className="peer sr-only" />
      <motion.span
        animate={{ scale: checked ? [1, 1.07, 1] : 1 }}
        transition={{ duration: 0.3, ease: EASE }}
        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 font-body text-sm font-semibold transition-colors duration-200 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-violet ${
          checked ? 'border-gold bg-gold text-ink' : 'border-mist/25 text-mist hover:border-mist/60'
        }`}
      >
        <AnimatePresence initial={false}>
          {checked && (
            <motion.span initial={{ width: 0, opacity: 0 }} animate={{ width: 'auto', opacity: 1 }} exit={{ width: 0, opacity: 0 }} className="overflow-hidden">
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
            </motion.span>
          )}
        </AnimatePresence>
        {value}
      </motion.span>
    </label>
  );
}

function Field({ id, label, optional, error, children }: { id: string; label: string; optional?: boolean; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="flex items-baseline justify-between font-body text-xs font-semibold uppercase tracking-[0.18em] text-mist-dim">
        {label}
        {optional && <span className="normal-case tracking-normal text-mist-dim/70">optional</span>}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p id={`${id}-error`} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-2 font-body text-sm text-[#ff9aac]">
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputCls = (bad?: boolean) =>
  `mt-2 w-full border-b bg-transparent py-3 font-body text-lg text-mist placeholder:text-mist-dim/50 outline-none transition-colors duration-200 focus:border-gold ${bad ? 'border-[#ff9aac]' : 'border-mist/25 hover:border-mist/50'}`;

/* ---------- the page ---------- */

export default function ContactPage() {
  const { box, text, size } = useFitText(1, 0.42);
  const [f, setF] = useState<Fields>(EMPTY);
  const [types, setTypes] = useState<string[]>([]);
  const [budget, setBudget] = useState('');
  const [timeline, setTimeline] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof Fields | 'types', string>>>({});
  const [sent, setSent] = useState<null | { via: 'whatsapp' | 'email'; message: string }>(null);
  const [copied, setCopied] = useState('');
  const [curtain, setCurtain] = useState(true);

  useEffect(() => { document.title = `Contact — ${site.name[0].toUpperCase()}${site.name.slice(1)}`; }, []);

  // the long form collapses into a short message when sent: bring that message (or the form again) into view
  const briefTop = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    const el = briefTop.current;
    if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [sent]);

  const set = (k: keyof Fields) => (e: { target: { value: string } }) => {
    setF((p) => ({ ...p, [k]: e.target.value }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }));
  };

  const validate = () => {
    const e: typeof errors = {};
    if (!f.name.trim()) e.name = 'Please add your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = 'Please add an email I can reply to.';
    if (!types.length) e.types = 'Pick at least one kind of work.';
    if (f.details.trim().length < 20) e.details = 'A few lines about the project help a lot (20 characters or more).';
    setErrors(e);
    const first = Object.keys(e)[0];
    if (first) document.getElementById(first === 'types' ? 'types-group' : first)?.focus();
    return !first;
  };

  // the brief as plain text; optional lines are left out when empty
  const message = () => {
    const opt = (label: string, v: string) => (v.trim() ? `${label}: ${v.trim()}` : null);
    return [
      `Hi ${site.name[0].toUpperCase()}${site.name.slice(1)}! I'd like to discuss a project.`,
      '',
      `Name: ${f.name.trim()}`,
      `Email: ${f.email.trim()}`,
      opt('Phone / WhatsApp', f.phone),
      opt('Company / brand', f.company),
      `Project type: ${types.join(', ')}`,
      opt('Budget', budget),
      opt('Timeline', timeline),
      '',
      'Details:',
      f.details.trim(),
      f.references.trim() ? `\nReferences: ${f.references.trim()}` : null,
    ]
      .filter((l): l is string => l !== null)
      .join('\n');
  };

  const send = (via: 'whatsapp' | 'email') => (e?: FormEvent) => {
    e?.preventDefault();
    if (!validate()) return;
    const msg = message();
    if (via === 'whatsapp') window.open(whatsappLink(msg), '_blank', 'noopener');
    else window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(`Project enquiry — ${f.name.trim()}`)}&body=${encodeURIComponent(msg)}`;
    setSent({ via, message: msg });
  };

  const copy = async (what: string, label: string) => {
    try { await navigator.clipboard.writeText(what); setCopied(label); setTimeout(() => setCopied(''), 1800); } catch { /* clipboard blocked: nothing to do */ }
  };

  const toggleType = (t: string) => {
    setTypes((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]));
    if (errors.types) setErrors((p) => ({ ...p, types: undefined }));
  };

  return (
    <>
      {/* opening wipe: the dark curtain lifts on a diagonal, like the home page intro, then is removed */}
      {curtain && (
        <motion.div
          aria-hidden="true"
          className="scanlines pointer-events-none fixed inset-0 z-[100] bg-night"
          initial={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
          animate={{ clipPath: 'polygon(0 0, 100% 0, 100% 0%, 0 14%)' }}
          transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1], delay: 0.15 }}
          onAnimationComplete={() => setCurtain(false)}
        />
      )}

      <main style={{ overflowX: 'clip' }}>
        {/* ---------- paper header ---------- */}
        <section className="relative overflow-hidden bg-paper pb-[calc(var(--cut)+3.5rem)] text-ink md:pb-[calc(var(--cut)+5rem)]">
          <div ref={box} aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[12vh] select-none px-2 text-center md:top-[9vh]">
            <motion.span
              ref={text}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 1.2, ease: EASE }}
              className="inline-block whitespace-nowrap font-display font-black uppercase leading-[0.8] text-paper-deep"
              style={{ fontSize: size ? `${size}px` : '30vw' }}
            >
              Contact
            </motion.span>
          </div>

          <motion.nav
            aria-label="Main"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6, ease: EASE }}
            className="relative z-30 flex items-center justify-between px-5 pt-5 md:px-10 md:pt-7"
          >
            <a href="/" className="shrink-0 font-display text-lg font-black uppercase tracking-[0.04em] sm:text-xl md:text-2xl md:tracking-[0.06em]">{site.name}</a>
            <ul className="flex gap-3 sm:gap-7 md:gap-10">
              {navLinks.map((l) => {
                const current = l.href === '/contact';
                return (
                  <li key={l.label}>
                    <a
                      href={home(l.href)}
                      aria-current={current ? 'page' : undefined}
                      className={`font-body text-[11px] font-semibold uppercase tracking-[0.08em] underline-offset-[6px] sm:text-sm sm:tracking-[0.16em] hover:underline sm:text-sm ${current ? 'underline decoration-gold decoration-2' : ''}`}
                    >
                      {l.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </motion.nav>

          <div className="relative z-10 px-5 pt-[16vh] md:px-10 md:pt-[20vh]">
            <h1 className="font-display font-black uppercase leading-[0.86]" style={{ fontSize: 'clamp(3.4rem, 10.5vw, 10rem)' }}>
              <RiseLine delay={0.7}>Let&apos;s build{' '}</RiseLine>
              <RiseLine delay={0.8}>
                something <span className="rgb-split on-light" data-text="unforgettable">unforgettable</span>
              </RiseLine>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.05, duration: 0.7, ease: EASE }}
              className="mt-6 max-w-[46ch] font-body text-base leading-relaxed text-ink-soft md:text-lg"
            >
              Tell me what you have in mind: a product render, an animation, a brand or a website. Fill in the brief below and send it on WhatsApp or by email.
            </motion.p>
            <motion.a
              href="#brief"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="mt-8 inline-flex items-center gap-2 font-body text-sm font-semibold uppercase tracking-[0.16em] underline-offset-[6px] hover:underline"
            >
              Start the brief <ArrowUpRight className="h-4 w-4 rotate-90" strokeWidth={2.2} />
            </motion.a>
          </div>
        </section>

        {/* ---------- night: the brief + direct contact ---------- */}
        <section id="brief" className="cut-rise scanlines relative z-20 overflow-hidden bg-night px-5 pb-16 pt-[calc(var(--cut)+3.5rem)] md:px-10 md:pt-[calc(var(--cut)+5rem)]">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(55% 40% at 25% 30%, rgb(140 107 255 / 0.16), transparent 70%)' }} />

          <div className="relative mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-14 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-20">
            {/* the brief */}
            <div ref={briefTop} className="relative scroll-mt-8">
              <AnimatePresence mode="wait">
                {!sent ? (
                  <motion.form key="form" noValidate onSubmit={send('whatsapp')} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }} className="flex flex-col gap-10">
                    <Reveal>
                      <h2 className="font-display font-black uppercase leading-[0.9] text-mist" style={{ fontSize: 'clamp(2.4rem, 5vw, 4.25rem)' }}>
                        Your project brief
                      </h2>
                      <p className="mt-3 font-body text-mist-dim">Fields marked optional can be skipped.</p>
                    </Reveal>

                    <div className="grid gap-8 sm:grid-cols-2">
                      <Reveal i={1}>
                        <Field id="name" label="Your name" error={errors.name}>
                          <input id="name" value={f.name} onChange={set('name')} autoComplete="name" placeholder="Full name" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-error' : undefined} className={inputCls(!!errors.name)} />
                        </Field>
                      </Reveal>
                      <Reveal i={2}>
                        <Field id="email" label="Email" error={errors.email}>
                          <input id="email" type="email" value={f.email} onChange={set('email')} autoComplete="email" placeholder="you@company.com" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-error' : undefined} className={inputCls(!!errors.email)} />
                        </Field>
                      </Reveal>
                      <Reveal i={3}>
                        <Field id="phone" label="Phone / WhatsApp" optional>
                          <input id="phone" type="tel" value={f.phone} onChange={set('phone')} autoComplete="tel" placeholder="+91 …" className={inputCls()} />
                        </Field>
                      </Reveal>
                      <Reveal i={4}>
                        <Field id="company" label="Company / brand" optional>
                          <input id="company" value={f.company} onChange={set('company')} autoComplete="organization" placeholder="Who is it for?" className={inputCls()} />
                        </Field>
                      </Reveal>
                    </div>

                    <Reveal i={1}>
                      <fieldset id="types-group" tabIndex={-1} aria-describedby={errors.types ? 'types-error' : undefined} className="outline-none">
                        <legend className="font-body text-xs font-semibold uppercase tracking-[0.18em] text-mist-dim">What do you need? <span className="normal-case tracking-normal">(pick any)</span></legend>
                        <div className="mt-4 flex flex-wrap gap-2.5">
                          {contactForm.projectTypes.map((t) => (
                            <Chip key={t} type="checkbox" name="types" value={t} checked={types.includes(t)} onChange={() => toggleType(t)} />
                          ))}
                        </div>
                        <AnimatePresence>
                          {errors.types && (
                            <motion.p id="types-error" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3 font-body text-sm text-[#ff9aac]">
                              {errors.types}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </fieldset>
                    </Reveal>

                    <div className="grid gap-10 md:grid-cols-2">
                      <Reveal i={2}>
                        <fieldset>
                          <legend className="font-body text-xs font-semibold uppercase tracking-[0.18em] text-mist-dim">Budget <span className="normal-case tracking-normal text-mist-dim/70">optional</span></legend>
                          <div className="mt-4 flex flex-wrap gap-2.5">
                            {contactForm.budgets.map((b) => (
                              <Chip key={b} type="radio" name="budget" value={b} checked={budget === b} onChange={() => setBudget(b)} />
                            ))}
                          </div>
                        </fieldset>
                      </Reveal>
                      <Reveal i={3}>
                        <fieldset>
                          <legend className="font-body text-xs font-semibold uppercase tracking-[0.18em] text-mist-dim">Timeline <span className="normal-case tracking-normal text-mist-dim/70">optional</span></legend>
                          <div className="mt-4 flex flex-wrap gap-2.5">
                            {contactForm.timelines.map((t) => (
                              <Chip key={t} type="radio" name="timeline" value={t} checked={timeline === t} onChange={() => setTimeline(t)} />
                            ))}
                          </div>
                        </fieldset>
                      </Reveal>
                    </div>

                    <Reveal i={1}>
                      <Field id="details" label="Tell me about the project" error={errors.details}>
                        <textarea
                          id="details"
                          rows={5}
                          value={f.details}
                          onChange={set('details')}
                          placeholder="What is it, who is it for, and what should it feel like? Any deliverables, sizes or deadlines?"
                          aria-invalid={!!errors.details}
                          aria-describedby={errors.details ? 'details-error' : undefined}
                          className={`${inputCls(!!errors.details)} resize-y leading-relaxed`}
                        />
                      </Field>
                    </Reveal>
                    <Reveal i={2}>
                      <Field id="references" label="Reference links" optional>
                        <input id="references" value={f.references} onChange={set('references')} placeholder="Pinterest board, Drive folder, websites you like…" className={inputCls()} />
                      </Field>
                    </Reveal>

                    <Reveal i={3} className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <button type="submit" className="contact-btn group inline-flex items-center justify-center gap-2.5 rounded-full bg-gold px-8 py-4 font-body text-[0.95rem] font-semibold uppercase tracking-[0.14em] text-ink transition-colors duration-200 hover:bg-[#f7c96e] active:bg-[#e3a535]">
                        <MessageCircle className="h-[1.15em] w-[1.15em]" strokeWidth={2.2} />
                        Send on WhatsApp
                        <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={2.2} />
                      </button>
                      <button type="button" onClick={send('email')} className="inline-flex items-center justify-center gap-2.5 rounded-full border-2 border-mist/40 px-8 py-[calc(1rem-2px)] font-body text-[0.95rem] font-semibold uppercase tracking-[0.14em] text-mist transition-colors duration-200 hover:border-gold hover:text-gold">
                        <Mail className="h-[1.1em] w-[1.1em]" strokeWidth={2.2} />
                        Send by email
                      </button>
                    </Reveal>
                  </motion.form>
                ) : (
                  <motion.div key="sent" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }} className="flex flex-col items-start gap-6 py-6" role="status">
                    <svg viewBox="0 0 64 64" className="h-20 w-20" aria-hidden="true">
                      <motion.circle cx="32" cy="32" r="29" fill="none" stroke="var(--gold)" strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, ease: EASE }} />
                      <motion.path d="M19 33l9 9 17-19" fill="none" stroke="var(--gold)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.45, duration: 0.5, ease: EASE }} />
                    </svg>
                    <h2 className="font-display font-black uppercase leading-[0.9] text-mist" style={{ fontSize: 'clamp(2.4rem, 5vw, 4.25rem)' }}>
                      Your brief is ready
                    </h2>
                    <p className="max-w-[46ch] font-body text-lg leading-relaxed text-mist-dim">
                      {sent.via === 'whatsapp'
                        ? 'WhatsApp should have opened with your message filled in. Just press send there.'
                        : 'Your email app should have opened with your message filled in. Just press send there.'}{' '}
                      Didn&apos;t open? Copy the brief and send it to {sent.via === 'whatsapp' ? site.phone : site.email}.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <button type="button" onClick={() => copy(sent.message, 'brief')} className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-body text-sm font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-[#f7c96e]">
                        {copied === 'brief' ? <Check className="h-4 w-4" strokeWidth={3} /> : <Copy className="h-4 w-4" />}
                        {copied === 'brief' ? 'Copied' : 'Copy the brief'}
                      </button>
                      <button type="button" onClick={() => send(sent.via === 'whatsapp' ? 'email' : 'whatsapp')()} className="inline-flex items-center gap-2 rounded-full border-2 border-mist/40 px-6 py-[calc(0.75rem-2px)] font-body text-sm font-semibold uppercase tracking-[0.14em] text-mist transition-colors hover:border-gold hover:text-gold">
                        {sent.via === 'whatsapp' ? 'Send by email instead' : 'Send on WhatsApp instead'}
                      </button>
                      <button type="button" onClick={() => setSent(null)} className="inline-flex items-center gap-2 px-2 py-3 font-body text-sm font-semibold uppercase tracking-[0.14em] text-mist-dim underline-offset-[6px] hover:text-mist hover:underline">
                        <ArrowLeft className="h-4 w-4" /> Edit the brief
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* direct contact */}
            <aside className="min-w-0 lg:sticky lg:top-10 lg:self-start">
              <Reveal>
                <h2 className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-mist-dim">Or reach me directly</h2>
              </Reveal>
              <ul className="mt-6 flex flex-col">
                {[
                  { icon: MessageCircle, label: 'WhatsApp', value: site.phone, href: whatsappLink(), external: true },
                  { icon: Phone, label: 'Call', value: site.phone, href: `tel:${site.phoneLink}` },
                  { icon: Mail, label: 'Email', value: site.email, href: `mailto:${site.email}`, copy: site.email },
                ].map((c, i) => (
                  <Reveal key={c.label} i={i + 1}>
                    <li className="group flex items-center justify-between gap-4 border-t border-mist/15 py-5">
                      <a href={c.href} target={c.external ? '_blank' : undefined} rel={c.external ? 'noreferrer' : undefined} className="flex min-w-0 items-center gap-4">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-mist/25 text-gold transition-colors duration-200 group-hover:border-gold group-hover:bg-gold group-hover:text-ink">
                          <c.icon className="h-5 w-5" strokeWidth={2} />
                        </span>
                        <span className="min-w-0">
                          <span className="block font-body text-xs font-semibold uppercase tracking-[0.18em] text-mist-dim">{c.label}</span>
                          <span className="block truncate font-display text-[clamp(1.25rem,1.9vw,1.6rem)] font-extrabold uppercase leading-tight text-mist">{c.value}</span>
                        </span>
                      </a>
                      {c.copy && (
                        <button type="button" onClick={() => copy(c.copy!, c.label)} aria-label={`Copy ${c.label.toLowerCase()} address`} className="shrink-0 rounded-full p-2.5 text-mist-dim transition-colors hover:text-gold">
                          {copied === c.label ? <Check className="h-4 w-4 text-gold" strokeWidth={3} /> : <Copy className="h-4 w-4" />}
                        </button>
                      )}
                    </li>
                  </Reveal>
                ))}
              </ul>

              <Reveal i={4}>
                <h2 className="mt-10 font-body text-xs font-semibold uppercase tracking-[0.2em] text-mist-dim">Follow the work</h2>
                <ul className="mt-4 flex flex-col">
                  {site.socials.map((s) => (
                    <li key={s.label}>
                      <a href={s.href} target="_blank" rel="noreferrer" className="split-hover group flex items-center justify-between border-t border-mist/15 py-4 font-display text-[clamp(1.6rem,2.6vw,2.25rem)] font-black uppercase leading-none text-mist">
                        {s.label}
                        <ArrowUpRight className="h-6 w-6 text-gold transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" strokeWidth={2.2} />
                      </a>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </aside>
          </div>

          <footer className="relative mx-auto mt-24 flex max-w-7xl flex-col items-start gap-4 border-t border-mist/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <a href="/" className="inline-flex items-center gap-2 font-body text-sm font-semibold uppercase tracking-[0.16em] text-mist underline-offset-[6px] hover:underline">
              <ArrowLeft className="h-4 w-4" /> Back to the portfolio
            </a>
            <span className="font-body text-sm uppercase tracking-[0.16em] text-mist-dim">© {new Date().getFullYear()} {site.name}</span>
          </footer>
        </section>
      </main>
    </>
  );
}

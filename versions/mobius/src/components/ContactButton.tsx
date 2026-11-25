import { ArrowRight } from 'lucide-react';

// Black pill with an arrow. The class "contact-btn" matters: the Living Portrait shows heart eyes when it is hovered.
export default function ContactButton({ label = "Let's talk", href = '#contact', className = '' }: { label?: string; href?: string; className?: string }) {
  return (
    <a
      href={href}
      className={`contact-btn group inline-flex items-center gap-3 rounded-full bg-fg py-2 pl-5 pr-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#2a2a2a] ${className}`}
    >
      {label}
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-fg">
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2.2} />
      </span>
    </a>
  );
}

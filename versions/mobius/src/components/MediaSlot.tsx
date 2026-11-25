import { ImageIcon } from 'lucide-react';
import type { Media } from '../data/content';

// Shows your image or video once `media` is set; until then, a labelled placeholder in the slot's colour.
export default function MediaSlot({ item, className = '', rounded = 'rounded-[4px]' }: { item: Media; className?: string; rounded?: string }) {
  const base = `relative overflow-hidden ${rounded} ${className}`;
  if (item.media) {
    return /\.(mp4|webm|mov)$/i.test(item.media) ? (
      <video src={item.media} className={`${base} object-cover`} autoPlay muted loop playsInline aria-label={item.label} />
    ) : (
      <img src={item.media} alt={item.label} loading="lazy" className={`${base} object-cover`} />
    );
  }
  const dark = isDark(item.tone);
  return (
    <div className={base} style={{ background: item.tone }} role="img" aria-label={`Placeholder: ${item.label}`}>
      {/* soft studio light so placeholders read as surfaces, not flat boxes */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: `radial-gradient(120% 80% at 30% 15%, rgb(255 255 255 / ${dark ? 0.12 : 0.35}), transparent 60%)` }}
      />
      <span className={`absolute bottom-3 left-3 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] ${dark ? 'text-white/70' : 'text-black/55'}`}>
        <ImageIcon className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
        {item.label}
      </span>
    </div>
  );
}

export function isDark(hex: string) {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return r * 0.299 + g * 0.587 + b * 0.114 < 140;
}

// the same placeholder as a CSS background (used to fill the giant numerals)
export function mediaFill(item: Media) {
  if (item.media) return `url(${item.media})`;
  return `radial-gradient(80% 60% at 25% 20%, rgb(255 255 255 / 0.35), transparent 60%), linear-gradient(135deg, ${item.tone}, ${shade(item.tone, -40)})`;
}

function shade(hex: string, amt: number) {
  const n = parseInt(hex.replace('#', ''), 16);
  const c = (v: number) => Math.max(0, Math.min(255, v + amt)).toString(16).padStart(2, '0');
  return `#${c((n >> 16) & 255)}${c((n >> 8) & 255)}${c(n & 255)}`;
}

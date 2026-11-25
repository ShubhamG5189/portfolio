/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Big Shoulders"', '"Arial Narrow"', 'sans-serif'],
        body: ['Barlow', 'system-ui', 'sans-serif'],
      },
      colors: {
        paper: 'rgb(var(--c-paper) / <alpha-value>)',
        'paper-deep': 'rgb(var(--c-paper-deep) / <alpha-value>)',
        ink: 'rgb(var(--c-ink) / <alpha-value>)',
        'ink-soft': 'rgb(var(--c-ink-soft) / <alpha-value>)',
        night: 'rgb(var(--c-night) / <alpha-value>)',
        'night-2': 'rgb(var(--c-night-2) / <alpha-value>)',
        mist: 'rgb(var(--c-mist) / <alpha-value>)',
        'mist-dim': 'rgb(var(--c-mist-dim) / <alpha-value>)',
        gold: 'rgb(var(--c-gold) / <alpha-value>)',
        violet: 'rgb(var(--c-violet) / <alpha-value>)',
      },
    },
  },
  plugins: [],
};

# Mina — 3D Creator Portfolio

A one-page portfolio made with React, TypeScript, Tailwind CSS and Framer Motion. Its main feature is the **Living Portrait**, an animated head in the hero section that reacts to the visitor.

---

## 1. One-time setup

1. Install **Node.js (LTS)** from https://nodejs.org. It includes `npm`.
2. Open a terminal in this folder (`E:\Website`) and install the project's libraries:

   ```powershell
   npm install
   ```

## 2. Working on the site

```powershell
npm run dev
```

Then open the address it prints (usually http://localhost:5173). Save any file and the browser refreshes on its own. Press `Ctrl + C` in the terminal to stop.

## 3. Where to change things

| You want to change… | Edit this file |
|---|---|
| Name, tagline, about text, email, social links | `src/data/content.ts` |
| Services list | `src/data/content.ts` → `services` |
| Projects (names, images, links) | `src/data/content.ts` → `projects` |
| Numbers, process steps, contact-form choices | `src/data/content.ts` → `numbers`, `process`, `contactForm` |
| Colours (tokens at the top), font, effects | `src/index.css`, `tailwind.config.js` |
| Layout of a section | `src/sections/*.tsx` |

**Do these first:**
- Set your real email in `site.email`. The contact form and buttons use it.
- Add your social links in `site.socials`.
- Replace everything marked `PLACEHOLDER` in `content.ts` (numbers, projects, links).

### Adding your photos and videos
Every media slot shows a labelled placeholder until you give it a file. Put the file in `public/media/`, e.g. `public/media/showreel.mp4`, then set that slot's `media` field in `content.ts`: `media: '/media/showreel.mp4'`. Images (`.jpg`, `.png`, `.webp`) and videos (`.mp4`, `.webm`) both work.

## 4. How the project is laid out

```
index.html               page title, font (Inter Tight)
src/
  main.tsx               starts React
  App.tsx                puts the sections in order + smooth scrolling
  index.css              global styles + portrait CSS
  data/content.ts        ← all your text, links and media
  components/            reusable parts (Header + clock, MediaSlot, Loader, AnimatedText, LivingPortrait)
  sections/              Hero, Manifesto, FeatureMarquee, Services, Numbers, Work,
                         About + Clients, Process, Contact + Footer
  portrait/engine.ts     the Living Portrait's WebGL engine (leave as is)
```

## 5. Putting it online (free)

**It's already live on Vercel:** https://mina-portfolio-tau.vercel.app

To publish your latest changes, run this in this folder:

```powershell
npx vercel deploy --prod
```

About a minute later the live site updates. Settings, custom domains and visitor analytics are in your Vercel dashboard (project **mina-portfolio**).

### Other hosts
1. Build it: `npm run build`. This creates a `dist/` folder.
2. The easiest free option is **Netlify Drop** (https://app.netlify.com/drop): drag the `dist` folder onto the page.
3. Or push this folder to GitHub and import it in **Vercel** or **Netlify**. They detect Vite on their own (build command `npm run build`, output folder `dist`).

## 6. Things to try with the portrait
Move the mouse (her eyes follow it), hover her eyes, nose or lips, tap different parts of her face, tap her hair to change its colour, grab and pull her skin, shake the cursor fast, hover "Contact Me", or leave the page alone for 30–45 seconds.

# Shubham — 3D Creator Portfolio

A one-page portfolio made with React, TypeScript, Tailwind CSS and Framer Motion. Its main feature is the **Living Portrait**, an animated head in the hero section that reacts to the visitor.

---

## 1. One-time setup

1. Install **Node.js (LTS)** from https://nodejs.org. It includes `npm`.
2. Open a terminal in this folder (`E:\Website`) and install the project's libraries:

   ```powershell
   npm install
   ```

> **"running scripts is disabled on this system"?** Windows PowerShell blocks `npm` and `npx` by default. Either add `.cmd` to the command (`npm.cmd run dev`, `npx.cmd vercel deploy --prod`), or allow scripts for your user once:
> `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`

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
| Gallery images and captions | `src/data/content.ts` → `gallery` |
| Card stat lines / Toolkit | `src/data/content.ts` → `projects[].stats` / `tools` |
| Colours (tokens at the top), fonts, effects | `src/index.css`, `tailwind.config.js` |
| Layout of a section | `src/sections/*.tsx` |

**Do these first:**
- Set your real email in `site.email`. The "Contact me" buttons open it.
- Add your social links in `site.socials`.
- Put each project's real URL in `link` so its card on the Work timeline opens it.

### Using your own images
Put image files in a `public/` folder, e.g. `public/projects/aura-1.jpg`, and use the path `'/projects/aura-1.jpg'` in `content.ts`.

### Other saved designs
The Mobius-style design is saved in `versions/mobius/` (see `RESTORE.md` there to switch to it).

## 4. How the project is laid out

```
index.html               page title, fonts (Big Shoulders + Barlow)
src/
  main.tsx               starts React
  App.tsx                puts the sections in order
  index.css              global styles + portrait CSS
  data/content.ts        ← all your text, links and images
  components/            reusable parts (Contact button, glitch intro, FadeIn, AnimatedText, LivingPortrait)
  sections/              Hero, Work (timeline), Services, Gallery, Contact
  portrait/engine.ts     the Living Portrait's WebGL engine (leave as is)
```

## 5. Putting it online (free)

**It's live at:** https://shubhamportfolio.in

The GitHub repo (`ShubhamG5189/portfolio`) is connected to Vercel, so **every push to `main` publishes the site**:

```powershell
git add -A
git commit -m "Describe what changed"
git push
```

About a minute later the live site updates. (`npx.cmd vercel deploy --prod` also still works, to publish without pushing.) Settings, domains and visitor analytics are in your Vercel dashboard (project **shubham-portfolio**).

### Other hosts
1. Build it: `npm run build`. This creates a `dist/` folder.
2. The easiest free option is **Netlify Drop** (https://app.netlify.com/drop): drag the `dist` folder onto the page.
3. Or push this folder to GitHub and import it in **Vercel** or **Netlify**. They detect Vite on their own (build command `npm run build`, output folder `dist`).

## 6. Things to try with the portrait
Move the mouse (her eyes follow it), hover her eyes, nose or lips, tap different parts of her face, tap her hair to change its colour, grab and pull her skin, shake the cursor fast, hover "Contact Me", or leave the page alone for 30–45 seconds.

# Making the Living Portrait look like you

The portrait isn't a 3D model. It's **58 flat pictures of the same head**. The code shows exactly one at a time and swaps between them very fast. It also stretches the current picture like dough when someone grabs it.

To make it you, create your own set of 58 pictures and drop them into the project.

---

## The 4 rules that make it work

1. **Same framing in every picture.** Your head must sit in exactly the same spot and at the same size in all 58 images. Only the face part changes (eyes, mouth, brows). If the head moves even a few pixels between pictures, it will jump when they swap.
2. **Same canvas:** square, **1024 × 1024**, PNG.
3. **Transparent background.** Only the head, hair and neck should be visible, with nothing behind them. Remove the background on every image.
4. **Match the demo's layout.** The code knows where the eyes, nose, mouth and hair are by their position on the canvas. Keep your face roughly where the demo face is:
   - eyes about **45%** of the way down
   - nose about **54%**
   - mouth about **64%**
   - the head roughly fills the middle **45%** of the width

   Use the demo's resting face as your layout reference: [demo rest image](https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261031_040619_2f6f349e-a4a7-40db-8e9b-03b6acd8b99a.png&w=1024&q=92)

---

## Step by step

### 1. Make your base picture (`rest.png`)
Start from a clear, front-facing photo of yourself with even lighting and a neutral face. Give it to an AI image tool that can create a stylised 3D character from a photo and then **edit** that image while keeping everything else identical. Tools that are good at consistent edits include Google Gemini image editing ("Nano Banana"), ChatGPT image generation, Higgsfield (which made the demo set), or Midjourney with a character reference.

Example prompt:
> Turn this person into a stylised 3D animated character head, Pixar-like, soft smile, looking straight ahead, head and hair only, centred, front view, plain background, square image.

Keep generating until you like it. **This picture defines everything else**, so take your time.

> Privacy: these tools upload your photo to their servers. Check each tool's privacy settings before you upload.

### 2. Make the other 57 by *editing* the base
Always edit **the base picture itself**, never a fresh generation. That keeps the head in the same place. Ask for one change at a time, for example:
> Edit this image. Change ONLY the eyes so they look to the left. Keep the head, hair, lighting, framing and everything else exactly the same.

### 3. Put the originals in `portrait-src/`
Save each picture straight from the AI tool (download it, don't screenshot it) into:
```
E:\Website\portrait-src\
```
Name each file **exactly** as in the tables below, e.g. `half.png`, `closed.png`, `kiss.png`. PNG, JPG or WebP all work, at any square size.

### 4. Run the portrait script
```powershell
npm run portrait
```
For every picture it:
- removes the sky or plain background, so you don't need remove.bg
- resizes it to 1024 × 1024
- saves a small WebP (about 130 KB) in `public/portrait/`, which is what the site loads
- checks that the head lines up with `rest`. If it prints **⚠ head moved**, the AI tool shifted the head. Regenerate that picture, or line it up in Photopea before running the script again.

The site is already set to use these pictures (`portraitFolder = '/portrait/'` in `src/data/content.ts`). Check it with `npm run dev`, then publish with `npx vercel deploy --prod`.

---

## The 58 pictures

### Eyes (face neutral, only the eyes change)
| File | What it shows |
|---|---|
| `rest.png` | Neutral face, soft smile, looking straight ahead (**the base**) |
| `half.png` | Eyelids half closed |
| `closed.png` | Eyes fully closed, relaxed |
| `right.png` | Looking to the right (E) |
| `ene.png` | Looking right and a little up |
| `upright.png` | Looking up-right (NE) |
| `nne.png` | Looking up and a little right |
| `up.png` | Looking straight up (N) |
| `nnw.png` | Looking up and a little left |
| `wnw.png` | Looking up-left (NW) |
| `left.png` | Looking to the left (W) |
| `wsw.png` | Looking left and a little down |
| `downleft.png` | Looking down-left (SW) |
| `ssw.png` | Looking down and a little left |
| `down.png` | Looking straight down (S) |
| `sse.png` | Looking down and a little right |
| `downright.png` | Looking down-right (SE) |
| `ese.png` | Looking right and a little down |

"Left" and "right" mean **the viewer's** left and right, which is the direction of the mouse on screen.

### Reactions
| File | What it shows |
|---|---|
| `shock.png` | Wide eyes, open mouth: surprised |
| `ouch.png` | Wincing in pain, eyes squeezed |
| `scared.png` | Frightened, eyebrows up, teeth clenched |
| `scrunch.png` | Whole face scrunched up |
| `dizzy.png` | Dazed, spiral or unfocused eyes |
| `angry.png` | Frowning, angry brows |
| `cry.png` | Crying, tears |
| `deadpan.png` | Flat, unimpressed face |
| `raised.png` | One eyebrow raised, sad-ish |
| `laugh.png` | Big laugh, eyes closed |
| `grin.png` | Wide happy grin |
| `smug.png` | Smug half-smile |
| `shy.png` | Shy smile, blushing |
| `kiss.png` | Lips puckered for a kiss |
| `tongue.png` | Sticking tongue out |
| `puff.png` | Cheeks puffed full of air |
| `cross.png` | Cross-eyed |
| `fish.png` | Fish face: cheeks sucked in, lips pursed |
| `winkl.png` | Winking with the left eye (viewer's left) |
| `winkr.png` | Winking with the right eye (viewer's right) |
| `hearts.png` | Heart-shaped eyes (shown when hovering Contact Me) |
| `stars.png` | Star-struck, sparkling eyes |
| `sick.png` | Nauseous, green-ish |
| `wind.png` | Hair blown sideways by wind, squinting |

### Little animations (frames played in order)
| Files | What they show |
|---|---|
| `yawn1.png` → `yawn2.png` → `yawn.png` → `yawn4.png` | Yawn: starting, opening, widest, closing |
| `whistle1.png`, `whistle2.png` | Whistling, two lip positions |
| `sneeze1.png` | About to sneeze, nose wrinkled, eyes squinting |
| `sneeze2.png` | The sneeze itself (achoo!) |
| `gum1.png`, `gum2.png`, `gum3.png` | Gum bubble: small, medium, big |
| `gumpop.png` | Bubble popped, gum stuck on the face |
| `snore.png` | Asleep, mouth open, snoring |

### Hair colours (face neutral, looking straight ahead)
| File | What it shows |
|---|---|
| `pink.png` | Same as `rest`, hair dyed pink |
| `blue.png` | Same as `rest`, hair dyed blue |
| `blonde.png` | Same as `rest`, hair dyed blonde |

---

## Tips
- **Start small.** You can test with only `rest`, `half` and `closed`. Any picture that's missing is simply skipped, and she stays on her resting face for it.
- Do the 16 eye directions early. They're what visitors see the most.
- Name files carefully. `Left.png` and `left.PNG` won't work, because names are case-sensitive once online.
- Each picture should be under ~300 KB. Save as PNG and compress at tinypng.com, which keeps the transparency.

// ============================================================
//  EDIT YOUR PORTFOLIO HERE
//  Almost all the words, links and media on the page live in
//  this one file. Change them and the page updates instantly.
//
//  Media: every `media` field is empty for now, so the page shows a
//  labelled placeholder in its place. Put your file in public/media/
//  and set e.g.  media: '/media/showreel.mp4'  or  '/media/render.jpg'.
//  Anything marked PLACEHOLDER is example text: replace it with your real details.
// ============================================================

export type Media = { media?: string; label: string; tone: string };

export const site = {
  name: 'Shubham',
  role: '3D creator',
  // the intro sentence in the top-left of the hero (your name is added in front of it)
  intro: '— a 3D creator crafting striking and unforgettable projects through modeling, light and motion. I help brands and teams show what they make in its best form.',
  about:
    "With more than five years of experience in design, i focus on branding, web design, and user experience, i truly enjoy working with businesses that aim to stand out and present their best image. Let's build something incredible together!",
  email: 'hello@example.com', // PLACEHOLDER: your real email
  timezone: 'Asia/Kolkata', // the live clock in the bottom-right corner
  socials: [
    { label: 'Instagram', href: '#' }, // PLACEHOLDER links
    { label: 'Behance', href: '#' },
    { label: 'LinkedIn', href: '#' },
    { label: 'ArtStation', href: '#' },
  ],
};

// Living Portrait pictures (your face, shown on the front hero card).
export const portraitFolder = '/portrait/';

export const navLinks = [
  { label: 'Work', href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

// Hero: the fanned stack of cards behind your portrait card (back to front)
export const heroStack: Media[] = [
  { label: 'Render 01', tone: '#1d1d1f' },
  { label: 'Render 02', tone: '#f2c94c' },
  { label: 'Render 03', tone: '#e9e4da' },
];
export const heroPortraitTone = '#ff7a1a'; // colour of the card your face sits on

// The sentence whose words fly together as you scroll
export const manifesto = 'Shubham brings ideas and form together, turning sketches into objects and light into stories.';

export const aboutParagraphs = [
  "I work closely with every client, shaping each piece with intention and care. An idea gets explored from several angles — form, material, light and motion — before a single final frame is rendered.",
  "The process stays simple and open: regular check-ins, clear previews and honest feedback, so the direction gets sharper with every round and the result feels precise, not just pretty.",
];

// The giant line that slides behind the big media
export const marqueeText = 'Ideas in motion · ';
export const featureMedia: Media = { label: 'Showreel · 16:9', tone: '#d9d4ca' };

// Services: letter, statement, tags. Edit the tags to what you really offer.
export const services = [
  {
    name: '3D Modeling',
    statement: 'I build detailed models of products, characters and spaces — clean topology, accurate proportions and forms that hold up close.',
    tags: ['Product models', 'Characters', 'Environments', 'Hard-surface', 'Retopology'],
  },
  {
    name: 'Rendering',
    statement: 'Photoreal renders with custom lighting, textures and materials that make a design feel real before it exists.',
    tags: ['Lighting', 'Materials & textures', 'Product renders', 'Look development', 'Compositing'],
  },
  {
    name: 'Motion Design',
    statement: 'Animations and motion graphics that give products and brands energy, rhythm and a story worth watching.',
    tags: ['Product animation', 'Motion graphics', 'Social loops', 'Camera & cinematics', 'Simulations'],
  },
  {
    name: 'Brand & Web',
    statement: 'Visual identities and websites where 3D does the talking — cohesive systems, clear layouts and memorable first impressions.',
    tags: ['Visual identity', '3D brand assets', 'Web design', 'Art direction', 'Launch visuals'],
  },
];

// In Numbers. PLACEHOLDER: only "years" comes from your About text; set the others to your real numbers.
export const numbers = [
  { value: 5, title: 'Years of\nexperience', text: 'Five years of modeling, rendering and design — every project adding a new tool, a sharper eye and a better process.', cta: 'About me', href: '#about', media: { label: 'Studio photo', tone: '#c9c2b6' } as Media },
  { value: 48, title: 'Completed\nprojects', text: 'From single product shots to full launch campaigns, each project gets the same attention to form, light and detail.', cta: 'Selected work', href: '#work', media: { label: 'Render collage', tone: '#ff7a1a' } as Media },
  { value: 21, title: 'Happy\nclients', text: 'Built on collaboration, not hand-offs. I work with teams who care about craft and want visuals that feel true to their brand.', cta: 'Get in touch', href: '#contact', media: { label: 'Client work', tone: '#2b2b2e' } as Media },
];

// Selected work list (hover a row to preview it)
export type Project = { name: string; type: string; year: string; link: string; preview: Media };
export const projects: Project[] = [
  { name: 'Nextlevel Studio', type: '3D modeling · Rendering', year: '2026', link: '#', preview: { label: 'Nextlevel Studio', tone: '#f2c94c' } }, // PLACEHOLDER projects
  { name: 'Aura Brand Identity', type: 'Branding · Motion', year: '2026', link: '#', preview: { label: 'Aura', tone: '#b9a8f0' } },
  { name: 'Solaris Digital', type: 'Web design · 3D', year: '2025', link: '#', preview: { label: 'Solaris', tone: '#ff7a1a' } },
  { name: 'Project four', type: 'Product render', year: '2025', link: '#', preview: { label: 'Project four', tone: '#8fc3b4' } },
  { name: 'Project five', type: 'Character · Animation', year: '2024', link: '#', preview: { label: 'Project five', tone: '#e9e4da' } },
];

export const aboutMe = {
  photo: { label: 'Your photo · 4:5', tone: '#d9d4ca' } as Media,
  caption: '3D creator',
  text: "I started with a curiosity for how things are made and turned it into a practice of making them look their best. Today I help brands, studios and founders show products, characters and ideas with clarity and craft.",
};

export const clientsCount = 12; // number of logo slots in the clients grid

export const process = [
  { name: 'Brief', text: 'We start by listening: goals, audience, references and constraints, so the direction is clear before anything is modeled.' },
  { name: 'Blockout', text: 'Rough shapes, camera angles and composition come first. We agree on the layout while changes are still quick.' },
  { name: 'Look-dev & Render', text: 'Materials, lighting and detail take over. Previews go out at every step until each frame feels right.' },
  { name: 'Delivery', text: 'Final renders and animations in every format you need, plus support for tweaks and new versions after launch.' },
];

// Contact form choices
export const contactForm = {
  topics: ['a product render', 'a 3D animation', 'a brand or website', 'something else'],
  budgets: ['under $1k', '$1k – $3k', '$3k – $10k', '$10k+'],
  timings: ['as soon as possible', 'within a month', 'in a few months'],
};

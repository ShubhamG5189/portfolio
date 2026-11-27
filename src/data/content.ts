// ============================================================
//  EDIT YOUR PORTFOLIO HERE
//  Almost all the words, links and images on the page live in
//  this one file. Change them and the page updates instantly.
// ============================================================

export const site = {
  // Your name: used in the hero heading, loader, footer and image text
  name: 'shubham',
  tagline: 'an artist working across every medium a story needs',
  about:
    "With more than five years of experience in design, i focus on branding, web design, and user experience, i truly enjoy working with businesses that aim to stand out and present their best image. Let's build something incredible together!",
  // Contact details: shown in the footer, the closing section and on the /contact page
  email: 'shubhamgirkar2025@gmail.com',
  phone: '+91 90116 99046', // how it's displayed
  phoneLink: '+919011699046', // digits only with country code: used for calls and WhatsApp
  socials: [
    { label: 'Instagram', href: 'https://www.instagram.com/_iam5hubh_/' },
    { label: 'Behance', href: 'https://www.behance.net/shubhamgirkardesigns' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/shubham-girkar-freelancedesigner/' },
  ],
};

export const whatsappLink = (text = '') =>
  `https://wa.me/${site.phoneLink.replace(/\D/g, '')}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

// The requirements form on /contact. Edit the choices freely.
export const contactForm = {
  projectTypes: ['3D Modeling', 'Rendering', 'Motion Design', 'Branding', 'Web Design', 'Something else'],
  budgets: ['Under ₹25k', '₹25k – ₹75k', '₹75k – ₹2L', '₹2L+', 'Not sure yet'],
  timelines: ['As soon as possible', '2–4 weeks', '1–2 months', 'Flexible'],
};

// Living Portrait pictures. Leave empty to use the demo character.
// To use your own: put your pictures in portrait-src/, run `npm run portrait` (see PORTRAIT-GUIDE.md), and set this to '/portrait/'.
export const portraitFolder = '/portrait/';

export const navLinks = [
  { label: 'Work', href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Contact', href: '/contact' },
];

// Gallery strip: each image with the caption shown under it
const M = 'https://motionsites.ai/assets/';
export const gallery = [
  { src: M + 'hero-space-voyage-preview-eECLH3Yc.gif', caption: 'Space Voyage' },
  { src: M + 'hero-codenest-preview-Cgppc2qV.gif', caption: 'Codenest' },
  { src: M + 'hero-vex-ventures-preview-BczMFIiw.gif', caption: 'Vex Ventures' },
  { src: M + 'hero-stellar-ai-v2-preview-DjvxjG3C.gif', caption: 'Stellar AI V2' },
  { src: M + 'hero-asme-preview-B_nGDnTP.gif', caption: 'ASME' },
  { src: M + 'hero-transform-data-preview-Cx5OU29N.gif', caption: 'Transform Data' },
  { src: M + 'hero-vitara-preview-Cjz2QYyU.gif', caption: 'Vitara' },
  { src: M + 'hero-terra-preview-BFjrCr7T.gif', caption: 'Terra' },
  { src: M + 'hero-skyelite-preview-DHaZIgUv.gif', caption: 'Skyelite' },
  { src: M + 'hero-aethera-preview-DknSlcTa.gif', caption: 'Aethera' },
  { src: M + 'hero-designpro-preview-D8c5_een.gif', caption: 'Designpro' },
  { src: M + 'hero-stellar-ai-preview-D3HL6bw1.gif', caption: 'Stellar AI' },
  { src: M + 'hero-xportfolio-preview-D4A8maiC.gif', caption: 'Xportfolio' },
  { src: M + 'hero-orbit-web3-preview-BXt4OttD.gif', caption: 'Orbit Web3' },
  { src: M + 'hero-nexora-preview-cx5HmUgo.gif', caption: 'Nexora' },
  { src: M + 'hero-evr-ventures-preview-DZxeVFEX.gif', caption: 'EVR Ventures' },
  { src: M + 'hero-planet-orbit-preview-DWAP8Z1P.gif', caption: 'Planet Orbit' },
  { src: M + 'hero-new-era-preview-CocuDUm9.gif', caption: 'New Era' },
  { src: M + 'hero-wealth-preview-B70idl_u.gif', caption: 'Wealth' },
  { src: M + 'hero-luminex-preview-CxOP7ce6.gif', caption: 'Luminex' },
  { src: M + 'hero-celestia-preview-0yO3jXO8.gif', caption: 'Celestia' },
];

export const services = [
  { name: '3D Modeling', description: 'Creation of detailed objects, characters, or environments tailored to specific client needs, ideal for games, products, and visualizations.' },
  { name: 'Rendering', description: 'High-quality, photorealistic renders that showcase designs with custom lighting, textures, and materials to bring concepts to life.' },
  { name: 'Motion Design', description: 'Dynamic animations and motion graphics that add energy and storytelling to brands, products, and digital experiences.' },
  { name: 'Branding', description: 'Crafting cohesive visual identities -- from logos to full brand systems -- that communicate a clear and memorable presence.' },
  { name: 'Web Design', description: 'Designing clean, modern, and conversion-focused websites with attention to layout, typography, and user experience.' },
];

// ===== YOUR WORK =====
// One entry per card on the "Signature work" timeline. Clicking a card opens a full-screen viewer.
// These come from Behance for now (pictures and video players load from Behance).
// Your own files later: put each project in public/work/<slug>/ and refer to it as '/work/<slug>/cover.jpg'.
// Cover: landscape about 5:4 (e.g. 1600x1250, under 400 KB). Hover video: short muted .mp4 loop, under 3 MB.
export type Media =
  | { type: 'image'; src: string; caption?: string }
  | { type: 'video'; src: string; caption?: string }                 // an .mp4 file
  | { type: 'embed'; src: string; ratio?: number; caption?: string }; // a player page, e.g. Behance/YouTube/Vimeo
export type Project = {
  slug: string;        // short id, lowercase-with-dashes; also used in the link that opens this project
  name: string;
  category: string;    // the discipline: Graphic Design, Motion Graphics, AI Video & Image, 3D & Renders
  stats: string;       // the small line under the card
  year?: string;
  cover: string;       // the card picture
  hoverVideo?: string; // plays while the cursor is on the card
  description: string; // a few sentences shown in the viewer
  media: Media[];      // shown in the viewer, in this order
  link?: string;       // e.g. the Behance page, shown as a button in the viewer
};

const BE = 'https://mir-s3-cdn-cf.behance.net/';
const cover = (file: string) => `${BE}projects/original_webp/${file}`;
const pic = (file: string) => `${BE}project_modules/source/${file}`;
const player = (id: string) => `https://www-ccv.adobe.io/v1/player/ccv/${id}/embed?api_key=behance1&bgcolor=%23191919`;
const behance = (path: string) => `https://www.behance.net/gallery/${path}`;

export const projects: Project[] = [
  {
    slug: 'showreel',
    name: 'Showreel',
    category: '3D & Renders',
    stats: '3D · Motion · Blender · After Effects',
    year: '2025',
    cover: cover('9aa6e3239173199.Y3JvcCwxMjU5LDk4NCwzNjcsMA.png'),
    description: 'A cut of my 3D and motion work, built in Blender and finished in After Effects.',
    media: [{ type: 'embed', src: player('LQNFHbkiYDb'), ratio: 16 / 9 }],
    link: behance('239173199/Showreel'),
  },
  {
    slug: 'mahindra-265-plus',
    name: 'New Mahindra 265 Plus Launch',
    category: 'Motion Graphics',
    stats: 'Mahindra Tractors · Launch film · 2D animation',
    year: '2026',
    cover: cover('fcf544241572227.Y3JvcCwxNTk1LDEyNDgsNjk1LDY4Mw.png'),
    description: 'Launch animation for the new Mahindra 265 Plus tractor, made in After Effects and Illustrator.',
    media: [{ type: 'embed', src: player('KEzmt5tptxU'), ratio: 1 }],
    link: behance('241572227/New-Mahindra-265-Plus-launch'),
  },
  {
    slug: 'lamborghini-lineup',
    name: 'Lamborghini Lineup',
    category: '3D & Renders',
    stats: '3D modeling · Vehicle render · Blender',
    year: '2025',
    cover: cover('447bec239175939.Y3JvcCwxMzgwLDEwODAsMjcwLDA.png'),
    description: 'A lineup of Lamborghini cars, modelled, lit and rendered in Blender.',
    media: [{ type: 'image', src: pic('8e7dd4239175939.69243219c6666.png') }],
    link: behance('239175939/Lamborghini-lineup'),
  },
  {
    slug: 'beyond-frames-cinema',
    name: 'Beyond Frames Cinema',
    category: 'AI Video & Image',
    stats: 'Logo reveal trailer · AI video · Midjourney',
    year: '2026',
    cover: cover('67b04b241570267.Y3JvcCwxOTkxLDE1NTcsNTE3LDIwMg.png'),
    description: "Logo reveal trailer for Beyond Frames Cinema, a sci-fi storytelling YouTube channel. Made with Midjourney and After Effects.",
    media: [{ type: 'embed', src: player('APLofE8kkjS'), ratio: 16 / 9 }],
    link: behance('241570267/Beyond-Frames-Cinema-Logo-reveal-trailer'),
  },
  {
    slug: 'mbull-engine-launch',
    name: 'mBull Engine Launch',
    category: 'Motion Graphics',
    stats: 'Mahindra Tractors · Launch campaign',
    year: '2026',
    cover: cover('69299e241571489.Y3JvcCwxNzcxLDEzODUsNjQwLDQ3Mw.png'),
    description: 'Animated launch post for the Mahindra mBull engine, made in After Effects and Illustrator.',
    media: [{ type: 'embed', src: player('9ypnAK4xdYm'), ratio: 1 }],
    link: behance('241571489/Mbull-engine-Launch-Post-for-Mahindra'),
  },
  {
    slug: 'tunnel',
    name: 'Tunnel',
    category: '3D & Renders',
    stats: '3D modeling · Lighting · Blender',
    year: '2025',
    cover: cover('4dd6f5239172703.Y3JvcCwxMzgwLDEwODAsMjcwLDA.jpg'),
    description: 'A tunnel scene modelled and lit in Blender, seen from seven angles.',
    media: ['e5331f239172703.6924266f75079', 'e6bd68239172703.6924266f76994', 'f79b01239172703.6924266f77853', '5cdd44239172703.6924266f75810', '8788d2239172703.6924266f76234', '614eca239172703.6924266f77db8', '45b28f239172703.6924266f770f4']
      .map((f) => ({ type: 'image' as const, src: pic(`${f}.jpg`) })),
    link: behance('239172703/Tunnel-Blender-Work'),
  },
  {
    slug: 'arabian-village',
    name: 'Arabian Village',
    category: 'Graphic Design',
    stats: 'Digital art · Illustration · Photoshop',
    year: '2026',
    cover: cover('04ec96241570503.Y3JvcCw5MjAsNzIwLDEwMTEsMA.png'),
    description: 'Digital art inspired by the Arabian Nights, showing the culture and atmosphere of an Arab village.',
    media: [
      { type: 'image', src: pic('c96407241570503.695b9cf41868a.png'), caption: 'Final artwork' },
      { type: 'image', src: pic('6d0380241570503.695b9cf418126.png'), caption: 'Rough sketch' },
    ],
    link: behance('241570503/Digital-Art'),
  },
  {
    slug: 'social-media-animation',
    name: 'Social Media Post Animation',
    category: 'Motion Graphics',
    stats: 'Social media · Animation · After Effects',
    year: '2025',
    cover: cover('ddea98239309321.Y3JvcCwyNTEwLDE5NjQsODAsMA.png'),
    description: 'Animated social media posts, designed in Photoshop and animated in After Effects.',
    media: [{ type: 'embed', src: player('PwRoIXycXTn'), ratio: 3 / 2 }],
    link: behance('239309321/Social-Media-Post-Animation'),
  },
  {
    slug: 'ai-video',
    name: 'AI Video',
    category: 'AI Video & Image',
    stats: 'AI video · DALL·E 3',
    year: '2025',
    cover: cover('b72583235257803.Y3JvcCwyODAwLDIxOTAsMCwzMDQ.png'),
    description: 'Three short films made with AI tools.',
    media: ['8UEnmVrob7b', '9cnM6Z3VJJr', 'W3-xH4ejvsx'].map((id) => ({ type: 'embed' as const, src: player(id), ratio: 16 / 9 })),
    link: behance('235257803/Ai-Video'),
  },
  {
    slug: 'projects-av',
    name: 'Projects AV',
    category: 'Motion Graphics',
    stats: 'Motion graphics · Video editing',
    year: '2025',
    cover: cover('066e28239322861.Y3JvcCwyNTEwLDE5NjQsMjU0LDA.png'),
    description: 'Motion graphics and video edits made in After Effects.',
    media: [{ type: 'embed', src: player('7Kve3kn3ndi'), ratio: 3 / 2 }],
    link: behance('239322861/PROJECTS-AV'),
  },
  {
    slug: 'stop-motion',
    name: 'Stop Motion',
    category: 'Motion Graphics',
    stats: 'Clay art · Stop-motion animation',
    year: '2025',
    cover: cover('652b75239173773.Y3JvcCwxMzA5LDEwMjQsMTEzLDA.png'),
    description: 'A stop-motion animation made with clay.',
    media: [{ type: 'embed', src: player('AXa98kKCGx6'), ratio: 16 / 9 }],
    link: behance('239173773/Stop-motion'),
  },
];

// Toolkit shown under Services (displayed in capitals with / between). Name specific AI tools here if you like.
export const tools = ['Photoshop', 'After Effects', 'Premiere Pro', 'Blender', 'Procreate', 'AI Tools', 'AI Workflows (MCP)'];

// ============================================================
//  EDIT YOUR PORTFOLIO HERE
//  Almost all the words, links and images on the page live in
//  this one file. Change them and the page updates instantly.
// ============================================================

export const site = {
  // Your name: used in the hero heading, loader, footer and image text
  name: 'shubham',
  tagline: 'a 3d creator driven by crafting striking and unforgettable projects',
  about:
    "With more than five years of experience in design, i focus on branding, web design, and user experience, i truly enjoy working with businesses that aim to stand out and present their best image. Let's build something incredible together!",
  // Where the "Contact Me" buttons send people. Replace with your real email.
  email: 'hello@example.com',
  socials: [
    { label: 'Instagram', href: '#' },
    { label: 'Behance', href: '#' },
    { label: 'LinkedIn', href: '#' },
  ],
};

// Living Portrait pictures. Leave empty to use the demo character.
// To use your own: put your pictures in portrait-src/, run `npm run portrait` (see PORTRAIT-GUIDE.md), and set this to '/portrait/'.
export const portraitFolder = '/portrait/';

export const navLinks = [
  { label: 'Work', href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Contact', href: '#contact' },
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

const img = (file: string) =>
  `https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_${file}.png&w=1280&q=85`;

// `stats` is the small line under each card on the work timeline. Edit it to match the real project.
export type Project = { name: string; category: string; stats: string; link: string; col1: [string, string]; col2: string };

export const projects: Project[] = [
  {
    name: 'Nextlevel Studio',
    stats: 'Client · 3D modeling · Rendering',
    category: 'Client',
    link: '#',
    col1: [img('20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db'), img('20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8')],
    col2: img('20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327'),
  },
  {
    name: 'Aura Brand Identity',
    stats: 'Personal · Branding · Motion',
    category: 'Personal',
    link: '#',
    col1: [img('20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f'), img('20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1')],
    col2: img('20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea'),
  },
  {
    name: 'Solaris Digital',
    stats: 'Client · Web design · 3D',
    category: 'Client',
    link: '#',
    col1: [img('20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f'), img('20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b')],
    col2: img('20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee'),
  },
];

// Toolkit shown under Services. Replace with the tools you actually use.
export const tools = ['Blender', 'Cinema 4D', 'Octane', 'Substance Painter', 'After Effects', 'Figma'];

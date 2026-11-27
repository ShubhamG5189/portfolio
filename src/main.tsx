import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { MotionGlobalConfig } from 'framer-motion';
import './index.css';

// Development only (stripped from the live build): open any page with ?skipanim to finish
// every animation instantly — handy for testing when the browser pauses animation.
if (import.meta.env.DEV && new URLSearchParams(window.location.search).has('skipanim')) MotionGlobalConfig.skipAnimations = true;

// Two pages: /contact gets the contact page, everything else the portfolio.
// Each is loaded on its own, so the contact page doesn't download the 3D portrait engine.
const isContact = /^\/contact\/?$/.test(window.location.pathname);
const Page = lazy(() => (isContact ? import('./pages/ContactPage') : import('./App')));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={null}>
      <Page />
    </Suspense>
    {/* the portfolio page mounts these itself */}
    {isContact && (
      <>
        <Analytics />
        <SpeedInsights />
      </>
    )}
  </StrictMode>,
);

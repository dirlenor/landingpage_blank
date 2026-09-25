import type { Metadata } from 'next';
import '@fontsource/anton/latin-400.css';
import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-600.css';
import '@fontsource/manrope/latin-800.css';
import '@fontsource/anuphan/400.css';
import '@fontsource/anuphan/600.css';
import '@fontsource/anuphan/700.css';
import 'lenis/dist/lenis.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'BLANK. — Good ideas move people.',
  description: 'An independent creative studio. Ideas, culture, and experiences that move people.',
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}<noscript><style>{`.experience.is-cinematic{height:auto}.experience.is-cinematic .scene{position:relative;height:100svh;overflow:hidden}.experience.is-cinematic .opening-world{display:none}.experience.is-cinematic .scene-01{background:var(--paper) url('/assets/web/hero-person.webp') 50% 100%/auto 92% no-repeat}.experience.is-cinematic .scene-02{background:url('/assets/web/hero-person.webp') 85% 150%/auto 120% no-repeat,url('/assets/web/alpine.webp') center/cover}.experience.is-cinematic .scene-05{background:url('/assets/web/coast.webp') center/cover}.environment,.hero-left .word,.hero-right .word,.person-enter,.hero-detail,.experience.is-cinematic .scene:not(.scene-01){opacity:1!important;visibility:visible!important}`}</style></noscript></body></html>;
}

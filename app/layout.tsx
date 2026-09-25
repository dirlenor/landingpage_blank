import type { Metadata } from 'next';
import Script from 'next/script';
import '@fontsource/anton/latin-400.css';
import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-600.css';
import '@fontsource/manrope/latin-800.css';
import 'lenis/dist/lenis.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'BLANK. — Good ideas move people.',
  description: 'An independent creative studio. Ideas, culture, and experiences that move people.',
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><body>{children}<Script id="enable-motion-entry" strategy="beforeInteractive">{`document.documentElement.classList.add('js');`}</Script></body></html>;
}

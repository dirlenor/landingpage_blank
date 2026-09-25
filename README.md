# BLANK. Cinematic scroll experience

A Next.js / React implementation of the supplied six-scene reference. The art direction remains cream, ink, lime, bold condensed headlines, editorial photography, and an asymmetric collage. Source typography and separate original photos were not supplied, so Anton / Manrope are local, licensed approximations, and photography was created for this prototype.

## Run

```sh
npm install
npm run dev
```

Open http://localhost:3000. Production: `npm run build` then `npm start`.

## Motion

`app/page.tsx` contains **one scroll-linked master timeline and one ScrollTrigger**. The load-only hero entrance animates nested wrappers, avoiding competing transform ownership. All six scenes are absolutely positioned inside one pinned 100svh stage. Desktop scroll wrapper: 850svh. Mobile: 800svh.

The master is scored over 100 time units, with `hero`, `immersive`, `statement`, `gallery`, `cinematic`, and `contact` labels. Labels and the navigation resting positions are defined near the top of the component.

1. Shared alpha portrait and alpine plate push from the hero into the immersive world.
2. The statement scene itself rises as the lime wipe.
3. The right cutout converges centrally, a photographic backplate opens beneath it, and the deliberate collage bursts outward.
4. A shared masked portrait moves to centre and opens into the cinematic image. The image crop and scale move with the aperture; no photo swap or crossfade.
5. The contact scene itself rises as the black curtain.
6. The landscape circle expands around its own centre. Its final scale is calculated from the farthest viewport corner.

Lenis uses GSAP's ticker, seconds converted to milliseconds, and calls ScrollTrigger.update on scroll, following the [official Lenis integration](https://github.com/darkroomengineering/lenis#gsap-scrolltrigger). Scrub is 0.65 seconds; Lenis lerp is 0.105. There is no scroll snapping.

## Responsive and accessible behavior

- Mobile has five secondary gallery photographs, smaller rotations/travel, distinct text positioning, and no pointer effects.
- `prefers-reduced-motion` disables Lenis, the master timeline, and pinning. All six scenes appear in conventional reading order.
- Without JavaScript the conventional layout remains readable and primary navigation uses real anchors.
- The native dialog supports Escape and focus trapping. Scene navigation moves to settled, readable states; inactive cinematic scenes are inert and hidden from assistive technology.
- GSAP context, matchMedia, Lenis, ticker callbacks and listeners are cleaned up. Image decoding and local font readiness trigger a refresh. Function-based coordinates recalculate on resize.

## Assets

All **eight PNG originals** are in `public/assets/`, including genuine alpha in `hero-person.png` and `motion-cutout.png`. The generation prompts are in `docs/ASSET-PROMPTS.md`; generated with the built-in imagegen tool. Their WebP delivery equivalents are in `public/assets/web/` (approximately 1.77 MB total versus 18.81 MB for PNG originals). No composition changes were made during conversion.

Run `node scripts/optimize-assets.mjs` to regenerate delivery images. Fonts ship locally via `@fontsource`; no runtime font service.

## Verification

`npm run check` checks TypeScript. `npm run build` builds the production route.

`node scripts/verify.mjs` checks desktop 1440×900, phone 390×844, compact phone 360×640, reduced motion, settled scenes, intermediate transitions, image loading, overflow, browser errors, dialog behavior, navigation and reverse scrolling. Screenshots and JSON report are written to `test-results/` (ignored by Git).

The test script uses Chrome's default Windows executable path; adjust it or use a Playwright-installed Chromium on another machine. It is headless and disables native pointer lock/capture.

This is a local visual prototype, not a deployed site. The reference contact address is retained as a `mailto:` link; no email has been sent and no backend is configured. The Journal navigation preserves the reference label and takes the viewer to the approach scene.

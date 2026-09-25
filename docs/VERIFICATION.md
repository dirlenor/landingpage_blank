# Verification record

Production URL used for checks: `http://localhost:3001`.

- `npm run check`: passed.
- `npm run build`: passed; home route statically prerendered.
- Full browser sweep: desktop 1440×900, tablet 1024×768, phone 390×844, compact phone 360×640, reduced motion 1440×900.
- Per animated viewport: 12 resting / intermediate samples, forward traversal, reverse to hero, menu opening, Escape closure, and navigation to selected work.
- All photos loaded, no horizontal overflow, no console/page errors, no failed requests.
- Active-scene accessibility: one non-inert scene in cinematic mode, all six in reduced motion.
- Live resize and reduced-motion switching: exactly one pin after mobile resize, zero pins in reduced motion, one pin after restoring motion.
- Final targeted checks after gallery-centre and circle-geometry refinements: 1440×900, 1024×768, 390×844, 360×640 and 2560×700. Gallery origin matches the authored centre and the final circle geometrically covers all four corners at every size. No browser errors.
- Final visual inspection included hero, statement, selected image crop, mobile immersive text, mobile collage annotation, contact, and transition contact sheets.

Full pre-refinement report: `verification-before-final-centering.json`. Later targeted report: `verification-final-centering.json`. Screenshots are under `test-results/`; final gallery and ending screenshots use the `final-` prefix. Earlier screenshot sheets document the broader motion coverage; final screenshots supersede their gallery centring.

Tests ran in headless Chrome on this Windows machine. They establish layout and interaction behavior, not a hardware-independent frame-rate guarantee. Safari, physical touch devices, and a hosted deployment were not tested. Optional pointer parallax was deliberately omitted; the authored scroll motion carries the experience.

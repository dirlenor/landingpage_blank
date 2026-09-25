'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

const chapters = [
  { id: 'hero', title: 'Good ideas', at: 0 },
  { id: 'immersive', title: 'A wider perspective', at: .265 },
  { id: 'statement', title: 'Our belief', at: .435 },
  { id: 'gallery', title: 'Selected work', at: .625 },
  { id: 'cinematic', title: 'Our approach', at: .815 },
  { id: 'contact', title: 'Reach out', at: .951 },
];
const photos = [
  { src: 'surf', alt: 'A surfer carving through a blue wave', x: -.27, y: -.20, r: -13, mx: -.26, my: -.19 },
  { src: 'road', alt: 'A sports car on a winding coastal road', x: -.40, y: .05, r: 7, mx: -.32, my: .14 },
  { src: 'sunset', alt: 'Mountain ridges in evening light', x: .32, y: .18, r: -7, mx: .27, my: .23 },
  { src: 'motion', alt: 'An outdoor fashion portrait in the mountains', x: .34, y: -.29, r: 8, mx: .29, my: -.29 },
  { src: 'coast', alt: 'A windswept portrait on a rocky coast', x: -.08, y: .29, r: -9, mx: -.22, my: .32 },
  { src: 'alpine', alt: 'A glacial mountain valley', x: .07, y: -.33, r: -12, mx: 0, my: 0 },
  { src: 'surf', alt: 'Ocean spray and rolling surf', x: .43, y: -.04, r: 12, mx: 0, my: 0 },
  { src: 'sunset', alt: 'Golden light on distant mountains', x: -.32, y: .32, r: 9, mx: 0, my: 0 },
];

function Photo({ name, alt = '', className = '' }: { name: string; alt?: string; className?: string }) {
  return <img className={className} src={`/assets/web/${name}.webp`} alt={alt} draggable={false} decoding="async" fetchPriority={name === 'hero-person' || name === 'alpine' ? 'high' : 'auto'} />;
}
function Folio({ number, label }: { number: string; label: string }) {
  return <div className="folio"><span>{number}</span><span>{label}</span><i /></div>;
}
function Lines({ text, className = '' }: { text: string[]; className?: string }) {
  return <h2 className={className}>{text.map(line => <span className="line-mask" key={line}><span className="line">{line}</span></span>)}</h2>;
}

export default function Home() {
  const root = useRef<HTMLDivElement>(null);
  const menu = useRef<HTMLDialogElement>(null);
  const masterRef = useRef<gsap.core.Timeline | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const [active, setActive] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  function jump(index: number) {
    menu.current?.close();
    setMenuOpen(false);
    const st = masterRef.current?.scrollTrigger;
    const focusScene = () => document.getElementById(chapters[index].id)?.focus({ preventScroll: true });
    if (st && lenisRef.current) {
      lenisRef.current.start();
      lenisRef.current.scrollTo(st.start + (st.end - st.start) * chapters[index].at, { duration: 1.5, onComplete: focusScene });
    } else { document.getElementById(chapters[index].id)?.scrollIntoView({ behavior: 'auto' }); focusScene(); }
  }

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const host = root.current!;
    const mm = gsap.matchMedia();
    let disposed = false;
    const ctx = gsap.context(() => {
      mm.add({ desktop: '(min-width: 1025px)', tablet: '(min-width: 701px) and (max-width: 1024px)', mobile: '(max-width: 700px)', reduce: '(prefers-reduced-motion: reduce)' }, context => {
        const { mobile, tablet, reduce } = context.conditions!;
        if (reduce) return;
        let alive = true;
        host.classList.add('is-cinematic');
        const w = () => host.clientWidth;
        const h = () => host.querySelector<HTMLElement>('.stage')!.clientHeight;
        const travel = mobile ? .48 : tablet ? .7 : 1;
        const $ = gsap.utils.selector(host);
        const lenis = new Lenis({ lerp: .08, smoothWheel: true, syncTouch: false, wheelMultiplier: .9 });
        lenisRef.current = lenis;
        lenis.on('scroll', ScrollTrigger.update);
        const tick = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);

        gsap.set('.scene-03, .scene-06', { yPercent: 100 });
        gsap.set('.scene-04', { clipPath: 'inset(100% 0% 0% 0%)' });
        gsap.set('.scene-02, .scene-05, .origin-portrait, .selected-photo, .gallery-card', { autoAlpha: 0 });
        gsap.set('.scene-03 .line, .scene-05 .line', { yPercent: 110 });
        gsap.set('.scene-03 .support-photo', { x: -80 * travel, rotation: -5 });
        gsap.set('.statement-note, .belief-copy, .contact-details', { y: 15, opacity: 0 });
        gsap.set('.contact-reach', { xPercent: -100 });
        gsap.set('.contact-out', { xPercent: 120 });
        gsap.set('.landscape-circle', { scale: 0, rotation: -8 });
        gsap.set('.gallery-title', { scale: 1.15, opacity: 0 });
        gsap.set('.selected-photo', { clipPath: mobile ? 'inset(29% 26% 29% 26%)' : 'inset(24% 39% 24% 39%)', scale: .2 });
        gsap.set('.selected-image', { xPercent: mobile ? -9 : -16, scale: mobile ? .76 : .62 });
        gsap.set('.gallery-card', { xPercent: -50, yPercent: -50, x: 0, y: 0, scale: .2, rotation: 0 });
        gsap.set('.origin-backplate', { clipPath: 'inset(100% 0% 0% 0%)' });

        // A separate load-only entrance owns inner wrappers, never scroll transforms.
        const entrance = gsap.timeline({ defaults: { ease: 'expo.out', duration: 1.05 } });
        entrance.from('.hero-left .word', { yPercent: 110, stagger: .08 })
          .from('.hero-right .word', { xPercent: 110, stagger: .08 }, '<0.15')
          .from('.person-enter', { scale: .82, y: 100, rotation: -2 }, '<0.1')
          .from('.hero-detail', { opacity: 0, y: 12, stagger: .06, duration: .65 }, '-=0.55');
        let current = -1;
        const sceneEls = $('.scene') as HTMLElement[];
        const progressLine = $('.progress-fill')[0] as HTMLElement;
        const master = gsap.timeline({
          defaults: { ease: 'power2.inOut' },
          scrollTrigger: {
            id: 'blank-master', trigger: host, pin: $('.stage')[0], start: 'top top', end: 'bottom bottom',
            pinSpacing: false, scrub: .45, anticipatePin: 1, invalidateOnRefresh: true,
            onUpdate: self => { if (self.progress > .01 && entrance.progress() < 1) entrance.progress(1); },
          },
          onUpdate: () => {
            const p = master.progress();
            const index = p < .215 ? 0 : p < .36 ? 1 : p < .54 ? 2 : p < .765 ? 3 : p < .905 ? 4 : 5;
            progressLine.style.transform = `scaleX(${p})`;
            if (index !== current) {
              current = index; setActive(index);
              sceneEls.forEach((el, i) => { el.inert = i !== index; el.setAttribute('aria-hidden', String(i !== index)); });
              host.dataset.scene = String(index + 1);
            }
          },
        });
        masterRef.current = master;
        master.addLabel('hero', 0).addLabel('immersive', 22).addLabel('statement', 38)
          .addLabel('gallery', 58).addLabel('cinematic', 77).addLabel('contact', 91);
        // Give the first scroll gesture a visible response before the scene opens.
        master.to('.hero-person', { y: -22, scale: 1.04, duration: 4, ease: 'sine.inOut' }, 0)
          .to('.environment img', { scale: 1.06, duration: 4, ease: 'sine.inOut' }, '<')
          .to('.hero-scribble', { y: -24 * travel, rotation: 4, duration: 4 }, '<');
        // One foreground subject, one clean plate: the hero becomes the photograph.
        master.to('.hero-left', { xPercent: -125, scale: 1.1, duration: 10 }, 4)
          .to('.hero-right', { xPercent: 130, scale: 1.1, duration: 10 }, '<')
          .to('.hero-detail', { y: -80 * travel, opacity: 0, duration: 5 }, '<')
          .to('.environment', { clipPath: 'inset(0% 0% 0% 0%)', rotation: 0, duration: 10 }, '<')
          .to('.environment img', { scale: 1.08, duration: 10 }, '<')
          .to('.hero-person', { scale: mobile ? 1.38 : 1.65, x: () => w() * (mobile ? .12 : .15), y: () => h() * .20, duration: 10 }, '<')
          .set('.scene-02', { autoAlpha: 1 }, 19)
          .from('.immersive-title', { y: 45, clipPath: 'inset(100% 0% 0% 0%)', duration: 4, ease: 'power2.out' }, 19)
          .from('.immersive-detail', { y: 15, opacity: 0, duration: 3, stagger: .25 }, 21)
          .to('.environment img', { scale: 1.13, duration: 8, ease: 'sine.inOut' }, 22)
          .to('.hero-person', { x: () => w() * (mobile ? .10 : .13), duration: 8, ease: 'sine.inOut' }, '<');
        // The rising lime panel is the statement scene itself.
        master.to('.scene-03', { yPercent: 0, duration: 8 }, 30)
          .to('.environment, .hero-person', { yPercent: -8, duration: 8 }, '<')
          .to('.scene-02', { yPercent: -35, duration: 8 }, '<')
          .to('.scene-03 .line', { yPercent: 0, duration: 4, stagger: .65, ease: 'power2.out' }, 35)
          .to('.scene-03 .support-photo', { x: 0, rotation: -2, duration: 5, ease: 'power2.out' }, 36)
          .set('.origin-portrait', { autoAlpha: 1 }, 36)
          .fromTo('.origin-portrait', { x: 120 * travel, y: () => h() * .4, rotation: 5 }, { x: 0, y: 0, rotation: 1, duration: 6, ease: 'power2.out', immediateRender: false }, 36)
          .to('.statement-note, .belief-copy', { y: 0, opacity: 1, duration: 3, stagger: .2 }, 40);
        // The right portrait travels to the shared centre before the collage opens.
        const centerOriginX = () => w() * (mobile ? -.20 : -.30);
        const centerOriginY = () => h() * (mobile ? -.20 : -.04);
        master.to('.statement-title', { scale: .9, y: -30, duration: 6 }, 48)
          .to('.origin-portrait', { x: centerOriginX, y: centerOriginY, rotation: 0, scale: .8, duration: 5 }, '<')
          .to('.origin-backplate', { clipPath: 'inset(0% 0% 0% 0%)', duration: 4 }, 49)
          .to('.scene-04', { clipPath: 'inset(0% 0% 0% 0%)', duration: 5 }, 49)
          .to('.gallery-title', { scale: 1, opacity: 1, duration: 6, ease: 'power2.out' }, 52);
        photos.forEach((photo, i) => {
          if (mobile && i >= 5) return;
          const card = $(`.card-${i}`);
          const px = mobile ? photo.mx : photo.x;
          const py = mobile ? photo.my : photo.y;
          master.set(card, { autoAlpha: 1 }, 53 + i * .2)
            .to(card, { x: () => w() * px, y: () => h() * py, scale: 1, rotation: photo.r * (mobile ? .45 : 1), duration: 5, ease: 'power2.out' }, 53 + i * .2)
            .to(card, { y: () => h() * (py + (py < 0 ? -.025 : .025)), duration: 9, ease: 'sine.inOut' }, 59)
            .to(card, { x: () => w() * (px < 0 ? -1.15 : 1.15), y: () => h() * py * 2.6, duration: 8, ease: 'power3.inOut' }, 68 + i * .12);
        });
        master.to('.origin-portrait', { x: () => centerOriginX() - w() * .13, y: () => centerOriginY() + h() * .06, scale: mobile ? .4 : .43, rotation: -7, duration: 6, ease: 'power2.out' }, 53)
          .set('.selected-photo', { autoAlpha: 1 }, 53)
          .to('.selected-photo', { x: () => w() * (mobile ? .08 : .15), y: () => -h() * .07, scale: 1, rotation: mobile ? 4 : 9, duration: 6, ease: 'power2.out' }, 53)
          .to('.selected-photo .selected-image', { scale: mobile ? .775 : .635, duration: 9, ease: 'sine.inOut' }, 59)
          .to('.origin-portrait', { x: () => -w() * 1.4, rotation: -12, duration: 8 }, 68)
          .to('.gallery-title', { scale: 1.3, yPercent: -15, duration: 9 }, 68)
          .to('.selected-photo', { x: 0, y: 0, rotation: 0, duration: 4, ease: 'power3.inOut' }, 68)
          .to('.selected-photo', { clipPath: 'inset(0% 0% 0% 0%)', duration: 6, ease: 'power2.inOut' }, 71)
          .to('.selected-image', { xPercent: 0, scale: 1, duration: 6, ease: 'power2.inOut' }, '<')
          .set('.scene-05', { autoAlpha: 1 }, 74)
          .to('.scene-05 .line', { yPercent: 0, duration: 4, stagger: .7, ease: 'power2.out' }, 74)
          .from('.cinematic-detail', { opacity: 0, y: 12, duration: 3, stagger: .25 }, 78)
          .to('.selected-photo .selected-image', { scale: 1.08, duration: 8, ease: 'sine.inOut' }, 77)
          .to('.scene-05 .line', { xPercent: i => [-3, 2, -1][i] * (mobile ? .4 : 1), duration: 8, ease: 'sine.inOut' }, 77);
        // The black curtain becomes contact; there is no background hand-off.
        master.to('.scene-06', { yPercent: 0, duration: 6 }, 85)
          .to('.selected-photo', { yPercent: -15, scale: 1.04, duration: 6 }, '<')
          .to('.scene-05', { yPercent: -30, duration: 6 }, '<')
          .to('.contact-reach, .contact-out', { xPercent: 0, duration: 4, stagger: .35, ease: 'power2.out' }, 90)
          .to('.contact-details', { y: 0, opacity: 1, duration: 2.5, stagger: .2 }, 92)
          .to('.landscape-circle', { scale: 1, rotation: 0, duration: 3, ease: 'back.out(1.2)' }, 91.5)
          .to('.contact-details', { y: 28, duration: 3 }, 97)
          .to('.contact-reach', { xPercent: -12, duration: 3 }, 97)
          .to('.contact-out', { xPercent: 10, duration: 3 }, '<')
          .to('.landscape-circle', { scale: () => {
            const circle = $('.landscape-circle')[0] as HTMLElement;
            // Farthest viewport corner determines coverage; centre stays anchored.
            const cx = circle.offsetLeft + circle.offsetWidth / 2;
            const cy = circle.offsetTop + circle.offsetHeight / 2;
            return 2 * Math.hypot(Math.max(cx, w() - cx), Math.max(cy, h() - cy)) / circle.offsetWidth + .15;
          }, rotation: 0, duration: 3, ease: 'power3.inOut' }, 97);

        // Promote only the small set of layers participating in the current interval.
        const layerSets = ['.hero-person, .environment', '.hero-person, .environment', '.scene-03, .origin-portrait', '.gallery-card, .selected-photo', '.selected-photo, .scene-06', '.landscape-circle'];
        let promoted = -1;
        const promote = () => {
          if (promoted === current) return;
          $('[data-promoted]').forEach((el: HTMLElement) => { el.style.willChange = ''; el.removeAttribute('data-promoted'); });
          $(layerSets[Math.max(0, current)]).forEach((el: HTMLElement) => { el.style.willChange = 'transform'; el.setAttribute('data-promoted', ''); });
          promoted = current;
        };
        gsap.ticker.add(promote);
        const refresh = () => { if (!disposed && alive) { lenis.resize(); ScrollTrigger.refresh(); } };
        Promise.all([document.fonts.ready, ...Array.from(host.querySelectorAll('img')).map(img => img.decode().catch(() => {}))]).then(refresh);
        return () => {
          alive = false;
          gsap.ticker.remove(tick); gsap.ticker.remove(promote); lenis.off('scroll', ScrollTrigger.update); lenis.destroy();
          masterRef.current = null; lenisRef.current = null; host.classList.remove('is-cinematic');
          sceneEls.forEach(el => { el.inert = false; el.removeAttribute('aria-hidden'); });
          $('[data-promoted]').forEach((el: HTMLElement) => { el.style.willChange = ''; el.removeAttribute('data-promoted'); });
        };
      });
    }, root);
    return () => { disposed = true; mm.revert(); ctx.revert(); };
  }, []);

  useEffect(() => {
    const dialog = menu.current;
    if (!dialog) return;
    const close = () => { setMenuOpen(false); lenisRef.current?.start(); };
    dialog.addEventListener('close', close);
    return () => dialog.removeEventListener('close', close);
  }, []);

  return <>
    <a className="skip-link" href="#contact" onClick={e => { e.preventDefault(); jump(5); }}>Skip to contact</a>
    <header className={`site-header ${active > 0 ? 'quiet' : ''} ${active === 4 || active === 5 ? 'light' : ''}`}>
      <a className="wordmark" href="#hero" onClick={e => { e.preventDefault(); jump(0); }} aria-label="BLANK home">BLANK.</a>
      <nav aria-label="Primary navigation">
        {[['WORK', 3], ['ABOUT', 2], ['JOURNAL', 4], ['CONTACT', 5]].map(([name, index]) => <a key={name} href={`#${chapters[Number(index)].id}`} onClick={e => { e.preventDefault(); jump(Number(index)); }}>{name}</a>)}
      </nav>
      <span className="studio-label">A CREATIVE STUDIO</span>
      <button className="menu-toggle" aria-label="Open menu" aria-expanded={menuOpen} aria-controls="chapter-menu" onClick={() => { menu.current?.showModal(); setMenuOpen(true); lenisRef.current?.stop(); }}><span /><span /></button>
    </header>

    <main ref={root} className="experience" data-scene="1">
      <div className="stage">
        <div className="opening-world" aria-hidden="true">
          <div className="environment"><Photo name="alpine" /></div>
          <div className="hero-person"><div className="person-enter"><Photo name="hero-person" /></div></div>
        </div>

        <section id="hero" tabIndex={-1} className="scene scene-01" aria-labelledby="hero-heading">
          <span className="hero-number hero-detail">01</span>
          <h1 id="hero-heading" className="hero-heading">
            <span className="hero-left"><span className="word-mask"><span className="word">GOOD</span></span><span className="word-mask"><span className="word">IDEAS</span></span></span>
            <span className="hero-right"><span className="word-mask"><span className="word">MOVE</span></span><span className="word-mask"><span className="word">PEOPLE</span></span></span>
          </h1>
          <p className="hero-copy micro hero-detail">WE CREATE<br />BRANDS, EXPERIENCES<br />AND STORIES THAT<br />MOVE PEOPLE.</p>
          <p className="hero-note handwritten hero-detail">A MORE<br />HUMAN<br />CREATIVE<br />STUDIO</p>
          <p className="culture-note handwritten hero-detail">IDEAS<br />CULTURE<br />PEOPLE</p>
          <svg className="hero-scribble hero-detail" viewBox="0 0 260 360" fill="none" aria-hidden="true"><path d="M204 4C179 36 68 166 96 176S244 90 224 122 54 253 92 259 197 220 159 261 8 350 16 329" stroke="currentColor" strokeWidth="2" /></svg>
          <button className="hero-next round-arrow hero-detail" aria-label="Explore a wider perspective" onClick={() => jump(1)}>↘</button>
          <div className="scroll-cue hero-detail"><span>SCROLL</span><i /><span>↓</span></div>
        </section>

        <section id="immersive" tabIndex={-1} className="scene scene-02" aria-labelledby="immersive-heading">
          <Folio number="02" label="IMMERSIVE" />
          <div className="immersive-copy"><h2 id="immersive-heading" className="immersive-title">A WIDER<br />PERSPECTIVE</h2><p className="micro immersive-detail">EXPLORING NEW PLACES.<br />NEW IDEAS AND A BRIGHTER<br />TOMORROW.</p></div>
          <p className="immersive-aside immersive-detail">PEOPLE<br />PLACES<br />IDEAS</p>
          <button className="immersive-next round-arrow immersive-detail" aria-label="Explore our belief" onClick={() => jump(2)}>↗</button>
        </section>

        <section id="statement" tabIndex={-1} className="scene scene-03" aria-label="Our belief">
          <Folio number="03" label="OUR BELIEF" />
          <p className="belief-copy micro">CREATIVITY<br />FOR A BRIGHTER<br />TOMORROW.</p>
          <Lines className="statement-title display" text={['WE CREATE', 'THINGS THAT', 'MOVE PEOPLE.']} />
          <div className="support-photo"><Photo name="coast" alt="A portrait at sunset" /></div>
          <div className="statement-stamp statement-note handwritten">IDEAS<br />INTO REALITY ↗</div>
          <p className="statement-aside statement-note handwritten">BRANDS<br />EXPERIENCES<br />PEOPLE<br />CULTURE</p>
          <Photo className="static-portrait" name="motion-cutout" alt="A fashion portrait in motion" />
        </section>

        <div className="origin-portrait" aria-hidden="true"><div className="origin-backplate"><Photo name="alpine" /></div><Photo className="origin-cutout" name="motion-cutout" /></div>

        <section id="gallery" tabIndex={-1} className="scene scene-04" aria-label="Selected work">
          <Folio number="04" label="SELECTED WORK" />
          <h2 className="gallery-title display">SELECTED<br />WORK</h2>
          <p className="gallery-aside micro">A COLLECTION<br />OF PROJECTS<br />THAT MOVE<br />PEOPLE.</p>
          {photos.map((photo, i) => <figure className={`gallery-card card-${i}`} key={i}><Photo name={photo.src} alt={photo.alt} /></figure>)}
          <button className="gallery-next round-arrow" aria-label="Explore our approach" onClick={() => jump(4)}>↗</button>
        </section>

        <div className="selected-photo" aria-hidden="true"><Photo className="selected-image" name="coast" /></div>
        <section id="cinematic" tabIndex={-1} className="scene scene-05" aria-label="Our approach">
          <Folio number="05" label="OUR APPROACH" />
          <Lines className="cinematic-title" text={['IDEAS', 'SHOULD', 'MOVE.']} />
          <p className="cinematic-detail micro">BOLDER.<br />BRIGHTER.<br />KINDER.<br />HUMAN.</p>
          <span className="cinematic-rule cinematic-detail" />
        </section>

        <section id="contact" tabIndex={-1} className="scene scene-06" aria-label="Get in touch">
          <Folio number="06" label="GET IN TOUCH" />
          <h2 className="contact-title"><span className="contact-reach">REACH</span><span className="contact-out">OUT.</span></h2>
          <p className="contact-invite micro contact-details">LET’S CREATE<br />A BRIGHTER<br />TOMORROW<br />TOGETHER.</p>
          <a className="contact-arrow round-arrow contact-details" href="mailto:hello@blank.studio" aria-label="Email BLANK studio">↗</a>
          <div className="contact-bottom contact-details"><a href="mailto:hello@blank.studio">HELLO@BLANK.STUDIO <span>↗</span></a><span>BANGKOK, THAILAND</span><button onClick={() => jump(0)}>BACK TO TOP ↑</button></div>
          <div className="landscape-circle" aria-hidden="true"><Photo name="sunset" /><span className="orbit" /></div>
        </section>
        <div className="progress-track" aria-hidden="true"><div className="progress-fill" /></div>
      </div>
    </main>

    <dialog id="chapter-menu" className="chapter-menu" ref={menu} onClick={e => { if (e.target === e.currentTarget) menu.current?.close(); }}>
      <div className="menu-top"><span className="wordmark">BLANK.</span><button className="round-arrow" autoFocus aria-label="Close menu" onClick={() => menu.current?.close()}>×</button></div>
      <nav aria-label="Scene navigation">{chapters.map((chapter, i) => <button key={chapter.id} onClick={() => jump(i)}><span>0{i + 1}</span>{chapter.title}<span>↗</span></button>)}</nav>
      <p className="micro">IDEAS. CULTURE. PEOPLE.</p>
    </dialog>
  </>;
}

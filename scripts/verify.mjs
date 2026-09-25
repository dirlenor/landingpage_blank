import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import sharp from 'sharp';

await fs.mkdir('test-results', { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', args: ['--disable-gpu'] });
const report = { cases: [], errors: [], failedRequests: [] };
const baseUrl = process.argv[2] || 'http://localhost:3000';
for (const [name, width, height, reduce] of [['desktop',1440,900,false],['tablet',1024,768,false],['mobile',390,844,false],['compact',360,640,false],['reduced',1440,900,true]]) {
  const page = await browser.newPage({ viewport: { width, height }, reducedMotion: reduce ? 'reduce' : 'no-preference' });
  await page.addInitScript(() => {
    Element.prototype.requestPointerLock = () => Promise.resolve();
    Element.prototype.setPointerCapture = () => {};
  });
  page.on('pageerror', error => report.errors.push({ name, message: error.message }));
  page.on('console', msg => { if (msg.type() === 'error' || msg.type() === 'warning') report.errors.push({ name, message: msg.text() }); });
  page.on('requestfailed', request => report.failedRequests.push({ name, url: request.url(), reason: request.failure() }));
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1800);
  const images = await page.locator('img').evaluateAll(imgs => imgs.every(img => img.complete && img.naturalWidth > 0));
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  const cinematic = await page.locator('.experience').evaluate(el => el.classList.contains('is-cinematic'));
  const samples = reduce ? [0,.2,.4,.6,.8,1] : [0,.17,.265,.34,.435,.515,.625,.725,.815,.88,.951,1];
  const shots = [];
  for (const p of samples) {
    await page.evaluate(p => window.scrollTo(0, (document.documentElement.scrollHeight - innerHeight) * p), p);
    await page.waitForTimeout(1000);
    const path = `test-results/${name}-${String(p).replace('.','_')}.png`;
    await page.screenshot({ path });
    shots.push(path);
  }
  await page.getByRole('button', { name: 'Open menu', exact: true }).click();
  const opened = await page.locator('dialog').evaluate(el => el.open);
  await page.keyboard.press('Escape');
  const closed = await page.locator('dialog').evaluate(el => !el.open);
  await page.getByRole('button', { name: 'Open menu', exact: true }).click();
  await page.getByRole('button', { name: /Selected work/ }).click();
  await page.waitForTimeout(2000);
  const navScene = await page.locator('.experience').getAttribute('data-scene');
  const navTop = await page.locator('#gallery').evaluate(el => Math.round(el.getBoundingClientRect().top));
  await page.evaluate(() => window.scrollTo(0,0));
  await page.waitForTimeout(1200);
  const reverseScene = await page.locator('.experience').getAttribute('data-scene');
  await page.screenshot({path:`test-results/${name}-reverse.png`});
  const focusable = await page.locator('.scene:not([inert])').count();
  const pass = images && !overflow && cinematic === !reduce && opened && closed && (reduce ? navTop === 0 : navScene === '4' && reverseScene === '1' && focusable === 1);
  report.cases.push({ name, images, overflow, cinematic, opened, closed, navScene, navTop, reverseScene, focusable, pass });
  const thumbW = reduce || name === 'desktop' ? 360 : 195;
  const thumbH = Math.round(height * thumbW / width);
  const composites = [];
  for (let i=0; i<shots.length; i++) composites.push({input:await sharp(shots[i]).resize(thumbW,thumbH).png().toBuffer(),left:(i%3)*thumbW,top:Math.floor(i/3)*thumbH});
  await sharp({ create: { width: thumbW*3, height: thumbH*Math.ceil(shots.length/3), channels: 3, background: '#ccc' }}).composite(composites).png().toFile(`test-results/${name}-sheet.png`);
  await page.close();
}
// Resizing and live reduced-motion changes must rebuild exactly one pin, or none.
const adaptive = await browser.newPage({ viewport: {width:1440,height:900} });
await adaptive.addInitScript(() => { Element.prototype.requestPointerLock = () => Promise.resolve(); Element.prototype.setPointerCapture = () => {}; });
adaptive.on('pageerror', error => report.errors.push({name:'adaptive',message:error.message}));
await adaptive.goto(baseUrl, {waitUntil:'networkidle'});
await adaptive.evaluate(() => window.scrollTo(0,(document.documentElement.scrollHeight-innerHeight)*.435));
await adaptive.waitForTimeout(1000);
await adaptive.setViewportSize({width:390,height:844});
await adaptive.waitForTimeout(1200);
const mobilePins = await adaptive.locator('.pin-spacer').count();
await adaptive.emulateMedia({reducedMotion:'reduce'});
await adaptive.waitForTimeout(700);
const reducedPins = await adaptive.locator('.pin-spacer').count();
const readable = await adaptive.locator('.scene:not([inert])').count();
await adaptive.emulateMedia({reducedMotion:'no-preference'});
await adaptive.waitForTimeout(1000);
const restoredPins = await adaptive.locator('.pin-spacer').count();
report.adaptive = {mobilePins,reducedPins,readable,restoredPins,pass:mobilePins===1 && reducedPins===0 && readable===6 && restoredPins===1};
await adaptive.close();
report.pass = report.cases.every(c=>c.pass) && report.adaptive.pass && report.errors.length===0 && report.failedRequests.length===0;
await fs.writeFile('test-results/report.json', JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
await browser.close();
if (!report.pass) process.exitCode=1;

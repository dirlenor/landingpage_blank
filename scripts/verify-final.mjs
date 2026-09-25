import { chromium } from 'playwright';
import fs from 'node:fs/promises';
const browser = await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const checks=[];
for (const [width,height] of [[1440,900],[1024,768],[390,844],[360,640],[2560,700]]) {
  const page=await browser.newPage({viewport:{width,height}});
  await page.addInitScript(()=>{Element.prototype.requestPointerLock=()=>Promise.resolve();Element.prototype.setPointerCapture=()=>{};});
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://localhost:3001',{waitUntil:'networkidle'});
  await page.evaluate(()=>window.scrollTo(0,(document.documentElement.scrollHeight-innerHeight)*.625));
  await page.waitForTimeout(1100);
  const gallery=await page.locator('.card-0').evaluate(el=>{const r=el.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2};});
  await page.screenshot({path:`test-results/final-gallery-${width}.png`});
  await page.evaluate(()=>window.scrollTo(0,(document.documentElement.scrollHeight-innerHeight)));
  await page.waitForTimeout(1200);
  const circle=await page.locator('.landscape-circle').evaluate(el=>{
    const r=el.getBoundingClientRect(), radius=r.width/2, x=r.left+radius,y=r.top+r.height/2;
    const needed=Math.max(...[[0,0],[innerWidth,0],[0,innerHeight],[innerWidth,innerHeight]].map(([cx,cy])=>Math.hypot(cx-x,cy-y)));
    return {radius,needed,covered:radius>=needed};
  });
  await page.screenshot({path:`test-results/final-end-${width}.png`});
  const centreCorrect=Math.abs(gallery.x-width*(width<=700?.24:.23))<2;
  checks.push({width,height,gallery,centreCorrect,circle,errors,pass:centreCorrect&&circle.covered&&errors.length===0});
  await page.close();
}
await browser.close();
await fs.writeFile('docs/verification-final-centering.json',JSON.stringify(checks,null,2));
console.log(JSON.stringify(checks,null,2));
if(checks.some(c=>!c.pass))process.exitCode=1;

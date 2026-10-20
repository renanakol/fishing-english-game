// Captures a website for the promo:
//   - <name>-scroll.png : sharp full-page capture at phone width (the video scrolls through it)
//   - <name>.webm       : real-time scroll recording, for sites with animations worth showing
//
// Usage: node scripts/record-site.mjs <url> <name> [--desktop]
// Output goes to public/works/web/.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const [url, name, flag] = process.argv.slice(2);
if (!url || !name) {
  console.error("Usage: node scripts/record-site.mjs <url> <name> [--desktop]");
  process.exit(1);
}
const desktop = flag === "--desktop";
const out = new URL("../public/works/web/", import.meta.url).pathname;
mkdirSync(out, { recursive: true });

const viewport = desktop ? { width: 1440, height: 900 } : { width: 432, height: 768 };
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport,
  deviceScaleFactor: desktop ? 1.5 : 2.5,
  isMobile: !desktop,
  hasTouch: !desktop,
  locale: "he-IL",
  recordVideo: { dir: out, size: desktop ? { width: 1920, height: 1200 } : { width: 1080, height: 1920 } },
});
const page = await context.newPage();
await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(1500);

// Scroll slowly to the bottom: shows the site in motion and triggers lazy-loaded images.
const total = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
for (let y = 0; y <= total; y += 6) {
  await page.evaluate((top) => scrollTo(0, top), y);
  await page.waitForTimeout(16);
}
await page.waitForTimeout(800);
await page.evaluate(() => scrollTo(0, 0));
await page.waitForTimeout(800);

await page.screenshot({ path: `${out}${name}-scroll.png`, fullPage: true });
const video = page.video();
await context.close();
await video?.saveAs(`${out}${name}.webm`);
await video?.delete();
await browser.close();
console.log(`Saved ${out}${name}-scroll.png and ${out}${name}.webm`);

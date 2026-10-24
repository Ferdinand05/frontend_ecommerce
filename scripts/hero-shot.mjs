import { chromium } from '@playwright/test';

const base = 'http://localhost:4173';
const outDir = '.impeccable/review';
const shots = [
  { name: 'manifesto-desktop', width: 1440, height: 900 },
  { name: 'manifesto-mobile', width: 390, height: 844 },
];

const browser = await chromium.launch();
for (const shot of shots) {
  const page = await browser.newPage({ viewport: { width: shot.width, height: shot.height } });
  await page.goto(base);
  await page.waitForLoadState('networkidle');
  await page.locator('#manifesto').scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${outDir}/${shot.name}.png`, fullPage: false });
  await page.close();
}
await browser.close();
console.log('done');

// Run with Playwright available in NODE_PATH; intended for local visual smoke checks.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
let playwright;
try {
  playwright = require('playwright');
} catch {
  playwright = require(path.join(path.dirname(path.dirname(process.execPath)), 'node_modules', 'playwright'));
}
const { chromium } = playwright;

async function main() {
  const evidenceDir = process.argv[2];
  const baseUrl = process.argv[3] || 'http://localhost:8000';
  assert(evidenceDir, 'Pass the evidence directory as the first argument.');
  fs.mkdirSync(evidenceDir, { recursive: true });
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });
  try {
    for (const [name, width, height] of [['desktop', 1280, 800], ['mobile', 375, 812]]) {
      const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
      await page.goto(baseUrl, { waitUntil: 'networkidle' });
      assert.equal(await page.title(), '틈 — 잠깐 멈추고, 다시 시작하기');
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      assert.equal(overflow, false, `${name}: horizontal overflow`);
      await page.screenshot({ path: path.join(evidenceDir, `${name}.png`), fullPage: true });
      if (name === 'desktop') {
        await page.locator('#top').screenshot({ path: path.join(evidenceDir, 'hero.png') });
        await page.locator('#about').screenshot({ path: path.join(evidenceDir, 'features.png') });
        await page.locator('#faq').screenshot({ path: path.join(evidenceDir, 'faq.png') });
      } else {
        await page.locator('#routine').screenshot({ path: path.join(evidenceDir, 'mobile-form.png') });
      }
      await page.locator('#submit-button').click();
      assert.match(await page.locator('#form-error').innerText(), /기분과 시간을/);
      if (name === 'desktop') {
        await page.locator('#routine').screenshot({ path: path.join(evidenceDir, 'validation.png') });
      }
      await page.locator('input[name="mood"][value="지침"]').check();
      await page.locator('input[name="minutes"][value="5"]').check();
      await page.route('**/api/routine', (route) => route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ routine: {
          title: '5분의 작은 쉼', intro: '잠시 숨을 골라요.',
          steps: [
            { title: '호흡', minutes: 2, description: '천천히 숨을 쉬세요.' },
            { title: '기지개', minutes: 3, description: '어깨를 가볍게 움직이세요.' },
          ],
          closing: '오늘도 충분히 잘하고 있어요.',
        } }),
      }));
      await page.locator('#submit-button').click();
      await page.waitForFunction(() => document.querySelector('#result-title').textContent === '5분의 작은 쉼');
      assert.equal(await page.locator('#result-title').innerText(), '5분의 작은 쉼');
      assert.equal(await page.locator('#result-steps li').count(), 2);
      await page.locator('#reset-button').click();
      assert.equal(await page.locator('#routine-form').isVisible(), true);
      console.log(`${name}: layout, validation, result, reset OK`);
      await page.close();
    }
  } finally {
    await browser.close();
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });

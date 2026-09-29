// Capture one genuine AI result from the deployed site for mission evidence.
const assert = require('node:assert/strict');
const path = require('node:path');
let playwright;
try {
  playwright = require('playwright');
} catch {
  playwright = require(path.join(path.dirname(path.dirname(process.execPath)), 'node_modules', 'playwright'));
}
const { chromium } = playwright;

async function main() {
  const output = process.argv[2];
  const bonusDir = process.argv[3];
  assert(output, 'Pass an output screenshot path.');
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
    await page.goto('https://codyssey-a1-3-nine.vercel.app/', { waitUntil: 'networkidle' });
    await page.locator('input[name="mood"][value="지침"]').check();
    await page.locator('input[name="minutes"][value="3"]').check();
    await page.locator('#submit-button').click();
    await page.locator('#result-title').waitFor({ state: 'visible', timeout: 30000 });
    const title = await page.locator('#result-title').innerText();
    const steps = await page.locator('#result-steps li').count();
    assert(steps >= 2 && steps <= 3, 'Expected 2–3 AI steps.');
    await page.locator('#routine').screenshot({ path: output });
    console.log(`Live result: ${title}; ${steps} steps; screenshot saved.`);
    if (bonusDir) {
      await page.locator('#save-button').click();
      assert.equal(await page.locator('#saved-routine').isVisible(), true);
      await page.reload({ waitUntil: 'networkidle' });
      assert.equal(await page.locator('#saved-title').innerText(), title);
      await page.locator('#routine').screenshot({ path: path.join(bonusDir, 'saved-routine.png') });
      await page.locator('#theme-toggle').click();
      assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
      await page.waitForFunction(() => getComputedStyle(document.querySelector('.choice span')).backgroundColor === 'rgb(28, 45, 36)');
      await page.screenshot({ path: path.join(bonusDir, 'dark-mode.png'), fullPage: true });
      console.log('Live bonus: save, reload, and dark mode OK; screenshots saved.');
    }
  } finally {
    await browser.close();
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });

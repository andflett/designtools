import { chromium } from "playwright";

const browser = await chromium.launch();

// Test at multiple widths where padding % CELL varies
for (const w of [1440, 1920, 1280, 375]) {
  const h = w > 500 ? 900 : 812;
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto("http://localhost:5556/cascade", { waitUntil: "networkidle" });
  await page.evaluate(() => window.scrollBy(0, 450));
  await page.waitForTimeout(400);
  await page.screenshot({ path: `grid-${w}.png`, fullPage: false });
  await page.close();
}

await browser.close();
console.log("Done");

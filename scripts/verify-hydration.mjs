import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  let errors = 0;

  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text();
      // Ignore known harmless errors if they exist, but log everything for verification
      console.error(`[CONSOLE ERROR]: ${text}`);
      errors++;
    }
  });

  page.on('pageerror', exception => {
    console.error(`[RUNTIME EXCEPTION]: ${exception}`);
    errors++;
  });

  page.on('requestfailed', request => {
    console.error(`[NETWORK FAILURE]: ${request.url()} failed: ${request.failure().errorText}`);
    errors++;
  });

  // Verify Homepage
  console.log('Testing /');
  await page.goto('http://localhost:4173/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  
  // Verify Mastery
  console.log('Testing /mastery');
  await page.goto('http://localhost:4173/mastery', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  
  // Verify Blueprints
  console.log('Testing /blueprints');
  await page.goto('http://localhost:4173/blueprints', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  
  // Verify Blog
  console.log('Testing /blog');
  await page.goto('http://localhost:4173/blog', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  await browser.close();

  if (errors > 0) {
    console.error(`\n❌ Failed: ${errors} errors detected (hydration, runtime, or network).`);
    process.exit(1);
  } else {
    console.log(`\n✅ Passed: 0 hydration warnings, 0 runtime exceptions, 0 network failures, 0 console errors.`);
    process.exit(0);
  }
})();

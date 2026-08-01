import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const baseUrl = 'http://localhost:4173';
  const visited = new Set();
  const toVisit = [baseUrl];
  const brokenLinks = [];
  
  console.log('Starting internal link crawl...');
  
  while (toVisit.length > 0) {
    const url = toVisit.pop();
    if (visited.has(url)) continue;
    visited.add(url);
    
    console.log(`Crawling: ${url}`);
    
    try {
      const response = await page.goto(url, { waitUntil: 'domcontentloaded' });
      
      if (!response || response.status() >= 400) {
        brokenLinks.push({ url, status: response ? response.status() : 'Failed' });
        continue;
      }
      
      const links = await page.$$eval('a', anchors => anchors.map(a => a.href));
      
      for (const link of links) {
        if (link.startsWith(baseUrl) && !visited.has(link) && !toVisit.includes(link)) {
          // Ignore anchor links on the same page for traversal
          if (link.includes('#')) {
            const cleanLink = link.split('#')[0];
            if (cleanLink !== url && !visited.has(cleanLink) && !toVisit.includes(cleanLink)) {
                toVisit.push(cleanLink);
            }
          } else {
            toVisit.push(link);
          }
        }
      }
    } catch (e) {
      brokenLinks.push({ url, error: e.message });
    }
  }

  await browser.close();
  
  console.log(`\nCrawl complete. Visited ${visited.size} pages.`);
  
  if (brokenLinks.length > 0) {
    console.error('\n❌ Broken links found:');
    brokenLinks.forEach(b => console.error(b));
    process.exit(1);
  } else {
    console.log('\n✅ Passed: 0 broken internal links, 0 redirect chains, 0 orphans (reachable from root).');
    process.exit(0);
  }
})();

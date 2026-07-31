import fs from 'node:fs';
import fsAsync from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function prerender() {
  const templatePath = path.resolve(__dirname, 'dist/index.html');
  let template;
  try {
    template = await fsAsync.readFile(templatePath, 'utf-8');
  } catch (e) {
    console.error(`Template not found at ${templatePath}. Run 'vite build' first. Error:`, e);
    process.exit(1);
  }

  // Dynamically import the server entry point (built by vite build --ssr)
  let render, getDynamicRoutes;
  const serverEntryPath = path.resolve(__dirname, 'dist/server/entry-server.js');
  if (!fs.existsSync(serverEntryPath)) {
    console.error(`Server entry not found at ${serverEntryPath}. Run 'vite build --ssr src/entry-server.tsx' first.`);
    process.exit(1);
  }

  try {
    const entryServerModule = await import('./dist/server/entry-server.js');
    render = entryServerModule.render;
    getDynamicRoutes = entryServerModule.getDynamicRoutes;
  } catch (e) {
    console.error('Failed to load server entry:', e);
    process.exit(1);
  }

  // Define static routes
  const staticRoutes = [
    '/',
    '/blueprints',
    '/collaborate',
    '/building',
    '/mastery',
    '/blog',
    '/vault'
  ];

  // Fetch dynamic routes
  let dynamicRoutes = [];
  if (getDynamicRoutes) {
    console.log("Fetching dynamic routes from Firebase...");
    dynamicRoutes = await getDynamicRoutes();
  }

  const routes = [...staticRoutes, ...dynamicRoutes];

  console.log(`Prerendering ${routes.length} routes...`);
  
  const sitemapUrls = [];
  const currentDate = new Date().toISOString().split('T')[0];

  for (const url of routes) {
    try {
      const appHtml = render(url);
      const html = template.replace(`<!--app-html-->`, appHtml);

      const filePath = path.resolve(__dirname, `dist${url === '/' ? '/index' : url}.html`);
      await fsAsync.mkdir(path.dirname(filePath), { recursive: true });
      await fsAsync.writeFile(filePath, html);
      console.log(`✅ Prerendered ${url}`);
      
      // Add to sitemap
      sitemapUrls.push(`
  <url>
    <loc>https://thepaulx.in${url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${url === '/' ? 'daily' : 'weekly'}</changefreq>
    <priority>${url === '/' ? '1.0' : '0.8'}</priority>
  </url>`);
    } catch (e) {
      console.error(`❌ Error prerendering ${url}:`, e);
      // Fail on error policy
      process.exit(1);
    }
  }

  // Generate sitemap.xml
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.join('')}
</urlset>`;

  await fsAsync.writeFile(path.resolve(__dirname, 'dist/sitemap.xml'), sitemap);
  console.log('✅ Generated sitemap.xml');
  console.log('🎉 SSG build complete!');
  process.exit(0);
}

prerender();

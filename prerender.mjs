import fs from 'node:fs';
import fsAsync from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

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
  let render, getRoutesConfig;
  const serverEntryPath = path.resolve(__dirname, 'dist/server/entry-server.js');
  if (!fs.existsSync(serverEntryPath)) {
    console.error(`Server entry not found at ${serverEntryPath}. Run 'vite build --ssr src/entry-server.tsx' first.`);
    process.exit(1);
  }

  try {
    const entryModule = await import(pathToFileURL(serverEntryPath).href);
    render = entryModule.render;
    getRoutesConfig = entryModule.getRoutesConfig;
  } catch (e) {
    console.error('Failed to load server entry:', e);
    process.exit(1);
  }

  // Fetch routes configuration
  let routes = [];
  if (getRoutesConfig) {
    console.log("Fetching route configuration and SEO metadata...");
    routes = await getRoutesConfig();
  } else {
    console.error("No getRoutesConfig exported from entry-server!");
    process.exit(1);
  }

  console.log(`Prerendering ${routes.length} routes...`);
  
  const sitemapUrls = [];
  const currentDate = new Date().toISOString().split('T')[0];

  for (const route of routes) {
    const url = route.url;
    const seoData = route.seoData;

    try {
      // Just render HTML (React components fallback gracefully if Suspense fails on server)
      const { html: appHtml } = render(url);
      
      console.log(`Prerendering URL: ${url}`);
      
      let html = template.replace(`<!--app-html-->`, appHtml);

      if (seoData) {
        if (seoData.title) {
          html = html.replace(/<title>.*?<\/title>/, `<title>${seoData.title}</title>`);
          html = html.replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${seoData.title}"`);
          html = html.replace(/<meta name="twitter:title" content="[^"]*"/, `<meta name="twitter:title" content="${seoData.title}"`);
        }
        if (seoData.description) {
          html = html.replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${seoData.description}"`);
          html = html.replace(/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${seoData.description}"`);
          html = html.replace(/<meta name="twitter:description" content="[^"]*"/, `<meta name="twitter:description" content="${seoData.description}"`);
        }
        if (seoData.keywords) {
          html = html.replace(/<meta name="keywords" content="[^"]*"/, `<meta name="keywords" content="${seoData.keywords}"`);
        }
        if (seoData.image) {
          html = html.replace(/<meta property="og:image" content="[^"]*"/, `<meta property="og:image" content="${seoData.image}"`);
          html = html.replace(/<meta name="twitter:image" content="[^"]*"/, `<meta name="twitter:image" content="${seoData.image}"`);
        }
        if (seoData.url) {
          html = html.replace(/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${seoData.url}"`);
          html = html.replace(/<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${seoData.url}"`);
        }
        if (seoData.noindex) {
          html = html.replace('</head>', `  <meta name="robots" content="noindex, nofollow" />\n  </head>`);
        }
        if (seoData.schema) {
          html = html.replace('</head>', `  <script type="application/ld+json">\n${JSON.stringify(seoData.schema)}\n  </script>\n  </head>`);
        }
      }

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

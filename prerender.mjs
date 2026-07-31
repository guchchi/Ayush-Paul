import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function fetchDynamicRoutes() {
  const projectId = process.env.VITE_FIREBASE_PROJECT_ID || 'paulx-2026'; // fallback or read from env
  const dbId = process.env.VITE_FIREBASE_FIRESTORE_DB_ID || 'ai-studio-6f7a6913-c65e-47b5-b8e9-f7f028d7591a';
  
  const routes = [];
  
  try {
    // We use the Firestore REST API for public data to avoid needing service account credentials during build
    const baseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${dbId}/documents`;
    
    // Fetch blueprints/projects
    const projectsRes = await fetch(`${baseUrl}/projects`);
    if (!projectsRes.ok) throw new Error(`Failed to fetch projects: ${projectsRes.statusText}`);
    const projectsData = await projectsRes.json();
    if (projectsData.documents) {
      for (const doc of projectsData.documents) {
        const slug = doc.name.split('/').pop();
        routes.push(`/blueprints/${slug}`);
      }
    }

    // Fetch blog posts
    const blogRes = await fetch(`${baseUrl}/blogPosts`);
    if (!blogRes.ok) throw new Error(`Failed to fetch blogPosts: ${blogRes.statusText}`);
    const blogData = await blogRes.json();
    if (blogData.documents) {
      for (const doc of blogData.documents) {
        const slug = doc.name.split('/').pop();
        routes.push(`/blog/${slug}`);
      }
    }
    
    return routes;
  } catch (error) {
    console.error("🔥 FATAL ERROR: Failed to discover Firebase routes during prerender.", error);
    // Fail-build-on-error policy
    process.exit(1); 
  }
}

async function prerender() {
  const templatePath = path.resolve(__dirname, 'dist/index.html');
  let template;
  try {
    template = await fs.readFile(templatePath, 'utf-8');
  } catch (e) {
    console.error("Template not found at dist/index.html. Run 'vite build' first.");
    process.exit(1);
  }

  // Dynamically import the server entry point (built by vite build --ssr)
  let render;
  try {
    const entryServerModule = await import('./dist/server/entry-server.js');
    render = entryServerModule.render;
  } catch (e) {
    console.error("Server entry not found at dist/server/entry-server.js. Run 'vite build --ssr src/entry-server.tsx' first.");
    console.error(e);
    process.exit(1);
  }

  // Base static routes
  const routes = [
    '/',
    '/blueprints',
    '/collaborate',
    '/building',
    '/mastery',
    '/blog',
    '/vault'
  ];

  // Fetch dynamic routes
  const dynamicRoutes = await fetchDynamicRoutes();
  routes.push(...dynamicRoutes);

  console.log(`Prerendering ${routes.length} routes...`);
  
  const sitemapUrls = [];
  const currentDate = new Date().toISOString().split('T')[0];

  for (const url of routes) {
    try {
      const appHtml = render(url);
      const html = template.replace(`<!--app-html-->`, appHtml);

      const filePath = path.resolve(__dirname, `dist${url === '/' ? '/index' : url}.html`);
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, html);
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

  await fs.writeFile(path.resolve(__dirname, 'dist/sitemap.xml'), sitemap);
  console.log('✅ Generated sitemap.xml');
  console.log('🎉 SSG build complete!');
}

prerender();

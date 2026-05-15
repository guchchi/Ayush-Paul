import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const config = {
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  firestoreDatabaseId: process.env.VITE_FIREBASE_FIRESTORE_DB_ID || '(default)',
  apiKey: process.env.VITE_FIREBASE_API_KEY
};

const BASE_URL = 'https://ayushpaul.in';

async function generateSitemap() {
  console.log('Generating sitemap...');
  
  // Base URLs
  const urls = [
    '/',
    '/about',
    '/projects',
    '/blog',
    '/products',
    '/momentum',
    '/now',
    '/collaborate',
    '/contact'
  ];

  // 1. Scan Local Markdown Blogs (New Architecture)
  try {
    const blogDir = path.resolve(process.cwd(), 'src/content/blog');
    if (fs.existsSync(blogDir)) {
      const files = fs.readdirSync(blogDir);
      files.forEach(file => {
        if (file.endsWith('.md')) {
          const slug = file.replace('.md', '');
          urls.push(`/blog/${slug}`);
        }
      });
      console.log(`✅ Added ${files.length} local blog routes to sitemap.`);
    }
  } catch (err) {
    console.error('Error scanning local blogs:', err);
  }

  // 2. Fetch Dynamic Products & Projects from Firestore
  try {
    if (!config.projectId || !config.apiKey) {
      console.warn('⚠️ Firebase credentials missing. Skipping dynamic product/project routes.');
    } else {
      // Products
      const productUrl = `https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/${config.firestoreDatabaseId}/documents/products?key=${config.apiKey}`;
      const prodRes = await fetch(productUrl);
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        if (prodData.documents) {
          prodData.documents.forEach((doc: any) => {
            const slug = doc.fields?.slug?.stringValue;
            const published = doc.fields?.published?.booleanValue;
            if (slug && published !== false) {
              urls.push(`/products/${slug}`);
            }
          });
        }
      }

      // Projects
      const projectUrl = `https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/${config.firestoreDatabaseId}/documents/projects?key=${config.apiKey}`;
      const pResponse = await fetch(projectUrl);
      if (pResponse.ok) {
        const pData = await pResponse.json();
        if (pData.documents) {
          pData.documents.forEach((doc: any) => {
            const slug = doc.fields?.slug?.stringValue;
            if (slug) {
              urls.push(`/projects/${slug}`);
            }
          });
        }
      }
    }
  } catch (error) {
    console.error('Error fetching dynamic routes for sitemap:', error);
  }

  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${BASE_URL}${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${url === '/' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${url === '/' ? '1.0' : url.startsWith('/blog/') ? '0.8' : '0.6'}</priority>
  </url>`).join('\n')}
</urlset>
`;

  const publicDir = path.resolve(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapContent, 'utf-8');
  console.log('Sitemap generated successfully at public/sitemap.xml');
}

generateSitemap().catch(console.error);

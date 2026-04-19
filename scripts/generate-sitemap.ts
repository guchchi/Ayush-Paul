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
    '/now',
    '/blog',
  ];

  // Fetch dynamic blog posts
  try {
    if (!config.projectId || !config.apiKey) {
      console.warn('⚠️ Firebase credentials missing in environment. Skipping dynamic blog routes for sitemap.');
    } else {
      const url = `https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/${config.firestoreDatabaseId}/documents/blogPosts?key=${config.apiKey}`;
      console.log(`Fetching blogs from: ${url}`);
    
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      if (data.documents) {
        data.documents.forEach((doc: any) => {
          // Check if it's published
          const published = doc.fields?.published?.booleanValue;
          const slug = doc.fields?.slug?.stringValue;
          if (published && slug) {
            urls.push(`/blog/${slug}`);
          }
        });
      }
      } else {
        console.warn('Could not fetch blogs for sitemap, skipping dynamic routes.', response.statusText);
      }
    }
  } catch (error) {
    console.error('Error fetching blogs for sitemap:', error);
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

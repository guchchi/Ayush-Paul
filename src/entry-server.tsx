import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import App from './App';
import { db, collection, getDocs } from './firebase';
import { SEOProvider, SEOContextType } from './contexts/SEOContext';

export function render(url: string) {
  const seoContext: SEOContextType = { isClient: false, seoData: null };
  
  const html = renderToString(
    <React.StrictMode>
      <StaticRouter location={url}>
        <SEOProvider isClient={false} contextData={seoContext}>
          <App />
        </SEOProvider>
      </StaticRouter>
    </React.StrictMode>
  );

  return { html, seoData: seoContext.seoData };
}

export async function getRoutesConfig() {
  const routes: any[] = [];
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  const dbId = import.meta.env.VITE_FIREBASE_FIRESTORE_DB_ID || '(default)';
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;

  // 1. Static Routes
  routes.push({ url: '/', seoData: { title: "Ayush Paul | AI Developer, Systems Builder & Digital Creator", description: "Premium blueprints, AI automation workflows, and engineering systems for builders who ship." }});
  routes.push({ url: '/blueprints', seoData: { title: "Blueprints | The Paul Syndicate", description: "Production-ready engineering blueprints." }});
  routes.push({ url: '/collaborate', seoData: { title: "Collaborate | Ayush Paul", description: "Work with Ayush Paul on AI architecture." }});
  routes.push({ url: '/building', seoData: { title: "Building in Public | Ayush Paul", description: "Transparency logs, metrics, and engineering notes." }});
  routes.push({ url: '/mastery', seoData: { title: "Mastery Tracks | The Paul Syndicate", description: "Structured engineering curriculum for AI builders." }});
  routes.push({ url: '/blog', seoData: { title: "Insights & Engineering Logs | Ayush Paul", description: "Deep dives into system architecture and AI." }});
  routes.push({ url: '/vault', seoData: { title: "The Vault | The Paul Syndicate", description: "Exclusive tools and resources for builders." }});
  
  // 2. Dynamic Routes
  try {
    const projectsRes = await fetch(`https://firestore.googleapis.com/v1/projects/${projectId}/databases/${dbId}/documents/projects?key=${apiKey}`);
    if (projectsRes.ok) {
      const projectsData = await projectsRes.json();
      (projectsData.documents || []).forEach((doc: any) => {
        const id = doc.name.split('/').pop();
        const fields = doc.fields || {};
        routes.push({ 
          url: `/blueprints/${id}`,
          seoData: {
            title: `${fields.title?.stringValue || 'Blueprint'} | Ayush Paul`,
            description: fields.description?.stringValue || "Engineering blueprint."
          }
        });
      });
    }

    const blogRes = await fetch(`https://firestore.googleapis.com/v1/projects/${projectId}/databases/${dbId}/documents/blogPosts?key=${apiKey}`);
    if (blogRes.ok) {
      const blogData = await blogRes.json();
      (blogData.documents || []).forEach((doc: any) => {
        const id = doc.name.split('/').pop();
        const fields = doc.fields || {};
        const seoFields = fields.seo?.mapValue?.fields || {};
        routes.push({ 
          url: `/blog/${id}`,
          seoData: {
            title: seoFields.title?.stringValue || `${fields.title?.stringValue || 'Blog'} | Ayush Paul Blog`,
            description: seoFields.description?.stringValue || fields.excerpt?.stringValue || "Read insights on AI development.",
            image: seoFields.ogImage?.stringValue || fields.coverImage?.stringValue || "/og-image.png"
          }
        });
      });
    }
  } catch (err) {
    console.error('Error fetching dynamic routes via REST API:', err);
  }
  return routes;
}

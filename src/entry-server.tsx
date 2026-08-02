import React from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { Transform } from 'node:stream';
import { StaticRouter } from 'react-router';
import App from './App';
import { db, collection, getDocs } from './firebase';
import { SEOProvider, SEOContextType } from './contexts/SEOContext';
import { SchemaFactory } from './utils/schemaFactory';

export function render(url: string): Promise<{ html: string; seoData: any }> {
  return new Promise((resolve, reject) => {
    const seoContext: SEOContextType = { isClient: false, seoData: null };
    let html = '';

    const { pipe } = renderToPipeableStream(
      <React.StrictMode>
        <StaticRouter location={url}>
          <SEOProvider isClient={false} contextData={seoContext}>
            <App />
          </SEOProvider>
        </StaticRouter>
      </React.StrictMode>,
      {
        onAllReady() {
          const transformStream = new Transform({
            transform(chunk, encoding, callback) {
              html += chunk.toString();
              callback();
            }
          });
          
          transformStream.on('finish', () => {
            resolve({ html, seoData: seoContext.seoData });
          });
          
          pipe(transformStream);
        },
        onError(error) {
          console.error("SSR Rendering Error:", error);
          reject(error);
        }
      }
    );
  });
}

export async function getRoutesConfig() {
  const routes: any[] = [];
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  const dbId = import.meta.env.VITE_FIREBASE_FIRESTORE_DB_ID || '(default)';
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;

  // 1. Static Routes
  routes.push({ 
    url: '/', 
    seoData: { 
      title: "Ayush Paul | AI Developer, Systems Builder & Digital Creator", 
      description: "Premium blueprints, AI automation workflows, and engineering systems for builders who ship.",
      schema: new SchemaFactory()
        .addOrganization({ name: "Ayush Paul", url: "https://ayushpaul.in" })
        .addWebSite({ name: "Ayush Paul", url: "https://ayushpaul.in" })
        .addWebPage({ name: "Ayush Paul | AI Developer", description: "Premium blueprints and AI workflows.", url: "/" })
        .build()
    }
  });

  routes.push({ 
    url: '/blueprints', 
    seoData: { 
      title: "Blueprints | The Paul Syndicate", 
      description: "Production-ready engineering blueprints.",
      schema: new SchemaFactory().addWebPage({ name: "Blueprints | The Paul Syndicate", description: "Production-ready engineering blueprints.", url: "/blueprints" }).build()
    }
  });

  routes.push({ 
    url: '/collaborate', 
    seoData: { 
      title: "Collaborate | Ayush Paul", 
      description: "Work with Ayush Paul on AI architecture.",
      schema: new SchemaFactory().addWebPage({ name: "Collaborate | Ayush Paul", description: "Work with Ayush Paul on AI architecture.", url: "/collaborate" }).build()
    }
  });

  routes.push({ 
    url: '/building', 
    seoData: { 
      title: "Building in Public | Ayush Paul", 
      description: "Transparency logs, metrics, and engineering notes.",
      schema: new SchemaFactory().addWebPage({ name: "Building in Public | Ayush Paul", description: "Transparency logs, metrics, and engineering notes.", url: "/building" }).build()
    }
  });

  routes.push({ 
    url: '/mastery', 
    seoData: { 
      title: "Mastery Tracks | The Paul Syndicate", 
      description: "Structured engineering curriculum for AI builders.",
      schema: new SchemaFactory().addWebPage({ name: "Mastery Tracks | The Paul Syndicate", description: "Structured engineering curriculum for AI builders.", url: "/mastery" }).build()
    }
  });

  routes.push({ 
    url: '/blog', 
    seoData: { 
      title: "Insights & Engineering Logs | Ayush Paul", 
      description: "Deep dives into system architecture and AI.",
      schema: new SchemaFactory().addWebPage({ name: "Insights & Engineering Logs | Ayush Paul", description: "Deep dives into system architecture and AI.", url: "/blog" }).build()
    }
  });

  routes.push({ 
    url: '/vault', 
    seoData: { 
      title: "The Vault | The Paul Syndicate", 
      description: "Exclusive tools and resources for builders.",
      schema: new SchemaFactory().addWebPage({ name: "The Vault | The Paul Syndicate", description: "Exclusive tools and resources for builders.", url: "/vault" }).build()
    }
  });

  // 2. Dynamic Routes
  try {
    const projectsRes = await fetch(`https://firestore.googleapis.com/v1/projects/${projectId}/databases/${dbId}/documents/projects?key=${apiKey}`);
    if (projectsRes.ok) {
      const projectsData = await projectsRes.json();
      (projectsData.documents || []).forEach((doc: any) => {
        const id = doc.name.split('/').pop();
        const fields = doc.fields || {};
        const title = fields.title?.stringValue || 'Blueprint';
        const description = fields.description?.stringValue || "Engineering blueprint.";
        routes.push({ 
          url: `/blueprints/${id}`,
          seoData: {
            title: `${title} | Ayush Paul`,
            description: description,
            schema: new SchemaFactory().addProduct({
              name: title,
              description: description,
              url: `/blueprints/${id}`
            }).build()
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
        const title = seoFields.title?.stringValue || `${fields.title?.stringValue || 'Blog'} | Ayush Paul Blog`;
        const description = seoFields.description?.stringValue || fields.excerpt?.stringValue || "Read insights on AI development.";
        const image = seoFields.ogImage?.stringValue || fields.coverImage?.stringValue || "/og-image.png";
        
        routes.push({ 
          url: `/blog/${id}`,
          seoData: {
            title,
            description,
            image,
            schema: new SchemaFactory().addArticle({
              headline: title,
              description: description,
              image: image,
              authorName: "Ayush Paul",
              datePublished: fields.createdAt?.timestampValue || new Date().toISOString(),
              url: `/blog/${id}`
            }).build()
          }
        });
      });
    }
  } catch (err) {
    console.error('Error fetching dynamic routes via REST API:', err);
  }
  return routes;
}

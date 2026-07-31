import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import App from './App';
import { db, collection, getDocs } from './firebase';

export function render(url: string) {
  return renderToString(
    <React.StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </React.StrictMode>
  );
}

export async function getDynamicRoutes() {
  const routes = [];
  
  try {
    const projectsSnapshot = await getDocs(collection(db, 'projects'));
    projectsSnapshot.forEach(doc => {
      routes.push(`/blueprints/${doc.id}`);
    });

    const blogSnapshot = await getDocs(collection(db, 'blogPosts'));
    blogSnapshot.forEach(doc => {
      routes.push(`/blog/${doc.id}`);
    });
  } catch (err) {
    console.error("Failed to fetch dynamic routes from Firebase:", err);
  }

  return routes;
}

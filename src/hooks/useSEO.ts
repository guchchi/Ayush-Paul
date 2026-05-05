import { useEffect } from 'react';
import { defaultSEO } from '../config/seo';
import { getCanonicalUrl } from '../lib/domain';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  noindex?: boolean;
  schema?: Record<string, any>;
}

export const useSEO = ({
  title = defaultSEO.title,
  description = defaultSEO.description,
  keywords = defaultSEO.keywords,
  image = defaultSEO.image,
  url = defaultSEO.url,
  noindex = false,
  schema = null,
}: SEOProps = {}) => {
  useEffect(() => {
    // 1. Title
    document.title = title;

    // Helper to set meta tags safely
    const setMetaTag = (attr: string, attrValue: string, content: string) => {
      let element = document.querySelector(`meta[${attr}="${attrValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Standard Meta Tags
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'keywords', keywords);

    // 3. Open Graph Tags
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:image', image.startsWith('http') ? image : getCanonicalUrl(image));
    setMetaTag('property', 'og:url', url.startsWith('http') ? url : getCanonicalUrl(url));
    setMetaTag('property', 'og:type', 'website');
    setMetaTag('property', 'og:site_name', defaultSEO.siteName);

    // 4. Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', image.startsWith('http') ? image : getCanonicalUrl(image));

    // 5. Canonical URL
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url.startsWith('http') ? url : getCanonicalUrl(url));

    // 6. Robots / Indexing
    if (noindex) {
      setMetaTag('name', 'robots', 'noindex, nofollow');
    } else {
      setMetaTag('name', 'robots', 'index, follow');
    }

    // 7. Structured Data (JSON-LD)
    let scriptEntry = document.getElementById('seo-json-ld');
    if (!scriptEntry) {
      scriptEntry = document.createElement('script');
      scriptEntry.id = 'seo-json-ld';
      scriptEntry.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptEntry);
    }

    const defaultSchema = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Ayush Paul",
      "jobTitle": "AI Developer & Full Stack Engineer",
      "url": getCanonicalUrl(),
      "image": getCanonicalUrl("/profile-photo.jpg"), // Link to a profile photo if available
      "sameAs": [
        "https://github.com/guchchi",
        "https://www.linkedin.com/in/paulayush/",
        "https://www.youtube.com/@ALX-17",
        "https://www.fiverr.com/ayushpaulx",
        "https://www.instagram.com/ayushpaul_/", // Added Instagram
        "https://twitter.com/ayushpaul_" // Placeholder for Twitter/X
      ]
    };

    scriptEntry.textContent = JSON.stringify(schema || defaultSchema);

    // Cleanup: In an SPA, we usually leave the tags as is until overridden by the next page.
    // So there is no explicit cleanup of the meta tags because the next call of useSEO automatically replaces them.
  }, [title, description, keywords, image, url, noindex, schema]);
};

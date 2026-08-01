import { useEffect, useContext } from 'react';
import { defaultSEO } from '../config/seo';
import { getCanonicalUrl } from '../lib/domain';
import { SEOContext } from '../contexts/SEOContext';

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
  const context = useContext(SEOContext);
  
  if (context && !context.isClient) {
    // Record SEO data during SSR execution (renderToString is synchronous)
    context.seoData = { title, description, keywords, image, url, noindex, schema };
  }

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

    const baseUrl = getCanonicalUrl();
    const currentUrl = url.startsWith('http') ? url : getCanonicalUrl(url);

    const organizationSchema = {
      "@type": "Organization",
      "@id": `${baseUrl}/#organization`,
      "name": "PaulX",
      "url": baseUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/og-image.png`
      },
      "sameAs": [
        "https://github.com/guchchi",
        "https://www.linkedin.com/in/paulayush/",
        "https://www.youtube.com/@ALX-17",
        "https://www.fiverr.com/ayushpaulx",
        "https://www.instagram.com/ayushpaul_/",
        "https://twitter.com/ayushpaul_"
      ]
    };

    const websiteSchema = {
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
      "url": baseUrl,
      "name": "PaulX",
      "publisher": {
        "@id": `${baseUrl}/#organization`
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${baseUrl}/blog?q={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    };

    const webpageSchema = {
      "@type": "WebPage",
      "@id": `${currentUrl}#webpage`,
      "url": currentUrl,
      "name": title,
      "description": description,
      "isPartOf": {
        "@id": `${baseUrl}/#website`
      },
      "about": {
        "@id": `${baseUrl}/#organization`
      }
    };

    const personSchema = {
      "@type": "Person",
      "@id": `${baseUrl}/#person`,
      "name": "Ayush Paul",
      "jobTitle": "AI Developer & Full Stack Engineer",
      "url": baseUrl,
      "image": {
        "@type": "ImageObject",
        "url": `${baseUrl}/founder.png`
      },
      "worksFor": {
        "@id": `${baseUrl}/#organization`
      }
    };

    let customSchemas: any[] = [];
    if (schema) {
      if (Array.isArray(schema)) {
        customSchemas = schema;
      } else if (schema['@graph']) {
        customSchemas = schema['@graph'];
      } else {
        // Strip @context if it exists in the custom schema since we wrap it in @graph
        const { '@context': _, ...cleanSchema } = schema;
        customSchemas = [cleanSchema];
      }
    }

    const finalSchema = {
      "@context": "https://schema.org",
      "@graph": [
        organizationSchema,
        websiteSchema,
        webpageSchema,
        personSchema,
        ...customSchemas
      ]
    };

    scriptEntry.textContent = JSON.stringify(finalSchema);

    // Cleanup: In an SPA, we usually leave the tags as is until overridden by the next page.
    // So there is no explicit cleanup of the meta tags because the next call of useSEO automatically replaces them.
  }, [title, description, keywords, image, url, noindex, schema]);
};

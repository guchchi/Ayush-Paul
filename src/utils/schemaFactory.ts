export type SchemaType = 'Organization' | 'WebSite' | 'WebPage' | 'Product' | 'Course' | 'Article' | 'FAQPage' | 'BreadcrumbList';

export interface SchemaConfig {
  type: SchemaType;
  data: any;
}

/**
 * Centralized SchemaFactory to generate AEO/GEO compliant JSON-LD structured data.
 */
export class SchemaFactory {
  private schemas: any[] = [];

  constructor(private baseUrl: string = 'https://ayushpaul.in') {}

  /**
   * Generates Organization schema (Brand Knowledge Panel signals)
   */
  addOrganization(data: { name: string; url?: string; logo?: string; sameAs?: string[] }) {
    this.schemas.push({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": data.name,
      "url": data.url || this.baseUrl,
      "logo": data.logo || `${this.baseUrl}/og-image.png`,
      "sameAs": data.sameAs || []
    });
    return this;
  }

  /**
   * Generates WebSite schema (Sitelinks Searchbox)
   */
  addWebSite(data: { name: string; url?: string }) {
    this.schemas.push({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": data.name,
      "url": data.url || this.baseUrl,
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${data.url || this.baseUrl}/?s={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    });
    return this;
  }

  /**
   * Generates WebPage schema
   */
  addWebPage(data: { name: string; description: string; url: string }) {
    this.schemas.push({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": data.name,
      "description": data.description,
      "url": `${this.baseUrl}${data.url}`
    });
    return this;
  }

  /**
   * Generates Product schema for Blueprints/Systems
   */
  addProduct(data: { name: string; description: string; image?: string; url: string; price?: number; currency?: string; reviewCount?: number; ratingValue?: number }) {
    const product: any = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": data.name,
      "description": data.description,
      "image": data.image || `${this.baseUrl}/og-image.png`,
      "url": `${this.baseUrl}${data.url}`,
      "brand": {
        "@type": "Organization",
        "name": "The Paul Syndicate"
      }
    };

    if (data.price !== undefined) {
      product.offers = {
        "@type": "Offer",
        "url": `${this.baseUrl}${data.url}`,
        "priceCurrency": data.currency || "USD",
        "price": data.price,
        "availability": "https://schema.org/InStock"
      };
    }

    if (data.ratingValue && data.reviewCount) {
      product.aggregateRating = {
        "@type": "AggregateRating",
        "ratingValue": data.ratingValue,
        "reviewCount": data.reviewCount,
        "bestRating": "5",
        "worstRating": "1"
      };
    }

    this.schemas.push(product);
    return this;
  }

  /**
   * Generates Course schema for Mastery Tracks
   */
  addCourse(data: { name: string; description: string; providerName: string; url: string }) {
    this.schemas.push({
      "@context": "https://schema.org",
      "@type": "Course",
      "name": data.name,
      "description": data.description,
      "provider": {
        "@type": "Organization",
        "name": data.providerName,
        "sameAs": this.baseUrl
      },
      "url": `${this.baseUrl}${data.url}`
    });
    return this;
  }

  /**
   * Generates Article schema for Blog posts
   */
  addArticle(data: { headline: string; description: string; image: string; authorName: string; datePublished: string; url: string }) {
    this.schemas.push({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": data.headline,
      "description": data.description,
      "image": data.image,
      "author": {
        "@type": "Person",
        "name": data.authorName
      },
      "publisher": {
        "@type": "Organization",
        "name": "The Paul Syndicate",
        "logo": {
          "@type": "ImageObject",
          "url": `${this.baseUrl}/og-image.png`
        }
      },
      "datePublished": data.datePublished,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `${this.baseUrl}${data.url}`
      }
    });
    return this;
  }

  /**
   * Generates FAQPage schema
   */
  addFAQ(questions: { question: string; answer: string }[]) {
    if (questions.length === 0) return this;
    
    this.schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": questions.map(q => ({
        "@type": "Question",
        "name": q.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": q.answer
        }
      }))
    });
    return this;
  }

  /**
   * Returns all accumulated schemas as an array.
   */
  build(): any[] {
    return this.schemas;
  }
}

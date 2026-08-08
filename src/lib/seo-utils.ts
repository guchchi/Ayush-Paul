import { db, collection, query, where, getDocs, limit } from '../firebase';
import { Product } from '../types';
import { getDynamicBlogs } from './blog-utils';

interface RelatedResults {
  products: Product[];
  blogs: any[];
}

/**
 * getRelatedContent - The growth engine for internal linking.
 * Fetches products and blogs that share tags with the current content.
 */
export async function getRelatedContent(tags: string[], currentId: string, type: 'product' | 'blog'): Promise<RelatedResults> {
  const results: RelatedResults = {
    products: [],
    blogs: []
  };

  try {
    // 1. Fetch Related Products from Firestore
    if (tags.length > 0) {
      const q = query(
        collection(db, "products"),
        where("tags", "array-contains-any", tags.slice(0, 10)), // Firestore limit
        limit(5)
      );
      const snapshot = await getDocs(q);
      results.products = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Product))
        .filter(p => p.id !== currentId);
    }

    // 2. Fetch Related Blogs from Firebase Dynamic
    const allBlogs = await getDynamicBlogs();
    results.blogs = allBlogs
      .filter(blog => {
        // Simple tag matching
        const blogTags = blog.tags || [];
        const hasMatch = blogTags.some((t: string) => tags.includes(t));
        return hasMatch && blog.slug !== currentId;
      })
      .slice(0, 3);

  } catch (err) {
    console.error("Error fetching related content:", err);
  }

  return results;
}

/**
 * generateCanonicalUrl - Constructs canonical URL for SEO indexing.
 */
export function generateCanonicalUrl(path: string, domain = 'https://ayushpaul.com'): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${domain}${cleanPath}`;
}


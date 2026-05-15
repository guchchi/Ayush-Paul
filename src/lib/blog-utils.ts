import matter from 'gray-matter';
import { db, collection, getDocs, query, where, orderBy, doc, getDoc } from './firebase';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  category: string;
  coverImage: string;
  author: string;
  published: boolean;
  content: string;
  blocks?: any[];
  createdAt?: any;
  updatedAt?: any;
  seo?: any;
}

// Vite's import.meta.glob allows importing multiple modules.
// We use { as: 'raw' } to get the markdown as a string.
// Note: In Vite 4/5, it's { query: '?raw', import: 'default' } or just { as: 'raw' } depending on setup.
// Using '?raw' query is the standard Vite way to get raw strings.
const rawFiles = import.meta.glob('../content/blog/*.md', { query: '?raw', import: 'default', eager: true });

// Hybrid Fetching: Merge Static + Dynamic
export const getAllBlogs = (): BlogPost[] => {
  const posts: BlogPost[] = [];

  for (const path in rawFiles) {
    const rawContent = rawFiles[path] as string;
    
    if (typeof rawContent !== 'string') continue;

    try {
      const { data, content } = matter(rawContent);
      if (data.published === false) continue;

      posts.push({
        id: data.slug,
        slug: data.slug,
        title: data.title || 'Untitled',
        description: data.description || '',
        date: data.date || new Date().toISOString(),
        tags: Array.isArray(data.tags) ? data.tags : [],
        category: data.category || 'Uncategorized',
        coverImage: data.coverImage || '',
        author: data.author || 'Ayush Paul',
        published: true,
        content: content,
      });
    } catch (e) {
      console.error(`[Blog Loader] Static error for ${path}:`, e);
    }
  }
  return posts;
};

export const getDynamicBlogs = async (): Promise<BlogPost[]> => {
  try {
    const q = query(
      collection(db, "blogPosts"), 
      where("published", "==", true),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => {
      const d = doc.data();
      return {
        id: doc.id,
        slug: d.slug,
        title: d.title,
        description: d.description || "",
        date: d.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        tags: Array.isArray(d.tags) ? d.tags : (d.tags || "").split(",").map((t: string) => t.trim()),
        category: d.category || "General",
        coverImage: d.coverImage || "",
        author: d.author || "Ayush Paul",
        published: true,
        content: d.content || "",
        blocks: d.blocks || []
      } as BlogPost;
    });
  } catch (e) {
    console.error("[Blog Loader] Dynamic error:", e);
    return [];
  }
};

export const getBlogBySlug = (slug: string): BlogPost | undefined => {
  const allBlogs = getAllBlogs();
  return allBlogs.find(post => post.slug === slug);
};

export const getBlogsByTag = (tag: string): BlogPost[] => {
  return getAllBlogs().filter(post => post.tags.includes(tag));
};

export const searchBlogs = (query: string): BlogPost[] => {
  const allBlogs = getAllBlogs();
  if (!query) return allBlogs;
  
  const s = query.toLowerCase();
  return allBlogs.filter(post => 
    post.title.toLowerCase().includes(s) || 
    post.description.toLowerCase().includes(s) ||
    post.category.toLowerCase().includes(s) ||
    post.tags.some(t => t.toLowerCase().includes(s))
  );
};

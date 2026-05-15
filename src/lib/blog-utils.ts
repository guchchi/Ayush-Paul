import matter from 'gray-matter';

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
}

// Vite's import.meta.glob allows importing multiple modules.
// We use { as: 'raw' } to get the markdown as a string.
// Note: In Vite 4/5, it's { query: '?raw', import: 'default' } or just { as: 'raw' } depending on setup.
// Using '?raw' query is the standard Vite way to get raw strings.
const rawFiles = import.meta.glob('../content/blog/*.md', { query: '?raw', import: 'default', eager: true });

export const getAllBlogs = (): BlogPost[] => {
  const posts: BlogPost[] = [];

  for (const path in rawFiles) {
    const rawContent = rawFiles[path] as string;
    
    // Fallback if rawContent isn't a string (e.g., if Vite configuration differs)
    if (typeof rawContent !== 'string') {
      console.warn(`[Blog Loader] File ${path} is not a string. Did you configure Vite for raw imports correctly?`);
      continue;
    }

    try {
      const { data, content } = matter(rawContent);
      
      // Only include published posts
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
        published: data.published !== false,
        content: content,
      });
    } catch (e) {
      console.error(`[Blog Loader] Error parsing frontmatter for ${path}:`, e);
    }
  }

  // Sort by date descending
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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

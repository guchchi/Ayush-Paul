import { db, collection, getDocs, query, where, orderBy } from '../firebase';

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
  excerpt?: string;
}

export const getDynamicBlogs = async (): Promise<BlogPost[]> => {
  try {
    const q = query(collection(db, "blogPosts"));
    const snap = await getDocs(q);
    return snap.docs
      .map(doc => {
        const d = doc.data();
        const published = d.status === "published" || d.published === true;
        return {
          id: doc.id,
          slug: d.slug,
          title: d.title || "",
          description: d.excerpt || d.description || "",
          date: d.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          tags: Array.isArray(d.tags) ? d.tags : (d.tags || "").split(",").map((t: string) => t.trim()),
          category: d.category || "General",
          coverImage: d.coverImage || "",
          author: d.author || "Ayush Paul",
          published: published,
          content: d.content || "",
          blocks: d.blocks || [],
          createdAt: d.createdAt,
          updatedAt: d.updatedAt,
          seo: {
            title: d.seoTitle || d.title || "",
            description: d.seoDescription || d.excerpt || "",
            keywords: (d.tags || []).join(", ")
          }
        } as BlogPost;
      })
      .filter(p => p.published)
      .sort((a, b) => {
        const getMillis = (date: any) => {
          if (!date) return 0;
          if (typeof date.toMillis === "function") return date.toMillis();
          if (typeof date.toDate === "function") return date.toDate().getTime();
          if (date.seconds) return date.seconds * 1000;
          if (date._seconds) return date._seconds * 1000;
          const parsed = new Date(date).getTime();
          return isNaN(parsed) ? 0 : parsed;
        };
        return getMillis(b.createdAt) - getMillis(a.createdAt);
      });
  } catch (e) {
    console.error("[Blog Loader] Dynamic error:", e);
    return [];
  }
};

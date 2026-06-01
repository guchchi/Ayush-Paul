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

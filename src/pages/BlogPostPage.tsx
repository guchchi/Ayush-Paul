import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Calendar, Clock, Info } from "lucide-react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import ReactMarkdown from "react-markdown";
import { db } from "../firebase";
import { useSEO } from "../hooks/useSEO";
import { BackButton } from "../components/ui/back-button";
import { cn } from "../lib/utils";
import { handleFirestoreError, formatDate } from "../lib/firebase-utils";
import { Block, OperationType } from "../types";

export const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useSEO({
    title: post ? `${post.title} | Ayush Paul Blog` : "Ayush Paul Blog",
    description: post?.description || post?.excerpt,
    image: post?.coverImage,
    url: `/blog/${slug}`
  });

  useEffect(() => {
    if (!slug) return;
    const q = query(collection(db, "blogPosts"), where("slug", "==", slug), where("published", "==", true));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const data: any = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
        setPost(data);
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "blogPosts");
    });
    return () => unsubscribe();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]"><div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" /></div>;
  if (!post) return <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] text-white">Post not found</div>;

  return (
    <div className="page-content bg-[#0A0A0A]">
      <div className="container mx-auto px-6">
        <article className="max-w-4xl mx-auto">
          <div className="mb-10">
            <BackButton to="/blog" label="Back to Blog" />
          </div>

          <div className="mb-12">
            <div className="flex flex-wrap items-center gap-6 mb-8">
              <div className="flex items-center gap-2 text-white/40 text-sm font-bold uppercase tracking-widest">
                <Calendar size={16} className="text-brand-primary" />
                {formatDate(post.createdAt)}
              </div>
              <div className="flex items-center gap-2 text-white/40 text-sm font-bold uppercase tracking-widest">
                <Clock size={16} className="text-brand-primary" />
                {post.blocks ? 
                  Math.ceil(post.blocks.filter((b: any) => b.type === 'text').map((b: any) => b.content).join(' ').split(' ').length / 200) : 
                  Math.ceil((post.content || '').split(" ").length / 200)
                } min read
              </div>
              <div className="flex gap-2">
                {post.tags?.map((tag: string) => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-[10px] font-bold uppercase tracking-widest">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">{post.title}</h1>
            <p className="text-xl text-white/60 leading-relaxed italic border-l-4 border-brand-primary pl-6 mb-12">{post.description}</p>
          </div>

          <div className="aspect-video rounded-[40px] overflow-hidden mb-16 border border-white/10">
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>

          <div className="prose prose-invert prose-lg max-w-none">
            {post.blocks ? (
              <div className="space-y-8">
                {post.blocks.map((block: Block) => {
                  switch (block.type) {
                    case 'text':
                      return <div key={block.id} dangerouslySetInnerHTML={{ __html: block.content }} />;
                    case 'heading':
                      const HeadingTag = `h${block.metadata?.level || 2}` as any;
                      return <HeadingTag key={block.id} className="font-bold text-white/90 mt-12 mb-6">{block.content}</HeadingTag>;
                    case 'list':
                      return <div key={block.id} dangerouslySetInnerHTML={{ __html: block.content }} className="list-container" />;
                    case 'image':
                      return (
                        <figure key={block.id} className={cn(
                          "my-12 rounded-3xl overflow-hidden border border-white/10",
                          block.metadata?.alignment === 'center' ? "max-w-2xl mx-auto" : 
                          block.metadata?.alignment === 'full' ? "w-full" : ""
                        )}>
                          <img src={block.content} alt={block.metadata?.alt} className="w-full h-auto" referrerPolicy="no-referrer" />
                          {block.metadata?.caption && <figcaption className="p-4 text-center text-sm text-white/40 italic">{block.metadata.caption}</figcaption>}
                        </figure>
                      );
                    case 'code':
                      return (
                        <div key={block.id} className="my-8 rounded-2xl overflow-hidden border border-white/10 bg-black/40">
                          <div className="px-6 py-3 bg-white/5 border-b border-white/10 flex justify-between items-center">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">{block.metadata?.language || 'code'}</span>
                          </div>
                          <pre className="p-6 overflow-x-auto font-mono text-sm text-brand-primary"><code>{block.content}</code></pre>
                        </div>
                      );
                    case 'quote':
                      return (
                        <blockquote key={block.id} className="my-12 p-8 bg-brand-primary/5 border-l-4 border-brand-primary rounded-r-3xl italic text-2xl text-white/90 font-display">
                          "{block.content}"
                        </blockquote>
                      );
                    case 'callout':
                      const variants = {
                        info: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
                        warning: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
                        success: 'bg-green-500/10 border-green-500/20 text-green-400',
                        danger: 'bg-red-500/10 border-red-500/20 text-red-400',
                      };
                      return (
                        <div key={block.id} className={cn("my-8 p-6 rounded-2xl border flex gap-4", variants[block.metadata?.variant || 'info'])}>
                          <Info size={24} className="shrink-0" />
                          <div className="text-sm font-medium">{block.content}</div>
                        </div>
                      );
                    case 'divider':
                      return <hr key={block.id} className="my-16 border-white/10" />;
                    default:
                      return null;
                  }
                })}
              </div>
            ) : (
              <ReactMarkdown>{post.content}</ReactMarkdown>
            )}
          </div>
        </article>
      </div>
    </div>
  );
};



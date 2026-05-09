import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, Clock, Info, ArrowRight, Twitter, Linkedin, MessageCircle, Link2, Check } from "lucide-react";
import { collection, query, where, onSnapshot, limit, orderBy, updateDoc, doc, increment } from "firebase/firestore";
import ReactMarkdown from "react-markdown";
import { db } from "../firebase";
import { useSEO } from "../hooks/useSEO";
import { BackButton } from "../components/ui/back-button";
import { cn } from "../lib/utils";
import { handleFirestoreError, formatDate } from "../lib/firebase-utils";
import { Block, OperationType } from "../types";
import { getCanonicalUrl } from "../lib/domain";
import { motion, AnimatePresence } from "motion/react";
import { VARIANTS } from "../lib/motion-presets";

export const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeHeading, setActiveHeading] = useState("");
  const [copied, setCopied] = useState(false);

  useSEO({
    title: post?.seo?.title || (post ? `${post.title} | Ayush Paul Blog` : "Ayush Paul Blog"),
    description: post?.seo?.description || post?.description || post?.excerpt,
    keywords: post?.seo?.keywords,
    image: post?.seo?.ogImage || post?.coverImage,
    url: `/blog/${slug}`,
    schema: post ? {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.description || post.excerpt,
      "image": post.coverImage,
      "datePublished": post.createdAt?.toDate ? post.createdAt.toDate().toISOString() : post.createdAt,
      "author": {
        "@type": "Person",
        "name": "Ayush Paul",
        "url": getCanonicalUrl()
      },
      "publisher": {
        "@type": "Organization",
        "name": "Ayush Paul",
        "logo": {
          "@type": "ImageObject",
          "url": getCanonicalUrl("/founder.png?v=2")
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": getCanonicalUrl(`/blog/${slug}`)
      }
    } : null
  });

  useEffect(() => {
    if (!slug) return;
    const q = query(collection(db, "blogPosts"), where("slug", "==", slug), where("published", "==", true));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const data: any = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
        setPost(data);

        // Increment views
        updateDoc(doc(db, "blogPosts", snapshot.docs[0].id), {
          views: increment(1)
        });
        
        // Fetch candidates for related posts
        const relatedQ = query(
          collection(db, "blogPosts"), 
          where("published", "==", true),
          limit(10)
        );
        
        onSnapshot(relatedQ, (relSnapshot) => {
          const others = relSnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() as any }))
            .filter(p => p.slug !== slug);
          
          // Simple scoring algorithm
          const currentTags = Array.isArray(data.tags) ? data.tags : [];
          const scored = others.map(other => {
            let score = 0;
            const otherTags = Array.isArray(other.tags) ? other.tags : [];
            
            // Match category
            if (other.category === data.category) score += 5;
            
            // Match tags
            const commonTags = currentTags.filter(t => otherTags.includes(t));
            score += commonTags.length * 2;
            
            return { ...other, score };
          });
          
          setRelatedPosts(scored.sort((a, b) => b.score - a.score).slice(0, 3));
        });
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "blogPosts");
      setLoading(false);
    });
    return () => unsubscribe();
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${(totalScroll / windowHeight) * 100}`;
      setScrollProgress(Number(scroll));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!post?.blocks) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -60% 0px" }
    );

    setTimeout(() => {
      document.querySelectorAll("h2, h3, h4").forEach((element) => {
        observer.observe(element);
      });
    }, 1000);

    return () => observer.disconnect();
  }, [post]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getTOC = () => {
    if (!post?.blocks) return [];
    return post.blocks.filter((b: any) => b.type === 'heading').map((b: any) => ({
      id: `heading-${b.id}`,
      text: b.content,
      level: b.metadata?.level || 2
    }));
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]"><div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" /></div>;
  if (!post) return <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] text-white">Post not found</div>;

  return (
    <div className="page-content bg-[#080808] relative">
      <div className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-brand-primary to-brand-accent z-50 transition-all duration-150 ease-out" style={{ width: `${scrollProgress}%` }} />
      <div className="container mx-auto px-6">
        <div className="mb-20">
          <BackButton to="/blog" label="Back to Blog" />
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Editorial Header Section */}
          <header className="max-w-5xl mx-auto text-center mb-24 lg:mb-32">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap items-center justify-center gap-6 mb-12"
            >
              <div className="flex items-center gap-2 text-white/40 text-[11px] font-bold uppercase tracking-[0.3em]">
                <Calendar size={14} className="text-brand-primary" />
                {formatDate(post.createdAt)}
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
              <div className="flex items-center gap-2 text-white/40 text-[11px] font-bold uppercase tracking-[0.3em]">
                <Clock size={14} className="text-brand-primary" />
                {post.blocks ? 
                   Math.ceil(post.blocks.filter((b: any) => b.type === 'text').map((b: any) => b.content).join(' ').split(' ').length / 200) : 
                   Math.ceil((post.content || '').split(" ").length / 200)
                } min read
              </div>
              {post.category && (
                <>
                  <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                  <div className="px-4 py-1.5 rounded-full bg-brand-primary/5 border border-brand-primary/20 text-brand-primary text-[10px] font-bold uppercase tracking-[0.2em]">
                    {post.category}
                  </div>
                </>
              )}
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-12 leading-[1.05] tracking-tighter text-white/95"
            >
              {post.title}
            </motion.h1>

            {post.description && (
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl md:text-3xl text-white/40 leading-relaxed max-w-3xl mx-auto font-medium tracking-tight"
              >
                {post.description}
              </motion.p>
            )}

            {post.updatedAt && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ delay: 0.4 }}
                className="mt-12 text-[10px] font-bold uppercase tracking-[0.3em]"
              >
                Last Updated: {formatDate(post.updatedAt)}
              </motion.div>
            )}
          </header>

          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="aspect-[21/9] rounded-[3rem] overflow-hidden mb-32 border border-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] relative group"
          >
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 transition-all duration-1000" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
          </motion.div>

          <div className="grid lg:grid-cols-[1fr_minmax(auto,720px)_1fr] gap-12 lg:gap-24 relative mb-32">
            {/* Left Rail: Reading Stats & Share */}
            <aside className="hidden lg:flex flex-col items-end py-4 h-full">
              <div className="sticky top-40 space-y-16 flex flex-col items-center">
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 mb-2">Read Progress</div>
                  <div className="text-2xl font-display font-bold text-brand-primary">
                    {Math.round(scrollProgress)}%
                  </div>
                  <div className="w-12 h-[2px] bg-white/5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-brand-primary" style={{ width: `${scrollProgress}%` }} />
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <a href={`https://twitter.com/intent/tweet?url=${window.location.href}&text=${post.title}`} target="_blank" rel="noreferrer" className="w-14 h-14 rounded-2xl glass border border-white/5 flex items-center justify-center text-white/30 hover:text-brand-primary hover:border-brand-primary/20 hover:bg-brand-primary/5 transition-all group">
                    <Twitter size={20} className="group-hover:scale-110 transition-transform" />
                  </a>
                  <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`} target="_blank" rel="noreferrer" className="w-14 h-14 rounded-2xl glass border border-white/5 flex items-center justify-center text-white/30 hover:text-brand-primary hover:border-brand-primary/20 hover:bg-brand-primary/5 transition-all group">
                    <Linkedin size={20} className="group-hover:scale-110 transition-transform" />
                  </a>
                  <button onClick={handleCopyLink} className="w-14 h-14 rounded-2xl glass border border-white/5 flex items-center justify-center text-white/30 hover:text-brand-primary hover:border-brand-primary/20 hover:bg-brand-primary/5 transition-all relative group">
                    {copied ? <Check size={20} className="text-brand-primary" /> : <Link2 size={20} className="group-hover:scale-110 transition-transform" />}
                  </button>
                </div>
              </div>
            </aside>

            {/* Middle: Article Content */}
            <article className="w-full min-w-0">
              <div className="blog-prose prose prose-invert max-w-none editorial-dropcap">
                {post.blocks ? (
                  <div className="space-y-4">
                    {post.blocks.map((block: Block) => {
                      switch (block.type) {
                        case 'text':
                          return <div key={block.id} dangerouslySetInnerHTML={{ __html: block.content }} className="mb-10" />;
                        case 'heading':
                          const HeadingTag = `h${block.metadata?.level || 2}` as any;
                          return <HeadingTag id={`heading-${block.id}`} key={block.id} className="scroll-m-32">{block.content}</HeadingTag>;
                        case 'list':
                          return <div key={block.id} dangerouslySetInnerHTML={{ __html: block.content }} className="list-container mb-10" />;
                        case 'image':
                          return (
                            <figure key={block.id} className={cn(
                              "my-20 rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl",
                              block.metadata?.alignment === 'full' ? "-mx-4 md:-mx-12 lg:-mx-32 w-[calc(100%+2rem)] md:w-[calc(100%+6rem)] lg:w-[calc(100%+16rem)]" : "w-full"
                            )}>
                              <img src={block.content} alt={block.metadata?.alt} className="w-full h-auto" referrerPolicy="no-referrer" />
                              {block.metadata?.caption && <figcaption className="p-8 text-center text-sm text-white/40 font-medium tracking-wide leading-relaxed">{block.metadata.caption}</figcaption>}
                            </figure>
                          );
                        case 'code':
                          return (
                            <div key={block.id} className="my-16 rounded-[2rem] overflow-hidden border border-white/5 bg-[#0D0D0D] shadow-inner group relative">
                              <div className="px-8 py-4 bg-white/[0.02] border-b border-white/5 flex justify-between items-center">
                                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">{block.metadata?.language || 'code'}</span>
                                <button onClick={() => {
                                  navigator.clipboard.writeText(block.content);
                                }} className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold uppercase text-brand-primary hover:text-white">Copy Module</button>
                              </div>
                              <pre className="p-10 overflow-x-auto font-mono text-sm leading-[1.7] text-brand-primary/80"><code>{block.content}</code></pre>
                            </div>
                          );
                        case 'quote':
                          return (
                            <blockquote key={block.id} dangerouslySetInnerHTML={{ __html: block.content }} />
                          );
                        case 'callout':
                          const variants = {
                            info: 'bg-brand-primary/5 border-brand-primary/10 text-brand-primary/90',
                            warning: 'bg-yellow-500/5 border-yellow-500/10 text-yellow-400/90',
                            success: 'bg-green-500/5 border-green-500/10 text-green-400/90',
                            danger: 'bg-red-500/5 border-red-500/10 text-red-400/90',
                          };
                          return (
                            <div key={block.id} className={cn("my-16 p-10 rounded-[2.5rem] border flex gap-8 items-start relative overflow-hidden group", variants[block.metadata?.variant || 'info'])}>
                              <div className="absolute top-0 left-0 w-1 h-full bg-current opacity-20" />
                              <Info size={28} className="shrink-0 mt-1 opacity-40 group-hover:opacity-100 transition-opacity" />
                              <div className="text-xl font-medium leading-[1.6]" dangerouslySetInnerHTML={{ __html: block.content }} />
                            </div>
                          );
                        case 'divider':
                          return (
                            <div key={block.id} className="my-24 flex items-center justify-center gap-4">
                              <div className="w-12 h-px bg-white/5" />
                              <div className="w-2 h-2 rounded-full bg-brand-primary/20" />
                              <div className="w-12 h-px bg-white/5" />
                            </div>
                          );
                        default:
                          return null;
                      }
                    })}
                  </div>
                ) : (
                  <ReactMarkdown>{post.content}</ReactMarkdown>
                )}
              </div>

              {/* Authority Signal: Author Box */}
              <div className="mt-32 p-12 rounded-[3rem] glass border border-white/5 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                  <div className="w-24 h-24 rounded-3xl overflow-hidden border-2 border-brand-primary/20 shrink-0 shadow-2xl">
                    <img src="/founder.png?v=2" alt="Ayush Paul" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-primary mb-2">Written By</div>
                    <h4 className="text-2xl font-bold text-white mb-2">Ayush Paul</h4>
                    <p className="text-white/40 text-sm font-medium leading-relaxed mb-4">
                      Founder, Lead Developer, and AI Architect. Passionate about bridging the gap between high-level software and intelligent hardware innovation.
                    </p>
                    <div className="flex items-center justify-center md:justify-start gap-4">
                      <a href="https://twitter.com/paulayush" target="_blank" rel="noreferrer" className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-brand-primary transition-colors">Twitter</a>
                      <a href="https://linkedin.com/in/paulayush" target="_blank" rel="noreferrer" className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-brand-primary transition-colors">LinkedIn</a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Engagement: Subscribe Section */}
              <div className="mt-16 p-12 rounded-[3rem] bg-brand-primary/5 border border-brand-primary/10 text-center relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-4">Stay at the <span className="text-brand-primary">Edge of Innovation</span></h3>
                  <p className="text-white/40 text-sm mb-8 max-w-md mx-auto">Join 2,000+ developers and engineers receiving weekly insights on AI, hardware, and engineering.</p>
                  <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
                    <input type="email" placeholder="you@example.com" className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary/40 transition-all text-sm" />
                    <button className="px-8 py-4 bg-brand-primary text-black font-bold rounded-2xl hover:bg-white transition-all text-sm shadow-lg shadow-brand-primary/10">Subscribe</button>
                  </form>
                </div>
              </div>
            </article>

            {/* Right Rail: TOC & Stats */}
            <aside className="hidden lg:block py-4">
              <div className="sticky top-40 space-y-16">
                {getTOC().length > 0 && (
                  <div className="space-y-10">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">
                      On This Page
                    </h3>
                    <div className="space-y-6 relative">
                      <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-white/5" />
                      {getTOC().map((item: any) => (
                        <a 
                          key={item.id} 
                          href={`#${item.id}`}
                          className={cn(
                            "block text-[11px] font-bold uppercase tracking-widest transition-all duration-500 hover:text-white line-clamp-2 pl-8 relative group",
                            activeHeading === item.id 
                              ? "text-brand-primary" 
                              : "text-white/20"
                          )}
                          style={{ paddingLeft: item.level > 2 ? `${(item.level - 2) * 16 + 32}px` : undefined }}
                        >
                          {activeHeading === item.id && (
                            <motion.div 
                              layoutId="toc-indicator"
                              className="absolute left-[-1px] top-0 bottom-0 w-[3px] bg-brand-primary shadow-[0_0_15px_rgba(0,194,255,0.6)]" 
                            />
                          )}
                          <span className="group-hover:translate-x-1 transition-transform block">{item.text}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>

        {relatedPosts.length > 0 && (
          <div className="mt-48 max-w-7xl mx-auto mb-32 border-t border-white/5 pt-32">
            <div className="flex flex-col md:flex-row items-center justify-between mb-20 gap-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-4">Keep <span className="text-brand-primary">Exploring</span></h2>
                <p className="text-white/40 text-lg font-medium">Selected articles from the Ayush Paul Intelligence Archives.</p>
              </div>
              <Link to="/blog" className="group flex items-center gap-4 px-8 py-4 rounded-2xl bg-white/[0.03] border border-white/5 text-[11px] font-bold text-white/40 hover:text-brand-primary hover:border-brand-primary/20 transition-all uppercase tracking-[0.2em]">
                View Full Archive <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-10">
              {relatedPosts.map(relPost => (
                <Link to={`/blog/${relPost.slug}`} key={relPost.id} className="group h-full">
                  <div className="glass-card rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-brand-primary/20 hover:bg-white/[0.04] transition-all duration-700 flex flex-col h-full shadow-2xl">
                    <div className="aspect-[16/10] overflow-hidden relative">
                      <img src={relPost.coverImage} alt={relPost.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" referrerPolicy="no-referrer" />
                      <div className="absolute top-6 left-6">
                        <span className="px-3 py-1.5 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 text-[9px] font-bold uppercase tracking-[0.2em] text-white/80">
                          {relPost.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-10 flex flex-col flex-1">
                      <div className="flex items-center gap-4 mb-6 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary/80">
                        <span>{Array.isArray(relPost.tags) ? relPost.tags[0] : relPost.category}</span>
                        <div className="w-1 h-1 rounded-full bg-white/10" />
                        <span className="text-white/20">{formatDate(relPost.createdAt)}</span>
                      </div>
                      <h4 className="text-2xl font-bold mb-6 group-hover:text-brand-primary transition-colors line-clamp-2 leading-tight text-white/90">{relPost.title}</h4>
                      <p className="text-sm text-white/40 line-clamp-2 mb-8 flex-1 leading-relaxed font-medium">
                        {relPost.description || relPost.blocks?.find((b: any) => b.type === 'text')?.content?.replace(/<[^>]*>/g, '').substring(0, 100) + '...'}
                      </p>
                      <div className="flex items-center gap-3 text-[10px] font-bold text-brand-primary uppercase tracking-[0.2em] mt-auto group-hover:gap-4 transition-all">
                        Read Analysis <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};



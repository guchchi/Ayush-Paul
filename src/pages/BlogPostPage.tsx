import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, Clock, Info, ArrowRight, Twitter, Linkedin, Link2, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useSEO } from "../hooks/useSEO";
import { BackButton } from "../components/ui/back-button";
import { cn } from "../lib/utils";
import { formatDate } from "../lib/firebase-utils";
import { getCanonicalUrl } from "../lib/domain";
import { BlogPost } from "../lib/blog-utils";
import { motion, AnimatePresence } from "motion/react";
import { Product, Block } from "../types";
import { WaitlistForm } from "../components/ui/WaitlistForm";

export const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeHeading, setActiveHeading] = useState("");
  const [copied, setCopied] = useState(false);

  useSEO({
    title: post?.seo?.title || (post ? `${post.title} | Ayush Paul Blog` : "Ayush Paul Blog"),
    description: post?.seo?.description || post?.description || post?.excerpt || "Read insights on AI development, system architecture, and building in public.",
    keywords: post?.seo?.keywords || post?.tags?.join(", ") || "Ayush Paul blog, AI development, systems thinking, engineering",
    image: post?.seo?.ogImage || post?.coverImage || "/og-image.png",
    url: `/blog/${slug}`,
    schema: post ? {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.description || post.excerpt,
      "image": post.coverImage,
      "datePublished": post.date,
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
    
    const loadPost = async () => {
      setLoading(true);
      try {
        const { getDynamicBlogs } = await import('../lib/blog-utils');
        
        // Fetch entirely from dynamic Firebase
        const dynamics = await getDynamicBlogs();
        const data = dynamics.find(p => p.slug === slug);

        if (data) {
          setPost(data);

          // Compute related posts
          const combined = dynamics;

          const others = combined.filter(p => p.slug !== slug);
          const currentTags = Array.isArray(data.tags) ? data.tags : [];
          
          const scored = others.map(other => {
            let score = 0;
            const otherTags = Array.isArray(other.tags) ? other.tags : [];
            if (other.category === data.category) score += 5;
            const commonTags = currentTags.filter(t => otherTags.includes(t));
            score += commonTags.length * 2;
            return { ...other, score };
          });
          
          setRelatedPosts(scored.sort((a, b) => b.score - a.score).slice(0, 3));

          // Compute related products matching categories or tags
          try {
            const { getPublishedProducts } = await import('../lib/product-utils');
            const allProducts = await getPublishedProducts();
            
            const scoredProducts = allProducts.map(prod => {
              let score = 0;
              const prodTags = Array.isArray(prod.tags) ? prod.tags : [];
              if (prod.category && data.category && prod.category.toLowerCase() === data.category.toLowerCase()) {
                score += 5;
              }
              const commonTags = currentTags.filter(t => 
                prodTags.some(pt => pt.toLowerCase() === t.toLowerCase())
              );
              score += commonTags.length * 2;
              return { ...prod, score };
            });
            
            const relevant = scoredProducts
              .filter(p => p.score > 0)
              .sort((a, b) => b.score - a.score);
              
            setRelatedProducts(relevant.length > 0 ? relevant.slice(0, 3) : allProducts.slice(0, 3));
          } catch (pErr) {
            console.error("Failed to load related products for blog post:", pErr);
          }
        }
      } catch (err) {
        console.error("[Blog] Post load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
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

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-bg-primary"><div className="w-6 h-6 border-2 border-[#0058be]/25 border-t-[#0058be] rounded-full animate-spin" /></div>;
  if (!post) return <div className="min-h-screen flex items-center justify-center bg-bg-primary text-[#0b1c30] font-bold">Post not found</div>;

  return (
    <div className="page-content bg-bg-primary relative">
      <div className="fixed top-0 left-0 h-[3px] bg-[#0058be] z-[90] transition-all duration-150 ease-out" style={{ width: `${scrollProgress}%` }} />
      
      {/* Editorial Header Section */}
      <section className="pt-16 pb-12 px-6 max-w-5xl mx-auto text-center relative z-10">
        <div className="mb-8 flex justify-start">
          <BackButton to="/blog" label="All Stories" />
        </div>

        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-bold uppercase tracking-wider text-[#424754]/60">
            {post.category && (
              <span className="px-3 py-1.5 rounded-full bg-[#eff4ff] border border-[#dce9ff] text-[#0058be] text-[10px]">
                {post.category}
              </span>
            )}
            <div className="w-1 h-1 rounded-full bg-[#c2c6d6]/60" />
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {formatDate(post.createdAt)}
            </span>
            <div className="w-1 h-1 rounded-full bg-[#c2c6d6]/60" />
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {post.blocks ? 
                 Math.ceil(post.blocks.filter((b: any) => b.type === 'text').map((b: any) => b.content).join(' ').split(' ').length / 200) : 
                 Math.ceil((post.content || '').split(" ").length / 200)
              } min read
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-[4.5rem] font-extrabold tracking-tighter leading-[1.1] text-[#0b1c30]">
            {post.title}
          </h1>

          {post.description && (
            <p className="text-[#424754] text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-semibold">
              {post.description}
            </p>
          )}

          {post.updatedAt && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#c2c6d6]/30 text-[9px] font-bold uppercase tracking-wider text-[#424754]/50">
              Narrative Refined: {formatDate(post.updatedAt)}
            </div>
          )}
        </div>

        {post.coverImage && (
          <div className="w-full rounded-[32px] overflow-hidden aspect-[21/9] border border-[#c2c6d6]/30 shadow-sm mt-12">
            <img 
              src={post.coverImage} 
              alt={post.title} 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer"
            />
          </div>
        )}
      </section>

      {/* Main Content Layout */}
      <div className="relative z-10 container mx-auto px-6 max-w-7xl pb-32">
        <div className="grid lg:grid-cols-[1fr_minmax(auto,720px)_1fr] gap-12 lg:gap-24 relative">
          
          {/* Left Rail: Reading Stats & Share */}
          <aside className="hidden lg:flex flex-col items-end py-4 h-full">
            <div className="sticky top-40 space-y-12 flex flex-col items-center">
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="text-[8px] font-bold uppercase tracking-wider text-[#424754]/40 mb-1">Read Progress</div>
                <div className="text-xl font-mono font-bold text-[#0b1c30]">
                  {Math.round(scrollProgress)}%
                </div>
                <div className="w-10 h-[2px] bg-[#c2c6d6]/20 relative overflow-hidden rounded-full">
                  <div className="absolute inset-y-0 left-0 bg-[#0058be] rounded-full" style={{ width: `${scrollProgress}%` }} />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <a 
                  href={`https://twitter.com/intent/tweet?url=${window.location.href}&text=${post.title}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-10 h-10 rounded-full bg-white border border-[#c2c6d6]/30 flex items-center justify-center text-[#424754]/50 hover:text-[#0058be] hover:border-[#0058be]/20 hover:bg-[#eff4ff] transition-all duration-300 shadow-sm group"
                >
                  <Twitter size={14} />
                </a>
                <a 
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-10 h-10 rounded-full bg-white border border-[#c2c6d6]/30 flex items-center justify-center text-[#424754]/50 hover:text-[#0058be] hover:border-[#0058be]/20 hover:bg-[#eff4ff] transition-all duration-300 shadow-sm group"
                >
                  <Linkedin size={14} />
                </a>
                <button 
                  onClick={handleCopyLink} 
                  className="w-10 h-10 rounded-full bg-white border border-[#c2c6d6]/30 flex items-center justify-center text-[#424754]/50 hover:text-[#0058be] hover:border-[#0058be]/20 hover:bg-[#eff4ff] transition-all duration-300 shadow-sm relative group cursor-pointer"
                >
                  {copied ? <Check size={14} className="text-[#0058be]" /> : <Link2 size={14} />}
                </button>
              </div>
            </div>
          </aside>

          {/* Middle: Article Content */}
          <article 
            className="w-full min-w-0 relative z-[20]"
            ref={(el) => {
              if (el) {
                const links = el.getElementsByTagName('a');
                for (let i = 0; i < links.length; i++) {
                  const link = links[i];
                  if (!link.target) {
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                  }
                }
              }
            }}
          >
            <div className="prose prose-slate max-w-none text-[#424754] text-base md:text-lg leading-relaxed text-left">
              {post.blocks ? (
                <div className="space-y-4">
                  {post.blocks.map((block: Block) => {
                    switch (block.type) {
                      case 'text':
                        return <div key={block.id} dangerouslySetInnerHTML={{ __html: block.content }} className="mb-8 font-medium leading-relaxed" />;
                      case 'heading':
                        const HeadingTag = `h${block.metadata?.level || 2}` as any;
                        return (
                          <HeadingTag 
                            id={`heading-${block.id}`} 
                            key={block.id} 
                            className="scroll-m-32 text-[#0b1c30] font-extrabold tracking-tighter leading-snug mt-12 mb-6 text-2xl md:text-3xl"
                          >
                            {block.content}
                          </HeadingTag>
                        );
                      case 'list':
                        return <div key={block.id} dangerouslySetInnerHTML={{ __html: block.content }} className="list-container mb-8 pl-6 space-y-2 text-[#424754]" />;
                      case 'image':
                        return (
                          <figure key={block.id} className={cn(
                            "my-12 rounded-[32px] overflow-hidden border border-[#c2c6d6]/30 shadow-sm",
                            block.metadata?.alignment === 'full' ? "-mx-4 md:-mx-12 lg:-mx-32 w-[calc(100%+2rem)] md:w-[calc(100%+6rem)] lg:w-[calc(100%+16rem)]" : "w-full"
                          )}>
                            <img src={block.content} alt={block.metadata?.alt} className="w-full h-auto object-cover" referrerPolicy="no-referrer" />
                            {block.metadata?.caption && (
                              <figcaption className="p-6 text-center text-xs text-[#424754]/60 font-semibold tracking-wide leading-relaxed bg-[#f8f9ff] border-t border-[#c2c6d6]/20">
                                {block.metadata.caption}
                              </figcaption>
                            )}
                          </figure>
                        );
                      case 'code':
                        return (
                          <div key={block.id} className="my-12 rounded-2xl overflow-hidden border border-[#c2c6d6]/35 bg-[#f8f9ff] group relative text-left">
                            <div className="px-6 py-3 bg-[#eff4ff] border-b border-[#c2c6d6]/25 flex justify-between items-center">
                              <span className="text-[9px] font-bold uppercase tracking-wider text-[#424754]/60">{block.metadata?.language || 'code'}</span>
                              <button 
                                onClick={() => {
                                  navigator.clipboard.writeText(block.content);
                                }} 
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-[9px] font-bold uppercase text-[#0058be] hover:text-[#004395] cursor-pointer"
                              >
                                Copy Module
                              </button>
                            </div>
                            <pre className="p-8 overflow-x-auto font-mono text-xs leading-relaxed text-[#0b1c30] max-h-[500px]"><code>{block.content}</code></pre>
                          </div>
                        );
                      case 'quote':
                        return (
                          <blockquote 
                            key={block.id} 
                            className="border-l-4 border-[#0058be] pl-8 my-12 italic text-xl md:text-2xl font-bold text-[#0b1c30] bg-[#eff4ff]/30 py-6 pr-6 rounded-r-3xl"
                            dangerouslySetInnerHTML={{ __html: block.content }} 
                          />
                        );
                      case 'callout':
                        return (
                          <div key={block.id} className="my-12 p-8 rounded-[32px] border border-[#c2c6d6]/35 bg-white flex gap-6 items-start relative overflow-hidden shadow-sm text-left">
                            <div className="absolute top-0 left-0 w-1 h-full bg-[#0058be]" />
                            <Info size={20} className="shrink-0 mt-0.5 text-[#0058be]" />
                            <div className="text-sm font-semibold leading-relaxed text-[#424754] text-left" dangerouslySetInnerHTML={{ __html: block.content }} />
                          </div>
                        );
                      case 'divider':
                        return (
                          <div key={block.id} className="my-16 flex items-center justify-center gap-3">
                            <div className="w-8 h-px bg-[#c2c6d6]/40" />
                            <div className="w-1.5 h-1.5 rounded-full bg-[#0058be]" />
                            <div className="w-8 h-px bg-[#c2c6d6]/40" />
                          </div>
                        );
                      default:
                        return null;
                    }
                  })}
                </div>
              ) : (
                <ReactMarkdown
                  components={{
                    a: ({ node, ...props }) => (
                      <a
                        {...props}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0058be] hover:underline transition-all font-bold"
                      />
                    )
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              )}
            </div>

            {/* Authority Signal: Author Box */}
            <div className="mt-24 p-8 md:p-10 rounded-[32px] border border-[#c2c6d6]/30 bg-white shadow-sm flex flex-col md:flex-row items-center gap-6 md:gap-8 text-left">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border border-[#c2c6d6]/30 shrink-0">
                <img src="/founder.png?v=2" alt="Ayush Paul" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="text-[8px] font-bold uppercase tracking-wider text-[#424754]/60 mb-1">Written By</div>
                <h4 className="text-xl font-extrabold text-[#0b1c30] mb-2">Ayush Paul</h4>
                <p className="text-[#424754] text-xs font-semibold leading-relaxed mb-4">
                  Founder, Lead Developer, and AI Architect. Passionate about bridging the gap between high-level software and intelligent hardware innovation.
                </p>
                <div className="flex items-center gap-4">
                  <a href="https://twitter.com/paulayush" target="_blank" rel="noreferrer" className="text-[9px] font-bold uppercase tracking-wider text-[#424754]/60 hover:text-[#0058be] transition-colors">Twitter</a>
                  <a href="https://linkedin.com/in/paulayush" target="_blank" rel="noreferrer" className="text-[9px] font-bold uppercase tracking-wider text-[#424754]/60 hover:text-[#0058be] transition-colors">LinkedIn</a>
                </div>
              </div>
            </div>

            {/* Engagement: Subscribe Section */}
            <div className="mt-12 p-8 md:p-10 rounded-[32px] bg-[#eff4ff]/40 border border-[#c2c6d6]/30 text-center relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-xl font-extrabold mb-3 text-[#0b1c30]">Stay at the <span className="text-[#424754]/60">Edge of Innovation</span></h3>
                <p className="text-[#424754] text-xs mb-6 max-w-sm mx-auto font-semibold">Join 2,000+ developers and engineers receiving weekly insights on AI, hardware, and engineering.</p>
                <div className="max-w-md mx-auto">
                  <WaitlistForm context="blog-engagement" variant="inline" />
                </div>
              </div>
            </div>
          </article>

          {/* Right Rail: TOC */}
          <aside className="hidden lg:block py-4">
            <div className="sticky top-40 space-y-16">
              {getTOC().length > 0 && (
                <div className="space-y-8 text-left">
                  <h3 className="text-[8px] font-bold uppercase tracking-wider text-[#424754]/40">
                    On This Page
                  </h3>
                  <div className="space-y-4 relative">
                    <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-[#c2c6d6]/20" />
                    {getTOC().map((item: any) => (
                      <a 
                        key={item.id} 
                        href={`#${item.id}`}
                        className={cn(
                          "block text-[10px] font-bold uppercase tracking-wider transition-colors hover:text-[#0b1c30] line-clamp-2 pl-6 relative group",
                          activeHeading === item.id 
                            ? "text-[#0058be]" 
                            : "text-[#424754]/40"
                        )}
                        style={{ paddingLeft: item.level > 2 ? `${(item.level - 2) * 12 + 24}px` : undefined }}
                      >
                        {activeHeading === item.id && (
                          <motion.div 
                            layoutId="toc-indicator"
                            className="absolute left-[-1px] top-0 bottom-0 w-[2px] bg-[#0058be]" 
                          />
                        )}
                        <span className="group-hover:translate-x-0.5 transition-transform block">{item.text}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* Related Content Area */}
      <div className="relative z-10 container mx-auto px-6 max-w-7xl mt-24 border-t border-[#c2c6d6]/20 pt-24 space-y-24">
        
        {/* Related Systems */}
        {relatedProducts.length > 0 && (
          <section>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 text-left">
              <div>
                <h3 className="text-[8px] font-bold uppercase tracking-wider text-[#424754]/40 mb-2">Innovation Lab</h3>
                <h2 className="text-3xl font-extrabold text-[#0b1c30] tracking-tight">Related Blueprints</h2>
              </div>
              <Link 
                to="/blueprints" 
                className="group flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-[#c2c6d6]/30 text-[10px] font-bold text-[#424754]/60 hover:text-[#0058be] hover:border-[#0058be]/20 hover:bg-[#eff4ff] transition-all duration-300 shadow-sm uppercase tracking-wider cursor-pointer"
              >
                Explore Blueprints <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map(p => (
                <Link 
                  key={p.id} 
                  to={`/blueprints/${p.slug}`}
                  className="group p-6 rounded-[32px] bg-white border border-[#c2c6d6]/30 hover:border-[#0058be]/20 hover:shadow-ambient hover:scale-[1.01] transition-all duration-300 flex flex-col text-left shadow-sm"
                >
                  <div className="aspect-[16/10] rounded-2xl overflow-hidden mb-6 border border-[#c2c6d6]/10">
                    <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover" />
                  </div>
                  <h4 className="text-lg font-extrabold mb-3 text-[#0b1c30] group-hover:text-[#0058be] transition-colors leading-snug">{p.title}</h4>
                  <div className="flex items-center gap-1.5 mt-auto">
                    <span className="text-[8px] font-bold uppercase tracking-wider text-[#424754]/40">Blueprint</span>
                    <ArrowRight size={10} className="text-[#424754]/40 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Related Blogs */}
        {relatedPosts.length > 0 && (
          <section>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 text-left">
              <div>
                <h2 className="text-3xl font-extrabold text-[#0b1c30] tracking-tight mb-2">Keep Exploring</h2>
                <p className="text-[#424754] text-xs font-semibold">Selected articles from the Ayush Paul Intelligence Archives.</p>
              </div>
              <Link 
                to="/blog" 
                className="group flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-[#c2c6d6]/30 text-[10px] font-bold text-[#424754]/60 hover:text-[#0058be] hover:border-[#0058be]/20 hover:bg-[#eff4ff] transition-all duration-300 shadow-sm uppercase tracking-wider cursor-pointer"
              >
                View Full Archive <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedPosts.map(relPost => (
                <Link to={`/blog/${relPost.slug}`} key={relPost.slug} className="group h-full">
                  <div className="bg-white border border-[#c2c6d6]/30 rounded-[32px] overflow-hidden hover:border-[#0058be]/20 hover:shadow-ambient hover:scale-[1.01] transition-all duration-300 flex flex-col h-full shadow-sm text-left">
                    <div className="aspect-video overflow-hidden relative bg-gray-100 border-b border-[#c2c6d6]/10">
                      <img src={relPost.coverImage} alt={relPost.title} className="absolute inset-0 w-full h-full object-cover" />
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-3 mb-4 text-[8px] font-bold uppercase tracking-wider text-[#424754]/40">
                        <span>{relPost.category}</span>
                        <div className="w-1 h-1 rounded-full bg-[#c2c6d6]/50" />
                        <span className="text-[#424754]/60">{formatDate(relPost.date)}</span>
                      </div>
                      <h4 className="text-base font-extrabold mb-4 group-hover:text-[#0058be] transition-colors line-clamp-2 leading-tight text-[#0b1c30]">{relPost.title}</h4>
                      <div className="flex items-center gap-1.5 text-[8px] font-bold text-[#424754]/60 group-hover:text-[#0058be] uppercase tracking-wider mt-auto transition-colors">
                        Read Analysis <ArrowRight size={10} className="transform group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

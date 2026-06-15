import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { BlogPost } from "../../lib/blog-utils";

interface HomeBlogSectionProps {
  loadingBlogs: boolean;
  blogs: BlogPost[];
}

export const HomeBlogSection = ({ loadingBlogs, blogs }: HomeBlogSectionProps) => {
  return (
    <section className="bg-white py-24 px-6 md:px-12 lg:px-24 text-left mt-0">
      <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="flex flex-col gap-4 max-w-2xl">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0b1c30] bg-[#d1f34d] px-4 py-1.5 rounded-full shadow-sm w-fit inline-block">
              KNOWLEDGE BASE
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-[4rem] font-extrabold text-[#0b1c30] tracking-tighter leading-[1.1] max-w-4xl">
              Insights &amp; Chronicle Logs
            </h2>
            <p className="text-base text-[#424754] font-medium leading-relaxed">
              Reflections on systems design, prompt engineering strategies, and building development workflows in public.
            </p>
          </div>
          <Link className="bg-[#0b1c30] text-[#d1f34d] px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-[#d1f34d] hover:text-black transition-colors shrink-0" to="/blog">
            VIEW ALL LOGS <ArrowUpRight size={14} />
          </Link>
        </div>

        {loadingBlogs ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 bg-white rounded-[32px] border border-[#c2c6d6]/30 shadow-sm">
            <div className="w-6 h-6 border-2 border-[#0b1c30]/20 border-t-[#0b1c30] rounded-full animate-spin" />
            <span className="text-xs text-gray-400">Querying logs...</span>
          </div>
        ) : blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogs.map((b) => (
              <Link to={`/blog/${b.slug}`} key={b.id} className="relative group aspect-[3/4] rounded-[32px] overflow-hidden cursor-pointer block border border-[#c2c6d6]/30 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <img src={b.coverImage || "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600"} alt={b.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                <div className="absolute top-5 left-5 z-20">
                  <span className="px-3 py-1 rounded-full bg-white/95 border border-gray-100 text-[9px] font-bold uppercase tracking-widest text-[#0b1c30] shadow-sm">
                    {b.category}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 p-7 z-20 text-left w-full">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-white/50 mb-2.5">
                    {new Date(b.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                  </div>
                  <h3 className="text-white text-lg md:text-xl font-extrabold leading-snug line-clamp-2">
                    {b.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-12 border border-dashed border-[#c2c6d6]/40 bg-white rounded-[32px] text-center">
            <p className="text-sm text-[#424754] font-semibold">No insights published yet. Write them inside the admin workspace.</p>
          </div>
        )}
      </div>
    </section>
  );
};

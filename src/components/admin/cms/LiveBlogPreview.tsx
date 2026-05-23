import React from "react";
import { Clock, Info } from "lucide-react";
import { Block } from "../../../types";

interface LiveBlogPreviewProps {
  postData: {
    category: string;
    title: string;
    description?: string;
    coverImage?: string;
  };
  blocks: Block[];
}

export const LiveBlogPreview: React.FC<LiveBlogPreviewProps> = ({
  postData,
  blocks,
}) => {
  const calculateReadingTime = () => {
    const textContent = blocks
      .filter((b) => b.type === "text")
      .map((b) => b.content)
      .join(" ");
    const wordCount = textContent.trim() ? textContent.trim().split(/\s+/).length : 0;
    return Math.max(1, Math.ceil(wordCount / 200));
  };

  return (
    <div className="bg-[#080808] rounded-[40px] border border-white/10 overflow-hidden shadow-2xl h-full overflow-y-auto custom-scrollbar p-12 text-left">
      <div className="max-w-3xl mx-auto space-y-12">
        <header className="text-center space-y-8">
          <div className="flex items-center justify-center gap-4">
            <div className="px-4 py-1.5 rounded-full bg-brand-primary/5 border border-brand-primary/20 text-brand-primary text-[10px] font-bold uppercase tracking-[0.2em]">
              {postData.category}
            </div>
            <div className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2">
              <Clock size={12} /> {calculateReadingTime()} min read
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tighter text-white">
            {postData.title || "Untitled Masterpiece"}
          </h1>
          {postData.description && (
            <p className="text-xl text-white/40 font-medium leading-relaxed">
              {postData.description}
            </p>
          )}
        </header>

        {postData.coverImage && (
          <div className="aspect-[21/9] rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
            <img
              src={postData.coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <article className="blog-prose prose prose-invert max-w-none text-white/80">
          {blocks.map((block) => {
            switch (block.type) {
              case "text":
                return (
                  <div
                    key={block.id}
                    dangerouslySetInnerHTML={{ __html: block.content }}
                    className="mb-8"
                  />
                );
              case "heading": {
                const Tag = `h${block.metadata?.level || 2}` as any;
                return <Tag key={block.id} className="text-white">{block.content}</Tag>;
              }
              case "list":
                return (
                  <div
                    key={block.id}
                    dangerouslySetInnerHTML={{ __html: block.content }}
                    className="mb-8"
                  />
                );
              case "image":
                return (
                  <figure key={block.id} className="my-12">
                    <img
                      src={block.content}
                      alt={block.metadata?.alt}
                      className="rounded-2xl border border-white/5 w-full"
                    />
                  </figure>
                );
              case "quote":
                return (
                  <blockquote
                    key={block.id}
                    dangerouslySetInnerHTML={{ __html: block.content }}
                    className="border-l-4 border-brand-primary pl-6 my-10 italic text-white/60"
                  />
                );
              case "callout":
                return (
                  <div
                    key={block.id}
                    className="p-8 rounded-3xl border bg-brand-primary/5 border-brand-primary/10 text-brand-primary flex gap-4 my-8"
                  >
                    <Info size={24} className="shrink-0" />
                    <div dangerouslySetInnerHTML={{ __html: block.content }} />
                  </div>
                );
              case "divider":
                return <div key={block.id} className="my-16 h-px w-full bg-white/5" />;
              default:
                return null;
            }
          })}
        </article>
      </div>
    </div>
  );
};

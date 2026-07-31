import React, { useState, useEffect } from "react";
import { AlertCircle, CheckCircle2, ImageIcon, Cpu, Terminal } from "lucide-react";
import { Block, SEOData } from "../../../types";
import { cn } from "../../../lib/utils";
import { ImageUploadField } from "../shared/ImageUploadField";

interface SEOPanelProps {
  data: SEOData;
  setData: React.Dispatch<React.SetStateAction<SEOData>>;
  blocks: Block[];
  onAIAction: (id: string, action: string) => void;
  isProcessing: boolean;
}

export const SEOPanel: React.FC<SEOPanelProps> = ({
  data,
  setData,
  blocks,
  onAIAction,
  isProcessing,
}) => {
  const [score, setScore] = useState(0);
  const [issues, setIssues] = useState<string[]>([]);

  useEffect(() => {
    let s = 0;
    const i: string[] = [];

    // Title Length Check
    if (data.title.length >= 50 && data.title.length <= 60) s += 15;
    else if (data.title.length > 0) i.push("SEO Title should be between 50-60 characters");
    else i.push("SEO Title is missing");

    // Description Length Check
    if (data.description.length >= 120 && data.description.length <= 160) s += 15;
    else if (data.description.length > 0) i.push("Meta description should be between 120-160 characters");
    else i.push("Meta description is missing");

    // Focus Keyword Presence
    if (data.keywords) {
      s += 10;
      const kw = data.keywords.toLowerCase();

      // Keyword in Title
      if (data.title.toLowerCase().includes(kw)) s += 20;
      else i.push(`Focus keyword "${data.keywords}" missing from SEO Title`);

      // Keyword in Content (First 500 chars)
      const textContent = blocks
        .filter((b) => b.type === "text")
        .map((b) => b.content)
        .join(" ")
        .toLowerCase();
      if (textContent.includes(kw)) s += 20;
      else i.push(`Focus keyword "${data.keywords}" not found in early content`);
    } else {
      i.push("Focus keyword is missing");
    }

    // Image Alt Text Check
    const hasImages = blocks.some((b) => b.type === "image");
    if (hasImages) {
      const hasImagesWithAlt = blocks
        .filter((b) => b.type === "image")
        .every((b) => b.metadata?.alt);
      if (hasImagesWithAlt) s += 10;
      else i.push("Some images are missing descriptive alt text");
    } else {
      s += 10; // No images is fine for simple posts
    }

    // Content Length Check
    const textBlocks = blocks.filter((b) => b.type === "text").map((b) => b.content).join(" ");
    const wordCount = textBlocks.trim() ? textBlocks.trim().split(/\s+/).length : 0;
    if (wordCount > 300) s += 10;
    else i.push("Content is too short (minimum 300 words recommended)");

    setScore(Math.min(100, s));
    setIssues(i);
  }, [data, blocks]);

  return (
    <div className="space-y-12 text-left">
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">
                SEO Title
              </label>
              <button
                onClick={() => onAIAction("", "title")}
                disabled={isProcessing}
                className={cn(
                  "text-[10px] font-bold font-mono uppercase tracking-widest hover:underline flex items-center gap-1.5 transition-all",
                  isProcessing ? "text-white/20 cursor-wait" : "text-brand-primary"
                )}
              >
                <Cpu
                  size={10}
                  className={cn(isProcessing && "animate-spin")}
                />{" "}
                {isProcessing ? "[Ingesting...]" : "[Compile Title]"}
              </button>
            </div>
            <input
              type="text"
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary text-white"
              placeholder="Enter SEO title..."
            />
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/20">
              <span>Characters: {data.title.length}</span>
              <span>Recommended: 50-60</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">
                Meta Description
              </label>
              <button
                onClick={() => onAIAction("", "summary")}
                disabled={isProcessing}
                className={cn(
                  "text-[10px] font-bold font-mono uppercase tracking-widest hover:underline flex items-center gap-1.5 transition-all",
                  isProcessing ? "text-white/20 cursor-wait" : "text-brand-primary"
                )}
              >
                <Terminal
                  size={10}
                  className={cn(isProcessing && "animate-pulse")}
                />{" "}
                {isProcessing ? "[Synthesizing...]" : "[Compile Excerpt]"}
              </button>
            </div>
            <textarea
              value={data.description}
              onChange={(e) => setData({ ...data, description: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary h-32 resize-none text-white"
              placeholder="Enter meta description..."
            />
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/20">
              <span>Characters: {data.description.length}</span>
              <span>Recommended: 120-160</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">
                Focus Keyword
              </label>
              <button
                onClick={() => onAIAction("", "keywords")}
                disabled={isProcessing}
                className={cn(
                  "text-[10px] font-bold font-mono uppercase tracking-widest hover:underline flex items-center gap-1.5 transition-all",
                  isProcessing ? "text-white/20 cursor-wait" : "text-brand-primary"
                )}
              >
                <Cpu
                  size={10}
                  className={cn(isProcessing && "animate-pulse")}
                />{" "}
                {isProcessing ? "[Analyzing...]" : "[Index Keywords]"}
              </button>
            </div>
            <input
              type="text"
              value={data.keywords}
              onChange={(e) => setData({ ...data, keywords: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary text-white"
              placeholder="Enter focus keyword..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">
              Social Sharing Image (OG Image)
            </label>
            <ImageUploadField
              value={data.ogImage || ""}
              onChange={(url) => setData({ ...data, ogImage: url })}
              path="seo_images"
              label="OG Image URL or Upload"
            />
            <p className="text-[10px] text-white/20 ml-1 italic">
              If left empty, the blog cover image will be used.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="p-8 rounded-[40px] glass-card border border-white/10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold">SEO Score</h3>
              <div
                className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold border-4",
                  score >= 80
                    ? "border-green-500 text-green-500"
                    : score >= 50
                    ? "border-yellow-500 text-yellow-500"
                    : "border-red-500 text-red-500"
                )}
              >
                {score}
              </div>
            </div>

            <div className="space-y-4">
              {issues.length > 0 ? (
                issues.map((issue, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-white/40">
                    <AlertCircle size={16} className="text-yellow-500 shrink-0 mt-0.5" />
                    {issue}
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-3 text-sm text-green-500 font-bold">
                  <CheckCircle2 size={16} />
                  Your SEO is perfectly optimized!
                </div>
              )}
            </div>
          </div>

          <div className="p-8 rounded-[40px] bg-white/5 border border-white/10">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-6">
              Social Preview
            </h3>
            <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-md">
              <div className="aspect-video bg-white/5 flex items-center justify-center relative overflow-hidden">
                {data.ogImage ? (
                  <img
                    src={data.ogImage}
                    className="w-full h-full object-cover"
                    alt="Preview"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 opacity-20">
                    <ImageIcon size={32} />
                    <span className="text-[8px] font-bold uppercase tracking-widest">
                      No Image
                    </span>
                  </div>
                )}
              </div>
              <div className="p-6 space-y-2">
                <div className="text-[9px] font-bold text-brand-primary uppercase tracking-[0.2em]">
                  thepaulx.in
                </div>
                <div className="text-base font-bold text-white/90 line-clamp-1">
                  {data.ogTitle || data.title || "Innovation Narrative Title"}
                </div>
                <div className="text-xs text-white/40 line-clamp-2 leading-relaxed">
                  {(
                    data.ogDescription ||
                    data.description ||
                    "Narrative description will appear here..."
                  ).substring(0, 160)}
                  {(data.ogDescription || data.description || "").length > 160
                    ? "..."
                    : ""}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

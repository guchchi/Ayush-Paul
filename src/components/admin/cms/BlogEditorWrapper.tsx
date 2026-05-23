import React, { useState } from "react";
import { motion } from "motion/react";
import { Edit, Sparkles, X, Type, Clock, List, FileText } from "lucide-react";
import { Block, SEOData } from "../../../types";
import { cn } from "../../../lib/utils";
import { TipTapEditor } from "../../editor/TipTapEditor";
import { parseSmartContent } from "../../../lib/content-parser";

interface BlogEditorWrapperProps {
  blocks: Block[];
  setBlocks: React.Dispatch<React.SetStateAction<Block[]>>;
  onAIAction: (id: string, action: string) => void;
  activeTab: string;
  setBlogFormData: React.Dispatch<React.SetStateAction<any>>;
  setProjectFormData: React.Dispatch<React.SetStateAction<any>>;
  setSeoData: React.Dispatch<React.SetStateAction<SEOData>>;
}

export const BlogEditorWrapper: React.FC<BlogEditorWrapperProps> = ({
  blocks,
  setBlocks,
  activeTab,
  setBlogFormData,
  setProjectFormData,
  setSeoData,
}) => {
  const [importText, setImportText] = useState("");
  const [showSmartImport, setShowSmartImport] = useState(false);

  const handleSmartImport = (append = false) => {
    if (!importText.trim()) return;

    let result: any;
    try {
      // Try parsing as JSON first
      const json = JSON.parse(importText);
      const payload = json.data || json;

      result = {
        title: payload.title || payload.name || "",
        category: payload.category || "Artificial Intelligence",
        slug: payload.slug || "",
        blocks: payload.blocks || [],
        seo: payload.seo || {},
        description: payload.description || payload.seo?.description || "",
      };
    } catch (e) {
      // Fallback to text parser
      const parsed = parseSmartContent(importText);
      result = {
        title: parsed.title,
        category: parsed.category,
        slug: parsed.slug,
        blocks: parsed.blocks,
        seo: {
          title: parsed.title,
          description: parsed.metadata.excerpt,
          keywords: "",
        },
        description: parsed.metadata.excerpt,
      };
    }

    if (activeTab === "projects") {
      setProjectFormData((prev: any) => ({
        ...prev,
        title: result.title !== "Untitled Narrative" ? result.title : prev.title,
        category: result.category,
        slug: result.slug || prev.slug,
        description: result.description,
      }));
    } else {
      setBlogFormData((prev: any) => ({
        ...prev,
        title: result.title !== "Untitled Narrative" ? result.title : prev.title,
        slug: result.slug || prev.slug,
        category: result.category,
        description: result.description,
        coverImage: result.coverImage || prev.coverImage,
        tags: result.tags || prev.tags || [],
      }));

      setSeoData((prev: any) => ({
        ...prev,
        title: result.seo?.title || result.title || prev.title,
        description:
          result.seo?.description || result.description || prev.description,
        keywords: result.seo?.keywords || prev.keywords || "",
      }));
    }

    if (append) {
      setBlocks((prev) => [...prev, ...result.blocks]);
    } else {
      setBlocks(result.blocks);
    }

    setImportText("");
    setShowSmartImport(false);
  };

  return (
    <div className="space-y-8 text-left">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
            <Edit size={20} />
          </div>
          <h3 className="text-xl font-bold text-white">Innovation Narrative</h3>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSmartImport(true)}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-brand-primary hover:bg-brand-primary/5 transition-all flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest"
          >
            <Sparkles size={14} /> Smart Paste
          </button>
        </div>
      </div>

      <TipTapEditor blocks={blocks} onChange={setBlocks} />

      {showSmartImport && (
        <div className="fixed inset-0 z-[11000] bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-[#111111] border border-white/10 rounded-[40px] p-12 max-w-4xl w-full space-y-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-brand-primary">
                <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center">
                  <Sparkles size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Smart Auto-Formatter</h3>
                  <p className="text-white/40 text-sm">
                    Paste raw text to analyze and format into blocks instantly
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSmartImport(false)}
                className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/20 hover:text-white transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              className="w-full h-80 bg-black/40 border border-white/10 rounded-3xl p-8 outline-none focus:border-brand-primary text-white/80 font-mono text-sm resize-none"
              placeholder="Paste everything here (Title: ..., Category: ..., then your content). We'll handle the rest."
            />

            {importText.trim() && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 lg:grid-cols-5 gap-4"
              >
                {(() => {
                  const result = parseSmartContent(importText);
                  return [
                    {
                      label: "Title",
                      value:
                        result.title !== "Untitled Narrative"
                          ? "Detected"
                          : "Missing",
                      icon: <Type size={14} />,
                      color:
                        result.title !== "Untitled Narrative"
                          ? "text-green-400"
                          : "text-white/20",
                    },
                    {
                      label: "Reading Time",
                      value: `${result.metadata.readingTime} min`,
                      icon: <Clock size={14} />,
                      color: "text-brand-primary",
                    },
                    {
                      label: "Headings",
                      value: result.blocks.filter((b) => b.type === "heading")
                        .length,
                      icon: <Type size={14} />,
                      color: "text-white",
                    },
                    {
                      label: "Lists",
                      value: result.blocks.filter((b) => b.type === "list")
                        .length,
                      icon: <List size={14} />,
                      color: "text-white",
                    },
                    {
                      label: "Paragraphs",
                      value: result.blocks.filter((b) => b.type === "text")
                        .length,
                      icon: <FileText size={14} />,
                      color: "text-white",
                    },
                  ];
                })().map((stat) => (
                  <div
                    key={stat.label}
                    className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-1 text-left"
                  >
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/20">
                      {stat.icon} {stat.label}
                    </div>
                    <div className={cn("text-lg font-bold", stat.color)}>
                      {stat.value}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            <div className="flex justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/20">
                  Detection: Elite Smart Parser v2
                </p>
                {importText.includes("---") && (
                  <div className="px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-[8px] font-bold uppercase tracking-widest text-brand-primary">
                    Markdown Detected
                  </div>
                )}
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => handleSmartImport(true)}
                  className="px-8 py-4 bg-white/5 border border-white/10 text-white hover:bg-white/10 rounded-2xl font-bold transition-all text-sm"
                >
                  Append to Editor
                </button>
                <button
                  onClick={() => handleSmartImport(false)}
                  className="px-10 py-4 bg-brand-primary text-white rounded-2xl font-bold hover:bg-brand-primary/90 transition-all text-sm shadow-lg shadow-brand-primary/20"
                >
                  Format & Start Fresh
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

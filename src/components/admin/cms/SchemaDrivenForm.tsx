import React, { useState, useEffect } from "react";
import * as Icons from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { CollectionSchema, CMS_SCHEMAS, FieldDefinition } from "../../../config/cms-schemas";
import { SEOPanel } from "../seo/SEOPanel";
import { BlogEditorWrapper } from "./BlogEditorWrapper";
import { AIWritingAssistant } from "../ai/AIWritingAssistant";
import {
  db,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "../../../firebase";
import { LucideIcon } from "./SchemaDrivenList";

interface SchemaDrivenFormProps {
  schema: CollectionSchema;
  initialData?: any;
  onSave: (data: any) => Promise<void>;
  onCancel: () => void;
  user: any;
}

export const SchemaDrivenForm = ({
  schema,
  initialData,
  onSave,
  onCancel,
  user,
}: SchemaDrivenFormProps) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isAIProcessing, setIsAIProcessing] = useState(false);

  // States for dynamic course modules & lessons syllabus (only if courses schema)
  const [courseModules, setCourseModules] = useState<any[]>([]);
  const [courseLessons, setCourseLessons] = useState<any[]>([]);
  const [subModal, setSubModal] = useState<{
    type: "module" | "lesson";
    item?: any;
    moduleId?: string; // For lessons
  } | null>(null);
  const [subFormData, setSubFormData] = useState<Record<string, any>>({});

  // 1. Initialize form values
  useEffect(() => {
    const defaultData: Record<string, any> = {};
    schema.fields.forEach((field) => {
      if (initialData && initialData[field.name] !== undefined) {
        defaultData[field.name] = initialData[field.name];
      } else if (field.defaultValue !== undefined) {
        defaultData[field.name] = field.defaultValue;
      } else if (field.type === "array") {
        defaultData[field.name] = [];
      } else if (field.type === "boolean") {
        defaultData[field.name] = false;
      } else if (field.type === "seo") {
        defaultData[field.name] = {
          title: "",
          description: "",
          keywords: "",
          canonicalUrl: "",
          ogTitle: "",
          ogDescription: "",
          ogImage: "",
        };
      } else if (field.type === "blocks") {
        defaultData[field.name] = [];
      } else {
        defaultData[field.name] = "";
      }
    });
    setFormData(defaultData);

    // If editing a course, load modules and lessons
    if (schema.collectionName === "courses" && initialData?.id) {
      loadSyllabusData();
    }
  }, [schema, initialData]);

  const loadSyllabusData = async () => {
    if (!initialData?.id) return;
    try {
      const qMod = query(collection(db, "modules"), where("courseId", "==", initialData.id));
      const qLess = query(collection(db, "lessons"), where("courseId", "==", initialData.id));

      const [modSnap, lessSnap] = await Promise.all([getDocs(qMod), getDocs(qLess)]);

      const mods = modSnap.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
      const less = lessSnap.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

      setCourseModules(mods);
      setCourseLessons(less);
    } catch (err) {
      console.error("Failed to load syllabus items:", err);
    }
  };

  const handleInputChange = (fieldName: string, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [fieldName]: value };
      // Auto-slugify titles for blogs and products
      if (fieldName === "title" && (schema.collectionName === "blogPosts" || schema.collectionName === "products" || schema.collectionName === "courses" || schema.collectionName === "projects")) {
        updated.slug = value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
      }
      return updated;
    });
  };

  const setBlocks = (newBlocks: any) => {
    const currentBlocks = formData.blocks || [];
    const updated = typeof newBlocks === "function" ? newBlocks(currentBlocks) : newBlocks;
    handleInputChange("blocks", updated);
  };

  const setBlogFormData = (updater: any) => {
    setFormData((prev) => {
      const updated = typeof updater === "function" ? updater(prev) : updater;
      if (updated.title && updated.title !== prev.title) {
        updated.slug = updated.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
      }
      return { ...prev, ...updated };
    });
  };

  const setSeoData = (updater: any) => {
    setFormData((prev) => {
      const currentSeo = prev.seo || {};
      const updatedSeo = typeof updater === "function" ? updater(currentSeo) : updater;
      return { ...prev, seo: { ...currentSeo, ...updatedSeo } };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(formData);
    } catch (err) {
      console.error("Form save error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // Generative AI actions for blogs
  const handleAIAction = async (action: string, blockId?: string) => {
    if (isAIProcessing) return;
    setIsAIProcessing(true);
    try {
      const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
      if (!apiKey) throw new Error("GOOGLE_API_KEY is not defined");

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      let prompt = "";
      const blocks = formData.blocks || [];
      let targetContent = "";

      if (blockId) {
        const block = blocks.find((b: any) => b.id === blockId);
        if (!block) return;
        targetContent = block.content;
      } else {
        targetContent = blocks
          .filter((b: any) => b.type === "text")
          .map((b: any) => b.content)
          .join("\n");
      }

      switch (action) {
        case "improve":
          prompt = `Improve the following text for a professional tech blog. Make it more engaging and clear:\n\n${targetContent}`;
          break;
        case "grammar":
          prompt = `Fix any grammar or spelling mistakes in the following text:\n\n${targetContent}`;
          break;
        case "expand":
          prompt = `Expand on the following paragraph, adding more technical detail and depth:\n\n${targetContent}`;
          break;
        case "simplify":
          prompt = `Simplify the following text to make it easier to read for beginners:\n\n${targetContent}`;
          break;
        case "summary":
          prompt = `Generate a concise summary (max 160 characters) for the following blog content. This will be used as a meta description:\n\n${targetContent}`;
          break;
        case "keywords":
          prompt = `Suggest 5-10 SEO keywords for the following content. Return them as a comma-separated list:\n\n${targetContent}`;
          break;
        case "headings":
          prompt = `Suggest a better heading hierarchy for the following content:\n\n${targetContent}`;
          break;
        case "title":
          prompt = `Suggest a catchy, SEO-friendly title for a blog post with the following content:\n\n${targetContent}`;
          break;
      }

      const response = await model.generateContent(prompt);
      const result = response.response.text();
      const cleanResult = result.replace(/^[-*•\d. ]+/gm, "").trim();

      if (blockId) {
        const updatedBlocks = blocks.map((b: any) => (b.id === blockId ? { ...b, content: cleanResult } : b));
        handleInputChange("blocks", updatedBlocks);
      } else {
        const newFormData = { ...formData };
        if (action === "summary") {
          newFormData.description = cleanResult;
          if (newFormData.seo) newFormData.seo.description = cleanResult;
        } else if (action === "keywords") {
          const tags = cleanResult.split(",").map((t: string) => t.trim()).filter((t: string) => t);
          newFormData.tags = tags;
          if (newFormData.seo) newFormData.seo.keywords = cleanResult;
        } else if (action === "title") {
          newFormData.title = cleanResult;
          newFormData.slug = cleanResult
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
          if (newFormData.seo) newFormData.seo.title = cleanResult;
        } else {
          // If returning custom blocks or advice, log it
          console.log("AI returned advice:", cleanResult);
        }
        setFormData(newFormData);
      }
    } catch (err) {
      console.error("AI action failed:", err);
    } finally {
      setIsAIProcessing(false);
    }
  };

  // Syllabus Sub-Forms crud
  const openSubModal = (type: "module" | "lesson", item?: any, moduleId?: string) => {
    const subSchema = type === "module" ? CMS_SCHEMAS.modules : CMS_SCHEMAS.lessons;
    const defaults: Record<string, any> = {};

    subSchema.fields.forEach((f) => {
      if (item && item[f.name] !== undefined) {
        defaults[f.name] = item[f.name];
      } else if (f.defaultValue !== undefined) {
        defaults[f.name] = f.defaultValue;
      } else if (f.type === "boolean") {
        defaults[f.name] = false;
      } else {
        defaults[f.name] = "";
      }
    });

    setSubFormData(defaults);
    setSubModal({ type, item, moduleId });
  };

  const handleSaveSubItem = async () => {
    if (!initialData?.id) return;
    try {
      const collectionName = subModal?.type === "module" ? "modules" : "lessons";
      const payload: Record<string, any> = {
        ...subFormData,
        courseId: initialData.id,
        updatedAt: serverTimestamp(),
      };

      if (subModal?.type === "lesson" && subModal.moduleId) {
        payload.moduleId = subModal.moduleId;
      }

      if (subModal?.item?.id) {
        // Update existing
        await updateDoc(doc(db, collectionName, subModal.item.id), payload);
      } else {
        // Create new
        payload.createdAt = serverTimestamp();
        await addDoc(collection(db, collectionName), payload);
      }

      setSubModal(null);
      loadSyllabusData();
    } catch (err) {
      console.error("Failed to save syllabus item:", err);
    }
  };

  const handleDeleteSubItem = async (id: string, type: "module" | "lesson") => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      try {
        const collectionName = type === "module" ? "modules" : "lessons";
        await deleteDoc(doc(db, collectionName, id));
        loadSyllabusData();
      } catch (err) {
        console.error("Failed to delete syllabus item:", err);
      }
    }
  };

  const formatDate = (date: any) => {
    if (!date) return "";
    if (typeof date.toDate === "function") return date.toDate().toLocaleDateString();
    return new Date(date).toLocaleDateString();
  };

  const renderFieldInput = (field: FieldDefinition) => {
    if (field.hiddenInForm) return null;

    const value = formData[field.name] ?? "";

    switch (field.type) {
      case "string":
        return (
          <input
            type="text"
            value={value}
            disabled={field.readOnly}
            required={field.required}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary text-white text-sm disabled:opacity-50"
          />
        );
      case "text":
        return (
          <textarea
            value={value}
            disabled={field.readOnly}
            required={field.required}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            rows={5}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary text-white text-sm resize-none disabled:opacity-50"
          />
        );
      case "number":
        return (
          <input
            type="number"
            value={value}
            disabled={field.readOnly}
            required={field.required}
            onChange={(e) => handleInputChange(field.name, Number(e.target.value))}
            placeholder={field.placeholder}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary text-white text-sm disabled:opacity-50"
          />
        );
      case "boolean":
        return (
          <div className="flex items-center gap-4 py-2">
            <button
              type="button"
              disabled={field.readOnly}
              onClick={() => handleInputChange(field.name, !value)}
              className={`w-12 h-6 rounded-full transition-all duration-300 relative ${
                value ? "bg-brand-primary shadow-[0_0_15px_rgba(0,194,255,0.4)]" : "bg-white/10"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all duration-300 ${
                  value ? "left-6.5" : "left-0.5"
                }`}
              />
            </button>
            <span className="text-sm font-bold text-white/60">{value ? "Enabled" : "Disabled"}</span>
          </div>
        );
      case "select":
        return (
          <select
            value={value}
            disabled={field.readOnly}
            required={field.required}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary text-white text-sm disabled:opacity-50"
          >
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#0A0A0A] text-white">
                {opt.label}
              </option>
            ))}
          </select>
        );
      case "array":
        return (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2 min-h-[40px] p-3 rounded-2xl bg-white/5 border border-white/10">
              {Array.isArray(value) && value.length > 0 ? (
                value.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-bold rounded-lg"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => handleInputChange(field.name, value.filter((_: any, i: number) => i !== idx))}
                      className="text-brand-primary hover:text-white transition-colors"
                    >
                      <Icons.X size={12} />
                    </button>
                  </span>
                ))
              ) : (
                <span className="text-white/20 text-xs italic self-center">No items listed.</span>
              )}
            </div>
            <input
              type="text"
              placeholder={field.placeholder || "Type item and press Enter..."}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === ",") {
                  e.preventDefault();
                  const target = e.currentTarget;
                  const newItem = target.value.trim();
                  if (newItem) {
                    const currentArr = Array.isArray(value) ? value : [];
                    if (!currentArr.includes(newItem)) {
                      handleInputChange(field.name, [...currentArr, newItem]);
                    }
                    target.value = "";
                  }
                }
              }}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary text-white text-sm"
            />
          </div>
        );
      case "blocks":
        return (
          <div className="space-y-4">
            <BlogEditorWrapper
              blocks={Array.isArray(value) ? value : []}
              setBlocks={setBlocks}
              onAIAction={(id, action) => handleAIAction(action, id)}
              activeTab="blogs"
              setBlogFormData={setBlogFormData}
              setProjectFormData={setBlogFormData}
              setSeoData={setSeoData}
            />
          </div>
        );
      case "seo":
        const seoDataVal = value || {
          title: "",
          description: "",
          keywords: "",
          canonicalUrl: "",
          ogTitle: "",
          ogDescription: "",
          ogImage: "",
        };
        return (
          <SEOPanel
            data={seoDataVal}
            setData={setSeoData}
            blocks={formData.blocks || []}
            onAIAction={(id, action) => handleAIAction(action, id)}
            isProcessing={isAIProcessing}
          />
        );
      case "date":
        return (
          <input
            type="text"
            readOnly
            disabled
            value={formatDate(value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none text-white/40 text-sm cursor-not-allowed"
          />
        );
      default:
        return null;
    }
  };

  // Check if blog category. If so, split into editor + side columns
  const isBlogPost = schema.collectionName === "blogPosts";

  return (
    <div className="space-y-12">
      {/* Shell Header */}
      <div className="flex justify-between items-center bg-white/5 p-6 rounded-[2.5rem] border border-white/10">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-3">
            <Icons.Edit3 className="text-brand-primary" size={20} />
            {initialData ? `Modify ${schema.displayName}` : `Create ${schema.displayName}`}
          </h3>
          <p className="text-white/40 text-xs">Fill in required details for system synchronization.</p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="p-3 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-white transition-colors"
        >
          <Icons.X size={20} />
        </button>
      </div>

      {isBlogPost ? (
        /* Split Layout for Blogs (Editor + AI Assist + SEO) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-8">
            <div className="glass-card rounded-[2.5rem] border border-white/10 p-8 space-y-6">
              {schema.fields
                .filter((f) => f.type !== "blocks" && f.type !== "seo")
                .map((field) => (
                  <div key={field.name} className="space-y-2">
                    <label className="text-sm font-bold text-white/40 ml-1">{field.label}</label>
                    {renderFieldInput(field)}
                  </div>
                ))}
            </div>

            {/* Blocks editor */}
            {schema.fields
              .filter((f) => f.type === "blocks")
              .map((field) => (
                <div key={field.name} className="space-y-3 pt-6">
                  <h4 className="text-sm font-bold text-white/40 ml-1">{field.label}</h4>
                  {renderFieldInput(field)}
                </div>
              ))}
          </div>

          {/* Sticky Side Rail */}
          <div className="lg:col-span-4 space-y-8 sticky top-32">
            <AIWritingAssistant onAction={handleAIAction} isProcessing={isAIProcessing} />

            <div className="p-8 bg-white/[0.02] border border-white/10 rounded-[40px] space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-3 text-white">
                <Icons.Globe size={20} className="text-brand-primary" /> SEO Engine
              </h3>
              {schema.fields
                .filter((f) => f.type === "seo")
                .map((field) => (
                  <div key={field.name}>{renderFieldInput(field)}</div>
                ))}
            </div>
          </div>
        </div>
      ) : (
        /* Default Form Layout */
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            {schema.fields
              .filter((f) => f.type !== "blocks" && f.type !== "seo")
              .map((field) => (
                <div
                  key={field.name}
                  className={`space-y-2 ${field.type === "text" || field.type === "array" ? "md:col-span-2" : ""}`}
                >
                  <label className="text-sm font-bold text-white/40 ml-1">{field.label}</label>
                  {renderFieldInput(field)}
                </div>
              ))}
          </div>

          {/* Syllabus builder for courses */}
          {schema.collectionName === "courses" && initialData?.id && (
            <div className="pt-10 border-t border-white/5 space-y-6">
              <div className="flex justify-between items-center bg-white/5 p-6 rounded-3xl border border-white/10">
                <div>
                  <h4 className="text-lg font-bold text-white">Course Syllabus Builder</h4>
                  <p className="text-xs text-white/40">Build and order your curriculum modules and lessons.</p>
                </div>
                <button
                  type="button"
                  onClick={() => openSubModal("module")}
                  className="px-5 py-2.5 bg-brand-primary text-black text-xs font-bold rounded-xl hover:bg-white transition-all flex items-center gap-1.5"
                >
                  <Icons.Plus size={14} /> Add Module
                </button>
              </div>

              {/* Curriculum Tree */}
              {courseModules.length === 0 ? (
                <div className="p-8 bg-white/5 rounded-2xl text-center border border-white/5">
                  <p className="text-xs text-white/30 italic">No curriculum modules added to this course yet.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {courseModules.map((mod) => {
                    const moduleLessons = courseLessons.filter((l) => l.moduleId === mod.id);

                    return (
                      <div key={mod.id} className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                        {/* Module Header */}
                        <div className="flex justify-between items-center pb-3 border-b border-white/5">
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-lg bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-bold flex items-center justify-center">
                              {mod.order || 1}
                            </span>
                            <h5 className="font-bold text-white text-sm">{mod.title}</h5>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => openSubModal("lesson", undefined, mod.id)}
                              className="px-3 py-1.5 bg-white/5 border border-white/10 hover:border-brand-primary/30 hover:text-brand-primary text-white/60 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                            >
                              <Icons.Plus size={12} /> Add Lesson
                            </button>
                            <button
                              type="button"
                              onClick={() => openSubModal("module", mod)}
                              className="p-2 text-white/30 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                            >
                              <Icons.Edit size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteSubItem(mod.id, "module")}
                              className="p-2 text-white/30 hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-colors"
                            >
                              <Icons.Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Module Lessons list */}
                        <div className="pl-6 space-y-2">
                          {moduleLessons.length === 0 ? (
                            <p className="text-[11px] text-white/20 italic py-2">No lessons created in this module.</p>
                          ) : (
                            moduleLessons.map((less) => (
                              <div
                                key={less.id}
                                className="flex justify-between items-center p-3.5 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <span className="w-5 h-5 rounded bg-white/5 border border-white/10 text-white/40 text-[10px] font-bold flex items-center justify-center">
                                    {less.order || 1}
                                  </span>
                                  <div>
                                    <span className="text-white/80 font-bold text-xs">{less.title}</span>
                                    {less.isFree && (
                                      <span className="ml-2 px-1.5 py-0.5 rounded bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[9px] font-bold uppercase tracking-wider">
                                        Free Preview
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => openSubModal("lesson", less, mod.id)}
                                    className="p-1.5 text-white/30 hover:text-white rounded transition-colors"
                                  >
                                    <Icons.Edit size={12} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteSubItem(less.id, "lesson")}
                                    className="p-1.5 text-white/30 hover:text-red-500 rounded transition-colors"
                                  >
                                    <Icons.Trash2 size={12} />
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </form>
      )}

      {/* Save and Cancel buttons for non-blog layout or blogs footer */}
      <div className="flex justify-end gap-4 pt-8 border-t border-white/5">
        <button
          type="button"
          onClick={onCancel}
          className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white/80 font-bold rounded-2xl transition-colors text-sm"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSaving}
          className="px-8 py-4 bg-brand-primary hover:bg-white text-black font-bold rounded-2xl transition-all shadow-[0_0_30px_rgba(0,194,255,0.2)] flex items-center gap-2 text-sm disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save Record"}
          <Icons.Save size={18} />
        </button>
      </div>

      {/* Sub-modal popup for syllabus items */}
      {subModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#0A0A0A] rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl">
            <div className="p-6 bg-white/5 border-b border-white/10 flex justify-between items-center">
              <h4 className="font-bold text-white flex items-center gap-2">
                <Icons.Layers size={16} className="text-brand-primary" />
                {subModal.item ? `Modify ${subModal.type}` : `Add ${subModal.type}`}
              </h4>
              <button onClick={() => setSubModal(null)} className="text-white/40 hover:text-white">
                <Icons.X size={16} />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {(subModal.type === "module" ? CMS_SCHEMAS.modules : CMS_SCHEMAS.lessons).fields
                .filter((f) => !f.hiddenInForm)
                .map((field) => (
                  <div key={field.name} className="space-y-2">
                    <label className="text-xs font-bold text-white/40 ml-1">{field.label}</label>
                    {field.type === "string" && (
                      <input
                        type="text"
                        value={subFormData[field.name] ?? ""}
                        onChange={(e) => setSubFormData({ ...subFormData, [field.name]: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-primary text-white text-xs"
                      />
                    )}
                    {field.type === "text" && (
                      <textarea
                        value={subFormData[field.name] ?? ""}
                        onChange={(e) => setSubFormData({ ...subFormData, [field.name]: e.target.value })}
                        rows={4}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-primary text-white text-xs resize-none"
                      />
                    )}
                    {field.type === "number" && (
                      <input
                        type="number"
                        value={subFormData[field.name] ?? ""}
                        onChange={(e) => setSubFormData({ ...subFormData, [field.name]: Number(e.target.value) })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-primary text-white text-xs"
                      />
                    )}
                    {field.type === "boolean" && (
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => setSubFormData({ ...subFormData, [field.name]: !subFormData[field.name] })}
                          className={`w-10 h-5 rounded-full transition-all duration-300 relative ${
                            subFormData[field.name] ? "bg-brand-primary shadow-[0_0_10px_rgba(0,194,255,0.4)]" : "bg-white/10"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all duration-300 ${
                              subFormData[field.name] ? "left-5.5" : "left-0.5"
                            }`}
                          />
                        </button>
                        <span className="text-xs font-bold text-white/50">{subFormData[field.name] ? "Enabled" : "Disabled"}</span>
                      </div>
                    )}
                  </div>
                ))}
            </div>
            <div className="p-6 bg-white/5 border-t border-white/10 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSubModal(null)}
                className="px-4 py-2 text-xs bg-white/5 hover:bg-white/10 rounded-xl text-white/80 font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveSubItem}
                className="px-5 py-2 text-xs bg-brand-primary text-black font-bold rounded-xl hover:bg-white transition-colors"
              >
                Save {subModal.type}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect, useRef, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Rocket,
  LogIn,
  Trash2,
  Wand2,
  Plus,
  Type,
  ImageIcon,
  Code,
  Quote,
  Info,
  Shield,
  Clock,
  X,
  Save,
  Layout,
  FileText,
  Layers,
  MessageSquare,
  Edit,
  Calendar,
  Eye,
  Search,
  Sparkles,
  Globe,
  AlertCircle,
  CheckCircle2,
  BarChart3,
  History,
  Link as LinkIcon,
  Tag,
  Star,
  ArrowLeft,
  LogOut,
  Mail,
  Zap,
  Maximize2,
  Minimize2,
  ShieldAlert,
} from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  auth,
  db,
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  serverTimestamp,
  getFirebaseStatus,
} from "../firebase";
import { cn } from "../lib/utils";
import { handleFirestoreError, formatDate } from "../lib/firebase-utils";
import { Block, BlockType, SEOData, OperationType } from "../types";
import { FirebaseConfigWarning } from "../components/FirebaseConfigWarning";
import { uploadImage, deleteImageByPath } from "../lib/storage-utils";
import { Toaster, Toast } from "../components/ui/Toaster";
import { useSEO } from "../hooks/useSEO";

// Import Extracted Atoms & Subsystems
import { HealthDashboard } from "../components/admin/layout/HealthDashboard";
import { ImageUploadField } from "../components/admin/shared/ImageUploadField";
import { AdminStatCard } from "../components/admin/analytics/AdminStatCard";
import { SEOPanel } from "../components/admin/seo/SEOPanel";
import { AIWritingAssistant } from "../components/admin/ai/AIWritingAssistant";
import { LiveBlogPreview } from "../components/admin/cms/LiveBlogPreview";
import { SortableBlock } from "../components/admin/cms/SortableBlock";
import { BlogEditorWrapper } from "../components/admin/cms/BlogEditorWrapper";
import { ComposeNewsletterModal } from "../components/admin/shared/ComposeNewsletterModal";

const BLOG_CATEGORIES = [
  "Artificial Intelligence",
  "Robotics",
  "Crypto & Web3",
  "Startups & Venture",
  "Entrepreneurship",
  "Software Engineering",
  "Productivity & Workflow",
  "Future Tech",
  "Cybersecurity",
  "Data Science",
];

// Import Extracted Custom Hooks
import { useAdminAuth } from "../hooks/admin/useAdminAuth";
import { useAdminData } from "../hooks/admin/useAdminData";

// Defensive Normalization Layer: Heals malformed blocks before state updates
const normalizeBlocks = (rawBlocks: any[]): Block[] => {
  return rawBlocks
    .filter((b) => b && typeof b === "object") // Filter out non-objects
    .map((b) => ({
      id: b.id || Math.random().toString(36).substr(2, 9),
      type: (["text", "heading", "image", "list", "quote", "code", "callout", "divider"].includes(b.type)
        ? b.type
        : "text") as BlockType,
      content: typeof b.content === "string" ? b.content : "",
      metadata: b.metadata && typeof b.metadata === "object" ? b.metadata : {},
    }));
};

const AdminDashboard = ({ user, onLogout }: { user: any; onLogout: () => void }) => {
  const [activeTab, setActiveTab] = useState<
    "blogs" | "projects" | "updates" | "messages" | "dashboard" | "subscribers"
  >("dashboard");

  const [showComposeModal, setShowComposeModal] = useState(false);
  const [newsletterData, setNewsletterData] = useState({ subject: "", content: "" });
  const [isSending, setIsSending] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<any>(null);
  const [currentProject, setCurrentProject] = useState<any>(null);
  const [currentUpdate, setCurrentUpdate] = useState<any>(null);

  const [isDistractionFree, setIsDistractionFree] = useState(false);
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const saveInProgressRef = useRef(false);
  const [showCustomCategoryInput, setShowCustomCategoryInput] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: Toast["type"] = "info", duration = 5000) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Consume Extracted Data Synchronization Custom Hook
  const {
    posts,
    projects,
    messages,
    subscribers,
    campaigns,
    updates,
    systemStatus,
    setSystemStatus,
    forceRefresh,
    refreshSecondary,
  } = useAdminData(addToast);

  const [blogFormData, setBlogFormData] = useState({
    title: "",
    slug: "",
    description: "",
    coverImage: "",
    tags: "",
    published: false,
    featured: false,
    category: "Technology",
    scheduledAt: "",
  });

  const [blogCoverFile, setBlogCoverFile] = useState<File | null>(null);
  const [blogCoverPreview, setBlogCoverPreview] = useState<string>("");
  const [blogCoverPath, setBlogCoverPath] = useState<string>("");

  useEffect(() => {
    return () => {
      if (blogCoverPreview) URL.revokeObjectURL(blogCoverPreview);
    };
  }, [blogCoverPreview]);

  const [blocks, setBlocks] = useState<Block[]>([]);
  const [seoData, setSeoData] = useState<SEOData>({
    title: "",
    description: "",
    keywords: "",
    canonicalUrl: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
  });

  const [projectFormData, setProjectFormData] = useState({
    title: "",
    category: "",
    description: "",
    image: "",
    video: "",
    tech: "",
    caseStudy: "",
    link: "",
    vision: "",
    impact: "",
    status: "Live / Scale",
    metrics: JSON.stringify({ growth: "+0%", efficiency: "0%", uptime: "100%" }, null, 2),
    evolution: JSON.stringify([{ v: "v1.0", date: "Q1 2024", note: "Initial Release" }], null, 2),
    slug: "",
    featured: false,
    projectDate: "",
    gallery: "",
  });

  const [updateFormData, setUpdateFormData] = useState({
    title: "",
    text: "",
    date: new Date().toISOString().split("T")[0],
    relatedProject: "",
    statusTag: "Building",
  });

  const [projectImageFile, setProjectImageFile] = useState<File | null>(null);
  const [projectImagePreview, setProjectImagePreview] = useState<string>("");
  const [projectImagePath, setProjectImagePath] = useState<string>("");

  useEffect(() => {
    return () => {
      if (projectImagePreview) URL.revokeObjectURL(projectImagePreview);
    };
  }, [projectImagePreview]);

  const [blogFilter, setBlogFilter] = useState<"all" | "published" | "draft" | "scheduled" | "featured">("all");
  const [blogSearchQuery, setBlogSearchQuery] = useState("");

  // Autosave setup (Runs every 2 minutes inside editor)
  useEffect(() => {
    if (!isEditing || !currentPost) return;
    const timer = setInterval(() => {
      handleSaveBlog(true);
    }, 120000);
    return () => clearInterval(timer);
  }, [isEditing, currentPost, blogFormData, blocks, seoData]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleOneClickPublish = async () => {
    setIsAIProcessing(true);
    try {
      const content = blocks
        .filter((b) => b.type === "text" || b.type === "heading")
        .map((b) => b.content)
        .join(" ");
      const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
      if (!apiKey) throw new Error("GOOGLE_API_KEY is not defined");

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Act as an expert SEO Specialist. Based on the following content, generate:
      1. A catchy, SEO-friendly title (max 60 chars)
      2. A compelling meta description (max 160 chars)
      3. A list of 5 relevant tags (comma separated)
      4. A clean URL slug
      
      Return JSON only in this format: {"title": "...", "description": "...", "tags": "...", "slug": "..."}
      
      Content: ${content.substring(0, 5000)}`;

      const result = await model.generateContent(prompt);
      const data = JSON.parse(
        result.response
          .text()
          .replace(/```json|```/g, "")
          .trim()
      );

      setSeoData({
        ...seoData,
        title: data.title,
        description: data.description,
        keywords: data.tags,
      });

      setBlogFormData((prev) => ({
        ...prev,
        title: data.title,
        slug: data.slug,
        description: data.description,
        tags: data.tags,
        published: true,
      }));

      await handleSaveBlog(false);
      setIsEditing(false);
    } catch (error) {
      console.error("One-Click Publish failed:", error);
      addToast("Failed to compile content payload.", "error");
    } finally {
      setIsAIProcessing(false);
    }
  };

  const calculateContentScore = () => {
    let score = 0;
    if (blogFormData.title && blogFormData.title.length > 10) score += 20;
    if (blogFormData.description && blogFormData.description.length > 50) score += 20;
    if (blogFormData.coverImage) score += 10;
    
    const tagsStr = typeof blogFormData.tags === "string" ? blogFormData.tags : "";
    if (tagsStr && tagsStr.split(",").length >= 3) score += 10;

    const wordCount = blocks
      .filter((b) => b.type === "text")
      .reduce((acc, b) => acc + (typeof b.content === "string" ? b.content.split(" ").length : 0), 0);
    if (wordCount > 300) score += 20;
    if (wordCount > 1000) score += 10;

    const hasHeadings = blocks.some((b) => b.type === "heading");
    if (hasHeadings) score += 10;

    return Math.min(score, 100);
  };

  const getContentIssues = () => {
    const issues = [];
    if (!blogFormData.title || blogFormData.title.length < 10)
      issues.push("Title is too short or missing for optimal SEO.");
    if (!blogFormData.description || blogFormData.description.length < 50)
      issues.push("Meta description is missing or lacks depth.");
    if (!blogFormData.coverImage)
      issues.push("No cover visualization detected.");

    const wordCount = blocks
      .filter((b) => b.type === "text")
      .reduce((acc, b) => acc + (typeof b.content === "string" ? b.content.split(" ").length : 0), 0);
    if (wordCount < 300) issues.push("Content is thin. Aim for 500+ words.");

    const hasHeadings = blocks.some((b) => b.type === "heading");
    if (!hasHeadings) issues.push("No structure headings (H2/H3) found.");

    return issues;
  };

  const testConnection = async () => {
    setIsAuditing(true);
    try {
      const testRef = collection(db, "test_connection");
      await addDoc(testRef, {
        status: "firebase-working",
        time: serverTimestamp(),
        author: user.email,
      });
      addToast("Firebase connection confirmed.", "success");
    } catch (error: any) {
      console.error("Firestore test connection failure:", error);
      const errInfo = handleFirestoreError(error, OperationType.CREATE, "test_connection");

      if (errInfo.isQuotaExceeded) {
        addToast("CRITICAL: daily limit reached (Quota Exceeded).", "error");
        setSystemStatus((prev) => ({ ...prev, isQuotaExceeded: true, lastError: "Quota Exceeded" }));
      } else {
        addToast(`Backend Error: ${error.message}`, "error");
      }
    } finally {
      setIsAuditing(false);
    }
  };

  const handleAIAction = async (action: string, blockId?: string) => {
    if (isAIProcessing) return;
    setIsAIProcessing(true);

    try {
      const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
      if (!apiKey) throw new Error("GOOGLE_API_KEY is not defined");

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      let prompt = "";
      let targetContent = "";

      if (blockId) {
        const block = blocks.find((b) => b.id === blockId);
        if (!block) return;
        targetContent = block.content;
      } else {
        targetContent = blocks
          .filter((b) => b.type === "text")
          .map((b) => b.content)
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
        setBlocks((prev) =>
          prev.map((b) => (b.id === blockId ? { ...b, content: result } : b))
        );
        addToast("AI formatting successfully applied.", "success");
      } else {
        switch (action) {
          case "summary":
            setSeoData((prev) => ({ ...prev, description: cleanResult }));
            setBlogFormData((prev) => ({ ...prev, description: cleanResult }));
            break;
          case "keywords":
            const keywords = cleanResult.split("\n").join(", ");
            setSeoData((prev) => ({ ...prev, keywords }));
            setBlogFormData((prev) => ({ ...prev, tags: keywords }));
            break;
          case "title":
            setSeoData((prev) => ({ ...prev, title: cleanResult }));
            setBlogFormData((prev) => ({
              ...prev,
              title: cleanResult,
              slug: generateSlug(cleanResult),
            }));
            break;
          default:
            const newBlock: Block = {
              id: Date.now().toString(),
              type: "callout",
              content: result,
              metadata: { title: `AI ${action} Suggestion` },
            };
            setBlocks((prev) => normalizeBlocks([...prev, newBlock]));
        }
        addToast(`AI ${action} suggestions rendered.`, "success");
      }
    } catch (error) {
      console.error("AI Assistant failure:", error);
      addToast("AI Assistant failed.", "error");
    } finally {
      setIsAIProcessing(false);
    }
  };

  const handleSendNewsletter = async (resumingCampaignId?: string, isTest?: boolean) => {
    setIsSending(true);
    try {
      const userInstance = auth.currentUser;
      if (!userInstance) throw new Error("Not authenticated");
      const token = await userInstance.getIdToken();

      const payload = {
        subject: newsletterData.subject,
        content: newsletterData.content,
        campaignId: resumingCampaignId,
        isTestMode: isTest,
      };

      if (resumingCampaignId) {
        const camp = campaigns.find((c) => c.id === resumingCampaignId);
        payload.subject = camp.subject;
        payload.content = camp.content;
      }

      const response = await fetch("/api/newsletter/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to send");

      addToast(result.message, "success");

      if (!isTest) {
        setShowComposeModal(false);
        setNewsletterData({ subject: "", content: "" });
        refreshSecondary();
      }
    } catch (err: any) {
      addToast(err.message, "error");
    } finally {
      setIsSending(false);
    }
  };

  const handleEditBlog = (post: any) => {
    setCurrentPost(post);
    setBlogFormData({
      title: post.title,
      slug: post.slug,
      description: post.description || "",
      coverImage: post.coverImage || "",
      tags: Array.isArray(post.tags) ? post.tags.join(", ") : post.tags || "",
      published: post.published || false,
      featured: post.featured || false,
      category: post.category || "Artificial Intelligence",
      scheduledAt: post.scheduledAt || "",
    });
    setBlogCoverPath(post.coverImagePath || "");
    setBlogCoverFile(null);
    if (blogCoverPreview) URL.revokeObjectURL(blogCoverPreview);
    setBlogCoverPreview("");
    setShowCustomCategoryInput(post.category && !BLOG_CATEGORIES.includes(post.category));
    setBlocks(normalizeBlocks(post.blocks || [{ id: "1", type: "text", content: "" }]));
    setSeoData(
      post.seo || {
        title: post.title,
        description: post.description || "",
        keywords: "",
        canonicalUrl: "",
        ogTitle: "",
        ogDescription: "",
        ogImage: post.coverImage || "",
      }
    );
    setIsEditing(true);
  };

  const resetBlogForm = () => {
    setBlogFormData({
      title: "",
      slug: "",
      description: "",
      coverImage: "",
      tags: "",
      published: false,
      featured: false,
      category: "Artificial Intelligence",
      scheduledAt: "",
    });
    setBlogCoverPath("");
    setBlogCoverFile(null);
    if (blogCoverPreview) URL.revokeObjectURL(blogCoverPreview);
    setBlogCoverPreview("");
    setShowCustomCategoryInput(false);
    setBlocks(normalizeBlocks([{ id: "1", type: "text", content: "" }]));
    setSeoData({
      title: "",
      description: "",
      keywords: "",
      canonicalUrl: "",
      ogTitle: "",
      ogDescription: "",
      ogImage: "",
    });
  };

  const handleSaveBlog = async (eOrAutosave: React.FormEvent | boolean | "toggle") => {
    if (typeof eOrAutosave !== "boolean" && eOrAutosave !== "toggle") eOrAutosave.preventDefault();
    const isAutosave = typeof eOrAutosave === "boolean" ? eOrAutosave : false;
    const isToggle = eOrAutosave === "toggle";
    let nextPublished = blogFormData.published;

    if (isToggle) {
      nextPublished = !blogFormData.published;
      setBlogFormData((prev) => ({ ...prev, published: nextPublished }));
    }

    if (saveInProgressRef.current) {
      console.log("⏳ [SAVE] Pipeline busy. Skipping concurrent request.");
      return;
    }

    if (!isAutosave && !blogFormData.title.trim()) {
      addToast("Validation Error: Please add a title.", "warning");
      return;
    }

    // Delegating validation entirely to Firestore Rules.
    // Client strictly sends data; backend rejects invalid writes.

    const newlyUploadedPaths: string[] = [];
    const oldCoverPath = currentPost?.coverImagePath ?? blogCoverPath ?? "";
    const oldBlockPaths = (currentPost?.blocks || [])
      .filter((b: any) => b.type === "image")
      .map((b: any) => b.metadata?.fullPath)
      .filter(Boolean);

    try {
      saveInProgressRef.current = true;
      if (!isAutosave) setIsSaving(true);

      console.log(`🚀 [SAVE] Starting ${isAutosave ? "Autosave" : "Manual Save"} pipeline...`);

      const pipelinePromise = (async () => {
        let finalCoverUrl = blogFormData.coverImage;
        let finalCoverPath = blogCoverPath;

        if (blogCoverFile) {
          const up = await uploadImage(blogCoverFile, "blog_covers");
          newlyUploadedPaths.push(up.fullPath);
          finalCoverUrl = up.url;
          finalCoverPath = up.fullPath;
        }

        const finalBlocks = [...blocks];
        for (let i = 0; i < finalBlocks.length; i++) {
          const b = finalBlocks[i];
          if (b.type === "image" && b.localFile) {
            const u = await uploadImage(b.localFile, "blog_images");
            newlyUploadedPaths.push(u.fullPath);

            const { localFile, localPreview, metadata, ...rest } = b;
            finalBlocks[i] = {
              ...rest,
              content: u.url,
              metadata: { ...metadata, fullPath: u.fullPath },
            };
          }
        }

        const sanitizedBlocks = finalBlocks.map((b) => {
          const { localFile, localPreview, ...rest } = b;
          return rest;
        });

        const textContent = finalBlocks
          .filter((b) => b.type === "text" || b.type === "heading")
          .map((b) => (typeof b.content === "string" ? b.content.replace(/<[^>]*>/g, "") : ""))
          .join(" ");
        const wordCount = textContent.trim() ? textContent.trim().split(/\s+/).length : 0;
        const readingTime = Math.max(1, Math.ceil(wordCount / 200));

        const postData = {
          ...blogFormData,
          published: nextPublished,
          coverImage: finalCoverUrl,
          coverImagePath: finalCoverPath,
          blocks: sanitizedBlocks,
          content: textContent,
          seo: {
            ...seoData,
            ogImage: seoData.ogImage || finalCoverUrl,
          },
          tags:
            typeof blogFormData.tags === "string"
              ? blogFormData.tags
                  .split(",")
                  .map((t) => t.trim())
                  .filter((t) => t)
              : blogFormData.tags,
          updatedAt: serverTimestamp(),
          author: user.email,
          readingTime,
        };

        if (currentPost) {
          await updateDoc(doc(db, "blogPosts", currentPost.id), postData);

          // Storage Cleanups
          const newBlockPaths = sanitizedBlocks
            .filter((b: any) => b.type === "image")
            .map((b: any) => b.metadata?.fullPath)
            .filter(Boolean);
          const toDelete = new Set<string>();

          if (finalCoverPath && oldCoverPath && finalCoverPath !== oldCoverPath)
            toDelete.add(oldCoverPath);

          const newSet = new Set(newBlockPaths);
          for (const p of oldBlockPaths) if (p && !newSet.has(p)) toDelete.add(p);

          if (toDelete.size > 0) {
            await Promise.all([...toDelete].map((p) => deleteImageByPath(p)));
          }
        } else if (!isAutosave) {
          await addDoc(collection(db, "blogPosts"), {
            ...postData,
            createdAt: serverTimestamp(),
            views: 0,
          });
        }

        return sanitizedBlocks;
      })();

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Save pipeline timed out (45s).")), 45000)
      );

      const processedBlocks = (await Promise.race([
        pipelinePromise,
        timeoutPromise,
      ])) as Block[];

      setLastSaved(new Date());
      if (!isAutosave) {
        addToast(currentPost ? "Post Updated" : "Draft Saved", "success");
        if (!currentPost) {
          setIsEditing(false);
          setCurrentPost(null);
          resetBlogForm();
        }
      } else {
        setBlocks(
          processedBlocks.map((b) => ({
            ...b,
            localFile: undefined,
            localPreview: undefined,
          }))
        );
      }
    } catch (error: any) {
      console.error("Save pipeline failure:", error);
      if (newlyUploadedPaths.length > 0) {
        await Promise.all(newlyUploadedPaths.map((p) => deleteImageByPath(p)));
      }

      if (!isAutosave) {
        let errorMsg = `System Error: ${error.message}`;
        if (error.code === "permission-denied") {
          errorMsg = "Security Error: Permission Denied.";
        }
        addToast(errorMsg, "error");
      }
    } finally {
      setIsSaving(false);
      saveInProgressRef.current = false;
    }
  };

  const handleSaveProject = async (e: FormEvent) => {
    e.preventDefault();
    if (saveInProgressRef.current) return;

    if (!projectFormData.title.trim()) {
      addToast("Validation Error: Please add a title.", "warning");
      return;
    }

    // Delegating validation entirely to Firestore Rules.

    try {
      saveInProgressRef.current = true;
      setIsSaving(true);

      const pipelinePromise = (async () => {
        let uploaded: { url: string; fullPath: string } | null = null;
        const oldImagePath = projectImagePath;

        if (projectImageFile) {
          uploaded = await uploadImage(projectImageFile, "project_images");
        }

        const finalImageUrl = uploaded?.url ?? projectFormData.image;

        const projectData = {
          ...projectFormData,
          image: finalImageUrl || "",
          imagePath: uploaded?.fullPath ?? projectImagePath ?? "",
          tech: projectFormData.tech
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          slug: projectFormData.slug || generateSlug(projectFormData.title),
          gallery: projectFormData.gallery
            .split(",")
            .map((g) => g.trim())
            .filter(Boolean),
          metrics: (() => {
            try {
              return JSON.parse(projectFormData.metrics);
            } catch {
              return {};
            }
          })(),
          evolution: (() => {
            try {
              return JSON.parse(projectFormData.evolution);
            } catch {
              return [];
            }
          })(),
          updatedAt: serverTimestamp(),
        };

        if (currentProject) {
          await updateDoc(doc(db, "projects", currentProject.id), projectData);
          if (uploaded?.fullPath && oldImagePath && oldImagePath !== uploaded.fullPath) {
            await deleteImageByPath(oldImagePath);
          }
        } else {
          const newRef = doc(collection(db, "projects"));
          await setDoc(newRef, { ...projectData, createdAt: serverTimestamp() });
        }

        return uploaded;
      })();

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Project save timed out (30s)")), 30000)
      );

      await Promise.race([pipelinePromise, timeoutPromise]);

      setIsEditing(false);
      setCurrentProject(null);
      setProjectFormData({
        title: "",
        category: "",
        description: "",
        image: "",
        video: "",
        tech: "",
        caseStudy: "",
        link: "",
        vision: "",
        impact: "",
        status: "Live / Scale",
        metrics: "{}",
        evolution: "[]",
        slug: "",
        featured: false,
        projectDate: "",
        gallery: "",
      });
      setProjectImagePath("");
      setProjectImageFile(null);
      if (projectImagePreview) URL.revokeObjectURL(projectImagePreview);
      setProjectImagePreview("");
      addToast(currentProject ? "Project Updated" : "Project Created", "success");
    } catch (error: any) {
      console.error("Project save failure:", error);
      addToast(`Project Error: ${error.message}`, "error");
    } finally {
      setIsSaving(false);
      saveInProgressRef.current = false;
    }
  };

  const handleSaveUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (saveInProgressRef.current) return;
    try {
      saveInProgressRef.current = true;
      setIsSaving(true);
      const updateData = { ...updateFormData, updatedAt: serverTimestamp() };
      if (currentUpdate) {
        await updateDoc(doc(db, "updates", currentUpdate.id), updateData);
      } else {
        await addDoc(collection(db, "updates"), { ...updateData, createdAt: serverTimestamp() });
      }
      setIsEditing(false);
      setCurrentUpdate(null);
      setUpdateFormData({
        title: "",
        text: "",
        date: new Date().toISOString().split("T")[0],
        relatedProject: "",
        statusTag: "Building",
      });
      addToast(currentUpdate ? "Update Modified" : "Update Published", "success");
      refreshSecondary();
    } catch (error: any) {
      addToast(`Update Error: ${error.message}`, "error");
    } finally {
      setIsSaving(false);
      saveInProgressRef.current = false;
    }
  };

  const handleToggleMessageStatus = async (id: string, currentStatus: string) => {
    try {
      await updateDoc(doc(db, "contacts", id), {
        status: currentStatus === "read" ? "unread" : "read",
      });
      refreshSecondary();
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, "contacts");
    }
  };

  const handleDelete = async (id: string, collectionName: string) => {
    const itemType =
      collectionName === "blogPosts"
        ? "post"
        : collectionName === "projects"
        ? "project"
        : collectionName === "updates"
        ? "update"
        : "message";
    if (window.confirm(`Are you sure you want to delete this ${itemType}?`)) {
      try {
        await deleteDoc(doc(db, collectionName, id));
        addToast("Item successfully deleted.", "success");
        if (collectionName !== "blogPosts" && collectionName !== "projects") {
          refreshSecondary();
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, collectionName);
        addToast("Deletion failed.", "error");
      }
    }
  };

  if (isDistractionFree && isEditing) {
    return (
      <div className="fixed inset-0 z-[10000] bg-[#0A0A0A] overflow-y-auto p-4 md:p-12 lg:p-24 selection:bg-brand-primary selection:text-black">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-32">
            <div className="flex items-center gap-4 text-white/10">
              <Shield size={20} />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
                Immersive Focus Mode
              </span>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/20 flex items-center gap-3">
                <div className="w-1 h-1 rounded-full bg-brand-primary animate-pulse" />
                {lastSaved ? `Synced ${lastSaved.toLocaleTimeString()}` : "Buffer Active"}
              </div>
              <button
                onClick={() => setIsDistractionFree(false)}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all animate-none"
              >
                <Minimize2 size={24} />
              </button>
            </div>
          </div>

          <input
            type="text"
            value={blogFormData.title}
            onChange={(e) =>
              setBlogFormData({
                ...blogFormData,
                title: e.target.value,
                slug: generateSlug(e.target.value),
              })
            }
            className="w-full bg-transparent border-none outline-none text-6xl md:text-8xl font-bold mb-16 tracking-tighter text-white placeholder:text-white/5"
            placeholder="Narrative Title"
          />

          <BlogEditorWrapper
            blocks={blocks}
            setBlocks={setBlocks}
            onAIAction={(id, action) => handleAIAction(action, id)}
            activeTab={activeTab}
            setBlogFormData={setBlogFormData}
            setProjectFormData={setProjectFormData}
            setSeoData={setSeoData}
          />
        </div>
        <Toaster toasts={toasts} removeToast={removeToast} />
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-[#0A0A0A] min-h-screen text-left">
      <div className="container mx-auto px-6">
        {!isEditing && (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <div>
              <h1 className="text-4xl font-bold text-white">
                Creator <span className="text-brand-primary">Studio</span>
              </h1>
              <p className="text-white/40">Manage your content and authority signals</p>
            </div>
            <div className="flex gap-4">
              {activeTab !== "messages" && activeTab !== "dashboard" && !isEditing && (
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setCurrentPost(null);
                    setCurrentProject(null);
                    setCurrentUpdate(null);
                    if (activeTab === "blogs") {
                      resetBlogForm();
                    } else if (activeTab === "projects") {
                      setProjectFormData({
                        title: "",
                        category: "",
                        description: "",
                        image: "",
                        video: "",
                        tech: "",
                        caseStudy: "",
                        link: "",
                        vision: "",
                        impact: "",
                        status: "Live / Scale",
                        metrics: "{}",
                        evolution: "[]",
                        slug: "",
                        featured: false,
                        projectDate: "",
                        gallery: "",
                      });
                    } else if (activeTab === "updates") {
                      setUpdateFormData({
                        title: "",
                        text: "",
                        date: new Date().toISOString().split("T")[0],
                        relatedProject: "",
                        statusTag: "Building",
                      });
                    }
                  }}
                  className="px-8 py-4 bg-brand-primary text-white rounded-2xl font-bold flex items-center gap-2"
                >
                  <Plus size={20} /> Create{" "}
                  {activeTab === "blogs"
                    ? "Post"
                    : activeTab === "projects"
                    ? "Project"
                    : "Update"}
                </button>
              )}
              <button
                onClick={onLogout}
                className="px-8 py-4 bg-white/5 border border-white/10 text-white/40 rounded-2xl font-bold flex items-center gap-2 hover:text-white transition-colors"
              >
                <LogOut size={20} /> Logout
              </button>
            </div>
          </div>
        )}

        {!isEditing && (
          <div className="flex flex-wrap gap-4 mb-12">
            {[
              { id: "dashboard", label: "Dashboard", icon: <Layout size={18} /> },
              { id: "blogs", label: "Blog Posts", icon: <FileText size={18} /> },
              { id: "projects", label: "Projects", icon: <Layers size={18} /> },
              { id: "updates", label: "Updates", icon: <Zap size={18} /> },
              { id: "messages", label: "Messages", icon: <MessageSquare size={18} /> },
              { id: "subscribers", label: "Newsletter", icon: <Mail size={18} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "px-8 py-4 rounded-2xl font-bold transition-all flex items-center gap-2",
                  activeTab === tab.id
                    ? "bg-white text-black"
                    : "bg-white/5 text-white/40 hover:bg-white/10"
                )}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        )}

        {!isEditing && <HealthDashboard />}

        {isEditing ? (
          <div className="space-y-12 flex flex-col">
            {activeTab === "blogs" ? (
              <>
                {/* Editor Header & Controls */}
                <div className="sticky top-[80px] z-[80] flex flex-col lg:flex-row items-center justify-between gap-6 pb-8 border-b border-white/5 bg-[#080808]/80 backdrop-blur-xl">
                  <div className="flex items-center gap-6">
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setCurrentPost(null);
                        setIsPreviewMode(false);
                      }}
                      className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all group"
                    >
                      <ArrowLeft
                        size={20}
                        className="group-hover:-translate-x-1 transition-transform"
                      />
                    </button>
                    <div>
                      <div className="flex items-center gap-4 max-w-xl">
                        <h2 className="text-2xl font-bold tracking-tight text-white truncate">
                          {blogFormData.title || "New Narrative"}
                        </h2>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-white/20 mt-1">
                        <span className="flex items-center gap-1.5">
                          <Clock size={12} className="text-brand-primary" />{" "}
                          {lastSaved
                            ? `Autosaved ${lastSaved.toLocaleTimeString()}`
                            : "Draft"}
                        </span>
                        <div className="w-1 h-1 rounded-full bg-white/10" />
                        <span className="text-brand-primary/60">Elite AI Pipeline v3</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 md:gap-3 shrink-0">
                    <button
                      onClick={() => setIsPreviewMode(!isPreviewMode)}
                      className={cn(
                        "px-4 md:px-6 py-3 rounded-2xl font-bold text-xs md:text-sm flex items-center gap-2 transition-all border",
                        isPreviewMode
                          ? "bg-brand-primary text-black border-brand-primary"
                          : "bg-white/5 text-white/40 border-white/10 hover:text-white hover:bg-white/10"
                      )}
                    >
                      {isPreviewMode ? <Edit size={16} /> : <Eye size={16} />}
                      <span className="hidden sm:inline">
                        {isPreviewMode ? "Edit Mode" : "Live Preview"}
                      </span>
                      {!isPreviewMode && <span className="sm:hidden">Preview</span>}
                    </button>

                    <button
                      onClick={() => setIsDistractionFree(true)}
                      className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all group shrink-0"
                      title="Full Screen Writing"
                    >
                      <Maximize2 size={18} className="group-hover:scale-110 transition-transform" />
                    </button>

                    <button
                      onClick={handleOneClickPublish}
                      disabled={isAIProcessing}
                      className="px-4 md:px-8 py-3 bg-brand-primary text-white rounded-2xl font-bold hover:bg-brand-primary/90 transition-all text-xs md:text-sm shadow-lg shadow-brand-primary/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-wait group shrink-0"
                    >
                      {isAIProcessing ? (
                        <Sparkles size={16} className="animate-spin text-black" />
                      ) : (
                        <Zap size={16} className="group-hover:animate-pulse" />
                      )}
                      <span className="hidden md:inline">One-Click Publish</span>
                      <span className="md:hidden">Publish</span>
                    </button>

                    <div className="w-px h-6 bg-white/10 mx-1 hidden lg:block" />

                    <button
                      onClick={() => handleSaveBlog(false)}
                      disabled={isSaving}
                      className="px-4 md:px-8 py-3 bg-white text-black rounded-2xl font-bold hover:bg-white/90 transition-all text-xs md:text-sm flex items-center gap-2 disabled:opacity-50 shrink-0"
                    >
                      {isSaving ? <Clock size={16} className="animate-spin" /> : <Save size={16} />}
                      {currentPost
                        ? blogFormData.published
                          ? "Update Live"
                          : "Update Draft"
                        : "Save Draft"}
                    </button>

                    <div className="w-px h-6 bg-white/10 mx-1 hidden lg:block" />

                    <button
                      onClick={() => handleSaveBlog("toggle")}
                      disabled={isSaving}
                      className={cn(
                        "px-4 md:px-8 py-3 rounded-2xl font-bold transition-all text-xs md:text-sm flex items-center gap-2",
                        blogFormData.published
                          ? "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20"
                          : "bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500/20"
                      )}
                    >
                      {blogFormData.published ? "Unpublish" : "Go Live"}
                    </button>
                  </div>
                </div>

                {/* Editor Surface Panel */}
                <div
                  className={cn(
                    "grid gap-12 flex-1 overflow-hidden transition-all duration-700",
                    isPreviewMode
                      ? "lg:grid-cols-[1fr_1fr]"
                      : "lg:grid-cols-[1fr_380px] grid-cols-1"
                  )}
                >
                  <div
                    className={cn(
                      "min-h-screen pr-4 space-y-12 py-12",
                      isPreviewMode && "hidden lg:block"
                    )}
                  >
                    <div className="max-w-5xl mx-auto space-y-20">
                      <div className="space-y-8">
                        <input
                          type="text"
                          value={blogFormData.title}
                          onChange={(e) => {
                            const newTitle = e.target.value;
                            setBlogFormData((prev) => ({
                              ...prev,
                              title: newTitle,
                              slug: currentPost ? prev.slug : generateSlug(newTitle),
                            }));
                          }}
                          className="w-full bg-transparent border-none outline-none text-6xl font-bold tracking-tighter text-white placeholder:text-white/10"
                          placeholder="Narrative Title"
                        />
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                            <LinkIcon size={14} className="text-white/20" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">
                              Slug:
                            </span>
                            <input
                              type="text"
                              value={blogFormData.slug}
                              onChange={(e) =>
                                setBlogFormData({ ...blogFormData, slug: e.target.value })
                              }
                              className="bg-transparent border-none outline-none text-xs font-bold text-brand-primary w-48"
                            />
                          </div>
                          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                            <Tag size={14} className="text-white/20" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">
                              Tags:
                            </span>
                            <input
                              type="text"
                              value={blogFormData.tags}
                              onChange={(e) =>
                                setBlogFormData({ ...blogFormData, tags: e.target.value })
                              }
                              placeholder="Comma separated"
                              className="bg-transparent border-none outline-none text-xs font-bold text-white/60 w-48"
                            />
                          </div>
                        </div>
                      </div>

                      <BlogEditorWrapper
                        blocks={blocks}
                        setBlocks={setBlocks}
                        onAIAction={(id, action) => handleAIAction(action, id)}
                        activeTab={activeTab}
                        setBlogFormData={setBlogFormData}
                        setProjectFormData={setProjectFormData}
                        setSeoData={setSeoData}
                      />

                      <div className="grid md:grid-cols-2 gap-8 border-t border-white/5 pt-12">
                        <div className="space-y-4">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-white/20 ml-1">
                            Featured Visualization
                          </label>
                          <ImageUploadField
                            value={blogFormData.coverImage}
                            onChange={(url) =>
                              setBlogFormData((prev) => ({ ...prev, coverImage: url }))
                            }
                            onPathChange={(path) => setBlogCoverPath(path)}
                          />
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-white/20 ml-1">
                            Narrative Status
                          </label>
                          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                            <Globe
                              size={20}
                              className={blogFormData.published ? "text-green-500" : "text-white/20"}
                            />
                            <div className="flex-1">
                              <div className="font-bold text-sm text-white">
                                {blogFormData.published ? "Visible to World" : "Internal Draft"}
                              </div>
                              <div className="text-[10px] text-white/20 uppercase tracking-widest">
                                Visibility Control
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                setBlogFormData((prev) => ({ ...prev, published: !prev.published }))
                              }
                              className={cn(
                                "w-12 h-6 rounded-full relative transition-all",
                                blogFormData.published ? "bg-green-500" : "bg-white/10"
                              )}
                            >
                              <div
                                className={cn(
                                  "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                                  blogFormData.published ? "right-1" : "left-1"
                                )}
                              />
                            </button>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-white/20 ml-1">
                            Pillar (Category)
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {BLOG_CATEGORIES.slice(0, 4).map((cat) => (
                              <button
                                key={cat}
                                type="button"
                                onClick={() => setBlogFormData({ ...blogFormData, category: cat })}
                                className={cn(
                                  "px-3 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all",
                                  blogFormData.category === cat
                                    ? "bg-brand-primary/10 border-brand-primary/40 text-brand-primary"
                                    : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
                                )}
                              >
                                {cat}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative py-12">
                    <div className="sticky top-40 space-y-8">
                      {isPreviewMode ? (
                        <LiveBlogPreview postData={blogFormData} blocks={blocks} />
                      ) : (
                        <div className="max-w-md mx-auto space-y-8">
                          <AIWritingAssistant
                            onAction={handleAIAction}
                            isProcessing={isAIProcessing}
                          />
                          <div className="p-10 bg-white/[0.02] border border-white/10 rounded-[40px] space-y-10">
                            <h3 className="text-xl font-bold flex items-center gap-3 text-white">
                              <Globe size={20} className="text-brand-primary" /> SEO Engine
                            </h3>
                            <SEOPanel
                              data={seoData}
                              setData={setSeoData}
                              blocks={blocks}
                              onAIAction={(id, action) => handleAIAction(action, id)}
                              isProcessing={isAIProcessing}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <form
                onSubmit={handleSaveProject}
                className="glass-card p-12 rounded-[40px] border border-white/10 space-y-8"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-white">
                    {currentProject ? "Edit Project" : "New Project"}
                  </h2>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setCurrentProject(null);
                    }}
                    className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all animate-none"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-white/40 ml-1">Title</label>
                    <input
                      type="text"
                      value={projectFormData.title}
                      onChange={(e) =>
                        setProjectFormData({ ...projectFormData, title: e.target.value })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-white/40 ml-1">Category</label>
                    <input
                      type="text"
                      value={projectFormData.category}
                      onChange={(e) =>
                        setProjectFormData({ ...projectFormData, category: e.target.value })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary text-white"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/40 ml-1">Description</label>
                  <textarea
                    value={projectFormData.description}
                    onChange={(e) =>
                      setProjectFormData({ ...projectFormData, description: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary h-24 resize-none text-white"
                    required
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-white/40 ml-1">
                      Image URL (optional if uploading a file)
                    </label>
                    <input
                      type="text"
                      value={projectFormData.image}
                      onChange={(e) =>
                        setProjectFormData({ ...projectFormData, image: e.target.value })
                      }
                      placeholder="https://..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary text-white mb-4"
                    />

                    <label className="text-sm font-bold text-white/40 ml-1">Or Upload Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;

                        if (projectImagePreview) URL.revokeObjectURL(projectImagePreview);

                        if (!file) {
                          setProjectImageFile(null);
                          setProjectImagePreview("");
                          return;
                        }

                        setProjectImageFile(file);
                        setProjectImagePreview(URL.createObjectURL(file));
                      }}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary text-white"
                    />

                    {(projectImagePreview || projectFormData.image) && (
                      <div className="mt-4 aspect-video rounded-2xl overflow-hidden border border-white/10">
                        <img
                          src={projectImagePreview || projectFormData.image}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-white/40 ml-1">Video URL (Optional)</label>
                    <input
                      type="text"
                      value={projectFormData.video}
                      onChange={(e) =>
                        setProjectFormData({ ...projectFormData, video: e.target.value })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary text-white"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-white/40 ml-1">Project Slug (URL)</label>
                    <input
                      type="text"
                      value={projectFormData.slug}
                      onChange={(e) =>
                        setProjectFormData({ ...projectFormData, slug: e.target.value })
                      }
                      placeholder="e.g. ecosystem-alpha"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-white/40 ml-1">Project Date</label>
                    <input
                      type="date"
                      value={projectFormData.projectDate}
                      onChange={(e) =>
                        setProjectFormData({ ...projectFormData, projectDate: e.target.value })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary text-white"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-white/40 ml-1">
                      Gallery Images (Comma separated URLs)
                    </label>
                    <textarea
                      value={projectFormData.gallery}
                      onChange={(e) =>
                        setProjectFormData({ ...projectFormData, gallery: e.target.value })
                      }
                      placeholder="https://img1.jpg, https://img2.jpg"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary h-24 resize-none font-mono text-sm text-white"
                    />
                  </div>
                  <div className="space-y-2 flex flex-col justify-center">
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                      <Star
                        size={20}
                        className={projectFormData.featured ? "text-yellow-500" : "text-white/20"}
                      />
                      <span className="font-bold text-white">Featured Project</span>
                      <button
                        type="button"
                        onClick={() =>
                          setProjectFormData({
                            ...projectFormData,
                            featured: !projectFormData.featured,
                          })
                        }
                        className={cn(
                          "w-12 h-6 rounded-full relative ml-auto transition-all",
                          projectFormData.featured ? "bg-brand-primary" : "bg-white/10"
                        )}
                      >
                        <div
                          className={cn(
                            "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                            projectFormData.featured ? "right-1" : "left-1"
                          )}
                        />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-white/40 ml-1">
                      Technologies (comma separated)
                    </label>
                    <input
                      type="text"
                      value={projectFormData.tech}
                      onChange={(e) =>
                        setProjectFormData({ ...projectFormData, tech: e.target.value })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-white/40 ml-1">Project Link</label>
                    <input
                      type="text"
                      value={projectFormData.link}
                      onChange={(e) =>
                        setProjectFormData({ ...projectFormData, link: e.target.value })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary text-white"
                    />
                  </div>
                </div>

                {/* Startup Product Fields */}
                <div className="p-8 rounded-3xl bg-brand-primary/5 border border-brand-primary/10 space-y-8">
                  <h3 className="text-lg font-bold text-brand-primary">
                    Product Showcase Metadata
                  </h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-white/40 ml-1">Product Vision</label>
                      <input
                        type="text"
                        value={projectFormData.vision}
                        onChange={(e) =>
                          setProjectFormData({ ...projectFormData, vision: e.target.value })
                        }
                        placeholder="To become the decentralized nervous system..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-white/40 ml-1">Market Impact</label>
                      <input
                        type="text"
                        value={projectFormData.impact}
                        onChange={(e) =>
                          setProjectFormData({ ...projectFormData, impact: e.target.value })
                        }
                        placeholder="Automating cross-platform intelligence..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary text-white"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-white/40 ml-1">
                        Development Status
                      </label>
                      <select
                        value={projectFormData.status}
                        onChange={(e) =>
                          setProjectFormData({ ...projectFormData, status: e.target.value })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary text-white"
                      >
                        <option value="Live / Scale">Live / Scale</option>
                        <option value="Beta Access">Beta Access</option>
                        <option value="In Development">In Development</option>
                        <option value="Production">Production</option>
                        <option value="R&D">R&D</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-white/40 ml-1">
                        Product Metrics (JSON)
                      </label>
                      <textarea
                        value={projectFormData.metrics}
                        onChange={(e) =>
                          setProjectFormData({ ...projectFormData, metrics: e.target.value })
                        }
                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary font-mono text-xs h-32 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-white/40 ml-1">
                        Evolution Timeline (JSON Array)
                      </label>
                      <textarea
                        value={projectFormData.evolution}
                        onChange={(e) =>
                          setProjectFormData({ ...projectFormData, evolution: e.target.value })
                        }
                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary font-mono text-xs h-32 text-white"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/40 ml-1">
                    Case Study Content (Markdown)
                  </label>
                  <textarea
                    value={projectFormData.caseStudy}
                    onChange={(e) =>
                      setProjectFormData({ ...projectFormData, caseStudy: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary h-64 resize-none font-mono text-white"
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setCurrentProject(null);
                    }}
                    className="px-8 py-4 bg-white/5 border border-white/10 text-white/40 rounded-2xl font-bold hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className={cn(
                      "px-10 py-4 bg-brand-primary text-white rounded-2xl font-bold transition-all flex items-center gap-2",
                      isSaving ? "opacity-70 cursor-not-allowed" : "hover:bg-brand-primary/90"
                    )}
                  >
                    {isSaving ? (
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : null}
                    {isSaving
                      ? currentProject
                        ? "Updating..."
                        : "Creating..."
                      : currentProject
                      ? "Update Project"
                      : "Create Project"}
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <div className="space-y-12">
            {activeTab === "dashboard" && (
              <div className="space-y-12">
                <div className="p-8 rounded-[40px] glass-card border border-white/10 overflow-hidden relative group">
                  <div className="absolute inset-0 bg-brand-primary/[0.01] pointer-events-none" />
                  <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                    <div className="flex items-center gap-6 text-left">
                      <div
                        className={cn(
                          "w-16 h-16 rounded-3xl flex items-center justify-center transition-all duration-500",
                          systemStatus.isQuotaExceeded
                            ? "bg-red-500/20 text-red-500 animate-pulse"
                            : "bg-brand-primary/10 text-brand-primary"
                        )}
                      >
                        {systemStatus.isQuotaExceeded ? (
                          <ShieldAlert size={32} />
                        ) : (
                          <Zap size={32} />
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-bold text-white">System Integrity</h3>
                          <span
                            className={cn(
                              "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                              systemStatus.isQuotaExceeded
                                ? "bg-red-500/20 text-red-400"
                                : "bg-green-500/20 text-green-400"
                            )}
                          >
                            {systemStatus.isQuotaExceeded ? "Degraded" : "Optimal"}
                          </span>
                        </div>
                        <p className="text-white/40 text-sm">
                          {systemStatus.isQuotaExceeded
                            ? "Data visibility restricted due to Firestore daily quota limits."
                            : `Backend connected. Last sync: ${
                                systemStatus.lastSync
                                  ? systemStatus.lastSync.toLocaleTimeString()
                                  : "Initializing..."
                              }`}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={forceRefresh}
                      className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold hover:bg-white/10 transition-all flex items-center gap-3 text-white"
                    >
                      <History size={18} />
                      Refresh Sync
                    </button>
                  </div>

                  {systemStatus.isQuotaExceeded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-8 p-6 rounded-2xl bg-red-500/10 border border-red-500/20 flex gap-4 items-start text-left"
                    >
                      <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
                      <div className="space-y-2">
                        <p className="text-sm font-bold text-red-400">
                          Action Required: Read Limit Reached
                        </p>
                        <p className="text-xs text-white/40 leading-relaxed">
                          Your Firebase free tier has reached its daily limit of 50,000 reads.
                          New content will not load until the quota resets at midnight.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-5 gap-8">
                  <AdminStatCard
                    label="Total Posts"
                    value={posts.length}
                    icon={<FileText size={24} />}
                    trend={
                      posts.filter((p) => {
                        const sevenDaysAgo = new Date();
                        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                        const createdAt = p.createdAt?.seconds
                          ? new Date(p.createdAt.seconds * 1000)
                          : new Date(p.createdAt);
                        return createdAt > sevenDaysAgo;
                      }).length > 0
                        ? `+${
                            posts.filter((p) => {
                              const sevenDaysAgo = new Date();
                              sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                              const createdAt = p.createdAt?.seconds
                                ? new Date(p.createdAt.seconds * 1000)
                                : new Date(p.createdAt);
                              return createdAt > sevenDaysAgo;
                            }).length
                          } new`
                        : undefined
                    }
                  />
                  <AdminStatCard
                    label="Total Views"
                    value={posts.reduce((acc, p) => acc + (p.views || 0), 0)}
                    icon={<Eye size={24} />}
                    trend={posts.some((p) => p.views > 0) ? "Growth" : undefined}
                  />
                  <AdminStatCard
                    label="Messages"
                    value={messages.length}
                    icon={<MessageSquare size={24} />}
                    trend={
                      messages.filter((m) => m.status !== "read").length > 0
                        ? `${messages.filter((m) => m.status !== "read").length} New`
                        : undefined
                    }
                  />
                  <AdminStatCard
                    label="Subscribers"
                    value={subscribers.length}
                    icon={<Mail size={24} />}
                    trend={
                      subscribers.filter((s) => {
                        const date = s.createdAt?.toDate ? s.createdAt.toDate() : new Date(s.createdAt);
                        return date > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                      }).length > 0
                        ? `+${
                            subscribers.filter((s) => {
                              const date = s.createdAt?.toDate ? s.createdAt.toDate() : new Date(s.createdAt);
                              return date > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                            }).length
                          } weekly`
                        : undefined
                    }
                  />
                  <AdminStatCard label="Projects" value={projects.length} icon={<Layers size={24} />} />

                  {/* Phase 3 Diagnostic Button */}
                  <div
                    className="p-8 rounded-[40px] bg-brand-primary/10 border border-brand-primary/20 flex flex-col items-center justify-center text-center gap-4 group hover:bg-brand-primary/20 transition-all cursor-pointer"
                    onClick={testConnection}
                  >
                    <div
                      className={cn(
                        "w-12 h-12 rounded-2xl bg-brand-primary/20 flex items-center justify-center text-brand-primary group-hover:scale-110 transition-all",
                        isAuditing && "animate-spin"
                      )}
                    >
                      <Shield size={24} />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-white">Audit</div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/60">
                        Connection
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                  <div className="glass-card p-10 rounded-[40px] border border-white/10">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-xl font-bold text-white">Popular Posts</h3>
                      <BarChart3 size={20} className="text-white/20" />
                    </div>
                    <div className="space-y-6">
                      {posts
                        .sort((a, b) => (b.views || 0) - (a.views || 0))
                        .slice(0, 5)
                        .map((post, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between group cursor-pointer"
                            onClick={() => handleEditBlog(post)}
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/20 font-bold">
                                {i + 1}
                              </div>
                              <div>
                                <div className="font-bold text-white/80 group-hover:text-brand-primary transition-colors line-clamp-1">
                                  {post.title}
                                </div>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-white/20">
                                  {post.category}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-white/40 font-bold text-sm">
                              <Eye size={14} /> {post.views || 0}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="glass-card p-10 rounded-[40px] border border-white/10">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-xl font-bold text-white">Recent Activity</h3>
                      <History size={20} className="text-white/20" />
                    </div>
                    <div className="space-y-8">
                      {messages.slice(0, 5).map((msg, i) => (
                        <div key={i} className="flex gap-4">
                          <div className="w-2 h-2 rounded-full bg-brand-primary mt-2 shrink-0" />
                          <div>
                            <div className="text-sm text-white/80">
                              <span className="font-bold text-white">{msg.name}</span> sent a
                              message about <span className="font-bold text-white">{msg.subject}</span>
                            </div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-white/20 mt-1">
                              {formatDate(msg.timestamp)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "blogs" && (
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-6 bg-white/5 border border-white/10 rounded-3xl">
                  <div className="flex flex-wrap gap-2">
                    {(["all", "published", "draft", "scheduled", "featured"] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setBlogFilter(f)}
                        className={cn(
                          "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                          blogFilter === f
                            ? "bg-brand-primary text-white"
                            : "text-white/40 hover:text-white hover:bg-white/5"
                        )}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                    <input
                      type="text"
                      placeholder="Search posts..."
                      value={blogSearchQuery}
                      onChange={(e) => setBlogSearchQuery(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm outline-none focus:border-brand-primary text-white"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {posts
                    .filter((p) => {
                      const matchesFilter = (() => {
                        if (blogFilter === "published") return p.published;
                        if (blogFilter === "draft") return !p.published;
                        if (blogFilter === "featured") return p.featured;
                        if (blogFilter === "scheduled")
                          return p.scheduledAt && new Date(p.scheduledAt) > new Date();
                        return true;
                      })();

                      const matchesSearch =
                        (p.title || "").toLowerCase().includes(blogSearchQuery.toLowerCase()) ||
                        (p.category || "").toLowerCase().includes(blogSearchQuery.toLowerCase());

                      return matchesFilter && matchesSearch;
                    })
                    .map((post) => (
                      <div
                        key={post.id}
                        className="glass-card rounded-[40px] border border-white/10 overflow-hidden group hover:border-brand-primary/30 transition-all flex flex-col"
                      >
                        <div className="aspect-video relative overflow-hidden">
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-4 left-4 flex gap-2">
                            {post.published ? (
                              <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-500 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
                                Published
                              </span>
                            ) : (
                              <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-500 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
                                Draft
                              </span>
                            )}
                            {post.featured && (
                              <span className="px-3 py-1 rounded-full bg-brand-primary/20 text-brand-primary text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="p-8 flex-1 flex flex-col">
                          <div className="text-[10px] font-bold uppercase tracking-widest text-brand-primary mb-2">
                            {post.category || "Technology"}
                          </div>
                          <h3 className="text-xl font-bold mb-4 line-clamp-2 text-white">
                            {post.title}
                          </h3>
                          <div className="flex items-center gap-4 text-white/40 text-xs mb-8">
                            <span className="flex items-center gap-1">
                              <Calendar size={12} /> {formatDate(post.createdAt)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye size={12} /> {post.views || 0}
                            </span>
                          </div>
                          <div className="mt-auto flex gap-3 pt-6 border-t border-white/5">
                            <button
                              onClick={() => handleEditBlog(post)}
                              className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 font-bold text-xs hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                            >
                              <Edit size={14} /> Edit
                            </button>
                            <button
                              onClick={() => handleDelete(post.id, "blogPosts")}
                              className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/20 hover:text-red-500 transition-all"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {activeTab === "projects" && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="glass-card rounded-[40px] border border-white/10 overflow-hidden group hover:border-brand-primary/30 transition-all"
                  >
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-8">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-brand-primary mb-2">
                        {project.category}
                      </div>
                      <h3 className="text-xl font-bold mb-6 text-white">{project.title}</h3>
                      <div className="flex gap-3 pt-6 border-t border-white/5">
                        <button
                          onClick={() => {
                            setCurrentProject(project);
                            setProjectFormData({
                              title: project.title,
                              category: project.category,
                              description: project.description,
                              image: project.image,
                              video: project.video || "",
                              tech: Array.isArray(project.tech)
                                ? project.tech.join(", ")
                                : project.tech,
                              caseStudy: project.caseStudy || "",
                              link: project.link || "",
                              vision: project.vision || "",
                              impact: project.impact || "",
                              status: project.status || "Live / Scale",
                              metrics:
                                typeof project.metrics === "object"
                                  ? JSON.stringify(project.metrics, null, 2)
                                  : project.metrics || "{}",
                              evolution:
                                typeof project.evolution === "object"
                                  ? JSON.stringify(project.evolution, null, 2)
                                  : project.evolution || "[]",
                              slug: project.slug || "",
                              featured: project.featured || false,
                              projectDate: project.projectDate || "",
                              gallery: Array.isArray(project.gallery)
                                ? project.gallery.join(", ")
                                : project.gallery || "",
                            });
                            setProjectImagePath(project.imagePath || "");
                            setIsEditing(true);
                          }}
                          className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 font-bold text-xs hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                        >
                          <Edit size={14} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(project.id, "projects")}
                          className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/20 hover:text-red-500 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "updates" && (
              <div className="space-y-8">
                <form
                  onSubmit={handleSaveUpdate}
                  className="glass-card p-10 rounded-[40px] border border-white/10 space-y-6"
                >
                  <h3 className="text-xl font-bold text-white">
                    {currentUpdate ? "Edit Update" : "Publish Update"}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <input
                      type="text"
                      value={updateFormData.title}
                      onChange={(e) =>
                        setUpdateFormData({ ...updateFormData, title: e.target.value })
                      }
                      placeholder="Update Title"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-primary text-white"
                      required
                    />
                    <input
                      type="date"
                      value={updateFormData.date}
                      onChange={(e) => setUpdateFormData({ ...updateFormData, date: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-primary text-white"
                      required
                    />
                  </div>
                  <textarea
                    value={updateFormData.text}
                    onChange={(e) => setUpdateFormData({ ...updateFormData, text: e.target.value })}
                    placeholder="What's new? (Short update text)"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-primary h-24 resize-none text-white"
                    required
                  />
                  <div className="grid md:grid-cols-2 gap-6">
                    <input
                      type="text"
                      value={updateFormData.relatedProject}
                      onChange={(e) =>
                        setUpdateFormData({ ...updateFormData, relatedProject: e.target.value })
                      }
                      placeholder="Related Project (Optional)"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-primary text-white"
                    />
                    <select
                      value={updateFormData.statusTag}
                      onChange={(e) =>
                        setUpdateFormData({ ...updateFormData, statusTag: e.target.value })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-primary text-white"
                    >
                      <option value="Building">Building</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Research">Research</option>
                      <option value="Fix">Fix</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-4">
                    {currentUpdate && (
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentUpdate(null);
                          setUpdateFormData({
                            title: "",
                            text: "",
                            date: new Date().toISOString().split("T")[0],
                            relatedProject: "",
                            statusTag: "Building",
                          });
                        }}
                        className="px-6 py-3 rounded-xl bg-white/5 text-white/40 font-bold hover:text-white"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-6 py-3 rounded-xl bg-brand-primary text-white font-bold hover:bg-brand-primary/90 disabled:opacity-50 flex items-center gap-2"
                    >
                      {isSaving && (
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      )}
                      {currentUpdate ? "Update" : "Publish"}
                    </button>
                  </div>
                </form>

                <div className="space-y-4">
                  {updates.map((update) => (
                    <div
                      key={update.id}
                      className="glass-card p-6 rounded-3xl border border-white/10 flex items-start justify-between group"
                    >
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary px-2 py-1 bg-brand-primary/10 rounded-md">
                            {update.statusTag}
                          </span>
                          <span className="text-white/40 text-xs">{update.date}</span>
                        </div>
                        <h4 className="font-bold text-lg text-white">{update.title}</h4>
                        <p className="text-white/60 text-sm mt-1">{update.text}</p>
                        {update.relatedProject && (
                          <div className="text-xs text-white/30 mt-2 flex items-center gap-1">
                            <Layers size={12} /> {update.relatedProject}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setCurrentUpdate(update);
                            setUpdateFormData({
                              title: update.title,
                              text: update.text,
                              date: update.date,
                              relatedProject: update.relatedProject || "",
                              statusTag: update.statusTag || "Building",
                            });
                          }}
                          className="p-2 bg-white/5 rounded-lg text-white/40 hover:text-white"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(update.id, "updates")}
                          className="p-2 bg-white/5 rounded-lg text-white/40 hover:text-red-500"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "messages" && (
              <div className="space-y-6">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="glass-card p-8 rounded-[40px] border border-white/10 group hover:border-brand-primary/30 transition-all"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-xl">
                          {msg.name ? msg.name[0] : "A"}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-white">{msg.name}</h3>
                          <p className="text-white/40 text-sm">{msg.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-white/20">
                          {formatDate(msg.timestamp)}
                        </div>
                        <button
                          onClick={() => handleToggleMessageStatus(msg.id, msg.status)}
                          className={cn(
                            "px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                            msg.status === "read"
                              ? "bg-white/5 text-white/20 hover:text-white"
                              : "bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20"
                          )}
                        >
                          {msg.status === "read" ? "Mark Unread" : "Mark Read"}
                        </button>
                        <button
                          onClick={() => handleDelete(msg.id, "contacts")}
                          className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/20 hover:text-red-500 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="text-xs font-bold uppercase tracking-widest text-brand-primary">
                          {msg.subject}
                        </div>
                        {msg.status !== "read" && (
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                        )}
                      </div>
                      <p className="text-white/60 leading-relaxed">{msg.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "subscribers" && (
              <div className="space-y-12">
                <div className="flex justify-between items-center bg-white/5 p-8 rounded-[40px] border border-white/10">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Subscriber Base</h3>
                    <p className="text-white/40 text-sm">
                      {subscribers.length} innovators following your journey.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowComposeModal(true)}
                    className="px-8 py-4 bg-brand-primary text-black font-bold rounded-2xl hover:bg-white transition-all flex items-center gap-2"
                  >
                    <Plus size={18} /> Compose Newsletter
                  </button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {subscribers.map((sub) => (
                    <div
                      key={sub.id}
                      className="glass-card p-8 rounded-[40px] border border-white/10 flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/20">
                          <Mail size={18} />
                        </div>
                        <div>
                          <div className="font-bold text-white/80 group-hover:text-white transition-colors">
                            {sub.email}
                          </div>
                          <div className="text-[10px] font-bold uppercase tracking-widest text-white/20 mt-1">
                            Joined {formatDate(sub.createdAt)}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(sub.id, "subscribers")}
                        className="p-3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity text-white/20 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                {campaigns.length > 0 && (
                  <div className="space-y-6">
                    <h3 className="text-white/60 px-2 uppercase tracking-widest text-[11px] font-bold">
                      Campaign History
                    </h3>
                    <div className="grid gap-4">
                      {campaigns.map((camp) => (
                        <div
                          key={camp.id}
                          className="glass-card p-8 rounded-[32px] border border-white/5 flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-6">
                            <div
                              className={cn(
                                "w-12 h-12 rounded-2xl flex items-center justify-center",
                                camp.status === "completed"
                                  ? "bg-green-500/10 text-green-500"
                                  : "bg-brand-primary/10 text-brand-primary animate-pulse"
                              )}
                            >
                              <Mail size={20} />
                            </div>
                            <div>
                              <h4 className="font-bold text-white group-hover:text-brand-primary transition-colors">
                                {camp.subject}
                              </h4>
                              <div className="flex items-center gap-4 text-xs text-white/40 mt-1">
                                <span className="flex items-center gap-1">
                                  <Clock size={12} /> {formatDate(camp.createdAt)}
                                </span>
                                <span>•</span>
                                <span>Recipients: {camp.recipientCount || 0}</span>
                              </div>
                            </div>
                          </div>
                          {camp.status !== "completed" && (
                            <button
                              onClick={() => handleSendNewsletter(camp.id)}
                              className="px-6 py-3 bg-brand-primary/10 text-brand-primary rounded-xl font-bold text-xs hover:bg-brand-primary hover:text-black transition-all flex items-center gap-2"
                            >
                              <Zap size={12} /> Resume Dispatch
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <ComposeNewsletterModal
        isOpen={showComposeModal}
        onClose={() => setShowComposeModal(false)}
        subscribersCount={subscribers.length}
        newsletterData={newsletterData}
        setNewsletterData={setNewsletterData}
        isSending={isSending}
        onSend={handleSendNewsletter}
      />

      <Toaster toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export const AdminPage = () => {
  useSEO({ title: "Admin Dashboard | Ayush Paul", noindex: true });
  const { isConfigured } = getFirebaseStatus();

  // Consume Extracted Authentication Custom Hook
  const {
    user,
    loading,
    loginError,
    isLoggingIn,
    isAuthorized,
    handleLogin,
    handleLogout,
  } = useAdminAuth();

  if (!isConfigured) {
    return <FirebaseConfigWarning variant="fullscreen" />;
  }

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0A0A] gap-6">
        <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-xl font-bold tracking-tighter text-white">Initializing Studio</h2>
          <p className="text-white/20 text-xs font-bold uppercase tracking-widest animate-pulse">
            Checking Authority Keys...
          </p>
        </div>
      </div>
    );

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="glass-card p-12 rounded-[40px] border border-white/10 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-brand-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Rocket size={40} className="text-brand-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-4 text-white">Admin Access</h1>
          <p className="text-white/40 mb-12">
            Please sign in with your authorized account to manage the startup portal.
          </p>

          {loginError && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-sm text-left">
              <AlertCircle size={18} className="shrink-0" />
              <p>{loginError}</p>
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className={cn(
              "w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all",
              isLoggingIn
                ? "bg-white/10 text-white/20 cursor-not-allowed"
                : "bg-white text-black hover:scale-[1.02] active:scale-[0.98]"
            )}
          >
            {isLoggingIn ? (
              <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <LogIn size={24} />
            )}
            {isLoggingIn ? "Authenticating..." : "Sign in with Google"}
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] p-6">
        <div className="glass-card p-12 rounded-[40px] border border-white/10 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Shield size={40} className="text-red-500" />
          </div>
          <h1 className="text-3xl font-bold mb-4 text-white">Unauthorized</h1>
          <p className="text-white/40 mb-12">
            This account does not have administrative privileges. Please switch to the authorized
            identity.
          </p>
          <button
            onClick={handleLogout}
            className="w-full py-5 rounded-2xl font-bold text-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return <AdminDashboard user={user} onLogout={handleLogout} />;
};

import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css"; // Ensure Quill styles are imported
import {
  GripVertical,
  Trash2,
  Wand2,
  ImageIcon,
  Info,
  X,
  AlertCircle,
} from "lucide-react";
import { Block } from "../../../types";
import { cn } from "../../../lib/utils";

interface SortableBlockProps {
  block: Block;
  onUpdate: (id: string, updates: Partial<Block>) => void;
  onDelete: (id: string) => void;
  onAIAction: (id: string, action: string) => void;
}

/**
 * Validates an image URL by protocol (HTTPS), file type (blocks SVG), and an async pre-load test.
 */
const validateImageUrl = async (
  url: string
): Promise<{ isValid: boolean; error?: string }> => {
  if (!url) return { isValid: false };

  // 1. Protocol Validation
  if (!url.startsWith("https://")) {
    return {
      isValid: false,
      error: "Security Error: Only HTTPS URLs are allowed.",
    };
  }

  // 2. SVG Block (XSS Mitigation)
  const isSvg =
    url.toLowerCase().endsWith(".svg") ||
    url.split("?")[0].toLowerCase().endsWith(".svg");
  if (isSvg) {
    return {
      isValid: false,
      error: "Security Error: SVG images are blocked for your safety.",
    };
  }

  // 3. Async Image Load Test (supports CDN URLs without extensions like Unsplash)
  return new Promise((resolve) => {
    const img = new Image();

    // Set a 5-second industry-standard timeout
    const timer = setTimeout(() => {
      img.onload = null;
      img.onerror = null;
      resolve({
        isValid: false,
        error: "Validation Error: Image load timed out (5s).",
      });
    }, 5000);

    img.onload = () => {
      clearTimeout(timer);
      resolve({ isValid: true });
    };

    img.onerror = () => {
      clearTimeout(timer);
      resolve({
        isValid: false,
        error: "Validation Error: The URL is not a valid or accessible image.",
      });
    };

    img.src = url;
  });
};

export const SortableBlock: React.FC<SortableBlockProps> = ({
  block,
  onUpdate,
  onDelete,
  onAIAction,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const [validationError, setValidationError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
    opacity: isDragging ? 0.5 : 1,
  };

  const renderEditor = () => {
    const modules = {
      toolbar: [
        [{ size: ["small", false, "large", "huge"] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        ["link", "code"],
        ["clean"],
      ],
    };

    switch (block.type) {
      case "text":
        return (
          <ReactQuill
            theme="snow"
            value={block.content}
            onChange={(content) => onUpdate(block.id, { content })}
            placeholder="Start writing..."
            modules={modules}
            className="quill-editor-dark"
          />
        );
      case "heading":
        return (
          <div className="flex items-center gap-4 text-left">
            <div className="text-[10px] font-bold uppercase tracking-widest text-brand-primary shrink-0">
              H{block.metadata?.level || 2}
            </div>
            <input
              type="text"
              value={block.content}
              onChange={(e) => onUpdate(block.id, { content: e.target.value })}
              placeholder={`Heading ${block.metadata?.level || 2}...`}
              className={cn(
                "w-full bg-transparent border-none outline-none font-bold text-white/90 focus:ring-0",
                block.metadata?.level === 1
                  ? "text-4xl"
                  : block.metadata?.level === 2
                  ? "text-3xl"
                  : block.metadata?.level === 3
                  ? "text-2xl"
                  : "text-xl"
              )}
            />
          </div>
        );
      case "list":
        return (
          <ReactQuill
            theme="snow"
            value={block.content}
            onChange={(content) => onUpdate(block.id, { content })}
            placeholder={
              block.metadata?.listType === "ordered"
                ? "Ordered list..."
                : "Unordered list..."
            }
            modules={{
              toolbar: [
                [
                  block.metadata?.listType === "ordered"
                    ? "ordered"
                    : "bullet",
                ],
                ["bold", "italic", "link"],
                ["clean"],
              ],
            }}
            className="quill-editor-dark"
          />
        );
      case "image": {
        return (
          <div className="space-y-4 text-left">
            <div className="space-y-4">
              <label className="text-sm font-bold text-white/40 ml-1">
                Image URL (optional if uploading a file)
              </label>
              <input
                type="text"
                value={block.content}
                onChange={async (e) => {
                  const url = e.target.value;
                  onUpdate(block.id, { content: url });
                  if (!url) return;
                  setIsValidating(true);
                  const result = await validateImageUrl(url);
                  setIsValidating(false);
                  if (!result.isValid)
                    setValidationError(result.error || "Invalid Image");
                  else setValidationError(null);
                }}
                placeholder="https://..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary text-white"
              />

              <label className="text-sm font-bold text-white/40 ml-1">
                Or Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;

                  if (block.localPreview) URL.revokeObjectURL(block.localPreview);

                  if (!file) {
                    onUpdate(block.id, {
                      localFile: undefined,
                      localPreview: undefined,
                    });
                    return;
                  }

                  onUpdate(block.id, {
                    localFile: file,
                    localPreview: URL.createObjectURL(file),
                    content: "", // Clear URL when file is selected
                  });
                }}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary text-white"
              />

              {isValidating && (
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-primary animate-pulse ml-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" />{" "}
                  Verifying...
                </div>
              )}
              {validationError && (
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-red-500 ml-1">
                  <AlertCircle size={12} /> {validationError}
                </div>
              )}
            </div>

            {(block.localPreview || block.content) &&
              !validationError &&
              !isValidating && (
                <div
                  className={cn(
                    "relative group rounded-2xl overflow-hidden border border-white/10",
                    block.metadata?.alignment === "center"
                      ? "max-w-2xl mx-auto"
                      : block.metadata?.alignment === "full"
                      ? "w-full"
                      : "max-w-xl"
                  )}
                >
                  <img
                    src={block.localPreview || block.content}
                    alt={block.metadata?.alt}
                    className="w-full h-auto"
                  />
                  <button
                    onClick={() => onUpdate(block.id, { content: "" })}
                    className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-md rounded-full text-white/60 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

            {!(block.localPreview || block.content) && !isValidating && (
              <div className="border-2 border-dashed border-white/10 rounded-2xl p-12 flex flex-col items-center justify-center text-white/20 pb-8">
                <ImageIcon size={48} className="mb-4 text-white/5" />
                <p className="font-bold">
                  Paste an HTTPS image URL above to preview
                </p>
                <p className="text-[10px] uppercase tracking-widest mt-2">
                  Supports Unsplash, Cloudinary, etc.
                </p>
              </div>
            )}
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Alt text (SEO)"
                value={block.metadata?.alt || ""}
                onChange={(e) =>
                  onUpdate(block.id, {
                    metadata: { ...block.metadata, alt: e.target.value },
                  })
                }
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-brand-primary text-white"
              />
              <select
                value={block.metadata?.alignment || "left"}
                onChange={(e) =>
                  onUpdate(block.id, {
                    metadata: {
                      ...block.metadata,
                      alignment: e.target.value as any,
                    },
                  })
                }
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none text-white"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="full">Full Width</option>
              </select>
            </div>
          </div>
        );
      }
      case "code":
        return (
          <div className="space-y-2 text-left">
            <div className="flex justify-between items-center px-4 py-2 bg-white/5 border border-white/10 rounded-t-xl">
              <select
                value={block.metadata?.language || "javascript"}
                onChange={(e) =>
                  onUpdate(block.id, {
                    metadata: { ...block.metadata, language: e.target.value },
                  })
                }
                className="bg-transparent text-xs font-bold uppercase tracking-widest text-white/40 outline-none"
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="bash">Bash</option>
              </select>
            </div>
            <textarea
              value={block.content}
              onChange={(e) => onUpdate(block.id, { content: e.target.value })}
              placeholder="Paste your code here..."
              className="w-full bg-black/40 border border-white/10 rounded-b-xl p-6 font-mono text-sm text-brand-primary outline-none resize-none min-h-[150px]"
            />
          </div>
        );
      case "quote":
        return (
          <div className="flex gap-6 p-8 bg-brand-primary/5 border-l-4 border-brand-primary rounded-r-2xl text-left">
            <Info className="text-brand-primary shrink-0" size={32} />
            <textarea
              value={block.content}
              onChange={(e) => onUpdate(block.id, { content: e.target.value })}
              placeholder="Enter quote..."
              className="w-full bg-transparent border-none outline-none text-2xl font-display italic text-white/90 resize-none min-h-[60px]"
            />
          </div>
        );
      case "callout": {
        const variants = {
          info: "bg-blue-500/10 border-blue-500/20 text-blue-400",
          warning: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
          success: "bg-green-500/10 border-green-500/20 text-green-400",
          danger: "bg-red-500/10 border-red-500/20 text-red-400",
        };
        const variant = block.metadata?.variant || "info";
        return (
          <div
            className={cn(
              "p-6 rounded-2xl border flex gap-4 text-left",
              variants[variant]
            )}
          >
            <Info size={24} className="shrink-0" />
            <div className="flex-1 space-y-2">
              <select
                value={variant}
                onChange={(e) =>
                  onUpdate(block.id, {
                    metadata: {
                      ...block.metadata,
                      variant: e.target.value as any,
                    },
                  })
                }
                className="bg-transparent text-[10px] font-bold uppercase tracking-widest outline-none"
              >
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="success">Success</option>
                <option value="danger">Danger</option>
              </select>
              <textarea
                value={block.content}
                onChange={(e) => onUpdate(block.id, { content: e.target.value })}
                placeholder="Callout message..."
                className="w-full bg-transparent border-none outline-none text-sm font-medium resize-none min-h-[40px]"
              />
            </div>
          </div>
        );
      }
      case "divider":
        return <div className="h-px w-full bg-white/10 my-8" />;
      default:
        return null;
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="group relative mb-4">
      <div className="absolute -left-12 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
        <div
          {...attributes}
          {...listeners}
          className="p-2 cursor-grab active:cursor-grabbing text-white/20 hover:text-white transition-colors"
        >
          <GripVertical size={20} />
        </div>
        <button
          onClick={() => onDelete(block.id)}
          className="p-2 text-white/20 hover:text-red-500 transition-colors"
        >
          <Trash2 size={20} />
        </button>
      </div>

      <div className="absolute -right-12 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {block.type === "text" && (
          <button
            onClick={() => onAIAction(block.id, "improve")}
            className="p-2 text-white/20 hover:text-brand-primary transition-colors"
            title="AI Improve"
          >
            <Wand2 size={20} />
          </button>
        )}
      </div>

      <div className="p-4 rounded-2xl hover:bg-white/[0.02] transition-colors">
        {renderEditor()}
      </div>
    </div>
  );
};

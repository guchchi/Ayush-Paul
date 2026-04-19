import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Rocket, LogIn, GripVertical, Trash2, Wand2, Plus, Type, List, ListOrdered, ImageIcon, 
  Code, Quote, Info, Minus, Shield, Clock, X, Save, Monitor, Layout, FileText, Layers, 
  MessageSquare, Edit, Calendar, Eye, Search, TrendingUp, Sparkles, Globe, AlertCircle, 
  CheckCircle2, Settings, BarChart3, History, Link as LinkIcon, Tag, Star, ArrowLeft, LogOut
} from "lucide-react";
import { 
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent 
} from '@dnd-kit/core';
import { 
  arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable 
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { 
  auth, db, googleProvider, signInWithPopup, signInWithRedirect, getRedirectResult, 
  signOut, onAuthStateChanged, 
  collection, doc, setDoc, updateDoc, deleteDoc, query, orderBy, onSnapshot, addDoc, 
  serverTimestamp, getFirebaseStatus 
} from "../firebase";
import { cn } from "../lib/utils";
import { handleFirestoreError, formatDate } from "../lib/firebase-utils";
import { Block, BlockType, SEOData, OperationType } from "../types";
import { useSEO } from "../hooks/useSEO";

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
  "Data Science"
];


/**
 * Validates an image URL by protocol (HTTPS), file type (blocks SVG), and an async pre-load test.
 */
const validateImageUrl = async (url: string): Promise<{ isValid: boolean, error?: string }> => {
  if (!url) return { isValid: false };
  
  // 1. Protocol Validation
  if (!url.startsWith('https://')) {
    return { isValid: false, error: "Security Error: Only HTTPS URLs are allowed." };
  }
  
  // 2. SVG Block (XSS Mitigation)
  const isSvg = url.toLowerCase().endsWith('.svg') || url.split('?')[0].toLowerCase().endsWith('.svg');
  if (isSvg) {
    return { isValid: false, error: "Security Error: SVG images are blocked for your safety." };
  }

  // 3. Async Image Load Test (supports CDN URLs without extensions like Unsplash)
  return new Promise((resolve) => {
    const img = new Image();
    
    // Set a 5-second industry-standard timeout
    const timer = setTimeout(() => {
      img.onload = null;
      img.onerror = null;
      resolve({ isValid: false, error: "Validation Error: Image load timed out (5s)." });
    }, 5000);

    img.onload = () => {
      clearTimeout(timer);
      resolve({ isValid: true });
    };

    img.onerror = () => {
      clearTimeout(timer);
      resolve({ isValid: false, error: "Validation Error: The URL is not a valid or accessible image." });
    };

    img.src = url;
  });
};

// --- CMS Components ---

const SortableBlock = ({ block, onUpdate, onDelete, onAIAction }: { 
  block: Block, 
  onUpdate: (id: string, updates: Partial<Block>) => void,
  onDelete: (id: string) => void,
  onAIAction: (id: string, action: string) => void
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.5 : 1,
  };

  const renderEditor = () => {
    const modules = {
      toolbar: [
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        ['link', 'code'],
        ['clean']
      ],
    };

    switch (block.type) {
      case 'text':
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
      case 'heading':
        const Level = `h${block.metadata?.level || 2}` as any;
        return (
          <div className="flex items-center gap-4">
            <div className="text-[10px] font-bold uppercase tracking-widest text-brand-primary shrink-0">H{block.metadata?.level || 2}</div>
            <input
              type="text"
              value={block.content}
              onChange={(e) => onUpdate(block.id, { content: e.target.value })}
              placeholder={`Heading ${block.metadata?.level || 2}...`}
              className={cn(
                "w-full bg-transparent border-none outline-none font-bold text-white/90",
                block.metadata?.level === 1 ? "text-4xl" : 
                block.metadata?.level === 2 ? "text-3xl" : 
                block.metadata?.level === 3 ? "text-2xl" : "text-xl"
              )}
            />
          </div>
        );
      case 'list':
        return (
          <ReactQuill
            theme="snow"
            value={block.content}
            onChange={(content) => onUpdate(block.id, { content })}
            placeholder={block.metadata?.listType === 'ordered' ? "Ordered list..." : "Unordered list..."}
            modules={{
              toolbar: [
                [block.metadata?.listType === 'ordered' ? 'ordered' : 'bullet'],
                ['bold', 'italic', 'link'],
                ['clean']
              ]
            }}
            className="quill-editor-dark"
          />
        );
      case 'image':
        const [validationError, setValidationError] = useState<string | null>(null);
        const [isValidating, setIsValidating] = useState(false);

        const handleUrlChange = async (url: string) => {
          onUpdate(block.id, { content: url });
          if (!url) {
            setValidationError(null);
            return;
          }

          setIsValidating(true);
          const result = await validateImageUrl(url);
          setIsValidating(false);

          if (!result.isValid) {
            setValidationError(result.error || "Invalid Image");
          } else {
            setValidationError(null);
          }
        };

        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/20 ml-1">Image URL</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={block.content}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className={cn(
                    "w-full bg-white/5 border rounded-2xl px-6 py-4 outline-none transition-all",
                    validationError ? "border-red-500/50 text-red-500" : "border-white/10 focus:border-brand-primary text-white"
                  )}
                />
                {isValidating && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-primary animate-pulse">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" /> Verifying...
                  </div>
                )}
              </div>
              {validationError && (
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-red-500 ml-1">
                  <AlertCircle size={12} /> {validationError}
                </div>
              )}
            </div>

            {block.content && !validationError && !isValidating && (
              <div className={cn(
                "relative group rounded-2xl overflow-hidden border border-white/10",
                block.metadata?.alignment === 'center' ? "max-w-2xl mx-auto" : 
                block.metadata?.alignment === 'full' ? "w-full" : "max-w-xl"
              )}>
                <img 
                  src={block.content} 
                  alt={block.metadata?.alt} 
                  className="w-full h-auto"
                />
                <button 
                  onClick={() => onUpdate(block.id, { content: '' })}
                  className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-md rounded-full text-white/60 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={16} />
                </button>
              </div>
            )}
            
            {!block.content && !isValidating && (
              <div className="border-2 border-dashed border-white/10 rounded-2xl p-12 flex flex-col items-center justify-center text-white/20 pb-8">
                <ImageIcon size={48} className="mb-4 text-white/5" />
                <p className="font-bold">Paste an HTTPS image URL above to preview</p>
                <p className="text-[10px] uppercase tracking-widest mt-2">Supports Unsplash, Cloudinary, etc.</p>
              </div>
            )}
            <div className="flex gap-4">
              <input 
                type="text"
                placeholder="Alt text (SEO)"
                value={block.metadata?.alt || ''}
                onChange={(e) => onUpdate(block.id, { metadata: { ...block.metadata, alt: e.target.value } })}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-brand-primary"
              />
              <select 
                value={block.metadata?.alignment || 'left'}
                onChange={(e) => onUpdate(block.id, { metadata: { ...block.metadata, alignment: e.target.value as any } })}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="full">Full Width</option>
              </select>
            </div>
          </div>
        );
      case 'code':
        return (
          <div className="space-y-2">
            <div className="flex justify-between items-center px-4 py-2 bg-white/5 border border-white/10 rounded-t-xl">
              <select 
                value={block.metadata?.language || 'javascript'}
                onChange={(e) => onUpdate(block.id, { metadata: { ...block.metadata, language: e.target.value } })}
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
      case 'quote':
        return (
          <div className="flex gap-6 p-8 bg-brand-primary/5 border-l-4 border-brand-primary rounded-r-2xl">
            <Quote className="text-brand-primary shrink-0" size={32} />
            <textarea
              value={block.content}
              onChange={(e) => onUpdate(block.id, { content: e.target.value })}
              placeholder="Enter quote..."
              className="w-full bg-transparent border-none outline-none text-2xl font-display italic text-white/90 resize-none min-h-[60px]"
            />
          </div>
        );
      case 'callout':
        const variants = {
          info: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
          warning: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
          success: 'bg-green-500/10 border-green-500/20 text-green-400',
          danger: 'bg-red-500/10 border-red-500/20 text-red-400',
        };
        const variant = block.metadata?.variant || 'info';
        return (
          <div className={cn("p-6 rounded-2xl border flex gap-4", variants[variant])}>
            <Info size={24} className="shrink-0" />
            <div className="flex-1 space-y-2">
              <select 
                value={variant}
                onChange={(e) => onUpdate(block.id, { metadata: { ...block.metadata, variant: e.target.value as any } })}
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
      case 'divider':
        return <div className="h-px w-full bg-white/10 my-8" />;
      default:
        return null;
    }
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="group relative mb-4"
    >
      <div className="absolute -left-12 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
        <div {...attributes} {...listeners} className="p-2 cursor-grab active:cursor-grabbing text-white/20 hover:text-white transition-colors">
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
        {block.type === 'text' && (
          <button 
            onClick={() => onAIAction(block.id, 'improve')}
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

const BlogEditor = ({ blocks, setBlocks, onAIAction }: { 
  blocks: Block[], 
  setBlocks: React.Dispatch<React.SetStateAction<Block[]>>,
  onAIAction: (id: string, action: string) => void
}) => {
  const [importText, setImportText] = useState("");
  const [showSmartImport, setShowSmartImport] = useState(false);

  const parseContentToBlocks = (text: string) => {
    const lines = text.split('\n');
    const newBlocks: Block[] = [];
    let currentParagraphs: string[] = [];

    const flushParagraphs = () => {
      if (currentParagraphs.length > 0) {
        newBlocks.push({
          id: Math.random().toString(36).substr(2, 9),
          type: 'text',
          content: `<p>${currentParagraphs.join(' ')}</p>`
        });
        currentParagraphs = [];
      }
    };

    lines.forEach((line) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) {
        flushParagraphs();
        return;
      }

      // Check for Headings (Markdown or Title-like)
      if (trimmedLine.startsWith('# ')) {
        flushParagraphs();
        newBlocks.push({ id: Math.random().toString(36).substr(2, 9), type: 'heading', content: trimmedLine.substring(2), metadata: { level: 1 } });
      } else if (trimmedLine.startsWith('## ')) {
        flushParagraphs();
        newBlocks.push({ id: Math.random().toString(36).substr(2, 9), type: 'heading', content: trimmedLine.substring(3), metadata: { level: 2 } });
      } else if (trimmedLine.startsWith('### ')) {
        flushParagraphs();
        newBlocks.push({ id: Math.random().toString(36).substr(2, 9), type: 'heading', content: trimmedLine.substring(4), metadata: { level: 3 } });
      } 
      // Heuristic: Short line, Title Case, no period at end => Heading 2
      else if (trimmedLine.length < 80 && /^[A-Z]/.test(trimmedLine) && !trimmedLine.endsWith('.') && trimmedLine.split(' ').length < 10) {
        flushParagraphs();
        newBlocks.push({ id: Math.random().toString(36).substr(2, 9), type: 'heading', content: trimmedLine, metadata: { level: 2 } });
      }
      // Check for Lists
      else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
        flushParagraphs();
        newBlocks.push({ id: Math.random().toString(36).substr(2, 9), type: 'list', content: `<ul><li>${trimmedLine.substring(2)}</li></ul>`, metadata: { listType: 'unordered' } });
      } else if (/^\d+\. /.test(trimmedLine)) {
        flushParagraphs();
        newBlocks.push({ id: Math.random().toString(36).substr(2, 9), type: 'list', content: `<ol><li>${trimmedLine.replace(/^\d+\. /, '')}</li></ol>`, metadata: { listType: 'ordered' } });
      }
      // Check for Image URL
      else if (trimmedLine.startsWith('https://') && (trimmedLine.includes('unsplash.com') || trimmedLine.match(/\.(jpeg|jpg|gif|png|webp)$/) )) {
        flushParagraphs();
        newBlocks.push({ id: Math.random().toString(36).substr(2, 9), type: 'image', content: trimmedLine, metadata: { alignment: 'center', alt: 'Imported Image' } });
      }
      // Otherwise, collect as paragraph
      else {
        currentParagraphs.push(trimmedLine);
      }
    });

    flushParagraphs();
    return newBlocks;
  };

  const handleSmartImport = (append = false) => {
    if (!importText.trim()) return;
    const parsedBlocks = parseContentToBlocks(importText);
    if (append) {
      setBlocks([...blocks, ...parsedBlocks]);
    } else {
      setBlocks(parsedBlocks);
    }
    setImportText("");
    setShowSmartImport(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setImportText(content);
      setShowSmartImport(true);
    };
    reader.readAsText(file);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setBlocks((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const addBlock = (type: BlockType, metadata: any = {}) => {
    const newBlock: Block = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content: '',
      metadata: {
        ...metadata,
        ...(type === 'image' ? { alignment: 'center' } : 
           type === 'code' ? { language: 'javascript' } : 
           type === 'callout' ? { variant: 'info' } : {})
      }
    };
    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (id: string, updates: Partial<Block>) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  return (
    <div className="space-y-8">
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={blocks.map(b => b.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="min-h-[400px] space-y-4">
            {blocks.map((block) => (
              <SortableBlock 
                key={block.id} 
                block={block} 
                onUpdate={updateBlock}
                onDelete={deleteBlock}
                onAIAction={onAIAction}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-white/5 border border-white/10 rounded-[32px]">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/20 mr-2">Add Block</span>
          <div className="flex bg-white/5 rounded-xl p-1">
            <button onClick={() => addBlock('heading', { level: 2 })} className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-all" title="Heading 2">
              <span className="text-xs font-bold">H2</span>
            </button>
            <button onClick={() => addBlock('heading', { level: 3 })} className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-all" title="Heading 3">
              <span className="text-xs font-bold">H3</span>
            </button>
          </div>
          <button onClick={() => addBlock('text')} className="p-3 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition-all flex items-center gap-2">
            <Type size={18} /> <span className="text-xs font-bold">Text</span>
          </button>
          <div className="flex bg-white/5 rounded-xl p-1">
            <button onClick={() => addBlock('list', { listType: 'unordered' })} className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-all" title="Bullet List">
              <List size={18} />
            </button>
            <button onClick={() => addBlock('list', { listType: 'ordered' })} className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-all" title="Numbered List">
              <ListOrdered size={18} />
            </button>
          </div>
          <button onClick={() => addBlock('image')} className="p-3 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition-all flex items-center gap-2">
            <ImageIcon size={18} /> <span className="text-xs font-bold">Image</span>
          </button>
          <button onClick={() => addBlock('code')} className="p-3 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition-all flex items-center gap-2">
            <Code size={18} /> <span className="text-xs font-bold">Code</span>
          </button>
          <button onClick={() => addBlock('quote')} className="p-3 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition-all flex items-center gap-2">
            <Quote size={18} /> <span className="text-xs font-bold">Quote</span>
          </button>
          <button onClick={() => addBlock('callout')} className="p-3 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition-all flex items-center gap-2">
            <Info size={18} /> <span className="text-xs font-bold">Callout</span>
          </button>
          <button onClick={() => addBlock('divider')} className="p-3 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition-all flex items-center gap-2">
            <Minus size={18} /> <span className="text-xs font-bold">Divider</span>
          </button>
        </div>

        <div className="flex items-center gap-4">
          <label className="p-3 rounded-xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary hover:bg-brand-primary/20 transition-all flex items-center gap-2 cursor-pointer font-bold text-xs">
            <FileText size={18} /> Import .txt
            <input type="file" accept=".txt" onChange={handleFileUpload} className="hidden" />
          </label>
          <button 
            onClick={() => setShowSmartImport(true)}
            className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2 font-bold text-xs"
          >
            <Sparkles size={18} className="text-brand-primary" /> Smart Paste
          </button>
        </div>
      </div>

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
                  <p className="text-white/40 text-sm">Paste raw text to analyze and format into blocks instantly</p>
                </div>
              </div>
              <button onClick={() => setShowSmartImport(false)} className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/20 hover:text-white transition-all">
                <X size={20} />
              </button>
            </div>

            <textarea 
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              className="w-full h-80 bg-black/40 border border-white/10 rounded-3xl p-8 outline-none focus:border-brand-primary text-white/80 font-mono text-sm resize-none"
              placeholder="Paste your unformatted content here... Headings, lists, and paragraphs will be detected automatically."
            />

            <div className="flex justify-between items-center gap-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/20">
                Tip: Uses Markdown detection (#) and intelligent heuristics for structure recognition.
              </p>
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

const SEOPanel = ({ data, setData, blocks, onAIAction, isProcessing }: { 
  data: SEOData, 
  setData: React.Dispatch<React.SetStateAction<SEOData>>,
  blocks: Block[],
  onAIAction: (id: string, action: string) => void,
  isProcessing: boolean
}) => {
  const [score, setScore] = useState(0);
  const [issues, setIssues] = useState<string[]>([]);

  useEffect(() => {
    let s = 0;
    let i = [];

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
      const textContent = blocks.filter(b => b.type === 'text').map(b => b.content).join(' ').toLowerCase();
      if (textContent.includes(kw)) s += 20;
      else i.push(`Focus keyword "${data.keywords}" not found in early content`);
    } else {
      i.push("Focus keyword is missing");
    }

    // Image Alt Text Check
    const hasImages = blocks.some(b => b.type === 'image');
    if (hasImages) {
      const hasImagesWithAlt = blocks.filter(b => b.type === 'image').every(b => b.metadata?.alt);
      if (hasImagesWithAlt) s += 10;
      else i.push("Some images are missing descriptive alt text");
    } else {
      s += 10; // No images is fine for simple posts
    }

    // Content Length Check
    const wordCount = blocks.filter(b => b.type === 'text').map(b => b.content).join(' ').split(/\s+/).length;
    if (wordCount > 300) s += 10;
    else i.push("Content is too short (minimum 300 words recommended)");

    setScore(Math.min(100, s));
    setIssues(i);
  }, [data, blocks]);

  return (
    <div className="space-y-12">
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">SEO Title</label>
              <button 
                onClick={() => onAIAction('', 'title')}
                disabled={isProcessing}
                className={cn(
                  "text-[10px] font-bold uppercase tracking-widest hover:underline flex items-center gap-1 transition-all",
                  isProcessing ? "text-white/20 cursor-wait" : "text-brand-primary"
                )}
              >
                <Sparkles size={10} className={cn(isProcessing && "animate-pulse")} /> {isProcessing ? "Generating..." : "AI Generate"}
              </button>
            </div>
            <input 
              type="text"
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary"
              placeholder="Enter SEO title..."
            />
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/20">
              <span>Characters: {data.title.length}</span>
              <span>Recommended: 50-60</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Meta Description</label>
              <button 
                onClick={() => onAIAction('', 'summary')}
                disabled={isProcessing}
                className={cn(
                  "text-[10px] font-bold uppercase tracking-widest hover:underline flex items-center gap-1 transition-all",
                  isProcessing ? "text-white/20 cursor-wait" : "text-brand-primary"
                )}
              >
                <Sparkles size={10} className={cn(isProcessing && "animate-pulse")} /> {isProcessing ? "Generating..." : "AI Generate"}
              </button>
            </div>
            <textarea 
              value={data.description}
              onChange={(e) => setData({ ...data, description: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary h-32 resize-none"
              placeholder="Enter meta description..."
            />
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/20">
              <span>Characters: {data.description.length}</span>
              <span>Recommended: 120-160</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Focus Keyword</label>
              <button 
                onClick={() => onAIAction('', 'keywords')}
                disabled={isProcessing}
                className={cn(
                  "text-[10px] font-bold uppercase tracking-widest hover:underline flex items-center gap-1 transition-all",
                  isProcessing ? "text-white/20 cursor-wait" : "text-brand-primary"
                )}
              >
                <Sparkles size={10} className={cn(isProcessing && "animate-pulse")} /> {isProcessing ? "Generating..." : "AI Generate"}
              </button>
            </div>
            <input 
              type="text"
              value={data.keywords}
              onChange={(e) => setData({ ...data, keywords: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary"
              placeholder="Enter focus keyword..."
            />
          </div>
        </div>

        <div className="space-y-8">
          <div className="p-8 rounded-[40px] glass-card border border-white/10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold">SEO Score</h3>
              <div className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold border-4",
                score >= 80 ? "border-green-500 text-green-500" : 
                score >= 50 ? "border-yellow-500 text-yellow-500" : "border-red-500 text-red-500"
              )}>
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
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-6">Social Preview</h3>
            <div className="rounded-2xl overflow-hidden border border-white/10 bg-black">
              <div className="aspect-video bg-white/5 flex items-center justify-center">
                {data.ogImage ? <img src={data.ogImage} className="w-full h-full object-cover" /> : <ImageIcon size={48} className="text-white/10" />}
              </div>
              <div className="p-6 space-y-2">
                <div className="text-xs font-bold text-brand-primary uppercase tracking-widest">ayushpaul.in</div>
                <div className="text-lg font-bold text-white line-clamp-1">{data.ogTitle || data.title || "Post Title"}</div>
                <div className="text-sm text-white/40 line-clamp-2">{data.ogDescription || data.description || "Post description will appear here..."}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AIWritingAssistant = ({ onAction, isProcessing }: { onAction: (action: string) => void, isProcessing: boolean }) => {
  const actions = [
    { id: 'improve', label: 'Improve Writing', icon: <Sparkles size={16} />, desc: 'Enhance clarity and tone' },
    { id: 'grammar', label: 'Fix Grammar', icon: <CheckCircle2 size={16} />, desc: 'Correct errors instantly' },
    { id: 'expand', label: 'Expand Paragraph', icon: <Plus size={16} />, desc: 'Add more detail and depth' },
    { id: 'simplify', label: 'Simplify Text', icon: <Minus size={16} />, desc: 'Make it easier to read' },
    { id: 'summary', label: 'Generate Summary', icon: <FileText size={16} />, desc: 'Create meta description' },
    { id: 'keywords', label: 'SEO Keywords', icon: <Tag size={16} />, desc: 'Suggest target keywords' },
    { id: 'headings', label: 'Suggest Headings', icon: <Layout size={16} />, desc: 'Optimize structure' },
  ];

  return (
    <div className="p-8 rounded-[40px] glass-card border border-white/10 space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="font-bold flex items-center gap-2">
          <Sparkles size={18} className="text-brand-primary" /> AI Writing Assistant
        </h3>
        {isProcessing && (
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-primary animate-pulse">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" /> Processing...
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => onAction(action.id)}
            disabled={isProcessing}
            className="group p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-brand-primary hover:border-brand-primary transition-all text-left disabled:opacity-50"
          >
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 group-hover:text-black group-hover:bg-white/20 transition-all">
                {action.icon}
              </div>
              <span className="text-sm font-bold group-hover:text-black transition-colors">{action.label}</span>
            </div>
            <p className="text-[10px] text-white/40 group-hover:text-black/60 ml-11 transition-colors">{action.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

// --- Health Dashboard Component ---

const HealthDashboard = () => {
  const status = getFirebaseStatus();
  const [showTroubleshooter, setShowTroubleshooter] = useState(false);

  return (
    <div className="mb-12 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-6 p-8 bg-white/5 border border-white/10 rounded-[32px] backdrop-blur-3xl">
        <div className="flex items-center gap-6">
          <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-2xl",
            status.isConfigured ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
          )}>
            {status.isConfigured ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 mb-1">Production Health Check</div>
            <h3 className="text-xl font-bold flex items-center gap-3">
              {status.isConfigured ? "System Online" : "Configuration Warning"}
              <span className="px-2 py-0.5 rounded-md bg-white/10 text-[9px] font-bold uppercase tracking-widest text-white/40">{status.mode}</span>
            </h3>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-8">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-bold uppercase tracking-widest text-white/20">Current Project</span>
            <span className="text-xs font-mono font-bold text-brand-primary">{status.projectId || "NOT_SET"}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-bold uppercase tracking-widest text-white/20">Database Instance</span>
            <span className="text-xs font-mono font-bold text-white/60">{status.databaseId}</span>
          </div>
          <button 
            onClick={() => setShowTroubleshooter(!showTroubleshooter)}
            className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
          >
            {showTroubleshooter ? "Hide Diagnostics" : "Run Troubleshooter"}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showTroubleshooter && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="grid md:grid-cols-2 gap-6 p-8 bg-white/[0.02] border border-white/5 rounded-[32px]">
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">Diagnostic Audit</h4>
                <ul className="space-y-3">
                  {[
                    { label: "Firebase App Initialized", val: true },
                    { label: "Environment Keys Verified", val: status.isConfigured },
                    { label: "Database Route Set", val: !!status.databaseId },
                    { label: "Auth Provider Active", val: true }
                  ].map((check, i) => (
                    <li key={i} className="flex items-center justify-between text-xs py-2 border-b border-white/5">
                      <span className="text-white/60">{check.label}</span>
                      {check.val ? <CheckCircle2 size={14} className="text-green-500" /> : <AlertCircle size={14} className="text-red-500" />}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-secondary">Strategic Troubleshooting</h4>
                <div className="space-y-4">
                  {!status.isConfigured ? (
                    <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 space-y-2">
                      <div className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Action Required: Missing Env Vars</div>
                      <p className="text-[11px] text-white/40 leading-relaxed">The following keys are missing in Vercel settings: <span className="text-red-400 font-mono">{status.missingVars.join(', ')}</span></p>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-brand-primary/5 border border-brand-primary/10 space-y-2">
                      <div className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">Verify Data Container</div>
                      <p className="text-[11px] text-white/40 leading-relaxed">Ensure the <code className="text-white/60">projectId</code> matches where you wrote the blogs locally. If blogs aren't appearing, check Firestore Security Rules for <code className="text-white/60">allow read</code> permissions.</p>
                    </div>
                  )}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <div className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Check Daily Quota</div>
                    <p className="text-[11px] text-white/40 leading-relaxed">If the app is online but shows no data, your daily Firebase Read Quota may be hit. Check the browser console (F12) for "Quota Exceeded" errors.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AdminDashboard = ({ user }: { user: any }) => {
  const [activeTab, setActiveTab] = useState<"blogs" | "projects" | "messages" | "dashboard">("dashboard");
  const [posts, setPosts] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<any>(null);
  const [currentProject, setCurrentProject] = useState<any>(null);
  const [isDistractionFree, setIsDistractionFree] = useState(false);
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [showCustomCategoryInput, setShowCustomCategoryInput] = useState(false);

  const testConnection = async () => {
    setIsAuditing(true);
    console.log("🚀 Phase 3: Starting Firestore Write Test...");
    try {
      const testRef = collection(db, "test_connection");
      await addDoc(testRef, {
        status: "firebase-working",
        time: serverTimestamp(),
        author: user.email
      });
      console.log("✅ Phase 3 SUCCESS: Firestore Write captured.");
      alert("Firebase Backend: ONLINE ✓");
    } catch (error: any) {
      console.error("❌ Phase 3 FAILURE:", error);
      if (error.code === 'permission-denied') {
        alert("CRITICAL: Permission Denied. Please ensure Firestore Rules are set to 'Test Mode' (Phase 4).");
      } else if (error.code === 'unauthorized') {
        alert("CRITICAL: Unauthorized. Check Auth Domain settings (Phase 7).");
      } else {
        alert(`Backend Error [${error.code}]: ${error.message}`);
      }
    } finally {
      setIsAuditing(false);
    }
  };

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
    link: ""
  });

  const [blogFilter, setBlogFilter] = useState<"all" | "published" | "draft" | "scheduled" | "featured">("all");

  useEffect(() => {
    const qBlogs = query(collection(db, "blogPosts"), orderBy("createdAt", "desc"));
    const unsubscribeBlogs = onSnapshot(qBlogs, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "blogPosts");
    });

    const qProjects = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    const unsubscribeProjects = onSnapshot(qProjects, (snapshot) => {
      setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "projects");
    });

    const qMessages = query(collection(db, "contacts"), orderBy("timestamp", "desc"));
    const unsubscribeMessages = onSnapshot(qMessages, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "contacts");
    });

    return () => {
      unsubscribeBlogs();
      unsubscribeProjects();
      unsubscribeMessages();
    };
  }, []);

  useEffect(() => {
    if (!isEditing || !currentPost) return;
    const timer = setInterval(() => {
      handleSaveBlog(true);
    }, 10000);
    return () => clearInterval(timer);
  }, [isEditing, currentPost, blogFormData, blocks, seoData]);

  const handleAIAction = async (action: string, blockId?: string) => {
    setIsAIProcessing(true);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY; // Updated to Vite env
      if (!apiKey) throw new Error("GEMINI_API_KEY is not defined");
      
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Use stable model
      
      let prompt = "";
      let targetContent = "";

      if (blockId) {
        const block = blocks.find(b => b.id === blockId);
        if (!block) return;
        targetContent = block.content;
      } else {
        targetContent = blocks.filter(b => b.type === 'text').map(b => b.content).join('\n');
      }

      switch (action) {
        case 'improve': prompt = `Improve the following text for a professional tech blog. Make it more engaging and clear:\n\n${targetContent}`; break;
        case 'grammar': prompt = `Fix any grammar or spelling mistakes in the following text:\n\n${targetContent}`; break;
        case 'expand': prompt = `Expand on the following paragraph, adding more technical detail and depth:\n\n${targetContent}`; break;
        case 'simplify': prompt = `Simplify the following text to make it easier to read for beginners:\n\n${targetContent}`; break;
        case 'summary': prompt = `Generate a concise summary (max 160 characters) for the following blog content. This will be used as a meta description:\n\n${targetContent}`; break;
        case 'keywords': prompt = `Suggest 5-10 SEO keywords for the following content. Return them as a comma-separated list:\n\n${targetContent}`; break;
        case 'headings': prompt = `Suggest a better heading hierarchy for the following content:\n\n${targetContent}`; break;
        case 'title': prompt = `Suggest a catchy, SEO-friendly title for a blog post with the following content:\n\n${targetContent}`; break;
      }

      const response = await model.generateContent(prompt);
      let result = response.response.text();

      // Clean AI artifacts (bullets, dashes, numbering) for meta fields
      const cleanResult = result.replace(/^[-*•\d. ]+/gm, '').trim();

      if (blockId) {
        setBlocks(blocks.map(b => b.id === blockId ? { ...b, content: result } : b));
      } else if (action === 'summary') {
        setSeoData({ ...seoData, description: cleanResult });
        setBlogFormData({ ...blogFormData, description: cleanResult });
      } else if (action === 'keywords') {
        const keywords = cleanResult.split('\n').join(', ');
        setSeoData({ ...seoData, keywords: keywords });
        setBlogFormData({ ...blogFormData, tags: keywords });
      } else if (action === 'title') {
        setSeoData({ ...seoData, title: cleanResult });
        setBlogFormData({ ...blogFormData, title: cleanResult, slug: generateSlug(cleanResult) });
      } else if (['improve', 'grammar', 'expand', 'simplify', 'headings'].includes(action)) {
        // Global actions without blockId: Append a new suggestion block
        const newBlock: Block = {
          id: Date.now().toString(),
          type: 'callout',
          content: result,
          metadata: { title: `AI ${action.charAt(0).toUpperCase() + action.slice(1)} Suggestion` }
        };
        setBlocks([...blocks, newBlock]);
      }
    } catch (error) {
      console.error("AI Action failed:", error);
    } finally {
      setIsAIProcessing(false);
    }
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
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
    setShowCustomCategoryInput(post.category && !BLOG_CATEGORIES.includes(post.category));
    setBlocks(post.blocks || [{ id: '1', type: 'text', content: '' }]);
    setSeoData(post.seo || {
      title: post.title,
      description: post.description || "",
      keywords: "",
      canonicalUrl: "",
      ogTitle: "",
      ogDescription: "",
      ogImage: post.coverImage || "",
    });
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
    setShowCustomCategoryInput(false);
    setBlocks([{ id: '1', type: 'text', content: '' }]);
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

  const handleSaveBlog = async (eOrAutosave: React.FormEvent | boolean) => {
    if (typeof eOrAutosave !== 'boolean') eOrAutosave.preventDefault();
    const isAutosave = typeof eOrAutosave === 'boolean' ? eOrAutosave : false;

    // 1. Validate Cover Image
    if (blogFormData.coverImage) {
      const coverCheck = await validateImageUrl(blogFormData.coverImage);
      if (!coverCheck.isValid) {
        alert(`Cover Image Error: ${coverCheck.error}`);
        return;
      }
    }

    // 2. Validate all block-level images
    for (const block of blocks) {
      if (block.type === 'image' && block.content) {
        const check = await validateImageUrl(block.content);
        if (!check.isValid) {
          alert(`Blog Content Image Error (Block ID ${block.id}): ${check.error}`);
          return;
        }
      }
    }

    const postData = {
      ...blogFormData,
      blocks,
      seo: seoData,
      tags: typeof blogFormData.tags === 'string' ? blogFormData.tags.split(",").map(t => t.trim()).filter(t => t) : blogFormData.tags,
      updatedAt: serverTimestamp(),
      author: user.email,
      readingTime: Math.ceil(blocks.filter(b => b.type === 'text').map(b => b.content).join(' ').split(' ').length / 200)
    };

    try {
      console.log("💾 [DB] Phase 6: Syncing blog to Firestore...", postData.title);
      
      if (currentPost) {
        await updateDoc(doc(db, "blogPosts", currentPost.id), postData);
        console.log("✅ [DB] Update Successful");
      } else if (!isAutosave) {
        // Prevent duplicate creation during rapid saves
        const newDoc = await addDoc(collection(db, "blogPosts"), {
          ...postData,
          createdAt: serverTimestamp(),
          views: 0
        });
        console.log("✅ [DB] Creation Successful. ID:", newDoc.id);
      }
      
      setLastSaved(new Date());
      if (!isAutosave) {
        setIsEditing(false);
        setCurrentPost(null);
        resetBlogForm();
        alert("Success! Blog post published.");
      }
    } catch (error: any) {
      console.error("❌ [DB] Connectivity/Permission Error:", error.code, error.message);
      if (!isAutosave) {
        if (error.code === 'permission-denied') {
          alert("Security Error: You don't have permission to write to this database. Verify you're logged in with an authorized account.");
        } else if (error.code === 'unavailable') {
          alert("Connectivity Error: Firestone is temporarily unavailable. Check your internet connection.");
        } else {
          handleFirestoreError(error, currentPost ? OperationType.UPDATE : OperationType.CREATE, "blogPosts");
        }
      }
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate Project Image
    if (projectFormData.image) {
      const check = await validateImageUrl(projectFormData.image);
      if (!check.isValid) {
        alert(`Project Image Error: ${check.error}`);
        return;
      }
    }

    const projectData = {
      ...projectFormData,
      tech: projectFormData.tech.split(",").map(t => t.trim()).filter(t => t),
      updatedAt: serverTimestamp()
    };

    console.log("💾 Phase 6: Saving project document:", projectData);
    try {
      if (currentProject) {
        await updateDoc(doc(db, "projects", currentProject.id), projectData);
      } else {
        await setDoc(doc(collection(db, "projects")), {
          ...projectData,
          createdAt: serverTimestamp()
        });
      }
      console.log("✅ DOCUMENT SAVED [PROJECT]");
      setIsEditing(false);
      setCurrentProject(null);
      setProjectFormData({ title: "", category: "", description: "", image: "", video: "", tech: "", caseStudy: "", link: "" });
    } catch (error) {
      handleFirestoreError(error, currentProject ? OperationType.UPDATE : OperationType.CREATE, "projects");
    }
  };

  const handleDelete = async (id: string, collectionName: string) => {
    const itemType = collectionName === "blogPosts" ? "post" : collectionName === "projects" ? "project" : "message";
    if (window.confirm(`Are you sure you want to delete this ${itemType}?`)) {
      try {
        await deleteDoc(doc(db, collectionName, id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, collectionName);
      }
    }
  };

  const AdminStatCard = ({ label, value, icon, trend }: { label: string, value: string | number, icon: React.ReactNode, trend?: string }) => (
    <div className="p-8 rounded-[40px] glass-card border border-white/5 group hover:border-brand-primary/30 transition-all">
      <div className="flex justify-between items-start mb-6">
        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-brand-primary group-hover:bg-brand-primary/10 transition-all">
          {icon}
        </div>
        {trend && (
          <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
            <TrendingUp size={10} /> {trend}
          </div>
        )}
      </div>
      <div className="text-3xl font-bold mb-2 tracking-tighter">{value}</div>
      <div className="text-xs font-bold uppercase tracking-widest text-white/20">{label}</div>
    </div>
  );

  if (isDistractionFree && isEditing) {
    return (
      <div className="fixed inset-0 z-[10000] bg-[#0A0A0A] overflow-y-auto p-8 md:p-24">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-24">
            <div className="flex items-center gap-4 text-white/20">
              <Shield size={20} />
              <span className="text-xs font-bold uppercase tracking-widest">Distraction-Free Mode</span>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/20 flex items-center gap-2">
                <Clock size={12} /> {lastSaved ? `Saved at ${lastSaved.toLocaleTimeString()}` : 'Not saved yet'}
              </div>
              <button 
                onClick={() => setIsDistractionFree(false)}
                className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          
          <input 
            type="text" 
            value={blogFormData.title}
            onChange={(e) => setBlogFormData({ ...blogFormData, title: e.target.value, slug: generateSlug(e.target.value) })}
            className="w-full bg-transparent border-none outline-none text-5xl md:text-7xl font-bold mb-12 tracking-tighter text-white placeholder:text-white/10"
            placeholder="Post Title"
          />
          
          <BlogEditor 
            blocks={blocks} 
            setBlocks={setBlocks} 
            onAIAction={(id, action) => handleAIAction(action, id)} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-[#0A0A0A] min-h-screen">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold">Creator <span className="text-brand-primary">Studio</span></h1>
            <p className="text-white/40">Manage your content and authority signals</p>
          </div>
          <div className="flex gap-4">
            {activeTab !== "messages" && activeTab !== "dashboard" && !isEditing && (
              <button 
                onClick={() => {
                  setIsEditing(true);
                  setCurrentPost(null);
                  setCurrentProject(null);
                  if (activeTab === "blogs") {
                    resetBlogForm();
                  } else {
                    setProjectFormData({ title: "", category: "", description: "", image: "", video: "", tech: "", caseStudy: "", link: "" });
                  }
                }}
                className="px-8 py-4 bg-brand-primary text-white rounded-2xl font-bold flex items-center gap-2"
              >
                <Plus size={20} /> Create {activeTab === "blogs" ? "Post" : "Project"}
              </button>
            )}
            <button onClick={() => signOut(auth)} className="px-8 py-4 bg-white/5 border border-white/10 text-white/40 rounded-2xl font-bold flex items-center gap-2 hover:text-white transition-colors">
              <LogOut size={20} /> Logout
            </button>
          </div>
        </div>

        {!isEditing && (
          <div className="flex flex-wrap gap-4 mb-12">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <Layout size={18} /> },
              { id: 'blogs', label: 'Blog Posts', icon: <FileText size={18} /> },
              { id: 'projects', label: 'Projects', icon: <Layers size={18} /> },
              { id: 'messages', label: 'Messages', icon: <MessageSquare size={18} /> },
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "px-8 py-4 rounded-2xl font-bold transition-all flex items-center gap-2", 
                  activeTab === tab.id ? "bg-white text-black" : "bg-white/5 text-white/40 hover:bg-white/10"
                )}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        )}

        {!isEditing && <HealthDashboard />}

        {isEditing ? (
          <div className="space-y-12">
            {activeTab === "blogs" ? (
              <div className="space-y-12">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <button 
                      onClick={() => { setIsEditing(false); setCurrentPost(null); }}
                      className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <div>
                      <h2 className="text-2xl font-bold">{currentPost ? "Edit Post" : "New Post"}</h2>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-white/20 flex items-center gap-2">
                        <Clock size={12} /> {lastSaved ? `Autosaved at ${lastSaved.toLocaleTimeString()}` : 'Draft'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setIsDistractionFree(true)}
                      className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all"
                      title="Distraction-Free Mode"
                    >
                      <Monitor size={20} />
                    </button>
                    <button 
                      onClick={() => handleSaveBlog(false)}
                      className="px-8 py-4 bg-brand-primary text-white rounded-2xl font-bold flex items-center gap-2"
                    >
                      <Save size={20} /> 
                      {currentPost ? "Update" : "Publish"}
                    </button>
                  </div>
                </div>

                <div className="grid lg:grid-cols-[1fr_350px] gap-12">
                  <div className="space-y-12">
                    <div className="glass-card p-12 rounded-[40px] border border-white/10 space-y-12">
                      <div className="space-y-8">
                        <input 
                          type="text" 
                          value={blogFormData.title}
                          onChange={(e) => setBlogFormData({ ...blogFormData, title: e.target.value, slug: generateSlug(e.target.value) })}
                          className="w-full bg-transparent border-none outline-none text-5xl font-bold tracking-tighter text-white placeholder:text-white/10"
                          placeholder="Post Title"
                        />
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                            <LinkIcon size={14} className="text-white/20" />
                            <span className="text-xs text-white/40">ayushpaul.in/blog/</span>
                            <input 
                              type="text" 
                              value={blogFormData.slug}
                              onChange={(e) => setBlogFormData({ ...blogFormData, slug: e.target.value })}
                              className="bg-transparent border-none outline-none text-xs font-bold text-brand-primary w-32"
                            />
                          </div>
                          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                            <Tag size={14} className="text-white/20" />
                            <input 
                              type="text" 
                              value={blogFormData.tags}
                              onChange={(e) => setBlogFormData({ ...blogFormData, tags: e.target.value })}
                              placeholder="Tags (comma separated)"
                              className="bg-transparent border-none outline-none text-xs font-bold text-white/60 w-40"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Cover Image URL</label>
                        <div className="space-y-4">
                          <input 
                            type="text" 
                            value={blogFormData.coverImage}
                            onChange={async (e) => {
                              const url = e.target.value;
                              setBlogFormData({ ...blogFormData, coverImage: url });
                            }}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary"
                          />
                          
                          {blogFormData.coverImage && (
                            <div className="relative group aspect-video rounded-3xl overflow-hidden border border-white/10 bg-white/5">
                              <img src={blogFormData.coverImage} className="w-full h-full object-cover" />
                              <button 
                                onClick={() => setBlogFormData({ ...blogFormData, coverImage: '' })}
                                className="absolute top-4 right-4 p-3 bg-black/50 backdrop-blur-md rounded-full text-white/60 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X size={20} />
                              </button>
                            </div>
                          )}
                          {!blogFormData.coverImage && (
                            <div className="aspect-video rounded-3xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-white/10">
                              <ImageIcon size={48} className="mb-4" />
                              <span className="text-sm font-bold">Preview will appear here</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-12 border-t border-white/10">
                        <BlogEditor 
                          blocks={blocks} 
                          setBlocks={setBlocks} 
                          onAIAction={(id, action) => handleAIAction(action, id)} 
                        />
                      </div>
                    </div>

                    <div className="glass-card p-12 rounded-[40px] border border-white/10">
                      <div className="flex items-center gap-3 mb-12">
                        <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                          <Globe size={20} />
                        </div>
                        <h3 className="text-2xl font-bold">SEO Optimization</h3>
                      </div>
                      <SEOPanel 
                        data={seoData} 
                        setData={setSeoData} 
                        blocks={blocks} 
                        onAIAction={(id, action) => handleAIAction(action, id)} 
                        isProcessing={isAIProcessing}
                      />
                    </div>
                  </div>

                  <div className="space-y-8">
                    <AIWritingAssistant onAction={(action) => handleAIAction(action)} isProcessing={isAIProcessing} />
                    
                    <div className="p-8 rounded-[40px] bg-white/5 border border-white/10 space-y-8">
                      <h3 className="font-bold flex items-center gap-2">
                        <Settings size={18} className="text-white/20" /> Publishing
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                          <div className="flex items-center gap-3">
                            <CheckCircle2 size={18} className={blogFormData.published ? "text-green-500" : "text-white/20"} />
                            <span className="text-sm font-medium">Published</span>
                          </div>
                          <button 
                            onClick={() => setBlogFormData({ ...blogFormData, published: !blogFormData.published })}
                            className={cn(
                              "w-12 h-6 rounded-full relative transition-all",
                              blogFormData.published ? "bg-green-500" : "bg-white/10"
                            )}
                          >
                            <div className={cn(
                              "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                              blogFormData.published ? "right-1" : "left-1"
                            )} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                          <div className="flex items-center gap-3">
                            <Star size={18} className={blogFormData.featured ? "text-yellow-500" : "text-white/20"} />
                            <span className="text-sm font-medium">Featured Post</span>
                          </div>
                          <button 
                            onClick={() => setBlogFormData({ ...blogFormData, featured: !blogFormData.featured })}
                            className={cn(
                              "w-12 h-6 rounded-full relative transition-all",
                              blogFormData.featured ? "bg-yellow-500" : "bg-white/10"
                            )}
                          >
                            <div className={cn(
                              "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                              blogFormData.featured ? "right-1" : "left-1"
                            )} />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Category</label>
                        <select 
                          value={showCustomCategoryInput ? "Other" : blogFormData.category}
                          onChange={(e) => {
                            if (e.target.value === "Other") {
                              setShowCustomCategoryInput(true);
                              setBlogFormData({ ...blogFormData, category: "" });
                            } else {
                              setShowCustomCategoryInput(false);
                              setBlogFormData({ ...blogFormData, category: e.target.value });
                            }
                          }}
                          className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none cursor-pointer hover:border-brand-primary/50 transition-colors"
                        >
                          {BLOG_CATEGORIES.map(cat => (
                            <option key={cat} value={cat} className="bg-[#1A1A1A] text-white">
                              {cat}
                            </option>
                          ))}
                          <option value="Other" className="bg-[#1A1A1A] text-brand-primary font-bold">
                            + Other / Custom...
                          </option>
                        </select>
                        
                        {showCustomCategoryInput && (
                          <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-2"
                          >
                            <input 
                              type="text"
                              placeholder="Enter custom category..."
                              value={blogFormData.category}
                              onChange={(e) => setBlogFormData({ ...blogFormData, category: e.target.value })}
                              className="w-full bg-brand-primary/5 border border-brand-primary/20 rounded-xl px-4 py-3 text-sm outline-none text-brand-primary placeholder:text-brand-primary/30"
                              autoFocus
                            />
                          </motion.div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Schedule Publish</label>
                        <input 
                          type="datetime-local" 
                          value={blogFormData.scheduledAt}
                          onChange={(e) => setBlogFormData({ ...blogFormData, scheduledAt: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveProject} className="glass-card p-12 rounded-[40px] border border-white/10 space-y-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold">{currentProject ? "Edit Project" : "New Project"}</h2>
                  <button 
                    type="button"
                    onClick={() => { setIsEditing(false); setCurrentProject(null); }}
                    className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all"
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
                      onChange={(e) => setProjectFormData({ ...projectFormData, title: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-white/40 ml-1">Category</label>
                    <input 
                      type="text" 
                      value={projectFormData.category}
                      onChange={(e) => setProjectFormData({ ...projectFormData, category: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/40 ml-1">Description</label>
                  <textarea 
                    value={projectFormData.description}
                    onChange={(e) => setProjectFormData({ ...projectFormData, description: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary h-24 resize-none"
                    required
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-white/40 ml-1">Image URL</label>
                    <input 
                      type="text" 
                      value={projectFormData.image}
                      onChange={(e) => setProjectFormData({ ...projectFormData, image: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary"
                      required
                    />
                    {projectFormData.image && (
                      <div className="mt-4 aspect-video rounded-2xl overflow-hidden border border-white/10">
                        <img src={projectFormData.image} className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-white/40 ml-1">Video URL (Optional)</label>
                    <input 
                      type="text" 
                      value={projectFormData.video}
                      onChange={(e) => setProjectFormData({ ...projectFormData, video: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-white/40 ml-1">Technologies (comma separated)</label>
                    <input 
                      type="text" 
                      value={projectFormData.tech}
                      onChange={(e) => setProjectFormData({ ...projectFormData, tech: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-white/40 ml-1">Project Link</label>
                    <input 
                      type="text" 
                      value={projectFormData.link}
                      onChange={(e) => setProjectFormData({ ...projectFormData, link: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/40 ml-1">Case Study Content (Markdown)</label>
                  <textarea 
                    value={projectFormData.caseStudy}
                    onChange={(e) => setProjectFormData({ ...projectFormData, caseStudy: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-primary h-64 resize-none font-mono"
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <button 
                    type="button"
                    onClick={() => { setIsEditing(false); setCurrentProject(null); }}
                    className="px-8 py-4 bg-white/5 border border-white/10 text-white/40 rounded-2xl font-bold hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-10 py-4 bg-brand-primary text-white rounded-2xl font-bold hover:bg-brand-primary/90 transition-all"
                  >
                    {currentProject ? "Update Project" : "Create Project"}
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <div className="space-y-12">
            {activeTab === "dashboard" && (
              <div className="space-y-12">
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-8">
                  <AdminStatCard label="Total Posts" value={posts.length} icon={<FileText size={24} />} trend="+12%" />
                  <AdminStatCard label="Total Views" value={posts.reduce((acc, p) => acc + (p.views || 0), 0)} icon={<Eye size={24} />} trend="+24%" />
                  <AdminStatCard label="Messages" value={messages.length} icon={<MessageSquare size={24} />} trend="+5%" />
                  <AdminStatCard label="Projects" value={projects.length} icon={<Layers size={24} />} />
                  
                  {/* Phase 3 Diagnostic Button */}
                  <div className="p-8 rounded-[40px] bg-brand-primary/10 border border-brand-primary/20 flex flex-col items-center justify-center text-center gap-4 group hover:bg-brand-primary/20 transition-all cursor-pointer" onClick={testConnection}>
                    <div className={cn("w-12 h-12 rounded-2xl bg-brand-primary/20 flex items-center justify-center text-brand-primary group-hover:scale-110 transition-all", isAuditing && "animate-spin")}>
                      <Shield size={24} />
                    </div>
                    <div>
                      <div className="text-xl font-bold">Audit</div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/60">Connection</div>
                    </div>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                  <div className="glass-card p-10 rounded-[40px] border border-white/10">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-xl font-bold">Popular Posts</h3>
                      <BarChart3 size={20} className="text-white/20" />
                    </div>
                    <div className="space-y-6">
                      {posts.sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5).map((post, i) => (
                        <div key={i} className="flex items-center justify-between group cursor-pointer" onClick={() => handleEditBlog(post)}>
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/20 font-bold">
                              {i + 1}
                            </div>
                            <div>
                              <div className="font-bold text-white/80 group-hover:text-brand-primary transition-colors line-clamp-1">{post.title}</div>
                              <div className="text-[10px] font-bold uppercase tracking-widest text-white/20">{post.category}</div>
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
                      <h3 className="text-xl font-bold">Recent Activity</h3>
                      <History size={20} className="text-white/20" />
                    </div>
                    <div className="space-y-8">
                      {messages.slice(0, 5).map((msg, i) => (
                        <div key={i} className="flex gap-4">
                          <div className="w-2 h-2 rounded-full bg-brand-primary mt-2 shrink-0" />
                          <div>
                            <div className="text-sm text-white/80"><span className="font-bold text-white">{msg.name}</span> sent a message about <span className="font-bold text-white">{msg.subject}</span></div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-white/20 mt-1">{formatDate(msg.timestamp)}</div>
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
                    {(['all', 'published', 'draft', 'scheduled', 'featured'] as const).map((f) => (
                      <button 
                        key={f}
                        onClick={() => setBlogFilter(f)}
                        className={cn(
                          "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                          blogFilter === f ? "bg-brand-primary text-white" : "text-white/40 hover:text-white hover:bg-white/5"
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
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm outline-none focus:border-brand-primary"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {posts
                    .filter(p => {
                      if (blogFilter === 'published') return p.published;
                      if (blogFilter === 'draft') return !p.published;
                      if (blogFilter === 'featured') return p.featured;
                      if (blogFilter === 'scheduled') return p.scheduledAt && new Date(p.scheduledAt) > new Date();
                      return true;
                    })
                    .map((post) => (
                    <div key={post.id} className="glass-card rounded-[40px] border border-white/10 overflow-hidden group hover:border-brand-primary/30 transition-all flex flex-col">
                      <div className="aspect-video relative overflow-hidden">
                        <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-4 left-4 flex gap-2">
                          {post.published ? (
                            <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-500 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">Published</span>
                          ) : (
                            <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-500 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">Draft</span>
                          )}
                          {post.featured && (
                            <span className="px-3 py-1 rounded-full bg-brand-primary/20 text-brand-primary text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">Featured</span>
                          )}
                        </div>
                      </div>
                      <div className="p-8 flex-1 flex flex-col">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-brand-primary mb-2">{post.category || "Technology"}</div>
                        <h3 className="text-xl font-bold mb-4 line-clamp-2">{post.title}</h3>
                        <div className="flex items-center gap-4 text-white/40 text-xs mb-8">
                          <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(post.createdAt)}</span>
                          <span className="flex items-center gap-1"><Eye size={12} /> {post.views || 0}</span>
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
                  <div key={project.id} className="glass-card rounded-[40px] border border-white/10 overflow-hidden group hover:border-brand-primary/30 transition-all">
                    <div className="aspect-video relative overflow-hidden">
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-8">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-brand-primary mb-2">{project.category}</div>
                      <h3 className="text-xl font-bold mb-6">{project.title}</h3>
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
                              tech: project.tech.join(", "),
                              caseStudy: project.caseStudy || "",
                              link: project.link || ""
                            });
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

            {activeTab === "messages" && (
              <div className="space-y-6">
                {messages.map((msg) => (
                  <div key={msg.id} className="glass-card p-8 rounded-[40px] border border-white/10 group hover:border-brand-primary/30 transition-all">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-xl">
                          {msg.name[0]}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{msg.name}</h3>
                          <p className="text-white/40 text-sm">{msg.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-white/20">{formatDate(msg.timestamp)}</div>
                        <button 
                          onClick={() => handleDelete(msg.id, "contacts")}
                          className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/20 hover:text-red-500 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="text-xs font-bold uppercase tracking-widest text-brand-primary">{msg.subject}</div>
                      <p className="text-white/60 leading-relaxed">{msg.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {((activeTab === "blogs" && posts.length === 0) || (activeTab === "projects" && projects.length === 0) || (activeTab === "messages" && messages.length === 0)) && (
              <div className="text-center py-24 glass-card rounded-[40px] border border-white/5">
                <p className="text-white/40">No {activeTab === "messages" ? "messages" : "items"} yet. {activeTab !== "messages" && `Start by creating your first ${activeTab === "blogs" ? "article" : "project"}!`}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const AdminPage = () => {
  useSEO({ title: "Admin Dashboard | Ayush Paul", noindex: true });
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    console.log("🕵️ [AUTH] Starting Auth Listener & Redirect Check...");
    
    // Check for redirect results (if user was sent back from Google)
    getRedirectResult(auth).then((result) => {
      if (result?.user) {
        console.log("✅ [AUTH] Redirect Login Success:", result.user.email);
        setUser(result.user);
      }
    }).catch((error) => {
      console.error("❌ [AUTH] Redirect Error:", error);
      setLoginError(`Redirect Login Failed: ${error.message}`);
    });

    const unsub = onAuthStateChanged(auth, (u) => {
      console.log("👤 [AUTH] User state changed:", u?.email || "Signed Out");
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const handleLogin = async () => {
    setLoginError(null);
    setIsLoggingIn(true);
    console.log("🚀 [AUTH] Attempting Popup Login...");

    try {
      await signInWithPopup(auth, googleProvider);
      console.log("✅ [AUTH] Popup Login Success");
    } catch (error: any) {
      console.error("❌ [AUTH] Popup Error Code:", error.code);
      console.error("❌ [AUTH] Popup Error Message:", error.message);

      // Handle specific error cases
      if (error.code === 'auth/popup-closed-by-user') {
        setLoginError("Login cancelled. Please try again.");
      } else if (error.code === 'auth/unauthorized-domain') {
        setLoginError("This domain is not authorized. Please check Firebase Console.");
      } else if (error.code === 'auth/popup-blocked') {
        setLoginError("Popup blocked by browser. Switching to redirect...");
        // Auto-fallback to redirect if popup is blocked
        try {
          await signInWithRedirect(auth, googleProvider);
        } catch (redirectError: any) {
          setLoginError(`Redirect Fallback Failed: ${redirectError.message}`);
        }
      } else {
        // General fallback for all other popup issues on localhost
        console.log("🔄 [AUTH] General Failure - Attempting Redirect Fallback...");
        try {
          await signInWithRedirect(auth, googleProvider);
        } catch (redirectError: any) {
          setLoginError(`Login Error: ${error.message}`);
        }
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0A0A] gap-6">
      <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-xl font-bold tracking-tighter">Initializing Studio</h2>
        <p className="text-white/20 text-xs font-bold uppercase tracking-widest animate-pulse">Checking Authority Keys...</p>
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
          <h1 className="text-3xl font-bold mb-4">Admin Access</h1>
          <p className="text-white/40 mb-12">Please sign in with your authorized account to manage the startup portal.</p>
          
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
              isLoggingIn ? "bg-white/10 text-white/20 cursor-not-allowed" : "bg-white text-black hover:scale-[1.02] active:scale-[0.98]"
            )}
          >
            {isLoggingIn ? (
              <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <LogIn size={24} />
            )}
            {isLoggingIn ? "Authenticating..." : "Sign in with Google"}
          </button>

          {loginError && loginError.includes("blocked") && (
            <p className="mt-6 text-[10px] font-bold uppercase tracking-widest text-white/20 animate-pulse">
              Switching to secure redirect...
            </p>
          )}
        </div>
      </div>
    );
  }

  return <AdminDashboard user={user} />;
};



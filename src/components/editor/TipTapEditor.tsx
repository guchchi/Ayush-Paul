import React, { useEffect, useState, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu, FloatingMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import Blockquote from '@tiptap/extension-blockquote';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import { 
  Plus, Type, List, ListOrdered, ImageIcon, Code, Quote, Info, Minus, 
  Bold, Italic, Link as LinkIcon, Trash2, GripVertical, ChevronDown, Sparkles,
  Heading1, Heading2, Heading3, Text, Image as ImageLucide
} from 'lucide-react';
import { Block, BlockType } from '../../types';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const lowlight = createLowlight(common);

// Custom Callout Extension
import { Node, mergeAttributes } from '@tiptap/core';

const Callout = Node.create({
  name: 'callout',
  group: 'block',
  content: 'inline*',
  addAttributes() {
    return {
      variant: {
        default: 'info',
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: 'div[data-type="callout"]',
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'callout', class: `callout callout-${HTMLAttributes.variant}` }), 0];
  },
});

interface TipTapEditorProps {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
}

export const TipTapEditor: React.FC<TipTapEditorProps> = ({ blocks, onChange }) => {
  // Convert Blocks to HTML for TipTap Initial State
  const blocksToHtml = (blocks: Block[]) => {
    return blocks.map(block => {
      switch (block.type) {
        case 'heading':
          return `<h${block.metadata?.level || 2}>${block.content}</h${block.metadata?.level || 2}>`;
        case 'text':
          return block.content; // Already HTML (p tags)
        case 'list':
          return block.content; // Already HTML (ul/ol tags)
        case 'image':
          return `<img src="${block.content}" alt="${block.metadata?.alt || ''}" data-alignment="${block.metadata?.alignment || 'center'}" />`;
        case 'quote':
          return `<blockquote>${block.content}</blockquote>`;
        case 'code':
          return `<pre><code class="language-${block.metadata?.language || 'javascript'}">${block.content}</code></pre>`;
        case 'callout':
          return `<div data-type="callout" data-variant="${block.metadata?.variant || 'info'}">${block.content}</div>`;
        case 'divider':
          return `<hr />`;
        default:
          return '';
      }
    }).join('\n');
  };

  const syncBlocks = useCallback((editor: any) => {
    const html = editor.getHTML();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const nodes = Array.from(doc.body.childNodes);
    
    const newBlocks: Block[] = nodes.map((node: any) => {
      const id = Math.random().toString(36).substr(2, 9);
      if (node.nodeType !== Node.ELEMENT_NODE) {
        if (node.textContent?.trim()) {
           return { id, type: 'text', content: `<p>${node.textContent}</p>` };
        }
        return null;
      }

      const element = node as HTMLElement;
      const tag = element.tagName.toLowerCase();

      if (tag.match(/^h[1-6]$/)) {
        return { id, type: 'heading', content: element.innerHTML, metadata: { level: parseInt(tag[1]) } };
      }
      if (tag === 'p') {
        return { id, type: 'text', content: element.outerHTML };
      }
      if (tag === 'ul' || tag === 'ol') {
        return { id, type: 'list', content: element.outerHTML, metadata: { listType: tag === 'ol' ? 'ordered' : 'unordered' } };
      }
      if (tag === 'img') {
        return { id, type: 'image', content: element.getAttribute('src') || '', metadata: { alt: element.getAttribute('alt'), alignment: element.getAttribute('data-alignment') || 'center' } };
      }
      if (tag === 'blockquote') {
        return { id, type: 'quote', content: element.innerHTML };
      }
      if (tag === 'pre') {
        const code = element.querySelector('code');
        const lang = code?.className.replace('language-', '') || 'javascript';
        return { id, type: 'code', content: code?.textContent || '', metadata: { language: lang } };
      }
      if (tag === 'div' && element.getAttribute('data-type') === 'callout') {
        return { id, type: 'callout', content: element.innerHTML, metadata: { variant: element.getAttribute('data-variant') || 'info' } };
      }
      if (tag === 'hr') {
        return { id, type: 'divider', content: '' };
      }

      return { id, type: 'text', content: element.outerHTML };
    }).filter(b => b !== null) as Block[];

    onChange(newBlocks);
  }, [onChange]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3, 4],
        },
      }),
      Image.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            dataAlignment: {
              default: 'center',
              renderHTML: attributes => ({
                'data-alignment': attributes.dataAlignment,
              }),
            },
          };
        },
      }),
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') {
            return 'Heading...';
          }
          return "Press '/' for commands...";
        },
      }),
      Typography,
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Callout,
      HorizontalRule,
    ],
    content: blocksToHtml(blocks),
    onUpdate: ({ editor }) => {
      syncBlocks(editor);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[600px] py-10 editor-surface prose-headings:font-display prose-p:text-white/70 prose-p:leading-relaxed prose-headings:text-white',
      },
      handleKeyDown: (view, event) => {
        if (event.key === '/') {
          // Trigger slash menu (handled via state in component)
          setSlashMenuPos(view.coordsAtPos(view.state.selection.from));
          setShowSlashMenu(true);
        }
        return false;
      }
    },
  });

  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashMenuPos, setSlashMenuPos] = useState({ top: 0, left: 0 });

  const executeCommand = (command: () => void) => {
    command();
    setShowSlashMenu(false);
    // Delete the slash
    editor?.chain().focus().deleteRange({ from: editor.state.selection.from - 1, to: editor.state.selection.from }).run();
  };

  // Handle external content updates (like AI actions or Smart Import)
  useEffect(() => {
    if (editor && blocks.length > 0) {
      const currentHtml = editor.getHTML();
      const newHtml = blocksToHtml(blocks);
      
      // Only update if there's a meaningful change to avoid cursor resets
      if (currentHtml !== newHtml) {
        editor.commands.setContent(newHtml, false);
      }
    }
  }, [editor, blocks]);

  if (!editor) {
    return null;
  }

  return (
    <div className="relative group/editor">
      <FloatingMenu editor={editor} tippyOptions={{ duration: 100 }}>
        <div className="flex items-center gap-1 p-1 bg-[#111111] border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl">
          <button 
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className="p-2 rounded-xl hover:bg-white/5 text-white/40 hover:text-brand-primary transition-all"
            title="Heading 2"
          >
            <span className="text-xs font-bold px-1">H2</span>
          </button>
          <button 
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className="p-2 rounded-xl hover:bg-white/5 text-white/40 hover:text-brand-primary transition-all"
            title="Heading 3"
          >
            <span className="text-xs font-bold px-1">H3</span>
          </button>
          <button 
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className="p-2 rounded-xl hover:bg-white/5 text-white/40 hover:text-brand-primary transition-all"
            title="Bullet List"
          >
            <List size={18} />
          </button>
          <div className="w-px h-4 bg-white/10 mx-1" />
          <button 
            onClick={() => {
              const url = window.prompt('Image URL');
              if (url) editor.chain().focus().setImage({ src: url }).run();
            }}
            className="p-2 rounded-xl hover:bg-white/5 text-white/40 hover:text-brand-primary transition-all"
            title="Image"
          >
            <ImageIcon size={18} />
          </button>
          <button 
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className="p-2 rounded-xl hover:bg-white/5 text-white/40 hover:text-brand-primary transition-all"
            title="Code Block"
          >
            <Code size={18} />
          </button>
          <button 
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className="p-2 rounded-xl hover:bg-white/5 text-white/40 hover:text-brand-primary transition-all"
            title="Quote"
          >
            <Quote size={18} />
          </button>
        </div>
      </FloatingMenu>

      <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
        <div className="flex items-center gap-1 p-1 bg-[#111111] border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={cn("p-2 rounded-xl transition-all", editor.isActive('bold') ? "bg-brand-primary text-black" : "text-white/40 hover:bg-white/5")}
          >
            <Bold size={18} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={cn("p-2 rounded-xl transition-all", editor.isActive('italic') ? "bg-brand-primary text-black" : "text-white/40 hover:bg-white/5")}
          >
            <Italic size={18} />
          </button>
          
          {editor.isActive('image') && (
            <button
              onClick={() => {
                const url = window.prompt('Update Image URL', editor.getAttributes('image').src);
                if (url) editor.chain().focus().setImage({ src: url }).run();
              }}
              className="p-2 rounded-xl text-white/40 hover:bg-white/5 transition-all"
              title="Edit Image"
            >
              <ImageLucide size={18} />
            </button>
          )}

          <button
            onClick={() => {
              const url = window.prompt('URL');
              if (url) editor.chain().focus().setLink({ href: url }).run();
            }}
            className={cn("p-2 rounded-xl transition-all", editor.isActive('link') ? "bg-brand-primary text-black" : "text-white/40 hover:bg-white/5")}
          >
            <LinkIcon size={18} />
          </button>
          <div className="w-px h-4 bg-white/10 mx-1" />
          <button
            onClick={() => editor.chain().focus().unsetAllMarks().run()}
            className="p-2 rounded-xl text-white/40 hover:bg-white/5 transition-all"
          >
            <Minus size={18} />
          </button>
        </div>
      </BubbleMenu>

      <div className="min-h-[600px] bg-white/[0.02] border border-white/10 rounded-[40px] p-12 relative transition-all hover:bg-white/[0.03] shadow-2xl">
        <EditorContent editor={editor} />
        
        {showSlashMenu && (
          <div 
            className="fixed z-[10000] w-64 bg-[#111111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in duration-200"
            style={{ top: slashMenuPos.top + 24, left: slashMenuPos.left }}
          >
            <div className="p-2 border-b border-white/5 bg-white/[0.02]">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 px-3 py-1">Commands</p>
            </div>
            <div className="p-1 max-h-80 overflow-y-auto">
              {[
                { label: 'Heading 2', icon: <Heading2 size={16} />, cmd: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
                { label: 'Heading 3', icon: <Heading3 size={16} />, cmd: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
                { label: 'Bullet List', icon: <List size={16} />, cmd: () => editor.chain().focus().toggleBulletList().run() },
                { label: 'Numbered List', icon: <ListOrdered size={16} />, cmd: () => editor.chain().focus().toggleOrderedList().run() },
                { label: 'Image', icon: <ImageLucide size={16} />, cmd: () => {
                  const url = window.prompt('Image URL');
                  if (url) editor.chain().focus().setImage({ src: url }).run();
                }},
                { label: 'Quote', icon: <Quote size={16} />, cmd: () => editor.chain().focus().toggleBlockquote().run() },
                { label: 'Code Block', icon: <Code size={16} />, cmd: () => editor.chain().focus().toggleCodeBlock().run() },
                { label: 'Divider', icon: <Minus size={16} />, cmd: () => editor.chain().focus().setHorizontalRule().run() },
              ].map(item => (
                <button
                  key={item.label}
                  onClick={() => executeCommand(item.cmd)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-brand-primary/10 hover:text-brand-primary text-white/60 transition-all text-left group"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-brand-primary/20 transition-colors">
                    {item.icon}
                  </div>
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {!editor.getText() && (
          <div className="absolute top-12 left-12 pointer-events-none text-white/10 font-bold uppercase tracking-widest text-sm flex items-center gap-3">
            <Sparkles size={16} className="animate-pulse" />
            Paste your narrative or type '/' for magic...
          </div>
        )}
      </div>

      {/* Global Slash Menu Backdrop for closing */}
      {showSlashMenu && (
        <div 
          className="fixed inset-0 z-[9999]" 
          onClick={() => setShowSlashMenu(false)}
        />
      )}
    </div>
  );
};

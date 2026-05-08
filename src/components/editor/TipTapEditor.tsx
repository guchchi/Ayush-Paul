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
  Bold, Italic, Link as LinkIcon, Trash2, GripVertical, ChevronDown, Sparkles
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
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[500px] py-10 editor-surface',
      },
    },
  });

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

      <div className="min-h-[500px] bg-white/[0.02] border border-white/10 rounded-[32px] p-10 relative">
        <EditorContent editor={editor} />
        
        {!editor.getText() && (
          <div className="absolute top-10 left-10 pointer-events-none text-white/10 font-bold uppercase tracking-widest text-sm">
            Start your innovation narrative...
          </div>
        )}
      </div>
    </div>
  );
};

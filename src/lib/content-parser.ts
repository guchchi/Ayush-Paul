import { Block, BlockType } from '../types';

export interface ParsedContent {
  title: string;
  category: string;
  slug: string;
  blocks: Block[];
  metadata: {
    readingTime: number;
    wordCount: number;
    excerpt: string;
  };
}

/**
 * Elite Content Parser v3
 * Handles Markdown, HTML, and Raw Text with intelligent hierarchy correction.
 */
export const parseSmartContent = (text: string): ParsedContent => {
  let content = text.trim();
  const blocks: Block[] = [];
  let title = '';
  let category = 'Artificial Intelligence';
  let slug = '';

  // 1. Extract Explicit Metadata (Title:, Category:, Slug:)
  const titleMatch = content.match(/^Title:\s*(.*)$/im);
  if (titleMatch) {
    title = titleMatch[1].trim();
    content = content.replace(titleMatch[0], '');
  }

  const categoryMatch = content.match(/^Category:\s*(.*)$/im);
  if (categoryMatch) {
    category = categoryMatch[1].trim();
    content = content.replace(categoryMatch[0], '');
  }

  const slugMatch = content.match(/^Slug:\s*(.*)$/im);
  if (slugMatch) {
    slug = slugMatch[1].trim();
    content = content.replace(slugMatch[0], '');
  }

  // 2. Normalize Content (Remove excessive whitespace)
  content = content.replace(/\n{3,}/g, '\n\n').trim();

  // 3. Parse Lines into Blocks
  const lines = content.split('\n');
  let currentList: string[] = [];
  let inList = false;
  let listType: 'ordered' | 'unordered' = 'unordered';

  const pushList = () => {
    if (currentList.length > 0) {
      const tag = listType === 'ordered' ? 'ol' : 'ul';
      const items = currentList.map(item => `<li>${item}</li>`).join('');
      blocks.push({
        id: Math.random().toString(36).substr(2, 9),
        type: 'list',
        content: `<${tag}>${items}</${tag}>`,
        metadata: { listType }
      });
      currentList = [];
      inList = false;
    }
  };

  lines.forEach((line) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) {
      pushList();
      return;
    }

    // Heading Detection
    const headingMatch = trimmedLine.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      pushList();
      const level = headingMatch[1].length;
      const headingText = headingMatch[2].trim();

      if (!title && level === 1) {
        title = headingText;
      } else {
        // Correct hierarchy: If it's H1 and we already have a title, make it H2
        const correctedLevel = level === 1 ? 2 : level;
        blocks.push({
          id: Math.random().toString(36).substr(2, 9),
          type: 'heading',
          content: headingText,
          metadata: { level: correctedLevel as any }
        });
      }
      return;
    }

    // Quote Detection
    const quoteMatch = trimmedLine.match(/^>\s*(.*)$/);
    if (quoteMatch) {
      pushList();
      blocks.push({
        id: Math.random().toString(36).substr(2, 9),
        type: 'quote',
        content: quoteMatch[1].trim()
      });
      return;
    }

    // List Detection
    const unorderedMatch = trimmedLine.match(/^[-*•]\s+(.*)$/);
    const orderedMatch = trimmedLine.match(/^\d+\.\s+(.*)$/);

    if (unorderedMatch || orderedMatch) {
      const type = orderedMatch ? 'ordered' : 'unordered';
      const itemContent = orderedMatch ? orderedMatch[1].trim() : unorderedMatch![1].trim();

      if (inList && listType !== type) {
        pushList();
      }

      inList = true;
      listType = type;
      currentList.push(itemContent);
      return;
    }

    // Divider Detection
    if (trimmedLine.match(/^---+$|^___+$|^\*\*\*+$/)) {
      pushList();
      blocks.push({
        id: Math.random().toString(36).substr(2, 9),
        type: 'divider',
        content: ''
      });
      return;
    }

    // Default: Text Paragraph
    pushList();
    blocks.push({
      id: Math.random().toString(36).substr(2, 9),
      type: 'text',
      content: `<p>${trimmedLine}</p>`
    });
  });

  pushList();

  // 4. Post-Process Hierarchy
  // Ensure H3 doesn't follow H1 without H2
  let lastHeadingLevel = 1;
  blocks.forEach(block => {
    if (block.type === 'heading') {
      const currentLevel = block.metadata?.level || 2;
      if (currentLevel > lastHeadingLevel + 1) {
        block.metadata!.level = (lastHeadingLevel + 1) as any;
      }
      lastHeadingLevel = block.metadata!.level || 2;
    }
  });

  // 5. Calculate Metadata
  const textOnly = blocks.filter(b => b.type === 'text' || b.type === 'heading').map(b => b.content).join(' ');
  const wordCount = textOnly.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200); // 200 words per minute
  const excerpt = textOnly.substring(0, 160).trim() + '...';

  if (!slug && title) {
    slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  return {
    title: title || 'Untitled Narrative',
    category,
    slug,
    blocks,
    metadata: {
      readingTime,
      wordCount,
      excerpt
    }
  };
};

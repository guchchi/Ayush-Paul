import { IExporter, ExportDTO, ExportBlock } from '../types';

export class MarkdownExporter implements IExporter {
  format = 'markdown';
  version = 'v1';

  async generate(dto: ExportDTO): Promise<Blob> {
    const lines: string[] = [];

    // Add Metadata Header
    lines.push(`---`);
    lines.push(`title: ${dto.title}`);
    lines.push(`generatedAt: ${dto.metadata.generatedAt}`);
    lines.push(`version: ${dto.metadata.version}`);
    lines.push(`status: ${dto.metadata.status}`);
    lines.push(`---`);
    lines.push(``);

    dto.blocks.forEach(block => {
      lines.push(this.renderBlock(block));
      lines.push(``);
    });

    const markdownString = lines.join('\n');
    return new Blob([markdownString], { type: this.getMimeType() });
  }

  getFileExtension(): string {
    return 'md';
  }

  getMimeType(): string {
    return 'text/markdown;charset=utf-8';
  }

  private renderBlock(block: ExportBlock): string {
    switch (block.type) {
      case 'heading':
        const level = block.level || 1;
        return `${'#'.repeat(level)} ${block.content}`;
      case 'paragraph':
        return `${block.content}`;
      case 'quote':
        return `> ${block.content}`;
      case 'list':
        if (Array.isArray(block.content)) {
          return block.content.map(item => `- ${item}`).join('\n');
        }
        return `- ${block.content}`;
      case 'code':
        return `\`\`\`\n${block.content}\n\`\`\``;
      default:
        return `${block.content}`;
    }
  }
}

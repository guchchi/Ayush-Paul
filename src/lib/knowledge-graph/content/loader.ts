export interface ContentDoc {
  contentId: string;
  markdown: string;
  frontmatter: Record<string, any>;
  readingTimeMinutes: number;
}

export interface IContentRepository {
  getContent(contentId: string): Promise<ContentDoc | null>;
  saveContent(contentId: string, markdown: string, frontmatter?: Record<string, any>): Promise<void>;
}

export class InMemoryContentRepository implements IContentRepository {
  private store = new Map<string, ContentDoc>();

  constructor(initialData: Record<string, string> = {}) {
    for (const [id, md] of Object.entries(initialData)) {
      this.saveContentSync(id, md);
    }
  }

  private calculateReadingTime(text: string): number {
    const words = text.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200)); // ~200 WPM
  }

  private saveContentSync(contentId: string, markdown: string, frontmatter: Record<string, any> = {}) {
    this.store.set(contentId, {
      contentId,
      markdown,
      frontmatter,
      readingTimeMinutes: this.calculateReadingTime(markdown)
    });
  }

  async getContent(contentId: string): Promise<ContentDoc | null> {
    return this.store.get(contentId) || null;
  }

  async saveContent(contentId: string, markdown: string, frontmatter: Record<string, any> = {}): Promise<void> {
    this.saveContentSync(contentId, markdown, frontmatter);
  }
}

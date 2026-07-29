import { UndoManager } from '../../../lib/undo/UndoManager';
import { INoteService } from '../../notes/services/INoteService';
import { NoteService } from '../../notes/services/NoteService';
import { IBookmarkService } from '../../bookmarks/services/IBookmarkService';
import { BookmarkService } from '../../bookmarks/services/BookmarkService';
import { StoreNotesRepository } from '../repositories/storeNotesRepository';
import { ExportPipeline } from '../../export/pipeline/ExportPipeline';
import { AuthorityPackExportValidator } from '../../export/pipeline/AuthorityPackValidator';
import { AuthorityPackExportMapper } from '../../export/mappers/AuthorityPackExportMapper';
import { ExporterRegistry } from '../../export/pipeline/ExporterRegistry';
import { MarkdownExporter } from '../../export/exporters/MarkdownExporter';
import { AuthorityPackDomain } from '../types';
import { GenerationCoordinator } from '../application/generationCoordinator';
import { FirestoreAuthorityPackRepository } from '../repositories/firestoreAuthorityPackRepository';
import { AuthorityPackContextBuilder } from '../ai/contextBuilder';
import { AuthorityPackParser } from '../ai/parser';
import { AuthorityPackPromptBuilder } from '../ai/promptBuilder';
import { GeminiAdapter } from '../../../lib/ai/geminiAdapter';
import { AuthorityPackSchema } from '../schemas/packSchema';

class Registry {
  public undoManager: UndoManager;
  public noteService: INoteService;
  public bookmarkService: IBookmarkService;
  public exportPipeline: ExportPipeline<AuthorityPackDomain>;
  public generationCoordinator: GenerationCoordinator;

  constructor() {
    this.undoManager = new UndoManager();
    const notesRepo = new StoreNotesRepository();
    this.noteService = new NoteService(notesRepo);
    this.bookmarkService = new BookmarkService();

    const exporterRegistry = new ExporterRegistry();
    exporterRegistry.register(new MarkdownExporter());

    this.exportPipeline = new ExportPipeline<AuthorityPackDomain>(
      new AuthorityPackExportValidator(),
      new AuthorityPackExportMapper(),
      exporterRegistry
    );

    const packRepo = new FirestoreAuthorityPackRepository();
    const contextBuilder = new AuthorityPackContextBuilder();
    const aiAdapter = new GeminiAdapter(process.env.GEMINI_API_KEY || 'dummy_key');
    const parser = {
      parseAndValidate: (raw: any) => AuthorityPackParser.parseAndValidate(raw)
    };

    this.generationCoordinator = new GenerationCoordinator(
      packRepo,
      contextBuilder,
      aiAdapter,
      parser,
      AuthorityPackPromptBuilder.buildGenerationPrompt,
      AuthorityPackSchema
    );
  }
}

// Export a singleton instance of the registry
export const ServiceRegistry = new Registry();

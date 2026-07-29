export interface ExportBlock {
  id: string;
  type: 'heading' | 'paragraph' | 'list' | 'quote' | 'code';
  content: string | string[];
  level?: number; // for headings
}

export interface ExportDTO {
  title: string;
  metadata: {
    generatedAt: string;
    version: string;
    status: string;
    exportSchemaVersion: string;
  };
  blocks: ExportBlock[];
}

export interface IExporter {
  format: string;
  version: string;
  generate(dto: ExportDTO): Promise<Blob>;
  getFileExtension(): string;
  getMimeType(): string;
}

export interface ExportValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface IExportValidator<TDomain> {
  validate(domain: TDomain): ExportValidationResult;
}

export interface IExportMapper<TDomain> {
  mapToDTO(domain: TDomain): ExportDTO;
}

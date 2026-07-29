import { ExportDTO, ExportValidationResult, IExportMapper, IExportValidator } from '../types';
import { ExporterRegistry } from './ExporterRegistry';

export class ExportPipeline<TDomain> {
  constructor(
    private validator: IExportValidator<TDomain>,
    private mapper: IExportMapper<TDomain>,
    private registry: ExporterRegistry
  ) {}

  async execute(domain: TDomain, filename: string, format: string, version: string = 'v1'): Promise<void> {
    // 1. Validate
    const validation = this.validator.validate(domain);
    if (!validation.isValid) {
      throw new Error(`Export Validation Failed:\n${validation.errors.join('\n')}`);
    }

    // 2. Map
    const dto = this.mapper.mapToDTO(domain);

    // 3. Resolve Exporter
    const exporter = this.registry.getExporter(format, version);

    // 4. Generate
    const blob = await exporter.generate(dto);

    // 5. Download
    this.triggerDownload(blob, `${filename}.${exporter.getFileExtension()}`);
  }

  private triggerDownload(blob: Blob, filename: string) {
    // In a browser environment, trigger download
    if (typeof document !== 'undefined') {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 0);
    } else {
      console.warn('Skipping file download in non-browser environment.');
    }
  }
}

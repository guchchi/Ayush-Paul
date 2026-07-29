import { IExporter } from '../types';

export class ExporterRegistry {
  private exporters = new Map<string, IExporter>();

  private getKey(format: string, version: string): string {
    return `${format.toLowerCase()}@${version.toLowerCase()}`;
  }

  public register(exporter: IExporter): void {
    const key = this.getKey(exporter.format, exporter.version);
    this.exporters.set(key, exporter);
  }

  public getExporter(format: string, version: string): IExporter {
    const key = this.getKey(format, version);
    const exporter = this.exporters.get(key);
    if (!exporter) {
      throw new Error(`Exporter not found for format: ${format} version: ${version}`);
    }
    return exporter;
  }
}

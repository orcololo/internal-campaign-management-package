import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createObjectCsvWriter } from 'csv-writer';
import * as fs from 'fs/promises';
import * as path from 'path';
import { randomUUID } from 'crypto';

export interface CsvGenerationOptions {
  data: any[];
  columns: { id: string; title: string }[];
  delimiter?: string;
  encoding?: BufferEncoding;
}

/**
 * CSV Generator Service
 *
 * Generates CSV exports with proper encoding for Excel compatibility.
 * Uses UTF-8 BOM and Brazilian delimiter (semicolon) by default.
 */
@Injectable()
export class CsvGeneratorService {
  private readonly tempDir: string;

  constructor() {
    this.tempDir = path.join(process.cwd(), 'temp');
  }

  /**
   * Ensure temp directory exists
   */
  private async ensureTempDir(): Promise<void> {
    try {
      await fs.access(this.tempDir);
    } catch {
      await fs.mkdir(this.tempDir, { recursive: true });
    }
  }

  /**
   * Generate CSV from data
   *
   * @param options CSV generation options
   * @returns CSV as Buffer with UTF-8 BOM
   */
  async generate(options: CsvGenerationOptions): Promise<Buffer> {
    try {
      await this.ensureTempDir();

      // Generate temporary file path
      const tempFilePath = path.join(this.tempDir, `${randomUUID()}.csv`);

      // Default delimiter for Brazilian Excel (semicolon)
      const delimiter = options.delimiter || ';';

      // Create CSV writer
      const csvWriter = createObjectCsvWriter({
        path: tempFilePath,
        header: options.columns,
        fieldDelimiter: delimiter,
        encoding: 'utf8',
      });

      // Write data to CSV
      await csvWriter.writeRecords(options.data);

      // Read the file
      const csvContent = await fs.readFile(tempFilePath, 'utf-8');

      // Delete temp file
      await fs.unlink(tempFilePath);

      // Add UTF-8 BOM for Excel compatibility
      const BOM = '\uFEFF';
      const csvWithBOM = BOM + csvContent;

      return Buffer.from(csvWithBOM, 'utf-8');
    } catch (error) {
      throw new InternalServerErrorException(`Failed to generate CSV: ${error.message}`);
    }
  }

  /**
   * Generate CSV from objects (auto-detect columns)
   *
   * @param data Array of objects
   * @param columnTitles Optional custom column titles (key -> title mapping)
   * @returns CSV as Buffer
   */
  async generateFromObjects(data: any[], columnTitles?: Record<string, string>): Promise<Buffer> {
    if (!data || data.length === 0) {
      throw new InternalServerErrorException('No data provided for CSV generation');
    }

    // Auto-detect columns from first object
    const firstRow = data[0];
    const columns = Object.keys(firstRow).map((key) => ({
      id: key,
      title: columnTitles?.[key] || this.formatColumnTitle(key),
    }));

    return this.generate({ data, columns });
  }

  /**
   * Format column key to readable title
   * Example: "firstName" -> "First Name"
   */
  private formatColumnTitle(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1') // Add space before capitals
      .replace(/_/g, ' ') // Replace underscores with spaces
      .trim()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  /**
   * Generate CSV with custom options
   *
   * @param data Array of objects
   * @param options Custom options
   * @returns CSV as Buffer
   */
  async generateWithOptions(
    data: any[],
    options: {
      columns?: { id: string; title: string }[];
      delimiter?: string;
      includeHeaders?: boolean;
    },
  ): Promise<Buffer> {
    if (!data || data.length === 0) {
      throw new InternalServerErrorException('No data provided for CSV generation');
    }

    // Auto-detect columns if not provided
    const columns =
      options.columns ||
      Object.keys(data[0]).map((key) => ({
        id: key,
        title: this.formatColumnTitle(key),
      }));

    return this.generate({
      data,
      columns,
      delimiter: options.delimiter,
    });
  }
}

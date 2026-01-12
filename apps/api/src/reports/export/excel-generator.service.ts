import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as ExcelJS from 'exceljs';

export interface ExcelGenerationOptions {
  data: any[];
  columns: { header: string; key: string; width?: number }[];
  sheetName?: string;
  title?: string;
  includeFilters?: boolean;
  includeSummary?: boolean;
  summary?: {
    total: number;
    [key: string]: any;
  };
}

/**
 * Excel Generator Service
 *
 * Generates Excel (.xlsx) exports with styling, filters, and formatting.
 * Uses ExcelJS for rich spreadsheet features.
 */
@Injectable()
export class ExcelGeneratorService {
  /**
   * Generate Excel file from data
   *
   * @param options Excel generation options
   * @returns Excel file as Buffer
   */
  async generate(options: ExcelGenerationOptions): Promise<Buffer> {
    try {
      // Create new workbook
      const workbook = new ExcelJS.Workbook();

      // Set workbook properties
      workbook.creator = 'Campaign Platform';
      workbook.created = new Date();
      workbook.modified = new Date();

      // Add worksheet
      const sheetName = options.sheetName || 'Relatório';
      const worksheet = workbook.addWorksheet(sheetName);

      let currentRow = 1;

      // Add title if provided
      if (options.title) {
        worksheet.mergeCells(
          `A${currentRow}:${this.getColumnLetter(options.columns.length)}${currentRow}`,
        );
        const titleCell = worksheet.getCell(`A${currentRow}`);
        titleCell.value = options.title;
        titleCell.font = { size: 16, bold: true, color: { argb: 'FF1E40AF' } };
        titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
        titleCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFEFF6FF' },
        };
        worksheet.getRow(currentRow).height = 30;
        currentRow += 2;
      }

      // Add summary section if provided
      if (options.includeSummary && options.summary) {
        worksheet.mergeCells(
          `A${currentRow}:${this.getColumnLetter(options.columns.length)}${currentRow}`,
        );
        const summaryHeaderCell = worksheet.getCell(`A${currentRow}`);
        summaryHeaderCell.value = 'Resumo';
        summaryHeaderCell.font = { size: 12, bold: true };
        summaryHeaderCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFE5E7EB' },
        };
        currentRow++;

        // Add summary items
        Object.entries(options.summary).forEach(([key, value]) => {
          const summaryRow = worksheet.getRow(currentRow);
          summaryRow.getCell(1).value = this.formatSummaryLabel(key);
          summaryRow.getCell(2).value = value;
          summaryRow.getCell(1).font = { bold: true };
          currentRow++;
        });

        currentRow++; // Empty row after summary
      }

      const headerRow = currentRow;

      // Define columns
      worksheet.columns = options.columns.map((col) => ({
        header: col.header,
        key: col.key,
        width: col.width || 20,
      }));

      // Style header row
      const headerRowObj = worksheet.getRow(headerRow);
      headerRowObj.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
      headerRowObj.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF2563EB' },
      };
      headerRowObj.alignment = { horizontal: 'center', vertical: 'middle' };
      headerRowObj.height = 25;

      // Add borders to header
      headerRowObj.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin', color: { argb: 'FF000000' } },
          left: { style: 'thin', color: { argb: 'FF000000' } },
          bottom: { style: 'thin', color: { argb: 'FF000000' } },
          right: { style: 'thin', color: { argb: 'FF000000' } },
        };
      });

      // Add data rows
      options.data.forEach((item, index) => {
        const row = worksheet.addRow(item);

        // Alternate row colors
        if (index % 2 === 1) {
          row.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF9FAFB' },
          };
        }

        // Add borders
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
            left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
            bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
            right: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          };
          cell.alignment = { vertical: 'middle', wrapText: false };
        });
      });

      // Add auto-filter if enabled
      if (options.includeFilters) {
        worksheet.autoFilter = {
          from: { row: headerRow, column: 1 },
          to: { row: headerRow, column: options.columns.length },
        };
      }

      // Freeze header row
      worksheet.views = [{ state: 'frozen', ySplit: headerRow }];

      // Generate buffer
      const buffer = await workbook.xlsx.writeBuffer();
      return Buffer.from(buffer);
    } catch (error) {
      throw new InternalServerErrorException(`Failed to generate Excel: ${error.message}`);
    }
  }

  /**
   * Generate Excel from objects (auto-detect columns)
   *
   * @param data Array of objects
   * @param options Optional configuration
   * @returns Excel file as Buffer
   */
  async generateFromObjects(
    data: any[],
    options?: {
      sheetName?: string;
      title?: string;
      includeFilters?: boolean;
      columnWidths?: Record<string, number>;
      columnTitles?: Record<string, string>;
    },
  ): Promise<Buffer> {
    if (!data || data.length === 0) {
      throw new InternalServerErrorException('No data provided for Excel generation');
    }

    // Auto-detect columns from first object
    const firstRow = data[0];
    const columns = Object.keys(firstRow).map((key) => ({
      header: options?.columnTitles?.[key] || this.formatColumnTitle(key),
      key,
      width: options?.columnWidths?.[key] || 20,
    }));

    return this.generate({
      data,
      columns,
      sheetName: options?.sheetName,
      title: options?.title,
      includeFilters: options?.includeFilters ?? true,
    });
  }

  /**
   * Get Excel column letter from index (A, B, C, ... Z, AA, AB, ...)
   */
  private getColumnLetter(columnIndex: number): string {
    let letter = '';
    while (columnIndex > 0) {
      const remainder = (columnIndex - 1) % 26;
      letter = String.fromCharCode(65 + remainder) + letter;
      columnIndex = Math.floor((columnIndex - 1) / 26);
    }
    return letter;
  }

  /**
   * Format column key to readable title
   * Example: "firstName" -> "First Name"
   */
  private formatColumnTitle(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .trim()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  /**
   * Format summary label for display
   */
  private formatSummaryLabel(key: string): string {
    const labels: Record<string, string> = {
      total: 'Total de Registros',
      average: 'Média',
      sum: 'Soma',
      min: 'Mínimo',
      max: 'Máximo',
    };
    return labels[key] || this.formatColumnTitle(key);
  }
}

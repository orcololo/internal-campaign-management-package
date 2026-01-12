import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable, Logger } from '@nestjs/common';
import { PdfGeneratorService } from '../export/pdf-generator.service';
import { CsvGeneratorService } from '../export/csv-generator.service';
import { ExcelGeneratorService } from '../export/excel-generator.service';
import { ReportsService } from '../reports.service';
import { ExportFormat } from '../dto/export-report.dto';

export interface ExportJobData {
  reportId: string;
  userId: string;
  format: ExportFormat;
  includeSummary?: boolean;
  includeFilters?: boolean;
}

export interface ExportJobResult {
  fileBuffer: Buffer;
  fileName: string;
  mimeType: string;
}

/**
 * Export Report Processor
 *
 * Handles background export jobs using Bull queue.
 * Processes large report exports asynchronously.
 */
@Processor('export-report')
@Injectable()
export class ExportReportProcessor {
  private readonly logger = new Logger(ExportReportProcessor.name);

  constructor(
    private readonly reportsService: ReportsService,
    private readonly pdfGenerator: PdfGeneratorService,
    private readonly csvGenerator: CsvGeneratorService,
    private readonly excelGenerator: ExcelGeneratorService,
  ) {}

  /**
   * Process export job
   *
   * @param job Bull job with export configuration
   * @returns Export result with file buffer
   */
  @Process('generate')
  async handleExport(job: Job<ExportJobData>): Promise<ExportJobResult> {
    const { reportId, userId, format, includeSummary, includeFilters } = job.data;

    this.logger.log(
      `Processing export job ${job.id} for report ${reportId} in format ${format}`,
    );

    try {
      // Update job progress
      await job.progress(10);

      // Execute report to get data
      const reportResult = await this.reportsService.executeReport(reportId, userId);
      await job.progress(40);

      // Get summary if requested
      let summary = null;
      if (includeSummary) {
        summary = await this.reportsService.getReportSummary(reportId, userId);
        await job.progress(50);
      }

      // Generate export based on format
      let fileBuffer: Buffer;
      let fileName: string;
      let mimeType: string;

      switch (format) {
        case ExportFormat.PDF:
          fileBuffer = await this.generatePdf(reportResult, summary);
          fileName = `${reportResult.report.name}_${Date.now()}.pdf`;
          mimeType = 'application/pdf';
          break;

        case ExportFormat.CSV:
          fileBuffer = await this.generateCsv(reportResult);
          fileName = `${reportResult.report.name}_${Date.now()}.csv`;
          mimeType = 'text/csv';
          break;

        case ExportFormat.EXCEL:
          fileBuffer = await this.generateExcel(reportResult, summary, includeFilters);
          fileName = `${reportResult.report.name}_${Date.now()}.xlsx`;
          mimeType =
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          break;

        default:
          throw new Error(`Unsupported format: ${format}`);
      }

      await job.progress(100);

      this.logger.log(`Export job ${job.id} completed successfully`);

      return {
        fileBuffer,
        fileName,
        mimeType,
      };
    } catch (error) {
      this.logger.error(`Export job ${job.id} failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Generate PDF export
   */
  private async generatePdf(reportResult: any, summary: any): Promise<Buffer> {
    // Extract column names from data
    const columns =
      reportResult.data.length > 0 ? Object.keys(reportResult.data[0]) : [];

    return this.pdfGenerator.generate({
      reportName: reportResult.report.name,
      description: reportResult.report.description,
      data: reportResult.data,
      columns,
      summary: summary
        ? {
            total: summary.totalCount,
            supportLevel: summary.supportLevelBreakdown,
            cityBreakdown: summary.cityBreakdown,
          }
        : undefined,
      generatedBy: 'Sistema',
    });
  }

  /**
   * Generate CSV export
   */
  private async generateCsv(reportResult: any): Promise<Buffer> {
    if (reportResult.data.length === 0) {
      return Buffer.from('Nenhum dado encontrado', 'utf-8');
    }

    return this.csvGenerator.generateFromObjects(reportResult.data);
  }

  /**
   * Generate Excel export
   */
  private async generateExcel(
    reportResult: any,
    summary: any,
    includeFilters?: boolean,
  ): Promise<Buffer> {
    if (reportResult.data.length === 0) {
      // Create empty workbook with message
      return this.excelGenerator.generateFromObjects(
        [{ mensagem: 'Nenhum dado encontrado' }],
        {
          sheetName: reportResult.report.name,
          title: reportResult.report.name,
          includeFilters: false,
        },
      );
    }

    return this.excelGenerator.generateFromObjects(reportResult.data, {
      sheetName: reportResult.report.name,
      title: reportResult.report.name,
      includeFilters: includeFilters ?? true,
    });
  }
}

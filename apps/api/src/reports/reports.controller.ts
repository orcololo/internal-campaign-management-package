import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { InjectQueue } from '@nestjs/bull';
import { Queue, Job } from 'bull';
import { ReportsService } from './reports.service';
import { SavedReportsService } from './saved-reports.service';
import { PdfGeneratorService } from './export/pdf-generator.service';
import { CsvGeneratorService } from './export/csv-generator.service';
import { ExcelGeneratorService } from './export/excel-generator.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { FilterReportDto } from './dto/filter-report.dto';
import { PreviewReportDto } from './dto/preview-report.dto';
import { ExportReportDto, ExportFormat } from './dto/export-report.dto';
import { MockAuthGuard } from '@/common/guards/mock-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { ExportJobData, ExportJobResult } from './processors/export-report.processor';

@ApiTags('Reports')
@Controller('reports')
@UseGuards(MockAuthGuard)
@ApiBearerAuth()
export class ReportsController {
  private readonly EXPORT_THRESHOLD = 5000; // Queue exports larger than this

  constructor(
    private readonly reportsService: ReportsService,
    private readonly savedReportsService: SavedReportsService,
    private readonly pdfGenerator: PdfGeneratorService,
    private readonly csvGenerator: CsvGeneratorService,
    private readonly excelGenerator: ExcelGeneratorService,
    @InjectQueue('export-report') private readonly exportQueue: Queue,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new saved report' })
  @ApiResponse({
    status: 201,
    description: 'Report created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input',
  })
  create(@CurrentUser('id') userId: string, @Body() dto: CreateReportDto) {
    return this.savedReportsService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all saved reports for current user' })
  @ApiResponse({
    status: 200,
    description: 'Reports retrieved successfully',
  })
  findAll(@CurrentUser('id') userId: string, @Query() filters: FilterReportDto) {
    return this.savedReportsService.findAll(userId, filters);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get report statistics for current user' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  getStatistics(@CurrentUser('id') userId: string) {
    return this.savedReportsService.getStatistics(userId);
  }

  @Get('most-used')
  @ApiOperation({ summary: 'Get most used reports' })
  @ApiResponse({
    status: 200,
    description: 'Most used reports retrieved successfully',
  })
  getMostUsed(@CurrentUser('id') userId: string) {
    return this.savedReportsService.getMostUsed(userId);
  }

  @Get('recently-used')
  @ApiOperation({ summary: 'Get recently used reports' })
  @ApiResponse({
    status: 200,
    description: 'Recently used reports retrieved successfully',
  })
  getRecentlyUsed(@CurrentUser('id') userId: string) {
    return this.savedReportsService.getRecentlyUsed(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a saved report by ID' })
  @ApiResponse({
    status: 200,
    description: 'Report retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Report not found',
  })
  findOne(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.savedReportsService.findOne(id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a saved report' })
  @ApiResponse({
    status: 200,
    description: 'Report updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Report not found',
  })
  update(@Param('id') id: string, @CurrentUser('id') userId: string, @Body() dto: UpdateReportDto) {
    return this.savedReportsService.update(id, userId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a saved report (soft delete)' })
  @ApiResponse({
    status: 200,
    description: 'Report deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Report not found',
  })
  async remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    await this.savedReportsService.remove(id, userId);
    return { message: 'Report deleted successfully' };
  }

  @Post(':id/preview')
  @ApiOperation({ summary: 'Preview report data with pagination' })
  @ApiResponse({
    status: 200,
    description: 'Report preview generated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Report not found',
  })
  previewReport(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: PreviewReportDto,
  ) {
    return this.reportsService.previewReport(id, userId, dto);
  }

  @Post(':id/execute')
  @ApiOperation({ summary: 'Execute report and return all data' })
  @ApiResponse({
    status: 200,
    description: 'Report executed successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Report not found',
  })
  executeReport(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.reportsService.executeReport(id, userId);
  }

  @Get(':id/summary')
  @ApiOperation({ summary: 'Get report summary statistics' })
  @ApiResponse({
    status: 200,
    description: 'Report summary retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Report not found',
  })
  getSummary(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.reportsService.getReportSummary(id, userId);
  }

  @Get(':id/validate')
  @ApiOperation({ summary: 'Validate report configuration' })
  @ApiResponse({
    status: 200,
    description: 'Validation result returned',
  })
  @ApiResponse({
    status: 404,
    description: 'Report not found',
  })
  async validateReport(@Param('id') id: string, @CurrentUser('id') userId: string) {
    const report = await this.savedReportsService.findOne(id, userId);
    return this.reportsService.validateReport(report);
  }

  @Post(':id/export')
  @ApiOperation({ summary: 'Export report in specified format' })
  @ApiResponse({
    status: 200,
    description: 'Export generated successfully or job queued',
  })
  @ApiResponse({
    status: 404,
    description: 'Report not found',
  })
  async exportReport(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: ExportReportDto,
    @Res() res: Response,
  ) {
    // Get report summary to check size
    const summary = await this.reportsService.getReportSummary(id, userId);
    const recordCount = summary.summary.total;

    // If dataset is large, queue the export
    if (recordCount > this.EXPORT_THRESHOLD) {
      const job = await this.exportQueue.add('generate', {
        reportId: id,
        userId,
        format: dto.format,
        includeSummary: dto.includeSummary,
        includeFilters: dto.includeFilters,
      } as ExportJobData);

      return res.status(HttpStatus.ACCEPTED).json({
        message: 'Export job queued successfully',
        jobId: job.id,
        status: 'queued',
        estimatedTime: Math.ceil(recordCount / 1000) * 5, // ~5 seconds per 1000 records
        statusUrl: `/reports/exports/${job.id}/status`,
      });
    }

    // For smaller datasets, generate immediately
    const reportResult = await this.reportsService.executeReport(id, userId);

    let fileBuffer: Buffer;
    let fileName: string;
    let mimeType: string;

    switch (dto.format) {
      case ExportFormat.PDF:
        const pdfSummary = dto.includeSummary ? summary : null;
        const columns = reportResult.data.length > 0 ? Object.keys(reportResult.data[0]) : [];

        fileBuffer = await this.pdfGenerator.generate({
          reportName: reportResult.report.name,
          description: reportResult.report.description || undefined,
          data: reportResult.data,
          columns,
          summary: pdfSummary
            ? {
                total: pdfSummary.summary.total,
                supportLevel: pdfSummary.summary.supportLevelBreakdown,
                cityBreakdown: pdfSummary.summary.cityBreakdown,
              }
            : undefined,
          generatedBy: 'Sistema',
        });
        fileName = `${reportResult.report.name}_${Date.now()}.pdf`;
        mimeType = 'application/pdf';
        break;

      case ExportFormat.CSV:
        fileBuffer = await this.csvGenerator.generateFromObjects(reportResult.data);
        fileName = `${reportResult.report.name}_${Date.now()}.csv`;
        mimeType = 'text/csv; charset=utf-8';
        break;

      case ExportFormat.EXCEL:
        fileBuffer = await this.excelGenerator.generateFromObjects(reportResult.data, {
          sheetName: reportResult.report.name,
          title: reportResult.report.name,
          includeFilters: dto.includeFilters,
        });
        fileName = `${reportResult.report.name}_${Date.now()}.xlsx`;
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        break;

      default:
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: `Unsupported export format: ${dto.format}`,
        });
    }

    // Set response headers
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Length', fileBuffer.length);

    return res.send(fileBuffer);
  }

  @Get('exports/:jobId/status')
  @ApiOperation({ summary: 'Check export job status' })
  @ApiResponse({
    status: 200,
    description: 'Job status retrieved',
  })
  @ApiResponse({
    status: 404,
    description: 'Job not found',
  })
  async getExportStatus(@Param('jobId') jobId: string, @Res() res: Response) {
    const job = await this.exportQueue.getJob(jobId);

    if (!job) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Job not found',
      });
    }

    const state = await job.getState();
    const progress = job.progress();
    const failedReason = job.failedReason;

    // If job is completed, check if we have the result
    if (state === 'completed') {
      const result: ExportJobResult = job.returnvalue;

      if (result && result.fileBuffer) {
        // Return download info
        return res.status(HttpStatus.OK).json({
          status: 'completed',
          jobId: job.id,
          progress: 100,
          result: {
            fileName: result.fileName,
            mimeType: result.mimeType,
            size: result.fileBuffer.length,
            downloadUrl: `/reports/exports/${jobId}/download`,
          },
        });
      }
    }

    return res.status(HttpStatus.OK).json({
      status: state,
      jobId: job.id,
      progress,
      failedReason,
      data: job.data,
    });
  }

  @Get('exports/:jobId/download')
  @ApiOperation({ summary: 'Download completed export' })
  @ApiResponse({
    status: 200,
    description: 'File download started',
  })
  @ApiResponse({
    status: 404,
    description: 'Job not found or not completed',
  })
  async downloadExport(@Param('jobId') jobId: string, @Res() res: Response) {
    const job = await this.exportQueue.getJob(jobId);

    if (!job) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Job not found',
      });
    }

    const state = await job.getState();

    if (state !== 'completed') {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: `Job is not completed yet. Current status: ${state}`,
        statusUrl: `/reports/exports/${jobId}/status`,
      });
    }

    const result: ExportJobResult = job.returnvalue;

    if (!result || !result.fileBuffer) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Export file not found',
      });
    }

    // Set response headers
    res.setHeader('Content-Type', result.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${result.fileName}"`);
    res.setHeader('Content-Length', result.fileBuffer.length);

    return res.send(result.fileBuffer);
  }
}

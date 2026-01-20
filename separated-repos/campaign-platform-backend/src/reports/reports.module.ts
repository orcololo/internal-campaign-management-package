import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { SavedReportsService } from './saved-reports.service';
import { QueryBuilderService } from './query-builder.service';
import { PdfGeneratorService } from './export/pdf-generator.service';
import { CsvGeneratorService } from './export/csv-generator.service';
import { ExcelGeneratorService } from './export/excel-generator.service';
import { ExportReportProcessor } from './processors/export-report.processor';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: configService.get<string>('REDIS_URL'),
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
          removeOnComplete: false,
          removeOnFail: false,
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'export-report',
    }),
  ],
  controllers: [ReportsController],
  providers: [
    ReportsService,
    SavedReportsService,
    QueryBuilderService,
    PdfGeneratorService,
    CsvGeneratorService,
    ExcelGeneratorService,
    ExportReportProcessor,
  ],
  exports: [ReportsService, SavedReportsService, QueryBuilderService],
})
export class ReportsModule {}

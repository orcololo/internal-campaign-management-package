import { Injectable } from '@nestjs/common';
import { isNull, sql } from 'drizzle-orm';
import { DatabaseService } from '../database/database.service';
import { voters } from '../database/schemas/voter.schema';
import { QueryBuilderService } from './query-builder.service';
import { SavedReportsService } from './saved-reports.service';
import { PreviewReportDto } from './dto/preview-report.dto';
import type { SavedReport } from '../database/schemas/saved-report.schema';

/**
 * Reports Service
 *
 * Executes reports by applying filters and sorts to voter data.
 * Uses QueryBuilder to convert report config into SQL queries.
 */
@Injectable()
export class ReportsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly queryBuilder: QueryBuilderService,
    private readonly savedReportsService: SavedReportsService,
  ) {}

  /**
   * Execute a report and return all data
   */
  async executeReport(reportId: string, userId: string) {
    const db = this.databaseService.getDb();

    // Get report configuration
    const report = await this.savedReportsService.findOne(reportId, userId);

    // Increment usage count
    await this.savedReportsService.incrementUsageCount(reportId, userId);

    // Build query from report config
    const whereClause = this.queryBuilder.buildWhereClause((report.filters as any) || []);
    const orderByClause = this.queryBuilder.buildOrderByClause((report.sorting as any) || []);
    const selectClause = this.queryBuilder.buildSelectClause(report.columns);

    // Build base query
    let query = selectClause ? db.select(selectClause).from(voters) : db.select().from(voters);

    // Always filter out soft-deleted voters
    const softDeleteCondition = isNull(voters.deletedAt);

    // Apply WHERE clause
    if (whereClause) {
      query = query.where(sql`${whereClause} AND ${softDeleteCondition}`) as any;
    } else {
      query = query.where(softDeleteCondition) as any;
    }

    // Apply ORDER BY clause
    if (orderByClause.length > 0) {
      query = query.orderBy(...orderByClause) as any;
    }

    // Execute query
    const data = await query;

    return {
      report: {
        id: report.id,
        name: report.name,
        description: report.description,
      },
      data,
      meta: {
        total: data.length,
        executedAt: new Date().toISOString(),
      },
    };
  }

  /**
   * Preview report data with pagination
   */
  async previewReport(reportId: string, userId: string, previewDto: PreviewReportDto) {
    const db = this.databaseService.getDb();

    const { page = 1, perPage = 50 } = previewDto;

    // Get report configuration
    const report = await this.savedReportsService.findOne(reportId, userId);

    // Build query from report config
    const whereClause = this.queryBuilder.buildWhereClause((report.filters as any) || []);
    const orderByClause = this.queryBuilder.buildOrderByClause((report.sorting as any) || []);
    const selectClause = this.queryBuilder.buildSelectClause(report.columns);

    // Build base query for data
    let dataQuery = selectClause ? db.select(selectClause).from(voters) : db.select().from(voters);

    // Always filter out soft-deleted voters
    const softDeleteCondition = isNull(voters.deletedAt);

    // Apply WHERE clause
    if (whereClause) {
      dataQuery = dataQuery.where(sql`${whereClause} AND ${softDeleteCondition}`) as any;
    } else {
      dataQuery = dataQuery.where(softDeleteCondition) as any;
    }

    // Apply ORDER BY clause
    if (orderByClause.length > 0) {
      dataQuery = dataQuery.orderBy(...orderByClause) as any;
    }

    // Apply pagination
    dataQuery = dataQuery.limit(perPage).offset((page - 1) * perPage) as any;

    // Build count query
    let countQuery = db.select({ count: sql<number>`count(*)::int` }).from(voters);

    if (whereClause) {
      countQuery = countQuery.where(sql`${whereClause} AND ${softDeleteCondition}`) as any;
    } else {
      countQuery = countQuery.where(softDeleteCondition) as any;
    }

    // Execute both queries in parallel
    const [data, countResult] = await Promise.all([dataQuery, countQuery]);

    const total = countResult[0]?.count || 0;

    return {
      report: {
        id: report.id,
        name: report.name,
        description: report.description,
      },
      data,
      meta: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
    };
  }

  /**
   * Get report summary statistics
   */
  async getReportSummary(reportId: string, userId: string) {
    const db = this.databaseService.getDb();

    // Get report configuration
    const report = await this.savedReportsService.findOne(reportId, userId);

    // Build query from report config
    const whereClause = this.queryBuilder.buildWhereClause((report.filters as any) || []);
    const softDeleteCondition = isNull(voters.deletedAt);

    // Build count query
    let query = db
      .select({
        total: sql<number>`count(*)::int`,
        supportLevelBreakdown: sql<any>`
          jsonb_object_agg(
            COALESCE(${voters.supportLevel}, 'NAO_DEFINIDO'),
            count(*)
          )
        `,
        cityBreakdown: sql<any>`
          jsonb_object_agg(
            COALESCE(${voters.city}, 'NAO_INFORMADO'),
            count(*)
          )
        `,
      })
      .from(voters);

    if (whereClause) {
      query = query.where(sql`${whereClause} AND ${softDeleteCondition}`) as any;
    } else {
      query = query.where(softDeleteCondition) as any;
    }

    const [result] = await query;

    return {
      report: {
        id: report.id,
        name: report.name,
        description: report.description,
      },
      summary: {
        total: result?.total || 0,
        supportLevelBreakdown: result?.supportLevelBreakdown || {},
        cityBreakdown: result?.cityBreakdown || {},
      },
    };
  }

  /**
   * Validate report filters
   */
  async validateReport(report: SavedReport): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];

    // Validate filters
    if (report.filters) {
      for (const filter of report.filters) {
        if (!this.queryBuilder.isValidField(filter.field)) {
          errors.push(`Invalid filter field: ${filter.field}`);
        }
      }
    }

    // Validate sort
    if (report.sorting) {
      for (const sort of report.sorting) {
        if (!this.queryBuilder.isValidField(sort.field)) {
          errors.push(`Invalid sort field: ${sort.field}`);
        }
      }
    }

    // Validate columns
    if (report.columns) {
      for (const column of report.columns) {
        if (!this.queryBuilder.isValidField(column)) {
          errors.push(`Invalid column: ${column}`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

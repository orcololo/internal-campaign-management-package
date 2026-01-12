import { Injectable, NotFoundException } from '@nestjs/common';
import { eq, and, isNull, sql } from 'drizzle-orm';
import { DatabaseService } from '@/database/database.service';
import { savedReports } from '@/database/schemas/saved-report.schema';
import type { SavedReport, NewSavedReport } from '@/database/schemas/saved-report.schema';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { FilterReportDto } from './dto/filter-report.dto';

/**
 * SavedReports Service
 *
 * Handles CRUD operations for saved reports.
 * Includes soft delete, search, filtering, and usage tracking.
 */
@Injectable()
export class SavedReportsService {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Create a new saved report
   */
  async create(userId: string, dto: CreateReportDto): Promise<SavedReport> {
    const db = this.databaseService.getDb();

    const newReport: NewSavedReport = {
      createdBy: null, // TODO: Set to userId when users table is populated (Phase 10)
      name: dto.name,
      description: dto.description,
      filters: dto.filters as any,
      sorting: dto.sorting as any,
      columns: dto.columns,
      isPublic: dto.isPublic ?? false,
      usageCount: 0,
    };

    const [report] = await db.insert(savedReports).values(newReport).returning();

    return report;
  }

  /**
   * Find all saved reports for a user
   */
  async findAll(userId: string, filters: FilterReportDto) {
    const db = this.databaseService.getDb();

    const { page = 1, perPage = 20, search, isPublic } = filters;

    // Build WHERE conditions
    // TODO: Add createdBy filter when users table is populated (Phase 10)
    const whereConditions: any[] = [
      isNull(savedReports.deletedAt),
    ];

    if (search) {
      whereConditions.push(
        sql`(${savedReports.name} ILIKE ${`%${search}%`} OR ${savedReports.description} ILIKE ${`%${search}%`})`,
      );
    }

    if (isPublic !== undefined) {
      whereConditions.push(eq(savedReports.isPublic, isPublic));
    }

    // Execute queries in parallel
    const [data, countResult] = await Promise.all([
      db
        .select()
        .from(savedReports)
        .where(and(...whereConditions))
        .orderBy(sql`${savedReports.updatedAt} DESC`)
        .limit(perPage)
        .offset((page - 1) * perPage),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(savedReports)
        .where(and(...whereConditions)),
    ]);

    const total = countResult[0]?.count || 0;

    return {
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
   * Find one saved report by ID
   */
  async findOne(id: string, userId: string): Promise<SavedReport> {
    const db = this.databaseService.getDb();

    // TODO: Add createdBy filter when users table is populated (Phase 10)
    const [report] = await db
      .select()
      .from(savedReports)
      .where(
        and(
          eq(savedReports.id, id),
          isNull(savedReports.deletedAt),
        ),
      );

    if (!report) {
      throw new NotFoundException(`Report #${id} not found`);
    }

    return report;
  }

  /**
   * Update a saved report
   */
  async update(id: string, userId: string, dto: UpdateReportDto): Promise<SavedReport> {
    const db = this.databaseService.getDb();

    // Verify report exists
    await this.findOne(id, userId);

    const updateData: Partial<NewSavedReport> = {
      updatedAt: new Date(),
    };

    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.filters !== undefined) updateData.filters = dto.filters as any;
    if (dto.sorting !== undefined) updateData.sorting = dto.sorting as any;
    if (dto.columns !== undefined) updateData.columns = dto.columns;
    if (dto.isPublic !== undefined) updateData.isPublic = dto.isPublic;

    const [updated] = await db
      .update(savedReports)
      .set(updateData)
      .where(eq(savedReports.id, id))
      .returning();

    return updated;
  }

  /**
   * Soft delete a saved report
   */
  async remove(id: string, userId: string): Promise<void> {
    const db = this.databaseService.getDb();

    // Verify report exists
    await this.findOne(id, userId);

    await db.update(savedReports).set({ deletedAt: new Date() }).where(eq(savedReports.id, id));
  }

  /**
   * Increment usage count for a report
   */
  async incrementUsageCount(id: string, userId: string): Promise<void> {
    const db = this.databaseService.getDb();

    // Verify report exists
    await this.findOne(id, userId);

    await db
      .update(savedReports)
      .set({
        usageCount: sql`${savedReports.usageCount} + 1`,
        lastUsedAt: new Date(),
      })
      .where(eq(savedReports.id, id));
  }

  /**
   * Get report statistics for a user
   */
  async getStatistics(userId: string) {
    const db = this.databaseService.getDb();

    const result = await db
      .select({
        total: sql<number>`count(*)::int`,
        totalUsage: sql<number>`sum(${savedReports.usageCount})::int`,
      })
      .from(savedReports)
      .where(and(eq(savedReports.createdBy, userId), isNull(savedReports.deletedAt)));

    return {
      total: result[0]?.total || 0,
      totalUsage: result[0]?.totalUsage || 0,
    };
  }

  /**
   * Get most used reports
   */
  async getMostUsed(userId: string, limit: number = 5): Promise<SavedReport[]> {
    const db = this.databaseService.getDb();

    return db
      .select()
      .from(savedReports)
      .where(and(eq(savedReports.createdBy, userId), isNull(savedReports.deletedAt)))
      .orderBy(sql`${savedReports.usageCount} DESC`)
      .limit(limit);
  }

  /**
   * Get recently used reports
   */
  async getRecentlyUsed(userId: string, limit: number = 5): Promise<SavedReport[]> {
    const db = this.databaseService.getDb();

    return db
      .select()
      .from(savedReports)
      .where(
        and(
          eq(savedReports.createdBy, userId),
          isNull(savedReports.deletedAt),
          sql`${savedReports.lastUsedAt} IS NOT NULL`,
        ),
      )
      .orderBy(sql`${savedReports.lastUsedAt} DESC`)
      .limit(limit);
  }
}

# Implementação Backend - Sistema de Relatórios

**Data:** 12 de janeiro de 2026  
**Status:** 📋 Planejamento  
**Frontend Status:** ✅ Completo

---

## 📋 Visão Geral

Backend completo para geração, salvamento e exportação de relatórios com:

- **Query Builder** dinâmico baseado em filtros
- **Geração de PDF** com puppeteer
- **Exportação CSV/Excel** com bibliotecas dedicadas
- **Sistema de Filas** para processamento assíncrono
- **Cache** para relatórios frequentes
- **RBAC** para controle de acesso

---

## 🏗️ Arquitetura

### Stack Backend

```
NestJS 10
├── Drizzle ORM (PostgreSQL)
├── Bull/BullMQ (Filas)
├── Redis (Cache + Queue)
├── Puppeteer (PDF)
├── ExcelJS (Excel)
├── csv-writer (CSV)
└── JWT + Keycloak (Auth)
```

### Estrutura de Módulos

```
apps/api/src/
├── reports/
│   ├── reports.module.ts
│   ├── reports.controller.ts
│   ├── reports.service.ts
│   ├── saved-reports.service.ts
│   ├── query-builder.service.ts
│   ├── export/
│   │   ├── pdf-generator.service.ts
│   │   ├── csv-generator.service.ts
│   │   └── excel-generator.service.ts
│   ├── processors/
│   │   └── export-report.processor.ts
│   ├── dto/
│   │   ├── create-report.dto.ts
│   │   ├── update-report.dto.ts
│   │   ├── export-report.dto.ts
│   │   └── filter-report.dto.ts
│   └── templates/
│       └── report-template.html
└── database/schemas/
    ├── saved-report.schema.ts
    └── report-export.schema.ts
```

---

## 🗄️ Database Schema

### 1. saved_reports Table

```typescript
// apps/api/src/database/schemas/saved-report.schema.ts
import {
  pgTable,
  uuid,
  varchar,
  text,
  jsonb,
  boolean,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";

export const savedReports = pgTable("saved_reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),

  // Report Configuration (stored as JSON)
  filters: jsonb("filters").notNull().$type<ReportFilter[]>(),
  sorting: jsonb("sorting").notNull().$type<ReportSort[]>(),
  columns: jsonb("columns").notNull().$type<string[]>(),

  // Settings
  includeCharts: boolean("include_charts").default(false),
  groupBy: varchar("group_by", { length: 100 }),

  // Ownership & Sharing
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id),
  isPublic: boolean("is_public").default(false),
  sharedWith: jsonb("shared_with").$type<string[]>().default([]), // user IDs

  // Usage Statistics
  usageCount: integer("usage_count").default(0),
  lastUsedAt: timestamp("last_used_at"),

  // Audit
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});

export type SavedReport = typeof savedReports.$inferSelect;
export type NewSavedReport = typeof savedReports.$inferInsert;
```

**Indexes:**

```sql
CREATE INDEX idx_saved_reports_created_by ON saved_reports(created_by);
CREATE INDEX idx_saved_reports_is_public ON saved_reports(is_public);
CREATE INDEX idx_saved_reports_usage_count ON saved_reports(usage_count DESC);
CREATE INDEX idx_saved_reports_created_at ON saved_reports(created_at DESC);
```

### 2. report_exports Table (Histórico)

```typescript
// apps/api/src/database/schemas/report-export.schema.ts
export const reportExports = pgTable("report_exports", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Report Reference
  savedReportId: uuid("saved_report_id").references(() => savedReports.id),
  reportName: varchar("report_name", { length: 255 }),

  // Export Details
  format: varchar("format", { length: 10 }).notNull(), // pdf, csv, excel
  recordCount: integer("record_count").notNull(),
  fileSize: integer("file_size"), // bytes
  filePath: text("file_path"), // S3 path or local

  // Filters Applied (snapshot)
  appliedFilters: jsonb("applied_filters").$type<ReportFilter[]>(),

  // Processing
  status: varchar("status", { length: 20 }).default("pending"), // pending, processing, completed, failed
  processingTime: integer("processing_time"), // milliseconds
  errorMessage: text("error_message"),

  // User
  exportedBy: uuid("exported_by")
    .notNull()
    .references(() => users.id),
  exportedAt: timestamp("exported_at").defaultNow().notNull(),

  // Expiration (auto-delete after X days)
  expiresAt: timestamp("expires_at"),
  deletedAt: timestamp("deleted_at"),
});

export type ReportExport = typeof reportExports.$inferSelect;
export type NewReportExport = typeof reportExports.$inferInsert;
```

**Indexes:**

```sql
CREATE INDEX idx_report_exports_user ON report_exports(exported_by, exported_at DESC);
CREATE INDEX idx_report_exports_status ON report_exports(status);
CREATE INDEX idx_report_exports_expires ON report_exports(expires_at);
```

### 3. Migration File

```sql
-- drizzle/0004_create_reports_tables.sql
CREATE TABLE saved_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  filters JSONB NOT NULL,
  sorting JSONB NOT NULL,
  columns JSONB NOT NULL,
  include_charts BOOLEAN DEFAULT false,
  group_by VARCHAR(100),
  created_by UUID NOT NULL REFERENCES users(id),
  is_public BOOLEAN DEFAULT false,
  shared_with JSONB DEFAULT '[]',
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMP
);

CREATE TABLE report_exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  saved_report_id UUID REFERENCES saved_reports(id),
  report_name VARCHAR(255),
  format VARCHAR(10) NOT NULL,
  record_count INTEGER NOT NULL,
  file_size INTEGER,
  file_path TEXT,
  applied_filters JSONB,
  status VARCHAR(20) DEFAULT 'pending',
  processing_time INTEGER,
  error_message TEXT,
  exported_by UUID NOT NULL REFERENCES users(id),
  exported_at TIMESTAMP DEFAULT NOW() NOT NULL,
  expires_at TIMESTAMP,
  deleted_at TIMESTAMP
);

-- Indexes
CREATE INDEX idx_saved_reports_created_by ON saved_reports(created_by);
CREATE INDEX idx_saved_reports_is_public ON saved_reports(is_public);
CREATE INDEX idx_saved_reports_usage_count ON saved_reports(usage_count DESC);
CREATE INDEX idx_saved_reports_created_at ON saved_reports(created_at DESC);

CREATE INDEX idx_report_exports_user ON report_exports(exported_by, exported_at DESC);
CREATE INDEX idx_report_exports_status ON report_exports(status);
CREATE INDEX idx_report_exports_expires ON report_exports(expires_at);
```

---

## 📦 DTOs

### 1. Create/Update Report DTO

```typescript
// apps/api/src/reports/dto/create-report.dto.ts
import {
  IsString,
  IsArray,
  IsOptional,
  IsBoolean,
  ValidateNested,
  MinLength,
  MaxLength,
} from "class-validator";
import { Type } from "class-transformer";
import { PartialType } from "@nestjs/mapped-types";

class ReportFilterDto {
  @IsString()
  id: string;

  @IsString()
  field: string;

  @IsString()
  operator: string;

  @IsOptional()
  value: any;

  @IsOptional()
  @IsString()
  logicalOperator?: "AND" | "OR";
}

class ReportSortDto {
  @IsString()
  field: string;

  @IsString()
  direction: "asc" | "desc";
}

export class CreateReportDto {
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReportFilterDto)
  filters: ReportFilterDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReportSortDto)
  sorting: ReportSortDto[];

  @IsArray()
  @IsString({ each: true })
  columns: string[];

  @IsOptional()
  @IsBoolean()
  includeCharts?: boolean;

  @IsOptional()
  @IsString()
  groupBy?: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}

export class UpdateReportDto extends PartialType(CreateReportDto) {}
```

### 2. Export Report DTO

```typescript
// apps/api/src/reports/dto/export-report.dto.ts
export class ExportReportDto {
  @IsString()
  format: "pdf" | "csv" | "excel";

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReportFilterDto)
  filters?: ReportFilterDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReportSortDto)
  sorting?: ReportSortDto[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  columns?: string[];

  @IsOptional()
  @IsBoolean()
  includeCharts?: boolean;
}
```

### 3. Filter Report DTO

```typescript
// apps/api/src/reports/dto/filter-report.dto.ts
import {
  IsOptional,
  IsInt,
  Min,
  Max,
  IsString,
  IsBoolean,
} from "class-validator";
import { Type, Transform } from "class-transformer";

export class FilterReportDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  perPage?: number = 20;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === "true")
  isPublic?: boolean;

  @IsOptional()
  @IsString()
  sortBy?: "name" | "usageCount" | "createdAt" | "updatedAt";

  @IsOptional()
  @IsString()
  sortOrder?: "asc" | "desc";
}
```

---

## 🔧 Services

### 1. Query Builder Service

```typescript
// apps/api/src/reports/query-builder.service.ts
import { Injectable } from "@nestjs/common";
import {
  SQL,
  sql,
  and,
  or,
  eq,
  gt,
  lt,
  gte,
  lte,
  like,
  between,
  inArray,
  notInArray,
  isNull,
  isNotNull,
  asc,
  desc,
} from "drizzle-orm";
import type { ReportFilter, ReportSort } from "./dto/create-report.dto";
import { voters } from "@/database/schemas/voter.schema";

@Injectable()
export class QueryBuilderService {
  buildWhereClause(filters: ReportFilter[]): SQL | undefined {
    if (filters.length === 0) return undefined;

    const conditions: SQL[] = [];
    let currentGroup: SQL[] = [];
    let currentLogicalOp: "AND" | "OR" = "AND";

    for (let i = 0; i < filters.length; i++) {
      const filter = filters[i];
      const condition = this.buildCondition(filter);

      if (condition) {
        if (i === 0) {
          currentGroup.push(condition);
        } else {
          const logicalOp = filter.logicalOperator || "AND";

          if (logicalOp !== currentLogicalOp) {
            // Flush current group
            conditions.push(
              currentLogicalOp === "AND"
                ? and(...currentGroup)!
                : or(...currentGroup)!
            );
            currentGroup = [condition];
            currentLogicalOp = logicalOp;
          } else {
            currentGroup.push(condition);
          }
        }
      }
    }

    // Flush remaining group
    if (currentGroup.length > 0) {
      conditions.push(
        currentLogicalOp === "AND"
          ? and(...currentGroup)!
          : or(...currentGroup)!
      );
    }

    return conditions.length > 0 ? and(...conditions) : undefined;
  }

  private buildCondition(filter: ReportFilter): SQL | undefined {
    const field = voters[filter.field as keyof typeof voters];
    if (!field) return undefined;

    switch (filter.operator) {
      case "equals":
        return eq(field, filter.value);

      case "notEquals":
        return sql`${field} != ${filter.value}`;

      case "contains":
        return like(field, `%${filter.value}%`);

      case "notContains":
        return sql`${field} NOT LIKE ${`%${filter.value}%`}`;

      case "startsWith":
        return like(field, `${filter.value}%`);

      case "endsWith":
        return like(field, `%${filter.value}`);

      case "greaterThan":
        return gt(field, filter.value);

      case "lessThan":
        return lt(field, filter.value);

      case "greaterThanOrEqual":
        return gte(field, filter.value);

      case "lessThanOrEqual":
        return lte(field, filter.value);

      case "between":
        if (Array.isArray(filter.value) && filter.value.length === 2) {
          return between(field, filter.value[0], filter.value[1]);
        }
        return undefined;

      case "in":
        if (Array.isArray(filter.value)) {
          return inArray(field, filter.value);
        }
        return undefined;

      case "notIn":
        if (Array.isArray(filter.value)) {
          return notInArray(field, filter.value);
        }
        return undefined;

      case "isEmpty":
        return or(isNull(field), eq(field, ""))!;

      case "isNotEmpty":
        return and(isNotNull(field), sql`${field} != ''`)!;

      default:
        return undefined;
    }
  }

  buildOrderByClause(sorting: ReportSort[]) {
    return sorting.map((sort) => {
      const field = voters[sort.field as keyof typeof voters];
      return sort.direction === "asc" ? asc(field) : desc(field);
    });
  }

  buildSelectClause(columns: string[]) {
    const select: Record<string, any> = {};

    columns.forEach((column) => {
      if (voters[column as keyof typeof voters]) {
        select[column] = voters[column as keyof typeof voters];
      }
    });

    return select;
  }
}
```

### 2. Reports Service

```typescript
// apps/api/src/reports/reports.service.ts
import { Injectable, Inject } from "@nestjs/common";
import type { Database } from "@/database";
import { voters } from "@/database/schemas/voter.schema";
import { QueryBuilderService } from "./query-builder.service";
import { sql, isNull } from "drizzle-orm";
import type { ReportConfig } from "./dto/create-report.dto";

@Injectable()
export class ReportsService {
  constructor(
    @Inject("DATABASE") private db: Database,
    private queryBuilder: QueryBuilderService
  ) {}

  async executeReport(config: ReportConfig) {
    const { filters, sorting, columns } = config;

    // Build WHERE clause
    const whereClause = this.queryBuilder.buildWhereClause(filters);

    // Build SELECT clause
    const selectClause = this.queryBuilder.buildSelectClause(columns);

    // Build ORDER BY clause
    const orderByClause = this.queryBuilder.buildOrderByClause(sorting);

    // Execute query
    let query = this.db.select(selectClause).from(voters);

    // Always filter soft-deleted
    const conditions = [isNull(voters.deletedAt)];
    if (whereClause) {
      conditions.push(whereClause);
    }

    query = query.where(and(...conditions)) as any;

    if (orderByClause.length > 0) {
      query = query.orderBy(...orderByClause) as any;
    }

    const data = await query;

    // Get total count
    const countQuery = this.db
      .select({ count: sql<number>`count(*)` })
      .from(voters)
      .where(and(...conditions));

    const [{ count }] = await countQuery;

    return {
      data,
      meta: {
        total: Number(count),
        filters: filters.length,
        columns: columns.length,
      },
    };
  }

  async previewReport(config: ReportConfig, page = 1, perPage = 50) {
    const result = await this.executeReport(config);

    const start = (page - 1) * perPage;
    const end = start + perPage;

    return {
      data: result.data.slice(start, end),
      meta: {
        ...result.meta,
        page,
        perPage,
        totalPages: Math.ceil(result.data.length / perPage),
      },
    };
  }
}
```

### 3. PDF Generator Service

```typescript
// apps/api/src/reports/export/pdf-generator.service.ts
import { Injectable } from "@nestjs/common";
import puppeteer from "puppeteer";
import { readFileSync } from "fs";
import { join } from "path";
import Handlebars from "handlebars";
import type { ReportConfig } from "../dto/create-report.dto";

@Injectable()
export class PdfGeneratorService {
  private template: HandlebarsTemplateDelegate;

  constructor() {
    const templatePath = join(__dirname, "../templates/report-template.html");
    const templateHtml = readFileSync(templatePath, "utf-8");
    this.template = Handlebars.compile(templateHtml);

    // Register helpers
    Handlebars.registerHelper("formatDate", (date: Date) => {
      return date?.toLocaleDateString("pt-BR") || "-";
    });

    Handlebars.registerHelper("formatBoolean", (value: boolean) => {
      return value ? "Sim" : "Não";
    });
  }

  async generate(data: any[], config: ReportConfig): Promise<Buffer> {
    const html = this.template({
      reportName: config.name || "Relatório de Eleitores",
      description: config.description,
      generatedAt: new Date().toLocaleString("pt-BR"),
      filters: this.formatFilters(config.filters),
      summary: this.generateSummary(data),
      columns: config.columns.map((col) => this.getFieldLabel(col)),
      data: data.map((row) => this.formatRow(row, config.columns)),
      includeCharts: config.includeCharts,
    });

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "networkidle0" });

      const pdf = await page.pdf({
        format: "A4",
        margin: {
          top: "20mm",
          right: "15mm",
          bottom: "20mm",
          left: "15mm",
        },
        printBackground: true,
        preferCSSPageSize: true,
      });

      return Buffer.from(pdf);
    } finally {
      await browser.close();
    }
  }

  private formatFilters(filters: any[]) {
    return filters.map((f) => ({
      field: this.getFieldLabel(f.field),
      operator: this.getOperatorLabel(f.operator),
      value: this.formatValue(f.value),
    }));
  }

  private generateSummary(data: any[]) {
    return {
      total: data.length,
      // Calculate more stats based on data
    };
  }

  private formatRow(row: any, columns: string[]) {
    return columns.map((col) => this.formatValue(row[col]));
  }

  private getFieldLabel(field: string): string {
    const labels: Record<string, string> = {
      name: "Nome",
      email: "Email",
      phone: "Telefone",
      city: "Cidade",
      state: "Estado",
      supportLevel: "Nível de Apoio",
      // Add all field labels...
    };
    return labels[field] || field;
  }

  private getOperatorLabel(operator: string): string {
    const labels: Record<string, string> = {
      equals: "Igual a",
      contains: "Contém",
      greaterThan: "Maior que",
      lessThan: "Menor que",
      between: "Entre",
      in: "Em",
      isEmpty: "Está vazio",
      // Add all operator labels...
    };
    return labels[operator] || operator;
  }

  private formatValue(value: any): string {
    if (value === null || value === undefined || value === "") return "-";
    if (Array.isArray(value)) return value.join(", ");
    if (value instanceof Date) return value.toLocaleDateString("pt-BR");
    if (typeof value === "boolean") return value ? "Sim" : "Não";
    return String(value);
  }
}
```

### 4. CSV Generator Service

```typescript
// apps/api/src/reports/export/csv-generator.service.ts
import { Injectable } from "@nestjs/common";
import { createObjectCsvWriter } from "csv-writer";
import { tmpdir } from "os";
import { join } from "path";
import { readFileSync, unlinkSync } from "fs";

@Injectable()
export class CsvGeneratorService {
  async generate(data: any[], columns: string[]): Promise<Buffer> {
    const tmpFile = join(tmpdir(), `report-${Date.now()}.csv`);

    const csvWriter = createObjectCsvWriter({
      path: tmpFile,
      header: columns.map((col) => ({
        id: col,
        title: this.getColumnLabel(col),
      })),
      encoding: "utf8",
      fieldDelimiter: ";",
    });

    // Format data
    const formattedData = data.map((row) => {
      const formatted: Record<string, any> = {};
      columns.forEach((col) => {
        formatted[col] = this.formatValue(row[col]);
      });
      return formatted;
    });

    await csvWriter.writeRecords(formattedData);

    const buffer = readFileSync(tmpFile);
    unlinkSync(tmpFile); // Clean up

    return buffer;
  }

  private getColumnLabel(column: string): string {
    const labels: Record<string, string> = {
      name: "Nome",
      email: "Email",
      phone: "Telefone",
      // Add all labels...
    };
    return labels[column] || column;
  }

  private formatValue(value: any): string {
    if (value === null || value === undefined) return "";
    if (Array.isArray(value)) return value.join(", ");
    if (value instanceof Date) return value.toLocaleDateString("pt-BR");
    if (typeof value === "boolean") return value ? "Sim" : "Não";
    return String(value);
  }
}
```

### 5. Excel Generator Service

```typescript
// apps/api/src/reports/export/excel-generator.service.ts
import { Injectable } from "@nestjs/common";
import * as ExcelJS from "exceljs";

@Injectable()
export class ExcelGeneratorService {
  async generate(
    data: any[],
    columns: string[],
    reportName: string
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Relatório");

    // Set metadata
    workbook.creator = "Ele.ia Platform";
    workbook.created = new Date();

    // Add header row
    worksheet.columns = columns.map((col) => ({
      header: this.getColumnLabel(col),
      key: col,
      width: 20,
    }));

    // Style header
    worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF4CAF50" },
    };
    worksheet.getRow(1).alignment = {
      vertical: "middle",
      horizontal: "center",
    };

    // Add data rows
    data.forEach((row) => {
      const formatted: Record<string, any> = {};
      columns.forEach((col) => {
        formatted[col] = this.formatValue(row[col]);
      });
      worksheet.addRow(formatted);
    });

    // Auto-filter
    worksheet.autoFilter = {
      from: "A1",
      to: `${String.fromCharCode(65 + columns.length - 1)}1`,
    };

    // Freeze header row
    worksheet.views = [{ state: "frozen", ySplit: 1 }];

    // Generate buffer
    return (await workbook.xlsx.writeBuffer()) as Buffer;
  }

  private getColumnLabel(column: string): string {
    const labels: Record<string, string> = {
      name: "Nome",
      email: "Email",
      phone: "Telefone",
      // Add all labels...
    };
    return labels[column] || column;
  }

  private formatValue(value: any): any {
    if (value === null || value === undefined) return "";
    if (Array.isArray(value)) return value.join(", ");
    if (value instanceof Date) return value;
    if (typeof value === "boolean") return value ? "Sim" : "Não";
    return value;
  }
}
```

### 6. Saved Reports Service

```typescript
// apps/api/src/reports/saved-reports.service.ts
import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import type { Database } from "@/database";
import { savedReports } from "@/database/schemas/saved-report.schema";
import { eq, and, or, isNull, sql, desc, asc } from "drizzle-orm";
import type { CreateReportDto, UpdateReportDto, FilterReportDto } from "./dto";

@Injectable()
export class SavedReportsService {
  constructor(@Inject("DATABASE") private db: Database) {}

  async create(dto: CreateReportDto, userId: string) {
    const [report] = await this.db
      .insert(savedReports)
      .values({
        ...dto,
        createdBy: userId,
      })
      .returning();

    return report;
  }

  async findAll(userId: string, filters: FilterReportDto) {
    const {
      page = 1,
      perPage = 20,
      search,
      isPublic,
      sortBy,
      sortOrder,
    } = filters;

    const where = [isNull(savedReports.deletedAt)];

    // User can see their own reports + public reports
    where.push(
      or(eq(savedReports.createdBy, userId), eq(savedReports.isPublic, true))!
    );

    if (search) {
      where.push(
        or(
          sql`${savedReports.name} ILIKE ${`%${search}%`}`,
          sql`${savedReports.description} ILIKE ${`%${search}%`}`
        )!
      );
    }

    if (isPublic !== undefined) {
      where.push(eq(savedReports.isPublic, isPublic));
    }

    // Order by
    let orderBy: any = desc(savedReports.updatedAt);
    if (sortBy === "usageCount") {
      orderBy =
        sortOrder === "asc"
          ? asc(savedReports.usageCount)
          : desc(savedReports.usageCount);
    } else if (sortBy === "createdAt") {
      orderBy =
        sortOrder === "asc"
          ? asc(savedReports.createdAt)
          : desc(savedReports.createdAt);
    } else if (sortBy === "name") {
      orderBy =
        sortOrder === "asc" ? asc(savedReports.name) : desc(savedReports.name);
    }

    const [data, count] = await Promise.all([
      this.db
        .select()
        .from(savedReports)
        .where(and(...where))
        .orderBy(orderBy)
        .limit(perPage)
        .offset((page - 1) * perPage),
      this.db
        .select({ count: sql<number>`count(*)` })
        .from(savedReports)
        .where(and(...where)),
    ]);

    return {
      data,
      meta: {
        page,
        perPage,
        total: Number(count[0].count),
        totalPages: Math.ceil(Number(count[0].count) / perPage),
      },
    };
  }

  async findOne(id: string, userId: string) {
    const [report] = await this.db
      .select()
      .from(savedReports)
      .where(
        and(
          eq(savedReports.id, id),
          isNull(savedReports.deletedAt),
          or(
            eq(savedReports.createdBy, userId),
            eq(savedReports.isPublic, true)
          )!
        )
      );

    if (!report) {
      throw new NotFoundException(`Report #${id} not found`);
    }

    return report;
  }

  async update(id: string, userId: string, dto: UpdateReportDto) {
    const report = await this.findOne(id, userId);

    // Only owner can update
    if (report.createdBy !== userId) {
      throw new ForbiddenException("You can only update your own reports");
    }

    const [updated] = await this.db
      .update(savedReports)
      .set({ ...dto, updatedAt: new Date() })
      .where(eq(savedReports.id, id))
      .returning();

    return updated;
  }

  async remove(id: string, userId: string) {
    const report = await this.findOne(id, userId);

    if (report.createdBy !== userId) {
      throw new ForbiddenException("You can only delete your own reports");
    }

    await this.db
      .update(savedReports)
      .set({ deletedAt: new Date() })
      .where(eq(savedReports.id, id));
  }

  async incrementUsage(id: string) {
    await this.db
      .update(savedReports)
      .set({
        usageCount: sql`${savedReports.usageCount} + 1`,
        lastUsedAt: new Date(),
      })
      .where(eq(savedReports.id, id));
  }

  async getMostUsed(userId: string, limit = 5) {
    return this.db
      .select()
      .from(savedReports)
      .where(
        and(
          isNull(savedReports.deletedAt),
          or(
            eq(savedReports.createdBy, userId),
            eq(savedReports.isPublic, true)
          )!
        )
      )
      .orderBy(desc(savedReports.usageCount))
      .limit(limit);
  }
}
```

---

## 🎯 Controller

```typescript
// apps/api/src/reports/reports.controller.ts
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
} from "@nestjs/common";
import { Response } from "express";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";
import { RolesGuard } from "@/common/guards/roles.guard";
import { Roles } from "@/common/decorators/roles.decorator";
import { CurrentUser } from "@/common/decorators/current-user.decorator";
import { SavedReportsService } from "./saved-reports.service";
import { ReportsService } from "./reports.service";
import { PdfGeneratorService } from "./export/pdf-generator.service";
import { CsvGeneratorService } from "./export/csv-generator.service";
import { ExcelGeneratorService } from "./export/excel-generator.service";
import { Queue } from "bull";
import { InjectQueue } from "@nestjs/bull";
import type {
  CreateReportDto,
  UpdateReportDto,
  ExportReportDto,
  FilterReportDto,
} from "./dto";

@Controller("campaigns/:campaignId/reports")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  constructor(
    private savedReportsService: SavedReportsService,
    private reportsService: ReportsService,
    private pdfGenerator: PdfGeneratorService,
    private csvGenerator: CsvGeneratorService,
    private excelGenerator: ExcelGeneratorService,
    @InjectQueue("export-report") private exportQueue: Queue
  ) {}

  @Post()
  @Roles("CANDIDATO", "ESTRATEGISTA")
  async create(
    @Body() dto: CreateReportDto,
    @CurrentUser("id") userId: string
  ) {
    return this.savedReportsService.create(dto, userId);
  }

  @Get()
  @Roles("CANDIDATO", "ESTRATEGISTA", "LIDERANCA", "ESCRITORIO")
  async findAll(
    @Query() filters: FilterReportDto,
    @CurrentUser("id") userId: string
  ) {
    return this.savedReportsService.findAll(userId, filters);
  }

  @Get("most-used")
  @Roles("CANDIDATO", "ESTRATEGISTA", "LIDERANCA", "ESCRITORIO")
  async getMostUsed(@CurrentUser("id") userId: string) {
    return this.savedReportsService.getMostUsed(userId);
  }

  @Get(":id")
  @Roles("CANDIDATO", "ESTRATEGISTA", "LIDERANCA", "ESCRITORIO")
  async findOne(@Param("id") id: string, @CurrentUser("id") userId: string) {
    return this.savedReportsService.findOne(id, userId);
  }

  @Patch(":id")
  @Roles("CANDIDATO", "ESTRATEGISTA")
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateReportDto,
    @CurrentUser("id") userId: string
  ) {
    return this.savedReportsService.update(id, userId, dto);
  }

  @Delete(":id")
  @Roles("CANDIDATO", "ESTRATEGISTA")
  async remove(@Param("id") id: string, @CurrentUser("id") userId: string) {
    await this.savedReportsService.remove(id, userId);
    return { message: "Report deleted successfully" };
  }

  @Post(":id/preview")
  @Roles("CANDIDATO", "ESTRATEGISTA", "LIDERANCA", "ESCRITORIO")
  async preview(
    @Param("id") id: string,
    @Query("page") page: number = 1,
    @Query("perPage") perPage: number = 50,
    @CurrentUser("id") userId: string
  ) {
    const report = await this.savedReportsService.findOne(id, userId);
    return this.reportsService.previewReport(report, page, perPage);
  }

  @Post(":id/export")
  @Roles("CANDIDATO", "ESTRATEGISTA", "LIDERANCA")
  async export(
    @Param("id") id: string,
    @Body() dto: ExportReportDto,
    @CurrentUser("id") userId: string,
    @Res() res: Response
  ) {
    const report = await this.savedReportsService.findOne(id, userId);
    await this.savedReportsService.incrementUsage(id);

    // Execute report
    const result = await this.reportsService.executeReport(report);

    // Check if should queue (large dataset)
    if (result.data.length > 5000) {
      // Add to queue
      const job = await this.exportQueue.add("export", {
        reportId: id,
        userId,
        format: dto.format,
        data: result.data,
        config: report,
      });

      return res.status(HttpStatus.ACCEPTED).json({
        message: "Export queued for processing",
        jobId: job.id,
      });
    }

    // Generate export immediately
    let buffer: Buffer;
    let filename: string;
    let contentType: string;

    switch (dto.format) {
      case "pdf":
        buffer = await this.pdfGenerator.generate(result.data, report);
        filename = `${report.name.replace(/[^a-z0-9]/gi, "_")}.pdf`;
        contentType = "application/pdf";
        break;

      case "csv":
        buffer = await this.csvGenerator.generate(result.data, report.columns);
        filename = `${report.name.replace(/[^a-z0-9]/gi, "_")}.csv`;
        contentType = "text/csv; charset=utf-8";
        break;

      case "excel":
        buffer = await this.excelGenerator.generate(
          result.data,
          report.columns,
          report.name
        );
        filename = `${report.name.replace(/[^a-z0-9]/gi, "_")}.xlsx`;
        contentType =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        break;
    }

    res.set({
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": buffer.length,
    });

    return res.send(buffer);
  }

  @Get("exports/:jobId/status")
  @Roles("CANDIDATO", "ESTRATEGISTA", "LIDERANCA")
  async getExportStatus(@Param("jobId") jobId: string) {
    const job = await this.exportQueue.getJob(jobId);

    if (!job) {
      throw new NotFoundException("Job not found");
    }

    const state = await job.getState();
    const progress = job.progress();

    return {
      id: job.id,
      state,
      progress,
      data: job.data,
      result: state === "completed" ? await job.finished() : null,
    };
  }
}
```

---

## ⚙️ Module Configuration

```typescript
// apps/api/src/reports/reports.module.ts
import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bull";
import { ReportsController } from "./reports.controller";
import { ReportsService } from "./reports.service";
import { SavedReportsService } from "./saved-reports.service";
import { QueryBuilderService } from "./query-builder.service";
import { PdfGeneratorService } from "./export/pdf-generator.service";
import { CsvGeneratorService } from "./export/csv-generator.service";
import { ExcelGeneratorService } from "./export/excel-generator.service";
import { ExportReportProcessor } from "./processors/export-report.processor";

@Module({
  imports: [
    BullModule.registerQueue({
      name: "export-report",
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 1000,
        },
        removeOnComplete: true,
        removeOnFail: false,
      },
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
  exports: [ReportsService, SavedReportsService],
})
export class ReportsModule {}
```

---

## 🔄 Queue Processor

```typescript
// apps/api/src/reports/processors/export-report.processor.ts
import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { Injectable, Logger } from "@nestjs/common";
import { PdfGeneratorService } from "../export/pdf-generator.service";
import { CsvGeneratorService } from "../export/csv-generator.service";
import { ExcelGeneratorService } from "../export/excel-generator.service";
import { S3 } from "aws-sdk";

@Processor("export-report")
@Injectable()
export class ExportReportProcessor {
  private readonly logger = new Logger(ExportReportProcessor.name);
  private s3: S3;

  constructor(
    private pdfGenerator: PdfGeneratorService,
    private csvGenerator: CsvGeneratorService,
    private excelGenerator: ExcelGeneratorService
  ) {
    this.s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
  }

  @Process("export")
  async handleExport(job: Job) {
    const { reportId, userId, format, data, config } = job.data;

    try {
      this.logger.log(`Starting export job ${job.id} for report ${reportId}`);
      await job.progress(10);

      // Generate file
      let buffer: Buffer;
      let extension: string;

      switch (format) {
        case "pdf":
          buffer = await this.pdfGenerator.generate(data, config);
          extension = "pdf";
          break;
        case "csv":
          buffer = await this.csvGenerator.generate(data, config.columns);
          extension = "csv";
          break;
        case "excel":
          buffer = await this.excelGenerator.generate(
            data,
            config.columns,
            config.name
          );
          extension = "xlsx";
          break;
      }

      await job.progress(60);
      this.logger.log(`File generated: ${buffer.length} bytes`);

      // Upload to S3
      const key = `reports/${userId}/${reportId}/${Date.now()}.${extension}`;

      await this.s3
        .putObject({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: key,
          Body: buffer,
          ContentType: this.getContentType(format),
          // Set expiration (7 days)
          Expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        })
        .promise();

      await job.progress(90);
      this.logger.log(`File uploaded to S3: ${key}`);

      // TODO: Save export record to database

      await job.progress(100);

      return {
        success: true,
        url: `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${key}`,
        fileSize: buffer.length,
        recordCount: data.length,
      };
    } catch (error) {
      this.logger.error(`Export failed for job ${job.id}:`, error);
      throw new Error(`Export failed: ${error.message}`);
    }
  }

  private getContentType(format: string): string {
    const types = {
      pdf: "application/pdf",
      csv: "text/csv",
      excel:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    };
    return types[format] || "application/octet-stream";
  }
}
```

---

## 📦 Dependencies

```json
{
  "dependencies": {
    "@nestjs/bull": "^10.0.1",
    "bull": "^4.11.5",
    "puppeteer": "^21.6.1",
    "exceljs": "^4.4.0",
    "csv-writer": "^1.6.0",
    "handlebars": "^4.7.8",
    "aws-sdk": "^2.1505.0"
  },
  "devDependencies": {
    "@types/bull": "^4.10.0",
    "@types/puppeteer": "^7.0.4",
    "@types/exceljs": "^1.3.0"
  }
}
```

---

## 🚀 Implementação em Fases

### **Fase 1: Core (Semana 1)** ⏳

- [ ] Database schemas e migrations
- [ ] DTOs e validação
- [ ] QueryBuilderService
- [ ] ReportsService (execute + preview)
- [ ] SavedReportsService (CRUD completo)
- [ ] Controller básico (sem exportação)

**Entregável:** CRUD de relatórios salvos + preview funcionando

---

### **Fase 2: Exportação Síncrona (Semana 2)** ⏳

- [ ] PdfGeneratorService
- [ ] CsvGeneratorService
- [ ] ExcelGeneratorService
- [ ] HTML template para PDF (Handlebars)
- [ ] Endpoint POST /reports/:id/export
- [ ] Testes com datasets pequenos (<1000 registros)

**Entregável:** Exportação funcionando para relatórios pequenos

---

### **Fase 3: Filas e Processamento Assíncrono (Semana 3)** ⏳

- [ ] Bull/BullMQ setup
- [ ] Redis configuration
- [ ] ExportReportProcessor
- [ ] Job status endpoint (GET /exports/:jobId/status)
- [ ] Error handling e retry logic
- [ ] Threshold de 5000 registros para fila

**Entregável:** Exportação assíncrona para relatórios grandes

---

### **Fase 4: Otimizações e Produção (Semana 4)** ⏳

- [ ] S3 integration para arquivos exportados
- [ ] Cache (Redis) para relatórios frequentes
- [ ] Rate limiting (max 10 exports/minuto)
- [ ] Compression (gzip para arquivos grandes)
- [ ] Cleanup job (delete exports após 7 dias)
- [ ] Monitoring e logging
- [ ] Testes de carga

**Entregável:** Sistema production-ready

---

## 📊 API Endpoints

```
# Saved Reports
POST   /campaigns/:campaignId/reports                    # Create report
GET    /campaigns/:campaignId/reports                    # List reports (with filters)
GET    /campaigns/:campaignId/reports/most-used          # Most used reports
GET    /campaigns/:campaignId/reports/:id                # Get report details
PATCH  /campaigns/:campaignId/reports/:id                # Update report
DELETE /campaigns/:campaignId/reports/:id                # Soft delete report

# Preview & Export
POST   /campaigns/:campaignId/reports/:id/preview        # Preview data (paginated)
POST   /campaigns/:campaignId/reports/:id/export         # Export report (sync or async)

# Job Status (async exports)
GET    /campaigns/:campaignId/reports/exports/:jobId/status  # Check export job status
```

---

## 🔐 Security & Performance

### Rate Limiting

```typescript
// Guard ou interceptor
@UseGuards(RateLimitGuard)
@RateLimit({ max: 10, window: 60 }) // 10 exports per minute
@Post(':id/export')
async export() {}
```

### Caching (Redis)

```typescript
// Cache relatórios frequentes
@CacheTTL(300) // 5 minutes
@Get('most-used')
async getMostUsed() {}
```

### File Size Limits

```typescript
// Max 10MB para PDFs
if (buffer.length > 10 * 1024 * 1024) {
  throw new BadRequestException("Export too large");
}
```

### Timeouts

```typescript
// Max 30s para gerar
const timeout = setTimeout(() => {
  throw new RequestTimeoutException("Export timeout");
}, 30000);
```

---

## 📈 Monitoring

### Logs Importantes

- Export iniciado (userId, reportId, format, recordCount)
- Export concluído (duration, fileSize)
- Export falhado (error, stack trace)
- Queue metrics (waiting, active, completed, failed)

### Métricas

- Exports por usuário/dia
- Tempo médio de geração por formato
- Taxa de sucesso/falha
- Tamanho médio dos arquivos
- Uso de memória/CPU durante geração

---

## 🧪 Testing Strategy

### Unit Tests

- QueryBuilderService (cada operador)
- ReportsService (execute, preview)
- SavedReportsService (CRUD)
- Generators (PDF, CSV, Excel)

### Integration Tests

- Controller endpoints
- Database operations
- Queue processing

### E2E Tests

- Create report → Save → Export → Download
- Large dataset → Queue → Status → Download
- Access control (public vs private reports)

---

## 📝 HTML Template para PDF

```html
<!-- apps/api/src/reports/templates/report-template.html -->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>{{reportName}}</title>
    <style>
      body {
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        margin: 0;
        padding: 20px;
        color: #333;
      }
      .header {
        text-align: center;
        border-bottom: 2px solid #4caf50;
        padding-bottom: 20px;
        margin-bottom: 30px;
      }
      .header h1 {
        color: #4caf50;
        margin: 0 0 10px 0;
      }
      .meta {
        color: #666;
        font-size: 0.9em;
      }
      .filters {
        background: #f5f5f5;
        padding: 15px;
        border-radius: 5px;
        margin-bottom: 20px;
      }
      .filters h3 {
        margin-top: 0;
      }
      .filter-item {
        margin: 5px 0;
        padding: 5px 0;
      }
      .summary {
        display: flex;
        justify-content: space-around;
        margin-bottom: 30px;
      }
      .summary-box {
        text-align: center;
        padding: 15px;
        background: #e3f2fd;
        border-radius: 5px;
      }
      .summary-box .number {
        font-size: 2em;
        font-weight: bold;
        color: #1976d2;
      }
      .summary-box .label {
        color: #666;
        font-size: 0.9em;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
      }
      th,
      td {
        border: 1px solid #ddd;
        padding: 10px;
        text-align: left;
      }
      th {
        background-color: #4caf50;
        color: white;
        font-weight: bold;
      }
      tr:nth-child(even) {
        background-color: #f9f9f9;
      }
      .footer {
        margin-top: 50px;
        text-align: center;
        color: #999;
        font-size: 0.8em;
        border-top: 1px solid #ddd;
        padding-top: 20px;
      }
    </style>
  </head>
  <body>
    <div class="header">
      <h1>{{reportName}}</h1>
      {{#if description}}
      <p>{{description}}</p>
      {{/if}}
      <div class="meta">Gerado em {{generatedAt}} | Ele.ia Platform</div>
    </div>

    {{#if filters}}
    <div class="filters">
      <h3>Filtros Aplicados</h3>
      {{#each filters}}
      <div class="filter-item">
        <strong>{{this.field}}</strong> {{this.operator}}
        <em>{{this.value}}</em>
      </div>
      {{/each}}
    </div>
    {{/if}}

    <div class="summary">
      <div class="summary-box">
        <div class="number">{{summary.total}}</div>
        <div class="label">Registros</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          {{#each columns}}
          <th>{{this}}</th>
          {{/each}}
        </tr>
      </thead>
      <tbody>
        {{#each data}}
        <tr>
          {{#each this}}
          <td>{{this}}</td>
          {{/each}}
        </tr>
        {{/each}}
      </tbody>
    </table>

    <div class="footer">
      Relatório gerado pela plataforma Ele.ia<br />
      © 2026 Todos os direitos reservados
    </div>
  </body>
</html>
```

---

## 🎯 Próximos Passos

1. **Começar pela Fase 1** - Implementar schemas, migrations, DTOs e services básicos
2. **Testar query builder** - Validar todos os operadores com dados reais
3. **Implementar exportação síncrona** - PDF, CSV, Excel para datasets pequenos
4. **Adicionar filas** - Bull + Redis para datasets grandes
5. **Otimizar e deploy** - Cache, S3, monitoring

---

**Última atualização:** 12 de janeiro de 2026  
**Documento mantido por:** Equipe de Desenvolvimento Ele.ia

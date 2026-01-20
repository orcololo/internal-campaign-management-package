export type FilterOperator =
    | "equals"
    | "notEquals"
    | "contains"
    | "notContains"
    | "startsWith"
    | "endsWith"
    | "greaterThan"
    | "lessThan"
    | "greaterThanOrEqual"
    | "lessThanOrEqual"
    | "between"
    | "in"
    | "notIn"
    | "isEmpty"
    | "isNotEmpty";

export type LogicalOperator = "AND" | "OR";

export interface ReportFilter {
    id: string;
    field: string;
    operator: FilterOperator;
    value: any;
    logicalOperator?: LogicalOperator;
}

export interface ReportSort {
    field: string;
    direction: "asc" | "desc";
}

export type ReportFormat = "pdf" | "csv" | "excel";

export interface ReportConfig {
    name: string;
    description?: string;
    filters: ReportFilter[];
    sorting: ReportSort[];
    columns: string[];
    format: ReportFormat;
    includeCharts: boolean;
    groupBy?: string;
}

export interface SavedReport {
    id: string;
    name: string;
    description?: string;
    filters: ReportFilter[];
    sorting: ReportSort[];
    columns: string[];
    createdAt: Date | string;
    updatedAt: Date | string;
    createdBy?: string;
    isPublic: boolean;
    usageCount: number;
    lastUsedAt?: Date | string;
}

export interface ReportExportHistory {
    id: string;
    savedReportId?: string;
    format: ReportFormat;
    recordCount: number;
    fileSize: number;
    exportedAt: Date | string;
    exportedBy: string;
}

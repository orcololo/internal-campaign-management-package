"use client";

import { useState, useMemo } from "react";
import type { Voter } from "@/types/voters";
import type { ReportFilter, ReportSort } from "@/types/reports";
import { getFieldMetadata } from "@/types/reports";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, FileDown, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ReportPreviewProps {
  data: Voter[];
  columns: Array<keyof Voter>;
  filters: ReportFilter[];
  sorting: ReportSort[];
  onExport?: (format: "pdf" | "csv" | "excel") => void;
  isExporting?: boolean;
}

export function ReportPreview({
  data,
  columns,
  filters,
  sorting,
  onExport,
  isExporting = false,
}: ReportPreviewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  // Apply filters
  const filteredData = useMemo(() => {
    if (filters.length === 0) return data;

    return data.filter((voter) => {
      return filters.every((filter, index) => {
        const value = voter[filter.field];
        const filterValue = filter.value;

        // Handle logical operators (AND/OR)
        if (index > 0 && filters[index - 1].logicalOperator === "OR") {
          // OR logic: if previous filter passed, this one can be skipped
          return true;
        }

        // Apply operator logic
        switch (filter.operator) {
          case "equals":
            return value === filterValue;
          case "notEquals":
            return value !== filterValue;
          case "contains":
            return String(value || "")
              .toLowerCase()
              .includes(String(filterValue).toLowerCase());
          case "notContains":
            return !String(value || "")
              .toLowerCase()
              .includes(String(filterValue).toLowerCase());
          case "startsWith":
            return String(value || "")
              .toLowerCase()
              .startsWith(String(filterValue).toLowerCase());
          case "endsWith":
            return String(value || "")
              .toLowerCase()
              .endsWith(String(filterValue).toLowerCase());
          case "greaterThan":
            return Number(value) > Number(filterValue);
          case "lessThan":
            return Number(value) < Number(filterValue);
          case "greaterThanOrEqual":
            return Number(value) >= Number(filterValue);
          case "lessThanOrEqual":
            return Number(value) <= Number(filterValue);
          case "between":
            if (Array.isArray(filterValue) && filterValue.length === 2) {
              const numValue = Number(value);
              return (
                numValue >= Number(filterValue[0]) &&
                numValue <= Number(filterValue[1])
              );
            }
            return false;
          case "in":
            return Array.isArray(filterValue) && filterValue.includes(value);
          case "notIn":
            return Array.isArray(filterValue) && !filterValue.includes(value);
          case "isEmpty":
            return !value || value === "";
          case "isNotEmpty":
            return !!value && value !== "";
          default:
            return true;
        }
      });
    });
  }, [data, filters]);

  // Apply sorting
  const sortedData = useMemo(() => {
    if (sorting.length === 0) return filteredData;

    return [...filteredData].sort((a, b) => {
      for (const sort of sorting) {
        const aValue = a[sort.field];
        const bValue = b[sort.field];

        // Handle null/undefined values
        if (aValue === undefined || aValue === null) return 1;
        if (bValue === undefined || bValue === null) return -1;

        let comparison = 0;
        if (aValue < bValue) comparison = -1;
        if (aValue > bValue) comparison = 1;

        if (comparison !== 0) {
          return sort.direction === "asc" ? comparison : -comparison;
        }
      }
      return 0;
    });
  }, [filteredData, sorting]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatCellValue = (value: any, field: keyof Voter) => {
    if (value === null || value === undefined || value === "") return "-";

    const metadata = getFieldMetadata(field);

    if (metadata?.type === "date" && value instanceof Date) {
      return format(value, "dd/MM/yyyy", { locale: ptBR });
    }

    if (typeof value === "boolean") {
      return value ? "Sim" : "Não";
    }

    if (Array.isArray(value)) {
      return value.join(", ");
    }

    if (typeof value === "object") {
      return JSON.stringify(value);
    }

    return String(value);
  };

  const getColumnLabel = (column: keyof Voter) => {
    return getFieldMetadata(column)?.label || column;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Preview do Relatório</h3>
          <p className="text-sm text-muted-foreground">
            {sortedData.length} registro{sortedData.length !== 1 ? "s" : ""}{" "}
            encontrado
            {sortedData.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onExport?.("csv")}
            disabled={isExporting || sortedData.length === 0}
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <FileDown className="h-4 w-4 mr-2" />
            )}
            CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => onExport?.("excel")}
            disabled={isExporting || sortedData.length === 0}
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <FileDown className="h-4 w-4 mr-2" />
            )}
            Excel
          </Button>
          <Button
            onClick={() => onExport?.("pdf")}
            disabled={isExporting || sortedData.length === 0}
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <FileDown className="h-4 w-4 mr-2" />
            )}
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column as string}>
                  {getColumnLabel(column)}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-8"
                >
                  Nenhum registro encontrado com os filtros aplicados.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((voter) => (
                <TableRow key={voter.id}>
                  {columns.map((column) => (
                    <TableCell key={column as string}>
                      {formatCellValue(voter[column], column)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Página {currentPage} de {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Próxima
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

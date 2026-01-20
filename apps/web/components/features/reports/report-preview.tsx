"use client";

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
import { ChevronLeft, ChevronRight, FileDown, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ReportPreviewProps {
  data: Voter[];
  meta?: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
  columns: Array<keyof Voter>;
  filters: ReportFilter[];
  sorting: ReportSort[];
  onExport?: (format: "pdf" | "csv" | "excel") => void;
  onPageChange?: (page: number) => void;
  isExporting?: boolean;
  isLoading?: boolean;
}

export function ReportPreview({
  data,
  meta,
  columns,
  filters,
  sorting,
  onExport,
  onPageChange,
  isExporting = false,
  isLoading = false,
}: ReportPreviewProps) {
  const formatCellValue = (value: any, field: keyof Voter) => {
    if (value === null || value === undefined || value === "") return "-";

    const metadata = getFieldMetadata(field);

    if (metadata?.type === "date" && (value instanceof Date || typeof value === 'string')) {
      return format(new Date(value), "dd/MM/yyyy", { locale: ptBR });
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
            {meta?.total || 0} registro{meta?.total !== 1 ? "s" : ""}{" "}
            encontrado{meta?.total !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onExport?.("csv")}
            disabled={isExporting || (meta?.total || 0) === 0}
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
            disabled={isExporting || (meta?.total || 0) === 0}
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
            disabled={isExporting || (meta?.total || 0) === 0}
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
      <div className="border rounded-lg relative min-h-[200px]">
        {isLoading && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
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
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-8"
                >
                  Nenhum registro encontrado com os filtros aplicados.
                </TableCell>
              </TableRow>
            ) : (
              data.map((voter) => (
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
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Página {meta.page} de {meta.totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(Math.max(1, meta.page - 1))}
              disabled={meta.page === 1 || isLoading}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(Math.min(meta.totalPages, meta.page + 1))}
              disabled={meta.page === meta.totalPages || isLoading}
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
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { SavedReport } from "@/types/reports";
import type { Voter } from "@/types/voters";
import { getFieldMetadata, getOperatorLabel } from "@/types/reports";
import { useReportsStore } from "@/store/reports-store";
import { ReportPreview } from "./report-preview";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Edit,
  FileDown,
  Calendar,
  Filter,
  Columns,
  ArrowUpDown,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import type { ReportPreviewResponse } from "@/lib/api/endpoints/reports";

interface ReportViewClientProps {
  reportId: string;
}

export function ReportViewClient({ reportId }: ReportViewClientProps) {
  const router = useRouter();
  const { fetchReportById, previewReport, exportReport } = useReportsStore();
  
  const [report, setReport] = useState<SavedReport | null>(null);
  const [data, setData] = useState<Voter[]>([]);
  const [meta, setMeta] = useState<ReportPreviewResponse['meta'] | undefined>(undefined);
  
  const [isLoadingReport, setIsLoadingReport] = useState(true);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Fetch report details
  useEffect(() => {
    const loadReport = async () => {
      setIsLoadingReport(true);
      const fetchedReport = await fetchReportById(reportId);
      if (fetchedReport) {
        setReport(fetchedReport);
      } else {
        toast.error("Relatório não encontrado");
        router.push("/reports");
      }
      setIsLoadingReport(false);
    };
    loadReport();
  }, [reportId, fetchReportById, router]);

  // Fetch preview data
  const loadPreview = useCallback(async (page = 1) => {
    if (!reportId) return;
    
    setIsLoadingPreview(true);
    try {
      const result = await previewReport(reportId, { page, perPage: 20 });
      if (result) {
        setData(result.data);
        setMeta(result.meta);
      }
    } finally {
      setIsLoadingPreview(false);
    }
  }, [reportId, previewReport]);

  // Initial preview load
  useEffect(() => {
    if (report) {
      loadPreview();
    }
  }, [report, loadPreview]);

  const handleExport = async (exportFormat: "pdf" | "csv" | "excel") => {
    setIsExporting(true);
    try {
      const response = await exportReport(reportId, exportFormat);
      if (response && response.downloadUrl) {
         // Should have been handled in store but let's be sure
         // Store handles download automatically
      }
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoadingReport) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!report) {
    return null; // Should have redirected
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/reports">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{report.name}</h1>
            {report.description && (
              <p className="text-muted-foreground">{report.description}</p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/reports/${report.id}/edit`}>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </Link>
        </div>
      </div>

      {/* Metadata */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Criado em</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {format(new Date(report.createdAt), "dd/MM/yy", { locale: ptBR })}
            </div>
            <p className="text-xs text-muted-foreground">
              Atualizado em{" "}
              {format(new Date(report.updatedAt), "dd/MM/yy", { locale: ptBR })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uso</CardTitle>
            <FileDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{report.usageCount}x</div>
            <p className="text-xs text-muted-foreground">
              {report.lastUsedAt
                ? `Último uso: ${format(new Date(report.lastUsedAt), "dd/MM/yy", {
                  locale: ptBR,
                })}`
                : "Nunca usado"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Configuração</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{report.filters.length}</div>
            <p className="text-xs text-muted-foreground">
              {report.columns.length} colunas, {report.sorting.length}{" "}
              ordenações
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Report Configuration */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Filters */}
        {report.filters.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtros Aplicados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {report.filters.map((filter, index) => {
                const fieldMeta = getFieldMetadata(filter.field as keyof Voter);
                return (
                  <div
                    key={filter.id}
                    className="flex items-start gap-2 text-sm"
                  >
                    {index > 0 && filter.logicalOperator && (
                      <Badge variant="outline" className="shrink-0">
                        {filter.logicalOperator === "AND" ? "E" : "OU"}
                      </Badge>
                    )}
                    <div className="flex-1 border rounded-lg p-2 bg-muted/50">
                      <span className="font-medium">
                        {fieldMeta?.label || filter.field}
                      </span>
                      <span className="text-muted-foreground mx-2">
                        {getOperatorLabel(filter.operator)}
                      </span>
                      {filter.value !== null && filter.value !== undefined && (
                        <span className="font-medium">
                          {Array.isArray(filter.value)
                            ? filter.value.join(", ")
                            : String(filter.value)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* Columns */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Columns className="h-4 w-4" />
              Colunas Selecionadas ({report.columns.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {report.columns.map((column) => {
                const fieldMeta = getFieldMetadata(column as keyof Voter);
                return (
                  <Badge key={column as string} variant="secondary">
                    {fieldMeta?.label || column}
                  </Badge>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Sorting */}
        {report.sorting.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4" />
                Ordenação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {report.sorting.map((sort, index) => {
                const fieldMeta = getFieldMetadata(sort.field as keyof Voter);
                return (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Badge variant="outline">{index + 1}</Badge>
                    <span className="font-medium">
                      {fieldMeta?.label || sort.field}
                    </span>
                    <Badge
                      variant={
                        sort.direction === "asc" ? "secondary" : "default"
                      }
                    >
                      {sort.direction === "asc"
                        ? "↑ Crescente"
                        : "↓ Decrescente"}
                    </Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Preview */}
      <Card>
        <CardContent className="pt-6">
          <ReportPreview
            data={data}
            meta={meta}
            columns={report.columns as (keyof Voter)[]}
            filters={report.filters}
            sorting={report.sorting}
            onExport={handleExport}
            isExporting={isExporting}
            isLoading={isLoadingPreview}
            onPageChange={loadPreview}
          />
        </CardContent>
      </Card>
    </div>
  );
}
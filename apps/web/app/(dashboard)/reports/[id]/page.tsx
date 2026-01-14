import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReportViewClient } from "@/components/features/reports/report-view-client";
import {
  ArrowLeft,
  Edit,
  FileDown,
  Calendar,
  Filter,
  Columns,
  ArrowUpDown,
} from "lucide-react";
import { savedReports } from "@/mock-data/reports";
import { votersApi } from "@/lib/api/voters";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getOperatorLabel, getFieldMetadata } from "@/types/reports";
import type { Voter } from "@/types/voters";

async function getVoters() {
  try {
    const response = await votersApi.list({ page: 1, perPage: 1000 });
    return response.data?.data || [];
  } catch {
    return [];
  }
}

export default async function ViewReportPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const report = savedReports.find((r) => r.id === params.id);
  const voters = await getVoters();

  if (!report) {
    notFound();
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
              {format(report.createdAt, "dd/MM/yy", { locale: ptBR })}
            </div>
            <p className="text-xs text-muted-foreground">
              Atualizado em{" "}
              {format(report.updatedAt, "dd/MM/yy", { locale: ptBR })}
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
                ? `Último uso: ${format(report.lastUsedAt, "dd/MM/yy", {
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
      <ReportViewClient report={report} voters={voters} />
    </div>
  );
}

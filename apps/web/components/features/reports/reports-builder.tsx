"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { ReportFilter, ReportSort } from "@/types/reports";
import type { Voter } from "@/types/voters";
import { useReportsStore } from "@/store/reports-store";
import { FilterRow } from "./filter-row";
import { ColumnSelector } from "./column-selector";
import { SortConfigurator } from "./sort-configurator";
import { ReportPreview } from "./report-preview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Save, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { reportsApi, type ReportPreviewResponse } from "@/lib/api/endpoints/reports";

interface ReportsBuilderProps {
  reportId?: string;
  initialFilters?: ReportFilter[];
  initialSorting?: ReportSort[];
  initialColumns?: Array<keyof Voter>;
  initialName?: string;
  initialDescription?: string;
}

export function ReportsBuilder({
  reportId,
  initialFilters = [],
  initialSorting = [],
  initialColumns = ["name", "phone", "email", "city", "supportLevel"],
  initialName = "",
  initialDescription = "",
}: ReportsBuilderProps) {
  const router = useRouter();
  const { createReport, updateReport, fetchReportById, isLoading: isStoreLoading } = useReportsStore();
  const [filters, setFilters] = useState<ReportFilter[]>(initialFilters);
  const [sorting, setSorting] = useState<ReportSort[]>(initialSorting);
  const [columns, setColumns] = useState<Array<keyof Voter>>(initialColumns);
  const [reportName, setReportName] = useState(initialName);
  const [reportDescription, setReportDescription] = useState(initialDescription);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  // Preview state
  const [activeTab, setActiveTab] = useState("filters");
  const [previewData, setPreviewData] = useState<Voter[]>([]);
  const [previewMeta, setPreviewMeta] = useState<ReportPreviewResponse['meta'] | undefined>(undefined);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  // Load existing report data if reportId is provided
  useEffect(() => {
    if (reportId) {
      const loadReport = async () => {
        const report = await fetchReportById(reportId);
        if (report) {
          setFilters(report.filters);
          setSorting(report.sorting);
          setColumns(report.columns as Array<keyof Voter>);
          setReportName(report.name);
          setReportDescription(report.description || "");
        }
      };
      loadReport();
    }
  }, [reportId, fetchReportById]);

  const fetchPreview = useCallback(async (page = 1) => {
    setIsPreviewLoading(true);
    try {
      const response = await reportsApi.executeReport({
        filters,
        sorting,
        columns: columns.map(String),
        page,
        perPage: 20, // Default per page for preview
      });
      
      if (response.data) {
        setPreviewData(response.data.data);
        setPreviewMeta(response.data.meta);
      }
    } catch (error) {
      toast.error("Erro ao carregar preview do relatório");
    } finally {
      setIsPreviewLoading(false);
    }
  }, [filters, sorting, columns]);

  // Fetch preview when switching to preview tab
  useEffect(() => {
    if (activeTab === "preview") {
      fetchPreview();
    }
  }, [activeTab, fetchPreview]);

  const addFilter = () => {
    const newFilter: ReportFilter = {
      id: `f${Date.now()}`,
      field: "name",
      operator: "contains",
      value: "",
      logicalOperator: filters.length > 0 ? "AND" : undefined,
    };
    setFilters([...filters, newFilter]);
  };

  const updateFilter = (index: number, filter: ReportFilter) => {
    const newFilters = [...filters];
    newFilters[index] = filter;
    setFilters(newFilters);
  };

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const handleSaveReport = async () => {
    if (!reportName.trim()) {
      toast.error("Digite um nome para o relatório");
      return;
    }

    let result;
    if (reportId) {
       result = await updateReport(reportId, {
        name: reportName,
        description: reportDescription,
        filters,
        sorting,
        columns: columns.map((c) => String(c)),
        isPublic: false,
      });
    } else {
      result = await createReport({
        name: reportName,
        description: reportDescription,
        filters,
        sorting,
        columns: columns.map((c) => String(c)),
        isPublic: false,
      });
    }

    if (result) {
      setIsSaveDialogOpen(false);
      router.push("/reports");
    }
  };

  const handleExport = async (format: "pdf" | "csv" | "excel") => {
    // If report is not saved, we can't export easily via ID.
    // Ideally, we should suggest saving first, or use executeReport with export flag if backend supports it.
    // Current backend reportsApi.exportReport requires ID.
    if (!reportId) {
      toast.error("Salve o relatório antes de exportar.");
      setIsSaveDialogOpen(true);
      return;
    }

    setIsExporting(true);
    try {
      const response = await reportsApi.exportReport(reportId, format);
      if (response.data.downloadUrl) {
         const blob = await reportsApi.downloadExport(response.data.downloadUrl);
         const url = window.URL.createObjectURL(blob);
         const link = document.createElement("a");
         link.href = url;
         link.download = `report-${reportId}.${format}`;
         document.body.appendChild(link);
         link.click();
         document.body.removeChild(link);
         window.URL.revokeObjectURL(url);
         toast.success("Relatório exportado com sucesso!");
      } else {
        toast.info("Exportação iniciada. Você será notificado quando estiver pronta.");
      }
    } catch (error) {
      toast.error("Erro ao exportar relatório");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Construtor de Relatórios</h1>
          <p className="text-muted-foreground">
            Configure filtros, colunas e ordenação para gerar relatórios
            personalizados
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/reports")}>
            Cancelar
          </Button>
          <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Salvar Template
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Salvar Template de Relatório</DialogTitle>
                <DialogDescription>
                  Salve este relatório para reutilizá-lo no futuro
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Eleitores Engajados de SP"
                    value={reportName}
                    onChange={(e) => setReportName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva o propósito deste relatório..."
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsSaveDialogOpen(false)}
                  disabled={isStoreLoading}
                >
                  Cancelar
                </Button>
                <Button onClick={handleSaveReport} disabled={isStoreLoading}>
                  {isStoreLoading ? "Salvando..." : "Salvar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Builder Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="filters">
            Filtros {filters.length > 0 && `(${filters.length})`}
          </TabsTrigger>
          <TabsTrigger value="columns">
            Colunas {columns.length > 0 && `(${columns.length})`}
          </TabsTrigger>
          <TabsTrigger value="sorting">
            Ordenação {sorting.length > 0 && `(${sorting.length})`}
          </TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        {/* Filters Tab */}
        <TabsContent value="filters" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
              <CardDescription>
                Defina os critérios para filtrar os eleitores que aparecerão no
                relatório
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {filters.length === 0 ? (
                <div className="border border-dashed rounded-lg p-8 text-center">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Nenhum filtro definido. Todos os eleitores serão incluídos
                    no relatório.
                  </p>
                  <Button onClick={addFilter}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Filtro
                  </Button>
                </div>
              ) : (
                <>
                  {filters.map((filter, index) => (
                    <FilterRow
                      key={filter.id}
                      filter={filter}
                      onUpdate={(f) => updateFilter(index, f)}
                      onRemove={() => removeFilter(index)}
                      showLogicalOperator={index > 0}
                    />
                  ))}
                  <Button
                    onClick={addFilter}
                    variant="outline"
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Filtro
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Columns Tab */}
        <TabsContent value="columns">
          <Card>
            <CardHeader>
              <CardTitle>Colunas</CardTitle>
              <CardDescription>
                Selecione quais campos de eleitor aparecerão no relatório
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ColumnSelector selectedColumns={columns} onChange={setColumns} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sorting Tab */}
        <TabsContent value="sorting">
          <Card>
            <CardHeader>
              <CardTitle>Ordenação</CardTitle>
              <CardDescription>
                Defina como os dados serão ordenados no relatório
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SortConfigurator sorting={sorting} onChange={setSorting} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview">
          <Card>
            <CardContent className="pt-6">
              <ReportPreview
                data={previewData}
                meta={previewMeta}
                columns={
                  columns.length > 0
                    ? columns
                    : ["name", "phone", "email", "city"]
                }
                filters={filters}
                sorting={sorting}
                onExport={handleExport}
                isExporting={isExporting}
                isLoading={isPreviewLoading}
                onPageChange={fetchPreview}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
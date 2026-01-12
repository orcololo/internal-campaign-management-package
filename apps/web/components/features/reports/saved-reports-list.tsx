"use client";

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Eye, Edit, Trash2, Copy, FileDown } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { SavedReport } from "@/types/reports";
import { toast } from "sonner";

interface SavedReportsListProps {
  reports: SavedReport[];
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
}

export function SavedReportsList({
  reports,
  onDelete,
  onDuplicate,
}: SavedReportsListProps) {
  const handleDelete = (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja excluir o relatório "${name}"?`)) {
      onDelete?.(id);
      toast.success("Relatório excluído com sucesso");
    }
  };

  const handleDuplicate = (id: string) => {
    onDuplicate?.(id);
    toast.success("Relatório duplicado com sucesso");
  };

  if (reports.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {reports.map((report) => (
        <Card key={report.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1 flex-1">
                <CardTitle className="text-lg">{report.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {report.description || "Sem descrição"}
                </CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/reports/${report.id}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      Visualizar
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/reports/${report.id}/edit`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDuplicate(report.id)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => handleDelete(report.id, report.name)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Filters & Columns Info */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                {report.filters.length} filtro
                {report.filters.length !== 1 ? "s" : ""}
              </Badge>
              <Badge variant="secondary">
                {report.columns.length} coluna
                {report.columns.length !== 1 ? "s" : ""}
              </Badge>
              {report.sorting.length > 0 && (
                <Badge variant="secondary">
                  {report.sorting.length} ordenação
                </Badge>
              )}
              {report.isPublic && <Badge variant="outline">Público</Badge>}
            </div>

            {/* Usage Stats */}
            <div className="text-sm text-muted-foreground space-y-1">
              <div className="flex items-center justify-between">
                <span>Usado {report.usageCount}x</span>
                {report.lastUsedAt && (
                  <span>
                    Último:{" "}
                    {format(report.lastUsedAt, "dd/MM/yy", { locale: ptBR })}
                  </span>
                )}
              </div>
              <div className="text-xs">
                Criado em{" "}
                {format(report.createdAt, "dd/MM/yyyy", { locale: ptBR })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Link href={`/reports/${report.id}`} className="flex-1">
                <Button variant="outline" className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  Ver
                </Button>
              </Link>
              <Link href={`/reports/${report.id}`} className="flex-1">
                <Button className="w-full">
                  <FileDown className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

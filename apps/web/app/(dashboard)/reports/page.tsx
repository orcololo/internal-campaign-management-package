import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, FileText, MoreVertical, Eye, Edit, Trash2, Copy, Calendar, TrendingUp } from "lucide-react";
import { savedReports } from "@/mock-data/reports";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function ReportsPage() {
  const sortedReports = [...savedReports].sort(
    (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Relatórios</h1>
          <p className="text-muted-foreground">
            Crie e gerencie relatórios personalizados de eleitores
          </p>
        </div>
        <Link href="/reports/builder">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Relatório
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Relatórios</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{savedReports.length}</div>
            <p className="text-xs text-muted-foreground">
              {savedReports.filter((r) => r.isPublic).length} públicos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mais Usado</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.max(...savedReports.map((r) => r.usageCount))}
            </div>
            <p className="text-xs text-muted-foreground">
              {savedReports.sort((a, b) => b.usageCount - a.usageCount)[0]?.name}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Último Uso</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Hoje</div>
            <p className="text-xs text-muted-foreground">
              {savedReports.filter(
                (r) => r.lastUsedAt && r.lastUsedAt.toDateString() === new Date().toDateString()
              ).length}{" "}
              relatórios usados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Reports List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedReports.map((report) => (
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
                    <DropdownMenuItem>
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicar
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
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
                  {report.filters.length} filtro{report.filters.length !== 1 ? "s" : ""}
                </Badge>
                <Badge variant="secondary">
                  {report.columns.length} coluna{report.columns.length !== 1 ? "s" : ""}
                </Badge>
                {report.sorting.length > 0 && (
                  <Badge variant="secondary">{report.sorting.length} ordenação</Badge>
                )}
                {report.isPublic && <Badge variant="outline">Público</Badge>}
              </div>

              {/* Usage Stats */}
              <div className="text-sm text-muted-foreground space-y-1">
                <div className="flex items-center justify-between">
                  <span>Usado {report.usageCount}x</span>
                  {report.lastUsedAt && (
                    <span>
                      Último uso: {format(report.lastUsedAt, "dd/MM/yy", { locale: ptBR })}
                    </span>
                  )}
                </div>
                <div className="text-xs">
                  Criado em {format(report.createdAt, "dd/MM/yyyy", { locale: ptBR })}
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
                <Link href={`/reports/${report.id}/edit`} className="flex-1">
                  <Button className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {savedReports.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum relatório criado</h3>
            <p className="text-sm text-muted-foreground text-center mb-6">
              Crie seu primeiro relatório personalizado para exportar dados de eleitores
            </p>
            <Link href="/reports/builder">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Relatório
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

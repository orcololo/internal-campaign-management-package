"use client";

import * as React from "react";
import { CalendarIcon, Download, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { OverviewChart } from "@/components/features/analytics/overview-chart";
import { VoterDemographics } from "@/components/features/analytics/voter-demographics";
import { EngagementChart } from "@/components/features/analytics/engagement-chart";
import { GeographicHeatmap } from "@/components/features/analytics/geographic-heatmap";
import { MetricCard } from "@/components/composed/charts/metric-card";
import {
  chartData,
  demographicData,
  dashboardMetrics,
} from "@/mock-data/analytics";
import {
  Users,
  Calendar as CalendarIcon2,
  TrendingUp,
  MapPin,
} from "lucide-react";

type DateRange = {
  from: Date | undefined;
  to?: Date | undefined;
};

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = React.useState<DateRange>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
  });
  const [supportLevel, setSupportLevel] = React.useState<string>("all");
  const [city, setCity] = React.useState<string>("all");

  const handleExportReport = () => {
    // TODO: Implement export functionality
    alert("Exportar relatório - Em desenvolvimento");
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Análises</h1>
          <p className="text-muted-foreground">
            Análise detalhada dos dados da campanha
          </p>
        </div>
        <Button onClick={handleExportReport}>
          <Download className="mr-2 size-4" />
          Exportar Relatório
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="size-4" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {/* Date Range Picker */}
            <div className="flex-1 min-w-50">
              <label className="text-sm font-medium mb-2 block">Período</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateRange && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 size-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "dd/MM/yy", { locale: ptBR })}{" "}
                          - {format(dateRange.to, "dd/MM/yy", { locale: ptBR })}
                        </>
                      ) : (
                        format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })
                      )
                    ) : (
                      <span>Selecione o período</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={{ from: dateRange?.from, to: dateRange?.to }}
                    onSelect={(range) =>
                      setDateRange({
                        from: range?.from,
                        to: range?.to,
                      })
                    }
                    numberOfMonths={2}
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Support Level Filter */}
            <div className="flex-1 min-w-50">
              <label className="text-sm font-medium mb-2 block">
                Nível de Apoio
              </label>
              <Select value={supportLevel} onValueChange={setSupportLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="high">Alto</SelectItem>
                  <SelectItem value="medium">Médio</SelectItem>
                  <SelectItem value="low">Baixo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* City Filter */}
            <div className="flex-1 min-w-50">
              <label className="text-sm font-medium mb-2 block">Cidade</label>
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="macapa">Macapá</SelectItem>
                  <SelectItem value="santana">Santana</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total de Eleitores"
          value={dashboardMetrics.totalVoters}
          change={dashboardMetrics.votersGrowth}
          trend="up"
          icon={Users}
          iconColor="#3b82f6"
        />
        <MetricCard
          title="Eventos Realizados"
          value={dashboardMetrics.totalEvents}
          change={Math.abs(dashboardMetrics.eventsChange)}
          trend={dashboardMetrics.eventsChange >= 0 ? "up" : "down"}
          icon={CalendarIcon2}
          iconColor="#10b981"
        />
        <MetricCard
          title="Taxa de Engajamento"
          value={`${dashboardMetrics.engagementRate}%`}
          change={8.2}
          trend={dashboardMetrics.engagementTrend}
          icon={TrendingUp}
          iconColor="#8b5cf6"
        />
        <MetricCard
          title="Cobertura Geográfica"
          value={`${dashboardMetrics.geographicCoverage} áreas`}
          change={12.5}
          trend="up"
          icon={MapPin}
          iconColor="#f59e0b"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6">
        {/* Overview Chart - Full Width */}
        <OverviewChart data={chartData} />

        {/* Two Column Layout */}
        <div className="grid gap-6 lg:grid-cols-2">
          <VoterDemographics data={demographicData} />
          <EngagementChart data={chartData} />
        </div>

        {/* Geographic Heatmap - Full Width */}
        <GeographicHeatmap />

        {/* Additional Stats */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Crescimento Mensal</CardTitle>
              <CardDescription>Novos eleitores por mês</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Janeiro</span>
                  <span className="font-medium">45</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Fevereiro
                  </span>
                  <span className="font-medium">67</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Março</span>
                  <span className="font-medium">88</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Efetividade de Contatos
              </CardTitle>
              <CardDescription>Taxa de resposta por canal</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    WhatsApp
                  </span>
                  <span className="font-medium">78%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Telefone
                  </span>
                  <span className="font-medium">52%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <span className="font-medium">34%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Eventos por Tipo</CardTitle>
              <CardDescription>Distribuição de eventos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Reuniões
                  </span>
                  <span className="font-medium">5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Panfletagem
                  </span>
                  <span className="font-medium">4</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Porta a porta
                  </span>
                  <span className="font-medium">3</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

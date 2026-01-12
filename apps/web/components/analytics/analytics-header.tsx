'use client';

import { Download, Calendar, RefreshCw, Filter, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAnalyticsStore } from '@/store/analytics-store';
import { toast } from 'sonner';
import type { AnalyticsPeriod } from '@/types/analytics';

const periodLabels: Record<AnalyticsPeriod, string> = {
  week: 'Última Semana',
  month: 'Último Mês',
  quarter: 'Último Trimestre',
  year: 'Último Ano',
  custom: 'Período Personalizado',
};

/**
 * Analytics Header Component
 * Contains period selector, export actions, and auto-refresh controls
 */
export function AnalyticsHeader() {
  const {
    period,
    autoRefresh,
    exportInProgress,
    setPeriod,
    toggleAutoRefresh,
    setAutoRefreshInterval,
    exportData,
    fetchAllData,
  } = useAnalyticsStore();

  const handleExport = async (format: 'pdf' | 'csv' | 'excel') => {
    try {
      await exportData(format);
    } catch (error) {
      toast.error(`Falha ao exportar ${format.toUpperCase()}`);
    }
  };

  const handleRefresh = async () => {
    toast.loading('Atualizando dados...', { id: 'refresh' });
    await fetchAllData();
    toast.success('Dados atualizados!', { id: 'refresh' });
  };

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Title and Description */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
            <p className="text-sm text-muted-foreground">
              Métricas e insights da campanha
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Period Selector */}
            <Select
              value={period}
              onValueChange={(value) => setPeriod(value as AnalyticsPeriod)}
            >
              <SelectTrigger className="w-[180px]">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">{periodLabels.week}</SelectItem>
                <SelectItem value="month">{periodLabels.month}</SelectItem>
                <SelectItem value="quarter">{periodLabels.quarter}</SelectItem>
                <SelectItem value="year">{periodLabels.year}</SelectItem>
              </SelectContent>
            </Select>

            {/* Export Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="default" disabled={exportInProgress}>
                  <Download className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Formato de Exportação</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleExport('pdf')}>
                  <Download className="mr-2 h-4 w-4" />
                  Exportar PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('csv')}>
                  <Download className="mr-2 h-4 w-4" />
                  Exportar CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('excel')}>
                  <Download className="mr-2 h-4 w-4" />
                  Exportar Excel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Refresh Button */}
            <Button variant="outline" size="icon" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>

            {/* Settings Dropdown (Auto-refresh) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Settings2 className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>Configurações</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* Auto-refresh Toggle */}
                <div className="flex items-center justify-between px-2 py-2">
                  <Label htmlFor="auto-refresh" className="text-sm font-normal">
                    Atualização Automática
                  </Label>
                  <Switch
                    id="auto-refresh"
                    checked={autoRefresh.enabled}
                    onCheckedChange={toggleAutoRefresh}
                  />
                </div>

                {/* Refresh Interval */}
                {autoRefresh.enabled && (
                  <>
                    <DropdownMenuSeparator />
                    <div className="px-2 py-2">
                      <Label htmlFor="refresh-interval" className="text-sm font-normal">
                        Intervalo de Atualização
                      </Label>
                      <Select
                        value={autoRefresh.interval.toString()}
                        onValueChange={(value) => setAutoRefreshInterval(parseInt(value))}
                      >
                        <SelectTrigger id="refresh-interval" className="mt-2 w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 segundos</SelectItem>
                          <SelectItem value="60">1 minuto</SelectItem>
                          <SelectItem value="300">5 minutos</SelectItem>
                          <SelectItem value="600">10 minutos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {autoRefresh.lastUpdate && (
                  <>
                    <DropdownMenuSeparator />
                    <div className="px-2 py-1 text-xs text-muted-foreground">
                      Última atualização:{' '}
                      {new Date(autoRefresh.lastUpdate).toLocaleTimeString('pt-BR')}
                    </div>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}

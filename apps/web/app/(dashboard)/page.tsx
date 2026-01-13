"use client";

import * as React from "react";
import { Users, Calendar, TrendingUp, MapPin, DoorClosed, UserCheck, Target, Activity, RefreshCw } from "lucide-react";
import { MetricCard } from "@/components/composed/charts/metric-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { analyticsApi } from "@/lib/api/endpoints/analytics";
import type { CampaignOverview } from "@/types/analytics";
import Link from "next/link";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const REFRESH_INTERVAL = 5000; // 5 seconds

export default function DashboardPage() {
  const [overview, setOverview] = React.useState<CampaignOverview | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [lastUpdate, setLastUpdate] = React.useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = React.useState(true);
  const [previousVoterCount, setPreviousVoterCount] = React.useState<number | null>(null);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
    loadDashboardData();

    // Set up auto-refresh
    if (autoRefresh) {
      const intervalId = setInterval(() => {
        loadDashboardData(true);
      }, REFRESH_INTERVAL);

      return () => clearInterval(intervalId);
    }
  }, [autoRefresh]);

  const loadDashboardData = async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }
      const response = await analyticsApi.getCampaignOverview();
      
      // Check for new voters
      if (previousVoterCount !== null && response.data.voters.total > previousVoterCount) {
        const newVoters = response.data.voters.total - previousVoterCount;
        toast.success(`${newVoters} novo${newVoters > 1 ? 's' : ''} eleitor${newVoters > 1 ? 'es' : ''} cadastrado${newVoters > 1 ? 's' : ''}!`, {
          duration: 3000,
        });
      }
      
      setPreviousVoterCount(response.data.voters.total);
      setOverview(response.data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      if (!silent) {
        toast.error("Erro ao carregar dados do dashboard");
      }
    } finally {
      if (!silent) {
        setLoading(false);
      } else {
        setRefreshing(false);
      }
    }
  };

  const handleManualRefresh = () => {
    loadDashboardData(true);
    toast.info("Atualizando dados...");
  };

  if (loading || !overview) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Activity className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Carregando dados do dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const supportLevelData = Object.entries(overview.voters.bySupportLevel || {}).map(([level, count]) => ({
    name: level || "Não definido",
    value: count,
  }));

  const canvassingResultsData = Object.entries(overview.canvassing.results).map(([result, count]) => ({
    name: result === "supporters" ? "Apoiadores" 
      : result === "undecided" ? "Indecisos"
      : result === "opponents" ? "Opositores"
      : result === "notHome" ? "Não atendeu"
      : "Recusou",
    value: count,
  }));

  const voterGrowthData = overview.trends.voterGrowth.slice(-30).map((point) => ({
    date: new Date(point.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
    count: point.count,
  }));

  const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

  const votersGrowth = overview.voters.recent.last7Days > 0 ? 
    ((overview.voters.recent.last7Days / (overview.voters.total - overview.voters.recent.last7Days || 1)) * 100).toFixed(1) : "0";

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Refresh Indicator */}
      {refreshing && (
        <div className="fixed top-4 right-4 z-50">
          <Badge variant="secondary" className="animate-pulse">
            <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
            Atualizando...
          </Badge>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral da campanha e métricas principais
          </p>
          {isMounted && lastUpdate && (
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs text-muted-foreground" suppressHydrationWarning>
                Última atualização: {lastUpdate.toLocaleTimeString("pt-BR")}
              </p>
              {autoRefresh && (
                <Badge variant="outline" className="text-xs">
                  <Activity className="h-3 w-3 mr-1 animate-pulse" />
                  Atualização automática ativa
                </Badge>
              )}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleManualRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
          <Button
            variant={autoRefresh ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <Activity className={`h-4 w-4 mr-2 ${autoRefresh ? "animate-pulse" : ""}`} />
            {autoRefresh ? "Auto-refresh ON" : "Auto-refresh OFF"}
          </Button>
          <Link href="/analytics">
            <Button>Ver análises completas</Button>
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total de Eleitores"
          value={overview.voters.total}
          change={Number(votersGrowth)}
          trend="up"
          icon={Users}
          iconColor="hsl(var(--chart-1))"
        />
        <MetricCard
          title="Eventos Este Mês"
          value={overview.events.thisMonth}
          icon={Calendar}
          iconColor="hsl(var(--chart-2))"
        />
        <MetricCard
          title="Sessões de Panfletagem"
          value={overview.canvassing.totalSessions}
          icon={DoorClosed}
          iconColor="hsl(var(--chart-3))"
        />
        <MetricCard
          title="Taxa de Conversão"
          value={`${overview.canvassing.conversionRate.toFixed(1)}%`}
          icon={Target}
          iconColor="hsl(var(--chart-4))"
        />
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="voters">Eleitores</TabsTrigger>
          <TabsTrigger value="canvassing">Panfletagem</TabsTrigger>
          <TabsTrigger value="events">Eventos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Voter Growth Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Crescimento de Eleitores</CardTitle>
                <CardDescription>Últimos 30 dias</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={voterGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="count" 
                      stroke="hsl(var(--chart-1))" 
                      strokeWidth={2}
                      name="Eleitores"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Support Level Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Nível de Apoio</CardTitle>
                <CardDescription>Distribuição de apoio dos eleitores</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={supportLevelData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {supportLevelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Summary Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Contatos Disponíveis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Com Email:</span>
                  <span className="font-semibold">{overview.voters.withEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Com Telefone:</span>
                  <span className="font-semibold">{overview.voters.withPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Com WhatsApp:</span>
                  <span className="font-semibold">{overview.voters.withWhatsapp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Com Coordenadas:</span>
                  <span className="font-semibold">{overview.voters.withCoordinates}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status de Eventos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Próximos:</span>
                  <span className="font-semibold text-blue-600">{overview.events.upcoming}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Concluídos:</span>
                  <span className="font-semibold text-green-600">{overview.events.completed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cancelados:</span>
                  <span className="font-semibold text-red-600">{overview.events.cancelled}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Este Mês:</span>
                  <span className="font-semibold">{overview.events.thisMonth}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Panfletagem</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sessões Completas:</span>
                  <span className="font-semibold">{overview.canvassing.completedSessions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Em Andamento:</span>
                  <span className="font-semibold">{overview.canvassing.inProgressSessions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Portas:</span>
                  <span className="font-semibold">{overview.canvassing.totalDoorKnocks}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxa Conversão:</span>
                  <span className="font-semibold text-green-600">{overview.canvassing.conversionRate.toFixed(1)}%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="voters" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* City Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Cidade</CardTitle>
                <CardDescription>Top 5 cidades com mais eleitores</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={Object.entries(overview.voters.byCity || {})
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([city, count]) => ({ city, count }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="city" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(var(--chart-1))" name="Eleitores" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gender Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Gênero</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={Object.entries(overview.voters.byGender || {}).map(([gender, count]) => ({
                        name: gender || "Não informado",
                        value: count,
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {Object.entries(overview.voters.byGender || {}).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Growth */}
          <Card>
            <CardHeader>
              <CardTitle>Crescimento Recente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Últimos 7 dias</p>
                    <p className="text-2xl font-bold">{overview.voters.recent.last7Days}</p>
                  </div>
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Últimos 30 dias</p>
                    <p className="text-2xl font-bold">{overview.voters.recent.last30Days}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="canvassing" className="space-y-4">
          {/* Canvassing Results */}
          <Card>
            <CardHeader>
              <CardTitle>Resultados da Panfletagem</CardTitle>
              <CardDescription>Distribuição de resultados das abordagens</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={canvassingResultsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(var(--chart-3))" name="Quantidade" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Detailed Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Apoiadores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{overview.canvassing.results.supporters}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Indecisos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{overview.canvassing.results.undecided}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Opositores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{overview.canvassing.results.opponents}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Não Atendeu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-600">{overview.canvassing.results.notHome}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          {/* Event Types */}
          <Card>
            <CardHeader>
              <CardTitle>Tipos de Eventos</CardTitle>
              <CardDescription>Distribuição por tipo de evento</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={Object.entries(overview.events.byType || {}).map(([type, count]) => ({
                  type,
                  count,
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--chart-2))" name="Eventos" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Event Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status dos Eventos</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={Object.entries(overview.events.byStatus || {}).map(([status, count]) => ({
                      name: status,
                      value: count,
                    }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {Object.entries(overview.events.byStatus || {}).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

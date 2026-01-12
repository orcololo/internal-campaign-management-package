"use client";

import * as React from "react";
import { Users, Calendar, TrendingUp, MapPin } from "lucide-react";
import { MetricCard } from "@/components/composed/charts/metric-card";
import { OverviewChart } from "@/components/features/analytics/overview-chart";
import { EngagementChart } from "@/components/features/analytics/engagement-chart";
import { GeographicHeatmap } from "@/components/features/analytics/geographic-heatmap";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  dashboardMetrics,
  chartData,
  recentActivities,
} from "@/mock-data/analytics";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";

export default function DashboardPage() {
  const activityIcons = {
    voter_added: Users,
    event_created: Calendar,
    contact_made: TrendingUp,
    note_added: MapPin,
  };

  const activityLabels = {
    voter_added: "Eleitor cadastrado",
    event_created: "Evento criado",
    contact_made: "Contato realizado",
    note_added: "Nota adicionada",
  };

  // Generate sparkline data from chart data (last 7 days)
  const votersSparkline = chartData.slice(-7).map((d) => ({ value: d.voters }));
  const eventsSparkline = chartData.slice(-7).map((d) => ({ value: d.events }));
  const engagementSparkline = chartData
    .slice(-7)
    .map((d) => ({ value: d.engagement }));

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral da campanha e métricas principais
          </p>
        </div>
        <Link href="/analytics">
          <Button>Ver análises completas</Button>
        </Link>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total de Eleitores"
          value={dashboardMetrics.totalVoters}
          change={dashboardMetrics.votersGrowth}
          trend="up"
          icon={Users}
          iconColor="hsl(var(--chart-1))"
          sparklineData={votersSparkline}
        />
        <MetricCard
          title="Eventos"
          value={dashboardMetrics.totalEvents}
          change={Math.abs(dashboardMetrics.eventsChange)}
          trend="down"
          icon={Calendar}
          iconColor="hsl(var(--chart-2))"
          sparklineData={eventsSparkline}
        />
        <MetricCard
          title="Taxa de Engajamento"
          value={`${dashboardMetrics.engagementRate}%`}
          trend={dashboardMetrics.engagementTrend}
          icon={TrendingUp}
          iconColor="hsl(var(--chart-3))"
          sparklineData={engagementSparkline}
        />
        <MetricCard
          title="Cobertura Geográfica"
          value={`${dashboardMetrics.geographicCoverage} bairros`}
          icon={MapPin}
          iconColor="hsl(var(--chart-4))"
        />
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="engagement">Engajamento</TabsTrigger>
          <TabsTrigger value="geography">Geografia</TabsTrigger>
          <TabsTrigger value="activity">Atividades</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <OverviewChart data={chartData} />
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <EngagementChart data={chartData} />
        </TabsContent>

        <TabsContent value="geography" className="space-y-4">
          <GeographicHeatmap />
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Atividades Recentes</CardTitle>
              <CardDescription>
                Últimas ações realizadas na campanha
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.slice(0, 8).map((activity) => {
                  const Icon = activityIcons[activity.type];
                  return (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 rounded-lg border p-4"
                    >
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="size-5 text-primary" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">
                            {activityLabels[activity.type]}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(activity.timestamp), "HH:mm", {
                              locale: ptBR,
                            })}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {activity.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Por: {activity.user}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

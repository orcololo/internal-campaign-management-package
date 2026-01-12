"use client";

import * as React from "react";
import { Users, Calendar, TrendingUp, MapPin } from "lucide-react";
import { MetricCard } from "@/components/composed/charts/metric-card";
import { OverviewChart } from "@/components/features/analytics/overview-chart";
import { EngagementChart } from "@/components/features/analytics/engagement-chart";
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
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { LocationsSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";

export default function HomePage() {
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

  const votersSparkline = chartData.slice(-7).map((d) => ({ value: d.voters }));
  const eventsSparkline = chartData.slice(-7).map((d) => ({ value: d.events }));
  const engagementSparkline = chartData
    .slice(-7)
    .map((d) => ({ value: d.engagement }));

  return (
    <SidebarProvider>
      <LocationsSidebar />
      <SidebarInset className="overflow-hidden flex flex-col">
        <DashboardHeader />
        <div className="flex-1 overflow-auto">
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

            {/* Charts Section */}
            <div className="grid gap-6 md:grid-cols-2">
              <OverviewChart data={chartData} />

              <EngagementChart data={chartData} />
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Atividade Recente</CardTitle>
                <CardDescription>
                  Últimas ações realizadas na campanha
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.slice(0, 5).map((activity) => {
                    const Icon =
                      activityIcons[
                        activity.type as keyof typeof activityIcons
                      ];
                    return (
                      <div key={activity.id} className="flex items-start gap-4">
                        <div className="rounded-full bg-muted p-2">
                          <Icon className="size-4" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">
                            {
                              activityLabels[
                                activity.type as keyof typeof activityLabels
                              ]
                            }
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {activity.description}
                          </p>
                          <p
                            className="text-xs text-muted-foreground"
                            suppressHydrationWarning
                          >
                            {format(new Date(activity.timestamp), "PPp", {
                              locale: ptBR,
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4">
                  <Link href="/voters">
                    <Button variant="outline" className="w-full">
                      Ver todas as atividades
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

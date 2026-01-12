'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp, Target, BarChart3 } from 'lucide-react';
import { useAnalyticsStore } from '@/store/analytics-store';
import type { AnalyticsTab } from '@/types/analytics';

/**
 * Analytics Tabs Component
 * Manages tab navigation between Influence, Engagement, and Campaign metrics
 */
export function AnalyticsTabs() {
  const { selectedTab, setSelectedTab, influence, engagement, campaignMetrics } = useAnalyticsStore();

  const tabs = [
    {
      id: 'influence' as AnalyticsTab,
      label: 'Influência & Rede',
      icon: Users,
      badge: influence?.totalInfluencers || 0,
      description: 'Líderes comunitários, influenciadores e redes sociais',
    },
    {
      id: 'engagement' as AnalyticsTab,
      label: 'Engajamento',
      icon: TrendingUp,
      badge: engagement?.activeVoters7Days || 0,
      description: 'Pontuações de engajamento, tendências e taxas de resposta',
    },
    {
      id: 'campaign' as AnalyticsTab,
      label: 'Métricas de Campanha',
      icon: Target,
      badge: campaignMetrics?.milestones.filter(m => m.status === 'completed').length || 0,
      description: 'Marcos, área de cobertura, geofencing e atividade voluntária',
    },
  ];

  return (
    <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as AnalyticsTab)} className="w-full">
      {/* Tab Navigation */}
      <TabsList className="grid w-full grid-cols-3 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="relative flex items-center gap-2 data-[state=active]:bg-background"
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              {tab.badge > 0 && (
                <Badge variant="secondary" className="ml-auto hidden lg:flex">
                  {tab.badge}
                </Badge>
              )}
            </TabsTrigger>
          );
        })}
      </TabsList>

      {/* Tab Content */}
      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className="space-y-6">
          {/* Tab Description */}
          <div className="flex items-center gap-2 rounded-lg border bg-muted/50 p-4">
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{tab.description}</p>
          </div>

          {/* Tab-specific Content */}
          {tab.id === 'influence' && <InfluenceTabContent />}
          {tab.id === 'engagement' && <EngagementTabContent />}
          {tab.id === 'campaign' && <CampaignTabContent />}
        </TabsContent>
      ))}
    </Tabs>
  );
}

/**
 * Influence Tab Content
 * TODO: Replace with actual components in Phase 3
 */
function InfluenceTabContent() {
  const { influence } = useAnalyticsStore();

  return (
    <div className="space-y-6">
      {/* Placeholder for Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Influenciadores Chave"
          value={influence?.totalInfluencers || 0}
          description="Pontuação >= 70"
          trend="+12%"
        />
        <StatCard
          title="Tamanho Total da Rede"
          value={influence?.totalNetworkSize.toLocaleString() || '0'}
          description="Conexões pessoais"
          trend="+8%"
        />
        <StatCard
          title="Alcance nas Redes Sociais"
          value={influence?.totalSocialMediaReach.toLocaleString() || '0'}
          description="Seguidores totais"
          trend="+15%"
        />
        <StatCard
          title="Líderes Comunitários"
          value={influence?.communityLeaders || 0}
          description="Papel de líder"
          trend="+5%"
        />
      </div>

      {/* Placeholder for Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <ChartPlaceholder title="Distribuição de Pontuação de Influência" type="donut" />
        <ChartPlaceholder title="Crescimento da Rede" type="area" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ChartPlaceholder title="Papéis na Comunidade" type="bar" />
        <ChartPlaceholder title="Mapa de Influência" type="map" />
      </div>

      {/* Placeholder for Top Influencers List */}
      <div className="rounded-lg border p-6">
        <h3 className="mb-4 text-lg font-semibold">Top 5 Influenciadores</h3>
        <div className="space-y-2">
          {influence?.topInfluencers.slice(0, 5).map((influencer, index) => (
            <div
              key={influencer.id}
              className="flex items-center justify-between rounded-md border p-3"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {index + 1}
                </span>
                <div>
                  <p className="font-medium">{influencer.name}</p>
                  <p className="text-sm text-muted-foreground">{influencer.neighborhood}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{influencer.influencerScore}</p>
                <p className="text-sm text-muted-foreground">
                  Rede: {influencer.networkSize.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Engagement Tab Content
 * TODO: Replace with actual components in Phase 4
 */
function EngagementTabContent() {
  const { engagement } = useAnalyticsStore();

  return (
    <div className="space-y-6">
      {/* Placeholder for Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Pontuação Média de Engajamento"
          value={engagement?.avgEngagementScore.toFixed(1) || '0'}
          description="De 100"
          trend="+5%"
        />
        <StatCard
          title="Taxa Média de Resposta"
          value={`${engagement?.avgResponseRate.toFixed(1) || '0'}%`}
          description="De contatos"
          trend="+8%"
        />
        <StatCard
          title="Eleitores Ativos (7 dias)"
          value={engagement?.activeVoters7Days || 0}
          description="Últimos 7 dias"
          trend="+12%"
        />
        <StatCard
          title="Eleitores Inativos"
          value={engagement?.dormantVoters || 0}
          description=">30 dias sem contato"
          trend="-5%"
          trendPositive={false}
        />
      </div>

      {/* Placeholder for Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <ChartPlaceholder title="Tendências de Engajamento" type="line" />
        <ChartPlaceholder title="Distribuição de Pontuação" type="bar" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ChartPlaceholder title="Tendência de Engajamento" type="pie" />
        <ChartPlaceholder title="Contato vs Taxa de Resposta" type="scatter" />
      </div>

      {/* Placeholder for Top Engaged Voters */}
      <div className="rounded-lg border p-6">
        <h3 className="mb-4 text-lg font-semibold">Top 5 Eleitores Engajados</h3>
        <div className="space-y-2">
          {engagement?.topEngaged.slice(0, 5).map((voter, index) => (
            <div
              key={voter.id}
              className="flex items-center justify-between rounded-md border p-3"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10 text-sm font-semibold text-green-600">
                  {index + 1}
                </span>
                <div>
                  <p className="font-medium">{voter.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Taxa de Resposta: {voter.responseRate}%
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{voter.engagementScore}</p>
                <p className="text-sm text-muted-foreground">
                  {voter.contactFrequency} contatos
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Campaign Tab Content
 * TODO: Replace with actual components in Phase 5
 */
function CampaignTabContent() {
  const { campaignMetrics, events } = useAnalyticsStore();

  return (
    <div className="space-y-6">
      {/* Placeholder for Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Marcos Concluídos"
          value={campaignMetrics?.milestones.filter((m) => m.status === 'completed').length || 0}
          description={`De ${campaignMetrics?.milestones.length || 0} totais`}
          trend="+33%"
        />
        <StatCard
          title="Área de Cobertura"
          value={campaignMetrics?.coverageArea.coveredNeighborhoods || 0}
          description="Bairros cobertos"
          trend="+10%"
        />
        <StatCard
          title="Zonas de Geofencing"
          value={campaignMetrics?.geofencing.activeZones || 0}
          description={`De ${campaignMetrics?.geofencing.totalZones || 0} totais`}
          trend="+2"
        />
        <StatCard
          title="Total de Eventos"
          value={events?.total || 0}
          description={`${events?.upcoming || 0} próximos`}
          trend="+8%"
        />
      </div>

      {/* Placeholder for Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <ChartPlaceholder title="Linha do Tempo de Registro de Eleitores" type="area" />
        <ChartPlaceholder title="Distribuição de Nível de Apoio" type="donut" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ChartPlaceholder title="Presença em Eventos" type="line" />
        <ChartPlaceholder title="Atividade Voluntária" type="bar-stacked" />
      </div>

      <ChartPlaceholder title="Mapa de Cobertura" type="map" fullWidth />
    </div>
  );
}

/**
 * Stat Card Component (Placeholder)
 */
function StatCard({
  title,
  value,
  description,
  trend,
  trendPositive = true,
}: {
  title: string;
  value: string | number;
  description: string;
  trend?: string;
  trendPositive?: boolean;
}) {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex flex-col space-y-2">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{description}</p>
          {trend && (
            <span
              className={`text-xs font-medium ${
                trendPositive ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {trend}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Chart Placeholder Component
 */
function ChartPlaceholder({
  title,
  type,
  fullWidth = false,
}: {
  title: string;
  type: 'donut' | 'area' | 'bar' | 'line' | 'pie' | 'scatter' | 'map' | 'bar-stacked';
  fullWidth?: boolean;
}) {
  return (
    <div className={`rounded-lg border bg-card p-6 shadow-sm ${fullWidth ? 'md:col-span-2' : ''}`}>
      <h3 className="mb-4 text-lg font-semibold">{title}</h3>
      <div className="flex h-64 items-center justify-center rounded-md bg-muted/50">
        <div className="text-center text-muted-foreground">
          <BarChart3 className="mx-auto mb-2 h-12 w-12" />
          <p className="text-sm">Gráfico {type} será implementado aqui</p>
        </div>
      </div>
    </div>
  );
}

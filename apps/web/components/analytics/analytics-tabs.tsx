'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, MapPin, Target, BarChart3, TrendingUp } from 'lucide-react';
import { useAnalyticsStore } from '@/store/analytics-store';
import type { AnalyticsTab } from '@/types/analytics';
import { GrowthChart } from './growth-chart';
import { MultiLineChart } from './multi-line-chart';

/**
 * Analytics Tabs Component
 * Manages tab navigation between Overview, Voters, Events, and Canvassing
 */
export function AnalyticsTabs() {
  const { selectedTab, setSelectedTab, overview, voters, events, canvassing } = useAnalyticsStore();

  const tabs = [
    {
      id: 'overview' as AnalyticsTab,
      label: 'Visão Geral',
      icon: BarChart3,
      badge: overview?.summary.totalVoters || 0,
      description: 'Resumo geral da campanha com métricas principais',
    },
    {
      id: 'voters' as AnalyticsTab,
      label: 'Eleitores',
      icon: Users,
      badge: voters?.total || 0,
      description: 'Demografia, localização e perfil político dos eleitores',
    },
    {
      id: 'events' as AnalyticsTab,
      label: 'Eventos',
      icon: Calendar,
      badge: events?.total || 0,
      description: 'Estatísticas e distribuição de eventos da campanha',
    },
    {
      id: 'canvassing' as AnalyticsTab,
      label: 'Corpo a Corpo',
      icon: Target,
      badge: canvassing?.doorKnocks.total || 0,
      description: 'Métricas de campanha porta a porta',
    },
  ];

  return (
    <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as AnalyticsTab)} className="w-full">
      {/* Tab Navigation */}
      <TabsList className="grid w-full grid-cols-4 mb-6">
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
          {tab.id === 'overview' && <OverviewTabContent />}
          {tab.id === 'voters' && <VotersTabContent />}
          {tab.id === 'events' && <EventsTabContent />}
          {tab.id === 'canvassing' && <CanvassingTabContent />}
        </TabsContent>
      ))}
    </Tabs>
  );
}

/**
 * Overview Tab Content
 */
function OverviewTabContent() {
  const { overview } = useAnalyticsStore();

  if (!overview) {
    return <div className="text-center text-muted-foreground py-8">Carregando dados...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total de Eleitores"
          value={overview.summary.totalVoters}
          description="Eleitores cadastrados"
          icon={Users}
        />
        <StatCard
          title="Eventos"
          value={overview.summary.totalEvents}
          description="Total de eventos"
          icon={Calendar}
        />
        <StatCard
          title="Sessões de Campanha"
          value={overview.summary.totalCanvassingSessions}
          description="Porta a porta"
          icon={Target}
        />
        <StatCard
          title="Contatos Realizados"
          value={overview.summary.totalDoorKnocks}
          description="Portas batidas"
          icon={MapPin}
        />
      </div>

      {/* Voter Details */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Perfil dos Eleitores</CardTitle>
            <CardDescription>Dados de contato e localização</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <StatRow label="Com Email" value={overview.voters.withEmail} total={overview.voters.total} />
            <StatRow label="Com Telefone" value={overview.voters.withPhone} total={overview.voters.total} />
            <StatRow label="Com WhatsApp" value={overview.voters.withWhatsapp} total={overview.voters.total} />
            <StatRow label="Com Localização" value={overview.voters.withCoordinates} total={overview.voters.total} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nível de Apoio</CardTitle>
            <CardDescription>Distribuição por nível de apoio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(overview.voters.bySupportLevel).map(([level, count]) => (
              <StatRow key={level} label={formatSupportLevel(level)} value={count} total={overview.voters.total} />
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Geographic Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição Geográfica</CardTitle>
          <CardDescription>Eleitores por cidade</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(overview.voters.byCity).slice(0, 5).map(([city, count]) => (
              <StatRow key={city} label={city} value={count} total={overview.voters.total} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Growth Trends */}
      {overview.trends && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Tendências de Crescimento</h3>
          
          <div className="grid gap-6 md:grid-cols-2">
            {/* Voter Growth Chart */}
            {overview.trends.voterGrowth && overview.trends.voterGrowth.length > 0 && (
              <GrowthChart
                data={overview.trends.voterGrowth}
                title="Crescimento de Eleitores"
                description="Novos eleitores ao longo do tempo"
                color="#3b82f6"
              />
            )}

            {/* Event Activity Chart */}
            {overview.trends.eventActivity && overview.trends.eventActivity.length > 0 && (
              <GrowthChart
                data={overview.trends.eventActivity}
                title="Atividade de Eventos"
                description="Eventos realizados ao longo do tempo"
                color="#10b981"
              />
            )}
          </div>

          {/* Canvassing Progress Chart */}
          {overview.trends.canvassingProgress && overview.trends.canvassingProgress.length > 0 && (
            <GrowthChart
              data={overview.trends.canvassingProgress}
              title="Progresso de Campanha Porta a Porta"
              description="Contatos realizados ao longo do tempo"
              color="#8b5cf6"
            />
          )}

          {/* Combined Trends Chart */}
          {(overview.trends.voterGrowth?.length > 0 || 
            overview.trends.eventActivity?.length > 0 || 
            overview.trends.canvassingProgress?.length > 0) && (
            <MultiLineChart
              title="Visão Geral de Tendências"
              description="Comparação de todas as métricas de crescimento"
              series={[
                {
                  data: overview.trends.voterGrowth || [],
                  name: 'Eleitores',
                  color: '#3b82f6',
                  dataKey: 'voters'
                },
                {
                  data: overview.trends.eventActivity || [],
                  name: 'Eventos',
                  color: '#10b981',
                  dataKey: 'events'
                },
                {
                  data: overview.trends.canvassingProgress || [],
                  name: 'Campanha',
                  color: '#8b5cf6',
                  dataKey: 'canvassing'
                }
              ]}
            />
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Voters Tab Content
 */
function VotersTabContent() {
  const { voters } = useAnalyticsStore();

  if (!voters) {
    return <div className="text-center text-muted-foreground py-8">Carregando dados...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Demographics */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Demografia por Gênero</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(voters.demographics.byGender).map(([gender, count]) => (
              <StatRow key={gender} label={formatGender(gender)} value={count} total={voters.total} />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição Geográfica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(voters.geographic.byCity).slice(0, 5).map(([city, count]) => (
              <StatRow key={city} label={city} value={count} total={voters.total} />
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Contact Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informações de Contato</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="text-3xl font-bold">{voters.contact.withEmail}</div>
              <div className="text-sm text-muted-foreground">Com Email</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{voters.contact.withPhone}</div>
              <div className="text-sm text-muted-foreground">Com Telefone</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{voters.contact.withWhatsapp}</div>
              <div className="text-sm text-muted-foreground">Com WhatsApp</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Events Tab Content
 */
function EventsTabContent() {
  const { events } = useAnalyticsStore();

  if (!events) {
    return <div className="text-center text-muted-foreground py-8">Carregando dados...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total de Eventos"
          value={events.total}
          description="Todos os eventos"
          icon={Calendar}
        />
        <StatCard
          title="Próximos"
          value={events.upcoming}
          description="Agendados"
          icon={TrendingUp}
        />
        <StatCard
          title="Concluídos"
          value={events.completed}
          description="Finalizados"
          icon={Target}
        />
        <StatCard
          title="Cancelados"
          value={events.cancelled}
          description="Não realizados"
          icon={MapPin}
        />
      </div>

      {Object.keys(events.byType).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Eventos por Tipo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(events.byType).map(([type, count]) => (
              <StatRow key={type} label={type} value={count} total={events.total} />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/**
 * Canvassing Tab Content
 */
function CanvassingTabContent() {
  const { canvassing } = useAnalyticsStore();

  if (!canvassing) {
    return <div className="text-center text-muted-foreground py-8">Carregando dados...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Sessões"
          value={canvassing.sessions.total}
          description="Total de sessões"
          icon={Target}
        />
        <StatCard
          title="Portas Batidas"
          value={canvassing.doorKnocks.total}
          description="Total de contatos"
          icon={Users}
        />
        <StatCard
          title="Taxa de Conversão"
          value={`${canvassing.performance.conversionRate}%`}
          description="Apoiadores convertidos"
          icon={TrendingUp}
        />
        <StatCard
          title="Taxa de Sucesso"
          value={`${canvassing.performance.successRate}%`}
          description="Contatos positivos"
          icon={BarChart3}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Resultados dos Contatos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <StatRow label="Apoiadores" value={canvassing.doorKnocks.supporters} total={canvassing.doorKnocks.total} />
            <StatRow label="Indecisos" value={canvassing.doorKnocks.undecided} total={canvassing.doorKnocks.total} />
            <StatRow label="Opositores" value={canvassing.doorKnocks.opponents} total={canvassing.doorKnocks.total} />
            <StatRow label="Não Atendeu" value={canvassing.doorKnocks.notHome} total={canvassing.doorKnocks.total} />
            <StatRow label="Recusou" value={canvassing.doorKnocks.refused} total={canvassing.doorKnocks.total} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status das Sessões</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <StatRow label="Completas" value={canvassing.sessions.completed} total={canvassing.sessions.total} />
            <StatRow label="Em Andamento" value={canvassing.sessions.inProgress} total={canvassing.sessions.total} />
            <StatRow label="Planejadas" value={canvassing.sessions.planned} total={canvassing.sessions.total} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper Components

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

function StatCard({ title, value, description, icon: Icon }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

interface StatRowProps {
  label: string;
  value: number;
  total: number;
}

function StatRow({ label, value, total }: StatRowProps) {
  const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{value}</span>
        <span className="text-xs text-muted-foreground">({percentage}%)</span>
      </div>
    </div>
  );
}

// Helper Functions

function formatSupportLevel(level: string): string {
  const map: Record<string, string> = {
    'MUITO_FAVORAVEL': 'Muito Favorável',
    'FAVORAVEL': 'Favorável',
    'NEUTRO': 'Neutro',
    'DESFAVORAVEL': 'Desfavorável',
    'MUITO_DESFAVORAVEL': 'Muito Desfavorável',
    'NAO_DEFINIDO': 'Não Definido',
  };
  return map[level] || level;
}

function formatGender(gender: string): string {
  const map: Record<string, string> = {
    'MASCULINO': 'Masculino',
    'FEMININO': 'Feminino',
    'NAO_INFORMADO': 'Não Informado',
    'OUTRO': 'Outro',
  };
  return map[gender] || gender;
}

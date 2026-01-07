export interface DashboardMetrics {
  totalVoters: number;
  votersGrowth: number;
  totalEvents: number;
  eventsChange: number;
  engagementRate: number;
  engagementTrend: "up" | "down" | "neutral";
  geographicCoverage: number;
}

export interface ChartDataPoint {
  date: string;
  voters: number;
  events: number;
  engagement: number;
}

export interface DemographicData {
  supportLevel: {
    high: number;
    medium: number;
    low: number;
  };
  byState: Array<{
    state: string;
    count: number;
  }>;
  byCity: Array<{
    city: string;
    count: number;
  }>;
  withWhatsapp: number;
  withLocation: number;
  withEmail: number;
}

// Generate time series data for the last 30 days
function generateTimeSeriesData(): ChartDataPoint[] {
  const data: ChartDataPoint[] = [];
  const now = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    data.push({
      date: date.toISOString().split("T")[0],
      voters: Math.floor(800 + i * 13 + Math.random() * 50),
      events: Math.floor(5 + (i % 7) * 2 + Math.random() * 3),
      engagement: Math.floor(60 + Math.random() * 20),
    });
  }

  return data;
}

export const dashboardMetrics: DashboardMetrics = {
  totalVoters: 1234,
  votersGrowth: 12.5,
  totalEvents: 12,
  eventsChange: -2.5,
  engagementRate: 67,
  engagementTrend: "up",
  geographicCoverage: 8,
};

export const chartData: ChartDataPoint[] = generateTimeSeriesData();

export const demographicData: DemographicData = {
  supportLevel: {
    high: 420,
    medium: 580,
    low: 234,
  },
  byState: [
    { state: "SP", count: 350 },
    { state: "RJ", count: 280 },
    { state: "MG", count: 190 },
    { state: "DF", count: 120 },
    { state: "BA", count: 95 },
    { state: "CE", count: 75 },
    { state: "PR", count: 65 },
    { state: "PE", count: 38 },
    { state: "RS", count: 15 },
    { state: "AM", count: 6 },
  ],
  byCity: [
    { city: "São Paulo", count: 280 },
    { city: "Rio de Janeiro", count: 220 },
    { city: "Belo Horizonte", count: 150 },
    { city: "Brasília", count: 110 },
    { city: "Salvador", count: 85 },
    { city: "Fortaleza", count: 72 },
    { city: "Curitiba", count: 61 },
    { city: "Recife", count: 36 },
    { city: "Porto Alegre", count: 14 },
    { city: "Manaus", count: 6 },
  ],
  withWhatsapp: 876,
  withLocation: 740,
  withEmail: 987,
};

export interface RecentActivity {
  id: string;
  type: "voter_added" | "event_created" | "contact_made" | "note_added";
  description: string;
  timestamp: string;
  user: string;
}

export const recentActivities: RecentActivity[] = [
  {
    id: "1",
    type: "voter_added",
    description: "Novo eleitor cadastrado: João Silva",
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    user: "Admin",
  },
  {
    id: "2",
    type: "event_created",
    description: "Evento criado: Reunião Comunitária",
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    user: "Coordenador",
  },
  {
    id: "3",
    type: "contact_made",
    description: "Contato realizado com Maria Santos",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    user: "Voluntário",
  },
  {
    id: "4",
    type: "voter_added",
    description: "Novo eleitor cadastrado: Pedro Souza",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    user: "Admin",
  },
  {
    id: "5",
    type: "note_added",
    description: "Nota adicionada a Ana Costa",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    user: "Coordenador",
  },
];

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

    // Growth from ~50 voters to 200 over 30 days
    const baseVoters = 50 + (29 - i) * 5;

    data.push({
      date: date.toISOString().split("T")[0],
      voters: Math.floor(baseVoters + Math.random() * 10),
      events: Math.floor(5 + (i % 7) * 2 + Math.random() * 3),
      engagement: Math.floor(65 + Math.random() * 15),
    });
  }

  return data;
}

export const dashboardMetrics: DashboardMetrics = {
  totalVoters: 200,
  votersGrowth: 15.8,
  totalEvents: 12,
  eventsChange: -2.5,
  engagementRate: 72,
  engagementTrend: "up",
  geographicCoverage: 20, // 20 neighborhoods covered in Macapá
};

export const chartData: ChartDataPoint[] = generateTimeSeriesData();

export const demographicData: DemographicData = {
  supportLevel: {
    high: 85,
    medium: 92,
    low: 23,
  },
  byState: [
    { state: "AP", count: 200 }, // All voters from Amapá
  ],
  byCity: [
    { city: "Macapá", count: 200 }, // All voters from Macapá
  ],
  withWhatsapp: 200, // Everyone has WhatsApp
  withLocation: 200, // Everyone has GPS coordinates
  withEmail: 200, // Everyone has email
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
    description: "Novo eleitor cadastrado: João Silva - Bairro Trem, Macapá",
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    user: "Admin",
  },
  {
    id: "2",
    type: "event_created",
    description: "Evento criado: Reunião Comunitária no Centro de Macapá",
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    user: "Coordenador",
  },
  {
    id: "3",
    type: "contact_made",
    description: "Contato realizado com Maria Santos - Bairro Laguinho",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    user: "Voluntário",
  },
  {
    id: "4",
    type: "voter_added",
    description: "Novo eleitor cadastrado: Pedro Souza - Bairro Buritizal",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    user: "Admin",
  },
  {
    id: "5",
    type: "note_added",
    description: "Nota adicionada a Ana Costa - Líder comunitária do Pacoval",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    user: "Coordenador",
  },
  {
    id: "6",
    type: "voter_added",
    description: "Novo eleitor cadastrado: Carlos Oliveira - Jesus de Nazaré",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    user: "Admin",
  },
  {
    id: "7",
    type: "contact_made",
    description: "Contato via WhatsApp com Fernanda Martins - Araxá",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    user: "Voluntário",
  },
  {
    id: "8",
    type: "event_created",
    description: "Evento criado: Caminhada no Zerão",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    user: "Coordenador",
  },
];

// ====================
// NEW ANALYTICS MOCK DATA
// ====================

import type {
  CampaignOverview,
  InfluenceAnalytics,
  EngagementAnalytics,
  VoterAnalytics,
  EventAnalytics,
  CanvassingAnalytics,
  GeographicData,
  TimeSeriesData,
  CampaignMetrics,
  TopInfluencer,
  TopEngagedVoter,
  ContactResponsePoint,
  CampaignMilestone,
  VolunteerMonthlyData,
} from "@/types/analytics";

/**
 * Generate realistic time series data
 */
function generateTimeSeries(days: number, baseValue: number, variance: number) {
  const data = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Add some trend and randomness
    const trend = (days - i) / days; // Gradual increase
    const random = Math.random() * variance;
    const value = Math.floor(baseValue * (0.7 + trend * 0.3) + random);

    data.push({
      date: date.toISOString().split("T")[0],
      count: value,
    });
  }

  return data;
}

/**
 * Campaign Overview Mock Data
 */
export const campaignOverviewMock: CampaignOverview = {
  summary: {
    totalVoters: 200,
    totalEvents: 12,
    totalCanvassingSessions: 8,
    totalDoorKnocks: 345,
  },
  voters: {
    total: 200,
    withEmail: 185,
    withPhone: 195,
    withWhatsapp: 200,
    withCoordinates: 200,
    bySupportLevel: {
      MUITO_FAVORAVEL: 45,
      FAVORAVEL: 82,
      NEUTRO: 38,
      DESFAVORAVEL: 22,
      MUITO_DESFAVORAVEL: 8,
      NAO_DEFINIDO: 5,
    },
    byCity: {
      Macapá: 200,
    },
    byGender: {
      MASCULINO: 98,
      FEMININO: 95,
      OUTRO: 4,
      NAO_INFORMADO: 3,
    },
    recent: {
      last7Days: 12,
      last30Days: 47,
    },
  },
  events: {
    total: 12,
    upcoming: 3,
    completed: 7,
    cancelled: 2,
    byType: {
      REUNIAO: 5,
      CAMINHADA: 3,
      PORTA_A_PORTA: 2,
      EVENTO_PUBLICO: 2,
    },
    byStatus: {
      AGENDADO: 3,
      EM_ANDAMENTO: 0,
      CONCLUIDO: 7,
      CANCELADO: 2,
    },
    byVisibility: {
      PUBLICO: 8,
      PRIVADO: 4,
    },
    thisMonth: 4,
  },
  canvassing: {
    totalSessions: 8,
    completedSessions: 5,
    inProgressSessions: 1,
    totalDoorKnocks: 345,
    results: {
      supporters: 128,
      undecided: 97,
      opponents: 45,
      notHome: 52,
      refused: 23,
    },
    byResult: {
      APOIADOR: 128,
      INDECISO: 97,
      OPOSITOR: 45,
      NAO_ATENDEU: 52,
      RECUSOU_CONTATO: 23,
    },
    conversionRate: 44, // 128 supporters / (345 - 52 not home) * 100
  },
  trends: {
    voterGrowth: generateTimeSeries(30, 7, 3),
    eventActivity: generateTimeSeries(30, 2, 1),
    canvassingProgress: generateTimeSeries(30, 12, 5),
  },
};

/**
 * Influence Analytics Mock Data
 */
export const influenceAnalyticsMock: InfluenceAnalytics = {
  totalInfluencers: 45,
  totalNetworkSize: 12500,
  totalSocialMediaReach: 87500,
  communityLeaders: 18,
  distribution: {
    high: 45, // >= 70
    medium: 82, // 40-69
    low: 73, // < 40
  },
  byCommunityRole: {
    LIDER: 18,
    MEMBRO_ATIVO: 52,
    ATIVISTA: 28,
    MEMBRO: 67,
    NAO_PARTICIPANTE: 32,
    NAO_DEFINIDO: 3,
  },
  topInfluencers: [
    {
      id: "1",
      name: "Ana Costa",
      influencerScore: 95,
      networkSize: 850,
      socialMediaFollowers: 12500,
      communityRole: "LIDER",
      neighborhood: "Pacoval",
      city: "Macapá",
      referredVoters: 23,
    },
    {
      id: "2",
      name: "Carlos Silva",
      influencerScore: 88,
      networkSize: 620,
      socialMediaFollowers: 8900,
      communityRole: "LIDER",
      neighborhood: "Buritizal",
      city: "Macapá",
      referredVoters: 18,
    },
    {
      id: "3",
      name: "Maria Santos",
      influencerScore: 85,
      networkSize: 580,
      socialMediaFollowers: 7200,
      communityRole: "MEMBRO_ATIVO",
      neighborhood: "Centro",
      city: "Macapá",
      referredVoters: 15,
    },
    {
      id: "4",
      name: "João Oliveira",
      influencerScore: 82,
      networkSize: 520,
      socialMediaFollowers: 6800,
      communityRole: "LIDER",
      neighborhood: "Trem",
      city: "Macapá",
      referredVoters: 14,
    },
    {
      id: "5",
      name: "Fernanda Martins",
      influencerScore: 78,
      networkSize: 480,
      socialMediaFollowers: 5500,
      communityRole: "ATIVISTA",
      neighborhood: "Araxá",
      city: "Macapá",
      referredVoters: 12,
    },
  ],
  networkGrowthTrend: generateTimeSeries(30, 420, 30),
  influenceByNeighborhood: {
    Pacoval: 4,
    Buritizal: 3,
    Centro: 3,
    Trem: 2,
    Araxá: 2,
    Laguinho: 2,
    Zerão: 2,
  },
};

/**
 * Engagement Analytics Mock Data
 */
export const engagementAnalyticsMock: EngagementAnalytics = {
  avgEngagementScore: 68.5,
  avgResponseRate: 72.3,
  activeVoters7Days: 87,
  dormantVoters: 23,
  scoreDistribution: {
    high: 75, // >= 70
    medium: 95, // 40-69
    low: 30, // < 40
  },
  trendDistribution: {
    CRESCENTE: 92,
    ESTAVEL: 78,
    DECRESCENTE: 24,
    NAO_DEFINIDO: 6,
  },
  topEngaged: [
    {
      id: "1",
      name: "Pedro Souza",
      engagementScore: 96,
      responseRate: 95,
      contactFrequency: 18,
      trend: "CRESCENTE",
      lastEngagementDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      id: "2",
      name: "Julia Lima",
      engagementScore: 93,
      responseRate: 92,
      contactFrequency: 16,
      trend: "CRESCENTE",
      lastEngagementDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: "3",
      name: "Ricardo Alves",
      engagementScore: 89,
      responseRate: 88,
      contactFrequency: 15,
      trend: "ESTAVEL",
      lastEngagementDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      id: "4",
      name: "Beatriz Ferreira",
      engagementScore: 87,
      responseRate: 90,
      contactFrequency: 14,
      trend: "CRESCENTE",
      lastEngagementDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      id: "5",
      name: "André Ribeiro",
      engagementScore: 85,
      responseRate: 85,
      contactFrequency: 13,
      trend: "ESTAVEL",
      lastEngagementDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  ],
  engagementTrend: generateTimeSeries(30, 70, 5),
  responseTrend: generateTimeSeries(30, 72, 4),
  contactResponseData: [
    {
      contactFrequency: 2.5,
      responseRate: 45,
      count: 32,
      avgEngagementScore: 42,
    },
    {
      contactFrequency: 8,
      responseRate: 68,
      count: 58,
      avgEngagementScore: 65,
    },
    {
      contactFrequency: 15,
      responseRate: 82,
      count: 72,
      avgEngagementScore: 78,
    },
    {
      contactFrequency: 25,
      responseRate: 92,
      count: 38,
      avgEngagementScore: 88,
    },
  ],
};

/**
 * Voter Analytics Mock Data
 */
export const voterAnalyticsMock: VoterAnalytics = {
  total: 200,
  demographics: {
    byGender: {
      MASCULINO: 98,
      FEMININO: 95,
      OUTRO: 4,
      NAO_INFORMADO: 3,
    },
    byEducationLevel: {
      FUNDAMENTAL_INCOMPLETO: 15,
      FUNDAMENTAL_COMPLETO: 28,
      MEDIO_INCOMPLETO: 22,
      MEDIO_COMPLETO: 58,
      SUPERIOR_INCOMPLETO: 32,
      SUPERIOR_COMPLETO: 38,
      POS_GRADUACAO: 7,
    },
    byIncomeLevel: {
      ATE_1_SALARIO: 35,
      DE_1_A_2_SALARIOS: 62,
      DE_2_A_5_SALARIOS: 58,
      DE_5_A_10_SALARIOS: 32,
      ACIMA_10_SALARIOS: 13,
    },
    byMaritalStatus: {
      SOLTEIRO: 72,
      CASADO: 85,
      DIVORCIADO: 23,
      VIUVO: 12,
      UNIAO_ESTAVEL: 8,
    },
    byAge: {
      ageRanges: {
        "18-25": 42,
        "26-35": 58,
        "36-50": 62,
        "51-65": 28,
        "65+": 10,
      },
      averageAge: 38,
    },
  },
  geographic: {
    byCity: {
      Macapá: 200,
    },
    byNeighborhood: {
      Centro: 28,
      Buritizal: 25,
      Trem: 22,
      Pacoval: 20,
      Laguinho: 18,
      "Jesus de Nazaré": 17,
      Araxá: 15,
      Zerão: 15,
      "Novo Horizonte": 12,
      "Santa Rita": 10,
      Outros: 18,
    },
    byState: {
      AP: 200,
    },
    byElectoralZone: {
      "1": 42,
      "2": 38,
      "3": 35,
      "4": 32,
      "5": 28,
      "6": 25,
    },
  },
  political: {
    bySupportLevel: {
      MUITO_FAVORAVEL: 45,
      FAVORAVEL: 82,
      NEUTRO: 38,
      DESFAVORAVEL: 22,
      MUITO_DESFAVORAVEL: 8,
      NAO_DEFINIDO: 5,
    },
    byPoliticalParty: {
      "Sem Partido": 98,
      PT: 32,
      PSDB: 28,
      MDB: 22,
      Outros: 20,
    },
  },
  contact: {
    withEmail: 185,
    withPhone: 195,
    withWhatsapp: 200,
    preferredContactMethod: {
      WHATSAPP: 142,
      TELEFONE: 38,
      EMAIL: 20,
    },
  },
  engagement: {
    withCoordinates: 200,
    withSocialMedia: 165,
  },
};

/**
 * Event Analytics Mock Data
 */
export const eventAnalyticsMock: EventAnalytics = {
  total: 12,
  byType: {
    REUNIAO: 5,
    CAMINHADA: 3,
    PORTA_A_PORTA: 2,
    EVENTO_PUBLICO: 2,
  },
  byStatus: {
    AGENDADO: 3,
    EM_ANDAMENTO: 0,
    CONCLUIDO: 7,
    CANCELADO: 2,
  },
  byVisibility: {
    PUBLICO: 8,
    PRIVADO: 4,
  },
  upcoming: 3,
  past: 9,
  completed: 7,
  cancelled: 2,
  geographic: {
    byCity: {
      Macapá: 12,
    },
    byState: {
      AP: 12,
    },
  },
  attendance: {
    totalExpected: 580,
    totalConfirmed: 437,
  },
  timeline: {
    "2026-01": 4,
    "2025-12": 5,
    "2025-11": 3,
  },
};

/**
 * Canvassing Analytics Mock Data
 */
export const canvassingAnalyticsMock: CanvassingAnalytics = {
  sessions: {
    total: 8,
    byStatus: {
      PLANEJADA: 2,
      EM_ANDAMENTO: 1,
      CONCLUIDA: 5,
    },
    completed: 5,
    inProgress: 1,
    planned: 2,
    byRegion: {
      Centro: 2,
      Buritizal: 2,
      Trem: 1,
      Pacoval: 1,
      Laguinho: 1,
      Araxá: 1,
    },
    byNeighborhood: {
      Centro: 2,
      Buritizal: 2,
      Trem: 1,
      Pacoval: 1,
      Laguinho: 1,
      Araxá: 1,
    },
  },
  doorKnocks: {
    total: 345,
    byResult: {
      APOIADOR: 128,
      INDECISO: 97,
      OPOSITOR: 45,
      NAO_ATENDEU: 52,
      RECUSOU_CONTATO: 23,
    },
    supporters: 128,
    undecided: 97,
    opponents: 45,
    notHome: 52,
    refused: 23,
    requiresFollowUp: 97, // Undecided voters
  },
  performance: {
    conversionRate: 44, // 128 / (345 - 52) * 100
    averagePerSession: 43, // 345 / 8
    successRate: 65, // (128 + 97) / 345 * 100
  },
};

/**
 * Geographic Data Mock
 */
export const geographicDataMock: GeographicData = {
  points: [
    // Pacoval - mix of support levels
    {
      lat: 0.0451,
      lng: -51.0734,
      supportLevel: "MUITO_FAVORAVEL",
      influencerScore: 95,
      engagementScore: 88,
      city: "Macapá",
      neighborhood: "Pacoval",
      voterId: "1",
      voterName: "Ana Costa",
    },
    {
      lat: 0.0458,
      lng: -51.0741,
      supportLevel: "FAVORAVEL",
      influencerScore: 65,
      engagementScore: 72,
      city: "Macapá",
      neighborhood: "Pacoval",
      voterId: "2",
      voterName: "Carlos Mendes",
    },
    {
      lat: 0.0462,
      lng: -51.0728,
      supportLevel: "FAVORAVEL",
      influencerScore: 58,
      engagementScore: 68,
      city: "Macapá",
      neighborhood: "Pacoval",
      voterId: "3",
      voterName: "Lucia Rocha",
    },

    // Buritizal - strong support
    {
      lat: 0.0389,
      lng: -51.0612,
      supportLevel: "MUITO_FAVORAVEL",
      influencerScore: 88,
      engagementScore: 85,
      city: "Macapá",
      neighborhood: "Buritizal",
      voterId: "4",
      voterName: "Carlos Silva",
    },
    {
      lat: 0.0395,
      lng: -51.0619,
      supportLevel: "FAVORAVEL",
      influencerScore: 72,
      engagementScore: 78,
      city: "Macapá",
      neighborhood: "Buritizal",
      voterId: "5",
      voterName: "José Almeida",
    },
    {
      lat: 0.0382,
      lng: -51.0605,
      supportLevel: "MUITO_FAVORAVEL",
      influencerScore: 68,
      engagementScore: 75,
      city: "Macapá",
      neighborhood: "Buritizal",
      voterId: "6",
      voterName: "Patricia Lima",
    },

    // Centro - mixed opinions
    {
      lat: 0.0378,
      lng: -51.0648,
      supportLevel: "FAVORAVEL",
      influencerScore: 85,
      engagementScore: 82,
      city: "Macapá",
      neighborhood: "Centro",
      voterId: "7",
      voterName: "Maria Santos",
    },
    {
      lat: 0.0385,
      lng: -51.0655,
      supportLevel: "NEUTRO",
      influencerScore: 45,
      engagementScore: 52,
      city: "Macapá",
      neighborhood: "Centro",
      voterId: "8",
      voterName: "Roberto Dias",
    },
    {
      lat: 0.0372,
      lng: -51.0642,
      supportLevel: "DESFAVORAVEL",
      influencerScore: 32,
      engagementScore: 38,
      city: "Macapá",
      neighborhood: "Centro",
      voterId: "9",
      voterName: "Amanda Cruz",
    },

    // Trem - growing support
    {
      lat: 0.0312,
      lng: -51.0578,
      supportLevel: "MUITO_FAVORAVEL",
      influencerScore: 82,
      engagementScore: 80,
      city: "Macapá",
      neighborhood: "Trem",
      voterId: "10",
      voterName: "João Oliveira",
    },
    {
      lat: 0.0318,
      lng: -51.0585,
      supportLevel: "FAVORAVEL",
      influencerScore: 62,
      engagementScore: 70,
      city: "Macapá",
      neighborhood: "Trem",
      voterId: "11",
      voterName: "Sandra Pinto",
    },

    // Araxá
    {
      lat: 0.0295,
      lng: -51.0712,
      supportLevel: "FAVORAVEL",
      influencerScore: 78,
      engagementScore: 76,
      city: "Macapá",
      neighborhood: "Araxá",
      voterId: "12",
      voterName: "Fernanda Martins",
    },
    {
      lat: 0.0302,
      lng: -51.0719,
      supportLevel: "NEUTRO",
      influencerScore: 48,
      engagementScore: 55,
      city: "Macapá",
      neighborhood: "Araxá",
      voterId: "13",
      voterName: "Marcos Souza",
    },

    // Laguinho
    {
      lat: 0.0428,
      lng: -51.0698,
      supportLevel: "FAVORAVEL",
      influencerScore: 70,
      engagementScore: 74,
      city: "Macapá",
      neighborhood: "Laguinho",
      voterId: "14",
      voterName: "Cristina Barros",
    },
    {
      lat: 0.0435,
      lng: -51.0705,
      supportLevel: "MUITO_FAVORAVEL",
      influencerScore: 75,
      engagementScore: 79,
      city: "Macapá",
      neighborhood: "Laguinho",
      voterId: "15",
      voterName: "Felipe Gomes",
    },
  ],
  summary: {
    total: 200,
    bySupportLevel: {
      MUITO_FAVORAVEL: 45,
      FAVORAVEL: 82,
      NEUTRO: 38,
      DESFAVORAVEL: 22,
      MUITO_DESFAVORAVEL: 8,
      NAO_DEFINIDO: 5,
    },
    byCity: {
      Macapá: 200,
    },
    byNeighborhood: {
      Centro: 28,
      Buritizal: 25,
      Trem: 22,
      Pacoval: 20,
      Laguinho: 18,
      "Jesus de Nazaré": 17,
      Araxá: 15,
      Zerão: 15,
      "Novo Horizonte": 12,
      "Santa Rita": 10,
      Outros: 18,
    },
  },
};

/**
 * Time Series Data Mock
 */
export const timeSeriesDataMock: TimeSeriesData = {
  metric: "voter-registrations",
  points: generateTimeSeries(30, 7, 3),
  summary: {
    total: 200,
    average: 6.7,
    trend: "up",
    changePercent: 15.8,
  },
};

/**
 * Campaign Metrics Mock Data
 */
export const campaignMetricsMock: CampaignMetrics = {
  milestones: [
    {
      id: "1",
      name: "Cadastro de 200 eleitores",
      description: "Meta de cadastrar 200 eleitores no banco de dados",
      targetDate: new Date("2026-01-15"),
      completedDate: new Date("2026-01-07"),
      status: "completed",
      progress: 100,
      category: "voters",
    },
    {
      id: "2",
      name: "Cobertura de 10 bairros",
      description: "Estabelecer presença em 10 bairros de Macapá",
      targetDate: new Date("2026-01-20"),
      status: "in_progress",
      progress: 82,
      category: "canvassing",
    },
    {
      id: "3",
      name: "5 eventos comunitários",
      description: "Realizar 5 eventos públicos",
      targetDate: new Date("2026-02-01"),
      completedDate: new Date("2026-01-05"),
      status: "completed",
      progress: 100,
      category: "events",
    },
  ],
  coverageArea: {
    totalNeighborhoods: 25,
    coveredNeighborhoods: 11,
    coveragePercentage: 44,
    neighborhoodDetails: [],
    uncoveredNeighborhoods: [
      "Congós",
      "Muca",
      "Universidade",
      "Infraero",
      "São Lázaro",
    ],
  },
  geofencing: {
    totalZones: 8,
    activeZones: 6,
    zones: [
      {
        id: "1",
        name: "Centro - Zona 1",
        center: { lat: 0.0378, lng: -51.0648 },
        radius: 500,
        voterCount: 28,
        isActive: true,
        createdAt: new Date("2025-12-01"),
        lastActivity: new Date("2026-01-07"),
      },
      {
        id: "2",
        name: "Buritizal - Zona 2",
        center: { lat: 0.0389, lng: -51.0612 },
        radius: 600,
        voterCount: 25,
        isActive: true,
        createdAt: new Date("2025-12-05"),
        lastActivity: new Date("2026-01-06"),
      },
    ],
  },
  volunteerActivity: {
    total: 45,
    active: 28,
    inactive: 12,
    interested: 5,
    byMonth: [
      {
        month: "2025-11",
        active: 18,
        interested: 8,
        inactive: 10,
        eventsOrganized: 2,
        votersContacted: 85,
      },
      {
        month: "2025-12",
        active: 25,
        interested: 6,
        inactive: 11,
        eventsOrganized: 5,
        votersContacted: 142,
      },
      {
        month: "2026-01",
        active: 28,
        interested: 5,
        inactive: 12,
        eventsOrganized: 4,
        votersContacted: 118,
      },
    ],
    topVolunteers: [
      {
        id: "1",
        name: "Ana Costa",
        status: "ATIVO",
        eventsAttended: 8,
        votersReferred: 23,
        hoursContributed: 48,
        lastActivity: new Date("2026-01-07"),
      },
      {
        id: "2",
        name: "Carlos Silva",
        status: "ATIVO",
        eventsAttended: 7,
        votersReferred: 18,
        hoursContributed: 42,
        lastActivity: new Date("2026-01-06"),
      },
    ],
  },
};

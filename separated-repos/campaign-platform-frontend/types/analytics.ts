import type {
  SupportLevel,
  EngagementTrend,
  CommunityRole,
  VolunteerStatus,
  TurnoutLikelihood,
} from "./voters";

/**
 * Analytics Period Types
 */
export type AnalyticsPeriod = "week" | "month" | "quarter" | "year" | "custom";

export interface DateRange {
  start: Date;
  end: Date;
}

/**
 * Campaign Overview - Top-level summary metrics
 */
export interface CampaignOverview {
  summary: {
    totalVoters: number;
    totalEvents: number;
    totalCanvassingSessions: number;
    totalDoorKnocks: number;
  };
  voters: {
    total: number;
    withEmail: number;
    withPhone: number;
    withWhatsapp: number;
    withCoordinates: number;
    bySupportLevel: Record<string, number>;
    byCity: Record<string, number>;
    byGender: Record<string, number>;
    recent: {
      last7Days: number;
      last30Days: number;
    };
  };
  events: {
    total: number;
    upcoming: number;
    completed: number;
    cancelled: number;
    byType: Record<string, number>;
    byStatus: Record<string, number>;
    byVisibility: Record<string, number>;
    thisMonth: number;
  };
  canvassing: {
    totalSessions: number;
    completedSessions: number;
    inProgressSessions: number;
    totalDoorKnocks: number;
    results: {
      supporters: number;
      undecided: number;
      opponents: number;
      notHome: number;
      refused: number;
    };
    byResult: Record<string, number>;
    conversionRate: number;
  };
  trends: {
    voterGrowth: TimeSeriesPoint[];
    eventActivity: TimeSeriesPoint[];
    canvassingProgress: TimeSeriesPoint[];
  };
}

/**
 * Influence & Network Analytics
 */
export interface InfluenceAnalytics {
  totalInfluencers: number;
  totalNetworkSize: number;
  totalSocialMediaReach: number;
  communityLeaders: number;
  distribution: {
    high: number; // influencerScore >= 70
    medium: number; // 40-69
    low: number; // < 40
  };
  byCommunityRole: Record<CommunityRole | "NAO_DEFINIDO", number>;
  topInfluencers: TopInfluencer[];
  networkGrowthTrend: TimeSeriesPoint[];
  influenceByNeighborhood: Record<string, number>;
}

export interface TopInfluencer {
  id: string;
  name: string;
  influencerScore: number;
  networkSize: number;
  socialMediaFollowers: number;
  communityRole: CommunityRole;
  neighborhood: string;
  city: string;
  referredVoters: number;
}

/**
 * Engagement Analytics
 */
export interface EngagementAnalytics {
  avgEngagementScore: number;
  avgResponseRate: number;
  activeVoters7Days: number;
  dormantVoters: number;
  scoreDistribution: {
    high: number; // >= 70
    medium: number; // 40-69
    low: number; // < 40
  };
  trendDistribution: Record<EngagementTrend | "NAO_DEFINIDO", number>;
  topEngaged: TopEngagedVoter[];
  engagementTrend: TimeSeriesPoint[];
  responseTrend: TimeSeriesPoint[];
  contactResponseData: ContactResponsePoint[];
}

export interface TopEngagedVoter {
  id: string;
  name: string;
  engagementScore: number;
  responseRate: number;
  contactFrequency: number;
  trend: EngagementTrend;
  lastEngagementDate: Date;
}

export interface ContactResponsePoint {
  contactFrequency: number;
  responseRate: number;
  count: number;
  avgEngagementScore: number;
}

/**
 * Voter Demographics & Segmentation Analytics
 */
export interface VoterAnalytics {
  total: number;
  demographics: {
    byGender: Record<string, number>;
    byEducationLevel: Record<string, number>;
    byIncomeLevel: Record<string, number>;
    byMaritalStatus: Record<string, number>;
    byAge: {
      ageRanges: Record<string, number>;
      averageAge: number | null;
    };
  };
  geographic: {
    byCity: Record<string, number>;
    byNeighborhood: Record<string, number>;
    byState: Record<string, number>;
    byElectoralZone: Record<string, number>;
  };
  political: {
    bySupportLevel: Record<string, number>;
    byPoliticalParty: Record<string, number>;
  };
  contact: {
    withEmail: number;
    withPhone: number;
    withWhatsapp: number;
    preferredContactMethod: Record<string, number>;
  };
  engagement: {
    withCoordinates: number;
    withSocialMedia: number;
  };
}

/**
 * Event Analytics
 */
export interface EventAnalytics {
  total: number;
  byType: Record<string, number>;
  byStatus: Record<string, number>;
  byVisibility: Record<string, number>;
  upcoming: number;
  past: number;
  completed: number;
  cancelled: number;
  geographic: {
    byCity: Record<string, number>;
    byState: Record<string, number>;
  };
  attendance: {
    totalExpected: number;
    totalConfirmed: number;
  };
  timeline: Record<string, number>; // YYYY-MM format
}

/**
 * Canvassing Analytics
 */
export interface CanvassingAnalytics {
  sessions: {
    total: number;
    byStatus: Record<string, number>;
    completed: number;
    inProgress: number;
    planned: number;
    byRegion: Record<string, number>;
    byNeighborhood: Record<string, number>;
  };
  doorKnocks: {
    total: number;
    byResult: Record<string, number>;
    supporters: number;
    undecided: number;
    opponents: number;
    notHome: number;
    refused: number;
    requiresFollowUp: number;
  };
  performance: {
    conversionRate: number;
    averagePerSession: number;
    successRate: number;
  };
}

/**
 * Geographic Data for Heatmaps
 */
export interface GeographicData {
  points: GeographicPoint[];
  summary: {
    total: number;
    bySupportLevel: Record<SupportLevel, number>;
    byCity: Record<string, number>;
    byNeighborhood: Record<string, number>;
  };
}

export interface GeographicPoint {
  lat: number;
  lng: number;
  supportLevel: SupportLevel;
  influencerScore?: number;
  engagementScore?: number;
  city: string;
  neighborhood: string;
  voterId: string;
  voterName: string;
}

/**
 * Time Series Data
 */
export interface TimeSeriesPoint {
  date: string; // ISO format YYYY-MM-DD
  count: number;
  metric?: string;
  value?: number;
}

export interface TimeSeriesData {
  metric:
    | "voter-registrations"
    | "events"
    | "canvassing"
    | "engagement"
    | "influence";
  points: TimeSeriesPoint[];
  summary: {
    total: number;
    average: number;
    trend: "up" | "down" | "stable";
    changePercent: number;
  };
}

/**
 * Analytics Filters
 */
export interface AnalyticsFilters {
  period?: AnalyticsPeriod;
  dateRange?: DateRange;
  cities?: string[];
  neighborhoods?: string[];
  supportLevels?: SupportLevel[];
  minEngagementScore?: number;
  maxEngagementScore?: number;
  minInfluencerScore?: number;
  maxInfluencerScore?: number;
  communityRoles?: CommunityRole[];
  volunteerStatus?: VolunteerStatus[];
  turnoutLikelihood?: TurnoutLikelihood[];
  tags?: string[];
}

/**
 * Chart Data Types
 */
export interface DonutChartData {
  name: string;
  value: number;
  color: string;
  percentage?: number;
}

export interface BarChartData {
  name: string;
  value: number;
  color?: string;
  label?: string;
}

export interface LineChartData {
  date: string;
  [key: string]: string | number; // Dynamic series names
}

export interface ScatterChartData {
  x: number;
  y: number;
  size?: number;
  name: string;
  color?: string;
  category?: string;
}

/**
 * Campaign Metrics Specific Types
 */
export interface CampaignMetrics {
  milestones: CampaignMilestone[];
  coverageArea: CoverageAreaMetrics;
  geofencing: GeofencingMetrics;
  volunteerActivity: VolunteerActivityMetrics;
}

export interface CampaignMilestone {
  id: string;
  name: string;
  description: string;
  targetDate: Date;
  completedDate?: Date;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  progress: number; // 0-100
  category: "events" | "voters" | "canvassing" | "fundraising" | "other";
}

export interface CoverageAreaMetrics {
  totalNeighborhoods: number;
  coveredNeighborhoods: number;
  coveragePercentage: number;
  neighborhoodDetails: NeighborhoodCoverage[];
  uncoveredNeighborhoods: string[];
}

export interface NeighborhoodCoverage {
  neighborhood: string;
  city: string;
  voterCount: number;
  influencerCount: number;
  hasEvents: boolean;
  supportLevel: {
    favorable: number;
    neutral: number;
    unfavorable: number;
  };
  coverageScore: number; // 0-100
}

export interface GeofencingMetrics {
  totalZones: number;
  activeZones: number;
  zones: GeofenceZone[];
}

export interface GeofenceZone {
  id: string;
  name: string;
  center: {
    lat: number;
    lng: number;
  };
  radius: number; // in meters
  voterCount: number;
  isActive: boolean;
  createdAt: Date;
  lastActivity?: Date;
}

export interface VolunteerActivityMetrics {
  total: number;
  active: number;
  inactive: number;
  interested: number;
  byMonth: VolunteerMonthlyData[];
  topVolunteers: TopVolunteer[];
}

export interface VolunteerMonthlyData {
  month: string; // YYYY-MM
  active: number;
  interested: number;
  inactive: number;
  eventsOrganized: number;
  votersContacted: number;
}

export interface TopVolunteer {
  id: string;
  name: string;
  status: VolunteerStatus;
  eventsAttended: number;
  votersReferred: number;
  hoursContributed: number;
  lastActivity: Date;
}

/**
 * Drill-Down Modal Types
 */
export interface DrillDownData {
  metric: string;
  segment: string;
  title: string;
  data: any[];
  totalCount: number;
  filters?: AnalyticsFilters;
}

/**
 * Export Options
 */
export interface ExportOptions {
  format: "pdf" | "csv" | "excel";
  period: AnalyticsPeriod;
  sections: ExportSection[];
  includeCharts?: boolean;
  chartResolution?: "low" | "medium" | "high";
  emailTo?: string;
}

export type ExportSection =
  | "summary"
  | "influence"
  | "engagement"
  | "campaign"
  | "demographics"
  | "geographic"
  | "events"
  | "canvassing"
  | "all";

/**
 * Dashboard Tab Types
 */
export type AnalyticsTab =
  | "overview"
  | "voters"
  | "events"
  | "canvassing"
  | "influence"
  | "engagement"
  | "campaign";

export interface AnalyticsTabConfig {
  id: AnalyticsTab;
  label: string;
  icon: string;
  badge?: number;
}

/**
 * Real-time Update Configuration
 */
export interface AutoRefreshConfig {
  enabled: boolean;
  interval: number; // seconds
  lastUpdate: Date | null;
}

/**
 * Data Quality Metrics (for ML readiness)
 */
export interface DataQualityMetrics {
  engagementDataComplete: number; // percentage
  influenceDataComplete: number;
  persuasionDataComplete: number;
  communicationDataComplete: number;
  overallCompleteness: number;
  missingFieldsByCategory: Record<string, string[]>;
}

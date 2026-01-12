import type { Voter } from "@/types/voters";
import type {
  InfluenceAnalytics,
  EngagementAnalytics,
  CampaignMetrics,
  DonutChartData,
  BarChartData,
  LineChartData,
  ScatterChartData,
  TimeSeriesPoint,
  TopInfluencer,
  TopEngagedVoter,
  ContactResponsePoint,
  CampaignOverview,
} from "@/types/analytics";

/**
 * Transform voters data into Influence Analytics
 */
export function transformInfluencerData(
  voters: Voter[]
): Partial<InfluenceAnalytics> {
  const influencers = voters.filter(
    (v) => v.influencerScore && v.influencerScore >= 40
  );

  const distribution = {
    high: voters.filter((v) => (v.influencerScore || 0) >= 70).length,
    medium: voters.filter((v) => {
      const score = v.influencerScore || 0;
      return score >= 40 && score < 70;
    }).length,
    low: voters.filter((v) => (v.influencerScore || 0) < 40).length,
  };

  const byCommunityRole = groupBy(voters, "communityRole");

  const topInfluencers: TopInfluencer[] = voters
    .filter((v) => v.influencerScore && v.influencerScore >= 60)
    .sort((a, b) => (b.influencerScore || 0) - (a.influencerScore || 0))
    .slice(0, 10)
    .map((v) => ({
      id: v.id,
      name: v.name,
      influencerScore: v.influencerScore || 0,
      networkSize: v.networkSize || 0,
      socialMediaFollowers: v.socialMediaFollowers || 0,
      communityRole: v.communityRole || "NAO_DEFINIDO",
      neighborhood: v.neighborhood || "Unknown",
      city: v.city || "Unknown",
      referredVoters: v.referredVoters || 0,
    }));

  const totalNetworkSize = voters.reduce(
    (sum, v) => sum + (v.networkSize || 0),
    0
  );
  const totalSocialMediaReach = voters.reduce(
    (sum, v) => sum + (v.socialMediaFollowers || 0),
    0
  );
  const communityLeaders = voters.filter(
    (v) => v.communityRole === "LIDER"
  ).length;

  const influenceByNeighborhood = voters
    .filter((v) => v.communityRole === "LIDER" && v.neighborhood)
    .reduce((acc, v) => {
      const neighborhood = v.neighborhood || "Unknown";
      acc[neighborhood] = (acc[neighborhood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  return {
    totalInfluencers: influencers.length,
    totalNetworkSize,
    totalSocialMediaReach,
    communityLeaders,
    distribution,
    byCommunityRole,
    topInfluencers,
    influenceByNeighborhood,
  };
}

/**
 * Transform voters data into Engagement Analytics
 */
export function transformEngagementData(
  voters: Voter[]
): Partial<EngagementAnalytics> {
  const votersWithEngagement = voters.filter((v) => v.engagementScore != null);

  const avgEngagementScore =
    votersWithEngagement.length > 0
      ? votersWithEngagement.reduce(
          (sum, v) => sum + (v.engagementScore || 0),
          0
        ) / votersWithEngagement.length
      : 0;

  const votersWithResponse = voters.filter((v) => v.responseRate != null);
  const avgResponseRate =
    votersWithResponse.length > 0
      ? votersWithResponse.reduce((sum, v) => sum + (v.responseRate || 0), 0) /
        votersWithResponse.length
      : 0;

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const activeVoters7Days = voters.filter((v) => {
    if (!v.lastEngagementDate) return false;
    const lastEngagement = new Date(v.lastEngagementDate);
    return lastEngagement >= sevenDaysAgo;
  }).length;

  const dormantVoters = voters.filter((v) => {
    if (!v.lastContactDate) return false;
    const lastContact = new Date(v.lastContactDate);
    return lastContact < thirtyDaysAgo;
  }).length;

  const scoreDistribution = {
    high: voters.filter((v) => (v.engagementScore || 0) >= 70).length,
    medium: voters.filter((v) => {
      const score = v.engagementScore || 0;
      return score >= 40 && score < 70;
    }).length,
    low: voters.filter((v) => (v.engagementScore || 0) < 40).length,
  };

  const trendDistribution = groupBy(voters, "engagementTrend");

  const topEngaged: TopEngagedVoter[] = voters
    .filter((v) => v.engagementScore && v.engagementScore >= 60)
    .sort((a, b) => (b.engagementScore || 0) - (a.engagementScore || 0))
    .slice(0, 10)
    .map((v) => ({
      id: v.id,
      name: v.name,
      engagementScore: v.engagementScore || 0,
      responseRate: v.responseRate || 0,
      contactFrequency: v.contactFrequency || 0,
      trend: v.engagementTrend || "NAO_DEFINIDO",
      lastEngagementDate: v.lastEngagementDate
        ? new Date(v.lastEngagementDate)
        : new Date(),
    }));

  const contactResponseData: ContactResponsePoint[] =
    generateContactResponseData(voters);

  return {
    avgEngagementScore: Math.round(avgEngagementScore * 10) / 10,
    avgResponseRate: Math.round(avgResponseRate * 10) / 10,
    activeVoters7Days,
    dormantVoters,
    scoreDistribution,
    trendDistribution,
    topEngaged,
    contactResponseData,
  };
}

/**
 * Transform overview data into campaign metrics
 */
export function transformCampaignData(
  overview: CampaignOverview
): Partial<CampaignMetrics> {
  // This is a placeholder - in a real implementation, you'd fetch actual milestone data
  const milestones: any[] = [];

  const coverageArea = {
    totalNeighborhoods: Object.keys(overview.voters.byCity).length,
    coveredNeighborhoods: Object.keys(overview.voters.byCity).filter(
      (city) => overview.voters.byCity[city] > 0
    ).length,
    coveragePercentage: 0,
    neighborhoodDetails: [],
    uncoveredNeighborhoods: [],
  };

  coverageArea.coveragePercentage =
    (coverageArea.coveredNeighborhoods /
      Math.max(coverageArea.totalNeighborhoods, 1)) *
    100;

  const geofencing = {
    totalZones: 0,
    activeZones: 0,
    zones: [],
  };

  const volunteerActivity = {
    total: 0,
    active: 0,
    inactive: 0,
    interested: 0,
    byMonth: [],
    topVolunteers: [],
  };

  return {
    milestones,
    coverageArea,
    geofencing,
    volunteerActivity,
  };
}

/**
 * Transform data for Donut/Pie charts
 */
export function transformToDonutData(
  data: Record<string, number>,
  colorMap?: Record<string, string>
): DonutChartData[] {
  const total = Object.values(data).reduce((sum, val) => sum + val, 0);

  return Object.entries(data).map(([name, value]) => ({
    name,
    value,
    color:
      colorMap?.[name] || `hsl(var(--chart-${(Math.random() * 5 + 1) | 0}))`,
    percentage: total > 0 ? Math.round((value / total) * 100) : 0,
  }));
}

/**
 * Transform data for Bar charts
 */
export function transformToBarData(
  data: Record<string, number>,
  labelMap?: Record<string, string>,
  colorMap?: Record<string, string>
): BarChartData[] {
  return Object.entries(data).map(([name, value]) => ({
    name,
    value,
    label: labelMap?.[name] || name,
    color: colorMap?.[name],
  }));
}

/**
 * Transform time series data for Line/Area charts
 */
export function transformToLineData(
  points: TimeSeriesPoint[]
): LineChartData[] {
  return points.map((point) => ({
    ...point,
    value: point.count,
  }));
}

/**
 * Transform voters into scatter plot data (Contact Frequency vs Response Rate)
 */
export function transformToScatterData(voters: Voter[]): ScatterChartData[] {
  return voters
    .filter((v) => v.contactFrequency && v.responseRate)
    .map((v) => ({
      x: v.contactFrequency || 0,
      y: v.responseRate || 0,
      size: v.engagementScore || 50,
      name: v.name,
      color: getSupportLevelColor(v.supportLevel),
      category: v.supportLevel || "NAO_DEFINIDO",
    }));
}

/**
 * Generate contact-response correlation data
 */
function generateContactResponseData(voters: Voter[]): ContactResponsePoint[] {
  // Group voters by contact frequency buckets
  const buckets: Record<string, { voters: Voter[]; frequency: number }> = {
    "0-5": { voters: [], frequency: 2.5 },
    "6-10": { voters: [], frequency: 8 },
    "11-20": { voters: [], frequency: 15 },
    "21+": { voters: [], frequency: 25 },
  };

  voters.forEach((v) => {
    const freq = v.contactFrequency || 0;
    if (freq <= 5) buckets["0-5"].voters.push(v);
    else if (freq <= 10) buckets["6-10"].voters.push(v);
    else if (freq <= 20) buckets["11-20"].voters.push(v);
    else buckets["21+"].voters.push(v);
  });

  return Object.entries(buckets).map(
    ([_key, { voters: bucketVoters, frequency }]) => {
      const avgResponse =
        bucketVoters.length > 0
          ? bucketVoters.reduce((sum, v) => sum + (v.responseRate || 0), 0) /
            bucketVoters.length
          : 0;

      const avgEngagement =
        bucketVoters.length > 0
          ? bucketVoters.reduce((sum, v) => sum + (v.engagementScore || 0), 0) /
            bucketVoters.length
          : 0;

      return {
        contactFrequency: frequency,
        responseRate: Math.round(avgResponse),
        count: bucketVoters.length,
        avgEngagementScore: Math.round(avgEngagement),
      };
    }
  );
}

/**
 * Helper: Group array by field
 */
export function groupBy<T extends Record<string, any>>(
  items: T[],
  field: keyof T
): Record<string, number> {
  return items.reduce((acc, item) => {
    const value = item[field] || "NOT_SPECIFIED";
    acc[value as string] = (acc[value as string] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

/**
 * Helper: Calculate distribution by numeric field
 */
export function calculateDistribution<T extends Record<string, any>>(
  items: T[],
  field: keyof T,
  ranges: { label: string; min: number; max: number }[]
): Record<string, number> {
  const distribution: Record<string, number> = {};

  ranges.forEach((range) => {
    distribution[range.label] = items.filter((item) => {
      const value = item[field] as number;
      return value >= range.min && value < range.max;
    }).length;
  });

  return distribution;
}

/**
 * Helper: Calculate trend from time series data
 */
export function calculateTrend(
  points: TimeSeriesPoint[]
): "up" | "down" | "stable" {
  if (points.length < 2) return "stable";

  const firstHalf = points.slice(0, Math.floor(points.length / 2));
  const secondHalf = points.slice(Math.floor(points.length / 2));

  const firstAvg =
    firstHalf.reduce((sum, p) => sum + p.count, 0) / firstHalf.length;
  const secondAvg =
    secondHalf.reduce((sum, p) => sum + p.count, 0) / secondHalf.length;

  const changePercent = ((secondAvg - firstAvg) / firstAvg) * 100;

  if (changePercent > 5) return "up";
  if (changePercent < -5) return "down";
  return "stable";
}

/**
 * Helper: Calculate percentage change
 */
export function calculatePercentageChange(
  current: number,
  previous: number
): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100 * 10) / 10;
}

/**
 * Helper: Get color for support level
 */
export function getSupportLevelColor(supportLevel?: string): string {
  const colorMap: Record<string, string> = {
    MUITO_FAVORAVEL: "#22c55e", // green-500
    FAVORAVEL: "#84cc16", // lime-500
    NEUTRO: "#f59e0b", // amber-500
    DESFAVORAVEL: "#f97316", // orange-500
    MUITO_DESFAVORAVEL: "#ef4444", // red-500
    NAO_DEFINIDO: "#6b7280", // gray-500
  };

  return colorMap[supportLevel || "NAO_DEFINIDO"] || colorMap.NAO_DEFINIDO;
}

/**
 * Helper: Get color for engagement trend
 */
export function getEngagementTrendColor(trend?: string): string {
  const colorMap: Record<string, string> = {
    CRESCENTE: "#22c55e", // green-500
    ESTAVEL: "#f59e0b", // amber-500
    DECRESCENTE: "#ef4444", // red-500
    NAO_DEFINIDO: "#6b7280", // gray-500
  };

  return colorMap[trend || "NAO_DEFINIDO"] || colorMap.NAO_DEFINIDO;
}

/**
 * Helper: Format number with K/M suffix
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}

/**
 * Helper: Format percentage
 */
export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Helper: Downsample large datasets for chart performance
 */
export function downsampleTimeSeries(
  points: TimeSeriesPoint[],
  maxPoints = 100
): TimeSeriesPoint[] {
  if (points.length <= maxPoints) return points;

  const step = Math.ceil(points.length / maxPoints);
  const downsampled: TimeSeriesPoint[] = [];

  for (let i = 0; i < points.length; i += step) {
    const bucket = points.slice(i, i + step);
    const avgCount =
      bucket.reduce((sum, p) => sum + p.count, 0) / bucket.length;

    downsampled.push({
      date: bucket[0].date,
      count: Math.round(avgCount),
      metric: bucket[0].metric,
    });
  }

  return downsampled;
}

/**
 * Helper: Generate date range labels
 */
export function generateDateRangeLabels(
  startDate: Date,
  endDate: Date,
  granularity: "day" | "week" | "month" = "day"
): string[] {
  const labels: string[] = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    if (granularity === "day") {
      labels.push(current.toISOString().split("T")[0]);
      current.setDate(current.getDate() + 1);
    } else if (granularity === "week") {
      labels.push(current.toISOString().split("T")[0]);
      current.setDate(current.getDate() + 7);
    } else if (granularity === "month") {
      labels.push(current.toISOString().slice(0, 7)); // YYYY-MM
      current.setMonth(current.getMonth() + 1);
    }
  }

  return labels;
}

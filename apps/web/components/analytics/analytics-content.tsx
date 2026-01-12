'use client';

import { useEffect } from 'react';
import { useAnalyticsStore } from '@/store/analytics-store';
import { AnalyticsHeader } from './analytics-header';
import { AnalyticsTabs } from './analytics-tabs';
import { toast } from 'sonner';
import type {
  CampaignOverview,
  InfluenceAnalytics,
  EngagementAnalytics,
  VoterAnalytics,
  EventAnalytics,
  CanvassingAnalytics,
  GeographicData,
  CampaignMetrics,
} from '@/types/analytics';

interface AnalyticsContentProps {
  initialData: {
    overview: CampaignOverview | null;
    influence: InfluenceAnalytics | null;
    engagement: EngagementAnalytics | null;
    voters: VoterAnalytics | null;
    events: EventAnalytics | null;
    canvassing: CanvassingAnalytics | null;
    geographic: GeographicData | null;
    campaignMetrics: CampaignMetrics | null;
  };
}

/**
 * Main Analytics Content Component
 * Client component that manages analytics state and real-time updates
 */
export function AnalyticsContent({ initialData }: AnalyticsContentProps) {
  const {
    selectedTab,
    autoRefresh,
    setSelectedTab,
    fetchAllData,
  } = useAnalyticsStore();

  // Initialize store with server data
  useEffect(() => {
    if (initialData.overview) {
      useAnalyticsStore.setState({ overview: initialData.overview });
    }
    if (initialData.influence) {
      useAnalyticsStore.setState({ influence: initialData.influence });
    }
    if (initialData.engagement) {
      useAnalyticsStore.setState({ engagement: initialData.engagement });
    }
    if (initialData.voters) {
      useAnalyticsStore.setState({ voters: initialData.voters });
    }
    if (initialData.events) {
      useAnalyticsStore.setState({ events: initialData.events });
    }
    if (initialData.canvassing) {
      useAnalyticsStore.setState({ canvassing: initialData.canvassing });
    }
    if (initialData.geographic) {
      useAnalyticsStore.setState({ geographic: initialData.geographic });
    }
    if (initialData.campaignMetrics) {
      useAnalyticsStore.setState({ campaignMetrics: initialData.campaignMetrics });
    }
  }, [initialData]);

  // Auto-refresh logic
  useEffect(() => {
    if (!autoRefresh.enabled) return;

    const interval = setInterval(
      () => {
        fetchAllData();
        toast.info('Analytics atualizadas', {
          duration: 2000,
          description: 'Dados atualizados com sucesso',
        });
      },
      autoRefresh.interval * 1000
    );

    return () => clearInterval(interval);
  }, [autoRefresh.enabled, autoRefresh.interval, fetchAllData]);

  return (
    <div className="flex h-full flex-col">
      {/* Header with filters and actions */}
      <AnalyticsHeader />

      {/* Main content area */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">
          {/* Tab Navigation and Content */}
          <AnalyticsTabs />
        </div>
      </div>
    </div>
  );
}

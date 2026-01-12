import { Suspense } from "react";
import { AnalyticsContent } from "@/components/analytics/analytics-content";
import { analyticsApi } from "@/lib/api/endpoints/analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Analytics Page - Server Component
 * Fetches initial data on the server and passes to client components
 */
export default async function AnalyticsPage() {
  // Fetch all analytics data in parallel
  const [
    overviewResponse,
    votersResponse,
    eventsResponse,
    canvassingResponse,
    geographicResponse,
  ] = await Promise.allSettled([
    analyticsApi.getCampaignOverview(),
    analyticsApi.getVoterAnalytics(),
    analyticsApi.getEventAnalytics(),
    analyticsApi.getCanvassingAnalytics(),
    analyticsApi.getGeographicHeatmap(),
  ]);

  // Extract data from responses, handling errors gracefully
  const initialData = {
    overview:
      overviewResponse.status === "fulfilled"
        ? overviewResponse.value.data
        : null,
    influence: null, // Not implemented yet
    engagement: null, // Not implemented yet
    voters:
      votersResponse.status === "fulfilled" ? votersResponse.value.data : null,
    events:
      eventsResponse.status === "fulfilled" ? eventsResponse.value.data : null,
    canvassing:
      canvassingResponse.status === "fulfilled"
        ? canvassingResponse.value.data
        : null,
    geographic:
      geographicResponse.status === "fulfilled"
        ? geographicResponse.value.data
        : null,
    campaignMetrics: null, // Not implemented yet
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Análises</h1>
          <p className="text-muted-foreground">
            Análise detalhada dos dados da campanha
          </p>
        </div>
      </div>

      {/* Main Analytics Content */}
      <Suspense fallback={<AnalyticsLoadingSkeleton />}>
        <AnalyticsContent initialData={initialData} />
      </Suspense>
    </div>
  );
}

/**
 * Loading skeleton for analytics
 */
function AnalyticsLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <Skeleton className="h-4 w-32" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-3 w-40" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Skeleton className="h-96 w-full" />
    </div>
  );
}

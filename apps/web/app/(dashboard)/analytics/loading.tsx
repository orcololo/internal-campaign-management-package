import { Skeleton } from '@/components/ui/skeleton';

export default function AnalyticsLoadingPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="flex gap-4 border-b">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-3 rounded-lg border p-6">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-lg border p-6">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-64" />
        </div>
        <div className="space-y-4 rounded-lg border p-6">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-64" />
        </div>
      </div>

      {/* Additional Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-lg border p-6">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-64" />
        </div>
        <div className="space-y-4 rounded-lg border p-6">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-64" />
        </div>
      </div>
    </div>
  );
}

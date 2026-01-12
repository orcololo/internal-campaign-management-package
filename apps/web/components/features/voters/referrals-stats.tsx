"use client";

import { Users, UserCheck, TrendingUp, Target } from "lucide-react";
import { MetricCard } from "@/components/composed/charts/metric-card";
import { ReferralStats } from "@/types/voters";

interface ReferralsStatsProps {
  stats: ReferralStats;
}

export function ReferralsStats({ stats }: ReferralsStatsProps) {
  const favorableCount =
    stats.byLevel.MUITO_FAVORAVEL + stats.byLevel.FAVORAVEL;
  const favorablePercentage =
    stats.total > 0 ? Math.round((favorableCount / stats.total) * 100) : 0;

  // Calculate growth (comparing thisMonth to average)
  const averageMonthly = stats.total > 0 ? Math.round(stats.total / 6) : 0;
  const growthPercentage =
    averageMonthly > 0
      ? Math.round(((stats.thisMonth - averageMonthly) / averageMonthly) * 100)
      : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Total Referenciados"
        value={stats.total}
        icon={Users}
        iconColor="#3b82f6"
      />

      <MetricCard
        title="Referenciados Ativos"
        value={stats.active}
        change={
          stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0
        }
        trend={stats.active > stats.total / 2 ? "up" : "neutral"}
        icon={UserCheck}
        iconColor="#10b981"
      />

      <MetricCard
        title="Novos Este Mês"
        value={stats.thisMonth}
        change={Math.abs(growthPercentage)}
        trend={
          growthPercentage > 0
            ? "up"
            : growthPercentage < 0
            ? "down"
            : "neutral"
        }
        icon={TrendingUp}
        iconColor="#8b5cf6"
      />

      <MetricCard
        title="Apoio Favorável"
        value={`${favorablePercentage}%`}
        change={favorableCount}
        trend={
          favorablePercentage >= 50
            ? "up"
            : favorablePercentage >= 30
            ? "neutral"
            : "down"
        }
        icon={Target}
        iconColor="#f59e0b"
      />
    </div>
  );
}

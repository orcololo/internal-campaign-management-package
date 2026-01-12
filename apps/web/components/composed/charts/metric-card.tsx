"use client";

import * as React from "react";
import { TrendingUp, TrendingDown, Minus, LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LineChart, Line, ResponsiveContainer } from "recharts";

export interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  trend?: "up" | "down" | "neutral";
  icon?: LucideIcon;
  iconColor?: string;
  sparklineData?: Array<{ value: number }>;
  className?: string;
}

export function MetricCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  iconColor = "hsl(var(--primary))",
  sparklineData,
  className,
}: MetricCardProps) {
  const getTrendIcon = () => {
    if (trend === "up") return TrendingUp;
    if (trend === "down") return TrendingDown;
    return Minus;
  };

  const getTrendColor = () => {
    if (trend === "up") return "text-green-600 dark:text-green-400";
    if (trend === "down") return "text-red-600 dark:text-red-400";
    return "text-muted-foreground";
  };

  const TrendIcon = getTrendIcon();

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              {title}
            </p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
              {change !== undefined && (
                <div
                  className={cn(
                    "flex items-center text-sm font-medium",
                    getTrendColor()
                  )}
                >
                  <TrendIcon className="size-4 mr-1" />
                  <span>{Math.abs(change)}%</span>
                </div>
              )}
            </div>
          </div>
          {Icon && (
            <div
              className="flex size-12 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${iconColor}20` }}
            >
              <Icon className="size-6" style={{ color: iconColor }} />
            </div>
          )}
        </div>

        {sparklineData && sparklineData.length > 0 && (
          <div className="h-16 -mb-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={iconColor}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

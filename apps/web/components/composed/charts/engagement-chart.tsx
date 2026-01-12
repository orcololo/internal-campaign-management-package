"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

interface EngagementChartProps {
  data: Array<{
    date: string;
    whatsapp: number;
    calls: number;
    doorToDoor: number;
    events: number;
  }>;
  className?: string;
}

export function EngagementChart({ data, className }: EngagementChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Engajamento da Campanha</CardTitle>
        <CardDescription>
          Atividades e interações com eleitores ao longo do tempo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="whatsapp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="calls" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="doorToDoor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="events" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Area
              type="monotone"
              dataKey="whatsapp"
              name="WhatsApp"
              stroke="#10b981"
              fillOpacity={1}
              fill="url(#whatsapp)"
            />
            <Area
              type="monotone"
              dataKey="calls"
              name="Ligações"
              stroke="#8b5cf6"
              fillOpacity={1}
              fill="url(#calls)"
            />
            <Area
              type="monotone"
              dataKey="doorToDoor"
              name="Corpo a Corpo"
              stroke="#f59e0b"
              fillOpacity={1}
              fill="url(#doorToDoor)"
            />
            <Area
              type="monotone"
              dataKey="events"
              name="Eventos"
              stroke="#3b82f6"
              fillOpacity={1}
              fill="url(#events)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

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
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface DemographicsData {
  gender: Array<{ name: string; value: number }>;
  age: Array<{ name: string; value: number }>;
  education: Array<{ name: string; value: number }>;
  supportLevel: Array<{ name: string; value: number }>;
}

interface VoterDemographicsProps {
  data: DemographicsData;
  className?: string;
}

const COLORS = [
  "#3b82f6", // Blue
  "#10b981", // Green
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#06b6d4", // Cyan
];

const SUPPORT_COLORS = {
  Alto: "#10b981", // Green
  Médio: "#f59e0b", // Amber
  Baixo: "#ef4444", // Red
  Indefinido: "#6b7280", // Gray
};

export function VoterDemographics({ data, className }: VoterDemographicsProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Demografia dos Eleitores</CardTitle>
        <CardDescription>
          Distribuição demográfica da base de eleitores
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="gender" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="gender">Gênero</TabsTrigger>
            <TabsTrigger value="age">Idade</TabsTrigger>
            <TabsTrigger value="education">Escolaridade</TabsTrigger>
            <TabsTrigger value="support">Apoio</TabsTrigger>
          </TabsList>

          <TabsContent value="gender" className="mt-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.gender}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.gender.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="age" className="mt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.age}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="name"
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
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="education" className="mt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.education} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  type="number"
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={150}
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="support" className="mt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.supportLevel}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="name"
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
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {data.supportLevel.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        SUPPORT_COLORS[
                          entry.name as keyof typeof SUPPORT_COLORS
                        ] || COLORS[0]
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

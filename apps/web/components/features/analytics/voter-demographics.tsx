"use client";

import * as React from "react";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DemographicData } from "@/mock-data/analytics";

interface VoterDemographicsProps {
  data: DemographicData;
}

const SUPPORT_COLORS = {
  high: "#10b981", // Green
  medium: "#f59e0b", // Amber
  low: "#ef4444", // Red
};

const SUPPORT_LABELS = {
  high: "Alto",
  medium: "Médio",
  low: "Baixo",
};

export function VoterDemographics({ data }: VoterDemographicsProps) {
  const supportLevelData = [
    {
      name: SUPPORT_LABELS.high,
      value: data.supportLevel.high,
      color: SUPPORT_COLORS.high,
    },
    {
      name: SUPPORT_LABELS.medium,
      value: data.supportLevel.medium,
      color: SUPPORT_COLORS.medium,
    },
    {
      name: SUPPORT_LABELS.low,
      value: data.supportLevel.low,
      color: SUPPORT_COLORS.low,
    },
  ];

  const contactData = [
    { name: "WhatsApp", value: data.withWhatsapp },
    { name: "Email", value: data.withEmail },
    { name: "Localização", value: data.withLocation },
  ];

  const cityData = data.byCity.slice(0, 5); // Top 5 cities

  return (
    <Card>
      <CardHeader>
        <CardTitle>Demografia dos Eleitores</CardTitle>
        <CardDescription>
          Distribuição e perfil da base de eleitores
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="support">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="support">Apoio</TabsTrigger>
            <TabsTrigger value="age">Idade</TabsTrigger>
            <TabsTrigger value="gender">Gênero</TabsTrigger>
            <TabsTrigger value="contact">Contato</TabsTrigger>
            <TabsTrigger value="location">Cidade</TabsTrigger>
          </TabsList>

          <TabsContent value="support" className="mt-6">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={supportLevelData}
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
                    {supportLevelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              {supportLevelData.map((item) => (
                <div key={item.name} className="space-y-1">
                  <div
                    className="mx-auto size-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-2xl font-bold">{item.value}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="age" className="mt-6">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.byAge}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis
                    dataKey="range"
                    className="text-xs"
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis
                    className="text-xs"
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill="hsl(var(--chart-1))"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="gender" className="mt-6">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.byGender}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ gender, percent }) =>
                      `${gender}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    <Cell fill="#3b82f6" />
                    <Cell fill="#ec4899" />
                    <Cell fill="#8b5cf6" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              {data.byGender.map((item, idx) => (
                <div key={item.gender} className="space-y-1">
                  <div
                    className="mx-auto size-3 rounded-full"
                    style={{
                      backgroundColor:
                        idx === 0
                          ? "#3b82f6"
                          : idx === 1
                          ? "#ec4899"
                          : "#8b5cf6",
                    }}
                  />
                  <p className="text-sm font-medium">{item.gender}</p>
                  <p className="text-2xl font-bold">{item.count}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="contact" className="mt-6">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={contactData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis
                    dataKey="name"
                    className="text-xs"
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis
                    className="text-xs"
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar
                    dataKey="value"
                    fill="hsl(var(--primary))"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              {contactData.map((item) => (
                <div key={item.name} className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {item.name}
                  </p>
                  <p className="text-2xl font-bold">{item.value}</p>
                  <p className="text-xs text-muted-foreground">eleitores</p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="location" className="mt-6">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cityData} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis
                    type="number"
                    className="text-xs"
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis
                    dataKey="city"
                    type="category"
                    className="text-xs"
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill="hsl(var(--chart-2))"
                    radius={[0, 8, 8, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

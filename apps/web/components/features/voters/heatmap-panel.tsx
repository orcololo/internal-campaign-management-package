"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Activity, Users, TrendingUp } from "lucide-react";

interface HeatmapPanelProps {
  votersCount: number;
  votersWithLocationCount: number;
}

export function HeatmapPanel({
  votersCount,
  votersWithLocationCount,
}: HeatmapPanelProps) {
  const [intensity, setIntensity] = useState([50]);
  const [radius, setRadius] = useState([50]);

  const coveragePercentage =
    votersCount > 0
      ? Math.round((votersWithLocationCount / votersCount) * 100)
      : 0;

  return (
    <div className="absolute left-4 top-4 z-20 w-80 space-y-4">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="size-5" />
            Mapa de Calor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Statistics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border bg-muted/50 p-3">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Users className="size-4" />
                <span className="text-xs">Eleitores</span>
              </div>
              <div className="text-2xl font-bold">
                {votersWithLocationCount}
              </div>
            </div>
            <div className="rounded-lg border bg-muted/50 p-3">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <TrendingUp className="size-4" />
                <span className="text-xs">Cobertura</span>
              </div>
              <div className="text-2xl font-bold">{coveragePercentage}%</div>
            </div>
          </div>

          {/* Description */}
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              Visualize a densidade de eleitores por região. Áreas mais quentes
              (vermelho) indicam maior concentração de eleitores.
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-xs">
                Azul: Baixa densidade
              </Badge>
              <Badge variant="outline" className="text-xs">
                Vermelho: Alta densidade
              </Badge>
            </div>
          </div>

          {/* Zoom tip */}
          <div className="rounded-lg border border-dashed bg-muted/30 p-3">
            <p className="text-xs text-muted-foreground">
              💡 <strong>Dica:</strong> Use o zoom para alternar entre
              visualização de calor (zoom baixo) e pontos individuais (zoom
              alto).
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-sm">Legenda de Densidade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-[rgb(178,24,43)]" />
              <span className="text-xs">Muito Alta</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-[rgb(239,138,98)]" />
              <span className="text-xs">Alta</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-[rgb(253,219,199)]" />
              <span className="text-xs">Média</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-[rgb(103,169,207)]" />
              <span className="text-xs">Baixa</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-[rgb(33,102,172)]" />
              <span className="text-xs">Muito Baixa</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

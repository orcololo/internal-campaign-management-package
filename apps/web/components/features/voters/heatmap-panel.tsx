"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Activity, Users, TrendingUp } from "lucide-react";

export type HeatmapMode = "density" | "support" | "engagement";

export interface HeatmapFilters {
  supportLevels: string[];
  showFavorable: boolean;
  showUnfavorable: boolean;
}

interface HeatmapPanelProps {
  votersCount: number;
  votersWithLocationCount: number;
  intensity: number;
  radius: number;
  mode: HeatmapMode;
  filters: HeatmapFilters;
  onIntensityChange: (value: number) => void;
  onRadiusChange: (value: number) => void;
  onModeChange: (value: HeatmapMode) => void;
  onFiltersChange: (filters: HeatmapFilters) => void;
}

const SUPPORT_LEVELS = [
  { id: "MUITO_FAVORAVEL", label: "Muito Favorável", color: "#22c55e" },
  { id: "FAVORAVEL", label: "Favorável", color: "#84cc16" },
  { id: "NEUTRO", label: "Neutro", color: "#f59e0b" },
  { id: "DESFAVORAVEL", label: "Desfavorável", color: "#f97316" },
  { id: "MUITO_DESFAVORAVEL", label: "Muito Desfavorável", color: "#ef4444" },
];

export function HeatmapPanel({
  votersCount,
  votersWithLocationCount,
  intensity,
  radius,
  mode,
  filters,
  onIntensityChange,
  onRadiusChange,
  onModeChange,
  onFiltersChange,
}: HeatmapPanelProps) {
  const coveragePercentage =
    votersCount > 0
      ? Math.round((votersWithLocationCount / votersCount) * 100)
      : 0;

  const handleSupportLevelToggle = (levelId: string) => {
    const currentLevels = filters.supportLevels;
    const newLevels = currentLevels.includes(levelId)
      ? currentLevels.filter((id) => id !== levelId)
      : [...currentLevels, levelId];
    
    onFiltersChange({
      ...filters,
      supportLevels: newLevels,
    });
  };

  return (
    <div className="absolute left-4 top-4 z-20 w-80 space-y-4 max-h-[90vh] overflow-y-auto">
      <Card className="shadow-xl">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="size-5" />
            Mapa de Calor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
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

          {/* Mode Selection */}
          <div className="space-y-2">
            <Label>Modo de Visualização</Label>
            <Select value={mode} onValueChange={(v) => onModeChange(v as HeatmapMode)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o modo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="density">Densidade</SelectItem>
                <SelectItem value="support">Nível de Apoio</SelectItem>
                <SelectItem value="engagement">Engajamento</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            <div className="space-y-2">
                <div className="flex justify-between">
                    <Label>Intensidade</Label>
                    <span className="text-xs text-muted-foreground">{intensity}%</span>
                </div>
                <Slider 
                    value={[intensity]} 
                    min={10} 
                    max={100} 
                    step={5} 
                    onValueChange={([v]) => onIntensityChange(v)} 
                />
            </div>
            
            <div className="space-y-2">
                <div className="flex justify-between">
                    <Label>Raio de Influência</Label>
                    <span className="text-xs text-muted-foreground">{radius}px</span>
                </div>
                <Slider 
                    value={[radius]} 
                    min={10} 
                    max={100} 
                    step={5} 
                    onValueChange={([v]) => onRadiusChange(v)} 
                />
            </div>
          </div>

          {/* Filters */}
          <div className="space-y-3 pt-2 border-t">
            <Label>Filtros de Apoio</Label>
            <div className="space-y-2">
              {SUPPORT_LEVELS.map((level) => (
                <div key={level.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`filter-${level.id}`} 
                    checked={filters.supportLevels.includes(level.id)}
                    onCheckedChange={() => handleSupportLevelToggle(level.id)}
                  />
                  <Label 
                    htmlFor={`filter-${level.id}`} 
                    className="text-sm font-normal flex items-center gap-2"
                  >
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: level.color }} />
                    {level.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-2 pt-2 border-t">
            <Label className="text-xs text-muted-foreground">Legenda</Label>
            {mode === 'density' ? (
              <div className="flex items-center justify-between text-xs">
                  <span>Baixa</span>
                  <div className="h-2 flex-1 mx-2 rounded-full bg-gradient-to-r from-[rgba(33,102,172,0)] via-[rgb(103,169,207)] to-[rgb(178,24,43)]" />
                  <span>Alta</span>
              </div>
            ) : mode === 'support' ? (
              <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500" />Favorável</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500" />Desfavorável</div>
              </div>
            ) : (
               <div className="text-xs text-muted-foreground">Visualização de engajamento</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
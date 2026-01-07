"use client";

import { useState } from "react";
import { VoterMapView } from "@/components/features/voters/voter-map-view";
import { VoterMapsPanel } from "@/components/features/voters/voter-maps-panel";
import { DashboardHeader } from "@/components/dashboard/header";
import { Badge } from "@/components/ui/badge";
import { voters } from "@/mock-data/voters";
import { SupportLevel } from "@/types/voters";

const SUPPORT_LEVEL_COLORS: Record<SupportLevel, string> = {
  high: "#22c55e",
  medium: "#f59e0b",
  low: "#ef4444",
};

const SUPPORT_LEVEL_LABELS: Record<SupportLevel, string> = {
  high: "Alto Apoio",
  medium: "Médio Apoio",
  low: "Baixo Apoio",
};

export default function MapsPage() {
  const [selectedVoterId, setSelectedVoterId] = useState<string | null>(null);

  return (
    <>
      <DashboardHeader />
      <div className="relative h-[calc(100vh-57px)] w-full overflow-hidden">
        <VoterMapView
          voters={voters}
          selectedVoterId={selectedVoterId}
          onVoterSelect={setSelectedVoterId}
        />
        <VoterMapsPanel
          voters={voters}
          selectedVoterId={selectedVoterId}
          onVoterSelect={setSelectedVoterId}
        />

        {/* Legend */}
        <div className="absolute right-4 bottom-4 z-20 bg-background rounded-lg shadow-xl border p-3">
          <h3 className="text-sm font-semibold mb-2">Legenda</h3>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div
                className="size-3 rounded-full"
                style={{ backgroundColor: SUPPORT_LEVEL_COLORS.high }}
              />
              <span className="text-xs">{SUPPORT_LEVEL_LABELS.high}</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="size-3 rounded-full"
                style={{ backgroundColor: SUPPORT_LEVEL_COLORS.medium }}
              />
              <span className="text-xs">{SUPPORT_LEVEL_LABELS.medium}</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="size-3 rounded-full"
                style={{ backgroundColor: SUPPORT_LEVEL_COLORS.low }}
              />
              <span className="text-xs">{SUPPORT_LEVEL_LABELS.low}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-gray-500" />
              <span className="text-xs">Sem classificação</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

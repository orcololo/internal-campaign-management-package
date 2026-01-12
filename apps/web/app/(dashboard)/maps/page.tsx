"use client";

import { useState, useMemo, useEffect } from "react";
import { VoterMapView } from "@/components/features/voters/voter-map-view";
import { VoterMapsPanel } from "@/components/features/voters/voter-maps-panel";
import { GeofenceMapView } from "@/components/features/geofences/geofence-map-view";
import { GeofencePanel } from "@/components/features/geofences/geofence-panel";
import { GeofenceSaveDialog } from "@/components/features/geofences/geofence-save-dialog";
import { Button } from "@/components/ui/button";
import { useVotersStore } from "@/store/voters-store";
import {
  geofences as initialGeofences,
  isPointInPolygon,
} from "@/mock-data/geofences";
import { SupportLevel, Voter } from "@/types/voters";
import { Geofence } from "@/types/geofence";
import { MapPin, Layers } from "lucide-react";
import { toast } from "sonner";

const SUPPORT_LEVEL_COLORS: Record<SupportLevel, string> = {
  MUITO_FAVORAVEL: "#22c55e",
  FAVORAVEL: "#84cc16",
  NEUTRO: "#f59e0b",
  DESFAVORAVEL: "#f97316",
  MUITO_DESFAVORAVEL: "#ef4444",
  NAO_DEFINIDO: "#6b7280",
};

const SUPPORT_LEVEL_LABELS: Record<SupportLevel, string> = {
  MUITO_FAVORAVEL: "Muito Favorável",
  FAVORAVEL: "Favorável",
  NEUTRO: "Neutro",
  DESFAVORAVEL: "Desfavorável",
  MUITO_DESFAVORAVEL: "Muito Desfavorável",
  NAO_DEFINIDO: "Não Definido",
};

export default function MapsPage() {
  const { voters, fetchVoters } = useVotersStore();
  const [selectedVoterId, setSelectedVoterId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"voters" | "geofences">("voters");
  const [geofences, setGeofences] = useState<Geofence[]>(initialGeofences);
  const [selectedGeofenceId, setSelectedGeofenceId] = useState<string | null>(
    null
  );
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnCoordinates, setDrawnCoordinates] = useState<number[][][] | null>(
    null
  );
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  useEffect(() => {
    fetchVoters({ page: 1, perPage: 1000 });
  }, [fetchVoters]);

  // Filter voters by active geofences
  const filteredVoters = useMemo(() => {
    if (viewMode !== "geofences") return voters;

    const activeGeofences = geofences.filter((g) => g.active);
    if (activeGeofences.length === 0) return voters;

    return voters.filter((voter) => {
      if (!voter.latitude || !voter.longitude) return false;

      return activeGeofences.some((geofence) => {
        if (geofence.type === "polygon") {
          return isPointInPolygon(
            [voter.longitude as number, voter.latitude as number],
            geofence.coordinates as number[][][]
          );
        }
        return false;
      });
    });
  }, [geofences, viewMode]);

  const handleGeofenceToggle = (id: string) => {
    setGeofences((prev) =>
      prev.map((g) => (g.id === id ? { ...g, active: !g.active } : g))
    );
  };

  const handleGeofenceDelete = (id: string) => {
    setGeofences((prev) => prev.filter((g) => g.id !== id));
    toast.success("Geofence excluída");
  };

  const handleGeofenceDrawn = (coordinates: number[][][]) => {
    setDrawnCoordinates(coordinates);
    setIsDrawing(false);
    setShowSaveDialog(true);
  };

  const handleSaveGeofence = (data: {
    name: string;
    description?: string;
    color: string;
  }) => {
    if (!drawnCoordinates) return;

    const newGeofence: Geofence = {
      id: String(Date.now()),
      name: data.name,
      description: data.description || "",
      type: "polygon",
      coordinates: drawnCoordinates,
      color: data.color,
      fillOpacity: 0.2,
      strokeOpacity: 0.8,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setGeofences((prev) => [...prev, newGeofence]);
    setDrawnCoordinates(null);
    toast.success(`Geofence "${data.name}" criada com sucesso!`);
  };

  const handleCancelSave = () => {
    setDrawnCoordinates(null);
    setShowSaveDialog(false);
  };

  const handleDrawMode = () => {
    setIsDrawing(!isDrawing);
  };

  return (
    <div className="relative h-[calc(100vh-57px)] w-full overflow-hidden">
      {/* Mode Toggle */}
      <div className="absolute left-1/2 -translate-x-1/2 top-4 z-10 bg-background rounded-lg shadow-xl border p-1 flex gap-1">
        <Button
          variant={viewMode === "voters" ? "default" : "ghost"}
          size="sm"
          onClick={() => setViewMode("voters")}
        >
          <MapPin className="size-4 mr-2" />
          Eleitores
        </Button>
        <Button
          variant={viewMode === "geofences" ? "default" : "ghost"}
          size="sm"
          onClick={() => setViewMode("geofences")}
        >
          <Layers className="size-4 mr-2" />
          Geofences
        </Button>
      </div>

      {/* Voters View */}
      {viewMode === "voters" && (
        <>
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
        </>
      )}

      {/* Geofences View */}
      {viewMode === "geofences" && (
        <>
          <GeofenceMapView
            geofences={geofences}
            voters={voters}
            filteredVoters={filteredVoters}
            onGeofenceDrawn={handleGeofenceDrawn}
            selectedGeofenceId={selectedGeofenceId}
            isDrawing={isDrawing}
            setIsDrawing={setIsDrawing}
            drawnCoordinates={drawnCoordinates}
          />
          <GeofencePanel
            geofences={geofences}
            selectedGeofenceId={selectedGeofenceId}
            onGeofenceSelect={setSelectedGeofenceId}
            onGeofenceToggle={handleGeofenceToggle}
            onGeofenceDelete={handleGeofenceDelete}
            onDrawMode={handleDrawMode}
            isDrawing={isDrawing}
            filteredVotersCount={filteredVoters.length}
          />
        </>
      )}

      {/* Legend - Only in voters view */}
      {viewMode === "voters" && (
        <div className="absolute right-4 bottom-4 z-20 bg-background rounded-lg shadow-xl border p-3">
          <h3 className="text-sm font-semibold mb-2">Legenda</h3>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div
                className="size-3 rounded-full"
                style={{
                  backgroundColor: SUPPORT_LEVEL_COLORS.MUITO_FAVORAVEL,
                }}
              />
              <span className="text-xs">
                {SUPPORT_LEVEL_LABELS.MUITO_FAVORAVEL}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="size-3 rounded-full"
                style={{ backgroundColor: SUPPORT_LEVEL_COLORS.FAVORAVEL }}
              />
              <span className="text-xs">{SUPPORT_LEVEL_LABELS.FAVORAVEL}</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="size-3 rounded-full"
                style={{ backgroundColor: SUPPORT_LEVEL_COLORS.NEUTRO }}
              />
              <span className="text-xs">{SUPPORT_LEVEL_LABELS.NEUTRO}</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="size-3 rounded-full"
                style={{ backgroundColor: SUPPORT_LEVEL_COLORS.DESFAVORAVEL }}
              />
              <span className="text-xs">
                {SUPPORT_LEVEL_LABELS.DESFAVORAVEL}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="size-3 rounded-full"
                style={{
                  backgroundColor: SUPPORT_LEVEL_COLORS.MUITO_DESFAVORAVEL,
                }}
              />
              <span className="text-xs">
                {SUPPORT_LEVEL_LABELS.MUITO_DESFAVORAVEL}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="size-3 rounded-full"
                style={{ backgroundColor: SUPPORT_LEVEL_COLORS.NAO_DEFINIDO }}
              />
              <span className="text-xs">
                {SUPPORT_LEVEL_LABELS.NAO_DEFINIDO}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Geofence stats - Only in geofences view */}
      {viewMode === "geofences" && (
        <div className="absolute right-4 bottom-4 z-20 bg-background rounded-lg shadow-xl border p-3">
          <h3 className="text-sm font-semibold mb-2">Estatísticas</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center gap-4">
              <span className="text-xs text-muted-foreground">
                Eleitores filtrados:
              </span>
              <span className="text-sm font-bold">{filteredVoters.length}</span>
            </div>
            <div className="flex justify-between items-center gap-4">
              <span className="text-xs text-muted-foreground">
                Total de eleitores:
              </span>
              <span className="text-sm font-bold">{voters.length}</span>
            </div>
            <div className="flex justify-between items-center gap-4">
              <span className="text-xs text-muted-foreground">
                % Cobertura:
              </span>
              <span className="text-sm font-bold">
                {((filteredVoters.length / voters.length) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Geofence Save Dialog */}
      <GeofenceSaveDialog
        open={showSaveDialog}
        onOpenChange={(open) => {
          setShowSaveDialog(open);
          if (!open) handleCancelSave();
        }}
        onSave={handleSaveGeofence}
        defaultName={`Geofence ${geofences.length + 1}`}
      />
    </div>
  );
}

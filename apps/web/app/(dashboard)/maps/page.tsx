"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { VoterMapView } from "@/components/features/voters/voter-map-view";
import { VoterMapsPanel } from "@/components/features/voters/voter-maps-panel";
import { VoterHeatmapView } from "@/components/features/voters/voter-heatmap-view";
import { HeatmapPanel, HeatmapMode, HeatmapFilters } from "@/components/features/voters/heatmap-panel";
import { GeofenceMapView } from "@/components/features/geofences/geofence-map-view";
import { GeofencePanel } from "@/components/features/geofences/geofence-panel";
import { GeofenceSaveDialog } from "@/components/features/geofences/geofence-save-dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { showToast } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { SupportLevel } from "@/types/voters";
import { Geofence } from "@/types/geofence";
import { useVotersStore } from "@/store/voters-store";
import { geofencesApi } from "@/lib/api/geofences";
import { isPointInPolygon } from "@/lib/geo-utils";
import { MapPin, Activity, Layers } from "lucide-react";

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

function transformGeofence(backendGeofence: any): Geofence {
  // Backend stores as {lat, lng} array, frontend expects number[][][]
  let coordinates: number[][][] = [];

  if (backendGeofence.type === 'POLYGON' && backendGeofence.polygon) {
    // Convert [{lat, lng}, ...] to [[[lng, lat], ...]]
    // Backend stores {lat, lng}. GeoJSON needs [lng, lat].
    const ring = backendGeofence.polygon.map((p: any) => [parseFloat(p.lng), parseFloat(p.lat)]);
    // Close the polygon by repeating first point if not closed
    if (ring.length > 0) {
        const first = ring[0];
        const last = ring[ring.length - 1];
        if (first[0] !== last[0] || first[1] !== last[1]) {
            ring.push(first);
        }
    }
    coordinates = [ring];
  }

  return {
    id: backendGeofence.id,
    name: backendGeofence.name,
    description: backendGeofence.description || "",
    type: backendGeofence.type?.toLowerCase() || "polygon",
    coordinates,
    radius: backendGeofence.radiusKm ? backendGeofence.radiusKm * 1000 : undefined,
    color: backendGeofence.color || "#3b82f6",
    fillOpacity: 0.2,
    strokeOpacity: 0.8,
    active: !backendGeofence.deletedAt,
    createdAt: new Date(backendGeofence.createdAt),
    updatedAt: new Date(backendGeofence.updatedAt),
  };
}

export default function MapsPage() {
  const { voters, fetchVoters } = useVotersStore();
  const [selectedVoterId, setSelectedVoterId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"voters" | "geofences" | "heatmap">(
    "voters"
  );
  const [geofences, setGeofences] = useState<Geofence[]>([]);
  const [isLoadingGeofences, setIsLoadingGeofences] = useState(true);
  const [selectedGeofenceId, setSelectedGeofenceId] = useState<string | null>(
    null
  );
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnCoordinates, setDrawnCoordinates] = useState<number[][][] | null>(
    null
  );
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  
  // Delete confirmation
  const [geofenceToDelete, setGeofenceToDelete] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Heatmap settings
  const [heatmapIntensity, setHeatmapIntensity] = useState(50);
  const [heatmapRadius, setHeatmapRadius] = useState(30);
  const [heatmapMode, setHeatmapMode] = useState<HeatmapMode>('density');
  const [heatmapFilters, setHeatmapFilters] = useState<HeatmapFilters>({
    supportLevels: [],
    showFavorable: true,
    showUnfavorable: true
  });

  useEffect(() => {
    const loadVoters = async () => {
      console.log("[Maps] Fetching voters for map...");
      // Fetch up to 1000 voters for map display
      await fetchVoters({ page: 1, perPage: 1000 });
      console.log("[Maps] Voters loaded:", voters.length);
    };
    loadVoters();
  }, [fetchVoters]);

  useEffect(() => {
    const loadGeofences = async () => {
      try {
        setIsLoadingGeofences(true);
        const data = await geofencesApi.getAll();
        setGeofences(data.map(transformGeofence));
      } catch (error) {
        console.error("Failed to load geofences:", error);
        showToast.error("Erro ao carregar geofences");
      } finally {
        setIsLoadingGeofences(false);
      }
    };
    loadGeofences();
  }, []);

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
  }, [geofences, voters, viewMode]);

  const handleGeofenceToggle = async (id: string) => {
    try {
      const updated = await geofencesApi.toggleActive(id);
      setGeofences((prev) =>
        prev.map((g) => (g.id === id ? transformGeofence(updated) : g))
      );
    } catch (error) {
      console.error("Failed to toggle geofence:", error);
      showToast.error("Erro ao alterar status da geofence");
    }
  };

  const handleGeofenceDeleteRequest = (id: string) => {
    setGeofenceToDelete(id);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!geofenceToDelete) return;
    
    try {
      await geofencesApi.delete(geofenceToDelete);
      setGeofences((prev) => prev.filter((g) => g.id !== geofenceToDelete));
      showToast.success("Geofence excluída");
    } catch (error) {
      console.error("Failed to delete geofence:", error);
      showToast.error("Erro ao excluir geofence");
    } finally {
      setShowDeleteDialog(false);
      setGeofenceToDelete(null);
    }
  };

  const handleGeofenceDrawn = (coordinates: number[][][]) => {
    setDrawnCoordinates(coordinates);
    setIsDrawing(false);
    setShowSaveDialog(true);
  };

  const handleSaveGeofence = async (data: {
    name: string;
    description?: string;
    color: string;
  }) => {
    if (!drawnCoordinates) return;

    try {
      const newGeofence = await geofencesApi.create({
        name: data.name,
        description: data.description,
        type: "polygon",
        coordinates: drawnCoordinates,
        color: data.color,
      });

      setGeofences((prev) => [...prev, transformGeofence(newGeofence)]);
      setDrawnCoordinates(null);
      showToast.success(`Geofence "${data.name}" criada com sucesso!`);
    } catch (error) {
      console.error("Failed to save geofence:", error);
      showToast.error("Erro ao salvar geofence");
    }
  };

  const handleCancelSave = () => {
    setDrawnCoordinates(null);
    setShowSaveDialog(false);
  };

  const handleDrawMode = () => {
    setIsDrawing(!isDrawing);
  };

  const handleKeyboardSave = useCallback((e: KeyboardEvent) => {
    // Check for Ctrl+S or Cmd+S
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();
      
      // If we have drawn coordinates and dialog is not open, open it
      if (drawnCoordinates && !showSaveDialog) {
        setShowSaveDialog(true);
      }
    }
    
    // Escape to cancel drawing
    if (e.key === "Escape") {
      if (isDrawing) {
        setIsDrawing(false);
        setDrawnCoordinates(null);
      }
      if (showSaveDialog) {
        setShowSaveDialog(false);
        setDrawnCoordinates(null);
      }
    }
    
    // D to start drawing (when not in input)
    if (e.key === "d" && !isDrawing && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
      setIsDrawing(true);
    }
  }, [drawnCoordinates, showSaveDialog, isDrawing]);
  
  useEffect(() => {
    window.addEventListener("keydown", handleKeyboardSave);
    return () => window.removeEventListener("keydown", handleKeyboardSave);
  }, [handleKeyboardSave]);

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
          variant={viewMode === "heatmap" ? "default" : "ghost"}
          size="sm"
          onClick={() => setViewMode("heatmap")}
        >
          <Activity className="size-4 mr-2" />
          Mapa de Calor
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

      {/* Heatmap View */}
      {viewMode === "heatmap" && (
        <>
          <VoterHeatmapView 
            voters={voters} 
            intensity={heatmapIntensity}
            radius={heatmapRadius}
            mode={heatmapMode}
            filters={heatmapFilters}
          />
          <HeatmapPanel
            votersCount={voters.length}
            votersWithLocationCount={
              voters.filter((v) => v.latitude && v.longitude).length
            }
            intensity={heatmapIntensity}
            radius={heatmapRadius}
            mode={heatmapMode}
            filters={heatmapFilters}
            onIntensityChange={setHeatmapIntensity}
            onRadiusChange={setHeatmapRadius}
            onModeChange={setHeatmapMode}
            onFiltersChange={setHeatmapFilters}
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
            onGeofenceDelete={handleGeofenceDeleteRequest}
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
                {voters.length > 0 ? ((filteredVoters.length / voters.length) * 100).toFixed(1) : 0}%
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

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Excluir Geofence"
        description="Tem certeza? Esta ação não pode ser desfeita e os eleitores serão desvinculados."
        onConfirm={handleConfirmDelete}
        variant="destructive"
        confirmText="Excluir"
      />
    </div>
  );
}
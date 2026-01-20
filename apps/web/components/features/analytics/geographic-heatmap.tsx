"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { useVotersStore } from "@/store/voters-store";
import { useTheme } from "next-themes";

const MACAPA_CENTER = {
  lat: 0.0349,
  lng: -51.0694,
  zoom: 12,
};

const NEIGHBORHOOD_COLORS = [
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#84cc16",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#6366f1",
  "#a855f7",
  "#ec4899",
];

interface NeighborhoodStats {
  name: string;
  count: number;
  center: { lat: number; lng: number };
  color: string;
}

export function GeographicHeatmap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const { voters, fetchVoters } = useVotersStore();
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    fetchVoters({ page: 1, perPage: 1000 });
  }, [fetchVoters]);

  // Calculate neighborhood stats from voters
  const neighborhoodStats = useMemo(() => {
    const stats: Record<string, { count: number; latSum: number; lngSum: number }> = {};
    
    voters.forEach(voter => {
      if (!voter.neighborhood || !voter.latitude || !voter.longitude) return;
      
      if (!stats[voter.neighborhood]) {
        stats[voter.neighborhood] = { count: 0, latSum: 0, lngSum: 0 };
      }
      
      stats[voter.neighborhood].count++;
      stats[voter.neighborhood].latSum += Number(voter.latitude);
      stats[voter.neighborhood].lngSum += Number(voter.longitude);
    });

    return Object.entries(stats)
      .map(([name, data], index) => ({
        name,
        count: data.count,
        center: {
          lat: data.latSum / data.count,
          lng: data.lngSum / data.count,
        },
        color: NEIGHBORHOOD_COLORS[index % NEIGHBORHOOD_COLORS.length],
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 neighborhoods
  }, [voters]);

  const totalVoters = voters.length;
  const averagePerNeighborhood = neighborhoodStats.length > 0 
    ? Math.round(totalVoters / neighborhoodStats.length) 
    : 0;

  const voterPointsGeoJSON = useMemo(() => ({
    type: "FeatureCollection",
    features: voters
      .filter(v => v.latitude && v.longitude)
      .map(v => ({
        type: "Feature",
        properties: {
          weight: 1, // simplified weight
        },
        geometry: {
          type: "Point",
          coordinates: [Number(v.longitude), Number(v.latitude)],
        },
      })),
  }), [voters]);

  const mapStyle = resolvedTheme === "dark" 
    ? "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
    : "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center: [MACAPA_CENTER.lng, MACAPA_CENTER.lat],
      zoom: MACAPA_CENTER.zoom,
      attributionControl: false,
    });

    // Add navigation controls
    map.current.addControl(new maplibregl.NavigationControl(), "top-right");

    // Wait for map to load
    map.current.on("load", () => {
      if (!map.current) return;
      setMapLoaded(true);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update map style
  useEffect(() => {
    if (map.current) {
      map.current.setStyle(mapStyle);
    }
  }, [mapStyle]);

  // Update data layers
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const updateLayers = () => {
      const mapInstance = map.current!;

      if (mapInstance.getSource("voters")) {
        (mapInstance.getSource("voters") as maplibregl.GeoJSONSource).setData(voterPointsGeoJSON as any);
      } else {
        mapInstance.addSource("voters", {
          type: "geojson",
          data: voterPointsGeoJSON as any,
        });

        // Add heatmap layer
        mapInstance.addLayer({
          id: "voters-heat",
          type: "heatmap",
          source: "voters",
          maxzoom: 15,
          paint: {
            // Increase weight as zoom level increases
            "heatmap-weight": [
              "interpolate",
              ["linear"],
              ["get", "weight"],
              0,
              0,
              10,
              1,
            ],
            // Increase intensity as zoom level increases
            "heatmap-intensity": [
              "interpolate",
              ["linear"],
              ["zoom"],
              0,
              1,
              15,
              3,
            ],
            // Color ramp for heatmap (blue -> cyan -> green -> yellow -> red)
            "heatmap-color": [
              "interpolate",
              ["linear"],
              ["heatmap-density"],
              0,
              "rgba(33, 102, 172, 0)",
              0.2,
              "rgb(103, 169, 207)",
              0.4,
              "rgb(209, 229, 240)",
              0.6,
              "rgb(253, 219, 199)",
              0.8,
              "rgb(239, 138, 98)",
              1,
              "rgb(178, 24, 43)",
            ],
            // Adjust radius based on zoom level
            "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 2, 15, 20],
            // Transition from heatmap to circle layer
            "heatmap-opacity": ["interpolate", ["linear"], ["zoom"], 7, 1, 15, 0],
          },
        });

        // Add circle layer for individual points at high zoom
        mapInstance.addLayer({
          id: "voters-point",
          type: "circle",
          source: "voters",
          minzoom: 13,
          paint: {
            "circle-radius": ["interpolate", ["linear"], ["zoom"], 13, 3, 15, 6],
            "circle-color": "#3b82f6",
            "circle-stroke-color": "white",
            "circle-stroke-width": 1,
            "circle-opacity": ["interpolate", ["linear"], ["zoom"], 13, 0, 15, 1],
          },
        });
      }

      // Update markers
      // Clear existing markers (not easy without tracking them, but for now we re-create)
      // A proper implementation would track markers in a ref array
    };

    updateLayers();

  }, [mapLoaded, voterPointsGeoJSON]);

  // Manage markers separately to avoid flickering
  const markersRef = useRef<maplibregl.Marker[]>([]);
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    neighborhoodStats.forEach((neighborhood) => {
        if (!map.current) return;

        const marker = new maplibregl.Marker({ color: neighborhood.color })
          .setLngLat([neighborhood.center.lng, neighborhood.center.lat])
          .setPopup(
            new maplibregl.Popup({ offset: 25 }).setHTML(
              `<div class="p-2">
                <h3 class="font-semibold">${neighborhood.name}</h3>
                <p class="text-sm">${neighborhood.count} eleitores</p>
              </div>`
            )
          )
          .addTo(map.current);
        
        markersRef.current.push(marker);
      });

  }, [neighborhoodStats, mapLoaded]);


  const handleZoomIn = () => {
    map.current?.zoomIn();
  };

  const handleZoomOut = () => {
    map.current?.zoomOut();
  };

  const handleResetView = () => {
    map.current?.flyTo({
      center: [MACAPA_CENTER.lng, MACAPA_CENTER.lat],
      zoom: MACAPA_CENTER.zoom,
      duration: 1000,
    });
  };

  const handleFocusNeighborhood = (neighborhood: NeighborhoodStats) => {
    map.current?.flyTo({
      center: [neighborhood.center.lng, neighborhood.center.lat],
      zoom: 14,
      duration: 1500,
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Distribuição Geográfica</CardTitle>
            <CardDescription>
              Mapa de calor de eleitores em Macapá
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={handleZoomIn}>
              <ZoomIn className="size-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleZoomOut}>
              <ZoomOut className="size-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleResetView}>
              <Maximize2 className="size-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-4 rounded-lg border p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Bairros Identificados</p>
              <p className="text-2xl font-bold">{neighborhoodStats.length}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Eleitores</p>
              <p className="text-2xl font-bold">{totalVoters}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Média por Bairro</p>
              <p className="text-2xl font-bold">{averagePerNeighborhood}</p>
            </div>
          </div>

          {/* Map container */}
          <div className="relative">
            <div
              ref={mapContainer}
              className="h-[500px] w-full rounded-lg border overflow-hidden"
            />
            {!mapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
                <p className="text-sm text-muted-foreground">
                  Carregando mapa...
                </p>
              </div>
            )}
          </div>

          {/* Neighborhood list */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Principais bairros (clique para focar)</h4>
            <div className="grid grid-cols-2 gap-2">
              {neighborhoodStats.map((neighborhood) => (
                  <button
                    key={neighborhood.name}
                    onClick={() => handleFocusNeighborhood(neighborhood)}
                    className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent transition-colors text-left"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin
                        className="size-4"
                        style={{ color: neighborhood.color }}
                      />
                      <span className="text-sm font-medium">
                        {neighborhood.name}
                      </span>
                    </div>
                    <Badge variant="secondary">{neighborhood.count}</Badge>
                  </button>
                ))}
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-2 rounded-lg border p-4">
            <h4 className="text-sm font-medium">Legenda do Mapa de Calor</h4>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-4 w-8 rounded bg-gradient-to-r from-blue-500 to-cyan-400" />
                <span className="text-xs text-muted-foreground">
                  Baixa densidade
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-8 rounded bg-gradient-to-r from-yellow-400 to-orange-500" />
                <span className="text-xs text-muted-foreground">
                  Média densidade
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-8 rounded bg-gradient-to-r from-orange-500 to-red-600" />
                <span className="text-xs text-muted-foreground">
                  Alta densidade
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

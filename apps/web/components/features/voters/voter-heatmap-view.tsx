"use client";

import * as React from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useTheme } from "next-themes";
import { Voter } from "@/types/voters";
import { HeatmapMode, HeatmapFilters } from "./heatmap-panel";

const MAP_STYLES = {
  light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
};

interface VoterHeatmapViewProps {
  voters: Voter[];
  center?: { lat: number; lng: number };
  zoom?: number;
  intensity?: number;
  radius?: number;
  mode?: HeatmapMode;
  filters?: HeatmapFilters;
}

export function VoterHeatmapView({
  voters,
  center = { lat: 0.0349, lng: -51.0694 }, // Macapá, Amapá
  zoom = 12,
  intensity = 50,
  radius = 30,
  mode = "density",
  filters,
}: VoterHeatmapViewProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const mapRef = React.useRef<maplibregl.Map | null>(null);
  const { resolvedTheme } = useTheme();

  const getMapStyleUrl = React.useCallback(() => {
    return resolvedTheme === "dark" ? MAP_STYLES.dark : MAP_STYLES.light;
  }, [resolvedTheme]);

  // Update heatmap properties
  React.useEffect(() => {
    if (!mapRef.current || !mapRef.current.getLayer("voters-heat")) return;

    // Intensity multiplier
    const intensityVal = intensity / 50; // 0.2 to 2.0

    // Adjust visibility and properties based on mode
    if (mode === 'density') {
      mapRef.current.setLayoutProperty("voters-heat", "visibility", "visible");
      
      mapRef.current.setPaintProperty(
          "voters-heat",
          "heatmap-intensity",
          ["interpolate", ["linear"], ["zoom"], 0, intensityVal, 15, intensityVal * 3]
      );
      mapRef.current.setPaintProperty(
          "voters-heat",
          "heatmap-radius",
          ["interpolate", ["linear"], ["zoom"], 0, 2, 15, radius]
      );
    } else {
      mapRef.current.setLayoutProperty("voters-heat", "visibility", "none");
    }

    // Point layer configuration
    if (mapRef.current.getLayer("voters-point")) {
      // In support mode, always show points. In density mode, show points only at high zoom
      const minZoom = mode === 'density' ? 12 : 3;
      mapRef.current.setLayerZoomRange("voters-point", minZoom, 24);
      
      if (mode === 'support') {
        mapRef.current.setPaintProperty("voters-point", "circle-color", [
          "match",
          ["get", "supportLevel"],
          "MUITO_FAVORAVEL", "#22c55e",
          "FAVORAVEL", "#84cc16",
          "NEUTRO", "#f59e0b",
          "DESFAVORAVEL", "#f97316",
          "MUITO_DESFAVORAVEL", "#ef4444",
          "#6b7280" // default
        ]);
        mapRef.current.setPaintProperty("voters-point", "circle-radius", [
          "interpolate", ["linear"], ["zoom"], 10, 3, 15, 6
        ]);
        mapRef.current.setPaintProperty("voters-point", "circle-opacity", 0.8);
      } else {
        // Density mode colors (matching heatmap)
        mapRef.current.setPaintProperty("voters-point", "circle-color", [
          "interpolate",
          ["linear"],
          ["heatmap-density"],
          0, "rgba(33,102,172,0)",
          0.2, "rgb(103,169,207)",
          0.4, "rgb(209,229,240)",
          0.6, "rgb(253,219,199)",
          0.8, "rgb(239,138,98)",
          1, "rgb(178,24,43)"
        ]);
        mapRef.current.setPaintProperty("voters-point", "circle-radius", [
          "interpolate", ["linear"], ["zoom"], 12, 5, 22, 20
        ]);
      }
    }

  }, [intensity, radius, mode]);

  const votersWithLocation = React.useMemo(() => {
    let filtered = voters.filter((v) => v.latitude && v.longitude);
    
    // Apply filters
    if (filters) {
      if (filters.supportLevels.length > 0) {
        filtered = filtered.filter(v => 
          filters.supportLevels.includes(v.supportLevel || 'NAO_DEFINIDO')
        );
      }
    }

    console.log(
      "[VoterHeatmapView] Total voters:",
      voters.length,
      "With location:",
      filtered.length
    );
    return filtered;
  }, [voters, filters]);

  // Initialize map
  React.useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: getMapStyleUrl(),
      center: [center.lng, center.lat],
      zoom: zoom,
      minZoom: 3,
      maxZoom: 18,
      attributionControl: false,
    });

    map.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      "bottom-right"
    );

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update map style when theme changes
  React.useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setStyle(getMapStyleUrl());
  }, [resolvedTheme, getMapStyleUrl]);

  // Add heatmap layer
  React.useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    const onMapLoad = () => {
      // Create GeoJSON data for heatmap
      const geojsonData: GeoJSON.FeatureCollection = {
        type: "FeatureCollection",
        features: votersWithLocation.map((voter) => ({
          type: "Feature",
          properties: {
            id: voter.id,
            name: voter.name,
            supportLevel: voter.supportLevel,
          },
          geometry: {
            type: "Point",
            coordinates: [
              Number(voter.longitude),
              Number(voter.latitude),
            ],
          },
        })),
      };

      // Remove existing source and layer if they exist
      if (map.getLayer("voters-heat")) map.removeLayer("voters-heat");
      if (map.getLayer("voters-point")) map.removeLayer("voters-point");
      if (map.getSource("voters")) map.removeSource("voters");

      // Add source
      map.addSource("voters", {
        type: "geojson",
        data: geojsonData,
      });

      // Add heatmap layer (default visible)
      map.addLayer({
        id: "voters-heat",
        type: "heatmap",
        source: "voters",
        maxzoom: 15,
        layout: {
          visibility: mode === 'density' ? 'visible' : 'none'
        },
        paint: {
          "heatmap-weight": [
            "interpolate",
            ["linear"],
            ["get", "mag"],
            0, 0,
            6, 1,
          ],
          "heatmap-intensity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            0, 1,
            15, 3,
          ],
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0, "rgba(33,102,172,0)",
            0.2, "rgb(103,169,207)",
            0.4, "rgb(209,229,240)",
            0.6, "rgb(253,219,199)",
            0.8, "rgb(239,138,98)",
            1, "rgb(178,24,43)",
          ],
          "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 2, 15, 20],
          "heatmap-opacity": ["interpolate", ["linear"], ["zoom"], 7, 1, 15, 0],
        },
      });

      // Add circle layer
      map.addLayer({
        id: "voters-point",
        type: "circle",
        source: "voters",
        minzoom: mode === 'density' ? 12 : 3,
        paint: {
          "circle-radius": ["interpolate", ["linear"], ["zoom"], 12, 5, 22, 20],
          "circle-color": mode === 'support' ? [
             "match",
            ["get", "supportLevel"],
            "MUITO_FAVORAVEL", "#22c55e",
            "FAVORAVEL", "#84cc16",
            "NEUTRO", "#f59e0b",
            "DESFAVORAVEL", "#f97316",
            "MUITO_DESFAVORAVEL", "#ef4444",
            "#6b7280"
          ] : [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0, "rgba(33,102,172,0)",
            0.2, "rgb(103,169,207)",
            0.4, "rgb(209,229,240)",
            0.6, "rgb(253,219,199)",
            0.8, "rgb(239,138,98)",
            1, "rgb(178,24,43)",
          ],
          "circle-stroke-color": "white",
          "circle-stroke-width": 1,
          "circle-opacity": mode === 'support' ? 0.8 : [
            "interpolate",
            ["linear"],
            ["zoom"],
            12, 0,
            15, 0.8,
          ],
        },
      });
    };

    if (map.loaded()) {
      onMapLoad();
    } else {
      map.on("load", onMapLoad);
    }

  }, [votersWithLocation, mode]); // Re-run when voters change or mode changes

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}

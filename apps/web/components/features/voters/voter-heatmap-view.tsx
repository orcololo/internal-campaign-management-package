"use client";

import * as React from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useTheme } from "next-themes";
import { Voter } from "@/types/voters";

const MAP_STYLES = {
  light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
};

interface VoterHeatmapViewProps {
  voters: Voter[];
  center?: { lat: number; lng: number };
  zoom?: number;
}

export function VoterHeatmapView({
  voters,
  center = { lat: 0.0349, lng: -51.0694 }, // Macapá, Amapá
  zoom = 12,
}: VoterHeatmapViewProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const mapRef = React.useRef<maplibregl.Map | null>(null);
  const { resolvedTheme } = useTheme();

  const getMapStyleUrl = React.useCallback(() => {
    return resolvedTheme === "dark" ? MAP_STYLES.dark : MAP_STYLES.light;
  }, [resolvedTheme]);

  const votersWithLocation = React.useMemo(() => {
    const filtered = voters.filter((v) => v.latitude && v.longitude);
    console.log(
      "[VoterHeatmapView] Total voters:",
      voters.length,
      "With location:",
      filtered.length
    );
    return filtered;
  }, [voters]);

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
    if (!mapRef.current || votersWithLocation.length === 0) return;

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
            coordinates: [voter.longitude as number, voter.latitude as number],
          },
        })),
      };

      // Remove existing source and layer if they exist
      if (map.getLayer("voters-heat")) {
        map.removeLayer("voters-heat");
      }
      if (map.getSource("voters")) {
        map.removeSource("voters");
      }

      // Add source
      map.addSource("voters", {
        type: "geojson",
        data: geojsonData,
      });

      // Add heatmap layer
      map.addLayer({
        id: "voters-heat",
        type: "heatmap",
        source: "voters",
        maxzoom: 15,
        paint: {
          // Increase the heatmap weight based on frequency and property magnitude
          "heatmap-weight": [
            "interpolate",
            ["linear"],
            ["get", "mag"],
            0,
            0,
            6,
            1,
          ],
          // Increase the heatmap color weight by zoom level
          // heatmap-intensity is a multiplier on top of heatmap-weight
          "heatmap-intensity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            0,
            1,
            15,
            3,
          ],
          // Color ramp for heatmap
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0,
            "rgba(33,102,172,0)",
            0.2,
            "rgb(103,169,207)",
            0.4,
            "rgb(209,229,240)",
            0.6,
            "rgb(253,219,199)",
            0.8,
            "rgb(239,138,98)",
            1,
            "rgb(178,24,43)",
          ],
          // Adjust the heatmap radius by zoom level
          "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 2, 15, 20],
          // Transition from heatmap to circle layer by zoom level
          "heatmap-opacity": ["interpolate", ["linear"], ["zoom"], 7, 1, 15, 0],
        },
      });

      // Add circle layer for higher zoom levels
      map.addLayer({
        id: "voters-point",
        type: "circle",
        source: "voters",
        minzoom: 12,
        paint: {
          "circle-radius": ["interpolate", ["linear"], ["zoom"], 12, 5, 22, 20],
          "circle-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0,
            "rgba(33,102,172,0)",
            0.2,
            "rgb(103,169,207)",
            0.4,
            "rgb(209,229,240)",
            0.6,
            "rgb(253,219,199)",
            0.8,
            "rgb(239,138,98)",
            1,
            "rgb(178,24,43)",
          ],
          "circle-stroke-color": "white",
          "circle-stroke-width": 1,
          "circle-opacity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            12,
            0,
            15,
            0.8,
          ],
        },
      });
    };

    if (map.loaded()) {
      onMapLoad();
    } else {
      map.on("load", onMapLoad);
    }

    return () => {
      // Check if map still exists and has a valid style before cleanup
      if (!map || !map.getStyle()) return;

      try {
        if (map.getLayer("voters-heat")) {
          map.removeLayer("voters-heat");
        }
        if (map.getLayer("voters-point")) {
          map.removeLayer("voters-point");
        }
        if (map.getSource("voters")) {
          map.removeSource("voters");
        }
      } catch (error) {
        // Silently handle cleanup errors (map may already be destroyed)
        console.debug("[VoterHeatmapView] Cleanup skipped:", error);
      }
    };
  }, [votersWithLocation]);

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}

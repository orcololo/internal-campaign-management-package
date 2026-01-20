"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import "maplibre-gl/dist/maplibre-gl.css";
import { Geofence } from "@/types/geofence";
import { Voter } from "@/types/voters";
import { useRouter } from "next/navigation";

interface GeofenceMapViewProps {
  geofences: Geofence[];
  voters: Voter[];
  filteredVoters: Voter[];
  onGeofenceDrawn: (coordinates: number[][][]) => void;
  selectedGeofenceId: string | null;
  isDrawing: boolean;
  setIsDrawing: (value: boolean) => void;
  drawnCoordinates: number[][][] | null;
}

export function GeofenceMapView({
  geofences,
  voters,
  filteredVoters,
  onGeofenceDrawn,
  selectedGeofenceId,
  isDrawing,
  setIsDrawing,
  drawnCoordinates,
}: GeofenceMapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const draw = useRef<MapboxDraw | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "&copy; OpenStreetMap contributors",
          },
        },
        layers: [
          {
            id: "osm",
            type: "raster",
            source: "osm",
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
      center: [-51.0665, 0.0345],
      zoom: 12,
    });

    // Add navigation controls
    map.current.addControl(new maplibregl.NavigationControl(), "top-right");

    // Initialize draw control
    draw.current = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
      defaultMode: "simple_select",
      styles: [
        {
          id: "gl-draw-polygon-fill-inactive",
          type: "fill",
          filter: [
            "all",
            ["==", "active", "false"],
            ["==", "$type", "Polygon"],
          ],
          paint: {
            "fill-color": "#3b82f6",
            "fill-outline-color": "#3b82f6",
            "fill-opacity": 0.1,
          },
        },
        {
          id: "gl-draw-polygon-fill-active",
          type: "fill",
          filter: ["all", ["==", "active", "true"], ["==", "$type", "Polygon"]],
          paint: {
            "fill-color": "#3b82f6",
            "fill-outline-color": "#3b82f6",
            "fill-opacity": 0.1,
          },
        },
        {
          id: "gl-draw-polygon-stroke-inactive",
          type: "line",
          filter: [
            "all",
            ["==", "active", "false"],
            ["==", "$type", "Polygon"],
          ],
          layout: {
            "line-cap": "round",
            "line-join": "round",
          },
          paint: {
            "line-color": "#3b82f6",
            "line-width": 2,
          },
        },
        {
          id: "gl-draw-polygon-stroke-active",
          type: "line",
          filter: ["all", ["==", "active", "true"], ["==", "$type", "Polygon"]],
          layout: {
            "line-cap": "round",
            "line-join": "round",
          },
          paint: {
            "line-color": "#3b82f6",
            "line-width": 2,
          },
        },
        {
          id: "gl-draw-line-inactive",
          type: "line",
          filter: [
            "all",
            ["==", "active", "false"],
            ["==", "$type", "LineString"],
          ],
          layout: {
            "line-cap": "round",
            "line-join": "round",
          },
          paint: {
            "line-color": "#3b82f6",
            "line-width": 2,
          },
        },
        {
          id: "gl-draw-line-active",
          type: "line",
          filter: [
            "all",
            ["==", "active", "true"],
            ["==", "$type", "LineString"],
          ],
          layout: {
            "line-cap": "round",
            "line-join": "round",
          },
          paint: {
            "line-color": "#3b82f6",
            "line-width": 2,
          },
        },
        {
          id: "gl-draw-polygon-and-line-vertex-inactive",
          type: "circle",
          filter: ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"]],
          paint: {
            "circle-radius": 5,
            "circle-color": "#fff",
          },
        },
        {
          id: "gl-draw-polygon-and-line-vertex-active",
          type: "circle",
          filter: ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"]],
          paint: {
            "circle-radius": 7,
            "circle-color": "#3b82f6",
          },
        },
        {
          id: "gl-draw-point-inactive",
          type: "circle",
          filter: ["all", ["==", "active", "false"], ["==", "$type", "Point"]],
          paint: {
            "circle-radius": 5,
            "circle-color": "#3b82f6",
          },
        },
        {
          id: "gl-draw-point-active",
          type: "circle",
          filter: ["all", ["==", "active", "true"], ["==", "$type", "Point"]],
          paint: {
            "circle-radius": 7,
            "circle-color": "#3b82f6",
          },
        },
      ],
    });

    map.current.addControl(draw.current as any, "top-right");

    // Handle draw events
    map.current.on("draw.create", (e: any) => {
      const feature = e.features[0];
      if (feature.geometry.type === "Polygon") {
        onGeofenceDrawn(feature.geometry.coordinates);
        // Don't clear immediately - let the save dialog handle it
      }
    });

    map.current.on("load", () => {
      setMapLoaded(true);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update geofences on map
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Remove existing geofence layers and sources
    geofences.forEach((g) => {
      if (map.current!.getLayer(`geofence-fill-${g.id}`)) {
        map.current!.removeLayer(`geofence-fill-${g.id}`);
      }
      if (map.current!.getLayer(`geofence-outline-${g.id}`)) {
        map.current!.removeLayer(`geofence-outline-${g.id}`);
      }
      if (map.current!.getSource(`geofence-${g.id}`)) {
        map.current!.removeSource(`geofence-${g.id}`);
      }
    });

    // Remove drawn preview
    if (map.current!.getLayer("geofence-preview-fill")) {
      map.current!.removeLayer("geofence-preview-fill");
    }
    if (map.current!.getLayer("geofence-preview-outline")) {
      map.current!.removeLayer("geofence-preview-outline");
    }
    if (map.current!.getSource("geofence-preview")) {
      map.current!.removeSource("geofence-preview");
    }

    // Add drawn preview if exists
    if (drawnCoordinates && !isDrawing) {
      map.current.addSource("geofence-preview", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "Polygon",
            coordinates: drawnCoordinates,
          },
        },
      });

      map.current.addLayer({
        id: "geofence-preview-fill",
        type: "fill",
        source: "geofence-preview",
        paint: {
          "fill-color": "#3b82f6",
          "fill-opacity": 0.3,
        },
      });

      map.current.addLayer({
        id: "geofence-preview-outline",
        type: "line",
        source: "geofence-preview",
        paint: {
          "line-color": "#3b82f6",
          "line-width": 3,
          "line-dasharray": [2, 2],
        },
      });
    }

    // Add active geofences
    geofences
      .filter((g) => g.active)
      .forEach((geofence) => {
        if (!map.current) return;

        map.current.addSource(`geofence-${geofence.id}`, {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "Polygon",
              coordinates: geofence.coordinates as number[][][],
            },
          },
        });

        // Fill layer
        map.current.addLayer({
          id: `geofence-fill-${geofence.id}`,
          type: "fill",
          source: `geofence-${geofence.id}`,
          paint: {
            "fill-color": geofence.color,
            "fill-opacity":
              selectedGeofenceId === geofence.id ? 0.4 : geofence.fillOpacity,
          },
        });

        // Outline layer
        map.current.addLayer({
          id: `geofence-outline-${geofence.id}`,
          type: "line",
          source: `geofence-${geofence.id}`,
          paint: {
            "line-color": geofence.color,
            "line-width": selectedGeofenceId === geofence.id ? 3 : 2,
            "line-opacity": geofence.strokeOpacity,
          },
        });

        // Add click handler for this geofence
        map.current.on("click", `geofence-fill-${geofence.id}`, (e) => {
          e.preventDefault();
          router.push(`/geofences/${geofence.id}`);
        });

        // Change cursor on hover
        map.current.on("mouseenter", `geofence-fill-${geofence.id}`, () => {
          if (map.current) {
            map.current.getCanvas().style.cursor = "pointer";
          }
        });

        map.current.on("mouseleave", `geofence-fill-${geofence.id}`, () => {
          if (map.current) {
            map.current.getCanvas().style.cursor = "";
          }
        });
      });
  }, [
    geofences,
    mapLoaded,
    selectedGeofenceId,
    drawnCoordinates,
    isDrawing,
    router,
  ]);

  // Update voter markers
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Remove existing markers
    document.querySelectorAll(".voter-marker").forEach((el) => el.remove());

    // Add filtered voters
    filteredVoters.forEach((voter) => {
      if (!voter.latitude || !voter.longitude || !map.current) return;

      const el = document.createElement("div");
      el.className = "voter-marker";
      el.style.backgroundColor = "#3b82f6";
      el.style.width = "10px";
      el.style.height = "10px";
      el.style.borderRadius = "50%";
      el.style.border = "2px solid white";
      el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";
      el.style.cursor = "pointer";

      const lng =
        typeof voter.longitude === "number"
          ? voter.longitude
          : parseFloat(voter.longitude);
      const lat =
        typeof voter.latitude === "number"
          ? voter.latitude
          : parseFloat(voter.latitude);

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([lng, lat])
        .setPopup(
          new maplibregl.Popup({ offset: 15 }).setHTML(
            `<div class="p-2">
              <p class="font-semibold">${voter.name}</p>
              <p class="text-sm text-muted-foreground">${voter.neighborhood}</p>
            </div>`
          )
        )
        .addTo(map.current);
    });

    // Add non-filtered voters in gray
    voters
      .filter((v) => !filteredVoters.find((fv) => fv.id === v.id))
      .forEach((voter) => {
        if (!voter.latitude || !voter.longitude || !map.current) return;

        const el = document.createElement("div");
        el.className = "voter-marker";
        el.style.backgroundColor = "#9ca3af";
        el.style.width = "6px";
        el.style.height = "6px";
        el.style.borderRadius = "50%";
        el.style.border = "1px solid white";
        el.style.opacity = "0.4";

        const lng =
          typeof voter.longitude === "number"
            ? voter.longitude
            : parseFloat(voter.longitude);
        const lat =
          typeof voter.latitude === "number"
            ? voter.latitude
            : parseFloat(voter.latitude);

        new maplibregl.Marker({ element: el })
          .setLngLat([lng, lat])
          .addTo(map.current);
      });
  }, [voters, filteredVoters, mapLoaded]);

  // Handle draw mode
  useEffect(() => {
    if (!draw.current) return;

    if (isDrawing) {
      draw.current.changeMode("draw_polygon");
    } else {
      draw.current.changeMode("simple_select");
      // Always clear draw instance when leaving drawing mode
      // We render the drawn shape via the preview layer instead
      draw.current.deleteAll();
    }
  }, [isDrawing]);

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainer} className="h-full w-full" />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
          <p className="text-sm text-muted-foreground">Carregando mapa...</p>
        </div>
      )}
    </div>
  );
}

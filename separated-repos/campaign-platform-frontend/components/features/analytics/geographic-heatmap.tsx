"use client";

import { useEffect, useRef, useState } from "react";
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
import {
  neighborhoods,
  voterPointsGeoJSON,
  MACAPA_CENTER,
} from "@/mock-data/geographic";

export function GeographicHeatmap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const totalVoters = neighborhoods.reduce((sum, n) => sum + n.voterCount, 0);
  const averagePerNeighborhood = Math.round(totalVoters / neighborhoods.length);

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
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
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
      center: [MACAPA_CENTER.lng, MACAPA_CENTER.lat],
      zoom: MACAPA_CENTER.zoom,
    });

    // Add navigation controls
    map.current.addControl(new maplibregl.NavigationControl(), "top-right");

    // Wait for map to load
    map.current.on("load", () => {
      if (!map.current) return;

      // Add voter points source
      map.current.addSource("voters", {
        type: "geojson",
        data: voterPointsGeoJSON as any,
      });

      // Add heatmap layer
      map.current.addLayer({
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
      map.current.addLayer({
        id: "voters-point",
        type: "circle",
        source: "voters",
        minzoom: 13,
        paint: {
          "circle-radius": ["interpolate", ["linear"], ["zoom"], 13, 3, 15, 6],
          "circle-color": [
            "interpolate",
            ["linear"],
            ["get", "weight"],
            1,
            "#3b82f6",
            5,
            "#f59e0b",
            10,
            "#ef4444",
          ],
          "circle-stroke-color": "white",
          "circle-stroke-width": 1,
          "circle-opacity": ["interpolate", ["linear"], ["zoom"], 13, 0, 15, 1],
        },
      });

      // Add neighborhood labels
      neighborhoods.forEach((neighborhood) => {
        if (!map.current) return;

        const marker = new maplibregl.Marker({ color: neighborhood.color })
          .setLngLat([neighborhood.center.lng, neighborhood.center.lat])
          .setPopup(
            new maplibregl.Popup({ offset: 25 }).setHTML(
              `<div class="p-2">
                <h3 class="font-semibold">${neighborhood.name}</h3>
                <p class="text-sm">${neighborhood.voterCount} eleitores</p>
              </div>`
            )
          )
          .addTo(map.current);
      });

      setMapLoaded(true);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

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

  const handleFocusNeighborhood = (neighborhood: (typeof neighborhoods)[0]) => {
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
              <p className="text-sm text-muted-foreground">Bairros</p>
              <p className="text-2xl font-bold">{neighborhoods.length}</p>
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
            <h4 className="text-sm font-medium">Clique para focar no bairro</h4>
            <div className="grid grid-cols-2 gap-2">
              {neighborhoods
                .sort((a, b) => b.voterCount - a.voterCount)
                .map((neighborhood) => (
                  <button
                    key={neighborhood.id}
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
                    <Badge variant="secondary">{neighborhood.voterCount}</Badge>
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

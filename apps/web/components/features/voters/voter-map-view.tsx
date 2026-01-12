"use client";

import * as React from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useTheme } from "next-themes";
import { Voter, SupportLevel } from "@/types/voters";

const MAP_STYLES = {
  light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
};

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

interface VoterMapViewProps {
  voters: Voter[];
  selectedVoterId: string | null;
  onVoterSelect: (voterId: string | null) => void;
  center?: { lat: number; lng: number };
  zoom?: number;
}

export function VoterMapView({
  voters,
  selectedVoterId,
  onVoterSelect,
  center = { lat: 0.0349, lng: -51.0694 }, // Macapá, Amapá
  zoom = 12,
}: VoterMapViewProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const mapRef = React.useRef<maplibregl.Map | null>(null);
  const markersRef = React.useRef<Map<string, maplibregl.Marker>>(new Map());
  const popupRef = React.useRef<maplibregl.Popup | null>(null);
  const isAnimatingRef = React.useRef(false);
  const closeTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const isHoveringPopupRef = React.useRef(false);
  const { resolvedTheme } = useTheme();

  const getMapStyleUrl = React.useCallback(() => {
    return resolvedTheme === "dark" ? MAP_STYLES.dark : MAP_STYLES.light;
  }, [resolvedTheme]);

  const votersWithLocation = React.useMemo(
    () => voters.filter((v) => v.latitude && v.longitude),
    [voters]
  );

  const closePopup = React.useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      if (!isHoveringPopupRef.current && popupRef.current) {
        popupRef.current.remove();
        popupRef.current = null;
      }
    }, 150);
  }, []);

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
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update map style when theme changes
  React.useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setStyle(getMapStyleUrl());
  }, [resolvedTheme, getMapStyleUrl]);

  // Create/update markers
  React.useEffect(() => {
    if (!mapRef.current) return;

    // Remove old markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    votersWithLocation.forEach((voter) => {
      const isSelected = selectedVoterId === voter.id;
      const color = voter.supportLevel
        ? SUPPORT_LEVEL_COLORS[voter.supportLevel]
        : "#6b7280";

      const el = document.createElement("div");
      el.className = "marker-container";
      el.innerHTML = `
        <div class="relative cursor-pointer transition-transform ${
          isSelected ? "scale-125" : "hover:scale-110"
        }">
          <svg width="28" height="36" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 0C6.268 0 0 6.268 0 14C0 24.5 14 36 14 36C14 36 28 24.5 28 14C28 6.268 21.732 0 14 0Z" fill="${
              isSelected ? "#3b82f6" : color
            }"/>
            <circle cx="14" cy="12" r="5" fill="white"/>
          </svg>
          ${
            isSelected
              ? '<div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary/30 animate-ping"></div>'
              : ""
          }
        </div>
      `;

      el.addEventListener("click", () => {
        onVoterSelect(voter.id);
      });

      el.addEventListener("mouseenter", () => {
        if (closeTimeoutRef.current) {
          clearTimeout(closeTimeoutRef.current);
        }

        if (popupRef.current) {
          popupRef.current.remove();
        }

        const supportLevelBadge = voter.supportLevel
          ? `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium" style="background-color: ${
              SUPPORT_LEVEL_COLORS[voter.supportLevel]
            }20; color: ${SUPPORT_LEVEL_COLORS[voter.supportLevel]}">
              ${SUPPORT_LEVEL_LABELS[voter.supportLevel]}
            </span>`
          : "";

        const tagsHtml = voter.tags
          .slice(0, 3)
          .map(
            (tag) =>
              `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary">${tag}</span>`
          )
          .join("");

        const popupContent = `
          <div class="p-3 min-w-[250px]" data-popup-hover="true">
            <div class="mb-2">
              <h3 class="font-semibold text-base">${voter.name}</h3>
              ${
                voter.city && voter.state
                  ? `<p class="text-sm text-muted-foreground">${voter.city}, ${voter.state}</p>`
                  : ""
              }
            </div>

            ${
              supportLevelBadge
                ? `<div class="mb-2">${supportLevelBadge}</div>`
                : ""
            }

            ${
              voter.phone || voter.email
                ? `<div class="text-sm space-y-1 mb-2">
              ${
                voter.phone
                  ? `<div class="flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <span>${voter.phone}</span>
                ${
                  voter.hasWhatsapp
                    ? '<span class="text-green-600">✓ WhatsApp</span>'
                    : ""
                }
              </div>`
                  : ""
              }
              ${
                voter.email
                  ? `<div class="flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <span class="truncate">${voter.email}</span>
              </div>`
                  : ""
              }
            </div>`
                : ""
            }

            ${
              voter.electoralZone && voter.electoralSection
                ? `<div class="text-sm text-muted-foreground mb-2">
              Zona ${voter.electoralZone}, Seção ${voter.electoralSection}
            </div>`
                : ""
            }

            ${
              tagsHtml
                ? `<div class="flex flex-wrap gap-1 mt-2">${tagsHtml}</div>`
                : ""
            }
          </div>
        `;

        const popup = new maplibregl.Popup({
          offset: [0, -32],
          closeButton: false,
          closeOnClick: false,
          className: "voter-hover-popup",
          maxWidth: "350px",
        })
          .setLngLat([voter.longitude!, voter.latitude!])
          .setHTML(popupContent)
          .addTo(mapRef.current!);

        const popupElement = popup.getElement();
        if (popupElement) {
          popupElement.addEventListener("mouseenter", () => {
            isHoveringPopupRef.current = true;
            if (closeTimeoutRef.current) {
              clearTimeout(closeTimeoutRef.current);
            }
          });
          popupElement.addEventListener("mouseleave", () => {
            isHoveringPopupRef.current = false;
            closePopup();
          });
          popupElement.addEventListener("click", () => {
            onVoterSelect(voter.id);
            popup.remove();
            popupRef.current = null;
          });
        }

        popupRef.current = popup;
      });

      el.addEventListener("mouseleave", () => {
        closePopup();
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([voter.longitude!, voter.latitude!])
        .addTo(mapRef.current!);

      markersRef.current.set(voter.id, marker);
    });
  }, [votersWithLocation, selectedVoterId, onVoterSelect, closePopup]);

  // Fly to selected voter
  React.useEffect(() => {
    if (!mapRef.current || !selectedVoterId) return;

    const voter = votersWithLocation.find((v) => v.id === selectedVoterId);
    if (voter && voter.latitude && voter.longitude) {
      isAnimatingRef.current = true;
      mapRef.current.flyTo({
        center: [voter.longitude, voter.latitude],
        zoom: Math.max(mapRef.current.getZoom(), 12),
        essential: true,
      });
    }
  }, [selectedVoterId, votersWithLocation]);

  return <div ref={containerRef} className="absolute inset-0 w-full h-full" />;
}

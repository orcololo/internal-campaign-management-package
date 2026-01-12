"use client";

import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Loader2 } from "lucide-react";

export interface AddressDetails {
  formattedAddress: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  cep?: string;
  latitude?: number;
  longitude?: number;
  placeId?: string;
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string, details?: AddressDetails) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  error?: string;
}

/**
 * Google Maps Address Autocomplete Component
 *
 * Features:
 * - Brazilian address autocomplete
 * - Extracts structured address components
 * - Returns coordinates (lat/lng)
 * - Place ID for future reference
 */
export function AddressAutocomplete({
  value,
  onChange,
  placeholder = "Digite o endereço completo...",
  label = "Endereço",
  disabled = false,
  className = "",
  error,
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadError, setIsLoadError] = useState(false);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      console.warn("Google Maps API key not configured");
      setIsLoadError(true);
      setIsLoading(false);
      return;
    }

    const loader = new Loader({
      apiKey,
      version: "weekly",
      libraries: ["places"],
    });

    loader
      .load()
      .then(() => {
        if (!inputRef.current) return;

        // Initialize autocomplete with Brazilian bias
        const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
          componentRestrictions: { country: "br" },
          fields: ["formatted_address", "address_components", "geometry", "place_id"],
          types: ["address"],
        });

        autocompleteRef.current = autocomplete;

        // Listen for place selection
        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();

          if (!place.geometry || !place.geometry.location) {
            onChange(place.name || "");
            return;
          }

          // Extract address components
          const addressDetails = extractAddressComponents(place);

          // Notify parent component
          onChange(place.formatted_address || "", addressDetails);
        });

        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error loading Google Maps:", error);
        setIsLoadError(true);
        setIsLoading(false);
      });

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [onChange]);

  /**
   * Extract structured address components from Google Places result
   */
  const extractAddressComponents = (
    place: google.maps.places.PlaceResult
  ): AddressDetails => {
    const details: AddressDetails = {
      formattedAddress: place.formatted_address || "",
      latitude: place.geometry?.location?.lat(),
      longitude: place.geometry?.location?.lng(),
      placeId: place.place_id,
    };

    // Parse address components
    place.address_components?.forEach((component) => {
      const types = component.types;

      if (types.includes("street_number")) {
        details.number = component.long_name;
      } else if (types.includes("route")) {
        details.street = component.long_name;
      } else if (
        types.includes("sublocality") ||
        types.includes("neighborhood")
      ) {
        details.neighborhood = component.long_name;
      } else if (
        types.includes("administrative_area_level_2") ||
        types.includes("locality")
      ) {
        details.city = component.long_name;
      } else if (types.includes("administrative_area_level_1")) {
        details.state = component.short_name;
      } else if (types.includes("postal_code")) {
        details.cep = component.long_name;
      }
    });

    return details;
  };

  if (isLoadError) {
    return (
      <div className={className}>
        {label && (
          <Label className="text-sm font-medium text-gray-700 mb-1.5">
            {label}
          </Label>
        )}
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={error ? "border-red-500" : ""}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        <p className="mt-1 text-xs text-amber-600">
          Google Maps não disponível. Use o campo de texto manual.
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      {label && (
        <Label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          {label}
          {isLoading && <Loader2 className="h-3 w-3 animate-spin text-gray-400" />}
        </Label>
      )}
      <Input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled || isLoading}
        className={error ? "border-red-500" : ""}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      <p className="mt-1 text-xs text-gray-500">
        Digite o endereço e selecione uma opção da lista
      </p>
    </div>
  );
}

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Client,
  GeocodeResult,
  PlaceAutocompleteResult,
  AddressComponent,
} from '@googlemaps/google-maps-services-js';

export interface GeocodingResult {
  latitude: number;
  longitude: number;
  formattedAddress: string;
  placeId?: string;
  addressComponents?: AddressComponent[];
}

export interface ReverseGeocodingResult {
  formattedAddress: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  neighborhood?: string;
}

@Injectable()
export class MapsService {
  private readonly logger = new Logger(MapsService.name);
  private readonly client: Client;
  private readonly apiKey: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('GOOGLE_MAPS_API_KEY', '');
    this.client = new Client({});

    if (!this.apiKey) {
      this.logger.warn('Google Maps API key not configured. Maps features will be disabled.');
    }
  }

  /**
   * Geocode an address to get coordinates
   */
  async geocodeAddress(address: string): Promise<GeocodingResult | null> {
    if (!this.apiKey) {
      this.logger.warn('Geocoding skipped: API key not configured');
      return null;
    }

    try {
      const response = await this.client.geocode({
        params: {
          address,
          key: this.apiKey,
        },
      });

      if (response.data.results.length === 0) {
        this.logger.warn(`No results found for address: ${address}`);
        return null;
      }

      const result = response.data.results[0];
      return {
        latitude: result.geometry.location.lat,
        longitude: result.geometry.location.lng,
        formattedAddress: result.formatted_address,
        placeId: result.place_id,
        addressComponents: result.address_components,
      };
    } catch (error) {
      this.logger.error(`Geocoding error for address "${address}":`, error.message);
      return null;
    }
  }

  /**
   * Reverse geocode coordinates to get address
   */
  async reverseGeocode(
    latitude: number,
    longitude: number,
  ): Promise<ReverseGeocodingResult | null> {
    if (!this.apiKey) {
      this.logger.warn('Reverse geocoding skipped: API key not configured');
      return null;
    }

    try {
      const response = await this.client.reverseGeocode({
        params: {
          latlng: { lat: latitude, lng: longitude },
          key: this.apiKey,
        },
      });

      if (response.data.results.length === 0) {
        return null;
      }

      const result = response.data.results[0];
      const components = result.address_components;

      return {
        formattedAddress: result.formatted_address,
        city: this.extractComponent(components, 'administrative_area_level_2'),
        state: this.extractComponent(components, 'administrative_area_level_1', true),
        country: this.extractComponent(components, 'country'),
        zipCode: this.extractComponent(components, 'postal_code'),
        neighborhood: this.extractComponent(components, 'sublocality_level_1'),
      };
    } catch (error) {
      this.logger.error(`Reverse geocoding error:`, error.message);
      return null;
    }
  }

  /**
   * Autocomplete address suggestions
   */
  async autocompleteAddress(input: string, country = 'BR'): Promise<PlaceAutocompleteResult[]> {
    if (!this.apiKey) {
      this.logger.warn('Autocomplete skipped: API key not configured');
      return [];
    }

    try {
      const response = await this.client.placeAutocomplete({
        params: {
          input,
          key: this.apiKey,
          components: [`country:${country}`],
          language: 'pt-BR',
        },
      });

      return response.data.predictions;
    } catch (error) {
      this.logger.error(`Autocomplete error:`, error.message);
      return [];
    }
  }

  /**
   * Get place details by place ID
   */
  async getPlaceDetails(placeId: string): Promise<GeocodingResult | null> {
    if (!this.apiKey) {
      this.logger.warn('Place details skipped: API key not configured');
      return null;
    }

    try {
      const response = await this.client.placeDetails({
        params: {
          place_id: placeId,
          key: this.apiKey,
          fields: ['formatted_address', 'geometry', 'address_components'],
        },
      });

      const result = response.data.result;
      if (!result.geometry) {
        return null;
      }
      return {
        latitude: result.geometry.location.lat,
        longitude: result.geometry.location.lng,
        formattedAddress: result.formatted_address || '',
        placeId: result.place_id,
        addressComponents: result.address_components,
      };
    } catch (error) {
      this.logger.error(`Place details error:`, error.message);
      return null;
    }
  }

  /**
   * Calculate distance between two points using Haversine formula
   * Returns distance in kilometers
   */
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Check if a point is within a circular geofence
   */
  isPointInCircle(
    pointLat: number,
    pointLon: number,
    centerLat: number,
    centerLon: number,
    radiusKm: number,
  ): boolean {
    const distance = this.calculateDistance(pointLat, pointLon, centerLat, centerLon);
    return distance <= radiusKm;
  }

  /**
   * Check if a point is within a polygon geofence
   * Uses ray casting algorithm
   */
  isPointInPolygon(
    pointLat: number,
    pointLon: number,
    polygon: Array<{ lat: number; lng: number }>,
  ): boolean {
    let inside = false;
    const x = pointLon;
    const y = pointLat;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].lng;
      const yi = polygon[i].lat;
      const xj = polygon[j].lng;
      const yj = polygon[j].lat;

      const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

      if (intersect) inside = !inside;
    }

    return inside;
  }

  /**
   * Extract component from Google Maps address components
   */
  private extractComponent(
    components: AddressComponent[],
    type: string,
    shortName = false,
  ): string | undefined {
    const component = components.find((c) => c.types.includes(type as any));
    return component ? (shortName ? component.short_name : component.long_name) : undefined;
  }

  /**
   * Convert degrees to radians
   */
  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}

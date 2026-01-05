import { Controller, Get, Query, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MapsService } from './maps.service';
import {
  GeocodeDto,
  ReverseGeocodeDto,
  AutocompleteDto,
  PlaceDetailsDto,
  CalculateDistanceDto,
  CheckGeofenceDto,
  CheckPolygonDto,
} from './dto';

@ApiTags('Maps')
@Controller('maps')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class MapsController {
  constructor(private readonly mapsService: MapsService) {}

  @Get('geocode')
  @ApiOperation({ summary: 'Geocode an address to get coordinates' })
  @ApiResponse({
    status: 200,
    description: 'Returns coordinates and formatted address',
    schema: {
      example: {
        latitude: -23.5505,
        longitude: -46.6333,
        formattedAddress: 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP, Brazil',
        placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
      },
    },
  })
  async geocode(@Query() dto: GeocodeDto) {
    return this.mapsService.geocodeAddress(dto.address);
  }

  @Get('reverse-geocode')
  @ApiOperation({ summary: 'Reverse geocode coordinates to get address' })
  @ApiResponse({
    status: 200,
    description: 'Returns formatted address and components',
    schema: {
      example: {
        formattedAddress: 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP, Brazil',
        city: 'São Paulo',
        state: 'SP',
        country: 'Brazil',
        zipCode: '01310-100',
        neighborhood: 'Bela Vista',
      },
    },
  })
  async reverseGeocode(@Query() dto: ReverseGeocodeDto) {
    return this.mapsService.reverseGeocode(dto.lat, dto.lng);
  }

  @Get('autocomplete')
  @ApiOperation({ summary: 'Get address autocomplete suggestions' })
  @ApiResponse({
    status: 200,
    description: 'Returns autocomplete suggestions',
    schema: {
      example: [
        {
          description: 'Av. Paulista - São Paulo, Brazil',
          place_id: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
        },
      ],
    },
  })
  async autocomplete(@Query() dto: AutocompleteDto) {
    return this.mapsService.autocompleteAddress(dto.input, dto.country || 'BR');
  }

  @Get('place-details')
  @ApiOperation({ summary: 'Get place details by place ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns place details',
    schema: {
      example: {
        latitude: -23.5505,
        longitude: -46.6333,
        formattedAddress: 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP, Brazil',
        placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
      },
    },
  })
  async placeDetails(@Query() dto: PlaceDetailsDto) {
    return this.mapsService.getPlaceDetails(dto.placeId);
  }

  @Post('distance')
  @ApiOperation({ summary: 'Calculate distance between two points using Haversine formula' })
  @ApiResponse({
    status: 200,
    description: 'Returns distance in kilometers',
    schema: {
      example: {
        distance: 1.85,
        unit: 'km',
      },
    },
  })
  async calculateDistance(@Body() dto: CalculateDistanceDto) {
    const distance = this.mapsService.calculateDistance(
      dto.lat1,
      dto.lng1,
      dto.lat2,
      dto.lng2,
    );
    return { distance, unit: 'km' };
  }

  @Post('check-geofence')
  @ApiOperation({ summary: 'Check if a point is within a circular geofence' })
  @ApiResponse({
    status: 200,
    description: 'Returns whether point is inside geofence',
    schema: {
      example: {
        isInside: true,
      },
    },
  })
  async checkGeofence(@Body() dto: CheckGeofenceDto) {
    const isInside = this.mapsService.isPointInCircle(
      dto.pointLat,
      dto.pointLng,
      dto.centerLat,
      dto.centerLng,
      dto.radiusKm,
    );
    return { isInside };
  }

  @Post('check-polygon')
  @ApiOperation({ summary: 'Check if a point is within a polygon geofence' })
  @ApiResponse({
    status: 200,
    description: 'Returns whether point is inside polygon',
    schema: {
      example: {
        isInside: true,
      },
    },
  })
  async checkPolygon(@Body() dto: CheckPolygonDto) {
    const isInside = this.mapsService.isPointInPolygon(
      dto.pointLat,
      dto.pointLng,
      dto.polygon,
    );
    return { isInside };
  }
}

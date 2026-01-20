import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { MapsService } from './maps.service';

describe('MapsService', () => {
  let service: MapsService;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'GOOGLE_MAPS_API_KEY') return 'test-api-key';
      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MapsService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<MapsService>(MapsService);
    configService = module.get<ConfigService>(ConfigService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculateDistance', () => {
    it('should calculate distance between two points', () => {
      const lat1 = -23.5505;
      const lng1 = -46.6333;
      const lat2 = -23.5506;
      const lng2 = -46.6334;

      const result = service.calculateDistance(lat1, lng1, lat2, lng2);

      expect(result).toBeDefined();
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThanOrEqual(0);
    });

    it('should return 0 for same coordinates', () => {
      const lat = -23.5505;
      const lng = -46.6333;

      const result = service.calculateDistance(lat, lng, lat, lng);

      expect(result).toBe(0);
    });
  });

  describe('isPointInCircle', () => {
    it('should return true for point inside circle', () => {
      const pointLat = -23.5505;
      const pointLng = -46.6333;
      const centerLat = -23.5505;
      const centerLng = -46.6333;
      const radius = 5;

      const result = service.isPointInCircle(pointLat, pointLng, centerLat, centerLng, radius);

      expect(result).toBe(true);
    });

    it('should return false for point outside circle', () => {
      const pointLat = -23.5505;
      const pointLng = -46.6333;
      const centerLat = -23.6505;
      const centerLng = -46.7333;
      const radius = 1;

      const result = service.isPointInCircle(pointLat, pointLng, centerLat, centerLng, radius);

      expect(result).toBe(false);
    });
  });

  describe('isPointInPolygon', () => {
    it('should return true for point inside polygon', () => {
      const pointLat = 0;
      const pointLng = 0;
      const polygon = [
        { lat: -1, lng: -1 },
        { lat: -1, lng: 1 },
        { lat: 1, lng: 1 },
        { lat: 1, lng: -1 },
      ];

      const result = service.isPointInPolygon(pointLat, pointLng, polygon);

      expect(result).toBe(true);
    });

    it('should return false for point outside polygon', () => {
      const pointLat = 5;
      const pointLng = 5;
      const polygon = [
        { lat: -1, lng: -1 },
        { lat: -1, lng: 1 },
        { lat: 1, lng: 1 },
        { lat: 1, lng: -1 },
      ];

      const result = service.isPointInPolygon(pointLat, pointLng, polygon);

      expect(result).toBe(false);
    });

    it('should handle polygon with less than 3 points', () => {
      const pointLat = 0;
      const pointLng = 0;
      const polygon = [
        { lat: -1, lng: -1 },
        { lat: -1, lng: 1 },
      ];

      const result = service.isPointInPolygon(pointLat, pointLng, polygon);

      expect(result).toBe(false);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { VotersController } from './voters.controller';
import { VotersService } from './voters.service';

describe('VotersController', () => {
  let controller: VotersController;
  let service: VotersService;

  const mockVotersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    geocodeVoter: jest.fn(),
    bulkDelete: jest.fn(),
    bulkUpdate: jest.fn(),
    getStatistics: jest.fn(),
    findNearby: jest.fn(),
    findNearLocation: jest.fn(),
    findInGeofence: jest.fn(),
    groupByProximity: jest.fn(),
    importFromCSV: jest.fn(),
    exportToCSV: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VotersController],
      providers: [
        {
          provide: VotersService,
          useValue: mockVotersService,
        },
      ],
    }).compile();

    controller = module.get<VotersController>(VotersController);
    service = module.get<VotersService>(VotersService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a voter', async () => {
      const createDto = {
        name: 'João Silva',
        email: 'joao@example.com',
        phone: '11999999999',
      };

      const mockVoter = { id: '1', ...createDto };
      mockVotersService.create.mockResolvedValue(mockVoter);

      const result = await controller.create(createDto as any);

      expect(result).toEqual(mockVoter);
      expect(mockVotersService.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return paginated voters', async () => {
      const query = { page: 1, limit: 10 };
      const mockResult = {
        data: [{ id: '1', name: 'Voter 1' }],
        meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
      };

      mockVotersService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll(query as any);

      expect(result).toEqual(mockResult);
      expect(mockVotersService.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('findOne', () => {
    it('should return a voter by id', async () => {
      const mockVoter = { id: '1', name: 'João Silva' };
      mockVotersService.findOne.mockResolvedValue(mockVoter);

      const result = await controller.findOne('1');

      expect(result).toEqual(mockVoter);
      expect(mockVotersService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update a voter', async () => {
      const updateDto = { name: 'João Updated' };
      const mockVoter = { id: '1', name: 'João Updated' };
      mockVotersService.update.mockResolvedValue(mockVoter);

      const result = await controller.update('1', updateDto as any);

      expect(result).toEqual(mockVoter);
      expect(mockVotersService.update).toHaveBeenCalledWith('1', updateDto);
    });
  });

  describe('remove', () => {
    it('should remove a voter', async () => {
      const mockResult = { message: 'Voter deleted successfully' };
      mockVotersService.remove.mockResolvedValue(mockResult);

      const result = await controller.remove('1');

      expect(result).toEqual(mockResult);
      expect(mockVotersService.remove).toHaveBeenCalledWith('1');
    });
  });

  describe('geocode', () => {
    it('should geocode a voter address', async () => {
      const mockVoter = { id: '1', latitude: -23.5505, longitude: -46.6333 };
      mockVotersService.geocodeVoter.mockResolvedValue(mockVoter);

      const result = await controller.geocode('1');

      expect(result).toEqual(mockVoter);
      expect(mockVotersService.geocodeVoter).toHaveBeenCalledWith('1');
    });
  });

  describe('bulkDelete', () => {
    it('should delete multiple voters', async () => {
      const bulkDeleteDto = { ids: ['1', '2', '3'] };
      const mockResult = { requested: 3, deleted: 3, notFound: [] };
      mockVotersService.bulkDelete.mockResolvedValue(mockResult);

      const result = await controller.bulkDelete(bulkDeleteDto as any);

      expect(result).toEqual(mockResult);
      expect(mockVotersService.bulkDelete).toHaveBeenCalledWith(bulkDeleteDto.ids);
    });
  });

  describe('bulkUpdate', () => {
    it('should update multiple voters', async () => {
      const bulkUpdateDto = {
        updates: [
          { id: '1', data: { name: 'Updated 1' } },
          { id: '2', data: { name: 'Updated 2' } },
        ],
      };
      const mockResult = { updated: 2, failed: 0, errors: [] };
      mockVotersService.bulkUpdate.mockResolvedValue(mockResult);

      const result = await controller.bulkUpdate(bulkUpdateDto as any);

      expect(result).toEqual(mockResult);
      expect(mockVotersService.bulkUpdate).toHaveBeenCalledWith(bulkUpdateDto.updates);
    });
  });

  describe('getStatistics', () => {
    it('should return voter statistics', async () => {
      const mockStats = {
        total: 100,
        byGender: { MASCULINO: 60, FEMININO: 40 },
        byCity: { 'São Paulo': 50, 'Rio de Janeiro': 50 },
      };
      mockVotersService.getStatistics.mockResolvedValue(mockStats);

      const result = await controller.getStatistics();

      expect(result).toEqual(mockStats);
      expect(mockVotersService.getStatistics).toHaveBeenCalled();
    });
  });

  describe('findNearby', () => {
    it('should find voters nearby a location', async () => {
      const lat = '-23.5505';
      const lng = '-46.6333';
      const radius = '5';
      const mockVoters = [{ id: '1', name: 'Nearby Voter', distance: 2.5 }];

      // Mock findNearLocation instead of findNearby
      const mockFindNearLocation = jest.fn().mockResolvedValue(mockVoters);
      mockVotersService.findNearLocation = mockFindNearLocation;

      const result = await controller.findNearby(lat, lng, radius);

      expect(result).toEqual(mockVoters);
      expect(mockFindNearLocation).toHaveBeenCalledWith(-23.5505, -46.6333, 5, 50);
    });
  });

  describe('findInGeofence', () => {
    it('should find voters in a geofence', async () => {
      const body = {
        type: 'CIRCLE' as const,
        data: { centerLat: -23.5505, centerLng: -46.6333, radiusKm: 5 },
      };
      const mockResult = {
        geofenceType: 'circle',
        total: 10,
        voters: [{ id: '1', name: 'Voter in Geofence' }],
      };
      mockVotersService.findInGeofence.mockResolvedValue(mockResult);

      const result = await controller.findInGeofence(body);

      expect(result).toEqual(mockResult);
      expect(mockVotersService.findInGeofence).toHaveBeenCalledWith(body.type, body.data);
    });
  });

  describe('groupByProximity', () => {
    it('should group voters by proximity', async () => {
      const body = {
        locations: [
          { name: 'Location 1', lat: -23.5505, lng: -46.6333 },
          { name: 'Location 2', lat: -23.5506, lng: -46.6334 },
        ],
        maxDistanceKm: 2,
      };
      const mockGroups = [
        {
          centroid: { lat: -23.5505, lng: -46.6333 },
          voters: 10,
          voterIds: ['1', '2', '3'],
        },
      ];
      mockVotersService.groupByProximity.mockResolvedValue(mockGroups);

      const result = await controller.groupByProximity(body);

      expect(result).toEqual(mockGroups);
      expect(mockVotersService.groupByProximity).toHaveBeenCalledWith(
        body.locations,
        body.maxDistanceKm,
      );
    });

    it('should use default maxDistanceKm when not provided', async () => {
      const body = {
        locations: [{ name: 'Location 1', lat: -23.5505, lng: -46.6333 }],
      };
      const mockGroups: any[] = [];
      mockVotersService.groupByProximity.mockResolvedValue(mockGroups);

      const result = await controller.groupByProximity(body);

      expect(result).toEqual(mockGroups);
      expect(mockVotersService.groupByProximity).toHaveBeenCalledWith(
        body.locations,
        5, // default value
      );
    });
  });
});

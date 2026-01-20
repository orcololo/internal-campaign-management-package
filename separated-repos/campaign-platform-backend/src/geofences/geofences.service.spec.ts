import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { GeofencesService } from './geofences.service';
import { DatabaseService } from '../database/database.service';
import { MapsService } from '../maps/maps.service';

describe('GeofencesService', () => {
  let service: GeofencesService;
  let databaseService: DatabaseService;

  const mockDb = {
    insert: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    offset: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    returning: jest.fn(),
  };

  const mockDatabaseService = {
    getDb: jest.fn(() => mockDb),
  };

  const mockMapsService = {
    calculateDistance: jest.fn(),
    isPointInCircle: jest.fn(),
    isPointInPolygon: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GeofencesService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
        {
          provide: MapsService,
          useValue: mockMapsService,
        },
      ],
    }).compile();

    service = module.get<GeofencesService>(GeofencesService);
    databaseService = module.get<DatabaseService>(DatabaseService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a geofence', async () => {
      const createDto = {
        name: 'Downtown Area',
        type: 'CIRCLE',
        data: { latitude: -23.5505, longitude: -46.6333, radius: 5 },
      };

      const mockGeofence = { id: '1', ...createDto };
      mockDb.returning.mockResolvedValue([mockGeofence]);

      const result = await service.create(createDto as any);

      expect(result).toBeDefined();
      expect(result.name).toBe(createDto.name);
      expect(mockDb.insert).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all geofences', async () => {
      const mockGeofences = [
        { id: '1', name: 'Geofence 1', type: 'CIRCLE', data: {} },
        { id: '2', name: 'Geofence 2', type: 'POLYGON', data: {} },
      ];

      jest.spyOn(mockDb, 'from').mockReturnValue(mockDb);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'orderBy').mockReturnValueOnce(mockGeofences);

      const result = await service.findAll();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('findOne', () => {
    it('should return a geofence by id', async () => {
      const mockGeofence = { id: '1', name: 'Test Geofence', type: 'CIRCLE' };

      jest.spyOn(mockDb, 'from').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce([mockGeofence]);

      const result = await service.findOne('1');

      expect(result).toBeDefined();
      expect(result.id).toBe('1');
    });

    it('should throw NotFoundException when geofence not found', async () => {
      jest.spyOn(mockDb, 'from').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce([]);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a geofence', async () => {
      const mockGeofence = { id: '1', name: 'Old Name', type: 'CIRCLE' };
      const updateDto = { name: 'New Name' };

      // Mock findOne
      jest.spyOn(mockDb, 'from').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce([mockGeofence]);

      // Mock update
      mockDb.returning.mockReset();
      jest.spyOn(mockDb, 'where').mockReturnValueOnce(mockDb);
      mockDb.returning.mockResolvedValueOnce([{ ...mockGeofence, name: updateDto.name }]);

      const result = await service.update('1', updateDto);

      expect(result.name).toBe(updateDto.name);
      expect(mockDb.update).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should soft delete a geofence', async () => {
      const mockGeofence = { id: '1', name: 'Test Geofence' };

      // Mock findOne
      jest.spyOn(mockDb, 'from').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce([mockGeofence]);

      // Mock update (soft delete)
      jest.spyOn(mockDb, 'set').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce(undefined);

      const result = await service.remove('1');

      expect(result.message).toBe('Geofence deleted successfully');
      expect(mockDb.update).toHaveBeenCalled();
    });
  });
});

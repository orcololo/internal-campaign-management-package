import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { VotersService } from './voters.service';
import { DatabaseService } from '../database/database.service';
import { MapsService } from '../maps/maps.service';

describe('VotersService', () => {
  let service: VotersService;
  let databaseService: DatabaseService;
  let mapsService: MapsService;

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
    geocodeAddress: jest.fn(),
    calculateDistance: jest.fn(),
    isPointInCircle: jest.fn(),
    isPointInPolygon: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VotersService,
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

    service = module.get<VotersService>(VotersService);
    databaseService = module.get<DatabaseService>(DatabaseService);
    mapsService = module.get<MapsService>(MapsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a voter', async () => {
      const createVoterDto = {
        name: 'João Silva',
        cpf: '123.456.789-00',
        email: 'joao@example.com',
        latitude: -23.5505,
        longitude: -46.6333,
      };

      const mockVoter = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        ...createVoterDto,
        latitude: '-23.5505',
        longitude: '-46.6333',
        createdAt: new Date(),
      };

      mockDb.returning.mockResolvedValue([mockVoter]);

      const result = await service.create(createVoterDto as any);

      expect(result).toBeDefined();
      expect(result.name).toBe(createVoterDto.name);
      expect(mockDb.insert).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return paginated voters', async () => {
      const mockVoters = [
        { id: '1', name: 'Voter 1', latitude: '-23.5505', longitude: '-46.6333' },
        { id: '2', name: 'Voter 2', latitude: '-23.5506', longitude: '-46.6334' },
      ];

      mockDb.returning.mockResolvedValueOnce([{ count: 2 }]);
      mockDb.returning.mockResolvedValueOnce(mockVoters);

      // Mock for count query
      jest.spyOn(mockDb, 'from').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce([{ count: 2 }]);

      // Mock for data query
      jest.spyOn(mockDb, 'from').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'limit').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'offset').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'orderBy').mockReturnValueOnce(mockVoters);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result).toBeDefined();
      expect(result.data).toHaveLength(2);
      expect(result.meta.total).toBe(2);
    });

    it('should filter voters by search term', async () => {
      const query = { page: 1, limit: 10, search: 'João' };

      mockDb.returning.mockResolvedValueOnce([{ count: 1 }]);
      mockDb.returning.mockResolvedValueOnce([{ id: '1', name: 'João' }]);

      jest.spyOn(mockDb, 'from').mockReturnValue(mockDb);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce([{ count: 1 }]);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'limit').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'offset').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'orderBy').mockReturnValueOnce([{ id: '1', name: 'João' }]);

      const result = await service.findAll(query);

      expect(mockDb.where).toHaveBeenCalled();
    });

    it('should filter voters by city', async () => {
      const query = { page: 1, limit: 10, city: 'São Paulo' };

      jest.spyOn(mockDb, 'from').mockReturnValue(mockDb);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce([{ count: 1 }]);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'limit').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'offset').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'orderBy').mockReturnValueOnce([{ id: '1', city: 'São Paulo' }]);

      await service.findAll(query);

      expect(mockDb.where).toHaveBeenCalled();
    });

    it('should filter voters by state', async () => {
      const query = { page: 1, limit: 10, state: 'SP' };

      jest.spyOn(mockDb, 'from').mockReturnValue(mockDb);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce([{ count: 1 }]);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'limit').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'offset').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'orderBy').mockReturnValueOnce([{ id: '1', state: 'SP' }]);

      await service.findAll(query);

      expect(mockDb.where).toHaveBeenCalled();
    });

    it('should filter voters by neighborhood', async () => {
      const query = { page: 1, limit: 10, neighborhood: 'Centro' };

      jest.spyOn(mockDb, 'from').mockReturnValue(mockDb);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce([{ count: 1 }]);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'limit').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'offset').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'orderBy').mockReturnValueOnce([{ id: '1', neighborhood: 'Centro' }]);

      await service.findAll(query);

      expect(mockDb.where).toHaveBeenCalled();
    });

    it('should filter voters by electoral zone', async () => {
      const query = { page: 1, limit: 10, electoralZone: '001' };

      jest.spyOn(mockDb, 'from').mockReturnValue(mockDb);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce([{ count: 1 }]);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'limit').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'offset').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'orderBy').mockReturnValueOnce([{ id: '1', electoralZone: '001' }]);

      await service.findAll(query);

      expect(mockDb.where).toHaveBeenCalled();
    });

    it('should filter voters by electoral section', async () => {
      const query = { page: 1, limit: 10, electoralSection: '0010' };

      jest.spyOn(mockDb, 'from').mockReturnValue(mockDb);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce([{ count: 1 }]);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'limit').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'offset').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'orderBy').mockReturnValueOnce([{ id: '1', electoralSection: '0010' }]);

      await service.findAll(query);

      expect(mockDb.where).toHaveBeenCalled();
    });

    it('should filter voters by gender', async () => {
      const query = { page: 1, limit: 10, gender: 'MASCULINO' as any };

      jest.spyOn(mockDb, 'from').mockReturnValue(mockDb);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce([{ count: 1 }]);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'limit').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'offset').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'orderBy').mockReturnValueOnce([{ id: '1', gender: 'MASCULINO' }]);

      await service.findAll(query);

      expect(mockDb.where).toHaveBeenCalled();
    });

    it('should filter voters by education level', async () => {
      const query = { page: 1, limit: 10, educationLevel: 'SUPERIOR_COMPLETO' as any };

      jest.spyOn(mockDb, 'from').mockReturnValue(mockDb);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce([{ count: 1 }]);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'limit').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'offset').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'orderBy').mockReturnValueOnce([{ id: '1', educationLevel: 'SUPERIOR_COMPLETO' }]);

      await service.findAll(query);

      expect(mockDb.where).toHaveBeenCalled();
    });

    it('should filter voters by income level', async () => {
      const query = { page: 1, limit: 10, incomeLevel: 'ACIMA_5_SALARIOS' as any };

      jest.spyOn(mockDb, 'from').mockReturnValue(mockDb);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce([{ count: 1 }]);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'limit').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'offset').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'orderBy').mockReturnValueOnce([{ id: '1', incomeLevel: 'ACIMA_5_SALARIOS' }]);

      await service.findAll(query);

      expect(mockDb.where).toHaveBeenCalled();
    });

    it('should filter voters by marital status', async () => {
      const query = { page: 1, limit: 10, maritalStatus: 'CASADO' as any };

      jest.spyOn(mockDb, 'from').mockReturnValue(mockDb);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce([{ count: 1 }]);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'limit').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'offset').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'orderBy').mockReturnValueOnce([{ id: '1', maritalStatus: 'CASADO' }]);

      await service.findAll(query);

      expect(mockDb.where).toHaveBeenCalled();
    });

    it('should filter voters by support level', async () => {
      const query = { page: 1, limit: 10, supportLevel: 'FAVORAVEL' as any };

      jest.spyOn(mockDb, 'from').mockReturnValue(mockDb);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce([{ count: 1 }]);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'limit').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'offset').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'orderBy').mockReturnValueOnce([{ id: '1', supportLevel: 'FAVORAVEL' }]);

      await service.findAll(query);

      expect(mockDb.where).toHaveBeenCalled();
    });

    it('should filter voters by occupation', async () => {
      const query = { page: 1, limit: 10, occupation: 'Professor' };

      jest.spyOn(mockDb, 'from').mockReturnValue(mockDb);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce([{ count: 1 }]);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'limit').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'offset').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'orderBy').mockReturnValueOnce([{ id: '1', occupation: 'Professor' }]);

      await service.findAll(query);

      expect(mockDb.where).toHaveBeenCalled();
    });

    it('should filter voters by religion', async () => {
      const query = { page: 1, limit: 10, religion: 'Católica' };

      jest.spyOn(mockDb, 'from').mockReturnValue(mockDb);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce([{ count: 1 }]);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'limit').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'offset').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'orderBy').mockReturnValueOnce([{ id: '1', religion: 'Católica' }]);

      await service.findAll(query);

      expect(mockDb.where).toHaveBeenCalled();
    });

    it('should filter voters by hasWhatsapp', async () => {
      const query = { page: 1, limit: 10, hasWhatsapp: 'SIM' as any };

      jest.spyOn(mockDb, 'from').mockReturnValue(mockDb);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce([{ count: 1 }]);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'limit').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'offset').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'orderBy').mockReturnValueOnce([{ id: '1', hasWhatsapp: 'SIM' }]);

      await service.findAll(query);

      expect(mockDb.where).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a voter by id', async () => {
      const mockVoter = {
        id: '123',
        name: 'João Silva',
        latitude: '-23.5505',
        longitude: '-46.6333',
      };

      jest.spyOn(mockDb, 'from').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce([mockVoter]);

      const result = await service.findOne('123');

      expect(result).toBeDefined();
      expect(result.id).toBe('123');
      expect(result.latitude).toBe(-23.5505);
    });

    it('should throw NotFoundException when voter not found', async () => {
      jest.spyOn(mockDb, 'from').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce([]);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a voter', async () => {
      const mockVoter = {
        id: '123',
        name: 'João Silva',
        latitude: '-23.5505',
        longitude: '-46.6333',
      };

      const updateDto = { name: 'João Silva Updated' };

      // Reset returning mock to avoid interference from other tests
      mockDb.returning.mockReset();

      // Mock findOne - db.select().from(voters).where(...)
      jest.spyOn(mockDb, 'from').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce([mockVoter]);

      // Mock update - db.update(voters).set(values).where(...).returning()
      jest.spyOn(mockDb, 'where').mockReturnValueOnce(mockDb);
      mockDb.returning.mockResolvedValueOnce([{ ...mockVoter, name: updateDto.name }]);

      const result = await service.update('123', updateDto);

      expect(result.name).toBe(updateDto.name);
      expect(mockDb.update).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should soft delete a voter', async () => {
      const mockVoter = { id: '123', name: 'João Silva' };

      // Mock findOne
      jest.spyOn(mockDb, 'from').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce([mockVoter]);

      // Mock update (soft delete)
      jest.spyOn(mockDb, 'set').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce(undefined);

      const result = await service.remove('123');

      expect(result.message).toBe('Voter deleted successfully');
      expect(mockDb.update).toHaveBeenCalled();
    });
  });

  describe('geocodeVoter', () => {
    it('should geocode voter address', async () => {
      const mockVoter = {
        id: '123',
        name: 'João Silva',
        address: 'Rua das Flores',
        addressNumber: '123',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-567',
        latitude: null,
        longitude: null,
      };

      const geocodingResult = {
        latitude: -23.5505,
        longitude: -46.6333,
      };

      // Mock findOne
      jest.spyOn(mockDb, 'from').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce([mockVoter]);

      mockMapsService.geocodeAddress.mockResolvedValue(geocodingResult);

      // Mock findOne again for update
      jest.spyOn(mockDb, 'from').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce([mockVoter]);

      // Mock update
      jest.spyOn(mockDb, 'set').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce(mockDb);
      mockDb.returning.mockResolvedValueOnce([{
        ...mockVoter,
        latitude: '-23.5505',
        longitude: '-46.6333',
      }]);

      const result = await service.geocodeVoter('123');

      expect(mockMapsService.geocodeAddress).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should throw error when voter has no address', async () => {
      const mockVoter = {
        id: '123',
        name: 'João Silva',
        address: null,
        city: null,
      };

      jest.spyOn(mockDb, 'from').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce([mockVoter]);

      await expect(service.geocodeVoter('123')).rejects.toThrow('Voter has no address to geocode');
    });
  });

  describe('bulkDelete', () => {
    it('should delete multiple voters', async () => {
      const ids = ['1', '2', '3'];

      // Mock each select/update cycle
      // First voter
      jest.spyOn(mockDb, 'from').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce([{ id: '1' }]);
      jest.spyOn(mockDb, 'from').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'set').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce(undefined);

      // Second voter
      jest.spyOn(mockDb, 'from').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce([{ id: '2' }]);
      jest.spyOn(mockDb, 'from').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'set').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce(undefined);

      // Third voter
      jest.spyOn(mockDb, 'from').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce([{ id: '3' }]);
      jest.spyOn(mockDb, 'from').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'set').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce(undefined);

      const result = await service.bulkDelete(ids);

      expect(result.requested).toBe(3);
      expect(result.deleted).toBe(3);
    });
  });

  describe('getStatistics', () => {
    it('should return voter statistics', async () => {
      const mockVoters = [
        {
          id: '1',
          name: 'Voter 1',
          gender: 'MASCULINO',
          supportLevel: 'FAVORAVEL',
          city: 'São Paulo',
          email: 'test@example.com',
          phone: '11999999999',
          hasWhatsapp: 'SIM',
          latitude: '-23.5505',
          longitude: '-46.6333',
          dateOfBirth: '1985-05-15',
          createdAt: new Date(),
        },
        {
          id: '2',
          name: 'Voter 2',
          gender: 'FEMININO',
          supportLevel: 'MUITO_FAVORAVEL',
          city: 'Rio de Janeiro',
          email: null,
          phone: null,
          hasWhatsapp: 'NAO',
          latitude: null,
          longitude: null,
          dateOfBirth: '1990-10-20',
          createdAt: new Date(),
        },
      ];

      jest.spyOn(mockDb, 'from').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce(mockVoters);

      const result = await service.getStatistics();

      expect(result.total).toBe(2);
      expect(result.byGender).toBeDefined();
      expect(result.bySupportLevel).toBeDefined();
      expect(result.contact.withEmail).toBe(1);
      expect(result.contact.withWhatsapp).toBe(1);
      expect(result.location.withCoordinates).toBe(1);
    });
  });
});

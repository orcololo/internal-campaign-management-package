import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { DatabaseService } from '../database/database.service';

describe('CalendarService', () => {
  let service: CalendarService;
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CalendarService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<CalendarService>(CalendarService);
    databaseService = module.get<DatabaseService>(DatabaseService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an event', async () => {
      const createEventDto = {
        title: 'Comício Central',
        type: 'COMICIO' as any,
        visibility: 'PUBLICO' as any,
        startDate: '2024-03-15',
        startTime: '14:00',
        endDate: '2024-03-15',
        endTime: '18:00',
        location: 'Praça Central',
      };

      const mockEvent = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        ...createEventDto,
        status: 'AGENDADO',
        createdAt: new Date(),
      };

      // Mock checkConflicts (no conflicts)
      jest.spyOn(mockDb, 'from').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce([]);

      // Mock insert
      mockDb.returning.mockResolvedValue([mockEvent]);

      const result = await service.create(createEventDto as any);

      expect(result).toBeDefined();
      expect(result.title).toBe(createEventDto.title);
      expect(mockDb.insert).toHaveBeenCalled();
    });

    it('should throw ConflictException when event conflicts', async () => {
      const createEventDto = {
        title: 'New Event',
        type: 'COMICIO' as any,
        visibility: 'PUBLICO' as any,
        startDate: '2024-03-15',
        startTime: '14:00',
        endDate: '2024-03-15',
        endTime: '18:00',
      };

      const conflictingEvent = {
        id: '999',
        title: 'Existing Event',
        startDate: '2024-03-15',
        startTime: '15:00',
        endDate: '2024-03-15',
        endTime: '17:00',
      };

      // Mock checkConflicts (with conflict)
      jest.spyOn(mockDb, 'from').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce([conflictingEvent]);

      await expect(service.create(createEventDto as any)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return paginated events', async () => {
      const mockEvents = [
        {
          id: '1',
          title: 'Event 1',
          type: 'COMICIO',
          startDate: '2024-03-15',
          startTime: '14:00',
        },
        {
          id: '2',
          title: 'Event 2',
          type: 'REUNIAO',
          startDate: '2024-03-16',
          startTime: '10:00',
        },
      ];

      // Mock count query
      jest.spyOn(mockDb, 'from').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce([{ count: 2 }]);

      // Mock data query
      jest.spyOn(mockDb, 'from').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'limit').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'offset').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'orderBy').mockReturnValueOnce(mockEvents);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result).toBeDefined();
      expect(result.data).toHaveLength(2);
      expect(result.meta.total).toBe(2);
    });

    it('should filter events by type', async () => {
      const query = { page: 1, limit: 10, type: 'COMICIO' };

      jest.spyOn(mockDb, 'from').mockReturnValue(mockDb);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce([{ count: 1 }]);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'limit').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'offset').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'orderBy').mockReturnValueOnce([{ id: '1', type: 'COMICIO' }]);

      const result = await service.findAll(query);

      expect(mockDb.where).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return an event by id', async () => {
      const mockEvent = {
        id: '123',
        title: 'Test Event',
        type: 'COMICIO',
        startDate: '2024-03-15',
      };

      jest.spyOn(mockDb, 'from').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce([mockEvent]);

      const result = await service.findOne('123');

      expect(result).toBeDefined();
      expect(result.id).toBe('123');
    });

    it('should throw NotFoundException when event not found', async () => {
      jest.spyOn(mockDb, 'from').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce([]);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an event', async () => {
      const mockEvent = {
        id: '123',
        title: 'Original Title',
        type: 'COMICIO',
        startDate: '2024-03-15',
        startTime: '14:00',
        endDate: '2024-03-15',
        endTime: '18:00',
      };

      const updateDto = { title: 'Updated Title' };

      // Mock findOne
      jest.spyOn(mockDb, 'from').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce([mockEvent]);

      // Mock update
      jest.spyOn(mockDb, 'set').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce(mockDb);
      mockDb.returning.mockResolvedValueOnce([{ ...mockEvent, ...updateDto }]);

      const result = await service.update('123', updateDto);

      expect(result.title).toBe(updateDto.title);
      expect(mockDb.update).toHaveBeenCalled();
    });

    it('should check for conflicts when updating date/time', async () => {
      const mockEvent = {
        id: '123',
        title: 'Event',
        type: 'COMICIO',
        startDate: '2024-03-15',
        startTime: '14:00',
        endDate: '2024-03-15',
        endTime: '18:00',
      };

      const updateDto = {
        startTime: '16:00',
      };

      // Mock findOne
      jest.spyOn(mockDb, 'from').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce([mockEvent]);

      // Mock checkConflicts (no conflicts)
      jest.spyOn(mockDb, 'from').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce([]);

      // Mock update
      jest.spyOn(mockDb, 'set').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce(mockDb);
      mockDb.returning.mockResolvedValueOnce([{ ...mockEvent, ...updateDto }]);

      const result = await service.update('123', updateDto);

      expect(result).toBeDefined();
    });
  });

  describe('remove', () => {
    it('should soft delete an event', async () => {
      const mockEvent = { id: '123', title: 'Event to Delete' };

      // Mock findOne
      jest.spyOn(mockDb, 'from').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce([mockEvent]);

      // Mock update (soft delete)
      jest.spyOn(mockDb, 'set').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce(undefined);

      const result = await service.remove('123');

      expect(result.message).toBe('Event deleted successfully');
      expect(mockDb.update).toHaveBeenCalled();
    });
  });

  describe('checkConflicts', () => {
    it('should return empty array when no conflicts', async () => {
      jest.spyOn(mockDb, 'from').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce([]);

      const result = await service.checkConflicts('2024-03-15', '14:00', '2024-03-15', '18:00');

      expect(result).toEqual([]);
    });

    it('should detect overlapping events', async () => {
      const existingEvent = {
        id: '999',
        title: 'Existing',
        startDate: '2024-03-15',
        startTime: '15:00',
        endDate: '2024-03-15',
        endTime: '17:00',
      };

      jest.spyOn(mockDb, 'from').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce([existingEvent]);

      const result = await service.checkConflicts('2024-03-15', '14:00', '2024-03-15', '18:00');

      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('getUpcomingEvents', () => {
    it('should return upcoming scheduled events', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      const mockEvents = [
        {
          id: '1',
          title: 'Upcoming Event',
          startDate: tomorrowStr,
          status: 'AGENDADO',
        },
      ];

      jest.spyOn(mockDb, 'from').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'orderBy').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'limit').mockReturnValueOnce(mockEvents);

      const result = await service.getUpcomingEvents(10);

      expect(result).toBeDefined();
    });
  });

  describe('getStatistics', () => {
    it('should return event statistics', async () => {
      const mockEvents = [
        {
          id: '1',
          title: 'Event 1',
          type: 'COMICIO',
          status: 'AGENDADO',
          visibility: 'PUBLICO',
          startDate: '2024-03-15',
        },
        {
          id: '2',
          title: 'Event 2',
          type: 'REUNIAO',
          status: 'CONCLUIDO',
          visibility: 'PRIVADO',
          startDate: '2024-03-10',
        },
      ];

      jest.spyOn(mockDb, 'from').mockReturnValueOnce(mockDb);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce(mockEvents);

      const result = await service.getStatistics();

      expect(result.total).toBe(2);
      expect(result.byType).toBeDefined();
      expect(result.byStatus).toBeDefined();
      expect(result.completed).toBe(1);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';

describe('CalendarController', () => {
  let controller: CalendarController;
  let service: CalendarService;

  const mockCalendarService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    checkConflicts: jest.fn(),
    getEventsByDateRange: jest.fn(),
    getUpcomingEvents: jest.fn(),
    getStatistics: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CalendarController],
      providers: [
        {
          provide: CalendarService,
          useValue: mockCalendarService,
        },
      ],
    }).compile();

    controller = module.get<CalendarController>(CalendarController);
    service = module.get<CalendarService>(CalendarService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an event', async () => {
      const createDto = {
        title: 'Comício Central',
        type: 'COMICIO',
        visibility: 'PUBLICO',
        startDate: '2024-03-15',
        startTime: '14:00',
        endDate: '2024-03-15',
        endTime: '18:00',
      };

      const mockEvent = { id: '1', ...createDto };
      mockCalendarService.create.mockResolvedValue(mockEvent);

      const result = await controller.create(createDto as any);

      expect(result).toEqual(mockEvent);
      expect(mockCalendarService.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return paginated events', async () => {
      const query = { page: 1, limit: 10 };
      const mockResult = {
        data: [{ id: '1', title: 'Event 1' }],
        meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
      };

      mockCalendarService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll(query as any);

      expect(result).toEqual(mockResult);
      expect(mockCalendarService.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('findOne', () => {
    it('should return an event by id', async () => {
      const mockEvent = { id: '1', title: 'Test Event' };
      mockCalendarService.findOne.mockResolvedValue(mockEvent);

      const result = await controller.findOne('1');

      expect(result).toEqual(mockEvent);
      expect(mockCalendarService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update an event', async () => {
      const updateDto = { title: 'Updated Event' };
      const mockEvent = { id: '1', title: 'Updated Event' };
      mockCalendarService.update.mockResolvedValue(mockEvent);

      const result = await controller.update('1', updateDto as any);

      expect(result).toEqual(mockEvent);
      expect(mockCalendarService.update).toHaveBeenCalledWith('1', updateDto);
    });
  });

  describe('remove', () => {
    it('should remove an event', async () => {
      const mockResult = { message: 'Event deleted successfully' };
      mockCalendarService.remove.mockResolvedValue(mockResult);

      const result = await controller.remove('1');

      expect(result).toEqual(mockResult);
      expect(mockCalendarService.remove).toHaveBeenCalledWith('1');
    });
  });

  describe('checkConflicts', () => {
    it('should check for event conflicts', async () => {
      const query = {
        startDate: '2024-03-15',
        startTime: '14:00',
        endDate: '2024-03-15',
        endTime: '18:00',
        excludeEventId: '1',
      };

      const mockConflicts = [
        {
          id: '2',
          title: 'Conflicting Event',
          startDate: '2024-03-15',
          startTime: '15:00',
        },
      ];

      mockCalendarService.checkConflicts.mockResolvedValue(mockConflicts);

      const result = await controller.checkConflicts(query as any);

      expect(result).toEqual(mockConflicts);
      expect(mockCalendarService.checkConflicts).toHaveBeenCalledWith(
        query.startDate,
        query.startTime,
        query.endDate,
        query.endTime,
        query.excludeEventId,
      );
    });
  });

  describe('getByDateRange', () => {
    it('should return events in date range', async () => {
      const startDate = '2024-03-01';
      const endDate = '2024-03-31';

      const mockEvents = [
        { id: '1', title: 'Event 1', startDate: '2024-03-15' },
        { id: '2', title: 'Event 2', startDate: '2024-03-20' },
      ];

      mockCalendarService.getEventsByDateRange.mockResolvedValue(mockEvents);

      const result = await controller.getByDateRange(startDate, endDate);

      expect(result).toEqual(mockEvents);
      expect(mockCalendarService.getEventsByDateRange).toHaveBeenCalledWith(
        startDate,
        endDate,
      );
    });
  });

  describe('getUpcoming', () => {
    it('should return upcoming events', async () => {
      const mockEvents = [
        { id: '1', title: 'Upcoming Event 1' },
        { id: '2', title: 'Upcoming Event 2' },
      ];

      mockCalendarService.getUpcomingEvents.mockResolvedValue(mockEvents);

      const result = await controller.getUpcoming('10');

      expect(result).toEqual(mockEvents);
      expect(mockCalendarService.getUpcomingEvents).toHaveBeenCalledWith(10);
    });

    it('should use default limit when not provided', async () => {
      const mockEvents = [
        { id: '1', title: 'Upcoming Event 1' },
      ];

      mockCalendarService.getUpcomingEvents.mockResolvedValue(mockEvents);

      const result = await controller.getUpcoming();

      expect(result).toEqual(mockEvents);
      expect(mockCalendarService.getUpcomingEvents).toHaveBeenCalledWith(10);
    });
  });

  describe('getStatistics', () => {
    it('should return event statistics', async () => {
      const mockStats = {
        total: 50,
        upcoming: 10,
        completed: 30,
        cancelled: 5,
        byType: { COMICIO: 20, REUNIAO: 30 },
      };

      mockCalendarService.getStatistics.mockResolvedValue(mockStats);

      const result = await controller.getStatistics();

      expect(result).toEqual(mockStats);
      expect(mockCalendarService.getStatistics).toHaveBeenCalled();
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

describe('AnalyticsController', () => {
  let controller: AnalyticsController;
  let service: AnalyticsService;

  const mockAnalyticsService = {
    getCampaignOverview: jest.fn(),
    getVoterAnalytics: jest.fn(),
    getEventAnalytics: jest.fn(),
    getCanvassingAnalytics: jest.fn(),
    getGeographicHeatmap: jest.fn(),
    getTimeSeriesData: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyticsController],
      providers: [
        {
          provide: AnalyticsService,
          useValue: mockAnalyticsService,
        },
      ],
    }).compile();

    controller = module.get<AnalyticsController>(AnalyticsController);
    service = module.get<AnalyticsService>(AnalyticsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCampaignOverview', () => {
    it('should return campaign overview', async () => {
      const mockOverview = {
        summary: {
          totalVoters: 1000,
          totalEvents: 50,
          totalCanvassingSessions: 20,
          totalDoorKnocks: 500,
        },
        voters: { total: 1000 },
        events: { total: 50 },
        canvassing: { totalSessions: 20 },
      };

      mockAnalyticsService.getCampaignOverview.mockResolvedValue(mockOverview);

      const result = await controller.getCampaignOverview();

      expect(result).toEqual(mockOverview);
      expect(mockAnalyticsService.getCampaignOverview).toHaveBeenCalled();
    });
  });

  describe('getVoterAnalytics', () => {
    it('should return voter analytics', async () => {
      const mockAnalytics = {
        total: 1000,
        demographics: {
          byGender: { MASCULINO: 600, FEMININO: 400 },
          byAge: { '25-34': 300, '35-44': 400 },
        },
        geographic: {
          byCity: { 'São Paulo': 500, 'Rio de Janeiro': 500 },
        },
      };

      mockAnalyticsService.getVoterAnalytics.mockResolvedValue(mockAnalytics);

      const result = await controller.getVoterAnalytics();

      expect(result).toEqual(mockAnalytics);
      expect(mockAnalyticsService.getVoterAnalytics).toHaveBeenCalled();
    });
  });

  describe('getEventAnalytics', () => {
    it('should return event analytics', async () => {
      const mockAnalytics = {
        total: 50,
        byType: { COMICIO: 20, REUNIAO: 30 },
        byStatus: { AGENDADO: 10, CONCLUIDO: 35, CANCELADO: 5 },
        upcoming: 10,
        completed: 35,
      };

      mockAnalyticsService.getEventAnalytics.mockResolvedValue(mockAnalytics);

      const result = await controller.getEventAnalytics();

      expect(result).toEqual(mockAnalytics);
      expect(mockAnalyticsService.getEventAnalytics).toHaveBeenCalled();
    });
  });

  describe('getCanvassingAnalytics', () => {
    it('should return canvassing analytics', async () => {
      const mockAnalytics = {
        sessions: {
          total: 20,
          completed: 15,
          inProgress: 3,
          planned: 2,
        },
        doorKnocks: {
          total: 500,
          supporters: 200,
          undecided: 150,
          opponents: 100,
        },
        performance: {
          conversionRate: 40,
          successRate: 70,
        },
      };

      mockAnalyticsService.getCanvassingAnalytics.mockResolvedValue(mockAnalytics);

      const result = await controller.getCanvassingAnalytics();

      expect(result).toEqual(mockAnalytics);
      expect(mockAnalyticsService.getCanvassingAnalytics).toHaveBeenCalled();
    });
  });

  describe('getGeographicHeatmap', () => {
    it('should return geographic heatmap data', async () => {
      const mockHeatmap = {
        points: [
          { lat: -23.5505, lng: -46.6333, supportLevel: 'FAVORAVEL' },
          { lat: -22.9068, lng: -43.1729, supportLevel: 'MUITO_FAVORAVEL' },
        ],
        summary: {
          total: 2,
          bySupportLevel: { FAVORAVEL: 1, MUITO_FAVORAVEL: 1 },
        },
      };

      mockAnalyticsService.getGeographicHeatmap.mockResolvedValue(mockHeatmap);

      const result = await controller.getGeographicHeatmap();

      expect(result).toEqual(mockHeatmap);
      expect(mockAnalyticsService.getGeographicHeatmap).toHaveBeenCalled();
    });
  });

  describe('getTimeSeriesData', () => {
    it('should return time series data for voter registrations', async () => {
      const startDate = '2024-03-01';
      const endDate = '2024-03-31';
      const metric = 'voter-registrations';

      const mockTimeSeries = [
        { date: '2024-03-01', count: 10 },
        { date: '2024-03-02', count: 15 },
        { date: '2024-03-03', count: 8 },
      ];

      mockAnalyticsService.getTimeSeriesData.mockResolvedValue(mockTimeSeries);

      const result = await controller.getTimeSeriesData(startDate, endDate, metric);

      expect(result).toEqual(mockTimeSeries);
      expect(mockAnalyticsService.getTimeSeriesData).toHaveBeenCalledWith(
        startDate,
        endDate,
        metric,
      );
    });

    it('should return time series data for events', async () => {
      const startDate = '2024-03-01';
      const endDate = '2024-03-31';
      const metric = 'events';

      const mockTimeSeries = [
        { date: '2024-03-15', count: 2 },
        { date: '2024-03-20', count: 3 },
      ];

      mockAnalyticsService.getTimeSeriesData.mockResolvedValue(mockTimeSeries);

      const result = await controller.getTimeSeriesData(startDate, endDate, metric);

      expect(result).toEqual(mockTimeSeries);
      expect(mockAnalyticsService.getTimeSeriesData).toHaveBeenCalledWith(
        startDate,
        endDate,
        metric,
      );
    });

    it('should return time series data for canvassing', async () => {
      const startDate = '2024-03-01';
      const endDate = '2024-03-31';
      const metric = 'canvassing';

      const mockTimeSeries = [
        { date: '2024-03-10', count: 25 },
        { date: '2024-03-11', count: 30 },
      ];

      mockAnalyticsService.getTimeSeriesData.mockResolvedValue(mockTimeSeries);

      const result = await controller.getTimeSeriesData(startDate, endDate, metric);

      expect(result).toEqual(mockTimeSeries);
      expect(mockAnalyticsService.getTimeSeriesData).toHaveBeenCalledWith(
        startDate,
        endDate,
        metric,
      );
    });
  });
});

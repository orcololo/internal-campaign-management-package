import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytics.service';
import { DatabaseService } from '../database/database.service';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let databaseService: DatabaseService;

  const mockDb = {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
  };

  const mockDatabaseService = {
    getDb: jest.fn(() => mockDb),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
    databaseService = module.get<DatabaseService>(DatabaseService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCampaignOverview', () => {
    it('should return comprehensive campaign overview', async () => {
      const mockVoters = [
        {
          id: '1',
          name: 'Voter 1',
          email: 'voter1@example.com',
          phone: '11999999999',
          hasWhatsapp: 'SIM',
          latitude: '-23.5505',
          longitude: '-46.6333',
          supportLevel: 'FAVORAVEL',
          city: 'São Paulo',
          gender: 'MASCULINO',
          createdAt: new Date(),
        },
        {
          id: '2',
          name: 'Voter 2',
          email: null,
          phone: null,
          hasWhatsapp: 'NAO',
          latitude: null,
          longitude: null,
          supportLevel: 'MUITO_FAVORAVEL',
          city: 'Rio de Janeiro',
          gender: 'FEMININO',
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        },
      ];

      const mockEvents = [
        {
          id: '1',
          title: 'Event 1',
          type: 'COMICIO',
          status: 'AGENDADO',
          visibility: 'PUBLICO',
          startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        },
        {
          id: '2',
          title: 'Event 2',
          type: 'REUNIAO',
          status: 'CONCLUIDO',
          visibility: 'PRIVADO',
          startDate: '2024-03-01',
        },
      ];

      const mockSessions = [
        {
          id: '1',
          name: 'Session 1',
          status: 'CONCLUIDA',
        },
        {
          id: '2',
          name: 'Session 2',
          status: 'EM_ANDAMENTO',
        },
      ];

      const mockDoorKnocks = [
        { id: '1', result: 'APOIADOR', sessionId: '1' },
        { id: '2', result: 'INDECISO', sessionId: '1' },
        { id: '3', result: 'OPOSITOR', sessionId: '2' },
        { id: '4', result: 'NAO_ATENDEU', sessionId: '2' },
      ];

      // Mock the Promise.all calls
      jest.spyOn(mockDb, 'where').mockReturnValueOnce(mockVoters);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce(mockEvents);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce(mockSessions);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce(mockDoorKnocks);

      // Mock trend calculation queries
      jest.spyOn(mockDb, 'where').mockReturnValue([]);

      const result = await service.getCampaignOverview();

      expect(result).toBeDefined();
      expect(result.summary.totalVoters).toBe(2);
      expect(result.summary.totalEvents).toBe(2);
      expect(result.summary.totalCanvassingSessions).toBe(2);
      expect(result.summary.totalDoorKnocks).toBe(4);

      expect(result.voters.total).toBe(2);
      expect(result.voters.withEmail).toBe(1);
      expect(result.voters.withPhone).toBe(1);
      expect(result.voters.withWhatsapp).toBe(1);
      expect(result.voters.withCoordinates).toBe(1);

      expect(result.events.total).toBe(2);
      expect(result.events.completed).toBe(1);

      expect(result.canvassing.totalSessions).toBe(2);
      expect(result.canvassing.completedSessions).toBe(1);
      expect(result.canvassing.inProgressSessions).toBe(1);
      expect(result.canvassing.results.supporters).toBe(1);
      expect(result.canvassing.results.undecided).toBe(1);
      expect(result.canvassing.results.opponents).toBe(1);
    });

    it('should calculate conversion rate correctly', async () => {
      const mockVoters: any[] = [];
      const mockEvents: any[] = [];
      const mockSessions: any[] = [];
      const mockDoorKnocks = [
        { id: '1', result: 'APOIADOR' },
        { id: '2', result: 'APOIADOR' },
        { id: '3', result: 'INDECISO' },
        { id: '4', result: 'NAO_ATENDEU' }, // Should not count in conversion
      ];

      jest.spyOn(mockDb, 'where').mockReturnValueOnce(mockVoters);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce(mockEvents);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce(mockSessions);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce(mockDoorKnocks);
      jest.spyOn(mockDb, 'where').mockReturnValue([]);

      const result = await service.getCampaignOverview();

      // Conversion rate = supporters / contacted (excluding NAO_ATENDEU)
      // 2 supporters / 3 contacted = 66.67% = 67% rounded
      expect(result.canvassing.conversionRate).toBe(67);
    });
  });

  describe('getVoterAnalytics', () => {
    it('should return comprehensive voter analytics', async () => {
      const mockVoters = [
        {
          id: '1',
          name: 'Voter 1',
          gender: 'MASCULINO',
          educationLevel: 'SUPERIOR_COMPLETO',
          incomeLevel: 'ACIMA_5_SALARIOS',
          maritalStatus: 'CASADO',
          city: 'São Paulo',
          neighborhood: 'Centro',
          state: 'SP',
          electoralZone: '001',
          supportLevel: 'FAVORAVEL',
          politicalParty: 'PARTIDO_A',
          email: 'voter1@example.com',
          phone: '11999999999',
          hasWhatsapp: 'SIM',
          preferredContact: 'WHATSAPP',
          latitude: '-23.5505',
          longitude: '-46.6333',
          facebook: 'voter1_fb',
          instagram: null,
          twitter: null,
          dateOfBirth: '1990-05-15',
        },
        {
          id: '2',
          name: 'Voter 2',
          gender: 'FEMININO',
          educationLevel: 'ENSINO_MEDIO',
          incomeLevel: '1_A_3_SALARIOS',
          maritalStatus: 'SOLTEIRO',
          city: 'Rio de Janeiro',
          neighborhood: 'Copacabana',
          state: 'RJ',
          electoralZone: '002',
          supportLevel: 'MUITO_FAVORAVEL',
          politicalParty: 'PARTIDO_B',
          email: null,
          phone: null,
          hasWhatsapp: 'NAO',
          preferredContact: 'EMAIL',
          latitude: null,
          longitude: null,
          facebook: null,
          instagram: 'voter2_ig',
          twitter: null,
          dateOfBirth: '1985-10-20',
        },
      ];

      jest.spyOn(mockDb, 'where').mockReturnValueOnce(mockVoters);

      const result = await service.getVoterAnalytics();

      expect(result.total).toBe(2);
      expect(result.demographics.byGender).toEqual({ MASCULINO: 1, FEMININO: 1 });
      expect(result.demographics.byEducationLevel).toEqual({ SUPERIOR_COMPLETO: 1, ENSINO_MEDIO: 1 });
      expect(result.geographic.byCity).toEqual({ 'São Paulo': 1, 'Rio de Janeiro': 1 });
      expect(result.political.bySupportLevel).toEqual({ FAVORAVEL: 1, MUITO_FAVORAVEL: 1 });
      expect(result.contact.withEmail).toBe(1);
      expect(result.contact.withPhone).toBe(1);
      expect(result.contact.withWhatsapp).toBe(1);
      expect(result.engagement.withCoordinates).toBe(1);
      expect(result.engagement.withSocialMedia).toBe(2);
    });

    it('should calculate age distribution correctly', async () => {
      const mockVoters = [
        { id: '1', dateOfBirth: '2002-01-01' }, // ~24 years old
        { id: '2', dateOfBirth: '1990-01-01' }, // ~36 years old
        { id: '3', dateOfBirth: '1970-01-01' }, // ~56 years old
        { id: '4', dateOfBirth: '1960-01-01' }, // ~66 years old
        { id: '5', dateOfBirth: null }, // No age
      ];

      jest.spyOn(mockDb, 'where').mockReturnValueOnce(mockVoters);

      const result = await service.getVoterAnalytics();

      expect(result.demographics.byAge).toBeDefined();
      expect(result.demographics.byAge.ageRanges).toBeDefined();
      expect(result.demographics.byAge.averageAge).toBeGreaterThan(0);
    });
  });

  describe('getEventAnalytics', () => {
    it('should return comprehensive event analytics', async () => {
      const today = new Date().toISOString().split('T')[0];
      const pastDate = '2024-01-15';
      const futureDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const mockEvents = [
        {
          id: '1',
          title: 'Past Event',
          type: 'COMICIO',
          status: 'CONCLUIDO',
          visibility: 'PUBLICO',
          startDate: pastDate,
          city: 'São Paulo',
          state: 'SP',
          expectedAttendees: '100',
          confirmedAttendees: '80',
        },
        {
          id: '2',
          title: 'Future Event',
          type: 'REUNIAO',
          status: 'AGENDADO',
          visibility: 'PRIVADO',
          startDate: futureDate,
          city: 'Rio de Janeiro',
          state: 'RJ',
          expectedAttendees: '50',
          confirmedAttendees: '30',
        },
        {
          id: '3',
          title: 'Cancelled Event',
          type: 'COMICIO',
          status: 'CANCELADO',
          visibility: 'PUBLICO',
          startDate: futureDate,
          city: 'São Paulo',
          state: 'SP',
          expectedAttendees: null,
          confirmedAttendees: null,
        },
      ];

      jest.spyOn(mockDb, 'where').mockReturnValueOnce(mockEvents);

      const result = await service.getEventAnalytics();

      expect(result.total).toBe(3);
      expect(result.byType.COMICIO).toBe(2);
      expect(result.byType.REUNIAO).toBe(1);
      expect(result.byStatus.CONCLUIDO).toBe(1);
      expect(result.byStatus.AGENDADO).toBe(1);
      expect(result.byStatus.CANCELADO).toBe(1);
      expect(result.completed).toBe(1);
      expect(result.cancelled).toBe(1);
      expect(result.attendance.totalExpected).toBe(150);
      expect(result.attendance.totalConfirmed).toBe(110);
      expect(result.geographic.byCity['São Paulo']).toBe(2);
    });

    it('should group events by month correctly', async () => {
      const mockEvents = [
        { id: '1', startDate: '2024-03-15', type: 'COMICIO', status: 'AGENDADO' },
        { id: '2', startDate: '2024-03-20', type: 'REUNIAO', status: 'AGENDADO' },
        { id: '3', startDate: '2024-04-10', type: 'COMICIO', status: 'AGENDADO' },
      ];

      jest.spyOn(mockDb, 'where').mockReturnValueOnce(mockEvents);

      const result = await service.getEventAnalytics();

      expect(result.timeline).toBeDefined();
      expect(result.timeline['2024-03']).toBe(2);
      expect(result.timeline['2024-04']).toBe(1);
    });
  });

  describe('getCanvassingAnalytics', () => {
    it('should return comprehensive canvassing analytics', async () => {
      const mockSessions = [
        {
          id: '1',
          name: 'Session 1',
          status: 'CONCLUIDA',
          region: 'Norte',
          neighborhood: 'Bairro A',
        },
        {
          id: '2',
          name: 'Session 2',
          status: 'EM_ANDAMENTO',
          region: 'Sul',
          neighborhood: 'Bairro B',
        },
        {
          id: '3',
          name: 'Session 3',
          status: 'PLANEJADA',
          region: 'Norte',
          neighborhood: 'Bairro A',
        },
      ];

      const mockDoorKnocks = [
        { id: '1', result: 'APOIADOR', followUpRequired: false },
        { id: '2', result: 'APOIADOR', followUpRequired: false },
        { id: '3', result: 'INDECISO', followUpRequired: true },
        { id: '4', result: 'OPOSITOR', followUpRequired: false },
        { id: '5', result: 'NAO_ATENDEU', followUpRequired: true },
        { id: '6', result: 'RECUSOU_CONTATO', followUpRequired: false },
      ];

      jest.spyOn(mockDb, 'where').mockReturnValueOnce(mockSessions);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce(mockDoorKnocks);

      const result = await service.getCanvassingAnalytics();

      expect(result.sessions.total).toBe(3);
      expect(result.sessions.completed).toBe(1);
      expect(result.sessions.inProgress).toBe(1);
      expect(result.sessions.planned).toBe(1);
      expect(result.sessions.byRegion.Norte).toBe(2);
      expect(result.sessions.byRegion.Sul).toBe(1);

      expect(result.doorKnocks.total).toBe(6);
      expect(result.doorKnocks.supporters).toBe(2);
      expect(result.doorKnocks.undecided).toBe(1);
      expect(result.doorKnocks.opponents).toBe(1);
      expect(result.doorKnocks.notHome).toBe(1);
      expect(result.doorKnocks.refused).toBe(1);
      expect(result.doorKnocks.requiresFollowUp).toBe(2);

      expect(result.performance.averagePerSession).toBe(2); // 6 knocks / 3 sessions
    });

    it('should calculate success rate correctly', async () => {
      const mockSessions: any[] = [];
      const mockDoorKnocks = [
        { id: '1', result: 'APOIADOR' }, // Success
        { id: '2', result: 'INDECISO' }, // Success
        { id: '3', result: 'OPOSITOR' }, // Not success
        { id: '4', result: 'NAO_ATENDEU' }, // Not success
      ];

      jest.spyOn(mockDb, 'where').mockReturnValueOnce(mockSessions);
      jest.spyOn(mockDb, 'where').mockReturnValueOnce(mockDoorKnocks);

      const result = await service.getCanvassingAnalytics();

      // Success rate = (supporters + undecided) / total = 2/4 = 50%
      expect(result.performance.successRate).toBe(50);
    });
  });

  describe('getGeographicHeatmap', () => {
    it('should return geographic heatmap data', async () => {
      const mockVoters = [
        {
          id: '1',
          latitude: '-23.5505',
          longitude: '-46.6333',
          supportLevel: 'FAVORAVEL',
          city: 'São Paulo',
          neighborhood: 'Centro',
        },
        {
          id: '2',
          latitude: '-22.9068',
          longitude: '-43.1729',
          supportLevel: 'MUITO_FAVORAVEL',
          city: 'Rio de Janeiro',
          neighborhood: 'Copacabana',
        },
      ];

      jest.spyOn(mockDb, 'where').mockReturnValueOnce(mockVoters);

      const result = await service.getGeographicHeatmap();

      expect(result.points).toHaveLength(2);
      expect(result.points[0].lat).toBe(-23.5505);
      expect(result.points[0].lng).toBe(-46.6333);
      expect(result.points[0].supportLevel).toBe('FAVORAVEL');
      expect(result.summary.total).toBe(2);
      expect(result.summary.bySupportLevel.FAVORAVEL).toBe(1);
      expect(result.summary.byCity['São Paulo']).toBe(1);
    });

    it('should handle empty data', async () => {
      jest.spyOn(mockDb, 'where').mockReturnValueOnce([]);

      const result = await service.getGeographicHeatmap();

      expect(result.points).toHaveLength(0);
      expect(result.summary.total).toBe(0);
    });
  });

  describe('getTimeSeriesData', () => {
    it('should return time series data for voter registrations', async () => {
      const mockVoters = [
        { id: '1', createdAt: '2024-03-15T10:00:00Z' },
        { id: '2', createdAt: '2024-03-15T14:00:00Z' },
        { id: '3', createdAt: '2024-03-16T10:00:00Z' },
      ];

      jest.spyOn(mockDb, 'where').mockReturnValueOnce(mockVoters);

      const result = await service.getTimeSeriesData('2024-03-01', '2024-03-31', 'voter-registrations');

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return time series data for events', async () => {
      const mockEvents = [
        { id: '1', startDate: '2024-03-15' },
        { id: '2', startDate: '2024-03-20' },
      ];

      jest.spyOn(mockDb, 'where').mockReturnValueOnce(mockEvents);

      const result = await service.getTimeSeriesData('2024-03-01', '2024-03-31', 'events');

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return time series data for canvassing', async () => {
      const mockDoorKnocks = [
        { id: '1', contactedAt: '2024-03-15T10:00:00Z' },
        { id: '2', contactedAt: '2024-03-15T14:00:00Z' },
      ];

      jest.spyOn(mockDb, 'where').mockReturnValueOnce(mockDoorKnocks);

      const result = await service.getTimeSeriesData('2024-03-01', '2024-03-31', 'canvassing');

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle unknown metric type', async () => {
      const result = await service.getTimeSeriesData('2024-03-01', '2024-03-31', 'unknown-metric');

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(0);
    });
  });
});

import { Injectable } from '@nestjs/common';
import { eq, and, isNull, sql, gte, lte } from 'drizzle-orm';
import { DatabaseService } from '../database/database.service';
import { voters, events, canvassingSessions, doorKnocks, metrics } from '../database/schemas';

@Injectable()
export class AnalyticsService {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Get comprehensive campaign overview
   */
  async getCampaignOverview() {
    const db = this.databaseService.getDb();

    // Get all data
    const [allVoters, allEvents, allSessions, allDoorKnocks] = await Promise.all([
      db.select().from(voters).where(isNull(voters.deletedAt)),
      db.select().from(events).where(isNull(events.deletedAt)),
      db.select().from(canvassingSessions).where(isNull(canvassingSessions.deletedAt)),
      db.select().from(doorKnocks).where(isNull(doorKnocks.deletedAt)),
    ]);

    const today = new Date().toISOString().split('T')[0];
    const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    return {
      summary: {
        totalVoters: allVoters.length,
        totalEvents: allEvents.length,
        totalCanvassingSessions: allSessions.length,
        totalDoorKnocks: allDoorKnocks.length,
      },
      voters: {
        total: allVoters.length,
        withEmail: allVoters.filter((v) => v.email).length,
        withPhone: allVoters.filter((v) => v.phone).length,
        withWhatsapp: allVoters.filter((v) => v.hasWhatsapp === 'SIM').length,
        withCoordinates: allVoters.filter((v) => v.latitude && v.longitude).length,
        bySupportLevel: this.groupBy(allVoters, 'supportLevel'),
        byCity: this.groupBy(allVoters, 'city'),
        byGender: this.groupBy(allVoters, 'gender'),
        recent: {
          last7Days: allVoters.filter((v) => new Date(v.createdAt) >= new Date(last7Days)).length,
          last30Days: allVoters.filter((v) => new Date(v.createdAt) >= new Date(last30Days)).length,
        },
      },
      events: {
        total: allEvents.length,
        upcoming: allEvents.filter((e) => e.startDate >= today && e.status === 'AGENDADO').length,
        completed: allEvents.filter((e) => e.status === 'CONCLUIDO').length,
        cancelled: allEvents.filter((e) => e.status === 'CANCELADO').length,
        byType: this.groupBy(allEvents, 'type'),
        byStatus: this.groupBy(allEvents, 'status'),
        byVisibility: this.groupBy(allEvents, 'visibility'),
        thisMonth: allEvents.filter((e) => {
          const eventDate = new Date(e.startDate);
          const now = new Date();
          return (
            eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear()
          );
        }).length,
      },
      canvassing: {
        totalSessions: allSessions.length,
        completedSessions: allSessions.filter((s) => s.status === 'CONCLUIDA').length,
        inProgressSessions: allSessions.filter((s) => s.status === 'EM_ANDAMENTO').length,
        totalDoorKnocks: allDoorKnocks.length,
        results: {
          supporters: allDoorKnocks.filter((d) => d.result === 'APOIADOR').length,
          undecided: allDoorKnocks.filter((d) => d.result === 'INDECISO').length,
          opponents: allDoorKnocks.filter((d) => d.result === 'OPOSITOR').length,
          notHome: allDoorKnocks.filter((d) => d.result === 'NAO_ATENDEU').length,
          refused: allDoorKnocks.filter((d) => d.result === 'RECUSOU_CONTATO').length,
        },
        byResult: this.groupBy(allDoorKnocks, 'result'),
        conversionRate: this.calculateConversionRate(allDoorKnocks),
      },
      trends: await Promise.all([
        this.calculateVoterGrowthTrend(),
        this.calculateEventActivityTrend(),
        this.calculateCanvassingProgressTrend(),
      ]).then(([voterGrowth, eventActivity, canvassingProgress]) => ({
        voterGrowth,
        eventActivity,
        canvassingProgress,
      })),
    };
  }

  /**
   * Get voter analytics
   */
  async getVoterAnalytics() {
    const db = this.databaseService.getDb();

    const allVoters = await db.select().from(voters).where(isNull(voters.deletedAt));

    return {
      total: allVoters.length,
      demographics: {
        byGender: this.groupBy(allVoters, 'gender'),
        byEducationLevel: this.groupBy(allVoters, 'educationLevel'),
        byIncomeLevel: this.groupBy(allVoters, 'incomeLevel'),
        byMaritalStatus: this.groupBy(allVoters, 'maritalStatus'),
        byAge: this.calculateAgeDistribution(allVoters),
      },
      geographic: {
        byCity: this.groupBy(allVoters, 'city'),
        byNeighborhood: this.groupBy(allVoters, 'neighborhood'),
        byState: this.groupBy(allVoters, 'state'),
        byElectoralZone: this.groupBy(allVoters, 'electoralZone'),
      },
      political: {
        bySupportLevel: this.groupBy(allVoters, 'supportLevel'),
        byPoliticalParty: this.groupBy(allVoters, 'politicalParty'),
      },
      contact: {
        withEmail: allVoters.filter((v) => v.email).length,
        withPhone: allVoters.filter((v) => v.phone).length,
        withWhatsapp: allVoters.filter((v) => v.hasWhatsapp === 'SIM').length,
        preferredContactMethod: this.groupBy(allVoters, 'preferredContact'),
      },
      engagement: {
        withCoordinates: allVoters.filter((v) => v.latitude && v.longitude).length,
        withSocialMedia: allVoters.filter((v) => v.facebook || v.instagram || v.twitter).length,
      },
    };
  }

  /**
   * Get event analytics
   */
  async getEventAnalytics() {
    const db = this.databaseService.getDb();

    const allEvents = await db.select().from(events).where(isNull(events.deletedAt));

    const today = new Date().toISOString().split('T')[0];

    return {
      total: allEvents.length,
      byType: this.groupBy(allEvents, 'type'),
      byStatus: this.groupBy(allEvents, 'status'),
      byVisibility: this.groupBy(allEvents, 'visibility'),
      upcoming: allEvents.filter((e) => e.startDate >= today && e.status === 'AGENDADO').length,
      past: allEvents.filter((e) => e.startDate < today).length,
      completed: allEvents.filter((e) => e.status === 'CONCLUIDO').length,
      cancelled: allEvents.filter((e) => e.status === 'CANCELADO').length,
      geographic: {
        byCity: this.groupBy(allEvents, 'city'),
        byState: this.groupBy(allEvents, 'state'),
      },
      attendance: {
        totalExpected: this.sumNumericField(allEvents, 'expectedAttendees'),
        totalConfirmed: this.sumNumericField(allEvents, 'confirmedAttendees'),
      },
      timeline: this.groupEventsByMonth(allEvents),
    };
  }

  /**
   * Get canvassing analytics
   */
  async getCanvassingAnalytics() {
    const db = this.databaseService.getDb();

    const [allSessions, allDoorKnocks] = await Promise.all([
      db.select().from(canvassingSessions).where(isNull(canvassingSessions.deletedAt)),
      db.select().from(doorKnocks).where(isNull(doorKnocks.deletedAt)),
    ]);

    return {
      sessions: {
        total: allSessions.length,
        byStatus: this.groupBy(allSessions, 'status'),
        completed: allSessions.filter((s) => s.status === 'CONCLUIDA').length,
        inProgress: allSessions.filter((s) => s.status === 'EM_ANDAMENTO').length,
        planned: allSessions.filter((s) => s.status === 'PLANEJADA').length,
        byRegion: this.groupBy(allSessions, 'region'),
        byNeighborhood: this.groupBy(allSessions, 'neighborhood'),
      },
      doorKnocks: {
        total: allDoorKnocks.length,
        byResult: this.groupBy(allDoorKnocks, 'result'),
        supporters: allDoorKnocks.filter((d) => d.result === 'APOIADOR').length,
        undecided: allDoorKnocks.filter((d) => d.result === 'INDECISO').length,
        opponents: allDoorKnocks.filter((d) => d.result === 'OPOSITOR').length,
        notHome: allDoorKnocks.filter((d) => d.result === 'NAO_ATENDEU').length,
        refused: allDoorKnocks.filter((d) => d.result === 'RECUSOU_CONTATO').length,
        requiresFollowUp: allDoorKnocks.filter((d) => d.followUpRequired).length,
      },
      performance: {
        conversionRate: this.calculateConversionRate(allDoorKnocks),
        averagePerSession: allSessions.length > 0 ? allDoorKnocks.length / allSessions.length : 0,
        successRate: this.calculateSuccessRate(allDoorKnocks),
      },
    };
  }

  /**
   * Get geographic heatmap data
   */
  async getGeographicHeatmap() {
    const db = this.databaseService.getDb();

    const votersWithCoordinates = await db
      .select()
      .from(voters)
      .where(
        and(
          isNull(voters.deletedAt),
          sql`${voters.latitude} IS NOT NULL`,
          sql`${voters.longitude} IS NOT NULL`,
        ),
      );

    return {
      points: votersWithCoordinates.map((v) => ({
        lat: parseFloat(v.latitude as string),
        lng: parseFloat(v.longitude as string),
        supportLevel: v.supportLevel,
        city: v.city,
        neighborhood: v.neighborhood,
      })),
      summary: {
        total: votersWithCoordinates.length,
        bySupportLevel: this.groupBy(votersWithCoordinates, 'supportLevel'),
        byCity: this.groupBy(votersWithCoordinates, 'city'),
      },
    };
  }

  /**
   * Get time series data
   */
  async getTimeSeriesData(startDate: string, endDate: string, metric: string) {
    const db = this.databaseService.getDb();

    let data: any[] = [];

    switch (metric) {
      case 'voter-registrations':
        data = await db
          .select()
          .from(voters)
          .where(
            and(
              isNull(voters.deletedAt),
              gte(sql`DATE(${voters.createdAt})`, startDate),
              lte(sql`DATE(${voters.createdAt})`, endDate),
            ),
          );
        break;

      case 'events':
        data = await db
          .select()
          .from(events)
          .where(
            and(
              isNull(events.deletedAt),
              gte(events.startDate, startDate),
              lte(events.startDate, endDate),
            ),
          );
        break;

      case 'canvassing':
        data = await db
          .select()
          .from(doorKnocks)
          .where(
            and(
              isNull(doorKnocks.deletedAt),
              gte(sql`DATE(${doorKnocks.contactedAt})`, startDate),
              lte(sql`DATE(${doorKnocks.contactedAt})`, endDate),
            ),
          );
        break;
    }

    return this.groupByDate(data, metric);
  }

  // Helper methods

  private groupBy<T extends Record<string, any>>(
    items: T[],
    field: keyof T,
  ): Record<string, number> {
    return items.reduce(
      (acc, item) => {
        const value = item[field] || 'NOT_SPECIFIED';
        acc[value as string] = (acc[value as string] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
  }

  private calculateAgeDistribution<T extends { dateOfBirth?: string | null }>(voters: T[]) {
    const votersWithAge = voters.filter((v) => v.dateOfBirth);

    if (votersWithAge.length === 0) {
      return { ageRanges: {}, averageAge: null };
    }

    const ages = votersWithAge.map((v) => {
      const birthDate = new Date(v.dateOfBirth!);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    });

    const averageAge = Math.round(ages.reduce((a, b) => a + b, 0) / ages.length);

    return {
      ageRanges: {
        '16-24': ages.filter((age) => age >= 16 && age <= 24).length,
        '25-34': ages.filter((age) => age >= 25 && age <= 34).length,
        '35-44': ages.filter((age) => age >= 35 && age <= 44).length,
        '45-59': ages.filter((age) => age >= 45 && age <= 59).length,
        '60+': ages.filter((age) => age >= 60).length,
      },
      averageAge,
    };
  }

  private calculateConversionRate<T extends { result?: string | null }>(doorKnocks: T[]): number {
    if (doorKnocks.length === 0) return 0;
    const contacted = doorKnocks.filter((d) => d.result !== 'NAO_ATENDEU').length;
    const supporters = doorKnocks.filter((d) => d.result === 'APOIADOR').length;
    return contacted > 0 ? Math.round((supporters / contacted) * 100) : 0;
  }

  private calculateSuccessRate<T extends { result?: string | null }>(doorKnocks: T[]): number {
    if (doorKnocks.length === 0) return 0;
    const successful = doorKnocks.filter(
      (d) => d.result === 'APOIADOR' || d.result === 'INDECISO',
    ).length;
    return Math.round((successful / doorKnocks.length) * 100);
  }

  private sumNumericField<T extends Record<string, any>>(items: T[], field: keyof T): number {
    return items.reduce((sum, item) => {
      const value = item[field];
      if (!value) return sum;
      const numeric = parseInt(value.toString().replace(/\D/g, ''));
      return sum + (isNaN(numeric) ? 0 : numeric);
    }, 0);
  }

  private groupEventsByMonth<T extends { startDate: string }>(events: T[]) {
    const byMonth: Record<string, number> = {};
    events.forEach((event) => {
      const date = new Date(event.startDate);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      byMonth[key] = (byMonth[key] || 0) + 1;
    });
    return byMonth;
  }

  private groupByDate<T extends Record<string, any>>(items: T[], type: string) {
    const byDate: Record<string, number> = {};
    const dateField =
      type === 'voter-registrations'
        ? 'createdAt'
        : type === 'events'
          ? 'startDate'
          : 'contactedAt';

    items.forEach((item) => {
      const date = new Date(item[dateField]);
      const key = date.toISOString().split('T')[0];
      byDate[key] = (byDate[key] || 0) + 1;
    });

    return Object.entries(byDate)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  private async calculateVoterGrowthTrend() {
    // Calculate daily growth over last 30 days
    const db = this.databaseService.getDb();
    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const recentVoters = await db
      .select()
      .from(voters)
      .where(and(isNull(voters.deletedAt), gte(sql`DATE(${voters.createdAt})`, last30Days)));

    return this.groupByDate(recentVoters, 'voter-registrations');
  }

  private async calculateEventActivityTrend() {
    const db = this.databaseService.getDb();
    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const recentEvents = await db
      .select()
      .from(events)
      .where(and(isNull(events.deletedAt), gte(events.startDate, last30Days)));

    return this.groupByDate(recentEvents, 'events');
  }

  private async calculateCanvassingProgressTrend() {
    const db = this.databaseService.getDb();
    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const recentDoorKnocks = await db
      .select()
      .from(doorKnocks)
      .where(
        and(isNull(doorKnocks.deletedAt), gte(sql`DATE(${doorKnocks.contactedAt})`, last30Days)),
      );

    return this.groupByDate(recentDoorKnocks, 'canvassing');
  }
}

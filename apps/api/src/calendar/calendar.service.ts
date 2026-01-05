import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { eq, and, isNull, ilike, or, sql, gte, lte } from 'drizzle-orm';
import { DatabaseService } from '../database/database.service';
import { events } from '../database/schemas';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { QueryEventsDto } from './dto/query-events.dto';

@Injectable()
export class CalendarService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createEventDto: CreateEventDto) {
    const db = this.databaseService.getDb();

    // Check for conflicts before creating
    const conflicts = await this.checkConflicts(
      createEventDto.startDate,
      createEventDto.startTime,
      createEventDto.endDate,
      createEventDto.endTime,
    );

    if (conflicts.length > 0) {
      throw new ConflictException({
        message: 'Event conflicts with existing events',
        conflicts: conflicts.map(c => ({
          id: c.id,
          title: c.title,
          startDate: c.startDate,
          startTime: c.startTime,
          endDate: c.endDate,
          endTime: c.endTime,
        })),
      });
    }

    const [event] = await db
      .insert(events)
      .values(createEventDto as any)
      .returning();

    return event;
  }

  async findAll(query: QueryEventsDto) {
    const db = this.databaseService.getDb();
    const { page = 1, limit = 10 } = query;
    const offset = (page - 1) * limit;

    // Build where conditions
    const conditions = [isNull(events.deletedAt)];

    // Search by title or location
    if (query.search) {
      const searchCondition = or(
        ilike(events.title, `%${query.search}%`),
        ilike(events.location, `%${query.search}%`),
      );
      if (searchCondition) {
        conditions.push(searchCondition);
      }
    }

    // Filter by type
    if (query.type) {
      conditions.push(eq(events.type, query.type as any));
    }

    // Filter by status
    if (query.status) {
      conditions.push(eq(events.status, query.status as any));
    }

    // Filter by visibility
    if (query.visibility) {
      conditions.push(eq(events.visibility, query.visibility as any));
    }

    // Filter by date range
    if (query.startDateFrom) {
      conditions.push(gte(events.startDate, query.startDateFrom));
    }
    if (query.startDateTo) {
      conditions.push(lte(events.startDate, query.startDateTo));
    }

    // Filter by city
    if (query.city) {
      conditions.push(eq(events.city, query.city));
    }

    // Get total count and paginated results in parallel
    const [countResult, results] = await Promise.all([
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(events)
        .where(and(...conditions)),
      db
        .select()
        .from(events)
        .where(and(...conditions))
        .limit(limit)
        .offset(offset)
        .orderBy(events.startDate, events.startTime),
    ]);

    const [{ count }] = countResult;

    return {
      data: results,
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async findOne(id: string) {
    const db = this.databaseService.getDb();

    const [event] = await db
      .select()
      .from(events)
      .where(and(eq(events.id, id), isNull(events.deletedAt)));

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    const db = this.databaseService.getDb();

    // Check if event exists
    const existingEvent = await this.findOne(id);

    // Check for conflicts if date/time is being updated
    if (
      updateEventDto.startDate ||
      updateEventDto.startTime ||
      updateEventDto.endDate ||
      updateEventDto.endTime
    ) {
      const conflicts = await this.checkConflicts(
        updateEventDto.startDate || existingEvent.startDate,
        updateEventDto.startTime || existingEvent.startTime,
        updateEventDto.endDate || existingEvent.endDate,
        updateEventDto.endTime || existingEvent.endTime,
        id, // Exclude current event from conflict check
      );

      if (conflicts.length > 0) {
        throw new ConflictException({
          message: 'Event update would create conflicts with existing events',
          conflicts: conflicts.map(c => ({
            id: c.id,
            title: c.title,
            startDate: c.startDate,
            startTime: c.startTime,
            endDate: c.endDate,
            endTime: c.endTime,
          })),
        });
      }
    }

    const [event] = await db
      .update(events)
      .set({ ...updateEventDto, updatedAt: new Date() } as any)
      .where(eq(events.id, id))
      .returning();

    return event;
  }

  async remove(id: string) {
    const db = this.databaseService.getDb();

    // Check if event exists
    await this.findOne(id);

    // Soft delete
    await db
      .update(events)
      .set({ deletedAt: new Date() })
      .where(eq(events.id, id));

    return { message: 'Event deleted successfully' };
  }

  /**
   * Check for scheduling conflicts
   */
  async checkConflicts(
    startDate: string,
    startTime: string,
    endDate: string,
    endTime: string,
    excludeEventId?: string,
  ) {
    const db = this.databaseService.getDb();

    const conditions = [isNull(events.deletedAt)];

    // Exclude specific event if provided (for updates)
    if (excludeEventId) {
      conditions.push(sql`${events.id} != ${excludeEventId}`);
    }

    // Get all events that might conflict
    const allEvents = await db
      .select()
      .from(events)
      .where(and(...conditions));

    // Filter for actual conflicts
    const conflicts = allEvents.filter((event) => {
      const newStart = new Date(`${startDate}T${startTime}`);
      const newEnd = new Date(`${endDate}T${endTime}`);
      const existingStart = new Date(`${event.startDate}T${event.startTime}`);
      const existingEnd = new Date(`${event.endDate}T${event.endTime}`);

      // Check if there's an overlap
      return (
        (newStart >= existingStart && newStart < existingEnd) || // New starts during existing
        (newEnd > existingStart && newEnd <= existingEnd) || // New ends during existing
        (newStart <= existingStart && newEnd >= existingEnd) // New encompasses existing
      );
    });

    return conflicts;
  }

  /**
   * Get events for a specific date range
   */
  async getEventsByDateRange(startDate: string, endDate: string) {
    const db = this.databaseService.getDb();

    const result = await db
      .select()
      .from(events)
      .where(
        and(
          isNull(events.deletedAt),
          gte(events.startDate, startDate),
          lte(events.endDate, endDate),
        ),
      )
      .orderBy(events.startDate, events.startTime);

    return result;
  }

  /**
   * Get upcoming events
   */
  async getUpcomingEvents(limit = 10) {
    const db = this.databaseService.getDb();
    const today = new Date().toISOString().split('T')[0];

    const upcomingEvents = await db
      .select()
      .from(events)
      .where(
        and(
          isNull(events.deletedAt),
          gte(events.startDate, today),
          eq(events.status, 'AGENDADO'),
        ),
      )
      .orderBy(events.startDate, events.startTime)
      .limit(limit);

    return upcomingEvents;
  }

  /**
   * Get event statistics
   */
  async getStatistics() {
    const db = this.databaseService.getDb();

    const allEvents = await db
      .select()
      .from(events)
      .where(isNull(events.deletedAt));

    const today = new Date().toISOString().split('T')[0];

    const stats = {
      total: allEvents.length,
      byType: this.groupBy(allEvents, 'type'),
      byStatus: this.groupBy(allEvents, 'status'),
      byVisibility: this.groupBy(allEvents, 'visibility'),
      upcoming: allEvents.filter(e => e.startDate >= today && e.status === 'AGENDADO').length,
      completed: allEvents.filter(e => e.status === 'CONCLUIDO').length,
      cancelled: allEvents.filter(e => e.status === 'CANCELADO').length,
      thisMonth: allEvents.filter(e => {
        const eventDate = new Date(e.startDate);
        const now = new Date();
        return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
      }).length,
    };

    return stats;
  }

  /**
   * Helper: Group events by a field
   */
  private groupBy<T extends Record<string, any>>(events: T[], field: keyof T): Record<string, number> {
    return events.reduce((acc, event) => {
      const value = event[field] || 'NOT_SPECIFIED';
      acc[value as string] = (acc[value as string] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }
}

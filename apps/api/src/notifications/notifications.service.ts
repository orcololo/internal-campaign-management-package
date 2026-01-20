import { Injectable } from '@nestjs/common';
import { eq, and, desc, sql } from 'drizzle-orm';
import { DatabaseService } from '../database/database.service';
import { notifications, NotificationType, NewNotification } from '../database/schemas';

export interface CreateNotificationInput {
    userId: string;
    type: NotificationType;
    title: string;
    message?: string;
    link?: string;
}

@Injectable()
export class NotificationsService {
    constructor(private readonly databaseService: DatabaseService) { }

    /**
     * Create a new notification
     */
    async create(input: CreateNotificationInput): Promise<void> {
        const db = this.databaseService.getDb();

        await db.insert(notifications).values({
            userId: input.userId,
            type: input.type,
            title: input.title,
            message: input.message,
            link: input.link,
        });
    }

    /**
     * Create notifications for multiple users
     */
    async createForUsers(userIds: string[], input: Omit<CreateNotificationInput, 'userId'>): Promise<void> {
        const db = this.databaseService.getDb();

        const values = userIds.map(userId => ({
            userId,
            type: input.type,
            title: input.title,
            message: input.message,
            link: input.link,
        }));

        await db.insert(notifications).values(values);
    }

    /**
     * Get notifications for a user
     */
    async findByUser(userId: string, limit = 50, includeRead = false) {
        const db = this.databaseService.getDb();

        const conditions = includeRead
            ? eq(notifications.userId, userId)
            : and(eq(notifications.userId, userId), eq(notifications.read, false));

        return db
            .select()
            .from(notifications)
            .where(conditions)
            .orderBy(desc(notifications.createdAt))
            .limit(limit);
    }

    /**
     * Count unread notifications
     */
    async countUnread(userId: string): Promise<number> {
        const db = this.databaseService.getDb();

        const result = await db
            .select({ count: sql<number>`count(*)` })
            .from(notifications)
            .where(and(eq(notifications.userId, userId), eq(notifications.read, false)));

        return Number(result[0]?.count || 0);
    }

    /**
     * Mark notification as read
     */
    async markAsRead(id: string, userId: string): Promise<void> {
        const db = this.databaseService.getDb();

        await db
            .update(notifications)
            .set({ read: true, readAt: new Date() })
            .where(and(eq(notifications.id, id), eq(notifications.userId, userId)));
    }

    /**
     * Mark all notifications as read
     */
    async markAllAsRead(userId: string): Promise<void> {
        const db = this.databaseService.getDb();

        await db
            .update(notifications)
            .set({ read: true, readAt: new Date() })
            .where(and(eq(notifications.userId, userId), eq(notifications.read, false)));
    }

    /**
     * Delete a notification
     */
    async delete(id: string, userId: string): Promise<void> {
        const db = this.databaseService.getDb();

        await db
            .delete(notifications)
            .where(and(eq(notifications.id, id), eq(notifications.userId, userId)));
    }
}

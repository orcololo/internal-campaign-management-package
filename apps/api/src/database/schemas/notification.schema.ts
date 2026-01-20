import { pgTable, uuid, varchar, text, timestamp, boolean, index, pgEnum } from 'drizzle-orm/pg-core';
import { users } from './user.schema';

/**
 * Notification types
 */
export const notificationTypeEnum = pgEnum('notification_type', [
    'event_reminder',
    'task_assigned',
    'campaign_complete',
    'campaign_started',
    'message_response',
    'import_complete',
    'export_complete',
    'system',
    'error',
]);

/**
 * Notifications table
 * In-app notifications for users
 */
export const notifications = pgTable('notifications', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id).notNull(),
    type: notificationTypeEnum('type').notNull(),
    title: varchar('title', { length: 200 }).notNull(),
    message: text('message'),
    link: varchar('link', { length: 500 }),
    read: boolean('read').notNull().default(false),
    readAt: timestamp('read_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
    userUnreadIdx: index('idx_notifications_user_unread').on(table.userId, table.read),
    userCreatedIdx: index('idx_notifications_user_created').on(table.userId, table.createdAt),
}));

export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
export type NotificationType = (typeof notificationTypeEnum.enumValues)[number];

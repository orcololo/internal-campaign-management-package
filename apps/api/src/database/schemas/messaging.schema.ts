import { pgTable, uuid, varchar, text, timestamp, integer, jsonb, index, pgEnum, boolean } from 'drizzle-orm/pg-core';
import { users } from './user.schema';

/**
 * Message channel types
 */
export const messageChannelEnum = pgEnum('message_channel', [
    'whatsapp',
]);

/**
 * Template categories (for WhatsApp Business API)
 */
export const templateCategoryEnum = pgEnum('template_category', [
    'utility',
    'marketing',
    'authentication',
]);

/**
 * Template approval status
 */
export const templateStatusEnum = pgEnum('template_status', [
    'draft',
    'pending',
    'approved',
    'rejected',
]);

/**
 * Message templates table
 */
export const messageTemplates = pgTable('message_templates', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 100 }).notNull(),
    channel: messageChannelEnum('channel').notNull().default('whatsapp'),
    category: templateCategoryEnum('category').notNull(),
    content: text('content').notNull(),
    variables: jsonb('variables'), // e.g., ["name", "date"]
    whatsappTemplateId: varchar('whatsapp_template_id', { length: 100 }),
    status: templateStatusEnum('status').notNull().default('draft'),
    createdBy: uuid('created_by').references(() => users.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

/**
 * Campaign status
 */
export const campaignStatusEnum = pgEnum('campaign_status', [
    'draft',
    'scheduled',
    'running',
    'paused',
    'completed',
    'cancelled',
    'failed',
]);

/**
 * Messaging campaigns table
 */
export const messagingCampaigns = pgTable('messaging_campaigns', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 200 }).notNull(),
    templateId: uuid('template_id').references(() => messageTemplates.id).notNull(),
    segmentFilters: jsonb('segment_filters'), // Voter filter criteria
    scheduledAt: timestamp('scheduled_at'),
    startedAt: timestamp('started_at'),
    completedAt: timestamp('completed_at'),
    status: campaignStatusEnum('status').notNull().default('draft'),
    totalRecipients: integer('total_recipients').default(0),
    sentCount: integer('sent_count').default(0),
    deliveredCount: integer('delivered_count').default(0),
    readCount: integer('read_count').default(0),
    failedCount: integer('failed_count').default(0),
    createdBy: uuid('created_by').references(() => users.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
    statusIdx: index('idx_campaigns_status').on(table.status),
    scheduledIdx: index('idx_campaigns_scheduled').on(table.scheduledAt),
}));

/**
 * Message delivery status
 */
export const messageStatusEnum = pgEnum('message_status', [
    'pending',
    'sent',
    'delivered',
    'read',
    'failed',
]);

/**
 * Individual message logs
 */
export const messageLogs = pgTable('message_logs', {
    id: uuid('id').primaryKey().defaultRandom(),
    campaignId: uuid('campaign_id').references(() => messagingCampaigns.id),
    voterId: uuid('voter_id'),
    channel: messageChannelEnum('channel').notNull(),
    phone: varchar('phone', { length: 20 }).notNull(),
    content: text('content'),
    externalId: varchar('external_id', { length: 100 }), // Provider message ID
    status: messageStatusEnum('status').notNull().default('pending'),
    errorMessage: text('error_message'),
    sentAt: timestamp('sent_at'),
    deliveredAt: timestamp('delivered_at'),
    readAt: timestamp('read_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
    campaignIdx: index('idx_messages_campaign').on(table.campaignId),
    voterIdx: index('idx_messages_voter').on(table.voterId),
    statusIdx: index('idx_messages_status').on(table.status),
}));

/**
 * Inbound message responses
 */
export const messageResponses = pgTable('message_responses', {
    id: uuid('id').primaryKey().defaultRandom(),
    messageLogId: uuid('message_log_id').references(() => messageLogs.id),
    voterId: uuid('voter_id'),
    content: text('content').notNull(),
    receivedAt: timestamp('received_at').notNull().defaultNow(),
});

// Type exports
export type MessageTemplate = typeof messageTemplates.$inferSelect;
export type NewMessageTemplate = typeof messageTemplates.$inferInsert;
export type TemplateCategory = (typeof templateCategoryEnum.enumValues)[number];
export type TemplateStatus = (typeof templateStatusEnum.enumValues)[number];

export type MessagingCampaign = typeof messagingCampaigns.$inferSelect;
export type NewMessagingCampaign = typeof messagingCampaigns.$inferInsert;
export type CampaignStatus = (typeof campaignStatusEnum.enumValues)[number];

export type MessageLog = typeof messageLogs.$inferSelect;
export type NewMessageLog = typeof messageLogs.$inferInsert;
export type MessageStatus = (typeof messageStatusEnum.enumValues)[number];

export type MessageResponse = typeof messageResponses.$inferSelect;
export type NewMessageResponse = typeof messageResponses.$inferInsert;

import { pgTable, uuid, varchar, text, jsonb, timestamp } from 'drizzle-orm/pg-core';
import { users } from './user.schema';

export const settings = pgTable('settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id), // Optional: null for global settings
  key: varchar('key', { length: 255 }).notNull(),
  value: jsonb('value').notNull(),
  description: text('description'),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type Setting = typeof settings.$inferSelect;
export type NewSetting = typeof settings.$inferInsert;

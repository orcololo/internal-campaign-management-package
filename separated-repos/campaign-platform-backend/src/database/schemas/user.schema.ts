import { pgTable, uuid, varchar, timestamp, pgEnum } from 'drizzle-orm/pg-core';

/**
 * User roles for RBAC (Role-Based Access Control)
 */
export const userRoleEnum = pgEnum('user_role', [
  'CANDIDATO',
  'ESTRATEGISTA',
  'LIDERANCA',
  'ESCRITORIO',
]);

/**
 * Users table - This table structure is replicated in each tenant schema
 * Manages users within a specific campaign
 */
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  keycloakId: varchar('keycloak_id', { length: 255 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  role: userRoleEnum('role').notNull().default('ESCRITORIO'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UserRole = (typeof userRoleEnum.enumValues)[number];

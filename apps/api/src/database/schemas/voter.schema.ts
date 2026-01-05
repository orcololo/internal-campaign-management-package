import { pgTable, uuid, varchar, timestamp, text, numeric, date, integer, pgEnum } from 'drizzle-orm/pg-core';

/**
 * Enums for voter segmentation
 */
export const genderEnum = pgEnum('gender', ['MASCULINO', 'FEMININO', 'OUTRO', 'NAO_INFORMADO']);
export const educationLevelEnum = pgEnum('education_level', [
  'FUNDAMENTAL_INCOMPLETO',
  'FUNDAMENTAL_COMPLETO',
  'MEDIO_INCOMPLETO',
  'MEDIO_COMPLETO',
  'SUPERIOR_INCOMPLETO',
  'SUPERIOR_COMPLETO',
  'POS_GRADUACAO',
  'NAO_INFORMADO',
]);
export const incomeLevelEnum = pgEnum('income_level', [
  'ATE_1_SALARIO',
  'DE_1_A_2_SALARIOS',
  'DE_2_A_5_SALARIOS',
  'DE_5_A_10_SALARIOS',
  'ACIMA_10_SALARIOS',
  'NAO_INFORMADO',
]);
export const maritalStatusEnum = pgEnum('marital_status', [
  'SOLTEIRO',
  'CASADO',
  'DIVORCIADO',
  'VIUVO',
  'UNIAO_ESTAVEL',
  'NAO_INFORMADO',
]);
export const supportLevelEnum = pgEnum('support_level', [
  'MUITO_FAVORAVEL',
  'FAVORAVEL',
  'NEUTRO',
  'DESFAVORAVEL',
  'MUITO_DESFAVORAVEL',
  'NAO_DEFINIDO',
]);

/**
 * Voters table - This table structure is replicated in each tenant schema
 * Manages comprehensive voter information for the campaign
 */
export const voters = pgTable('voters', {
  id: uuid('id').primaryKey().defaultRandom(),

  // Basic Information
  name: varchar('name', { length: 255 }).notNull(),
  cpf: varchar('cpf', { length: 14 }).unique(),
  dateOfBirth: date('date_of_birth'),
  gender: genderEnum('gender').default('NAO_INFORMADO'),

  // Contact Information
  phone: varchar('phone', { length: 20 }),
  whatsapp: varchar('whatsapp', { length: 20 }),
  email: varchar('email', { length: 255 }),

  // Address Information
  address: text('address'),
  addressNumber: varchar('address_number', { length: 10 }),
  addressComplement: varchar('address_complement', { length: 100 }),
  neighborhood: varchar('neighborhood', { length: 100 }),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 2 }),
  zipCode: varchar('zip_code', { length: 10 }),
  latitude: numeric('latitude', { precision: 10, scale: 7 }),
  longitude: numeric('longitude', { precision: 10, scale: 7 }),

  // Electoral Information
  electoralTitle: varchar('electoral_title', { length: 20 }),
  electoralZone: varchar('electoral_zone', { length: 10 }),
  electoralSection: varchar('electoral_section', { length: 10 }),
  votingLocation: varchar('voting_location', { length: 255 }),

  // Social Segmentation
  educationLevel: educationLevelEnum('education_level').default('NAO_INFORMADO'),
  occupation: varchar('occupation', { length: 150 }),
  incomeLevel: incomeLevelEnum('income_level').default('NAO_INFORMADO'),
  maritalStatus: maritalStatusEnum('marital_status').default('NAO_INFORMADO'),
  religion: varchar('religion', { length: 100 }),
  ethnicity: varchar('ethnicity', { length: 50 }),

  // Social Media
  facebook: varchar('facebook', { length: 255 }),
  instagram: varchar('instagram', { length: 255 }),
  twitter: varchar('twitter', { length: 255 }),

  // Political Information
  supportLevel: supportLevelEnum('support_level').default('NAO_DEFINIDO'),
  politicalParty: varchar('political_party', { length: 100 }),
  votingHistory: text('voting_history'),

  // Additional Information
  familyMembers: integer('family_members'),
  hasWhatsapp: varchar('has_whatsapp', { length: 3 }).default('NAO'), // SIM/NAO
  preferredContact: varchar('preferred_contact', { length: 20 }).default('TELEFONE'), // TELEFONE/WHATSAPP/EMAIL
  notes: text('notes'),
  tags: text('tags'), // JSON array of tags for flexible categorization

  // Audit fields
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export type Voter = typeof voters.$inferSelect;
export type NewVoter = typeof voters.$inferInsert;
export type Gender = typeof genderEnum.enumValues[number];
export type EducationLevel = typeof educationLevelEnum.enumValues[number];
export type IncomeLevel = typeof incomeLevelEnum.enumValues[number];
export type MaritalStatus = typeof maritalStatusEnum.enumValues[number];
export type SupportLevel = typeof supportLevelEnum.enumValues[number];

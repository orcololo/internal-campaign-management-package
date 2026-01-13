import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  text,
  numeric,
  date,
  integer,
  pgEnum,
  real,
} from 'drizzle-orm/pg-core';

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
export const engagementTrendEnum = pgEnum('engagement_trend', [
  'CRESCENTE',
  'ESTAVEL',
  'DECRESCENTE',
  'NAO_DEFINIDO',
]);
export const householdTypeEnum = pgEnum('household_type', [
  'SOLTEIRO',
  'FAMILIA_COM_FILHOS',
  'FAMILIA_SEM_FILHOS',
  'IDOSOS',
  'ESTUDANTES',
  'NAO_INFORMADO',
]);
export const employmentStatusEnum = pgEnum('employment_status', [
  'EMPREGADO',
  'DESEMPREGADO',
  'APOSENTADO',
  'ESTUDANTE',
  'AUTONOMO',
  'NAO_INFORMADO',
]);
export const turnoutLikelihoodEnum = pgEnum('turnout_likelihood', [
  'ALTO',
  'MEDIO',
  'BAIXO',
  'NAO_DEFINIDO',
]);
export const communicationStyleEnum = pgEnum('communication_style', [
  'FORMAL',
  'INFORMAL',
  'NAO_DEFINIDO',
]);
export const communityRoleEnum = pgEnum('community_role', [
  'LIDER',
  'MEMBRO_ATIVO',
  'ATIVISTA',
  'MEMBRO',
  'NAO_PARTICIPANTE',
  'NAO_DEFINIDO',
]);
export const volunteerStatusEnum = pgEnum('volunteer_status', [
  'ATIVO',
  'INATIVO',
  'INTERESSADO',
  'NAO_VOLUNTARIO',
]);

/**
 * Voters table - This table structure is replicated in each tenant schema
 * Manages comprehensive voter information for the campaign
 */
export const voters = pgTable('voters', {
  id: uuid('id').primaryKey().defaultRandom(),

  // Basic Information
  name: varchar('name', { length: 255 }).notNull(),
  motherName: varchar('mother_name', { length: 255 }),
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
  topIssues: text('top_issues'), // JSON array
  issuePositions: text('issue_positions'), // JSON object
  previousCandidateSupport: text('previous_candidate_support'),
  influencerScore: integer('influencer_score'), // 0-100
  persuadability: varchar('persuadability', { length: 20 }), // ALTO/MEDIO/BAIXO
  turnoutLikelihood: turnoutLikelihoodEnum('turnout_likelihood').default('NAO_DEFINIDO'),

  // Engagement & Behavioral
  registrationDate: timestamp('registration_date'),
  lastEngagementDate: timestamp('last_engagement_date'),
  engagementTrend: engagementTrendEnum('engagement_trend').default('NAO_DEFINIDO'),
  seasonalActivity: text('seasonal_activity'), // JSON
  lastContactDate: timestamp('last_contact_date'),
  contactFrequency: integer('contact_frequency'), // times contacted
  responseRate: integer('response_rate'), // percentage 0-100
  eventAttendance: text('event_attendance'), // JSON array
  volunteerStatus: volunteerStatusEnum('volunteer_status').default('NAO_VOLUNTARIO'),
  donationHistory: text('donation_history'), // JSON array
  engagementScore: integer('engagement_score'), // 0-100

  // Demographics Extended
  ageGroup: varchar('age_group', { length: 20 }), // 18-25, 26-35, 36-50, 51-65, 65+
  householdType: householdTypeEnum('household_type').default('NAO_INFORMADO'),
  employmentStatus: employmentStatusEnum('employment_status').default('NAO_INFORMADO'),
  vehicleOwnership: varchar('vehicle_ownership', { length: 3 }).default('NAO'), // SIM/NAO
  internetAccess: varchar('internet_access', { length: 100 }), // Fibra/4G/3G/Limitado/Sem acesso

  // Communication Preferences Extended
  communicationStyle: communicationStyleEnum('communication_style').default('NAO_DEFINIDO'),
  contentPreference: text('content_preference'), // JSON array: video, texto, imagens
  bestContactTime: varchar('best_contact_time', { length: 50 }), // Manhã/Tarde/Noite
  bestContactDay: text('best_contact_day'), // JSON array: days of week

  // Social Network & Influence
  socialMediaFollowers: integer('social_media_followers'),
  communityRole: communityRoleEnum('community_role').default('NAO_DEFINIDO'),
  referredVoters: integer('referred_voters').default(0),
  networkSize: integer('network_size'), // estimated personal network
  influenceRadius: real('influence_radius'), // km

  // Additional Information
  familyMembers: integer('family_members'),
  hasWhatsapp: varchar('has_whatsapp', { length: 3 }).default('NAO'), // SIM/NAO
  preferredContact: varchar('preferred_contact', { length: 20 }).default('TELEFONE'), // TELEFONE/WHATSAPP/EMAIL
  notes: text('notes'),
  tags: text('tags'), // JSON array of tags for flexible categorization

  // Referral System
  referralCode: varchar('referral_code', { length: 50 }).unique(), // Unique referral code (e.g., JOAO-SILVA-ABC123)
  referredBy: uuid('referred_by').references((): any => voters.id, { onDelete: 'set null' }), // Self-reference to referrer
  referralDate: timestamp('referral_date'), // Date when referred

  // Audit fields
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export type Voter = typeof voters.$inferSelect;
export type NewVoter = typeof voters.$inferInsert;
export type Gender = (typeof genderEnum.enumValues)[number];
export type EducationLevel = (typeof educationLevelEnum.enumValues)[number];
export type IncomeLevel = (typeof incomeLevelEnum.enumValues)[number];
export type MaritalStatus = (typeof maritalStatusEnum.enumValues)[number];
export type SupportLevel = (typeof supportLevelEnum.enumValues)[number];
export type EngagementTrend = (typeof engagementTrendEnum.enumValues)[number];
export type HouseholdType = (typeof householdTypeEnum.enumValues)[number];
export type EmploymentStatus = (typeof employmentStatusEnum.enumValues)[number];
export type TurnoutLikelihood = (typeof turnoutLikelihoodEnum.enumValues)[number];
export type CommunicationStyle = (typeof communicationStyleEnum.enumValues)[number];
export type CommunityRole = (typeof communityRoleEnum.enumValues)[number];
export type VolunteerStatus = (typeof volunteerStatusEnum.enumValues)[number];

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.voters = exports.volunteerStatusEnum = exports.communityRoleEnum = exports.communicationStyleEnum = exports.turnoutLikelihoodEnum = exports.employmentStatusEnum = exports.householdTypeEnum = exports.engagementTrendEnum = exports.supportLevelEnum = exports.maritalStatusEnum = exports.incomeLevelEnum = exports.educationLevelEnum = exports.genderEnum = void 0;
var pg_core_1 = require("drizzle-orm/pg-core");
/**
 * Enums for voter segmentation
 */
exports.genderEnum = (0, pg_core_1.pgEnum)('gender', ['MASCULINO', 'FEMININO', 'OUTRO', 'NAO_INFORMADO']);
exports.educationLevelEnum = (0, pg_core_1.pgEnum)('education_level', [
    'FUNDAMENTAL_INCOMPLETO',
    'FUNDAMENTAL_COMPLETO',
    'MEDIO_INCOMPLETO',
    'MEDIO_COMPLETO',
    'SUPERIOR_INCOMPLETO',
    'SUPERIOR_COMPLETO',
    'POS_GRADUACAO',
    'NAO_INFORMADO',
]);
exports.incomeLevelEnum = (0, pg_core_1.pgEnum)('income_level', [
    'ATE_1_SALARIO',
    'DE_1_A_2_SALARIOS',
    'DE_2_A_5_SALARIOS',
    'DE_5_A_10_SALARIOS',
    'ACIMA_10_SALARIOS',
    'NAO_INFORMADO',
]);
exports.maritalStatusEnum = (0, pg_core_1.pgEnum)('marital_status', [
    'SOLTEIRO',
    'CASADO',
    'DIVORCIADO',
    'VIUVO',
    'UNIAO_ESTAVEL',
    'NAO_INFORMADO',
]);
exports.supportLevelEnum = (0, pg_core_1.pgEnum)('support_level', [
    'MUITO_FAVORAVEL',
    'FAVORAVEL',
    'NEUTRO',
    'DESFAVORAVEL',
    'MUITO_DESFAVORAVEL',
    'NAO_DEFINIDO',
]);
exports.engagementTrendEnum = (0, pg_core_1.pgEnum)('engagement_trend', [
    'CRESCENTE',
    'ESTAVEL',
    'DECRESCENTE',
    'NAO_DEFINIDO',
]);
exports.householdTypeEnum = (0, pg_core_1.pgEnum)('household_type', [
    'SOLTEIRO',
    'FAMILIA_COM_FILHOS',
    'FAMILIA_SEM_FILHOS',
    'IDOSOS',
    'ESTUDANTES',
    'NAO_INFORMADO',
]);
exports.employmentStatusEnum = (0, pg_core_1.pgEnum)('employment_status', [
    'EMPREGADO',
    'DESEMPREGADO',
    'APOSENTADO',
    'ESTUDANTE',
    'AUTONOMO',
    'NAO_INFORMADO',
]);
exports.turnoutLikelihoodEnum = (0, pg_core_1.pgEnum)('turnout_likelihood', [
    'ALTO',
    'MEDIO',
    'BAIXO',
    'NAO_DEFINIDO',
]);
exports.communicationStyleEnum = (0, pg_core_1.pgEnum)('communication_style', [
    'FORMAL',
    'INFORMAL',
    'NAO_DEFINIDO',
]);
exports.communityRoleEnum = (0, pg_core_1.pgEnum)('community_role', [
    'LIDER',
    'MEMBRO_ATIVO',
    'ATIVISTA',
    'MEMBRO',
    'NAO_PARTICIPANTE',
    'NAO_DEFINIDO',
]);
exports.volunteerStatusEnum = (0, pg_core_1.pgEnum)('volunteer_status', [
    'ATIVO',
    'INATIVO',
    'INTERESSADO',
    'NAO_VOLUNTARIO',
]);
/**
 * Voters table - This table structure is replicated in each tenant schema
 * Manages comprehensive voter information for the campaign
 */
exports.voters = (0, pg_core_1.pgTable)('voters', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    // Basic Information
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    motherName: (0, pg_core_1.varchar)('mother_name', { length: 255 }),
    cpf: (0, pg_core_1.varchar)('cpf', { length: 14 }).unique(),
    dateOfBirth: (0, pg_core_1.date)('date_of_birth'),
    gender: (0, exports.genderEnum)('gender').default('NAO_INFORMADO'),
    // Contact Information
    phone: (0, pg_core_1.varchar)('phone', { length: 20 }),
    whatsapp: (0, pg_core_1.varchar)('whatsapp', { length: 20 }),
    email: (0, pg_core_1.varchar)('email', { length: 255 }),
    // Address Information
    address: (0, pg_core_1.text)('address'),
    addressNumber: (0, pg_core_1.varchar)('address_number', { length: 10 }),
    addressComplement: (0, pg_core_1.varchar)('address_complement', { length: 100 }),
    neighborhood: (0, pg_core_1.varchar)('neighborhood', { length: 100 }),
    city: (0, pg_core_1.varchar)('city', { length: 100 }),
    state: (0, pg_core_1.varchar)('state', { length: 2 }),
    zipCode: (0, pg_core_1.varchar)('zip_code', { length: 10 }),
    latitude: (0, pg_core_1.numeric)('latitude', { precision: 10, scale: 7 }),
    longitude: (0, pg_core_1.numeric)('longitude', { precision: 10, scale: 7 }),
    // Electoral Information
    electoralTitle: (0, pg_core_1.varchar)('electoral_title', { length: 20 }),
    electoralZone: (0, pg_core_1.varchar)('electoral_zone', { length: 10 }),
    electoralSection: (0, pg_core_1.varchar)('electoral_section', { length: 10 }),
    votingLocation: (0, pg_core_1.varchar)('voting_location', { length: 255 }),
    // Social Segmentation
    educationLevel: (0, exports.educationLevelEnum)('education_level').default('NAO_INFORMADO'),
    occupation: (0, pg_core_1.varchar)('occupation', { length: 150 }),
    incomeLevel: (0, exports.incomeLevelEnum)('income_level').default('NAO_INFORMADO'),
    maritalStatus: (0, exports.maritalStatusEnum)('marital_status').default('NAO_INFORMADO'),
    religion: (0, pg_core_1.varchar)('religion', { length: 100 }),
    ethnicity: (0, pg_core_1.varchar)('ethnicity', { length: 50 }),
    // Social Media
    facebook: (0, pg_core_1.varchar)('facebook', { length: 255 }),
    instagram: (0, pg_core_1.varchar)('instagram', { length: 255 }),
    twitter: (0, pg_core_1.varchar)('twitter', { length: 255 }),
    // Political Information
    supportLevel: (0, exports.supportLevelEnum)('support_level').default('NAO_DEFINIDO'),
    politicalParty: (0, pg_core_1.varchar)('political_party', { length: 100 }),
    votingHistory: (0, pg_core_1.text)('voting_history'),
    topIssues: (0, pg_core_1.text)('top_issues'), // JSON array
    issuePositions: (0, pg_core_1.text)('issue_positions'), // JSON object
    previousCandidateSupport: (0, pg_core_1.text)('previous_candidate_support'),
    influencerScore: (0, pg_core_1.integer)('influencer_score'), // 0-100
    persuadability: (0, pg_core_1.varchar)('persuadability', { length: 20 }), // ALTO/MEDIO/BAIXO
    turnoutLikelihood: (0, exports.turnoutLikelihoodEnum)('turnout_likelihood').default('NAO_DEFINIDO'),
    // Engagement & Behavioral
    registrationDate: (0, pg_core_1.timestamp)('registration_date'),
    lastEngagementDate: (0, pg_core_1.timestamp)('last_engagement_date'),
    engagementTrend: (0, exports.engagementTrendEnum)('engagement_trend').default('NAO_DEFINIDO'),
    seasonalActivity: (0, pg_core_1.text)('seasonal_activity'), // JSON
    lastContactDate: (0, pg_core_1.timestamp)('last_contact_date'),
    contactFrequency: (0, pg_core_1.integer)('contact_frequency'), // times contacted
    responseRate: (0, pg_core_1.integer)('response_rate'), // percentage 0-100
    eventAttendance: (0, pg_core_1.text)('event_attendance'), // JSON array
    volunteerStatus: (0, exports.volunteerStatusEnum)('volunteer_status').default('NAO_VOLUNTARIO'),
    donationHistory: (0, pg_core_1.text)('donation_history'), // JSON array
    engagementScore: (0, pg_core_1.integer)('engagement_score'), // 0-100
    // Demographics Extended
    ageGroup: (0, pg_core_1.varchar)('age_group', { length: 20 }), // 18-25, 26-35, 36-50, 51-65, 65+
    householdType: (0, exports.householdTypeEnum)('household_type').default('NAO_INFORMADO'),
    employmentStatus: (0, exports.employmentStatusEnum)('employment_status').default('NAO_INFORMADO'),
    vehicleOwnership: (0, pg_core_1.varchar)('vehicle_ownership', { length: 3 }).default('NAO'), // SIM/NAO
    internetAccess: (0, pg_core_1.varchar)('internet_access', { length: 100 }), // Fibra/4G/3G/Limitado/Sem acesso
    // Communication Preferences Extended
    communicationStyle: (0, exports.communicationStyleEnum)('communication_style').default('NAO_DEFINIDO'),
    contentPreference: (0, pg_core_1.text)('content_preference'), // JSON array: video, texto, imagens
    bestContactTime: (0, pg_core_1.varchar)('best_contact_time', { length: 50 }), // Manhã/Tarde/Noite
    bestContactDay: (0, pg_core_1.text)('best_contact_day'), // JSON array: days of week
    // Social Network & Influence
    socialMediaFollowers: (0, pg_core_1.integer)('social_media_followers'),
    communityRole: (0, exports.communityRoleEnum)('community_role').default('NAO_DEFINIDO'),
    referredVoters: (0, pg_core_1.integer)('referred_voters').default(0),
    networkSize: (0, pg_core_1.integer)('network_size'), // estimated personal network
    influenceRadius: (0, pg_core_1.real)('influence_radius'), // km
    // Additional Information
    familyMembers: (0, pg_core_1.integer)('family_members'),
    hasWhatsapp: (0, pg_core_1.varchar)('has_whatsapp', { length: 3 }).default('NAO'), // SIM/NAO
    preferredContact: (0, pg_core_1.varchar)('preferred_contact', { length: 20 }).default('TELEFONE'), // TELEFONE/WHATSAPP/EMAIL
    notes: (0, pg_core_1.text)('notes'),
    tags: (0, pg_core_1.text)('tags'), // JSON array of tags for flexible categorization
    // Referral System
    referralCode: (0, pg_core_1.varchar)('referral_code', { length: 50 }).unique(), // Unique referral code (e.g., JOAO-SILVA-ABC123)
    referredBy: (0, pg_core_1.uuid)('referred_by').references(function () { return exports.voters.id; }, { onDelete: 'set null' }), // Self-reference to referrer
    referralDate: (0, pg_core_1.timestamp)('referral_date'), // Date when referred
    // Audit fields
    createdAt: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').notNull().defaultNow(),
    deletedAt: (0, pg_core_1.timestamp)('deleted_at'),
});

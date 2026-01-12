import { z } from "zod";
import {
  nameSchema,
  optionalEmailSchema,
  optionalPhoneSchema,
  phoneSchema,
  stateSchema,
  cpfSchema,
} from "./common";

// Enums matching the database schema
export const genderEnum = z.enum([
  "MASCULINO",
  "FEMININO",
  "OUTRO",
  "NAO_INFORMADO",
]);
export const educationLevelEnum = z.enum([
  "FUNDAMENTAL_INCOMPLETO",
  "FUNDAMENTAL_COMPLETO",
  "MEDIO_INCOMPLETO",
  "MEDIO_COMPLETO",
  "SUPERIOR_INCOMPLETO",
  "SUPERIOR_COMPLETO",
  "POS_GRADUACAO",
  "NAO_INFORMADO",
]);
export const incomeLevelEnum = z.enum([
  "ATE_1_SALARIO",
  "DE_1_A_2_SALARIOS",
  "DE_2_A_5_SALARIOS",
  "DE_5_A_10_SALARIOS",
  "ACIMA_10_SALARIOS",
  "NAO_INFORMADO",
]);
export const maritalStatusEnum = z.enum([
  "SOLTEIRO",
  "CASADO",
  "DIVORCIADO",
  "VIUVO",
  "UNIAO_ESTAVEL",
  "NAO_INFORMADO",
]);
export const supportLevelEnum = z.enum([
  "MUITO_FAVORAVEL",
  "FAVORAVEL",
  "NEUTRO",
  "DESFAVORAVEL",
  "MUITO_DESFAVORAVEL",
  "NAO_DEFINIDO",
]);
export const preferredContactEnum = z.enum(["TELEFONE", "WHATSAPP", "EMAIL"]);
export const engagementTrendEnum = z.enum([
  "CRESCENTE",
  "ESTAVEL",
  "DECRESCENTE",
  "NAO_DEFINIDO",
]);
export const householdTypeEnum = z.enum([
  "SOLTEIRO",
  "FAMILIA_COM_FILHOS",
  "FAMILIA_SEM_FILHOS",
  "IDOSOS",
  "ESTUDANTES",
  "NAO_INFORMADO",
]);
export const employmentStatusEnum = z.enum([
  "EMPREGADO",
  "DESEMPREGADO",
  "APOSENTADO",
  "ESTUDANTE",
  "AUTONOMO",
  "NAO_INFORMADO",
]);
export const turnoutLikelihoodEnum = z.enum([
  "ALTO",
  "MEDIO",
  "BAIXO",
  "NAO_DEFINIDO",
]);
export const communicationStyleEnum = z.enum([
  "FORMAL",
  "INFORMAL",
  "NAO_DEFINIDO",
]);
export const communityRoleEnum = z.enum([
  "LIDER",
  "MEMBRO_ATIVO",
  "ATIVISTA",
  "MEMBRO",
  "NAO_PARTICIPANTE",
  "NAO_DEFINIDO",
]);
export const volunteerStatusEnum = z.enum([
  "ATIVO",
  "INATIVO",
  "INTERESSADO",
  "NAO_VOLUNTARIO",
]);
export const persuadabilityEnum = z.enum(["ALTO", "MEDIO", "BAIXO"]);

// Helper to convert empty strings to undefined for optional enums
const optionalEnum = <T extends [string, ...string[]]>(schema: z.ZodEnum<T>) =>
  z.preprocess(
    (val) =>
      val === "" || val === undefined || val === null ? undefined : val,
    schema.optional()
  );

// Full voter schema for create/update
export const voterSchema = z.object({
  // Basic Information
  name: nameSchema,
  motherName: z.string().optional(),
  cpf: z.union([cpfSchema, z.literal(""), z.undefined()]),
  dateOfBirth: z.string().optional(),
  gender: genderEnum.optional(),

  // Contact Information
  email: optionalEmailSchema,
  phone: optionalPhoneSchema,
  whatsapp: optionalPhoneSchema,

  // Address Information
  address: z.string().optional(),
  addressNumber: z.string().optional(),
  addressComplement: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().min(2, "Cidade deve ter no mínimo 2 caracteres"),
  state: stateSchema,
  zipCode: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),

  // Electoral Information
  electoralTitle: z.string().optional(),
  electoralZone: z.string().optional(),
  electoralSection: z.string().optional(),
  votingLocation: z.string().optional(),

  // Social Segmentation
  educationLevel: educationLevelEnum.optional(),
  occupation: z.string().optional(),
  incomeLevel: incomeLevelEnum.optional(),
  maritalStatus: maritalStatusEnum.optional(),
  religion: z.string().optional(),
  ethnicity: z.string().optional(),
  familyMembers: z.number().optional(),

  // Social Media
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),

  // Contact Preferences
  hasWhatsapp: z.boolean().optional(),
  preferredContact: preferredContactEnum.optional(),

  // Political Information
  supportLevel: supportLevelEnum.optional(),
  politicalParty: z.string().optional(),
  votingHistory: z.string().optional(),
  tags: z.preprocess((val) => val ?? [], z.array(z.string())),
  notes: z.string().optional(),
});

// Step 1: All Obligatory Fields
export const voterBasicInfoSchema = z.object({
  // Personal Info
  name: nameSchema,
  motherName: z.string().min(3, "Nome da mãe deve ter no mínimo 3 caracteres"),
  cpf: cpfSchema,
  dateOfBirth: z.string().min(1, "Data de nascimento é obrigatória"),
  gender: genderEnum,

  // Contact
  email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
  phone: phoneSchema,

  // Address
  address: z.string().min(1, "Endereço é obrigatório"),
  addressNumber: z.string().min(1, "Número é obrigatório"),
  addressComplement: z.string().optional(),
  neighborhood: z.string().min(1, "Bairro é obrigatório"),
  city: z.string().min(2, "Cidade é obrigatória"),
  state: stateSchema,
  zipCode: z.string().min(1, "CEP é obrigatório"),
});

// Step 2: Contact Info (Additional)
export const voterContactSchema = z.object({
  whatsapp: optionalPhoneSchema,
  hasWhatsapp: z.boolean().optional(),
  preferredContact: preferredContactEnum.optional(),
});

// Step 3: Address (Additional - lat/long)
export const voterAddressSchema = z.object({
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

// Step 4: Electoral Info
export const voterElectoralSchema = z.object({
  electoralTitle: z.string().optional(),
  electoralZone: z.string().optional(),
  electoralSection: z.string().optional(),
  votingLocation: z.string().optional(),
});

// Step 5: Social Segmentation
export const voterSocialSchema = z.object({
  educationLevel: educationLevelEnum.optional(),
  occupation: z.string().optional(),
  incomeLevel: incomeLevelEnum.optional(),
  maritalStatus: maritalStatusEnum.optional(),
  religion: z.string().optional(),
  ethnicity: z.string().optional(),
  familyMembers: z.number().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
});

// Step 6: Political Info
export const voterPoliticalSchema = z.object({
  supportLevel: supportLevelEnum.optional(),
  politicalParty: z.string().optional(),
  votingHistory: z.string().optional(),
  tags: z.array(z.string()),
  notes: z.string().optional(),
});

// Step 7: Engagement & AI Data
export const voterEngagementSchema = z.object({
  // Demographics Extended
  ageGroup: z.string().optional(),
  householdType: householdTypeEnum.optional(),
  employmentStatus: employmentStatusEnum.optional(),
  vehicleOwnership: z.boolean().optional(),
  internetAccess: z.string().optional(),

  // Communication Preferences Extended
  communicationStyle: communicationStyleEnum.optional(),
  contentPreference: z.array(z.string()).optional(),
  bestContactTime: z.string().optional(),
  bestContactDay: z.array(z.string()).optional(),

  // Political Extended
  topIssues: z.array(z.string()).optional(),
  previousCandidateSupport: z.string().optional(),
  influencerScore: z.number().min(0).max(100).optional(),
  persuadability: persuadabilityEnum.optional(),
  turnoutLikelihood: turnoutLikelihoodEnum.optional(),

  // Social Network & Influence
  socialMediaFollowers: z.number().optional(),
  communityRole: communityRoleEnum.optional(),
  referredVoters: z.number().optional(),
  networkSize: z.number().optional(),
  influenceRadius: z.number().optional(),

  // Engagement Tracking
  contactFrequency: z.number().optional(),
  responseRate: z.number().min(0).max(100).optional(),
  volunteerStatus: volunteerStatusEnum.optional(),
  engagementScore: z.number().min(0).max(100).optional(),
});

export type VoterFormData = z.infer<typeof voterSchema>;
export type VoterBasicInfo = z.infer<typeof voterBasicInfoSchema>;
export type VoterContact = z.infer<typeof voterContactSchema>;
export type VoterAddress = z.infer<typeof voterAddressSchema>;
export type VoterElectoral = z.infer<typeof voterElectoralSchema>;
export type VoterSocial = z.infer<typeof voterSocialSchema>;
export type VoterPolitical = z.infer<typeof voterPoliticalSchema>;
export type VoterEngagement = z.infer<typeof voterEngagementSchema>;

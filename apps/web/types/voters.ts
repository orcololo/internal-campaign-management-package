export type Gender = "MASCULINO" | "FEMININO" | "OUTRO" | "NAO_INFORMADO";
export type EducationLevel =
  | "FUNDAMENTAL_INCOMPLETO"
  | "FUNDAMENTAL_COMPLETO"
  | "MEDIO_INCOMPLETO"
  | "MEDIO_COMPLETO"
  | "SUPERIOR_INCOMPLETO"
  | "SUPERIOR_COMPLETO"
  | "POS_GRADUACAO"
  | "NAO_INFORMADO";
export type IncomeLevel =
  | "ATE_1_SALARIO"
  | "DE_1_A_2_SALARIOS"
  | "DE_2_A_5_SALARIOS"
  | "DE_5_A_10_SALARIOS"
  | "ACIMA_10_SALARIOS"
  | "NAO_INFORMADO";
export type MaritalStatus =
  | "SOLTEIRO"
  | "CASADO"
  | "DIVORCIADO"
  | "VIUVO"
  | "UNIAO_ESTAVEL"
  | "NAO_INFORMADO";
export type SupportLevel =
  | "MUITO_FAVORAVEL"
  | "FAVORAVEL"
  | "NEUTRO"
  | "DESFAVORAVEL"
  | "MUITO_DESFAVORAVEL"
  | "NAO_DEFINIDO";
export type PreferredContact = "TELEFONE" | "WHATSAPP" | "EMAIL";
export type EngagementTrend =
  | "CRESCENTE"
  | "ESTAVEL"
  | "DECRESCENTE"
  | "NAO_DEFINIDO";
export type HouseholdType =
  | "SOLTEIRO"
  | "FAMILIA_COM_FILHOS"
  | "FAMILIA_SEM_FILHOS"
  | "IDOSOS"
  | "ESTUDANTES"
  | "NAO_INFORMADO";
export type EmploymentStatus =
  | "EMPREGADO"
  | "DESEMPREGADO"
  | "APOSENTADO"
  | "ESTUDANTE"
  | "AUTONOMO"
  | "NAO_INFORMADO";
export type TurnoutLikelihood = "ALTO" | "MEDIO" | "BAIXO" | "NAO_DEFINIDO";
export type CommunicationStyle = "FORMAL" | "INFORMAL" | "NAO_DEFINIDO";
export type CommunityRole =
  | "LIDER"
  | "MEMBRO_ATIVO"
  | "ATIVISTA"
  | "MEMBRO"
  | "NAO_PARTICIPANTE"
  | "NAO_DEFINIDO";
export type VolunteerStatus =
  | "ATIVO"
  | "INATIVO"
  | "INTERESSADO"
  | "NAO_VOLUNTARIO";

export interface ReferralStats {
  total: number; // Total de pessoas indicadas
  active: number; // Referenciados ativos
  thisMonth: number; // Novos este mês
  byLevel: Record<SupportLevel, number>; // Por nível de apoio
}

export interface Voter {
  id: string;

  // Basic Information
  name: string;
  motherName?: string | null;
  cpf?: string | null;
  dateOfBirth?: string | null;
  gender?: Gender | null;

  // Contact Information
  email?: string | null;
  phone?: string | null;
  whatsapp?: string | null;

  // Address Information
  address?: string | null;
  addressNumber?: string | null;
  addressComplement?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  latitude?: number | string | null; // numeric from backend
  longitude?: number | string | null; // numeric from backend

  // Electoral Information
  electoralTitle?: string | null;
  electoralZone?: string | null;
  electoralSection?: string | null;
  votingLocation?: string | null;

  // Social Segmentation
  educationLevel?: EducationLevel | null;
  occupation?: string | null;
  incomeLevel?: IncomeLevel | null;
  maritalStatus?: MaritalStatus | null;
  religion?: string | null;
  ethnicity?: string | null;
  familyMembers?: number | null;

  // Social Media
  facebook?: string | null;
  instagram?: string | null;
  twitter?: string | null;

  // Contact Preferences
  hasWhatsapp?: string | boolean | null; // 'SIM' | 'NAO' from backend, boolean in forms
  preferredContact?: string | null; // 'TELEFONE' | 'WHATSAPP' | 'EMAIL'

  // Political Information
  supportLevel?: SupportLevel | null;
  politicalParty?: string | null;
  votingHistory?: string | null;
  topIssues?: any; // JSON string from backend, array in forms
  issuePositions?: any; // JSON string from backend
  previousCandidateSupport?: string | null;
  influencerScore?: number | null; // 0-100
  persuadability?: string | null; // 'ALTO' | 'MEDIO' | 'BAIXO'
  turnoutLikelihood?: TurnoutLikelihood | null;
  tags?: any; // JSON string from backend, array in forms
  notes?: string | null;

  // Engagement & Behavioral
  registrationDate?: string | null;
  lastEngagementDate?: string | null;
  engagementTrend?: EngagementTrend | null;
  seasonalActivity?: any; // JSON string from backend
  lastContactDate?: string | null;
  contactFrequency?: number | null; // times contacted
  responseRate?: number | null; // percentage 0-100
  eventAttendance?: any; // JSON string from backend
  volunteerStatus?: VolunteerStatus | null;
  donationHistory?: any; // JSON string from backend
  engagementScore?: number | null; // 0-100

  // Demographics Extended
  ageGroup?: string | null; // "18-25", "26-35", "36-50", "51-65", "65+"
  householdType?: HouseholdType | null;
  employmentStatus?: EmploymentStatus | null;
  vehicleOwnership?: string | boolean | null; // 'SIM' | 'NAO' from backend, boolean in forms
  internetAccess?: string | null; // "Fibra", "4G", "3G", "Limitado", "Sem acesso"

  // Communication Preferences Extended
  communicationStyle?: CommunicationStyle | null;
  contentPreference?: any; // JSON string from backend, array in forms
  bestContactTime?: string | null; // "Manhã", "Tarde", "Noite"
  bestContactDay?: any; // JSON string from backend, array in forms

  // Social Network & Influence
  socialMediaFollowers?: number | null;
  communityRole?: CommunityRole | null;
  referredVoters?: number | null;
  networkSize?: number | null;
  influenceRadius?: number | null; // km

  // Referral System
  referralCode?: string | null; // Código único de referência (ex: "JOAO-SILVA-ABC123")
  referredBy?: string | null; // ID do eleitor que o indicou
  referralDate?: string | null; // Data em que foi referenciado
  referralStats?: ReferralStats; // Calculated field, not from backend

  // Audit fields
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface VoterFilters {
  search?: string;
  cities?: string[];
  states?: string[];
  supportLevels?: SupportLevel[];
  hasWhatsapp?: boolean;
  hasLocation?: boolean;
  tags?: string[];
}

export type VoterSortField =
  | "name"
  | "email"
  | "city"
  | "supportLevel"
  | "createdAt";
export type SortOrder = "asc" | "desc";

export interface VoterSortOptions {
  field: VoterSortField;
  order: SortOrder;
}

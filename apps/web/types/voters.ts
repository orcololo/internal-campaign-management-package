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
  motherName?: string;
  cpf?: string;
  dateOfBirth?: string;
  gender?: Gender;

  // Contact Information
  email?: string;
  phone?: string;
  whatsapp?: string;

  // Address Information
  address?: string;
  addressNumber?: string;
  addressComplement?: string;
  neighborhood?: string;
  city: string;
  state: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;

  // Electoral Information
  electoralTitle?: string;
  electoralZone?: string;
  electoralSection?: string;
  votingLocation?: string;

  // Social Segmentation
  educationLevel?: EducationLevel;
  occupation?: string;
  incomeLevel?: IncomeLevel;
  maritalStatus?: MaritalStatus;
  religion?: string;
  ethnicity?: string;
  familyMembers?: number;

  // Social Media
  facebook?: string;
  instagram?: string;
  twitter?: string;

  // Contact Preferences
  hasWhatsapp?: boolean;
  preferredContact?: PreferredContact;

  // Political Information
  supportLevel?: SupportLevel;
  politicalParty?: string;
  votingHistory?: string;
  topIssues?: string[]; // Array of issues they care about
  issuePositions?: Record<string, string>; // Their stance on issues
  previousCandidateSupport?: string;
  influencerScore?: number; // 0-100
  persuadability?: "ALTO" | "MEDIO" | "BAIXO";
  turnoutLikelihood?: TurnoutLikelihood;
  tags: string[];
  notes?: string;

  // Engagement & Behavioral
  registrationDate?: string;
  lastEngagementDate?: string;
  engagementTrend?: EngagementTrend;
  seasonalActivity?: Record<string, number>; // month/season patterns
  lastContactDate?: string;
  contactFrequency?: number; // times contacted
  responseRate?: number; // percentage 0-100
  eventAttendance?: string[]; // Array of event IDs or names
  volunteerStatus?: VolunteerStatus;
  donationHistory?: Array<{ date: string; amount: number }>;
  engagementScore?: number; // 0-100

  // Demographics Extended
  ageGroup?: string; // "18-25", "26-35", "36-50", "51-65", "65+"
  householdType?: HouseholdType;
  employmentStatus?: EmploymentStatus;
  vehicleOwnership?: boolean;
  internetAccess?: string; // "Fibra", "4G", "3G", "Limitado", "Sem acesso"

  // Communication Preferences Extended
  communicationStyle?: CommunicationStyle;
  contentPreference?: string[]; // ["video", "texto", "imagens"]
  bestContactTime?: string; // "Manhã", "Tarde", "Noite"
  bestContactDay?: string[]; // Days of week

  // Social Network & Influence
  socialMediaFollowers?: number;
  communityRole?: CommunityRole;
  referredVoters?: number;
  networkSize?: number;
  influenceRadius?: number; // km

  // Referral System
  referralCode: string; // Código único de referência (ex: "JOAO-SILVA-ABC123")
  referredBy?: string; // ID do eleitor que o indicou
  referralDate?: string; // Data em que foi referenciado
  referralStats: ReferralStats; // Estatísticas de referenciamento

  // Audit fields
  createdAt: string;
  updatedAt: string;
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

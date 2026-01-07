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
  tags: string[];
  notes?: string;

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

export type VoterSortField = "name" | "email" | "city" | "supportLevel" | "createdAt";
export type SortOrder = "asc" | "desc";

export interface VoterSortOptions {
  field: VoterSortField;
  order: SortOrder;
}

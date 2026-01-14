import type { Voter } from "./voters";

import {
  ReportFilter,
  ReportSort,
  ReportConfig,
  SavedReport,
  ReportExportHistory,
  FilterOperator,
  LogicalOperator,
  ReportFormat
} from "@repo/types";

export type {
  FilterOperator,
  LogicalOperator,
  ReportFilter,
  ReportSort,
  ReportFormat,
  ReportConfig,
  SavedReport,
  ReportExportHistory
};

// Field metadata for dynamic UI generation
export interface FieldMetadata {
  key: keyof Voter;
  label: string;
  type: "string" | "number" | "date" | "enum" | "boolean";
  category:
  | "basic"
  | "contact"
  | "address"
  | "electoral"
  | "social"
  | "political"
  | "engagement"
  | "demographics"
  | "communication"
  | "social_network"
  | "additional";
  enumValues?: string[];
  operators: FilterOperator[];
}

// Voter field categories
export const VOTER_FIELD_CATEGORIES = {
  basic: "Informações Básicas",
  contact: "Contato",
  address: "Endereço",
  electoral: "Informações Eleitorais",
  social: "Segmentação Social",
  political: "Informações Políticas",
  engagement: "Engajamento",
  demographics: "Demografia",
  communication: "Comunicação",
  social_network: "Redes Sociais",
  additional: "Informações Adicionais",
} as const;

// Complete field metadata
export const VOTER_FIELDS_METADATA: FieldMetadata[] = [
  // Basic Information
  {
    key: "id",
    label: "ID",
    type: "string",
    category: "basic",
    operators: ["equals", "notEquals"],
  },
  {
    key: "name",
    label: "Nome",
    type: "string",
    category: "basic",
    operators: [
      "equals",
      "contains",
      "startsWith",
      "endsWith",
      "isEmpty",
      "isNotEmpty",
    ],
  },
  {
    key: "cpf",
    label: "CPF",
    type: "string",
    category: "basic",
    operators: ["equals", "contains", "isEmpty", "isNotEmpty"],
  },
  {
    key: "dateOfBirth",
    label: "Data de Nascimento",
    type: "date",
    category: "basic",
    operators: [
      "equals",
      "greaterThan",
      "lessThan",
      "between",
      "isEmpty",
      "isNotEmpty",
    ],
  },
  {
    key: "gender",
    label: "Gênero",
    type: "enum",
    category: "basic",
    enumValues: ["Masculino", "Feminino", "Outro", "Não informado"],
    operators: ["equals", "in", "notIn"],
  },
  {
    key: "ageGroup",
    label: "Faixa Etária",
    type: "string",
    category: "demographics",
    operators: ["equals", "in", "notIn"],
  },

  // Contact Information
  {
    key: "phone",
    label: "Telefone",
    type: "string",
    category: "contact",
    operators: ["equals", "contains", "isEmpty", "isNotEmpty"],
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    type: "string",
    category: "contact",
    operators: ["equals", "contains", "isEmpty", "isNotEmpty"],
  },
  {
    key: "email",
    label: "Email",
    type: "string",
    category: "contact",
    operators: ["equals", "contains", "isEmpty", "isNotEmpty"],
  },
  {
    key: "hasWhatsapp",
    label: "Tem WhatsApp",
    type: "boolean",
    category: "contact",
    operators: ["equals"],
  },
  {
    key: "preferredContact",
    label: "Contato Preferido",
    type: "string",
    category: "communication",
    operators: ["equals", "in"],
  },

  // Address Information
  {
    key: "address",
    label: "Endereço",
    type: "string",
    category: "address",
    operators: ["contains", "isEmpty", "isNotEmpty"],
  },
  {
    key: "neighborhood",
    label: "Bairro",
    type: "string",
    category: "address",
    operators: ["equals", "contains", "in", "isEmpty"],
  },
  {
    key: "city",
    label: "Cidade",
    type: "string",
    category: "address",
    operators: ["equals", "contains", "in"],
  },
  {
    key: "state",
    label: "Estado",
    type: "string",
    category: "address",
    operators: ["equals", "in"],
  },
  {
    key: "zipCode",
    label: "CEP",
    type: "string",
    category: "address",
    operators: ["equals", "contains", "isEmpty"],
  },
  {
    key: "latitude",
    label: "Latitude",
    type: "number",
    category: "address",
    operators: ["equals", "greaterThan", "lessThan", "between", "isEmpty"],
  },
  {
    key: "longitude",
    label: "Longitude",
    type: "number",
    category: "address",
    operators: ["equals", "greaterThan", "lessThan", "between", "isEmpty"],
  },

  // Electoral Information
  {
    key: "electoralTitle",
    label: "Título Eleitoral",
    type: "string",
    category: "electoral",
    operators: ["equals", "contains", "isEmpty"],
  },
  {
    key: "electoralZone",
    label: "Zona Eleitoral",
    type: "string",
    category: "electoral",
    operators: ["equals", "in"],
  },
  {
    key: "electoralSection",
    label: "Seção Eleitoral",
    type: "string",
    category: "electoral",
    operators: ["equals", "in"],
  },
  {
    key: "votingLocation",
    label: "Local de Votação",
    type: "string",
    category: "electoral",
    operators: ["equals", "contains", "in"],
  },

  // Social Segmentation
  {
    key: "educationLevel",
    label: "Escolaridade",
    type: "enum",
    category: "social",
    operators: ["equals", "in", "notIn"],
  },
  {
    key: "occupation",
    label: "Ocupação",
    type: "string",
    category: "social",
    operators: ["equals", "contains", "isEmpty"],
  },
  {
    key: "incomeLevel",
    label: "Faixa de Renda",
    type: "enum",
    category: "social",
    operators: ["equals", "in", "notIn"],
  },
  {
    key: "maritalStatus",
    label: "Estado Civil",
    type: "enum",
    category: "social",
    operators: ["equals", "in", "notIn"],
  },
  {
    key: "religion",
    label: "Religião",
    type: "string",
    category: "social",
    operators: ["equals", "contains", "in", "isEmpty"],
  },
  {
    key: "ethnicity",
    label: "Etnia",
    type: "string",
    category: "social",
    operators: ["equals", "in"],
  },

  // Social Media
  {
    key: "facebook",
    label: "Facebook",
    type: "string",
    category: "social_network",
    operators: ["contains", "isEmpty", "isNotEmpty"],
  },
  {
    key: "instagram",
    label: "Instagram",
    type: "string",
    category: "social_network",
    operators: ["contains", "isEmpty", "isNotEmpty"],
  },
  {
    key: "twitter",
    label: "Twitter",
    type: "string",
    category: "social_network",
    operators: ["contains", "isEmpty", "isNotEmpty"],
  },

  // Political Information
  {
    key: "supportLevel",
    label: "Nível de Apoio",
    type: "enum",
    category: "political",
    operators: ["equals", "in", "notIn"],
  },
  {
    key: "politicalParty",
    label: "Partido Político",
    type: "string",
    category: "political",
    operators: ["equals", "contains", "in", "isEmpty"],
  },
  {
    key: "influencerScore",
    label: "Score de Influência",
    type: "number",
    category: "political",
    operators: ["equals", "greaterThan", "lessThan", "between", "isEmpty"],
  },
  {
    key: "persuadability",
    label: "Persuasibilidade",
    type: "string",
    category: "political",
    operators: ["equals", "in"],
  },
  {
    key: "turnoutLikelihood",
    label: "Probabilidade de Comparecimento",
    type: "enum",
    category: "political",
    operators: ["equals", "in", "notIn"],
  },

  // Engagement & Behavioral
  {
    key: "registrationDate",
    label: "Data de Cadastro",
    type: "date",
    category: "engagement",
    operators: ["equals", "greaterThan", "lessThan", "between"],
  },
  {
    key: "lastEngagementDate",
    label: "Último Engajamento",
    type: "date",
    category: "engagement",
    operators: ["equals", "greaterThan", "lessThan", "between", "isEmpty"],
  },
  {
    key: "engagementTrend",
    label: "Tendência de Engajamento",
    type: "enum",
    category: "engagement",
    operators: ["equals", "in"],
  },
  {
    key: "lastContactDate",
    label: "Último Contato",
    type: "date",
    category: "engagement",
    operators: ["equals", "greaterThan", "lessThan", "between", "isEmpty"],
  },
  {
    key: "contactFrequency",
    label: "Frequência de Contato",
    type: "number",
    category: "engagement",
    operators: ["equals", "greaterThan", "lessThan", "between"],
  },
  {
    key: "responseRate",
    label: "Taxa de Resposta",
    type: "number",
    category: "engagement",
    operators: ["equals", "greaterThan", "lessThan", "between"],
  },
  {
    key: "volunteerStatus",
    label: "Status de Voluntário",
    type: "enum",
    category: "engagement",
    operators: ["equals", "in", "notIn"],
  },
  {
    key: "engagementScore",
    label: "Score de Engajamento",
    type: "number",
    category: "engagement",
    operators: ["equals", "greaterThan", "lessThan", "between"],
  },

  // Demographics Extended
  {
    key: "householdType",
    label: "Tipo de Domicílio",
    type: "enum",
    category: "demographics",
    operators: ["equals", "in", "notIn"],
  },
  {
    key: "employmentStatus",
    label: "Status de Emprego",
    type: "enum",
    category: "demographics",
    operators: ["equals", "in", "notIn"],
  },
  {
    key: "vehicleOwnership",
    label: "Possui Veículo",
    type: "boolean",
    category: "demographics",
    operators: ["equals"],
  },
  {
    key: "internetAccess",
    label: "Acesso à Internet",
    type: "string",
    category: "demographics",
    operators: ["equals", "in"],
  },

  // Communication Preferences
  {
    key: "communicationStyle",
    label: "Estilo de Comunicação",
    type: "enum",
    category: "communication",
    operators: ["equals", "in"],
  },
  {
    key: "bestContactTime",
    label: "Melhor Horário de Contato",
    type: "string",
    category: "communication",
    operators: ["equals", "in"],
  },

  // Social Network & Influence
  {
    key: "socialMediaFollowers",
    label: "Seguidores Redes Sociais",
    type: "number",
    category: "social_network",
    operators: ["equals", "greaterThan", "lessThan", "between"],
  },
  {
    key: "communityRole",
    label: "Papel na Comunidade",
    type: "enum",
    category: "social",
    operators: ["equals", "in", "notIn"],
  },
  {
    key: "referredVoters",
    label: "Eleitores Referenciados",
    type: "number",
    category: "engagement",
    operators: ["equals", "greaterThan", "lessThan", "between"],
  },
  {
    key: "networkSize",
    label: "Tamanho da Rede",
    type: "number",
    category: "social",
    operators: ["equals", "greaterThan", "lessThan", "between"],
  },

  // Additional
  {
    key: "familyMembers",
    label: "Membros da Família",
    type: "number",
    category: "additional",
    operators: ["equals", "greaterThan", "lessThan", "between"],
  },
  {
    key: "tags",
    label: "Tags",
    type: "string",
    category: "additional",
    operators: ["contains", "in"],
  },
  {
    key: "notes",
    label: "Observações",
    type: "string",
    category: "additional",
    operators: ["contains", "isEmpty", "isNotEmpty"],
  },

  // Audit
  {
    key: "createdAt",
    label: "Criado em",
    type: "date",
    category: "additional",
    operators: ["equals", "greaterThan", "lessThan", "between"],
  },
  {
    key: "updatedAt",
    label: "Atualizado em",
    type: "date",
    category: "additional",
    operators: ["equals", "greaterThan", "lessThan", "between"],
  },
];

// Helper to get field metadata
export function getFieldMetadata(
  field: keyof Voter
): FieldMetadata | undefined {
  return VOTER_FIELDS_METADATA.find((f) => f.key === field);
}

export function getFieldLabel(field: keyof Voter): string {
  return getFieldMetadata(field)?.label || String(field);
}

// Helper to get fields by category
export function getFieldsByCategory(
  category: FieldMetadata["category"]
): FieldMetadata[] {
  return VOTER_FIELDS_METADATA.filter((f) => f.category === category);
}

// Helper to get operator label
export function getOperatorLabel(operator: FilterOperator): string {
  const labels: Record<FilterOperator, string> = {
    equals: "Igual a",
    notEquals: "Diferente de",
    contains: "Contém",
    notContains: "Não contém",
    startsWith: "Começa com",
    endsWith: "Termina com",
    greaterThan: "Maior que",
    lessThan: "Menor que",
    greaterThanOrEqual: "Maior ou igual a",
    lessThanOrEqual: "Menor ou igual a",
    between: "Entre",
    in: "Em",
    notIn: "Não em",
    isEmpty: "Está vazio",
    isNotEmpty: "Não está vazio",
  };
  return labels[operator];
}

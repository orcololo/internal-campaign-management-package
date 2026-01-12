import {
  Voter,
  SupportLevel,
  Gender,
  EducationLevel,
  IncomeLevel,
  MaritalStatus,
  EngagementTrend,
  HouseholdType,
  EmploymentStatus,
  TurnoutLikelihood,
  CommunicationStyle,
  CommunityRole,
  VolunteerStatus,
} from "@/types/voters";

const brazilianNames = [
  "João Silva",
  "Maria Santos",
  "José Oliveira",
  "Ana Costa",
  "Pedro Souza",
  "Carla Lima",
  "Paulo Alves",
  "Juliana Ferreira",
  "Ricardo Rodrigues",
  "Fernanda Martins",
  "Lucas Pereira",
  "Beatriz Gomes",
  "Rafael Ribeiro",
  "Patricia Carvalho",
  "Marcelo Araujo",
  "Camila Nascimento",
  "Gustavo Mendes",
  "Amanda Barbosa",
  "Felipe Rocha",
  "Leticia Almeida",
  "Bruno Castro",
  "Gabriela Cunha",
  "Rodrigo Correia",
  "Renata Dias",
  "Tiago Cardoso",
  "Carolina Teixeira",
  "Diego Monteiro",
  "Isabela Fernandes",
  "Vitor Pinto",
  "Larissa Cavalcanti",
  "Thiago Soares",
  "Vanessa Lopes",
  "Eduardo Moreira",
  "Aline Freitas",
  "Fabio Azevedo",
  "Mariana Nunes",
  "Andre Batista",
  "Priscila Ramos",
  "Leonardo Castro",
  "Daniela Melo",
  "Matheus Lima",
  "Tatiana Duarte",
  "Vinicius Barros",
  "Raquel Farias",
  "Guilherme Vieira",
  "Bruna Morais",
  "Henrique Campos",
  "Julia Miranda",
  "Fernando Pires",
  "Monica Tavares",
];

const motherNames = [
  "Maria Silva",
  "Ana Santos",
  "Rosa Oliveira",
  "Francisca Costa",
  "Antonia Souza",
  "Helena Lima",
  "Lucia Alves",
  "Mariana Ferreira",
  "Teresa Rodrigues",
  "Isabel Martins",
  "Joana Barbosa",
  "Rita Ferreira",
  "Carmen Souza",
  "Beatriz Oliveira",
  "Julia Costa",
  "Cristina Lima",
  "Aparecida Santos",
  "Regina Almeida",
  "Sonia Pereira",
  "Vera Gomes",
];

// All voters will be from Macapá, Amapá
const macapaLocation = {
  city: "Macapá",
  state: "AP",
  lat: 0.0349,
  lng: -51.0694,
};

const supportLevels: SupportLevel[] = [
  "MUITO_FAVORAVEL",
  "FAVORAVEL",
  "NEUTRO",
  "DESFAVORAVEL",
  "MUITO_DESFAVORAVEL",
  "NAO_DEFINIDO",
];
const genders: Gender[] = ["MASCULINO", "FEMININO", "OUTRO", "NAO_INFORMADO"];
const educationLevels: EducationLevel[] = [
  "FUNDAMENTAL_INCOMPLETO",
  "FUNDAMENTAL_COMPLETO",
  "MEDIO_INCOMPLETO",
  "MEDIO_COMPLETO",
  "SUPERIOR_INCOMPLETO",
  "SUPERIOR_COMPLETO",
  "POS_GRADUACAO",
  "NAO_INFORMADO",
];
const incomeLevels: IncomeLevel[] = [
  "ATE_1_SALARIO",
  "DE_1_A_2_SALARIOS",
  "DE_2_A_5_SALARIOS",
  "DE_5_A_10_SALARIOS",
  "ACIMA_10_SALARIOS",
  "NAO_INFORMADO",
];
const maritalStatuses: MaritalStatus[] = [
  "SOLTEIRO",
  "CASADO",
  "DIVORCIADO",
  "VIUVO",
  "UNIAO_ESTAVEL",
  "NAO_INFORMADO",
];
const engagementTrends: EngagementTrend[] = [
  "CRESCENTE",
  "ESTAVEL",
  "DECRESCENTE",
  "NAO_DEFINIDO",
];
const householdTypes: HouseholdType[] = [
  "SOLTEIRO",
  "FAMILIA_COM_FILHOS",
  "FAMILIA_SEM_FILHOS",
  "IDOSOS",
  "ESTUDANTES",
  "NAO_INFORMADO",
];
const employmentStatuses: EmploymentStatus[] = [
  "EMPREGADO",
  "DESEMPREGADO",
  "APOSENTADO",
  "ESTUDANTE",
  "AUTONOMO",
  "NAO_INFORMADO",
];
const turnoutLikelihoods: TurnoutLikelihood[] = [
  "ALTO",
  "MEDIO",
  "BAIXO",
  "NAO_DEFINIDO",
];
const communicationStyles: CommunicationStyle[] = [
  "FORMAL",
  "INFORMAL",
  "NAO_DEFINIDO",
];
const communityRoles: CommunityRole[] = [
  "LIDER",
  "MEMBRO_ATIVO",
  "ATIVISTA",
  "MEMBRO",
  "NAO_PARTICIPANTE",
  "NAO_DEFINIDO",
];
const volunteerStatuses: VolunteerStatus[] = [
  "ATIVO",
  "INATIVO",
  "INTERESSADO",
  "NAO_VOLUNTARIO",
];
const ageGroups = ["18-25", "26-35", "36-50", "51-65", "65+"];
const topIssuesOptions = [
  "Educação",
  "Saúde",
  "Segurança",
  "Economia",
  "Meio Ambiente",
  "Transporte",
  "Emprego",
  "Habitação",
];
const contentPreferences = ["video", "texto", "imagens", "audio"];
const contactTimes = ["Manhã", "Tarde", "Noite"];
const contactDays = [
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
  "Domingo",
];
const internetAccessTypes = ["Fibra", "4G", "3G", "Limitado", "Sem acesso"];
const persuadabilityLevels = ["ALTO", "MEDIO", "BAIXO"] as const;

// Neighborhoods in Macapá, Amapá
const macapaNeighborhoods = [
  "Centro",
  "Trem",
  "Laguinho",
  "Jesus de Nazaré",
  "Santa Rita",
  "Pacoval",
  "Araxá",
  "Buritizal",
  "Zerão",
  "Universidade",
  "Beirol",
  "São Lázaro",
  "Congós",
  "Jardim Equatorial",
  "Nova Esperança",
  "Perpétuo Socorro",
  "Cidade Nova",
  "Infraero",
  "Muca",
  "Novo Horizonte",
];

const tags = [
  "Líder Comunitário",
  "Jovem",
  "Idoso",
  "Empresário",
  "Professor",
  "Trabalhador Rural",
  "Comerciante",
  "Profissional da Saúde",
  "Servidor Público",
  "Aposentado",
  "Autônomo",
  "Microempresário",
  "Líder Religioso",
  "Sindicalista",
];

const zones = ["1", "2", "3", "4", "5", "10", "15", "20", "25", "30"];
const sections = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "10",
  "15",
  "20",
  "25",
  "30",
  "35",
  "40",
];

function generateEmail(name: string): string {
  const cleaned = name
    .toLowerCase()
    .normalize("NFD")
    .replaceAll(/[\u0300-\u036f]/g, "")
    .replaceAll(/\s+/g, ".");
  const domains = ["gmail.com", "hotmail.com", "yahoo.com.br", "outlook.com"];
  return `${cleaned}@${domains[Math.floor(Math.random() * domains.length)]}`;
}

function generatePhone(): string {
  // DDD 96 is for Macapá, Amapá
  const ddd = "96";
  const prefix = Math.random() > 0.5 ? "9" : "8";
  const number = Math.floor(10000000 + Math.random() * 90000000);
  return `(${ddd}) ${prefix}${number.toString().substring(0, 4)}-${number
    .toString()
    .substring(4)}`;
}

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateCPF(): string {
  const num = Math.floor(10000000000 + Math.random() * 90000000000).toString();
  return `${num.substring(0, 3)}.${num.substring(3, 6)}.${num.substring(
    6,
    9
  )}-${num.substring(9, 11)}`;
}

function generateBirthDate(): string {
  const year = 1940 + Math.floor(Math.random() * 65); // Ages between 18 and 83
  const month = Math.floor(Math.random() * 12) + 1;
  const day = Math.floor(Math.random() * 28) + 1;
  return `${year}-${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")}`;
}

function generateCEP(): string {
  // CEP range for Macapá: 68900-000 to 68949-999
  const base = 68900000 + Math.floor(Math.random() * 50000);
  const cep = base.toString();
  return `${cep.substring(0, 5)}-${cep.substring(5, 8)}`;
}

function generateReferralCode(name: string, index: number): string {
  const cleaned = name
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${cleaned.substring(0, 15)}-${random}`;
}

function generateVoter(index: number): Voter {
  const name = getRandomItem(brazilianNames);

  // All voters from Macapá
  const createdDate = new Date(
    Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
  );

  // Generate complete address
  const streetTypes = ["Rua", "Avenida", "Travessa", "Alameda"];
  const streetNames = [
    "Cândido Mendes",
    "Hamilton Silva",
    "Jovino Dinoá",
    "São José",
    "Leopoldo Machado",
    "Mendonça Júnior",
    "Tiradentes",
    "Antônio Coelho de Carvalho",
    "General Rondon",
    "Odilardo Silva",
    "Adilson José Pinto Pereira",
    "Equatorial",
    "Paraná",
    "Amazonas",
  ];

  return {
    id: `voter-${index + 1}`,

    // Basic Information - ALL COMPLETE
    name,
    motherName: getRandomItem(motherNames),
    cpf: generateCPF(),
    dateOfBirth: generateBirthDate(),
    gender: getRandomItem(genders.filter((g) => g !== "NAO_INFORMADO")),

    // Contact Information - ALL COMPLETE
    email: generateEmail(name),
    phone: generatePhone(),
    whatsapp: generatePhone(), // Everyone has WhatsApp

    // Address Information - ALL COMPLETE
    address: `${getRandomItem(streetTypes)} ${getRandomItem(streetNames)}`,
    addressNumber: (Math.floor(Math.random() * 2000) + 1).toString(),
    addressComplement:
      Math.random() > 0.6
        ? `Apto ${Math.floor(Math.random() * 300) + 1}`
        : `Casa ${Math.floor(Math.random() * 10) + 1}`,
    neighborhood: getRandomItem(macapaNeighborhoods),
    city: macapaLocation.city,
    state: macapaLocation.state,
    zipCode: generateCEP(),
    latitude: macapaLocation.lat + (Math.random() - 0.5) * 0.05, // Spread within Macapá
    longitude: macapaLocation.lng + (Math.random() - 0.5) * 0.05,

    // Electoral Information - ALL COMPLETE
    electoralTitle: Math.floor(
      100000000000 + Math.random() * 900000000000
    ).toString(),
    electoralZone: getRandomItem(zones),
    electoralSection: getRandomItem(sections),
    votingLocation: `Escola ${getRandomItem([
      "Estadual Professora Esther da Silva Virgolino",
      "Municipal Maria Ivone de Menezes",
      "Técnica do Amapá",
      "Jesus de Nazaré",
      "Raimundo Nonato Dias Rodrigues",
      "Gabriel Almeida Café",
      "José de Anchieta",
      "Professora Hilda de Souza Mello Castro",
    ])}`,

    // Social Segmentation - ALL COMPLETE
    educationLevel: getRandomItem(
      educationLevels.filter((e) => e !== "NAO_INFORMADO")
    ),
    occupation: getRandomItem([
      "Professor",
      "Comerciante",
      "Servidor Público",
      "Empresário",
      "Autônomo",
      "Pescador",
      "Técnico de Enfermagem",
      "Motorista",
      "Vendedor",
      "Mecânico",
      "Enfermeiro",
      "Agricultor",
      "Policial",
      "Bombeiro",
      "Advogado",
      "Contador",
      "Auxiliar Administrativo",
      "Recepcionista",
      "Cozinheiro",
      "Garçom",
    ]),
    incomeLevel: getRandomItem(
      incomeLevels.filter((i) => i !== "NAO_INFORMADO")
    ),
    maritalStatus: getRandomItem(
      maritalStatuses.filter((m) => m !== "NAO_INFORMADO")
    ),
    religion: getRandomItem([
      "Católica",
      "Evangélica",
      "Assembleia de Deus",
      "Batista",
      "Universal",
      "Adventista",
      "Espírita",
      "Umbanda",
      "Sem religião",
    ]),
    ethnicity: getRandomItem([
      "Branca",
      "Parda",
      "Preta",
      "Amarela",
      "Indígena",
    ]),
    familyMembers: Math.floor(Math.random() * 7) + 1, // 1 to 7 family members

    // Social Media - ALL COMPLETE
    facebook:
      Math.random() > 0.3
        ? `facebook.com/${name
            .toLowerCase()
            .normalize("NFD")
            .replaceAll(/[\u0300-\u036f]/g, "")
            .replaceAll(/\s/g, ".")}${index}`
        : undefined,
    instagram:
      Math.random() > 0.2
        ? `@${name
            .toLowerCase()
            .normalize("NFD")
            .replaceAll(/[\u0300-\u036f]/g, "")
            .replaceAll(/\s/g, "_")}${index}`
        : undefined,
    twitter:
      Math.random() > 0.5
        ? `@${name
            .toLowerCase()
            .normalize("NFD")
            .replaceAll(/[\u0300-\u036f]/g, "")
            .replaceAll(/\s/g, "_")}${index}`
        : `@${name.split(" ")[0].toLowerCase()}${index}`,

    // Contact Preferences - ALL COMPLETE
    hasWhatsapp: true, // Everyone has WhatsApp
    preferredContact: getRandomItem(["WHATSAPP", "TELEFONE", "EMAIL"]),

    // Political Information - ALL COMPLETE
    supportLevel: getRandomItem(
      supportLevels.filter((s) => s !== "NAO_DEFINIDO")
    ),
    politicalParty:
      Math.random() > 0.3
        ? getRandomItem([
            "PT",
            "PSDB",
            "MDB",
            "PP",
            "PSD",
            "PDT",
            "PSB",
            "Republicanos",
            "PL",
            "PSOL",
            "Sem partido",
          ])
        : undefined,
    votingHistory:
      Math.random() > 0.5
        ? `Votou nas eleições de ${
            2018 + Math.floor(Math.random() * 3) * 2
          } em Macapá, compareceu em ${
            Math.floor(Math.random() * 4) + 2
          } das últimas 5 eleições`
        : undefined,
    topIssues: getRandomItems(
      topIssuesOptions,
      Math.floor(Math.random() * 4) + 2
    ), // 2-5 issues
    issuePositions:
      Math.random() > 0.4
        ? {
            Saúde: getRandomItem([
              "A favor de mais investimento",
              "Prioridade máxima",
              "Melhorias urgentes",
            ]),
            Educação: getRandomItem([
              "Valorização dos professores",
              "Mais escolas",
              "Qualidade de ensino",
            ]),
          }
        : undefined,
    previousCandidateSupport:
      Math.random() > 0.5
        ? getRandomItem([
            "Candidato A - 2020",
            "Candidato B - 2018",
            "Candidato C - 2020",
            "Independente",
          ])
        : undefined,
    influencerScore: Math.floor(Math.random() * 101), // 0-100
    persuadability: getRandomItem([...persuadabilityLevels]) as
      | "ALTO"
      | "MEDIO"
      | "BAIXO",
    turnoutLikelihood: getRandomItem(
      turnoutLikelihoods.filter((t) => t !== "NAO_DEFINIDO")
    ),
    tags: getRandomItems(tags, Math.floor(Math.random() * 4) + 1), // 1 to 4 tags
    notes:
      Math.random() > 0.3
        ? `${getRandomItem([
            "Muito engajado na comunidade",
            "Participa ativamente de reuniões",
            "Líder de opinião no bairro",
            "Interessado em projetos sociais",
            "Preocupado com segurança pública",
            "Defende melhorias na saúde",
            "Apoia educação de qualidade",
            "Engajado em causas ambientais",
            "Ativo nas redes sociais",
            "Influente na região",
          ])}. ${getRandomItem([
            "Tem grande rede de contatos",
            "Comparece sempre aos eventos",
            "Mobiliza outros eleitores",
            "Participa de grupos comunitários",
            "Voluntário em projetos locais",
          ])}.`
        : undefined,

    // Engagement & Behavioral
    registrationDate: new Date(
      Date.now() - Math.random() * 730 * 24 * 60 * 60 * 1000
    ).toISOString(), // Last 2 years
    lastEngagementDate: new Date(
      Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000
    ).toISOString(), // Last 90 days
    engagementTrend: getRandomItem(
      engagementTrends.filter((e) => e !== "NAO_DEFINIDO")
    ),
    seasonalActivity:
      Math.random() > 0.3
        ? {
            Janeiro: Math.floor(Math.random() * 10),
            Fevereiro: Math.floor(Math.random() * 10),
            Março: Math.floor(Math.random() * 10),
          }
        : undefined,
    lastContactDate:
      Math.random() > 0.2
        ? new Date(
            Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000
          ).toISOString()
        : undefined,
    contactFrequency: Math.floor(Math.random() * 30), // 0-30 times
    responseRate: Math.floor(Math.random() * 101), // 0-100%
    eventAttendance:
      Math.random() > 0.4
        ? getRandomItems(
            [
              "Reunião Comunitária - Jan/2025",
              "Caminhada do Candidato - Dez/2024",
              "Debate Político - Nov/2024",
              "Evento de Saúde - Out/2024",
            ],
            Math.floor(Math.random() * 3) + 1
          )
        : undefined,
    volunteerStatus: getRandomItem(volunteerStatuses),
    donationHistory:
      Math.random() > 0.7
        ? [
            {
              date: "2024-12-01",
              amount: Math.floor(Math.random() * 500) + 50,
            },
            {
              date: "2024-10-15",
              amount: Math.floor(Math.random() * 300) + 30,
            },
          ]
        : undefined,
    engagementScore: Math.floor(Math.random() * 101), // 0-100

    // Demographics Extended
    ageGroup: getRandomItem(ageGroups),
    householdType: getRandomItem(
      householdTypes.filter((h) => h !== "NAO_INFORMADO")
    ),
    employmentStatus: getRandomItem(
      employmentStatuses.filter((e) => e !== "NAO_INFORMADO")
    ),
    vehicleOwnership: Math.random() > 0.4,
    internetAccess: getRandomItem(internetAccessTypes),

    // Communication Preferences Extended
    communicationStyle: getRandomItem(
      communicationStyles.filter((c) => c !== "NAO_DEFINIDO")
    ),
    contentPreference: getRandomItems(
      contentPreferences,
      Math.floor(Math.random() * 3) + 1
    ),
    bestContactTime: getRandomItem(contactTimes),
    bestContactDay: getRandomItems(
      contactDays,
      Math.floor(Math.random() * 3) + 2
    ),

    // Social Network & Influence
    socialMediaFollowers: Math.floor(Math.random() * 5000),
    communityRole: getRandomItem(
      communityRoles.filter((c) => c !== "NAO_DEFINIDO")
    ),
    referredVoters: Math.floor(Math.random() * 15),
    networkSize: Math.floor(Math.random() * 500) + 50,
    influenceRadius: Math.random() * 10 + 0.5, // 0.5-10.5 km

    // Referral System - will be populated after all voters are created
    referralCode: generateReferralCode(name, index),
    referredBy: undefined,
    referralDate: undefined,
    referralStats: {
      total: 0,
      active: 0,
      thisMonth: 0,
      byLevel: {
        MUITO_FAVORAVEL: 0,
        FAVORAVEL: 0,
        NEUTRO: 0,
        DESFAVORAVEL: 0,
        MUITO_DESFAVORAVEL: 0,
        NAO_DEFINIDO: 0,
      },
    },

    // Audit fields
    createdAt: createdDate.toISOString(),
    updatedAt: createdDate.toISOString(),
  };
}

// Generate 200 mock voters - all from Macapá, Amapá with complete data
const generatedVoters: Voter[] = Array.from({ length: 200 }, (_, i) =>
  generateVoter(i)
);

// Create referral relationships
// First 10 voters are "influencers" with referrals
const influencerIds = generatedVoters.slice(0, 10).map(v => v.id);

// Assign referrals to influencers
generatedVoters.forEach((voter, index) => {
  // Skip the first 10 (influencers)
  if (index >= 10 && index < 100) {
    // 40% of remaining voters were referred
    if (Math.random() > 0.6) {
      const referrerId = getRandomItem(influencerIds);
      voter.referredBy = referrerId;
      voter.referralDate = new Date(
        Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000 // Last 6 months
      ).toISOString();
    }
  }
});

// Calculate referral stats for each voter
generatedVoters.forEach(voter => {
  const referrals = generatedVoters.filter(v => v.referredBy === voter.id);
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  
  voter.referralStats = {
    total: referrals.length,
    active: referrals.filter(v => v.lastEngagementDate && 
      new Date(v.lastEngagementDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ).length,
    thisMonth: referrals.filter(v => v.referralDate && 
      new Date(v.referralDate) >= thisMonthStart
    ).length,
    byLevel: referrals.reduce((acc, v) => {
      const level = v.supportLevel || "NAO_DEFINIDO";
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {
      MUITO_FAVORAVEL: 0,
      FAVORAVEL: 0,
      NEUTRO: 0,
      DESFAVORAVEL: 0,
      MUITO_DESFAVORAVEL: 0,
      NAO_DEFINIDO: 0,
    } as Record<SupportLevel, number>),
  };
});

export const voters: Voter[] = generatedVoters;

// Export for API client registration
export default voters;

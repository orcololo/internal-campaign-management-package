import { Voter, SupportLevel, Gender, EducationLevel, IncomeLevel, MaritalStatus } from "@/types/voters";

const brazilianNames = [
  "João Silva", "Maria Santos", "José Oliveira", "Ana Costa", "Pedro Souza",
  "Carla Lima", "Paulo Alves", "Juliana Ferreira", "Ricardo Rodrigues", "Fernanda Martins",
  "Lucas Pereira", "Beatriz Gomes", "Rafael Ribeiro", "Patricia Carvalho", "Marcelo Araujo",
  "Camila Nascimento", "Gustavo Mendes", "Amanda Barbosa", "Felipe Rocha", "Leticia Almeida",
  "Bruno Castro", "Gabriela Cunha", "Rodrigo Correia", "Renata Dias", "Tiago Cardoso",
  "Carolina Teixeira", "Diego Monteiro", "Isabela Fernandes", "Vitor Pinto", "Larissa Cavalcanti",
  "Thiago Soares", "Vanessa Lopes", "Eduardo Moreira", "Aline Freitas", "Fabio Azevedo",
  "Mariana Nunes", "Andre Batista", "Priscila Ramos", "Leonardo Castro", "Daniela Melo",
  "Matheus Lima", "Tatiana Duarte", "Vinicius Barros", "Raquel Farias", "Guilherme Vieira",
  "Bruna Morais", "Henrique Campos", "Julia Miranda", "Fernando Pires", "Monica Tavares",
];

const motherNames = [
  "Maria Silva", "Ana Santos", "Rosa Oliveira", "Francisca Costa", "Antonia Souza",
  "Helena Lima", "Lucia Alves", "Mariana Ferreira", "Teresa Rodrigues", "Isabel Martins",
];

const brazilianCities = [
  { city: "São Paulo", state: "SP", lat: -23.5505, lng: -46.6333 },
  { city: "Rio de Janeiro", state: "RJ", lat: -22.9068, lng: -43.1729 },
  { city: "Belo Horizonte", state: "MG", lat: -19.9167, lng: -43.9345 },
  { city: "Brasília", state: "DF", lat: -15.7939, lng: -47.8828 },
  { city: "Salvador", state: "BA", lat: -12.9714, lng: -38.5014 },
  { city: "Fortaleza", state: "CE", lat: -3.7172, lng: -38.5433 },
  { city: "Curitiba", state: "PR", lat: -25.4284, lng: -49.2733 },
  { city: "Recife", state: "PE", lat: -8.0578, lng: -34.8831 },
  { city: "Porto Alegre", state: "RS", lat: -30.0346, lng: -51.2177 },
  { city: "Manaus", state: "AM", lat: -3.1190, lng: -60.0217 },
];

const supportLevels: SupportLevel[] = ["MUITO_FAVORAVEL", "FAVORAVEL", "NEUTRO", "DESFAVORAVEL", "MUITO_DESFAVORAVEL", "NAO_DEFINIDO"];
const genders: Gender[] = ["MASCULINO", "FEMININO", "OUTRO", "NAO_INFORMADO"];
const educationLevels: EducationLevel[] = ["FUNDAMENTAL_INCOMPLETO", "FUNDAMENTAL_COMPLETO", "MEDIO_INCOMPLETO", "MEDIO_COMPLETO", "SUPERIOR_INCOMPLETO", "SUPERIOR_COMPLETO", "POS_GRADUACAO", "NAO_INFORMADO"];
const incomeLevels: IncomeLevel[] = ["ATE_1_SALARIO", "DE_1_A_2_SALARIOS", "DE_2_A_5_SALARIOS", "DE_5_A_10_SALARIOS", "ACIMA_10_SALARIOS", "NAO_INFORMADO"];
const maritalStatuses: MaritalStatus[] = ["SOLTEIRO", "CASADO", "DIVORCIADO", "VIUVO", "UNIAO_ESTAVEL", "NAO_INFORMADO"];
const neighborhoods = ["Centro", "Jardim Paulista", "Vila Mariana", "Copacabana", "Ipanema", "Savassi", "Asa Sul", "Barra", "Aldeota", "Batel"];
const tags = [
  "Líder Comunitário",
  "Jovem",
  "Idoso",
  "Empresário",
  "Professor",
  "Estudante",
  "Trabalhador Rural",
  "Comerciante",
  "Profissional da Saúde",
  "Servidor Público",
];

const zones = ["1", "2", "3", "4", "5", "10", "15", "20", "25", "30"];
const sections = ["1", "2", "3", "4", "5", "10", "15", "20", "25", "30", "35", "40"];

function generateEmail(name: string): string {
  const cleaned = name.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, ".");
  const domains = ["gmail.com", "hotmail.com", "yahoo.com.br", "outlook.com"];
  return `${cleaned}@${domains[Math.floor(Math.random() * domains.length)]}`;
}

function generatePhone(): string {
  const ddd = ["11", "21", "31", "61", "71", "85", "41", "81", "51", "92"];
  const prefix = Math.random() > 0.5 ? "9" : "8";
  const number = Math.floor(10000000 + Math.random() * 90000000);
  return `(${ddd[Math.floor(Math.random() * ddd.length)]}) ${prefix}${number.toString().substring(0, 4)}-${number.toString().substring(4)}`;
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
  return `${num.substring(0, 3)}.${num.substring(3, 6)}.${num.substring(6, 9)}-${num.substring(9, 11)}`;
}

function generateBirthDate(): string {
  const year = 1940 + Math.floor(Math.random() * 65); // Ages between 18 and 83
  const month = Math.floor(Math.random() * 12) + 1;
  const day = Math.floor(Math.random() * 28) + 1;
  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}

function generateZipCode(): string {
  const num = Math.floor(10000000 + Math.random() * 90000000).toString();
  return `${num.substring(0, 5)}-${num.substring(5, 8)}`;
}

function generateVoter(index: number): Voter {
  const name = getRandomItem(brazilianNames) + ` ${index}`;
  const location = getRandomItem(brazilianCities);
  const hasWhatsapp = Math.random() > 0.3; // 70% have WhatsApp
  const hasSupportLevel = Math.random() > 0.2; // 80% have support level
  const hasLocation = Math.random() > 0.4; // 60% have GPS coordinates
  const hasZoneSection = Math.random() > 0.3; // 70% have zone/section
  const hasSocialInfo = Math.random() > 0.5; // 50% have social info

  const createdDate = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000);

  return {
    id: `voter-${index + 1}`,
    // Basic Information
    name,
    motherName: getRandomItem(motherNames),
    cpf: generateCPF(),
    dateOfBirth: generateBirthDate(),
    gender: getRandomItem(genders),

    // Contact Information
    email: generateEmail(name),
    phone: generatePhone(),
    whatsapp: hasWhatsapp ? generatePhone() : undefined,

    // Address Information
    address: `Rua ${getRandomItem(brazilianNames).split(' ')[1]}`,
    addressNumber: Math.floor(Math.random() * 9999).toString(),
    addressComplement: Math.random() > 0.7 ? `Apto ${Math.floor(Math.random() * 200)}` : undefined,
    neighborhood: getRandomItem(neighborhoods),
    city: location.city,
    state: location.state,
    zipCode: generateZipCode(),
    latitude: hasLocation ? location.lat + (Math.random() - 0.5) * 0.1 : undefined,
    longitude: hasLocation ? location.lng + (Math.random() - 0.5) * 0.1 : undefined,

    // Electoral Information
    electoralTitle: hasZoneSection ? Math.floor(100000000000 + Math.random() * 900000000000).toString() : undefined,
    electoralZone: hasZoneSection ? getRandomItem(zones) : undefined,
    electoralSection: hasZoneSection ? getRandomItem(sections) : undefined,
    votingLocation: hasZoneSection ? `Escola Municipal ${getRandomItem(brazilianNames).split(' ')[1]}` : undefined,

    // Social Segmentation
    educationLevel: hasSocialInfo ? getRandomItem(educationLevels) : undefined,
    occupation: hasSocialInfo ? getRandomItem(["Professor", "Comerciante", "Servidor Público", "Empresário", "Autônomo"]) : undefined,
    incomeLevel: hasSocialInfo ? getRandomItem(incomeLevels) : undefined,
    maritalStatus: hasSocialInfo ? getRandomItem(maritalStatuses) : undefined,
    religion: hasSocialInfo ? getRandomItem(["Católica", "Evangélica", "Espírita", "Sem religião"]) : undefined,
    ethnicity: hasSocialInfo ? getRandomItem(["Branca", "Parda", "Preta", "Amarela", "Indígena"]) : undefined,
    familyMembers: hasSocialInfo ? Math.floor(Math.random() * 6) + 1 : undefined,

    // Social Media
    facebook: Math.random() > 0.6 ? `facebook.com/${name.toLowerCase().replace(/\s/g, '.')}` : undefined,
    instagram: Math.random() > 0.5 ? `@${name.toLowerCase().replace(/\s/g, '_')}` : undefined,
    twitter: Math.random() > 0.8 ? `@${name.toLowerCase().replace(/\s/g, '_')}` : undefined,

    // Contact Preferences
    hasWhatsapp,
    preferredContact: hasWhatsapp ? "WHATSAPP" : "TELEFONE",

    // Political Information
    supportLevel: hasSupportLevel ? getRandomItem(supportLevels) : undefined,
    politicalParty: Math.random() > 0.7 ? getRandomItem(["PT", "PSDB", "MDB", "PP", "PSD", "Sem partido"]) : undefined,
    votingHistory: Math.random() > 0.8 ? `Votou em eleições anteriores em ${location.city}` : undefined,
    tags: getRandomItems(tags, Math.floor(Math.random() * 3)),
    notes: Math.random() > 0.7 ? `Observações sobre ${name.split(' ')[0]}` : undefined,

    // Audit fields
    createdAt: createdDate.toISOString(),
    updatedAt: createdDate.toISOString(),
  };
}

// Generate 100 mock voters
export const voters: Voter[] = Array.from({ length: 100 }, (_, i) => generateVoter(i));

// Export for API client registration
export default voters;

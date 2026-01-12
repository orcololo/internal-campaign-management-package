import { NewVoter } from '../schemas/voter.schema';

/**
 * Seed data: 200 voters from Macapá-AP with real coordinates within the city
 * Coordinates range: Latitude: -0.0400 to 0.0600, Longitude: -51.1500 to -51.0000
 */

const macapaNeighborhoods = [
  { name: 'Centro', lat: 0.034, lng: -51.0665 },
  { name: 'Trem', lat: 0.045, lng: -51.055 },
  { name: 'Santa Rita', lat: 0.022, lng: -51.0815 },
  { name: 'Jesus de Nazaré', lat: 0.038, lng: -51.079 },
  { name: 'Buritizal', lat: 0.052, lng: -51.048 },
  { name: 'Jardim Felicidade', lat: -0.01, lng: -51.11 },
  { name: 'São Lázaro', lat: 0.015, lng: -51.095 },
  { name: 'Perpétuo Socorro', lat: 0.028, lng: -51.085 },
  { name: 'Congós', lat: 0.018, lng: -51.102 },
  { name: 'Laguinho', lat: 0.042, lng: -51.068 },
  { name: 'Beirol', lat: -0.005, lng: -51.09 },
  { name: 'Novo Horizonte', lat: -0.02, lng: -51.12 },
  { name: 'Infraero', lat: 0.05, lng: -51.035 },
  { name: 'Cidade Nova', lat: -0.015, lng: -51.105 },
  { name: 'Pacoval', lat: 0.018, lng: -51.075 },
];

const firstNames = [
  'João',
  'Maria',
  'José',
  'Ana',
  'Francisco',
  'Francisca',
  'Antônio',
  'Manoel',
  'Paulo',
  'Carlos',
  'Pedro',
  'Lucas',
  'Marcos',
  'Mateus',
  'André',
  'Felipe',
  'Rafael',
  'Gabriel',
  'Miguel',
  'Thiago',
  'Bruno',
  'Rodrigo',
  'Leonardo',
  'Diego',
  'Juliana',
  'Fernanda',
  'Camila',
  'Amanda',
  'Letícia',
  'Mariana',
  'Beatriz',
  'Larissa',
  'Patricia',
  'Sandra',
  'Claudia',
  'Vanessa',
  'Adriana',
  'Simone',
  'Cristina',
  'Aline',
  'Roberto',
  'Ricardo',
  'Fernando',
  'Alessandro',
  'Marcelo',
  'Anderson',
  'Luiz',
  'Daniel',
  'Sebastião',
  'Raimundo',
  'Benedito',
  'Geraldo',
  'Valdeci',
  'Jaime',
  'Ronaldo',
  'Wagner',
  'Rosa',
  'Lúcia',
  'Helena',
  'Irene',
  'Vera',
  'Célia',
  'Regina',
  'Rita',
];

const lastNames = [
  'Silva',
  'Santos',
  'Oliveira',
  'Souza',
  'Pereira',
  'Costa',
  'Rodrigues',
  'Almeida',
  'Nascimento',
  'Lima',
  'Araújo',
  'Fernandes',
  'Carvalho',
  'Gomes',
  'Martins',
  'Rocha',
  'Ribeiro',
  'Alves',
  'Monteiro',
  'Mendes',
  'Cardoso',
  'Reis',
  'Barbosa',
  'Pinto',
  'Ferreira',
  'Castro',
  'Moreira',
  'Cavalcanti',
  'Dias',
  'Freitas',
  'Correia',
  'Teixeira',
];

const occupations = [
  'Comerciante',
  'Professor(a)',
  'Servidor Público',
  'Autônomo',
  'Vendedor(a)',
  'Motorista',
  'Auxiliar Administrativo',
  'Pescador(a)',
  'Agricultor(a)',
  'Mecânico',
  'Enfermeiro(a)',
  'Técnico',
  'Cozinheiro(a)',
  'Segurança',
  'Pedreiro',
  'Eletricista',
  'Empresário(a)',
  'Contador(a)',
  'Advogado(a)',
  'Médico(a)',
  'Auxiliar de Serviços Gerais',
  'Recepcionista',
  'Cabeleireiro(a)',
  'Manicure',
  'Operador de Caixa',
];

const streets = [
  'Rua São José',
  'Av. FAB',
  'Rua Leopoldo Machado',
  'Av. Mendonça Júnior',
  'Rua Cândido Mendes',
  'Rua Hamilton Silva',
  'Av. Padre Júlio',
  'Rua Jovino Dinoá',
  'Rua General Rondon',
  'Av. Equatorial',
  'Rua Tiradentes',
  'Rua Adilson Mota',
  'Rua Hildemar Maia',
  'Av. Procópio Rola',
  'Rua Pedro Baião',
  'Rua Antônio Gonçalves',
  'Av. Coaracy Nunes',
  'Rua Ataíde Teive',
  'Rua Presidente Vargas',
  'Rua Cláudio Lúcio',
];

function generateCPF(): string {
  const randomDigits = () => Math.floor(Math.random() * 10);
  const cpf = Array.from({ length: 9 }, randomDigits);

  // Generate verification digits (simplified)
  const d1 = cpf.reduce((sum, d, i) => sum + d * (10 - i), 0) % 11;
  const d2 = [...cpf, d1 < 2 ? 0 : 11 - d1].reduce((sum, d, i) => sum + d * (11 - i), 0) % 11;

  cpf.push(d1 < 2 ? 0 : 11 - d1);
  cpf.push(d2 < 2 ? 0 : 11 - d2);

  return cpf.join('').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function generatePhone(hasWhatsapp: boolean = false): string {
  const ddd = '96'; // Macapá DDD
  const prefix = hasWhatsapp ? '9' : Math.random() > 0.5 ? '9' : '3';
  const number = Math.floor(Math.random() * 90000000) + 10000000;
  return `(${ddd}) ${prefix}${number.toString().substring(0, 4)}-${number.toString().substring(4)}`;
}

function generateBirthDate(ageMin: number = 18, ageMax: number = 80): Date {
  const currentYear = new Date().getFullYear();
  const birthYear = currentYear - Math.floor(Math.random() * (ageMax - ageMin + 1)) - ageMin;
  const month = Math.floor(Math.random() * 12);
  const day = Math.floor(Math.random() * 28) + 1;
  return new Date(birthYear, month, day);
}

function getAgeGroup(birthDate: Date): string {
  const age = new Date().getFullYear() - birthDate.getFullYear();
  if (age < 26) return '18-25';
  if (age < 36) return '26-35';
  if (age < 51) return '36-50';
  if (age < 66) return '51-65';
  return '65+';
}

function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateReferralCode(name: string): string {
  const nameParts = name.split(' ');
  const first = nameParts[0].toUpperCase();
  const last = nameParts[nameParts.length - 1].toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${first}-${last}-${random}`;
}

function generateCoordinatesNearby(
  baseLat: number,
  baseLng: number,
  radiusKm: number = 0.5,
): { lat: number; lng: number } {
  // 1 degree ≈ 111 km
  const latOffset = (Math.random() - 0.5) * (radiusKm / 111) * 2;
  const lngOffset = (Math.random() - 0.5) * (radiusKm / 111) * 2;

  return {
    lat: baseLat + latOffset,
    lng: baseLng + lngOffset,
  };
}

// Generate a creation date over the last 30 days
// More recent days should have more voters (realistic growth pattern)
function generateCreatedAt(index: number, total: number): Date {
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  // Use exponential distribution to favor recent dates
  // Earlier indices get older dates, later indices get newer dates
  const progress = index / total;
  const exponentialFactor = Math.pow(progress, 0.5); // Square root for gradual growth
  
  const timeRange = now.getTime() - thirtyDaysAgo.getTime();
  const offset = timeRange * exponentialFactor;
  
  return new Date(thirtyDaysAgo.getTime() + offset);
}

export const macapaVotersSeed: Partial<NewVoter>[] = Array.from({ length: 200 }, (_, index) => {
  const firstName = randomElement(firstNames);
  const lastName1 = randomElement(lastNames);
  const lastName2 = randomElement(lastNames);
  const fullName = `${firstName} ${lastName1} ${lastName2}`;

  const birthDate = generateBirthDate();
  const createdAt = generateCreatedAt(index, 200);
  const ageGroup = getAgeGroup(birthDate);

  const neighborhood = randomElement(macapaNeighborhoods);
  const coords = generateCoordinatesNearby(neighborhood.lat, neighborhood.lng);

  const hasWhatsapp = Math.random() > 0.3; // 70% have WhatsApp
  const phone = generatePhone(hasWhatsapp);
  const whatsapp = hasWhatsapp ? phone : null;

  const supportLevels: Array<
    | 'MUITO_FAVORAVEL'
    | 'FAVORAVEL'
    | 'NEUTRO'
    | 'DESFAVORAVEL'
    | 'MUITO_DESFAVORAVEL'
    | 'NAO_DEFINIDO'
  > = [
    'MUITO_FAVORAVEL',
    'FAVORAVEL',
    'NEUTRO',
    'DESFAVORAVEL',
    'MUITO_DESFAVORAVEL',
    'NAO_DEFINIDO',
  ];
  const supportLevel = randomElement(supportLevels);

  const genders: Array<'MASCULINO' | 'FEMININO' | 'OUTRO' | 'NAO_INFORMADO'> = [
    'MASCULINO',
    'FEMININO',
    'NAO_INFORMADO',
  ];
  const gender = randomElement(genders);

  const educationLevels: Array<
    | 'FUNDAMENTAL_INCOMPLETO'
    | 'FUNDAMENTAL_COMPLETO'
    | 'MEDIO_INCOMPLETO'
    | 'MEDIO_COMPLETO'
    | 'SUPERIOR_INCOMPLETO'
    | 'SUPERIOR_COMPLETO'
    | 'POS_GRADUACAO'
    | 'NAO_INFORMADO'
  > = [
    'FUNDAMENTAL_COMPLETO',
    'MEDIO_COMPLETO',
    'SUPERIOR_INCOMPLETO',
    'SUPERIOR_COMPLETO',
    'NAO_INFORMADO',
  ];
  const educationLevel = randomElement(educationLevels);

  const incomeLevels: Array<
    | 'ATE_1_SALARIO'
    | 'DE_1_A_2_SALARIOS'
    | 'DE_2_A_5_SALARIOS'
    | 'DE_5_A_10_SALARIOS'
    | 'ACIMA_10_SALARIOS'
    | 'NAO_INFORMADO'
  > = ['ATE_1_SALARIO', 'DE_1_A_2_SALARIOS', 'DE_2_A_5_SALARIOS', 'NAO_INFORMADO'];
  const incomeLevel = randomElement(incomeLevels);

  const maritalStatuses: Array<
    'SOLTEIRO' | 'CASADO' | 'DIVORCIADO' | 'VIUVO' | 'UNIAO_ESTAVEL' | 'NAO_INFORMADO'
  > = ['SOLTEIRO', 'CASADO', 'DIVORCIADO', 'UNIAO_ESTAVEL', 'NAO_INFORMADO'];
  const maritalStatus = randomElement(maritalStatuses);

  const employmentStatuses: Array<
    'EMPREGADO' | 'DESEMPREGADO' | 'APOSENTADO' | 'ESTUDANTE' | 'AUTONOMO' | 'NAO_INFORMADO'
  > = ['EMPREGADO', 'AUTONOMO', 'DESEMPREGADO', 'NAO_INFORMADO'];
  const employmentStatus = randomElement(employmentStatuses);

  const turnoutLikelihoods: Array<'ALTO' | 'MEDIO' | 'BAIXO' | 'NAO_DEFINIDO'> = [
    'ALTO',
    'MEDIO',
    'BAIXO',
    'NAO_DEFINIDO',
  ];
  const turnoutLikelihood = randomElement(turnoutLikelihoods);

  const engagementTrends: Array<'CRESCENTE' | 'ESTAVEL' | 'DECRESCENTE' | 'NAO_DEFINIDO'> = [
    'CRESCENTE',
    'ESTAVEL',
    'DECRESCENTE',
    'NAO_DEFINIDO',
  ];
  const engagementTrend = randomElement(engagementTrends);

  const communityRoles: Array<
    'LIDER' | 'MEMBRO_ATIVO' | 'ATIVISTA' | 'MEMBRO' | 'NAO_PARTICIPANTE' | 'NAO_DEFINIDO'
  > = ['MEMBRO', 'MEMBRO_ATIVO', 'NAO_PARTICIPANTE', 'NAO_DEFINIDO'];
  const communityRole = randomElement(communityRoles);

  const volunteerStatuses: Array<'ATIVO' | 'INATIVO' | 'INTERESSADO' | 'NAO_VOLUNTARIO'> = [
    'NAO_VOLUNTARIO',
    'INTERESSADO',
    'ATIVO',
  ];
  const volunteerStatus = randomElement(volunteerStatuses);

  const religions = ['Católica', 'Evangélica', 'Espírita', 'Umbanda', 'Sem religião', 'Outra'];
  const religion = Math.random() > 0.2 ? randomElement(religions) : null;

  const hasEmail = Math.random() > 0.5;
  const email = hasEmail
    ? `${firstName.toLowerCase()}.${lastName1.toLowerCase()}${index}@email.com`
    : null;

  const registrationDate = new Date(
    Date.now() - Math.floor(Math.random() * 365 * 2 * 24 * 60 * 60 * 1000), // Last 2 years
  );

  const lastEngagementDate =
    Math.random() > 0.3
      ? new Date(Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000)) // Last 90 days
      : null;

  const engagementScore = Math.floor(Math.random() * 100);
  const influencerScore = Math.floor(Math.random() * 100);

  const topIssues = JSON.stringify(
    randomElement([
      ['Saúde', 'Educação'],
      ['Segurança', 'Emprego'],
      ['Infraestrutura', 'Transporte'],
      ['Meio Ambiente', 'Saúde'],
      ['Educação', 'Cultura'],
    ]),
  );

  const tags = JSON.stringify(
    randomElement([
      ['eleitor-base'],
      ['eleitor-base', 'ativo'],
      ['potencial'],
      ['voluntario'],
      ['lideranca-comunitaria'],
      ['influenciador'],
    ]),
  );

  return {
    name: fullName,
    cpf: generateCPF(),
    dateOfBirth: birthDate.toISOString().split('T')[0],
    gender,
    phone,
    whatsapp,
    email,
    address: `${randomElement(streets)}, ${Math.floor(Math.random() * 999) + 1}`,
    addressNumber: String(Math.floor(Math.random() * 999) + 1),
    addressComplement:
      Math.random() > 0.7 ? randomElement(['Apt 101', 'Casa 2', 'Fundos', 'Bloco A']) : null,
    neighborhood: neighborhood.name,
    city: 'Macapá',
    state: 'AP',
    zipCode: `68900-${Math.floor(Math.random() * 900) + 100}`,
    latitude: coords.lat.toFixed(7),
    longitude: coords.lng.toFixed(7),
    electoralZone: String(Math.floor(Math.random() * 50) + 1).padStart(4, '0'),
    electoralSection: String(Math.floor(Math.random() * 300) + 1).padStart(4, '0'),
    votingLocation: randomElement([
      'Escola Estadual Colégio Amapaense',
      'Escola Estadual Tiradentes',
      'Escola Municipal Gabriel Almeida',
      'Colégio Aquarela',
      'Instituto de Ensino Superior do Amapá',
    ]),
    educationLevel,
    occupation: randomElement(occupations),
    incomeLevel,
    maritalStatus,
    religion,
    ethnicity: Math.random() > 0.5 ? randomElement(['Parda', 'Branca', 'Negra', 'Indígena']) : null,
    facebook:
      Math.random() > 0.6
        ? `facebook.com/${firstName.toLowerCase()}.${lastName1.toLowerCase()}`
        : null,
    instagram:
      Math.random() > 0.5 ? `@${firstName.toLowerCase()}_${lastName1.toLowerCase()}` : null,
    supportLevel,
    topIssues,
    influencerScore,
    persuadability: randomElement(['ALTO', 'MEDIO', 'BAIXO']),
    turnoutLikelihood,
    registrationDate,
    lastEngagementDate,
    engagementTrend,
    lastContactDate: lastEngagementDate,
    contactFrequency: Math.floor(Math.random() * 10),
    responseRate: Math.floor(Math.random() * 100),
    eventAttendance: JSON.stringify([]),
    volunteerStatus,
    engagementScore,
    ageGroup,
    householdType: randomElement([
      'FAMILIA_COM_FILHOS',
      'FAMILIA_SEM_FILHOS',
      'SOLTEIRO',
      'NAO_INFORMADO',
    ]),
    employmentStatus,
    vehicleOwnership: Math.random() > 0.6 ? 'SIM' : 'NAO',
    internetAccess: randomElement(['Fibra', '4G', '3G', 'Limitado']),
    communicationStyle: randomElement(['FORMAL', 'INFORMAL', 'NAO_DEFINIDO']),
    contentPreference: JSON.stringify(
      randomElement([['video', 'imagens'], ['texto', 'video'], ['imagens'], ['video']]),
    ),
    bestContactTime: randomElement(['Manhã', 'Tarde', 'Noite']),
    bestContactDay: JSON.stringify(
      randomElement([
        ['Segunda', 'Terça', 'Quarta'],
        ['Quinta', 'Sexta'],
        ['Sábado', 'Domingo'],
      ]),
    ),
    socialMediaFollowers: Math.floor(Math.random() * 5000),
    communityRole,
    referredVoters: Math.floor(Math.random() * 10),
    networkSize: Math.floor(Math.random() * 200) + 50,
    influenceRadius: Number((Math.random() * 5 + 0.5).toFixed(2)),
    familyMembers: Math.floor(Math.random() * 6) + 1,
    hasWhatsapp: hasWhatsapp ? 'SIM' : 'NAO',
    preferredContact: hasWhatsapp ? 'WHATSAPP' : 'TELEFONE',
    notes: Math.random() > 0.8 ? 'Cadastrado durante campanha porta a porta' : null,
    tags,
    referralCode: generateReferralCode(fullName),
    referredBy: null, // Will be set in seeder for some voters
    referralDate: null,
    createdAt, // Historical creation date over last 30 days
  };
});

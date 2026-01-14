"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.macapaVotersSeed = void 0;
/**
 * Seed data: 200 voters from Macapá-AP with real coordinates within the city
 * Coordinates range: Latitude: -0.0400 to 0.0600, Longitude: -51.1500 to -51.0000
 */
var macapaNeighborhoods = [
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
var firstNames = [
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
var lastNames = [
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
var occupations = [
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
var streets = [
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
function generateCPF() {
    var randomDigits = function () { return Math.floor(Math.random() * 10); };
    var cpf = Array.from({ length: 9 }, randomDigits);
    // Generate verification digits (simplified)
    var d1 = cpf.reduce(function (sum, d, i) { return sum + d * (10 - i); }, 0) % 11;
    var d2 = __spreadArray(__spreadArray([], cpf, true), [d1 < 2 ? 0 : 11 - d1], false).reduce(function (sum, d, i) { return sum + d * (11 - i); }, 0) % 11;
    cpf.push(d1 < 2 ? 0 : 11 - d1);
    cpf.push(d2 < 2 ? 0 : 11 - d2);
    return cpf.join('').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}
function generatePhone(hasWhatsapp) {
    if (hasWhatsapp === void 0) { hasWhatsapp = false; }
    var ddd = '96'; // Macapá DDD
    var prefix = hasWhatsapp ? '9' : Math.random() > 0.5 ? '9' : '3';
    var number = Math.floor(Math.random() * 90000000) + 10000000;
    return "(".concat(ddd, ") ").concat(prefix).concat(number.toString().substring(0, 4), "-").concat(number.toString().substring(4));
}
function generateBirthDate(ageMin, ageMax) {
    if (ageMin === void 0) { ageMin = 18; }
    if (ageMax === void 0) { ageMax = 80; }
    var currentYear = new Date().getFullYear();
    var birthYear = currentYear - Math.floor(Math.random() * (ageMax - ageMin + 1)) - ageMin;
    var month = Math.floor(Math.random() * 12);
    var day = Math.floor(Math.random() * 28) + 1;
    return new Date(birthYear, month, day);
}
function getAgeGroup(birthDate) {
    var age = new Date().getFullYear() - birthDate.getFullYear();
    if (age < 26)
        return '18-25';
    if (age < 36)
        return '26-35';
    if (age < 51)
        return '36-50';
    if (age < 66)
        return '51-65';
    return '65+';
}
function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}
function generateReferralCode(name) {
    var nameParts = name.split(' ');
    var first = nameParts[0].toUpperCase();
    var last = nameParts[nameParts.length - 1].toUpperCase();
    var random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return "".concat(first, "-").concat(last, "-").concat(random);
}
function generateCoordinatesNearby(baseLat, baseLng, radiusKm) {
    if (radiusKm === void 0) { radiusKm = 0.5; }
    // 1 degree ≈ 111 km
    var latOffset = (Math.random() - 0.5) * (radiusKm / 111) * 2;
    var lngOffset = (Math.random() - 0.5) * (radiusKm / 111) * 2;
    return {
        lat: baseLat + latOffset,
        lng: baseLng + lngOffset,
    };
}
// Generate a creation date over the last 30 days
// More recent days should have more voters (realistic growth pattern)
function generateCreatedAt(index, total) {
    var now = new Date();
    var thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    // Use exponential distribution to favor recent dates
    // Earlier indices get older dates, later indices get newer dates
    var progress = index / total;
    var exponentialFactor = Math.pow(progress, 0.5); // Square root for gradual growth
    var timeRange = now.getTime() - thirtyDaysAgo.getTime();
    var offset = timeRange * exponentialFactor;
    return new Date(thirtyDaysAgo.getTime() + offset);
}
exports.macapaVotersSeed = Array.from({ length: 200 }, function (_, index) {
    var firstName = randomElement(firstNames);
    var lastName1 = randomElement(lastNames);
    var lastName2 = randomElement(lastNames);
    var fullName = "".concat(firstName, " ").concat(lastName1, " ").concat(lastName2);
    var birthDate = generateBirthDate();
    var createdAt = generateCreatedAt(index, 200);
    var ageGroup = getAgeGroup(birthDate);
    var neighborhood = randomElement(macapaNeighborhoods);
    var coords = generateCoordinatesNearby(neighborhood.lat, neighborhood.lng);
    var hasWhatsapp = Math.random() > 0.3; // 70% have WhatsApp
    var phone = generatePhone(hasWhatsapp);
    var whatsapp = hasWhatsapp ? phone : null;
    var supportLevels = [
        'MUITO_FAVORAVEL',
        'FAVORAVEL',
        'NEUTRO',
        'DESFAVORAVEL',
        'MUITO_DESFAVORAVEL',
        'NAO_DEFINIDO',
    ];
    var supportLevel = randomElement(supportLevels);
    var genders = [
        'MASCULINO',
        'FEMININO',
        'NAO_INFORMADO',
    ];
    var gender = randomElement(genders);
    var educationLevels = [
        'FUNDAMENTAL_COMPLETO',
        'MEDIO_COMPLETO',
        'SUPERIOR_INCOMPLETO',
        'SUPERIOR_COMPLETO',
        'NAO_INFORMADO',
    ];
    var educationLevel = randomElement(educationLevels);
    var incomeLevels = ['ATE_1_SALARIO', 'DE_1_A_2_SALARIOS', 'DE_2_A_5_SALARIOS', 'NAO_INFORMADO'];
    var incomeLevel = randomElement(incomeLevels);
    var maritalStatuses = ['SOLTEIRO', 'CASADO', 'DIVORCIADO', 'UNIAO_ESTAVEL', 'NAO_INFORMADO'];
    var maritalStatus = randomElement(maritalStatuses);
    var employmentStatuses = ['EMPREGADO', 'AUTONOMO', 'DESEMPREGADO', 'NAO_INFORMADO'];
    var employmentStatus = randomElement(employmentStatuses);
    var turnoutLikelihoods = [
        'ALTO',
        'MEDIO',
        'BAIXO',
        'NAO_DEFINIDO',
    ];
    var turnoutLikelihood = randomElement(turnoutLikelihoods);
    var engagementTrends = [
        'CRESCENTE',
        'ESTAVEL',
        'DECRESCENTE',
        'NAO_DEFINIDO',
    ];
    var engagementTrend = randomElement(engagementTrends);
    var communityRoles = ['MEMBRO', 'MEMBRO_ATIVO', 'NAO_PARTICIPANTE', 'NAO_DEFINIDO'];
    var communityRole = randomElement(communityRoles);
    var volunteerStatuses = [
        'NAO_VOLUNTARIO',
        'INTERESSADO',
        'ATIVO',
    ];
    var volunteerStatus = randomElement(volunteerStatuses);
    var religions = ['Católica', 'Evangélica', 'Espírita', 'Umbanda', 'Sem religião', 'Outra'];
    var religion = Math.random() > 0.2 ? randomElement(religions) : null;
    var hasEmail = Math.random() > 0.5;
    var email = hasEmail
        ? "".concat(firstName.toLowerCase(), ".").concat(lastName1.toLowerCase()).concat(index, "@email.com")
        : null;
    var registrationDate = new Date(Date.now() - Math.floor(Math.random() * 365 * 2 * 24 * 60 * 60 * 1000));
    var lastEngagementDate = Math.random() > 0.3
        ? new Date(Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000)) // Last 90 days
        : null;
    var engagementScore = Math.floor(Math.random() * 100);
    var influencerScore = Math.floor(Math.random() * 100);
    var topIssues = JSON.stringify(randomElement([
        ['Saúde', 'Educação'],
        ['Segurança', 'Emprego'],
        ['Infraestrutura', 'Transporte'],
        ['Meio Ambiente', 'Saúde'],
        ['Educação', 'Cultura'],
    ]));
    var tags = JSON.stringify(randomElement([
        ['eleitor-base'],
        ['eleitor-base', 'ativo'],
        ['potencial'],
        ['voluntario'],
        ['lideranca-comunitaria'],
        ['influenciador'],
    ]));
    return {
        name: fullName,
        cpf: generateCPF(),
        dateOfBirth: birthDate.toISOString().split('T')[0],
        gender: gender,
        phone: phone,
        whatsapp: whatsapp,
        email: email,
        address: "".concat(randomElement(streets), ", ").concat(Math.floor(Math.random() * 999) + 1),
        addressNumber: String(Math.floor(Math.random() * 999) + 1),
        addressComplement: Math.random() > 0.7 ? randomElement(['Apt 101', 'Casa 2', 'Fundos', 'Bloco A']) : null,
        neighborhood: neighborhood.name,
        city: 'Macapá',
        state: 'AP',
        zipCode: "68900-".concat(Math.floor(Math.random() * 900) + 100),
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
        educationLevel: educationLevel,
        occupation: randomElement(occupations),
        incomeLevel: incomeLevel,
        maritalStatus: maritalStatus,
        religion: religion,
        ethnicity: Math.random() > 0.5 ? randomElement(['Parda', 'Branca', 'Negra', 'Indígena']) : null,
        facebook: Math.random() > 0.6
            ? "facebook.com/".concat(firstName.toLowerCase(), ".").concat(lastName1.toLowerCase())
            : null,
        instagram: Math.random() > 0.5 ? "@".concat(firstName.toLowerCase(), "_").concat(lastName1.toLowerCase()) : null,
        supportLevel: supportLevel,
        topIssues: topIssues,
        influencerScore: influencerScore,
        persuadability: randomElement(['ALTO', 'MEDIO', 'BAIXO']),
        turnoutLikelihood: turnoutLikelihood,
        registrationDate: registrationDate,
        lastEngagementDate: lastEngagementDate,
        engagementTrend: engagementTrend,
        lastContactDate: lastEngagementDate,
        contactFrequency: Math.floor(Math.random() * 10),
        responseRate: Math.floor(Math.random() * 100),
        eventAttendance: JSON.stringify([]),
        volunteerStatus: volunteerStatus,
        engagementScore: engagementScore,
        ageGroup: ageGroup,
        householdType: randomElement([
            'FAMILIA_COM_FILHOS',
            'FAMILIA_SEM_FILHOS',
            'SOLTEIRO',
            'NAO_INFORMADO',
        ]),
        employmentStatus: employmentStatus,
        vehicleOwnership: Math.random() > 0.6 ? 'SIM' : 'NAO',
        internetAccess: randomElement(['Fibra', '4G', '3G', 'Limitado']),
        communicationStyle: randomElement(['FORMAL', 'INFORMAL', 'NAO_DEFINIDO']),
        contentPreference: JSON.stringify(randomElement([['video', 'imagens'], ['texto', 'video'], ['imagens'], ['video']])),
        bestContactTime: randomElement(['Manhã', 'Tarde', 'Noite']),
        bestContactDay: JSON.stringify(randomElement([
            ['Segunda', 'Terça', 'Quarta'],
            ['Quinta', 'Sexta'],
            ['Sábado', 'Domingo'],
        ])),
        socialMediaFollowers: Math.floor(Math.random() * 5000),
        communityRole: communityRole,
        referredVoters: Math.floor(Math.random() * 10),
        networkSize: Math.floor(Math.random() * 200) + 50,
        influenceRadius: Number((Math.random() * 5 + 0.5).toFixed(2)),
        familyMembers: Math.floor(Math.random() * 6) + 1,
        hasWhatsapp: hasWhatsapp ? 'SIM' : 'NAO',
        preferredContact: hasWhatsapp ? 'WHATSAPP' : 'TELEFONE',
        notes: Math.random() > 0.8 ? 'Cadastrado durante campanha porta a porta' : null,
        tags: tags,
        referralCode: generateReferralCode(fullName),
        referredBy: null, // Will be set in seeder for some voters
        referralDate: null,
        createdAt: createdAt,
    };
});

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
exports.macapaEventsSeed = void 0;
/**
 * Seed data: 50 campaign events in Macapá-AP
 * - 20 events from last 60 days (historical)
 * - 30 events for January 2026 (current month + future)
 * Mix of different types and statuses to show activity trends
 */
var eventTypes = [
    'COMICIO',
    'REUNIAO',
    'VISITA',
    'ENTREVISTA',
    'DEBATE',
    'CAMINHADA',
    'CORPO_A_CORPO',
    'EVENTO_PRIVADO',
    'OUTRO',
];
var eventStatuses = ['AGENDADO', 'EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO', 'ADIADO'];
var macapaLocations = [
    { name: 'Praça Veiga Cabral', neighborhood: 'Centro', lat: '0.034', lng: '-51.0665' },
    { name: 'Praça Floriano Peixoto', neighborhood: 'Santa Rita', lat: '0.022', lng: '-51.0815' },
    { name: 'Parque do Forte', neighborhood: 'Centro', lat: '0.038', lng: '-51.066' },
    { name: 'Anfiteatro da Fortaleza', neighborhood: 'Centro', lat: '0.039', lng: '-51.065' },
    {
        name: 'Complexo Beira-Rio',
        neighborhood: 'Jesus de Nazaré',
        lat: '0.038',
        lng: '-51.079',
    },
    { name: 'Mercado Central', neighborhood: 'Centro', lat: '0.035', lng: '-51.067' },
    { name: 'Terminal Rodoviário', neighborhood: 'Buritizal', lat: '0.052', lng: '-51.048' },
    {
        name: 'Associação de Moradores',
        neighborhood: 'Jardim Felicidade',
        lat: '-0.01',
        lng: '-51.11',
    },
    { name: 'Centro Comunitário', neighborhood: 'São Lázaro', lat: '0.015', lng: '-51.095' },
    {
        name: 'Igreja Nossa Senhora da Conceição',
        neighborhood: 'Trem',
        lat: '0.045',
        lng: '-51.055',
    },
];
function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}
// Generate event dates: mix of historical (last 60 days) and current month (January 2026)
function generateEventDate(index, total) {
    var now = new Date('2026-01-12'); // Current date (January 12, 2026)
    // First 20 events are historical (last 60 days)
    if (index < 20) {
        var sixtyDaysAgo = new Date(now);
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
        var progress_1 = index / 20;
        var timeRange_1 = now.getTime() - sixtyDaysAgo.getTime();
        var offset_1 = timeRange_1 * progress_1;
        return new Date(sixtyDaysAgo.getTime() + offset_1);
    }
    // Remaining events are for January 2026 (from Jan 1 to Jan 31)
    var jan1 = new Date('2026-01-01');
    var jan31 = new Date('2026-01-31');
    var adjustedIndex = index - 20;
    var remainingTotal = total - 20;
    var progress = adjustedIndex / remainingTotal;
    var timeRange = jan31.getTime() - jan1.getTime();
    var offset = timeRange * progress;
    return new Date(jan1.getTime() + offset);
}
function formatDate(date) {
    return date.toISOString().split('T')[0];
}
function formatTime(hours, minutes) {
    if (minutes === void 0) { minutes = 0; }
    return "".concat(hours.toString().padStart(2, '0'), ":").concat(minutes.toString().padStart(2, '0'), ":00");
}
exports.macapaEventsSeed = Array.from({ length: 50 }, function (_, index) {
    var eventDate = generateEventDate(index, 50);
    var location = randomElement(macapaLocations);
    var type = randomElement(__spreadArray([], eventTypes, true));
    // Events in the past are more likely to be completed
    var now = new Date('2026-01-12'); // Current date
    var isPast = eventDate < now;
    var status;
    if (isPast) {
        var rand = Math.random();
        if (rand < 0.75)
            status = 'CONCLUIDO';
        else if (rand < 0.9)
            status = 'CANCELADO';
        else
            status = 'ADIADO';
    }
    else {
        status = 'AGENDADO';
    }
    // Event titles based on type
    var titles = {
        COMICIO: ['Grande Comício Popular', 'Comício da Mudança', 'Encontro com o Povo'],
        REUNIAO: [
            'Reunião com Lideranças',
            'Encontro com Empresários',
            'Reunião de Coordenação',
            'Reunião Estratégica',
        ],
        VISITA: [
            'Visita ao Comércio Local',
            'Visita às Famílias',
            'Visita Institucional',
            'Visita aos Moradores',
        ],
        ENTREVISTA: [
            'Entrevista Rádio Local',
            'Entrevista TV',
            'Conversa com Imprensa',
            'Coletiva de Imprensa',
        ],
        DEBATE: ['Debate Político', 'Debate sobre Propostas', 'Debate Comunitário'],
        CAMINHADA: [
            'Caminhada da Vitória',
            'Caminhada pelo Bairro',
            'Caminhada Popular',
            'Passeata Cívica',
        ],
        CORPO_A_CORPO: [
            'Corpo a Corpo no Mercado',
            'Corpo a Corpo na Feira',
            'Conversa com Eleitores',
            'Contato Direto com Povo',
        ],
        EVENTO_PRIVADO: [
            'Jantar com Apoiadores',
            'Café da Manhã Privado',
            'Encontro Fechado',
            'Reunião Reservada',
        ],
        OUTRO: ['Evento Especial', 'Atividade de Campanha', 'Ação Social', 'Evento Comunitário'],
    };
    var title = randomElement(titles[type] || titles.OUTRO);
    // Random start times (mostly during business hours and evenings)
    var startHour = Math.random() < 0.7 ? Math.floor(Math.random() * 4) + 18 : Math.floor(Math.random() * 6) + 9; // 70% evening, 30% daytime
    var startMinutes = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
    var durationHours = type === 'COMICIO' || type === 'DEBATE' ? 3 : Math.floor(Math.random() * 2) + 1;
    // Calculate end time, handling day rollover
    var endDate = new Date(eventDate);
    var endHour = startHour + durationHours;
    var endMinutes = startMinutes;
    // If time goes past midnight, move to next day
    if (endHour >= 24) {
        endDate.setDate(endDate.getDate() + 1);
        endHour = endHour - 24;
    }
    // Cap at 23:59 to be safe
    if (endHour > 23) {
        endHour = 23;
        endMinutes = 59;
    }
    // Expected attendees based on event type
    var attendeeRanges = {
        COMICIO: randomElement(['500+', '1000+', '200-500']),
        REUNIAO: randomElement(['10-20', '20-50', '5-10']),
        VISITA: randomElement(['N/A', '5-10']),
        ENTREVISTA: randomElement(['N/A', '2-5']),
        DEBATE: randomElement(['100-200', '50-100']),
        CAMINHADA: randomElement(['200-500', '100-200', '500+']),
        CORPO_A_CORPO: randomElement(['50-100', '100-200']),
        EVENTO_PRIVADO: randomElement(['20-50', '10-20']),
        OUTRO: randomElement(['20-50', '50-100']),
    };
    var descriptions = {
        COMICIO: "Grande evento de mobiliza\u00E7\u00E3o popular no ".concat(location.neighborhood, ". Participa\u00E7\u00E3o de lideran\u00E7as locais e apresenta\u00E7\u00E3o de propostas para a comunidade."),
        REUNIAO: "Reuni\u00E3o com lideran\u00E7as comunit\u00E1rias e empres\u00E1rios do ".concat(location.neighborhood, " para discutir demandas locais e propostas de governo."),
        VISITA: "Visita aos moradores e comerciantes do ".concat(location.neighborhood, " para ouvir demandas e apresentar propostas para o bairro."),
        ENTREVISTA: "Entrevista com imprensa local para divulgar propostas e discutir principais temas da campanha.",
        DEBATE: "Debate pol\u00EDtico com participa\u00E7\u00E3o da comunidade para discutir propostas e responder perguntas dos eleitores.",
        CAMINHADA: "Caminhada pelas ruas do ".concat(location.neighborhood, " com intera\u00E7\u00E3o direta com moradores e comerciantes."),
        CORPO_A_CORPO: "Atividade de corpo a corpo com eleitores no ".concat(location.name, ", conversando e ouvindo demandas da popula\u00E7\u00E3o."),
        EVENTO_PRIVADO: "Evento privado com apoiadores e lideran\u00E7as para alinhar estrat\u00E9gias e fortalecer a campanha.",
        OUTRO: "Atividade de campanha no ".concat(location.neighborhood, " com foco em mobiliza\u00E7\u00E3o e engajamento da comunidade."),
    };
    return {
        title: title,
        description: descriptions[type] || descriptions.OUTRO,
        type: type,
        status: status,
        visibility: type === 'EVENTO_PRIVADO' || type === 'REUNIAO' ? 'PRIVADO' : 'PUBLICO',
        startDate: formatDate(eventDate),
        startTime: formatTime(startHour, startMinutes),
        endDate: formatDate(endDate),
        endTime: formatTime(endHour, endMinutes),
        allDay: false,
        location: location.name,
        address: "".concat(location.name, ", ").concat(location.neighborhood),
        city: 'Macapá',
        state: 'AP',
        zipCode: "68900-".concat(Math.floor(Math.random() * 900) + 100),
        latitude: location.lat,
        longitude: location.lng,
        expectedAttendees: attendeeRanges[type],
        confirmedAttendees: status === 'CONCLUIDO' ? String(Math.floor(Math.random() * 200) + 50) : null,
        organizer: 'Coordenação de Campanha',
        contactPerson: randomElement([
            'João Silva',
            'Maria Santos',
            'Carlos Oliveira',
            'Ana Costa',
            'Pedro Souza',
        ]),
        contactPhone: '(96) 99999-8888',
        contactEmail: 'contato@campanha.com',
        notes: status === 'CONCLUIDO' ? 'Evento realizado com sucesso. Ótima participação popular.' : null,
        tags: JSON.stringify(randomElement([
            ['mobilizacao'],
            ['lideranca', 'comunitario'],
            ['imprensa', 'midia'],
            ['bairro', location.neighborhood.toLowerCase()],
        ])),
        createdAt: eventDate,
        updatedAt: eventDate,
        deletedAt: null,
    };
});

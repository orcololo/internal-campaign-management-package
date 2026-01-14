"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.macapaCanvassingSessionsSeed = void 0;
exports.generateDoorKnocksForSession = generateDoorKnocksForSession;
/**
 * Seed data: 15 canvassing sessions in Macapá-AP over the last 45 days
 * Each session has multiple door knocks with realistic results
 */
var sessionStatuses = ['PLANEJADA', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA'];
var doorKnockResults = [
    'APOIADOR',
    'INDECISO',
    'OPOSITOR',
    'NAO_ATENDEU',
    'RECUSOU_CONTATO',
    'MUDOU',
];
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
];
var volunteers = [
    'João Silva',
    'Maria Santos',
    'Carlos Oliveira',
    'Ana Costa',
    'Pedro Souza',
    'Francisca Lima',
    'José Ferreira',
    'Antônia Rocha',
    'Paulo Alves',
    'Luiza Cardoso',
];
function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}
// Generate date over the last 45 days, more recent = more activity
function generateSessionDate(index, total) {
    var now = new Date();
    var fortyFiveDaysAgo = new Date(now);
    fortyFiveDaysAgo.setDate(fortyFiveDaysAgo.getDate() - 45);
    var progress = index / total;
    var timeRange = now.getTime() - fortyFiveDaysAgo.getTime();
    var offset = timeRange * Math.pow(progress, 0.7); // More recent activity
    return new Date(fortyFiveDaysAgo.getTime() + offset);
}
function formatDate(date) {
    return date.toISOString().split('T')[0];
}
function generateCoordinatesNearby(baseLat, baseLng, radiusKm) {
    if (radiusKm === void 0) { radiusKm = 0.5; }
    var latOffset = (Math.random() - 0.5) * (radiusKm / 111) * 2;
    var lngOffset = (Math.random() - 0.5) * (radiusKm / 111) * 2;
    return {
        lat: (baseLat + latOffset).toFixed(7),
        lng: (baseLng + lngOffset).toFixed(7),
    };
}
// Export sessions that will be created (to get their IDs later)
exports.macapaCanvassingSessionsSeed = Array.from({ length: 15 }, function (_, index) {
    var sessionDate = generateSessionDate(index, 15);
    var neighborhood = randomElement(macapaNeighborhoods);
    var isPast = sessionDate < new Date();
    var status;
    if (isPast) {
        var rand = Math.random();
        if (rand < 0.8)
            status = 'CONCLUIDA';
        else
            status = 'CANCELADA';
    }
    else {
        status = Math.random() > 0.7 ? 'PLANEJADA' : 'EM_ANDAMENTO';
    }
    var targetVoters = Math.floor(Math.random() * 30) + 20; // 20-50 targets
    var actualVoters = status === 'CONCLUIDA' ? Math.floor(targetVoters * 0.8) : 0;
    // Generate result counts if completed
    var supporters = 0;
    var undecided = 0;
    var opponents = 0;
    var notHome = 0;
    var totalKnocks = 0;
    if (status === 'CONCLUIDA') {
        totalKnocks = actualVoters + Math.floor(Math.random() * 10);
        supporters = Math.floor(totalKnocks * 0.35); // 35% supporters
        undecided = Math.floor(totalKnocks * 0.3); // 30% undecided
        opponents = Math.floor(totalKnocks * 0.15); // 15% opponents
        notHome = totalKnocks - supporters - undecided - opponents; // Rest not home
    }
    var assignedVolunteer = randomElement(volunteers);
    var teamSize = Math.floor(Math.random() * 3) + 1; // 1-3 team members
    var teamMembers = teamSize > 1 ? volunteers.filter(function (v) { return v !== assignedVolunteer; }).slice(0, teamSize - 1) : [];
    var startCoords = generateCoordinatesNearby(neighborhood.lat, neighborhood.lng, 0.3);
    var endCoords = generateCoordinatesNearby(neighborhood.lat, neighborhood.lng, 0.3);
    // Generate route coordinates (5-10 points along the route)
    var routePoints = Array.from({ length: Math.floor(Math.random() * 6) + 5 }, function (_, i) {
        var progress = i / 10;
        var lat = parseFloat(startCoords.lat) +
            (parseFloat(endCoords.lat) - parseFloat(startCoords.lat)) * progress;
        var lng = parseFloat(startCoords.lng) +
            (parseFloat(endCoords.lng) - parseFloat(startCoords.lng)) * progress;
        return { lat: lat.toFixed(7), lng: lng.toFixed(7) };
    });
    return {
        name: "Porta a Porta ".concat(neighborhood.name, " ").concat(index + 1),
        description: "Canvassing no bairro ".concat(neighborhood.name, " - visita porta a porta aos moradores da regi\u00E3o para apresentar propostas e ouvir demandas."),
        status: status,
        scheduledDate: formatDate(sessionDate),
        completedDate: status === 'CONCLUIDA' ? sessionDate : null,
        assignedTo: assignedVolunteer,
        teamMembers: teamMembers.length > 0 ? JSON.stringify(teamMembers) : null,
        region: 'Macapá Centro',
        neighborhood: neighborhood.name,
        city: 'Macapá',
        startLocation: "".concat(randomElement(streets), ", ").concat(neighborhood.name),
        endLocation: "".concat(randomElement(streets), ", ").concat(neighborhood.name),
        routeCoordinates: JSON.stringify(routePoints),
        targetVoters: targetVoters,
        actualVoters: actualVoters,
        totalDoorKnocks: totalKnocks,
        supporters: supporters,
        undecided: undecided,
        opponents: opponents,
        notHome: notHome,
        notes: status === 'CONCLUIDA'
            ? 'Sessão concluída com sucesso. Boa receptividade dos moradores.'
            : status === 'CANCELADA'
                ? 'Sessão cancelada devido às condições climáticas.'
                : null,
        tags: JSON.stringify(['porta-a-porta', neighborhood.name.toLowerCase(), 'canvassing']),
        createdAt: sessionDate,
        updatedAt: sessionDate,
        deletedAt: null,
    };
});
/**
 * Generate door knocks for completed sessions
 * We'll need to get session IDs after inserting sessions
 */
function generateDoorKnocksForSession(sessionId, sessionData, neighborhood) {
    var _a;
    if (sessionData.status !== 'CONCLUIDA')
        return [];
    var totalKnocks = sessionData.totalDoorKnocks || 0;
    var doorKnocks = [];
    // Result distribution based on session summary
    var resultDistribution = [];
    var supporters = sessionData.supporters || 0;
    var undecided = sessionData.undecided || 0;
    var opponents = sessionData.opponents || 0;
    var notHome = sessionData.notHome || 0;
    for (var i = 0; i < supporters; i++)
        resultDistribution.push('APOIADOR');
    for (var i = 0; i < undecided; i++)
        resultDistribution.push('INDECISO');
    for (var i = 0; i < opponents; i++)
        resultDistribution.push('OPOSITOR');
    for (var i = 0; i < notHome; i++)
        resultDistribution.push('NAO_ATENDEU');
    // Add some refused contacts
    var refused = Math.floor(totalKnocks * 0.05); // 5% refused
    for (var i = 0; i < refused; i++)
        resultDistribution.push('RECUSOU_CONTATO');
    // Shuffle results
    for (var i = resultDistribution.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        _a = [resultDistribution[j], resultDistribution[i]], resultDistribution[i] = _a[0], resultDistribution[j] = _a[1];
    }
    for (var i = 0; i < totalKnocks; i++) {
        var coords = generateCoordinatesNearby(neighborhood.lat, neighborhood.lng, 0.5);
        var street = randomElement(streets);
        var number = Math.floor(Math.random() * 999) + 1;
        var result = resultDistribution[i] || 'NAO_ATENDEU';
        var notes = {
            APOIADOR: 'Morador demonstrou apoio. Pediu material de campanha.',
            INDECISO: 'Morador indeciso. Ouviu propostas com atenção.',
            OPOSITOR: 'Morador declarou apoio a outro candidato.',
            NAO_ATENDEU: 'Ninguém atendeu. Deixado material na porta.',
            RECUSOU_CONTATO: 'Morador recusou conversa.',
            MUDOU: 'Família não mora mais no endereço.',
        };
        var contactedAt = new Date(sessionData.createdAt || new Date());
        contactedAt.setHours(Math.floor(Math.random() * 4) + 14); // Between 14:00 and 18:00
        doorKnocks.push({
            sessionId: sessionId,
            voterId: null, // Would link to voters if we had the IDs
            address: "".concat(street, ", ").concat(number),
            addressNumber: String(number),
            neighborhood: neighborhood.name,
            latitude: coords.lat,
            longitude: coords.lng,
            result: result,
            contactedAt: contactedAt,
            contactedBy: sessionData.assignedTo || 'Voluntário',
            contactName: result !== 'NAO_ATENDEU' && result !== 'MUDOU' ? "Morador(a) ".concat(i + 1) : null,
            contactPhone: result === 'APOIADOR' || result === 'INDECISO'
                ? "(96) 99".concat(Math.floor(Math.random() * 900) + 100, "-").concat(Math.floor(Math.random() * 9000) + 1000)
                : null,
            contactWhatsapp: result === 'APOIADOR'
                ? "(96) 99".concat(Math.floor(Math.random() * 900) + 100, "-").concat(Math.floor(Math.random() * 9000) + 1000)
                : null,
            contactEmail: null,
            notes: notes[result] || null,
            issues: result === 'APOIADOR' || result === 'INDECISO'
                ? JSON.stringify(randomElement([['Saúde', 'Educação'], ['Segurança', 'Emprego'], ['Infraestrutura']]))
                : null,
            promises: result === 'APOIADOR' ? 'Prometeu comparecer em próximo evento de campanha' : null,
            followUpRequired: result === 'INDECISO',
            followUpDate: result === 'INDECISO'
                ? formatDate(new Date(contactedAt.getTime() + 7 * 24 * 60 * 60 * 1000))
                : null,
            materialsDelivered: result !== 'NAO_ATENDEU' && result !== 'MUDOU' && result !== 'RECUSOU_CONTATO'
                ? JSON.stringify(['Santinho', 'Folder'])
                : null,
            createdAt: sessionData.createdAt || new Date(),
            updatedAt: sessionData.updatedAt || new Date(),
            deletedAt: null,
        });
    }
    return doorKnocks;
}

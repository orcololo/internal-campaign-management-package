import type {
  CalendarEvent,
  EventCategory,
  EventStatus,
  EventPriority,
} from "@/types/calendar";

// Helper function to generate dates
function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function addHours(date: Date, hours: number): Date {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
}

function formatISODate(date: Date): string {
  return date.toISOString();
}

// Brazilian cities in Amapá
const cities = ["Macapá", "Santana", "Laranjal do Jari", "Oiapoque", "Mazagão"];

// Event names by category
const eventTemplates: Record<EventCategory, string[]> = {
  meeting: [
    "Reunião com Coordenação",
    "Encontro com Lideranças Comunitárias",
    "Reunião de Planejamento",
    "Reunião com Assessoria Jurídica",
    "Encontro com Empresários Locais",
  ],
  rally: [
    "Comício no Centro",
    "Carreata pela Cidade",
    "Ato Público",
    "Encontro com Apoiadores",
    "Grande Mobilização",
  ],
  "door-to-door": [
    "Corpo a Corpo Bairro Infraero",
    "Corpo a Corpo no Conjunto Habitacional",
    "Visita Porta a Porta",
    "Corpo a Corpo Zona Norte",
    "Corpo a Corpo Zona Sul",
  ],
  "phone-bank": [
    "Ligações para Eleitores",
    "Mutirão de Ligações",
    "Contato Telefônico com Base",
    "Pesquisa por Telefone",
    "Confirmação de Presença",
  ],
  fundraiser: [
    "Jantar Beneficente",
    "Café da Manhã com Apoiadores",
    "Evento de Arrecadação",
    "Leilão Beneficente",
    "Bingo Solidário",
  ],
  debate: [
    "Debate na Universidade",
    "Debate com Candidatos",
    "Sabatina com Jornalistas",
    "Fórum de Discussão",
    "Mesa Redonda",
  ],
  media: [
    "Entrevista para Rádio",
    "Gravação para TV",
    "Live nas Redes Sociais",
    "Coletiva de Imprensa",
    "Entrevista para Jornal",
  ],
  volunteer: [
    "Treinamento de Voluntários",
    "Café com Equipe",
    "Reunião de Voluntários",
    "Capacitação de Cabos Eleitorais",
    "Integração de Novos Membros",
  ],
  training: [
    "Treinamento em Legislação Eleitoral",
    "Curso de Comunicação",
    "Workshop de Mobilização",
    "Capacitação em Redes Sociais",
    "Formação Política",
  ],
  other: [
    "Inauguração de Comitê",
    "Visita a Associação",
    "Participação em Evento Comunitário",
    "Visita a Obra Pública",
    "Encontro Informal",
  ],
};

// Generate events for next 3 months
const now = new Date();
const events: CalendarEvent[] = [];
let eventId = 1;

// Past events (last 2 weeks)
for (let i = -14; i < 0; i++) {
  const category = Object.keys(eventTemplates)[
    Math.floor(Math.random() * 10)
  ] as EventCategory;
  const templates = eventTemplates[category];
  const title = templates[Math.floor(Math.random() * templates.length)];
  const city = cities[Math.floor(Math.random() * cities.length)];

  const startDate = addDays(now, i);
  startDate.setHours(8 + Math.floor(Math.random() * 10), 0, 0, 0);
  const endDate = addHours(startDate, 1 + Math.random() * 3);

  const statuses: EventStatus[] = [
    "completed",
    "completed",
    "completed",
    "cancelled",
  ];
  const status = statuses[Math.floor(Math.random() * statuses.length)];

  events.push({
    id: `event-${eventId++}`,
    title: `${title} - ${city}`,
    description: `Evento realizado na cidade de ${city}. ${
      category === "meeting"
        ? "Discussão de estratégias e próximos passos."
        : category === "rally"
        ? "Grande mobilização com a presença da comunidade."
        : "Atividade de campanha com a equipe local."
    }`,
    category,
    status,
    priority:
      Math.random() > 0.7 ? "high" : Math.random() > 0.4 ? "medium" : "low",
    startDate: formatISODate(startDate),
    endDate: formatISODate(endDate),
    allDay: false,
    location: {
      address: `Rua ${Math.floor(Math.random() * 500)}, Centro`,
      city,
      state: "AP",
    },
    isVirtual: Math.random() > 0.8,
    meetingLink:
      Math.random() > 0.8 ? "https://meet.google.com/abc-defg-hij" : undefined,
    organizer: "user-1",
    attendees: Array.from(
      { length: Math.floor(Math.random() * 5) + 2 },
      (_, idx) => ({
        id: `attendee-${idx}`,
        name:
          [
            "João Silva",
            "Maria Santos",
            "Pedro Costa",
            "Ana Lima",
            "Carlos Souza",
          ][idx] || "Participante",
        confirmed: Math.random() > 0.3,
        role:
          idx === 0
            ? ("organizer" as const)
            : Math.random() > 0.5
            ? ("volunteer" as const)
            : ("guest" as const),
      })
    ),
    expectedAttendance: Math.floor(Math.random() * 50) + 10,
    actualAttendance:
      status === "completed" ? Math.floor(Math.random() * 40) + 5 : undefined,
    campaignId: "campaign-1",
    tags: ["campanha2024", city.toLowerCase()],
    createdAt: formatISODate(addDays(startDate, -7)),
    updatedAt: formatISODate(addDays(startDate, 1)),
    createdBy: "user-1",
  });
}

// Today's events
for (let i = 0; i < 3; i++) {
  const category = ["meeting", "phone-bank", "media"][i] as EventCategory;
  const templates = eventTemplates[category];
  const title = templates[Math.floor(Math.random() * templates.length)];
  const city = cities[0]; // Macapá

  const startDate = new Date(now);
  startDate.setHours(9 + i * 4, 0, 0, 0);
  const endDate = addHours(startDate, 2);

  events.push({
    id: `event-${eventId++}`,
    title: `${title} - ${city}`,
    description: `Evento de hoje - ${
      category === "meeting"
        ? "Reunião importante com a equipe."
        : category === "phone-bank"
        ? "Mutirão de ligações para contato com eleitores."
        : "Entrevista com veículos de comunicação locais."
    }`,
    category,
    status:
      now.getHours() > startDate.getHours() + 2
        ? "completed"
        : now.getHours() > startDate.getHours()
        ? "in-progress"
        : "scheduled",
    priority: "high",
    startDate: formatISODate(startDate),
    endDate: formatISODate(endDate),
    allDay: false,
    location: {
      address: `Av. Principal, ${Math.floor(Math.random() * 1000)}`,
      city,
      state: "AP",
    },
    isVirtual: category === "phone-bank",
    organizer: "user-1",
    attendees: Array.from(
      { length: Math.floor(Math.random() * 8) + 3 },
      (_, idx) => ({
        id: `attendee-${idx}`,
        name:
          [
            "João Silva",
            "Maria Santos",
            "Pedro Costa",
            "Ana Lima",
            "Carlos Souza",
            "Paula Gomes",
            "Ricardo Alves",
            "Juliana Mendes",
          ][idx] || "Participante",
        confirmed: Math.random() > 0.2,
        role:
          idx === 0
            ? ("organizer" as const)
            : Math.random() > 0.6
            ? ("speaker" as const)
            : ("volunteer" as const),
      })
    ),
    expectedAttendance: Math.floor(Math.random() * 30) + 10,
    campaignId: "campaign-1",
    tags: ["campanha2024", "prioridade", city.toLowerCase()],
    color:
      category === "meeting"
        ? "#3b82f6"
        : category === "phone-bank"
        ? "#10b981"
        : "#f59e0b",
    createdAt: formatISODate(addDays(now, -5)),
    updatedAt: formatISODate(now),
    createdBy: "user-1",
  });
}

// Future events (next 90 days)
for (let i = 1; i <= 90; i++) {
  // Not every day has events
  if (Math.random() > 0.4) continue;

  const eventsPerDay = Math.floor(Math.random() * 3) + 1;

  for (let j = 0; j < eventsPerDay; j++) {
    const category = Object.keys(eventTemplates)[
      Math.floor(Math.random() * 10)
    ] as EventCategory;
    const templates = eventTemplates[category];
    const title = templates[Math.floor(Math.random() * templates.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];

    const startDate = addDays(now, i);
    startDate.setHours(8 + j * 4, 0, 0, 0);
    const endDate = addHours(startDate, 1 + Math.random() * 3);

    const priority: EventPriority =
      i <= 7 && Math.random() > 0.5
        ? "urgent"
        : Math.random() > 0.6
        ? "high"
        : Math.random() > 0.4
        ? "medium"
        : "low";

    events.push({
      id: `event-${eventId++}`,
      title: `${title} - ${city}`,
      description: `${
        category === "rally"
          ? "Grande evento de mobilização com a comunidade."
          : category === "door-to-door"
          ? "Atividade de corpo a corpo com eleitores."
          : category === "training"
          ? "Capacitação da equipe de campanha."
          : "Atividade programada de campanha."
      }`,
      category,
      status: "scheduled",
      priority,
      startDate: formatISODate(startDate),
      endDate: formatISODate(endDate),
      allDay: category === "rally" && Math.random() > 0.5,
      location: {
        address: `${
          category === "rally" ? "Praça Central" : "Rua"
        } ${Math.floor(Math.random() * 500)}`,
        city,
        state: "AP",
        coordinates:
          category === "rally"
            ? {
                lat: 0.034934 + (Math.random() - 0.5) * 0.1,
                lng: -51.066122 + (Math.random() - 0.5) * 0.1,
              }
            : undefined,
      },
      isVirtual:
        (category === "meeting" || category === "phone-bank") &&
        Math.random() > 0.6,
      meetingLink:
        (category === "meeting" || category === "phone-bank") &&
        Math.random() > 0.6
          ? "https://meet.google.com/xxx-yyyy-zzz"
          : undefined,
      organizer: "user-1",
      attendees: Array.from(
        { length: Math.floor(Math.random() * 6) + 2 },
        (_, idx) => ({
          id: `attendee-${idx}`,
          name:
            [
              "João Silva",
              "Maria Santos",
              "Pedro Costa",
              "Ana Lima",
              "Carlos Souza",
              "Paula Gomes",
            ][idx] || "Participante",
          confirmed: Math.random() > 0.4,
          role:
            idx === 0
              ? ("organizer" as const)
              : Math.random() > 0.7
              ? ("speaker" as const)
              : ("volunteer" as const),
        })
      ),
      expectedAttendance:
        category === "rally"
          ? Math.floor(Math.random() * 200) + 50
          : Math.floor(Math.random() * 30) + 5,
      campaignId: "campaign-1",
      tags: [
        "campanha2024",
        city.toLowerCase(),
        ...(priority === "urgent" || priority === "high" ? ["prioridade"] : []),
      ],
      color:
        category === "rally"
          ? "#ef4444"
          : category === "meeting"
          ? "#3b82f6"
          : category === "door-to-door"
          ? "#8b5cf6"
          : category === "phone-bank"
          ? "#10b981"
          : category === "fundraiser"
          ? "#f59e0b"
          : undefined,
      notes:
        priority === "urgent"
          ? "Evento prioritário - confirmar presença de todos os participantes."
          : undefined,
      createdAt: formatISODate(addDays(now, i - 10)),
      updatedAt: formatISODate(addDays(now, i - 5)),
      createdBy: "user-1",
    });
  }
}

// Mock database interface
class CalendarDatabase {
  private events: CalendarEvent[] = [...events];
  private nextId = eventId;

  // Get all events
  getAll(): CalendarEvent[] {
    return [...this.events];
  }

  // Get event by ID
  getById(id: string): CalendarEvent | undefined {
    return this.events.find((e) => e.id === id);
  }

  // Get events by date range
  getByDateRange(startDate: string, endDate: string): CalendarEvent[] {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return this.events.filter((event) => {
      const eventStart = new Date(event.startDate);
      return eventStart >= start && eventStart <= end;
    });
  }

  // Get events by month
  getByMonth(year: number, month: number): CalendarEvent[] {
    return this.events.filter((event) => {
      const eventDate = new Date(event.startDate);
      return eventDate.getFullYear() === year && eventDate.getMonth() === month;
    });
  }

  // Get today's events
  getToday(): CalendarEvent[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.events.filter((event) => {
      const eventStart = new Date(event.startDate);
      return eventStart >= today && eventStart < tomorrow;
    });
  }

  // Get upcoming events
  getUpcoming(limit: number = 10): CalendarEvent[] {
    const now = new Date();

    return this.events
      .filter(
        (event) =>
          new Date(event.startDate) > now && event.status === "scheduled"
      )
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      )
      .slice(0, limit);
  }

  // Create event
  create(
    input: Omit<CalendarEvent, "id" | "createdAt" | "updatedAt">
  ): CalendarEvent {
    const now = new Date();
    const newEvent: CalendarEvent = {
      ...input,
      id: `event-${this.nextId++}`,
      createdAt: formatISODate(now),
      updatedAt: formatISODate(now),
    };

    this.events.push(newEvent);
    return newEvent;
  }

  // Update event
  update(id: string, updates: Partial<CalendarEvent>): CalendarEvent | null {
    const index = this.events.findIndex((e) => e.id === id);
    if (index === -1) return null;

    this.events[index] = {
      ...this.events[index],
      ...updates,
      updatedAt: formatISODate(new Date()),
    };

    return this.events[index];
  }

  // Delete event
  delete(id: string): boolean {
    const index = this.events.findIndex((e) => e.id === id);
    if (index === -1) return false;

    this.events.splice(index, 1);
    return true;
  }

  // Filter events
  filter(filters: {
    category?: EventCategory[];
    status?: EventStatus[];
    priority?: EventPriority[];
    search?: string;
    city?: string;
  }): CalendarEvent[] {
    return this.events.filter((event) => {
      if (filters.category && !filters.category.includes(event.category))
        return false;
      if (filters.status && !filters.status.includes(event.status))
        return false;
      if (filters.priority && !filters.priority.includes(event.priority))
        return false;
      if (filters.search) {
        const search = filters.search.toLowerCase();
        if (
          !event.title.toLowerCase().includes(search) &&
          !event.description?.toLowerCase().includes(search)
        ) {
          return false;
        }
      }
      if (filters.city && event.location?.city !== filters.city) return false;

      return true;
    });
  }

  // Get statistics
  getStats(): {
    total: number;
    byCategory: Record<EventCategory, number>;
    byStatus: Record<EventStatus, number>;
    upcoming: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
  } {
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const weekEnd = new Date(todayStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const monthEnd = new Date(todayStart);
    monthEnd.setMonth(monthEnd.getMonth() + 1);

    const byCategory: Record<EventCategory, number> = {
      meeting: 0,
      rally: 0,
      "door-to-door": 0,
      "phone-bank": 0,
      fundraiser: 0,
      debate: 0,
      media: 0,
      volunteer: 0,
      training: 0,
      other: 0,
    };

    const byStatus: Record<EventStatus, number> = {
      scheduled: 0,
      "in-progress": 0,
      completed: 0,
      cancelled: 0,
    };

    let today = 0;
    let thisWeek = 0;
    let thisMonth = 0;
    let upcoming = 0;

    this.events.forEach((event) => {
      byCategory[event.category]++;
      byStatus[event.status]++;

      const eventStart = new Date(event.startDate);

      if (eventStart >= todayStart && eventStart < todayEnd) today++;
      if (eventStart >= todayStart && eventStart < weekEnd) thisWeek++;
      if (eventStart >= todayStart && eventStart < monthEnd) thisMonth++;
      if (eventStart > now && event.status === "scheduled") upcoming++;
    });

    return {
      total: this.events.length,
      byCategory,
      byStatus,
      upcoming,
      today,
      thisWeek,
      thisMonth,
    };
  }
}

// Export singleton instance
export const calendarDb = new CalendarDatabase();

// Export initial data for reference
export { events as mockEvents };

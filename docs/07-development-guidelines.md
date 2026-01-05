# Development Guidelines - TypeScript Modular

## Princípios Fundamentais

### YAGNI (You Aren't Gonna Need It)
```typescript
// ❌ BAD: Over-engineering
class VoterRepository {
  constructor(
    private db: Database,
    private cache: Cache,
    private eventBus: EventBus,
    private logger: Logger,
    private metrics: Metrics,
  ) {}

  async findAll(options?: FindOptions): Promise<Voter[]> {
    // Complexidade desnecessária
  }
}

// ✅ GOOD: Simple and direct
class VotersService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: any) {
    return this.prisma.voter.findMany({ where: filters });
  }
}
```

### KISS (Keep It Simple, Stupid)
```typescript
// ❌ BAD: Abstract factory pattern desnecessário
interface VoterFactory {
  create(type: string): Voter;
}

class VoterFactoryImpl implements VoterFactory {
  create(type: string): Voter {
    switch(type) {
      case 'regular': return new RegularVoter();
      case 'supporter': return new SupporterVoter();
    }
  }
}

// ✅ GOOD: Plain objects
function createVoter(data: CreateVoterDto): Voter {
  return {
    ...data,
    createdAt: new Date(),
  };
}
```

---

## Estrutura de Módulos (Feature-First)

### Organização por Feature, não por Tipo

```
❌ BAD (Type-First)
src/
├── controllers/
│   ├── voters.controller.ts
│   ├── events.controller.ts
├── services/
│   ├── voters.service.ts
│   ├── events.service.ts
├── repositories/
│   ├── voters.repository.ts
└── dtos/
    ├── create-voter.dto.ts

✅ GOOD (Feature-First)
src/
├── modules/
│   ├── voters/
│   │   ├── voters.module.ts
│   │   ├── voters.controller.ts
│   │   ├── voters.service.ts
│   │   ├── dto/
│   │   │   ├── create-voter.dto.ts
│   │   │   └── update-voter.dto.ts
│   │   └── entities/
│   │       └── voter.entity.ts
│   │
│   └── events/
│       ├── events.module.ts
│       ├── events.controller.ts
│       └── events.service.ts
```

### Template de Módulo

```typescript
// voters/voters.module.ts
import { Module } from '@nestjs/common';
import { VotersController } from './voters.controller';
import { VotersService } from './voters.service';

@Module({
  controllers: [VotersController],
  providers: [VotersService],
  exports: [VotersService], // Exportar se outros módulos precisarem
})
export class VotersModule {}
```

---

## TypeScript: Type Safety

### Use Types/Interfaces, não Any

```typescript
// ❌ BAD
function processVoter(data: any) {
  return data.name + data.email;
}

// ✅ GOOD
interface Voter {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
}

function processVoter(voter: Voter): string {
  return `${voter.name} - ${voter.email ?? 'N/A'}`;
}
```

### Prefer Type Inference

```typescript
// ❌ BAD: Redundância
const count: number = 10;
const name: string = 'João';

// ✅ GOOD: TypeScript infere automaticamente
const count = 10;
const name = 'João';

// ✅ GOOD: Apenas quando necessário
const voters: Voter[] = []; // Array vazio precisa de tipo
```

### Use Utility Types

```typescript
// Partial: tornar todas propriedades opcionais
type UpdateVoterDto = Partial<CreateVoterDto>;

// Pick: selecionar apenas algumas propriedades
type VoterSummary = Pick<Voter, 'id' | 'name' | 'email'>;

// Omit: excluir propriedades
type VoterWithoutId = Omit<Voter, 'id'>;

// Record: mapear chaves para valores
type VotersByZone = Record<string, Voter[]>;

// Exemplo prático
interface CreateVoterDto {
  name: string;
  email?: string;
  phone?: string;
  zone?: string;
}

// Automaticamente derivado
type UpdateVoterDto = Partial<CreateVoterDto>;

// Uso
function updateVoter(id: number, data: UpdateVoterDto) {
  // data.name é opcional aqui
}
```

---

## DTOs e Validação

### Class Validator (NestJS)

```typescript
// dto/create-voter.dto.ts
import { 
  IsString, 
  IsEmail, 
  IsOptional, 
  MinLength, 
  MaxLength,
  Matches 
} from 'class-validator';

export class CreateVoterDto {
  @IsString()
  @MinLength(3, { message: 'Nome deve ter no mínimo 3 caracteres' })
  @MaxLength(100)
  name: string;

  @IsEmail({}, { message: 'Email inválido' })
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @Matches(/^\d{10,11}$/, { message: 'Telefone deve ter 10 ou 11 dígitos' })
  phone?: string;

  @IsString()
  @IsOptional()
  zone?: string;
}
```

### Zod (Frontend - Next.js)

```typescript
// lib/schemas/voter.schema.ts
import { z } from 'zod';

export const voterSchema = z.object({
  name: z.string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome muito longo'),
  
  email: z.string()
    .email('Email inválido')
    .optional()
    .or(z.literal('')),
  
  phone: z.string()
    .regex(/^\d{10,11}$/, 'Telefone deve ter 10 ou 11 dígitos')
    .optional()
    .or(z.literal('')),
  
  zone: z.string().optional(),
});

export type VoterFormData = z.infer<typeof voterSchema>;

// Uso em formulário
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const { register, handleSubmit, formState: { errors } } = useForm<VoterFormData>({
  resolver: zodResolver(voterSchema),
});
```

---

## Error Handling

### Backend: Custom Exceptions

```typescript
// common/exceptions/voter.exceptions.ts
import { NotFoundException, ConflictException } from '@nestjs/common';

export class VoterNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Voter #${id} not found`);
  }
}

export class DuplicateVoterException extends ConflictException {
  constructor(field: string, value: string) {
    super(`Voter with ${field} "${value}" already exists`);
  }
}

// Uso
throw new VoterNotFoundException(123);
throw new DuplicateVoterException('email', 'joao@email.com');
```

### Frontend: Error Boundary

```typescript
// components/error-boundary.tsx
'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    console.error('Error caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 bg-red-50 rounded">
          <h2 className="text-red-800 font-bold">Algo deu errado</h2>
          <p className="text-red-600">{this.state.error?.message}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

// Uso
<ErrorBoundary>
  <VotersList />
</ErrorBoundary>
```

---

## Async/Await: Best Practices

### Promise.all para Operações Paralelas

```typescript
// ❌ BAD: Sequencial (lento)
async function loadDashboard(campaignId: string) {
  const voters = await getVoters(campaignId);
  const events = await getEvents(campaignId);
  const donations = await getDonations(campaignId);
  
  return { voters, events, donations };
}

// ✅ GOOD: Paralelo (rápido)
async function loadDashboard(campaignId: string) {
  const [voters, events, donations] = await Promise.all([
    getVoters(campaignId),
    getEvents(campaignId),
    getDonations(campaignId),
  ]);
  
  return { voters, events, donations };
}
```

### Error Handling com Try/Catch

```typescript
// ✅ GOOD
async function createVoter(data: CreateVoterDto) {
  try {
    const voter = await this.prisma.voter.create({ data });
    return { success: true, data: voter };
  } catch (error) {
    if (error.code === 'P2002') { // Unique constraint
      throw new DuplicateVoterException('email', data.email);
    }
    throw error;
  }
}
```

---

## Naming Conventions

### Variáveis e Funções: camelCase

```typescript
const voterCount = 100;
const firstName = 'João';

function getVoterById(id: number) {}
async function fetchCampaignData() {}
```

### Classes e Interfaces: PascalCase

```typescript
class VotersService {}
interface CreateVoterDto {}
type VoterSummary = {};
```

### Constants: UPPER_SNAKE_CASE

```typescript
const MAX_VOTERS_PER_PAGE = 50;
const API_BASE_URL = 'https://api.campaign.com';
```

### Private Members: Prefix com _

```typescript
class VotersService {
  private _cache: Map<number, Voter> = new Map();
  
  private _buildCacheKey(id: number): string {
    return `voter:${id}`;
  }
}
```

### Boolean: Prefix com is/has/should

```typescript
const isActive = true;
const hasPermission = false;
const shouldRefresh = true;

interface Voter {
  isDeleted: boolean;
  hasVoted: boolean;
}
```

---

## React Components: Best Practices

### Functional Components com Hooks

```typescript
// ❌ BAD: Class component desnecessário
class VotersList extends React.Component {
  state = { voters: [] };
  
  componentDidMount() {
    this.loadVoters();
  }
  
  loadVoters = async () => {
    const voters = await fetchVoters();
    this.setState({ voters });
  }
  
  render() {
    return <div>{/* ... */}</div>;
  }
}

// ✅ GOOD: Functional component
function VotersList() {
  const [voters, setVoters] = useState<Voter[]>([]);
  
  useEffect(() => {
    fetchVoters().then(setVoters);
  }, []);
  
  return <div>{/* ... */}</div>;
}
```

### Custom Hooks para Lógica Reutilizável

```typescript
// hooks/use-voters.ts
function useVoters(campaignId: string) {
  const [voters, setVoters] = useState<Voter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchVoters(campaignId)
      .then(setVoters)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [campaignId]);

  return { voters, loading, error };
}

// Uso
function VotersList({ campaignId }: Props) {
  const { voters, loading, error } = useVoters(campaignId);
  
  if (loading) return <Spinner />;
  if (error) return <Error message={error.message} />;
  
  return <Table data={voters} />;
}
```

### Separar Lógica de Apresentação

```typescript
// ❌ BAD: Tudo junto
function VotersList() {
  const [voters, setVoters] = useState([]);
  const [search, setSearch] = useState('');
  
  const filteredVoters = voters.filter(v => 
    v.name.toLowerCase().includes(search.toLowerCase())
  );
  
  return (
    <div>
      <input value={search} onChange={e => setSearch(e.target.value)} />
      {filteredVoters.map(voter => (
        <div key={voter.id}>{voter.name}</div>
      ))}
    </div>
  );
}

// ✅ GOOD: Componentes separados
function VotersList({ voters }: Props) {
  return (
    <div className="space-y-4">
      {voters.map(voter => (
        <VoterCard key={voter.id} voter={voter} />
      ))}
    </div>
  );
}

function VoterCard({ voter }: { voter: Voter }) {
  return (
    <div className="border rounded p-4">
      <h3>{voter.name}</h3>
      <p>{voter.email}</p>
    </div>
  );
}
```

---

## Code Organization

### Barrel Exports (index.ts)

```typescript
// modules/voters/index.ts
export { VotersModule } from './voters.module';
export { VotersService } from './voters.service';
export { VotersController } from './voters.controller';
export * from './dto';
export * from './entities';

// Uso
import { VotersService, CreateVoterDto } from '@/modules/voters';
```

### Constantes em Arquivo Separado

```typescript
// modules/voters/voters.constants.ts
export const VOTERS_PER_PAGE = 20;
export const MAX_IMPORT_SIZE = 1000;

export const VOTER_SEGMENTS = {
  SUPPORTER: 'apoiador',
  NEUTRAL: 'neutro',
  OPPOSITION: 'oposicao',
} as const;

export type VoterSegment = typeof VOTER_SEGMENTS[keyof typeof VOTER_SEGMENTS];
```

---

## Testing

### Unit Tests: Describe/It Pattern

```typescript
// voters.service.spec.ts
import { Test } from '@nestjs/testing';
import { VotersService } from './voters.service';
import { PrismaService } from '@/common/prisma.service';

describe('VotersService', () => {
  let service: VotersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        VotersService,
        {
          provide: PrismaService,
          useValue: {
            voter: {
              findMany: jest.fn(),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get(VotersService);
    prisma = module.get(PrismaService);
  });

  describe('findAll', () => {
    it('should return array of voters', async () => {
      const mockVoters = [{ id: 1, name: 'João' }];
      jest.spyOn(prisma.voter, 'findMany').mockResolvedValue(mockVoters);

      const result = await service.findAll('campaign-1', {});

      expect(result.data).toEqual(mockVoters);
      expect(prisma.voter.findMany).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a voter', async () => {
      const dto = { name: 'João', email: 'joao@email.com' };
      const mockVoter = { id: 1, ...dto };
      
      jest.spyOn(prisma.voter, 'create').mockResolvedValue(mockVoter);

      const result = await service.create('campaign-1', dto);

      expect(result).toEqual(mockVoter);
    });

    it('should throw on duplicate email', async () => {
      const dto = { name: 'João', email: 'joao@email.com' };
      
      jest.spyOn(prisma.voter, 'create').mockRejectedValue({ code: 'P2002' });

      await expect(service.create('campaign-1', dto)).rejects.toThrow();
    });
  });
});
```

---

## Performance Tips

### Memoization

```typescript
// React: useMemo para cálculos pesados
function VotersList({ voters, filter }: Props) {
  const filteredVoters = useMemo(() => {
    return voters.filter(voter => 
      voter.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [voters, filter]); // Recalcula apenas quando mudar

  return <div>{/* ... */}</div>;
}

// React: useCallback para funções
function VotersPage() {
  const handleDelete = useCallback((id: number) => {
    deleteVoter(id);
  }, []); // Função não muda entre renders

  return <VotersList onDelete={handleDelete} />;
}
```

### Database: Select Only Needed Fields

```typescript
// ❌ BAD: Busca tudo
const voters = await prisma.voter.findMany();

// ✅ GOOD: Busca apenas o necessário
const voters = await prisma.voter.findMany({
  select: {
    id: true,
    name: true,
    email: true,
  },
});
```

---

## Git Commit Messages

### Conventional Commits

```bash
feat: adicionar filtro por zona eleitoral
fix: corrigir validação de telefone
refactor: simplificar lógica de importação CSV
docs: atualizar README com instruções de deploy
test: adicionar testes para VotersService
chore: atualizar dependências
```

### Formato

```
<type>(<scope>): <subject>

<body>

<footer>
```

Exemplo:
```
feat(voters): adicionar importação em massa via CSV

- Validação de colunas obrigatórias
- Deduplicação por email/telefone
- Relatório de erros

Closes #42
```

---

## Code Review Checklist

- [ ] Código segue YAGNI e KISS?
- [ ] Tipos TypeScript corretos (sem `any`)?
- [ ] DTOs têm validação?
- [ ] Funções têm responsabilidade única?
- [ ] Erros são tratados adequadamente?
- [ ] Testes foram adicionados/atualizados?
- [ ] Commits seguem Conventional Commits?
- [ ] Não há código comentado?
- [ ] Não há console.logs desnecessários?
- [ ] Documentação foi atualizada?

---

## Próximo: Deployment

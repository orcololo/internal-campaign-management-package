# Backend - NestJS Modular

## Estrutura de Módulos

```
apps/api/src/
├── modules/
│   ├── auth/              # Autenticação com Keycloak
│   ├── tenants/           # Gestão de campanhas
│   ├── voters/            # Base de eleitores
│   ├── calendar/          # Agenda e eventos
│   ├── canvassing/        # Mobilização de rua
│   ├── donations/         # Gestão financeira
│   ├── n8n/               # Integração com n8n
│   └── analytics/         # Dashboards e RAG
├── common/
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   └── pipes/
├── config/                # Configurações
└── main.ts
```

---

## Module Template (Padrão)

Cada módulo segue a mesma estrutura:

```
voters/
├── voters.module.ts       # Módulo principal
├── voters.controller.ts   # Endpoints REST
├── voters.service.ts      # Lógica de negócio
├── voters.repository.ts   # Acesso ao banco (opcional)
├── dto/
│   ├── create-voter.dto.ts
│   ├── update-voter.dto.ts
│   └── filter-voter.dto.ts
└── entities/
    └── voter.entity.ts
```

### KISS: Service contém tudo

```typescript
// voters.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma.service';
import { CreateVoterDto, UpdateVoterDto, FilterVoterDto } from './dto';

@Injectable()
export class VotersService {
  constructor(private prisma: PrismaService) {}

  // Listar com filtros e paginação
  async findAll(campaignId: string, filters: FilterVoterDto) {
    const { page = 1, perPage = 20, search, zone } = filters;

    const where = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search } },
        ],
      }),
      ...(zone && { zone }),
    };

    const [voters, total] = await Promise.all([
      this.prisma.voter.findMany({
        where,
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.voter.count({ where }),
    ]);

    return {
      data: voters,
      meta: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
    };
  }

  // Criar
  async create(campaignId: string, dto: CreateVoterDto) {
    return this.prisma.voter.create({
      data: {
        ...dto,
        campaignId,
      },
    });
  }

  // Buscar um
  async findOne(id: number) {
    const voter = await this.prisma.voter.findUnique({ where: { id } });
    
    if (!voter) {
      throw new NotFoundException(`Voter #${id} not found`);
    }
    
    return voter;
  }

  // Atualizar
  async update(id: number, dto: UpdateVoterDto) {
    await this.findOne(id); // Verifica se existe
    
    return this.prisma.voter.update({
      where: { id },
      data: dto,
    });
  }

  // Deletar (soft delete)
  async remove(id: number) {
    await this.findOne(id);
    
    return this.prisma.voter.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // Importação em massa
  async bulkImport(campaignId: string, voters: CreateVoterDto[]) {
    return this.prisma.voter.createMany({
      data: voters.map(v => ({ ...v, campaignId })),
      skipDuplicates: true,
    });
  }
}
```

---

## DTOs com Validação

```typescript
// dto/create-voter.dto.ts
import { IsString, IsEmail, IsOptional, IsPhoneNumber } from 'class-validator';

export class CreateVoterDto {
  @IsString()
  name: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsPhoneNumber('BR')
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  zone?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsOptional()
  metadata?: Record<string, any>;
}

// dto/filter-voter.dto.ts
import { IsOptional, IsInt, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class FilterVoterDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  perPage?: number = 20;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  zone?: string;
}
```

---

## Controller com Guards

```typescript
// voters.controller.ts
import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { VotersService } from './voters.service';
import { CreateVoterDto, UpdateVoterDto, FilterVoterDto } from './dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentCampaign } from '@/common/decorators/current-campaign.decorator';

@Controller('campaigns/:campaignId/voters')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VotersController {
  constructor(private votersService: VotersService) {}

  @Get()
  @Roles('read', 'write')
  findAll(
    @CurrentCampaign() campaignId: string,
    @Query() filters: FilterVoterDto,
  ) {
    return this.votersService.findAll(campaignId, filters);
  }

  @Post()
  @Roles('write')
  create(
    @CurrentCampaign() campaignId: string,
    @Body() dto: CreateVoterDto,
  ) {
    return this.votersService.create(campaignId, dto);
  }

  @Get(':id')
  @Roles('read', 'write')
  findOne(@Param('id') id: string) {
    return this.votersService.findOne(+id);
  }

  @Patch(':id')
  @Roles('write')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateVoterDto,
  ) {
    return this.votersService.update(+id, dto);
  }

  @Delete(':id')
  @Roles('write')
  remove(@Param('id') id: string) {
    return this.votersService.remove(+id);
  }

  @Post('import')
  @Roles('write')
  bulkImport(
    @CurrentCampaign() campaignId: string,
    @Body() voters: CreateVoterDto[],
  ) {
    return this.votersService.bulkImport(campaignId, voters);
  }
}
```

---

## Common: Decorators e Guards

### Custom Decorator: CurrentCampaign

```typescript
// common/decorators/current-campaign.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentCampaign = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.params.campaignId || request.user?.campaignId;
  },
);
```

### Custom Decorator: CurrentUser

```typescript
// common/decorators/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
```

### Roles Guard (RBAC Simples)

```typescript
// common/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Verificar se o usuário tem alguma das roles necessárias
    return requiredRoles.some(role => user.roles?.includes(role));
  }
}

// common/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
```

---

## Módulo n8n Integration

### Webhooks para Automação

```typescript
// modules/n8n/n8n.service.ts
import { Injectable, HttpService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface N8nWebhookPayload {
  event: string;
  campaignId: string;
  data: any;
  triggeredAt: Date;
}

@Injectable()
export class N8nService {
  private readonly n8nUrl: string;

  constructor(
    private http: HttpService,
    private config: ConfigService,
  ) {
    this.n8nUrl = this.config.get('N8N_WEBHOOK_URL');
  }

  // Trigger genérico para n8n
  async triggerWorkflow(workflowId: string, payload: N8nWebhookPayload) {
    const url = `${this.n8nUrl}/webhook/${workflowId}`;
    
    try {
      const response = await this.http.post(url, payload).toPromise();
      return response.data;
    } catch (error) {
      console.error('n8n webhook error:', error);
      throw error;
    }
  }

  // Enviar mensagem WhatsApp via n8n
  async sendWhatsApp(campaignId: string, phone: string, message: string) {
    return this.triggerWorkflow('whatsapp-send', {
      event: 'whatsapp.send',
      campaignId,
      data: { phone, message },
      triggeredAt: new Date(),
    });
  }

  // Enviar email via n8n
  async sendEmail(campaignId: string, to: string, subject: string, body: string) {
    return this.triggerWorkflow('email-send', {
      event: 'email.send',
      campaignId,
      data: { to, subject, body },
      triggeredAt: new Date(),
    });
  }

  // Processar lista de contatos
  async processContactList(campaignId: string, contactIds: number[]) {
    return this.triggerWorkflow('contact-batch', {
      event: 'contacts.process',
      campaignId,
      data: { contactIds },
      triggeredAt: new Date(),
    });
  }
}
```

### Webhook Receiver (n8n -> API)

```typescript
// modules/n8n/n8n.controller.ts
import { Controller, Post, Body, Headers, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('webhooks/n8n')
export class N8nController {
  constructor(
    private config: ConfigService,
    private votersService: VotersService,
  ) {}

  // Validar webhook secret
  private validateWebhook(authHeader: string): boolean {
    const secret = this.config.get('N8N_WEBHOOK_SECRET');
    return authHeader === `Bearer ${secret}`;
  }

  // Receber resposta de mensagens
  @Post('message-status')
  async handleMessageStatus(
    @Headers('authorization') auth: string,
    @Body() payload: any,
  ) {
    if (!this.validateWebhook(auth)) {
      throw new UnauthorizedException('Invalid webhook secret');
    }

    const { voterId, status, timestamp } = payload;

    // Atualizar status no banco
    await this.votersService.updateMessageStatus(voterId, status, timestamp);

    return { received: true };
  }

  // Receber feedback de eleitor
  @Post('voter-response')
  async handleVoterResponse(
    @Headers('authorization') auth: string,
    @Body() payload: any,
  ) {
    if (!this.validateWebhook(auth)) {
      throw new UnauthorizedException('Invalid webhook secret');
    }

    const { voterId, message, sentiment } = payload;

    // Registrar resposta
    await this.votersService.addFeedback(voterId, message, sentiment);

    return { received: true };
  }
}
```

---

## Jobs Assíncronos com Bull

```typescript
// modules/voters/voters.processor.ts
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('voters')
export class VotersProcessor {
  constructor(
    private votersService: VotersService,
    private n8nService: N8nService,
  ) {}

  @Process('import-csv')
  async handleImport(job: Job) {
    const { campaignId, fileUrl } = job.data;

    // Baixar arquivo
    const data = await this.downloadFile(fileUrl);

    // Processar em chunks de 100
    const chunks = this.chunkArray(data, 100);

    for (const chunk of chunks) {
      await this.votersService.bulkImport(campaignId, chunk);
      await job.progress((chunks.indexOf(chunk) / chunks.length) * 100);
    }

    return { imported: data.length };
  }

  @Process('send-bulk-message')
  async handleBulkMessage(job: Job) {
    const { campaignId, voterIds, message } = job.data;

    for (const voterId of voterIds) {
      const voter = await this.votersService.findOne(voterId);
      
      if (voter.phone) {
        await this.n8nService.sendWhatsApp(campaignId, voter.phone, message);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limit
      }

      await job.progress((voterIds.indexOf(voterId) / voterIds.length) * 100);
    }

    return { sent: voterIds.length };
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
      array.slice(i * size, i * size + size)
    );
  }
}
```

---

## Global Exception Filter

```typescript
// common/filters/http-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    response.status(status).json({
      error: {
        code: typeof message === 'object' ? message['error'] : 'ERROR',
        message: typeof message === 'object' ? message['message'] : message,
        details: typeof message === 'object' ? message : null,
      },
      meta: {
        timestamp: new Date().toISOString(),
        path: request.url,
        requestId: request.headers['x-request-id'],
      },
    });
  }
}
```

---

## Main.ts - Bootstrap

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global filters
  app.useGlobalFilters(new AllExceptionsFilter());

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  });

  // Prefix
  app.setGlobalPrefix('api/v1');

  await app.listen(3000);
}

bootstrap();
```

---

## Environment Variables

```bash
# .env
DATABASE_URL="postgresql://user:pass@localhost:5432/campaign_db"
REDIS_URL="redis://localhost:6379"
MONGODB_URL="mongodb://localhost:27017/campaign_logs"

KEYCLOAK_URL="http://localhost:8080"
KEYCLOAK_REALM="campaign-platform"
KEYCLOAK_CLIENT_ID="api-backend"
KEYCLOAK_CLIENT_SECRET="secret"

N8N_WEBHOOK_URL="http://localhost:5678"
N8N_WEBHOOK_SECRET="your-secret-here"

FRONTEND_URL="http://localhost:3001"
```

---

## Testing Pattern

```typescript
// voters.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { VotersService } from './voters.service';
import { PrismaService } from '@/common/prisma.service';

describe('VotersService', () => {
  let service: VotersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VotersService,
        {
          provide: PrismaService,
          useValue: {
            voter: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<VotersService>(VotersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should find all voters', async () => {
    const mockVoters = [{ id: 1, name: 'João' }];
    jest.spyOn(prisma.voter, 'findMany').mockResolvedValue(mockVoters);

    const result = await service.findAll('campaign-1', {});
    expect(result.data).toEqual(mockVoters);
  });
});
```

---

## Módulos Essenciais

### 1. TenantsModule
- CRUD de campanhas
- Onboarding (criar schema, usuário admin)
- Configurações da campanha

### 2. VotersModule
- CRUD de eleitores
- Importação CSV/Excel
- Segmentação e busca

### 3. CalendarModule
- CRUD de eventos
- Conflitos de agenda
- Notificações

### 4. CanvassingModule
- Walk lists
- Registro de visitas
- Tracking GPS

### 5. N8nModule
- Webhooks outgoing/incoming
- Message queues
- Status tracking

### 6. AnalyticsModule
- Dashboards em tempo real
- Métricas agregadas
- RAG para consultas IA

---

## Próximo: Frontend com Next.js

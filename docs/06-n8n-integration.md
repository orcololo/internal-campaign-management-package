# Integração n8n - Automação e Workflows

## Arquitetura de Integração

```
┌─────────────────┐         ┌──────────────┐         ┌─────────────────┐
│   Campaign API  │ Trigger │     n8n      │  Action │  External APIs  │
│   (NestJS)      │ ──────► │  Workflows   │ ──────► │  (WhatsApp,     │
│                 │ ◄────── │              │ ◄────── │   Email, etc)   │
└─────────────────┘ Webhook └──────────────┘ Response└─────────────────┘
```

---

## Casos de Uso

### 1. Envio em Massa de Mensagens
- Trigger: Criar lista de contatos no sistema
- n8n: Processar lista, aplicar throttling
- Action: Enviar via WhatsApp/SMS/Email

### 2. Análise de Sentimento
- Trigger: Eleitor responde mensagem
- n8n: Chamar API de NLP/LLM
- Action: Atualizar segmento do eleitor

### 3. Notificações Automáticas
- Trigger: Novo evento criado
- n8n: Buscar participantes
- Action: Enviar lembrete 24h antes

### 4. Importação de Dados
- Trigger: Upload de planilha
- n8n: Validar, transformar, enriquecer
- Action: Inserir no banco de dados

### 5. Relatórios Agendados
- Trigger: Cron schedule (diário)
- n8n: Agregar métricas
- Action: Enviar email com PDF

---

## Setup n8n

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  n8n:
    image: n8nio/n8n:latest
    container_name: n8n
    restart: always
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=changeme
      - N8N_HOST=localhost
      - N8N_PORT=5678
      - N8N_PROTOCOL=http
      - WEBHOOK_URL=http://localhost:5678/
      - GENERIC_TIMEZONE=America/Sao_Paulo
      
      # Database (PostgreSQL)
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_PORT=5432
      - DB_POSTGRESDB_DATABASE=n8n
      - DB_POSTGRESDB_USER=n8n
      - DB_POSTGRESDB_PASSWORD=n8n
      
      # Encryption
      - N8N_ENCRYPTION_KEY=your-encryption-key-32-chars
      
    volumes:
      - n8n_data:/home/node/.n8n
      - ./n8n/custom-nodes:/home/node/.n8n/custom
    
    depends_on:
      - postgres

  postgres:
    image: postgres:15-alpine
    container_name: n8n_postgres
    restart: always
    environment:
      POSTGRES_DB: n8n
      POSTGRES_USER: n8n
      POSTGRES_PASSWORD: n8n
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  n8n_data:
  postgres_data:
```

---

## Webhook Patterns

### 1. Outgoing Webhooks (API → n8n)

#### Backend: Trigger Workflow

```typescript
// modules/n8n/n8n.service.ts
import { Injectable, HttpService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

export interface WebhookPayload {
  event: string;
  campaignId: string;
  data: any;
  metadata?: {
    userId: string;
    timestamp: Date;
  };
}

@Injectable()
export class N8nService {
  private readonly baseUrl: string;
  private readonly webhookSecret: string;

  constructor(
    private httpService: HttpService,
    private config: ConfigService,
  ) {
    this.baseUrl = this.config.get('N8N_WEBHOOK_URL');
    this.webhookSecret = this.config.get('N8N_WEBHOOK_SECRET');
  }

  async triggerWorkflow(workflowName: string, payload: WebhookPayload) {
    const url = `${this.baseUrl}/webhook/${workflowName}`;

    try {
      const response = await firstValueFrom(
        this.httpService.post(url, payload, {
          headers: {
            'Authorization': `Bearer ${this.webhookSecret}`,
            'Content-Type': 'application/json',
          },
        })
      );

      return {
        success: true,
        executionId: response.data.executionId,
        data: response.data,
      };
    } catch (error) {
      console.error(`n8n webhook error (${workflowName}):`, error.message);
      
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // ===== Workflows Específicos =====

  async sendBulkWhatsApp(campaignId: string, contacts: Array<{ phone: string; message: string }>) {
    return this.triggerWorkflow('whatsapp-bulk-send', {
      event: 'whatsapp.bulk.send',
      campaignId,
      data: { contacts },
      metadata: {
        userId: 'system',
        timestamp: new Date(),
      },
    });
  }

  async analyzeSentiment(campaignId: string, voterId: number, message: string) {
    return this.triggerWorkflow('sentiment-analysis', {
      event: 'message.received',
      campaignId,
      data: {
        voterId,
        message,
      },
    });
  }

  async enrichVoterData(campaignId: string, voterId: number, cpf: string) {
    return this.triggerWorkflow('voter-enrichment', {
      event: 'voter.enrich',
      campaignId,
      data: {
        voterId,
        cpf,
      },
    });
  }

  async generateDailyReport(campaignId: string, reportDate: string) {
    return this.triggerWorkflow('daily-report', {
      event: 'report.generate',
      campaignId,
      data: {
        reportDate,
      },
    });
  }
}
```

#### n8n Workflow: WhatsApp Bulk Send

```json
{
  "name": "WhatsApp Bulk Send",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "whatsapp-bulk-send",
        "responseMode": "responseNode",
        "options": {}
      },
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "position": [240, 300]
    },
    {
      "parameters": {
        "authentication": "headerAuth",
        "functionCode": "// Validar secret\nconst secret = $input.item.headers.authorization?.replace('Bearer ', '');\n\nif (secret !== $env.WEBHOOK_SECRET) {\n  throw new Error('Unauthorized');\n}\n\nreturn $input.item.json;"
      },
      "name": "Validate Secret",
      "type": "n8n-nodes-base.function",
      "position": [460, 300]
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "1",
              "name": "contacts",
              "value": "={{ $json.data.contacts }}",
              "type": "array"
            }
          ]
        },
        "options": {}
      },
      "name": "Extract Contacts",
      "type": "n8n-nodes-base.set",
      "position": [680, 300]
    },
    {
      "parameters": {
        "batchSize": 1,
        "options": {
          "splitInputData": true
        }
      },
      "name": "Loop Over Contacts",
      "type": "n8n-nodes-base.splitInBatches",
      "position": [900, 300]
    },
    {
      "parameters": {
        "amount": 2,
        "unit": "seconds"
      },
      "name": "Wait (Rate Limit)",
      "type": "n8n-nodes-base.wait",
      "position": [1120, 300]
    },
    {
      "parameters": {
        "url": "https://api.whatsapp.com/send",
        "authentication": "genericCredentialType",
        "genericAuthType": "httpHeaderAuth",
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "phone",
              "value": "={{ $json.phone }}"
            },
            {
              "name": "message",
              "value": "={{ $json.message }}"
            }
          ]
        }
      },
      "name": "Send WhatsApp",
      "type": "n8n-nodes-base.httpRequest",
      "position": [1340, 300]
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "={{ { success: true, sent: $json.totalSent } }}"
      },
      "name": "Response",
      "type": "n8n-nodes-base.respondToWebhook",
      "position": [1560, 300]
    }
  ],
  "connections": {
    "Webhook": {
      "main": [[{ "node": "Validate Secret", "type": "main", "index": 0 }]]
    },
    "Validate Secret": {
      "main": [[{ "node": "Extract Contacts", "type": "main", "index": 0 }]]
    },
    "Extract Contacts": {
      "main": [[{ "node": "Loop Over Contacts", "type": "main", "index": 0 }]]
    },
    "Loop Over Contacts": {
      "main": [[{ "node": "Wait (Rate Limit)", "type": "main", "index": 0 }]]
    },
    "Wait (Rate Limit)": {
      "main": [[{ "node": "Send WhatsApp", "type": "main", "index": 0 }]]
    },
    "Send WhatsApp": {
      "main": [[{ "node": "Response", "type": "main", "index": 0 }]]
    }
  }
}
```

---

### 2. Incoming Webhooks (n8n → API)

#### Backend: Receive Webhook

```typescript
// modules/n8n/n8n.controller.ts
import { Controller, Post, Body, Headers, UnauthorizedException } from '@nestjs/common';
import { VotersService } from '../voters/voters.service';
import { ConfigService } from '@nestjs/config';

@Controller('webhooks/n8n')
export class N8nWebhooksController {
  constructor(
    private config: ConfigService,
    private votersService: VotersService,
  ) {}

  private validateSecret(authHeader: string): boolean {
    const secret = this.config.get('N8N_WEBHOOK_SECRET');
    return authHeader === `Bearer ${secret}`;
  }

  @Post('message-status')
  async handleMessageStatus(
    @Headers('authorization') auth: string,
    @Body() payload: any,
  ) {
    if (!this.validateSecret(auth)) {
      throw new UnauthorizedException('Invalid webhook secret');
    }

    const { voterId, status, messageId, timestamp, error } = payload;

    // Atualizar status da mensagem
    await this.votersService.updateMessageStatus(voterId, {
      messageId,
      status,
      timestamp: new Date(timestamp),
      error,
    });

    return { received: true };
  }

  @Post('sentiment-result')
  async handleSentimentAnalysis(
    @Headers('authorization') auth: string,
    @Body() payload: any,
  ) {
    if (!this.validateSecret(auth)) {
      throw new UnauthorizedException();
    }

    const { voterId, sentiment, score, keywords } = payload;

    // Atualizar segmento do eleitor baseado no sentimento
    const newSegment = this.determineSegment(sentiment, score);
    
    await this.votersService.update(voterId, {
      segment: newSegment,
      metadata: {
        lastSentiment: sentiment,
        sentimentScore: score,
        keywords,
        analyzedAt: new Date(),
      },
    });

    return { received: true };
  }

  @Post('voter-enriched')
  async handleVoterEnrichment(
    @Headers('authorization') auth: string,
    @Body() payload: any,
  ) {
    if (!this.validateSecret(auth)) {
      throw new UnauthorizedException();
    }

    const { voterId, enrichedData } = payload;

    await this.votersService.update(voterId, {
      ...enrichedData,
      lastEnriched: new Date(),
    });

    return { received: true };
  }

  private determineSegment(sentiment: string, score: number): string {
    if (sentiment === 'positive' && score > 0.7) return 'apoiador';
    if (sentiment === 'negative' && score < -0.5) return 'oposicao';
    return 'neutro';
  }
}
```

---

## Advanced Workflows

### 1. RAG-Powered Response Bot

#### n8n Workflow: AI Response Generator

```json
{
  "name": "AI Response to Voter",
  "nodes": [
    {
      "name": "Webhook - Message Received",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "voter-message"
      }
    },
    {
      "name": "Get Campaign Context",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "={{ $env.API_URL }}/campaigns/{{ $json.campaignId }}",
        "authentication": "genericCredentialType",
        "method": "GET"
      }
    },
    {
      "name": "Vector Search - Similar Questions",
      "type": "n8n-nodes-base.postgres",
      "parameters": {
        "operation": "executeQuery",
        "query": "SELECT * FROM hybrid_search($1::vector(1536), $2, 5)",
        "queryParams": "={{ [$json.messageEmbedding, $json.messageText] }}"
      }
    },
    {
      "name": "OpenAI - Generate Response",
      "type": "n8n-nodes-base.openAi",
      "parameters": {
        "resource": "chat",
        "operation": "message",
        "model": "gpt-4",
        "messages": {
          "values": [
            {
              "role": "system",
              "content": "Você é assistente da campanha {{ $node['Get Campaign Context'].json.candidateName }}. Use o contexto fornecido para responder."
            },
            {
              "role": "user",
              "content": "Contexto: {{ $node['Vector Search'].json }}\n\nPergunta: {{ $json.messageText }}"
            }
          ]
        }
      }
    },
    {
      "name": "Send WhatsApp Response",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "https://api.whatsapp.com/send",
        "method": "POST"
      }
    },
    {
      "name": "Log Interaction",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "={{ $env.API_URL }}/webhooks/n8n/interaction-log",
        "method": "POST"
      }
    }
  ]
}
```

---

### 2. Scheduled Daily Reports

```typescript
// Backend: Endpoint para n8n chamar
@Get('campaigns/:id/analytics/daily-summary')
async getDailySummary(@Param('id') campaignId: string) {
  const today = new Date();
  
  const [voters, events, donations, canvass] = await Promise.all([
    this.votersService.countByDate(campaignId, today),
    this.eventsService.countByDate(campaignId, today),
    this.donationsService.sumByDate(campaignId, today),
    this.canvassingService.statsForDate(campaignId, today),
  ]);

  return {
    date: today,
    metrics: {
      newVoters: voters.count,
      totalVoters: voters.total,
      eventsHeld: events.count,
      donationsAmount: donations.sum,
      doorsKnocked: canvass.doors,
      contactsMade: canvass.contacts,
    },
  };
}
```

#### n8n: Daily Report Email

```json
{
  "name": "Daily Campaign Report",
  "nodes": [
    {
      "name": "Schedule - Every Day 8AM",
      "type": "n8n-nodes-base.cron",
      "parameters": {
        "triggerTimes": {
          "item": [
            {
              "hour": 8,
              "minute": 0
            }
          ]
        }
      }
    },
    {
      "name": "Get All Active Campaigns",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "={{ $env.API_URL }}/campaigns?status=ACTIVE"
      }
    },
    {
      "name": "Loop Campaigns",
      "type": "n8n-nodes-base.splitInBatches"
    },
    {
      "name": "Fetch Daily Summary",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "={{ $env.API_URL }}/campaigns/{{ $json.id }}/analytics/daily-summary"
      }
    },
    {
      "name": "Generate PDF Report",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "https://api.pdfmonkey.io/generate"
      }
    },
    {
      "name": "Send Email",
      "type": "n8n-nodes-base.emailSend",
      "parameters": {
        "fromEmail": "reports@campaign.com",
        "toEmail": "={{ $json.candidateEmail }}",
        "subject": "Relatório Diário - {{ $json.campaignName }}",
        "attachments": "={{ $node['Generate PDF'].json.url }}"
      }
    }
  ]
}
```

---

## Error Handling & Retries

### Backend: Retry Logic

```typescript
// modules/n8n/n8n.service.ts
async triggerWorkflowWithRetry(
  workflowName: string,
  payload: WebhookPayload,
  maxRetries = 3
) {
  let lastError: any;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await this.triggerWorkflow(workflowName, payload);
      
      if (result.success) {
        return result;
      }
      
      lastError = result.error;
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt}/${maxRetries} failed:`, error.message);
      
      if (attempt < maxRetries) {
        // Exponential backoff: 2s, 4s, 8s
        await this.sleep(Math.pow(2, attempt) * 1000);
      }
    }
  }

  throw new Error(`Failed after ${maxRetries} attempts: ${lastError}`);
}

private sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

---

## Monitoring n8n Executions

### Store Execution Logs in MongoDB

```typescript
// modules/n8n/n8n.service.ts
async logExecution(
  workflowName: string,
  payload: any,
  result: any,
  duration: number
) {
  await this.mongoDb.collection('n8n_executions').insertOne({
    workflowName,
    payload,
    result,
    duration,
    timestamp: new Date(),
    status: result.success ? 'success' : 'failed',
  });
}

// Uso
const startTime = Date.now();
const result = await this.triggerWorkflow('whatsapp-send', payload);
const duration = Date.now() - startTime;

await this.logExecution('whatsapp-send', payload, result, duration);
```

### Dashboard de Execuções

```typescript
@Get('n8n/executions')
async getExecutions(@Query() filters: any) {
  return this.mongoDb.collection('n8n_executions')
    .find({
      timestamp: {
        $gte: new Date(filters.startDate),
        $lte: new Date(filters.endDate),
      },
    })
    .sort({ timestamp: -1 })
    .limit(100)
    .toArray();
}
```

---

## Environment Variables

```bash
# .env
N8N_WEBHOOK_URL=http://localhost:5678
N8N_WEBHOOK_SECRET=super-secret-key-change-me
N8N_API_KEY=your-n8n-api-key
```

---

## Best Practices

1. **Autenticação**: Sempre validar webhook secret
2. **Idempotência**: Usar IDs únicos para evitar duplicação
3. **Rate Limiting**: Implementar delays em loops
4. **Error Handling**: Retry com exponential backoff
5. **Logging**: Registrar todas execuções para debugging
6. **Monitoring**: Alertas para workflows críticos falhando
7. **Versioning**: Manter histórico de workflows
8. **Testing**: Testar workflows com dados reais antes de produção

---

## Próximo: Development Guidelines

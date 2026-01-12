# Sistema de Exportação de Relatórios

Sistema completo para criar, salvar e exportar relatórios personalizados de eleitores com filtros avançados, ordenação multi-nível e exportação em múltiplos formatos.

## 🎯 Funcionalidades

### ✅ Implementado

- **Filtros Avançados**
  - Filtros por todos os 60+ campos de eleitores
  - 15 operadores diferentes (igual, contém, maior que, entre, etc.)
  - Lógica AND/OR entre filtros
  - Suporte a valores complexos (datas, números, enums, arrays)
  
- **Seleção de Colunas**
  - Seletor organizado por categorias
  - Seleção/deseleção em massa por categoria
  - Contador visual de colunas selecionadas
  
- **Ordenação Multi-nível**
  - Ordenação por múltiplos campos
  - Direção crescente/decrescente
  - Reordenação de prioridades (arrastar)
  
- **Preview Interativo**
  - Tabela paginada com dados filtrados
  - Visualização em tempo real
  - Contador de registros encontrados
  
- **Templates Salvos**
  - Salvar configurações de relatórios com nome e descrição
  - Lista de relatórios salvos com estatísticas de uso
  - Edição de relatórios existentes
  - Duplicação de templates
  
- **Exportação**
  - Botões para PDF, CSV e Excel
  - Simulação de exportação com loading state
  - Toast notifications de sucesso/erro

### 🚧 Próximos Passos (Backend)

- [ ] API endpoint para gerar PDF com puppeteer ou @pdfme/generator
- [ ] API endpoint para gerar CSV/Excel
- [ ] Persistência de relatórios salvos no banco de dados
- [ ] Sistema de filas para exportações grandes (Bull/BullMQ)
- [ ] Cache de relatórios frequentes (Redis)
- [ ] Gráficos nos PDFs (Chart.js)

## 📁 Estrutura de Arquivos

```
types/
└── reports.ts                    # Interfaces e metadata de campos

mock-data/
└── reports.ts                    # 7 relatórios salvos de exemplo

components/features/reports/
├── filter-row.tsx               # Linha de filtro individual
├── column-selector.tsx          # Seletor de colunas por categoria
├── sort-configurator.tsx        # Configurador de ordenação
├── report-preview.tsx           # Preview com tabela e exportação
├── reports-builder.tsx          # Builder principal com tabs
└── saved-reports-list.tsx       # Lista de relatórios salvos

store/
└── reports-store.ts             # Zustand store para gerenciar relatórios

app/(dashboard)/reports/
├── page.tsx                     # Lista de relatórios + estatísticas
├── builder/page.tsx             # Página do builder
├── [id]/page.tsx               # Visualizar relatório salvo
└── [id]/edit/page.tsx          # Editar relatório salvo
```

## 🎨 Componentes

### FilterRow
Linha individual de filtro com:
- Seleção de campo (todos os campos de Voter)
- Operadores dinâmicos baseados no tipo do campo
- Input de valor adaptativo (string, número, data, enum, boolean)
- Operador lógico AND/OR
- Botão remover

### ColumnSelector
Accordion organizado por categorias:
- Informações Básicas
- Contato
- Endereço
- Eleitorais
- Sociais
- Políticas
- Engajamento
- Demografia
- Comunicação
- Redes Sociais
- Adicionais

Cada categoria com:
- Checkbox por campo
- Botões "Todos" / "Nenhum"
- Contador de selecionados

### SortConfigurator
Lista de ordenações com:
- Campo + direção (asc/desc)
- Botões para mover para cima/baixo
- Toggle de direção
- Badge de prioridade
- Explicação da ordem de aplicação

### ReportPreview
Tabela com:
- Aplicação de filtros (client-side)
- Aplicação de ordenação (client-side)
- Paginação (50 itens por página)
- Botões de exportação PDF/CSV/Excel
- Loading state durante exportação
- Formatação de valores (datas, booleans, arrays)

### ReportsBuilder
Interface de tabs com:
1. **Filtros** - Adicionar/remover filtros
2. **Colunas** - Selecionar campos
3. **Ordenação** - Configurar sorting
4. **Preview** - Ver resultado e exportar

Botões globais:
- Cancelar
- Salvar Template (dialog com nome/descrição)

## 🗄️ Mock Data

### Relatórios Salvos (7 exemplos)

1. **Eleitores Engajados de São Paulo**
   - Filtros: cidade = SP, engagementScore > 70, supportLevel in [Favorável, Muito Favorável]
   - 45 usos

2. **Voluntários Ativos**
   - Filtros: volunteerStatus = Ativo
   - 23 usos

3. **Eleitores Jovens (18-35)**
   - Filtros: ageGroup in [18-24, 25-34]
   - 12 usos

4. **Alta Influência nas Redes**
   - Filtros: influencerScore > 80, socialMediaFollowers > 1000
   - 34 usos

5. **Sem Contato Recente**
   - Filtros: lastContactDate < 90 dias atrás
   - 8 usos

6. **Eleitores com Email Válido**
   - Filtros: email isNotEmpty, supportLevel in [Favorável, Muito Favorável, Neutro]
   - 67 usos (mais usado)

7. **Referenciadores Top**
   - Filtros: referredVoters > 5
   - 19 usos

## 🔧 Tipos e Interfaces

### ReportFilter
```typescript
{
  id: string;
  field: keyof Voter;
  operator: FilterOperator;
  value: any;
  logicalOperator?: "AND" | "OR";
}
```

### FilterOperator
15 operadores disponíveis:
- equals, notEquals
- contains, notContains
- startsWith, endsWith
- greaterThan, lessThan, greaterThanOrEqual, lessThanOrEqual
- between, in, notIn
- isEmpty, isNotEmpty

### FieldMetadata
```typescript
{
  key: keyof Voter;
  label: string;
  type: "string" | "number" | "date" | "enum" | "boolean";
  category: string;
  enumValues?: string[];
  operators: FilterOperator[];
}
```

## 📊 Metadata de Campos

Total de 60+ campos de Voter mapeados com:
- Label em português
- Tipo de dado
- Categoria
- Operadores permitidos
- Valores de enum (quando aplicável)

Categorias:
- `basic` - Informações Básicas (nome, CPF, gênero, data nascimento)
- `contact` - Contato (telefone, WhatsApp, email)
- `address` - Endereço (rua, bairro, cidade, estado, CEP, lat/lng)
- `electoral` - Eleitorais (título, zona, seção, local votação)
- `social` - Segmentação Social (escolaridade, ocupação, renda, estado civil, religião, etnia)
- `political` - Políticas (nível apoio, partido, influência, persuasibilidade)
- `engagement` - Engajamento (datas contato, frequência, eventos, voluntário, score)
- `demographics` - Demografia (faixa etária, tipo domicílio, emprego, veículo, internet)
- `communication` - Comunicação (estilo, preferências, melhor horário)
- `social_network` - Redes Sociais (Facebook, Instagram, Twitter, seguidores)
- `additional` - Adicionais (família, tags, notas)

## 🚀 Como Usar

### 1. Acessar Lista de Relatórios
```
/reports
```
Veja todos os relatórios salvos, estatísticas de uso e acesse rapidamente.

### 2. Criar Novo Relatório
```
/reports/builder
```

**Passo 1: Filtros**
- Clique "Adicionar Filtro"
- Selecione campo, operador e valor
- Adicione múltiplos filtros com AND/OR

**Passo 2: Colunas**
- Expanda categorias
- Marque campos desejados
- Use "Todos" para categoria completa

**Passo 3: Ordenação**
- Adicione níveis de ordenação
- Escolha campo e direção
- Reordene prioridades

**Passo 4: Preview**
- Veja dados filtrados/ordenados
- Exporte em PDF/CSV/Excel
- Ou salve como template

### 3. Salvar Template
- Clique "Salvar Template"
- Digite nome e descrição
- Template aparece na lista

### 4. Editar Template
```
/reports/[id]/edit
```
Abre o builder com configurações pré-preenchidas.

### 5. Visualizar Template
```
/reports/[id]
```
Vê configuração completa e preview dos dados.

## 🎯 Exemplos de Filtros

### Exemplo 1: Eleitores de SP com Alto Engajamento
```typescript
[
  { field: "city", operator: "equals", value: "São Paulo", logicalOperator: "AND" },
  { field: "engagementScore", operator: "greaterThan", value: 70 }
]
```

### Exemplo 2: Jovens Favoráveis OU Neutros
```typescript
[
  { field: "ageGroup", operator: "in", value: ["18-24", "25-34"], logicalOperator: "AND" },
  { field: "supportLevel", operator: "in", value: ["Favorável", "Neutro"] }
]
```

### Exemplo 3: Sem Contato nos Últimos 90 Dias
```typescript
[
  { field: "lastContactDate", operator: "lessThan", value: new Date("2025-10-13") }
]
```

### Exemplo 4: Influenciadores com Redes Sociais Ativas
```typescript
[
  { field: "influencerScore", operator: "greaterThan", value: 75, logicalOperator: "AND" },
  { field: "instagram", operator: "isNotEmpty", value: null, logicalOperator: "OR" },
  { field: "facebook", operator: "isNotEmpty", value: null }
]
```

## 📈 Estatísticas da Página

A página `/reports` mostra:
- Total de relatórios (públicos/privados)
- Relatório mais usado (nome + count)
- Relatórios usados hoje

## 🎨 UI/UX Features

- **Responsivo** - Funciona em desktop e mobile
- **Toast Notifications** - Feedback imediato de ações
- **Loading States** - Spinners durante exportação
- **Empty States** - Mensagens quando sem dados
- **Badges** - Contadores visuais (filtros, colunas, uso)
- **Dropdown Menus** - Ações rápidas (ver, editar, duplicar, excluir)
- **Tabs** - Organização clara do builder
- **Accordion** - Categorias colapsáveis no column selector
- **Cards** - Layout organizado na lista de relatórios

## 🔐 Segurança (Futuras)

Quando integrado com backend:
- Rate limiting (max 10 exports/minuto)
- File size limit (max 10MB)
- Timeout (max 30s para gerar)
- RBAC (quem pode criar/editar/deletar relatórios públicos)

## 📊 Performance (Futuras)

Para produção com backend:
- Queue system para exports grandes (>5000 registros)
- Cache de relatórios frequentes (Redis)
- Pagination server-side
- Streaming de grandes arquivos

## 🧪 Testes

Para testar localmente:
1. Navegue para `/reports`
2. Clique em qualquer relatório salvo para ver preview
3. Clique "Novo Relatório" para abrir builder
4. Adicione filtros, selecione colunas, configure ordenação
5. Vá para tab "Preview" para ver resultado
6. Clique "Exportar PDF" (simulação - console.log)
7. Clique "Salvar Template" para salvar configuração

## 🎁 Features Extras para Futuro

- [ ] Agendamento de relatórios (envio automático por email)
- [ ] Compartilhamento de relatórios públicos
- [ ] Histórico de exports (quem, quando, formato)
- [ ] Templates pré-configurados (biblioteca de relatórios comuns)
- [ ] Gráficos nos PDFs (pie charts, bar charts)
- [ ] Exportação com agrupamento (GROUP BY)
- [ ] Filtros salvos (favoritar filtro específico)
- [ ] Comparação de relatórios (A vs B)
- [ ] Notificações quando relatório é usado por outros

---

**Status**: ✅ Sistema completo implementado no frontend com mock data
**Build**: ✅ Passing (13 rotas incluindo /reports/*)
**Próximo Passo**: Integração com backend para exportação real em PDF

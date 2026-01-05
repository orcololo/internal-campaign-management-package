# Autenticação e Autorização - Keycloak

## Arquitetura de Auth

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Next.js   │  OAuth  │   Keycloak   │   JWT   │   NestJS    │
│   (Client)  │ ◄─────► │   (IdP)      │ ◄─────► │   (API)     │
└─────────────┘         └──────────────┘         └─────────────┘
       │                        │                        │
       │                        │                        │
       └────────────────────────┴────────────────────────┘
                         Access Token (JWT)
```

---

## Keycloak: Configuração

### Realm Setup

```json
{
  "realm": "campaign-platform",
  "enabled": true,
  "sslRequired": "external",
  "registrationAllowed": false,
  "resetPasswordAllowed": true,
  "rememberMe": true,
  "loginTheme": "campaign-custom",
  
  "accessTokenLifespan": 300,        // 5 min
  "accessTokenLifespanForImplicitFlow": 900,
  "ssoSessionIdleTimeout": 1800,     // 30 min
  "ssoSessionMaxLifespan": 36000,    // 10h
  "offlineSessionIdleTimeout": 2592000  // 30 dias
}
```

### Clients

#### 1. Frontend Client (Public)

```json
{
  "clientId": "campaign-web",
  "name": "Campaign Management Web App",
  "enabled": true,
  "publicClient": true,
  "protocol": "openid-connect",
  "standardFlowEnabled": true,
  "implicitFlowEnabled": false,
  "directAccessGrantsEnabled": false,
  
  "redirectUris": [
    "http://localhost:3001/*",
    "https://app.campaign.com/*"
  ],
  "webOrigins": [
    "http://localhost:3001",
    "https://app.campaign.com"
  ],
  
  "attributes": {
    "pkce.code.challenge.method": "S256"
  }
}
```

#### 2. Backend Client (Confidential)

```json
{
  "clientId": "campaign-api",
  "name": "Campaign API Backend",
  "enabled": true,
  "publicClient": false,
  "protocol": "openid-connect",
  "serviceAccountsEnabled": true,
  "authorizationServicesEnabled": true,
  
  "secret": "your-client-secret-here",
  
  "redirectUris": ["*"],
  
  "attributes": {
    "access.token.lifespan": "300"
  }
}
```

---

## Roles e Permissões

### Realm Roles

```json
{
  "roles": {
    "realm": [
      {
        "name": "candidato",
        "description": "Acesso total à campanha"
      },
      {
        "name": "estrategista",
        "description": "Analytics e planejamento"
      },
      {
        "name": "lideranca",
        "description": "Coordenação regional"
      },
      {
        "name": "escritorio",
        "description": "Operações básicas"
      }
    ]
  }
}
```

### Composite Roles (Hierarquia)

```javascript
// candidato herda tudo
candidato -> [estrategista, lideranca, escritorio]

// estrategista herda lideranca e escritorio
estrategista -> [lideranca, escritorio]

// lideranca herda escritorio
lideranca -> [escritorio]
```

### Client Scopes (Permissões Granulares)

```json
{
  "clientScopes": [
    {
      "name": "voters:read",
      "protocol": "openid-connect",
      "attributes": {
        "include.in.token.scope": "true"
      }
    },
    {
      "name": "voters:write",
      "protocol": "openid-connect"
    },
    {
      "name": "events:read",
      "protocol": "openid-connect"
    },
    {
      "name": "events:write",
      "protocol": "openid-connect"
    },
    {
      "name": "donations:read",
      "protocol": "openid-connect"
    },
    {
      "name": "analytics:read",
      "protocol": "openid-connect"
    }
  ]
}
```

---

## JWT Structure

### Decoded Access Token

```json
{
  "exp": 1735840000,
  "iat": 1735839700,
  "jti": "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
  "iss": "http://localhost:8080/realms/campaign-platform",
  "aud": "campaign-api",
  "sub": "f7b3c8a1-2d4e-4f6g-8h9i-0j1k2l3m4n5o",
  "typ": "Bearer",
  "azp": "campaign-web",
  
  "email": "joao@campaign.com",
  "email_verified": true,
  "name": "João Silva",
  "preferred_username": "joao.silva",
  
  "realm_access": {
    "roles": ["candidato", "estrategista"]
  },
  
  "scope": "openid profile email voters:read voters:write events:read events:write",
  
  "campaign_id": "abc123",  // Custom claim
  "campaign_role": "candidato"
}
```

---

## Backend Integration (NestJS)

### Keycloak Module Setup

```typescript
// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { KeycloakConnectModule, ResourceGuard, RoleGuard, AuthGuard } from 'nest-keycloak-connect';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    KeycloakConnectModule.register({
      authServerUrl: process.env.KEYCLOAK_URL,
      realm: process.env.KEYCLOAK_REALM,
      clientId: process.env.KEYCLOAK_CLIENT_ID,
      secret: process.env.KEYCLOAK_CLIENT_SECRET,
      
      // Offline token validation (mais rápido, sem chamada a cada request)
      tokenValidation: TokenValidation.OFFLINE,
      
      // Política de enforcement
      policyEnforcement: PolicyEnforcementMode.PERMISSIVE,
      
      // Cookies configuration
      cookieKey: 'KEYCLOAK_JWT',
      
      // Logging
      logLevels: ['verbose'],
    }),
  ],
  providers: [
    // Guards globais
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ResourceGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
  exports: [KeycloakConnectModule],
})
export class AuthModule {}
```

### Decorators para Controle de Acesso

```typescript
// src/common/decorators/auth.decorator.ts
import { applyDecorators } from '@nestjs/common';
import { Roles, Scopes, Resource, Public } from 'nest-keycloak-connect';

// Público (sem autenticação)
export const IsPublic = () => Public();

// Requer autenticação apenas
export const RequireAuth = () => applyDecorators();

// Requer role específica
export const RequireRole = (...roles: string[]) => Roles(...roles);

// Requer scope específica
export const RequireScope = (...scopes: string[]) => Scopes(...scopes);

// Combinado: role + scope
export const RequirePermission = (role: string, scope: string) =>
  applyDecorators(
    Roles(role),
    Scopes(scope)
  );
```

### Usage em Controllers

```typescript
// src/modules/voters/voters.controller.ts
import { Controller, Get, Post, Patch, Delete } from '@nestjs/common';
import { RequireScope } from '@/common/decorators/auth.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@Controller('campaigns/:campaignId/voters')
export class VotersController {
  
  // Qualquer usuário autenticado pode ler
  @Get()
  @RequireScope('voters:read')
  findAll(@CurrentUser() user: any) {
    return this.votersService.findAll(user.campaignId);
  }
  
  // Apenas quem tem scope de escrita
  @Post()
  @RequireScope('voters:write')
  create(@Body() dto: CreateVoterDto) {
    return this.votersService.create(dto);
  }
  
  // Apenas candidato ou estrategista
  @Delete(':id')
  @RequireRole('candidato', 'estrategista')
  remove(@Param('id') id: string) {
    return this.votersService.remove(+id);
  }
}
```

### Extrair Dados do JWT

```typescript
// src/common/decorators/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    
    // nest-keycloak-connect já injeta user no request
    return {
      id: request.user.sub,
      email: request.user.email,
      name: request.user.name,
      roles: request.user.realm_access?.roles || [],
      scopes: request.user.scope?.split(' ') || [],
      campaignId: request.user.campaign_id,
    };
  },
);
```

---

## Frontend Integration (Next.js)

### NextAuth com Keycloak

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';
import { JWT } from 'next-auth/jwt';

// Refresh access token
async function refreshAccessToken(token: JWT) {
  try {
    const response = await fetch(
      `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: process.env.KEYCLOAK_CLIENT_ID!,
          client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
          grant_type: 'refresh_token',
          refresh_token: token.refreshToken as string,
        }),
      }
    );

    const refreshedTokens = await response.json();

    if (!response.ok) throw refreshedTokens;

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
      issuer: `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}`,
      
      authorization: {
        params: {
          scope: 'openid profile email voters:read voters:write events:read events:write',
        },
      },
    }),
  ],
  
  callbacks: {
    async jwt({ token, account, user }) {
      // Primeiro login
      if (account && user) {
        return {
          accessToken: account.access_token,
          accessTokenExpires: account.expires_at! * 1000,
          refreshToken: account.refresh_token,
          user,
        };
      }

      // Token ainda válido
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      // Refresh token
      return refreshAccessToken(token);
    },
    
    async session({ session, token }) {
      session.user = token.user as any;
      session.accessToken = token.accessToken as string;
      session.error = token.error as string | undefined;
      
      return session;
    },
  },
  
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  
  session: {
    strategy: 'jwt',
    maxAge: 10 * 60 * 60, // 10h
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

### Session Provider

```typescript
// app/providers.tsx
'use client';

import { SessionProvider } from 'next-auth/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}

// app/layout.tsx
import { Providers } from './providers';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### Protected Route Component

```typescript
// components/auth/protected-route.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/login');
      return;
    }

    if (requiredRole && !session.user.roles?.includes(requiredRole)) {
      router.push('/unauthorized');
    }
  }, [session, status, requiredRole, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return <>{children}</>;
}
```

### useAuth Hook

```typescript
// lib/hooks/use-auth.ts
'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

export function useAuth() {
  const { data: session, status } = useSession();

  return {
    user: session?.user,
    isLoading: status === 'loading',
    isAuthenticated: !!session,
    
    hasRole: (role: string) => {
      return session?.user?.roles?.includes(role) ?? false;
    },
    
    hasScope: (scope: string) => {
      return session?.user?.scopes?.includes(scope) ?? false;
    },
    
    login: () => signIn('keycloak'),
    logout: () => signOut({ callbackUrl: '/' }),
  };
}

// Uso
function MyComponent() {
  const { user, hasRole, hasScope } = useAuth();

  if (hasRole('candidato')) {
    return <AdminPanel />;
  }

  if (hasScope('voters:write')) {
    return <VoterForm />;
  }

  return <ReadOnlyView />;
}
```

---

## Multi-Campaign Context

### Campaign Switcher

```typescript
// components/campaign-switcher.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api/client';

export function CampaignSwitcher() {
  const [campaigns, setCampaigns] = useState([]);
  const [current, setCurrent] = useState(null);
  const router = useRouter();

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    const { data } = await api.campaigns.list();
    setCampaigns(data);
    setCurrent(data[0]); // Default primeira campanha
  };

  const switchCampaign = (campaignId: string) => {
    // Trocar contexto
    localStorage.setItem('current_campaign', campaignId);
    setCurrent(campaigns.find(c => c.id === campaignId));
    
    // Refresh page para carregar dados da nova campanha
    router.refresh();
  };

  return (
    <select
      value={current?.id}
      onChange={(e) => switchCampaign(e.target.value)}
      className="border rounded p-2"
    >
      {campaigns.map((campaign) => (
        <option key={campaign.id} value={campaign.id}>
          {campaign.name}
        </option>
      ))}
    </select>
  );
}
```

---

## RBAC Matrix (Referência Rápida)

| Recurso | Candidato | Estrategista | Liderança | Escritório |
|---------|-----------|--------------|-----------|------------|
| **Voters** |
| - Listar | ✅ | ✅ | ✅ | ✅ |
| - Criar | ✅ | ✅ | ✅ | ✅ |
| - Editar | ✅ | ✅ | ✅ (região) | ❌ |
| - Deletar | ✅ | ✅ | ❌ | ❌ |
| - Exportar | ✅ | ✅ | ✅ | ❌ |
| **Events** |
| - Listar | ✅ | ✅ | ✅ | ✅ |
| - Criar | ✅ | ✅ | ✅ | ✅ |
| - Editar | ✅ | ✅ | ✅ (próprios) | ❌ |
| - Deletar | ✅ | ✅ | ❌ | ❌ |
| **Donations** |
| - Listar | ✅ | ✅ | ❌ | ❌ |
| - Criar | ✅ | ✅ | ❌ | ❌ |
| - Editar | ✅ | ❌ | ❌ | ❌ |
| **Analytics** |
| - Dashboards | ✅ | ✅ | ✅ (região) | ❌ |
| - Exportar | ✅ | ✅ | ❌ | ❌ |
| **Users** |
| - Listar | ✅ | ✅ | ❌ | ❌ |
| - Convidar | ✅ | ✅ | ❌ | ❌ |
| - Remover | ✅ | ❌ | ❌ | ❌ |

---

## Security Best Practices

1. **Sempre validar JWT no backend** - nunca confiar apenas no frontend
2. **Token rotation** - refresh tokens com rotação automática
3. **Scopes granulares** - preferir scopes sobre roles quando possível
4. **HTTPS obrigatório** - em produção
5. **CORS restrito** - whitelist de domínios
6. **Rate limiting** - por IP e por usuário
7. **Audit logs** - registrar todas ações sensíveis
8. **Token revocation** - implementar logout em todos devices

---

## Próximo: Integração n8n

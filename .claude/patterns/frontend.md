# Frontend Patterns (Next.js 14 App Router)

## Page Structure

```
app/(auth)/voters/
├── page.tsx              # List (Server Component)
├── [id]/page.tsx         # Detail (Server Component)
└── new/page.tsx          # Create (Server Component)

components/features/voters/
├── voters-table.tsx      # Client Component
├── voter-form.tsx        # Client Component
└── voters-filters.tsx    # Client Component
```

## 1. List Page (Server Component)

```typescript
// app/(auth)/voters/page.tsx
import { VotersTable } from '@/components/features/voters/voters-table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

async function getVoters(searchParams: any) {
  const params = new URLSearchParams(searchParams);
  const res = await fetch(
    `${process.env.API_URL}/campaigns/current/voters?${params}`,
    {
      cache: 'no-store',
      headers: { 'Authorization': `Bearer ${getToken()}` }
    }
  );
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export default async function VotersPage({ searchParams }: any) {
  const { data, meta } = await getVoters(searchParams);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Eleitores</h1>
        <Link href="/voters/new">
          <Button>+ Novo Eleitor</Button>
        </Link>
      </div>
      <VotersTable data={data} pagination={meta} />
    </div>
  );
}
```

## 2. Table Component (Client)

```typescript
// components/features/voters/voters-table.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

interface Voter {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
}

interface Props {
  data: Voter[];
  pagination: { page: number; perPage: number; total: number };
}

export function VotersTable({ data, pagination }: Props) {
  const router = useRouter();

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Telefone</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((voter) => (
            <TableRow
              key={voter.id}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => router.push(`/voters/${voter.id}`)}
            >
              <TableCell>{voter.name}</TableCell>
              <TableCell>{voter.email || '-'}</TableCell>
              <TableCell>{voter.phone || '-'}</TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/voters/${voter.id}/edit`);
                  }}
                >
                  Editar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination component here */}
    </div>
  );
}
```

## 3. Form Component (Client)

```typescript
// components/features/voters/voter-form.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api/client';
import { toast } from 'sonner';

const schema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  voter?: FormData & { id: number };
  campaignId: string;
}

export function VoterForm({ voter, campaignId }: Props) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: voter,
  });

  const onSubmit = async (data: FormData) => {
    try {
      if (voter?.id) {
        await api.voters.update(campaignId, voter.id, data);
        toast.success('Eleitor atualizado');
      } else {
        await api.voters.create(campaignId, data);
        toast.success('Eleitor criado');
      }
      router.push('/voters');
      router.refresh();
    } catch (error) {
      toast.error('Erro ao salvar');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
      <div>
        <Label htmlFor="name">Nome *</Label>
        <Input id="name" {...register('name')} />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register('email')} />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      <div>
        <Label htmlFor="phone">Telefone</Label>
        <Input id="phone" {...register('phone')} />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : voter?.id ? 'Atualizar' : 'Criar'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
```

## 4. API Client

```typescript
// lib/api/voters.ts
import { apiClient } from './client';

export const votersApi = {
  list: (campaignId: string, params?: any) =>
    apiClient.get(`/campaigns/${campaignId}/voters`, { params }),

  get: (campaignId: string, id: number) =>
    apiClient.get(`/campaigns/${campaignId}/voters/${id}`),

  create: (campaignId: string, data: any) =>
    apiClient.post(`/campaigns/${campaignId}/voters`, data),

  update: (campaignId: string, id: number, data: any) =>
    apiClient.patch(`/campaigns/${campaignId}/voters/${id}`, data),

  delete: (campaignId: string, id: number) =>
    apiClient.delete(`/campaigns/${campaignId}/voters/${id}`),
};
```

## Key Points

- **Server Components**: Default for pages, fetch data on server
- **Client Components**: Use `'use client'` for interactivity
- **Forms**: `react-hook-form` + `zod` validation
- **API Calls**: Centralized in `lib/api/`
- **Routing**: `useRouter()` for navigation, `router.refresh()` for revalidation
- **Toasts**: `toast.success()` / `toast.error()` from `sonner`
- **Loading States**: `isSubmitting` from form state
- **Validation**: Backend validation (DTOs) + Frontend validation (zod)

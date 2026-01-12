import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { votersApi } from "@/lib/api/voters";
import { ReferralsStats } from "@/components/features/voters/referrals-stats";
import { ReferralLinkGenerator } from "@/components/features/voters/referral-link-generator";
import { ReferralsList } from "@/components/features/voters/referrals-list";

interface VoterReferralsPageProps {
  params: Promise<{ id: string }>;
}

async function getVoter(id: string) {
  try {
    const response = await votersApi.getById(id);
    return response.data;
  } catch {
    return null;
  }
}

async function getReferrals(voterId: string) {
  try {
    const response = await votersApi.getReferrals(voterId);
    return response.data?.data || [];
  } catch {
    return [];
  }
}

export default async function VoterReferralsPage({
  params,
}: VoterReferralsPageProps) {
  const { id } = await params;
  const voter = await getVoter(id);

  if (!voter) {
    notFound();
  }

  const referrals = await getReferrals(voter.id);
  const initials = voter.name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link href={`/voters/${voter.id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>

        <div className="flex-1">
          <div className="flex items-center gap-4 mb-2">
            <Avatar className="size-16">
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Referenciados de {voter.name}
              </h1>
              <p className="text-muted-foreground">
                Gerencie e acompanhe os eleitores indicados
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {voter.referralStats && <ReferralsStats stats={voter.referralStats} />}

      {/* Link Generator */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ReferralLinkGenerator
            referralCode={voter.referralCode || ''}
            voterName={voter.name}
          />
        </div>

        {/* Quick Stats Card */}
        {voter.referralStats && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Desempenho</CardTitle>
              <CardDescription>Resumo de indicações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Taxa de Conversão
                </span>
                <span className="text-lg font-bold">
                  {voter.referralStats.total > 0
                    ? Math.round(
                        (voter.referralStats.active / voter.referralStats.total) *
                          100
                      )
                    : 0}
                  %
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Média Mensal
                </span>
                <span className="text-lg font-bold">
                  {Math.round(voter.referralStats.total / 6)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Melhor Mês</span>
                <span className="text-lg font-bold">
                  {Math.max(
                    voter.referralStats.thisMonth,
                    Math.round(voter.referralStats.total / 6)
                  )}
                </span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Referrals List */}
      <ReferralsList referrals={referrals} />

      {/* Empty State or Additional Info */}
      {referrals.length === 0 && (
        <Card className="bg-muted/50">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <UserPlus className="size-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Comece a Indicar!</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              Compartilhe o link de referência acima para começar a construir
              sua rede de apoiadores. Cada pessoa que se cadastrar através do
              seu link será contabilizada aqui.
            </p>
            <div className="flex gap-4">
              <Button variant="outline" asChild>
                <Link href="/voters">Ver Todos os Eleitores</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Referral Network Tree (Future Enhancement) */}
      {referrals.length > 0 &&
        referrals.some((r) => r.referralStats && r.referralStats.total > 0) && (
          <Card>
            <CardHeader>
              <CardTitle>Rede de Referenciamento</CardTitle>
              <CardDescription>
                Visualização da árvore de indicações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border-2 border-dashed border-muted p-8 text-center">
                <p className="text-muted-foreground">
                  Visualização de árvore de referenciamento em desenvolvimento
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {referrals.filter((r) => r.referralStats && r.referralStats.total > 0).length}{" "}
                  referenciados já estão indicando outras pessoas
                </p>
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  );
}

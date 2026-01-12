"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Eye, UserPlus, Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Voter, SupportLevel } from "@/types/voters";
import { SupportLevelBadge } from "./voter-badges";

interface ReferralsListProps {
  referrals: Voter[];
}

const SUPPORT_LEVEL_LABELS: Record<SupportLevel, string> = {
  MUITO_FAVORAVEL: "Muito Favorável",
  FAVORAVEL: "Favorável",
  NEUTRO: "Neutro",
  DESFAVORAVEL: "Desfavorável",
  MUITO_DESFAVORAVEL: "Muito Desfavorável",
  NAO_DEFINIDO: "Não Definido",
};

export function ReferralsList({ referrals }: ReferralsListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [supportLevelFilter, setSupportLevelFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "name">("date");

  const filteredReferrals = useMemo(() => {
    let filtered = [...referrals];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (voter) =>
          voter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          voter.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Support level filter
    if (supportLevelFilter !== "all") {
      filtered = filtered.filter(
        (voter) => voter.supportLevel === supportLevelFilter
      );
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === "date") {
        return (
          new Date(b.referralDate || b.createdAt).getTime() -
          new Date(a.referralDate || a.createdAt).getTime()
        );
      }
      return a.name.localeCompare(b.name);
    });

    return filtered;
  }, [referrals, searchQuery, supportLevelFilter, sortBy]);

  if (referrals.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <UserPlus className="size-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Nenhum Referenciado Ainda
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Compartilhe o link de referência para começar a indicar novos
            eleitores
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Referenciados ({filteredReferrals.length})</CardTitle>
            <CardDescription>Lista de eleitores indicados</CardDescription>
          </div>
          <div className="flex gap-2">
            <Select
              value={sortBy}
              onValueChange={(value: any) => setSortBy(value)}
            >
              <SelectTrigger className="w-35">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Mais Recentes</SelectItem>
                <SelectItem value="name">Nome (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select
            value={supportLevelFilter}
            onValueChange={setSupportLevelFilter}
          >
            <SelectTrigger className="w-full sm:w-50">
              <SelectValue placeholder="Nível de Apoio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Níveis</SelectItem>
              <SelectItem value="MUITO_FAVORAVEL">Muito Favorável</SelectItem>
              <SelectItem value="FAVORAVEL">Favorável</SelectItem>
              <SelectItem value="NEUTRO">Neutro</SelectItem>
              <SelectItem value="DESFAVORAVEL">Desfavorável</SelectItem>
              <SelectItem value="MUITO_DESFAVORAVEL">
                Muito Desfavorável
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Data de Cadastro</TableHead>
                <TableHead>Nível de Apoio</TableHead>
                <TableHead className="text-center">
                  Seus Referenciados
                </TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReferrals.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Nenhum resultado encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredReferrals.map((voter) => (
                  <TableRow key={voter.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{voter.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {voter.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {voter.referralDate &&
                        format(new Date(voter.referralDate), "dd/MM/yyyy", {
                          locale: ptBR,
                        })}
                    </TableCell>
                    <TableCell>
                      {voter.supportLevel ? (
                        <SupportLevelBadge level={voter.supportLevel} />
                      ) : (
                        <Badge variant="secondary">Não Definido</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">
                        {voter.referralStats.total}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/voters/${voter.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="size-4 mr-2" />
                          Ver Detalhes
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ChevronLeft,
  Edit,
  Trash2,
  MapPin,
  Mail,
  Phone,
  Calendar,
  User,
  Home,
  FileText,
  Users,
  X,
  Check,
  Briefcase,
  Heart,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { SupportLevelBadge, WhatsAppBadge } from "./voter-badges";
import { Voter } from "@/types/voters";
import { votersApi } from "@/lib/api/endpoints/voters";
import {
  educationLevelEnum,
  incomeLevelEnum,
  maritalStatusEnum,
  supportLevelEnum,
  preferredContactEnum,
} from "@/lib/validators/voters";

interface VoterDetailProps {
  voter: Voter;
}

// Schema for non-obligatory fields only
const nonObligatoryFieldsSchema = z.object({
  whatsapp: z.string().optional(),
  hasWhatsapp: z.boolean().optional(),
  preferredContact: preferredContactEnum.optional(),
  electoralTitle: z.string().optional(),
  electoralZone: z.string().optional(),
  electoralSection: z.string().optional(),
  votingLocation: z.string().optional(),
  educationLevel: educationLevelEnum.optional(),
  occupation: z.string().optional(),
  incomeLevel: incomeLevelEnum.optional(),
  maritalStatus: maritalStatusEnum.optional(),
  religion: z.string().optional(),
  ethnicity: z.string().optional(),
  familyMembers: z.number().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  supportLevel: supportLevelEnum.optional(),
  politicalParty: z.string().optional(),
  votingHistory: z.string().optional(),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

type NonObligatoryFields = z.infer<typeof nonObligatoryFieldsSchema>;

const availableTags = [
  "Líder Comunitário",
  "Jovem",
  "Idoso",
  "Empresário",
  "Professor",
  "Estudante",
  "Trabalhador Rural",
  "Comerciante",
  "Profissional da Saúde",
  "Servidor Público",
];

export function VoterDetail({ voter }: VoterDetailProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<NonObligatoryFields>({
    resolver: zodResolver(nonObligatoryFieldsSchema),
    defaultValues: {
      whatsapp: voter.whatsapp || "",
      hasWhatsapp: voter.hasWhatsapp || false,
      preferredContact: voter.preferredContact,
      electoralTitle: voter.electoralTitle || "",
      electoralZone: voter.electoralZone || "",
      electoralSection: voter.electoralSection || "",
      votingLocation: voter.votingLocation || "",
      educationLevel: voter.educationLevel,
      occupation: voter.occupation || "",
      incomeLevel: voter.incomeLevel,
      maritalStatus: voter.maritalStatus,
      religion: voter.religion || "",
      ethnicity: voter.ethnicity || "",
      familyMembers: voter.familyMembers,
      facebook: voter.facebook || "",
      instagram: voter.instagram || "",
      twitter: voter.twitter || "",
      supportLevel: voter.supportLevel,
      politicalParty: voter.politicalParty || "",
      votingHistory: voter.votingHistory || "",
      tags: voter.tags || [],
      notes: voter.notes || "",
    },
  });

  const initials = voter.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleSave = async (data: NonObligatoryFields) => {
    setIsSubmitting(true);
    try {
      await votersApi.update(voter.id, data);
      toast.success("Informações atualizadas com sucesso!");
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      toast.error("Erro ao atualizar informações. Tente novamente.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    try {
      return format(new Date(dateString), "dd/MM/yyyy");
    } catch {
      return dateString;
    }
  };

  const formatGender = (gender?: string) => {
    const genderMap: Record<string, string> = {
      MASCULINO: "Masculino",
      FEMININO: "Feminino",
      OUTRO: "Outro",
      NAO_INFORMADO: "Não Informado",
    };
    return gender ? genderMap[gender] || gender : "-";
  };

  const formatEducationLevel = (level?: string) => {
    const levelMap: Record<string, string> = {
      FUNDAMENTAL_INCOMPLETO: "Fundamental Incompleto",
      FUNDAMENTAL_COMPLETO: "Fundamental Completo",
      MEDIO_INCOMPLETO: "Médio Incompleto",
      MEDIO_COMPLETO: "Médio Completo",
      SUPERIOR_INCOMPLETO: "Superior Incompleto",
      SUPERIOR_COMPLETO: "Superior Completo",
      POS_GRADUACAO: "Pós-Graduação",
      NAO_INFORMADO: "Não Informado",
    };
    return level ? levelMap[level] || level : "-";
  };

  const formatIncomeLevel = (level?: string) => {
    const levelMap: Record<string, string> = {
      ATE_1_SALARIO: "Até 1 salário mínimo",
      DE_1_A_2_SALARIOS: "1 a 2 salários mínimos",
      DE_2_A_5_SALARIOS: "2 a 5 salários mínimos",
      DE_5_A_10_SALARIOS: "5 a 10 salários mínimos",
      ACIMA_10_SALARIOS: "Acima de 10 salários mínimos",
      NAO_INFORMADO: "Não Informado",
    };
    return level ? levelMap[level] || level : "-";
  };

  const formatMaritalStatus = (status?: string) => {
    const statusMap: Record<string, string> = {
      SOLTEIRO: "Solteiro(a)",
      CASADO: "Casado(a)",
      DIVORCIADO: "Divorciado(a)",
      VIUVO: "Viúvo(a)",
      UNIAO_ESTAVEL: "União Estável",
      NAO_INFORMADO: "Não Informado",
    };
    return status ? statusMap[status] || status : "-";
  };

  const formatSupportLevel = (level?: string) => {
    const levelMap: Record<string, string> = {
      MUITO_FAVORAVEL: "Muito Favorável",
      FAVORAVEL: "Favorável",
      NEUTRO: "Neutro",
      DESFAVORAVEL: "Desfavorável",
      MUITO_DESFAVORAVEL: "Muito Desfavorável",
      NAO_DEFINIDO: "Não Definido",
    };
    return level ? levelMap[level] || level : "-";
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/voters">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{voter.name}</h1>
              <p className="text-muted-foreground">
                {voter.city}, {voter.state}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <>
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar Informações Adicionais
              </Button>
              <Button variant="outline" size="sm" className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Deletar
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={form.handleSubmit(handleSave)}
                disabled={isSubmitting}
              >
                <Check className="mr-2 h-4 w-4" />
                Salvar Alterações
              </Button>
            </>
          )}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Basic Information (Read-only) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informações Básicas
                </CardTitle>
                <CardDescription>Dados obrigatórios do eleitor (não editável)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Nome Completo</p>
                    <p className="text-sm">{voter.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Nome da Mãe</p>
                    <p className="text-sm">{voter.motherName || "-"}</p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">CPF</p>
                    <p className="text-sm">{voter.cpf || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Data de Nascimento</p>
                    <p className="text-sm">{formatDate(voter.dateOfBirth)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Gênero</p>
                    <p className="text-sm">{formatGender(voter.gender)}</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-sm">{voter.email || "-"}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                  <p className="text-sm">{voter.phone || "-"}</p>
                </div>
              </CardContent>
            </Card>

            {/* Address (Read-only) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Endereço
                </CardTitle>
                <CardDescription>Endereço residencial (não editável)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Logradouro e Número</p>
                  <p className="text-sm">
                    {voter.address}, {voter.addressNumber}
                  </p>
                </div>

                {voter.addressComplement && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Complemento</p>
                    <p className="text-sm">{voter.addressComplement}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Bairro</p>
                  <p className="text-sm">{voter.neighborhood}</p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">Cidade</p>
                    <p className="text-sm">{voter.city}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Estado</p>
                    <p className="text-sm">{voter.state}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">CEP</p>
                  <p className="text-sm">{voter.zipCode}</p>
                </div>
              </CardContent>
            </Card>

            {/* Additional Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Contato Adicional
                </CardTitle>
                <CardDescription>WhatsApp e preferências de contato</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isEditing ? (
                  <>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">WhatsApp</p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm">{voter.whatsapp || "-"}</p>
                        {voter.hasWhatsapp && <WhatsAppBadge hasWhatsapp={voter.hasWhatsapp} />}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        Meio de Contato Preferido
                      </p>
                      <p className="text-sm">
                        {voter.preferredContact
                          ? {
                              TELEFONE: "Telefone",
                              WHATSAPP: "WhatsApp",
                              EMAIL: "Email",
                            }[voter.preferredContact]
                          : "-"}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <FormField
                      control={form.control}
                      name="whatsapp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>WhatsApp</FormLabel>
                          <FormControl>
                            <Input placeholder="(11) 99999-9999" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="hasWhatsapp"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Possui WhatsApp</FormLabel>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="preferredContact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meio de Contato Preferido</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="TELEFONE">Telefone</SelectItem>
                              <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                              <SelectItem value="EMAIL">Email</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </CardContent>
            </Card>

            {/* Electoral Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Informações Eleitorais
                </CardTitle>
                <CardDescription>Dados do título e local de votação</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isEditing ? (
                  <>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Título de Eleitor</p>
                      <p className="text-sm">{voter.electoralTitle || "-"}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Zona Eleitoral</p>
                        <p className="text-sm">{voter.electoralZone || "-"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Seção Eleitoral</p>
                        <p className="text-sm">{voter.electoralSection || "-"}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Local de Votação</p>
                      <p className="text-sm">{voter.votingLocation || "-"}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <FormField
                      control={form.control}
                      name="electoralTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Título de Eleitor</FormLabel>
                          <FormControl>
                            <Input placeholder="0000 0000 0000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="electoralZone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Zona Eleitoral</FormLabel>
                            <FormControl>
                              <Input placeholder="123" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="electoralSection"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Seção Eleitoral</FormLabel>
                            <FormControl>
                              <Input placeholder="456" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="votingLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Local de Votação</FormLabel>
                          <FormControl>
                            <Input placeholder="Escola Municipal..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </CardContent>
            </Card>

            {/* Social Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Informações Sociais
                </CardTitle>
                <CardDescription>Dados demográficos e sociais</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isEditing ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Escolaridade</p>
                        <p className="text-sm">{formatEducationLevel(voter.educationLevel)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Profissão</p>
                        <p className="text-sm">{voter.occupation || "-"}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Faixa de Renda</p>
                        <p className="text-sm">{formatIncomeLevel(voter.incomeLevel)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Estado Civil</p>
                        <p className="text-sm">{formatMaritalStatus(voter.maritalStatus)}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Religião</p>
                        <p className="text-sm">{voter.religion || "-"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Etnia</p>
                        <p className="text-sm">{voter.ethnicity || "-"}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Membros da Família</p>
                      <p className="text-sm">{voter.familyMembers || "-"}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="educationLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Escolaridade</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="FUNDAMENTAL_INCOMPLETO">
                                  Fundamental Incompleto
                                </SelectItem>
                                <SelectItem value="FUNDAMENTAL_COMPLETO">
                                  Fundamental Completo
                                </SelectItem>
                                <SelectItem value="MEDIO_INCOMPLETO">Médio Incompleto</SelectItem>
                                <SelectItem value="MEDIO_COMPLETO">Médio Completo</SelectItem>
                                <SelectItem value="SUPERIOR_INCOMPLETO">
                                  Superior Incompleto
                                </SelectItem>
                                <SelectItem value="SUPERIOR_COMPLETO">Superior Completo</SelectItem>
                                <SelectItem value="POS_GRADUACAO">Pós-Graduação</SelectItem>
                                <SelectItem value="NAO_INFORMADO">Não Informado</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="occupation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Profissão</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: Professor" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="incomeLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Faixa de Renda</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="ATE_1_SALARIO">Até 1 salário mínimo</SelectItem>
                                <SelectItem value="DE_1_A_2_SALARIOS">
                                  1 a 2 salários mínimos
                                </SelectItem>
                                <SelectItem value="DE_2_A_5_SALARIOS">
                                  2 a 5 salários mínimos
                                </SelectItem>
                                <SelectItem value="DE_5_A_10_SALARIOS">
                                  5 a 10 salários mínimos
                                </SelectItem>
                                <SelectItem value="ACIMA_10_SALARIOS">
                                  Acima de 10 salários mínimos
                                </SelectItem>
                                <SelectItem value="NAO_INFORMADO">Não Informado</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="maritalStatus"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Estado Civil</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="SOLTEIRO">Solteiro(a)</SelectItem>
                                <SelectItem value="CASADO">Casado(a)</SelectItem>
                                <SelectItem value="DIVORCIADO">Divorciado(a)</SelectItem>
                                <SelectItem value="VIUVO">Viúvo(a)</SelectItem>
                                <SelectItem value="UNIAO_ESTAVEL">União Estável</SelectItem>
                                <SelectItem value="NAO_INFORMADO">Não Informado</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="religion"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Religião</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: Católica" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="ethnicity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Etnia</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: Parda" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="familyMembers"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Membros da Família</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              {...field}
                              onChange={(e) =>
                                field.onChange(e.target.value ? parseInt(e.target.value) : undefined)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  Redes Sociais
                </CardTitle>
                <CardDescription>Perfis em redes sociais</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isEditing ? (
                  <>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Facebook</p>
                      <p className="text-sm">{voter.facebook || "-"}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Instagram</p>
                      <p className="text-sm">{voter.instagram || "-"}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Twitter/X</p>
                      <p className="text-sm">{voter.twitter || "-"}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <FormField
                      control={form.control}
                      name="facebook"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Facebook</FormLabel>
                          <FormControl>
                            <Input placeholder="Facebook" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="instagram"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Instagram</FormLabel>
                          <FormControl>
                            <Input placeholder="Instagram" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="twitter"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Twitter/X</FormLabel>
                          <FormControl>
                            <Input placeholder="Twitter/X" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </CardContent>
            </Card>

            {/* Political Information */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Informações Políticas
                </CardTitle>
                <CardDescription>Nível de apoio e histórico político</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isEditing ? (
                  <>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">
                          Nível de Apoio
                        </p>
                        {voter.supportLevel ? (
                          <SupportLevelBadge level={voter.supportLevel} />
                        ) : (
                          <p className="text-sm">-</p>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Partido Político</p>
                        <p className="text-sm">{voter.politicalParty || "-"}</p>
                      </div>
                    </div>

                    {voter.votingHistory && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">
                          Histórico de Votação
                        </p>
                        <p className="text-sm whitespace-pre-line">{voter.votingHistory}</p>
                      </div>
                    )}

                    {voter.tags && voter.tags.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Tags</p>
                        <div className="flex flex-wrap gap-2">
                          {voter.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {voter.notes && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Observações</p>
                        <p className="text-sm whitespace-pre-line">{voter.notes}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="supportLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nível de Apoio</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o nível" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="MUITO_FAVORAVEL">Muito Favorável</SelectItem>
                                <SelectItem value="FAVORAVEL">Favorável</SelectItem>
                                <SelectItem value="NEUTRO">Neutro</SelectItem>
                                <SelectItem value="DESFAVORAVEL">Desfavorável</SelectItem>
                                <SelectItem value="MUITO_DESFAVORAVEL">
                                  Muito Desfavorável
                                </SelectItem>
                                <SelectItem value="NAO_DEFINIDO">Não Definido</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="politicalParty"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Partido Político</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: PT, PSDB, etc." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="votingHistory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Histórico de Votação</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Histórico de votações anteriores..."
                              className="resize-none"
                              rows={3}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tags"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel className="text-base">Tags</FormLabel>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {availableTags.map((tag) => (
                              <FormField
                                key={tag}
                                control={form.control}
                                name="tags"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={tag}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(tag)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...(field.value || []), tag])
                                              : field.onChange(
                                                  field.value?.filter((value) => value !== tag)
                                                );
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="text-sm font-normal">{tag}</FormLabel>
                                    </FormItem>
                                  );
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Observações</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Adicione observações sobre o eleitor..."
                              className="resize-none"
                              rows={4}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </CardContent>
            </Card>

            {/* System Metadata */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Informações do Sistema
                </CardTitle>
                <CardDescription>Dados de cadastro e atualização</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Cadastrado em</p>
                    <p className="text-sm">
                      {format(new Date(voter.createdAt), "dd/MM/yyyy 'às' HH:mm", {
                        locale: ptBR,
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Última atualização</p>
                    <p className="text-sm">
                      {format(new Date(voter.updatedAt), "dd/MM/yyyy 'às' HH:mm", {
                        locale: ptBR,
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">ID do Sistema</p>
                    <p className="text-xs font-mono">{voter.id}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </Form>
    </div>
  );
}

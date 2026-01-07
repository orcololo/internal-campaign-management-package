"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  voterBasicInfoSchema,
  voterContactSchema,
  voterElectoralSchema,
  voterSocialSchema,
  voterPoliticalSchema,
  type VoterBasicInfo,
  type VoterContact,
  type VoterElectoral,
  type VoterSocial,
  type VoterPolitical,
} from "@/lib/validators/voters";
import { votersApi } from "@/lib/api/endpoints/voters";
import { Voter } from "@/types/voters";
import { MultiStepForm, FormStep } from "@/components/composed/forms/multi-step-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface VoterFormProps {
  voter?: Voter;
  mode: "create" | "edit";
}

const brazilianStates = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

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

interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export function VoterForm({ voter, mode }: VoterFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingCep, setIsFetchingCep] = useState(false);
  const [formData, setFormData] = useState<Partial<Voter>>({
    // Step 1: Obligatory fields
    name: voter?.name || "",
    motherName: voter?.motherName || "",
    cpf: voter?.cpf || "",
    dateOfBirth: voter?.dateOfBirth || "",
    gender: voter?.gender || undefined,
    email: voter?.email || "",
    phone: voter?.phone || "",
    address: voter?.address || "",
    addressNumber: voter?.addressNumber || "",
    addressComplement: voter?.addressComplement || "",
    neighborhood: voter?.neighborhood || "",
    city: voter?.city || "",
    state: voter?.state || "",
    zipCode: voter?.zipCode || "",

    // Step 2: Additional contact
    whatsapp: voter?.whatsapp || "",
    hasWhatsapp: voter?.hasWhatsapp || false,
    preferredContact: voter?.preferredContact || undefined,

    // Step 3: Electoral
    electoralTitle: voter?.electoralTitle || "",
    electoralZone: voter?.electoralZone || "",
    electoralSection: voter?.electoralSection || "",
    votingLocation: voter?.votingLocation || "",

    // Step 4: Social
    educationLevel: voter?.educationLevel || undefined,
    occupation: voter?.occupation || "",
    incomeLevel: voter?.incomeLevel || undefined,
    maritalStatus: voter?.maritalStatus || undefined,
    religion: voter?.religion || "",
    ethnicity: voter?.ethnicity || "",
    familyMembers: voter?.familyMembers || undefined,
    facebook: voter?.facebook || "",
    instagram: voter?.instagram || "",
    twitter: voter?.twitter || "",

    // Step 5: Political
    supportLevel: voter?.supportLevel || undefined,
    politicalParty: voter?.politicalParty || "",
    votingHistory: voter?.votingHistory || "",
    tags: voter?.tags || [],
    notes: voter?.notes || "",
  });

  // Step 1: All Obligatory Fields
  const basicInfoForm = useForm<VoterBasicInfo>({
    resolver: zodResolver(voterBasicInfoSchema),
    defaultValues: {
      name: formData.name as string,
      motherName: formData.motherName as string,
      cpf: formData.cpf as string,
      dateOfBirth: formData.dateOfBirth as string,
      gender: formData.gender,
      email: formData.email as string,
      phone: formData.phone as string,
      address: formData.address as string,
      addressNumber: formData.addressNumber as string,
      addressComplement: formData.addressComplement,
      neighborhood: formData.neighborhood as string,
      city: formData.city as string,
      state: formData.state as string,
      zipCode: formData.zipCode as string,
    },
  });

  // Step 2: Additional Contact
  const contactForm = useForm<VoterContact>({
    resolver: zodResolver(voterContactSchema),
    defaultValues: {
      whatsapp: formData.whatsapp,
      hasWhatsapp: formData.hasWhatsapp,
      preferredContact: formData.preferredContact,
    },
  });

  // Step 3: Electoral Info Form
  const electoralForm = useForm<VoterElectoral>({
    resolver: zodResolver(voterElectoralSchema),
    defaultValues: {
      electoralTitle: formData.electoralTitle,
      electoralZone: formData.electoralZone,
      electoralSection: formData.electoralSection,
      votingLocation: formData.votingLocation,
    },
  });

  // Step 4: Social Segmentation Form
  const socialForm = useForm<VoterSocial>({
    resolver: zodResolver(voterSocialSchema),
    defaultValues: {
      educationLevel: formData.educationLevel,
      occupation: formData.occupation,
      incomeLevel: formData.incomeLevel,
      maritalStatus: formData.maritalStatus,
      religion: formData.religion,
      ethnicity: formData.ethnicity,
      familyMembers: formData.familyMembers,
      facebook: formData.facebook,
      instagram: formData.instagram,
      twitter: formData.twitter,
    },
  });

  // Step 5: Political Info Form
  const politicalForm = useForm<VoterPolitical>({
    resolver: zodResolver(voterPoliticalSchema),
    defaultValues: {
      supportLevel: formData.supportLevel,
      politicalParty: formData.politicalParty,
      votingHistory: formData.votingHistory,
      tags: formData.tags || [],
      notes: formData.notes,
    },
  });

  // Debounce timer ref
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const fetchAddressFromCep = useCallback(async (cep: string) => {
    // Remove non-numeric characters
    const cleanCep = cep.replace(/\D/g, "");

    // Check if CEP has 8 digits
    if (cleanCep.length !== 8) {
      return;
    }

    setIsFetchingCep(true);

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);

      if (!response.ok) {
        throw new Error("Erro na requisição");
      }

      const data: ViaCepResponse = await response.json();

      if (data.erro) {
        toast.error("CEP não encontrado");
        setIsFetchingCep(false);
        return;
      }

      // Update form fields with ViaCEP data
      basicInfoForm.setValue("address", data.logradouro || "", { shouldValidate: true });
      basicInfoForm.setValue("neighborhood", data.bairro || "", { shouldValidate: true });
      basicInfoForm.setValue("city", data.localidade || "", { shouldValidate: true });
      basicInfoForm.setValue("state", data.uf || "", { shouldValidate: true });

      if (data.complemento) {
        basicInfoForm.setValue("addressComplement", data.complemento, { shouldValidate: true });
      }

      toast.success("Endereço preenchido automaticamente!");
    } catch (error) {
      console.error("Error fetching CEP:", error);
      toast.error("Erro ao buscar CEP. Tente novamente.");
    } finally {
      setIsFetchingCep(false);
    }
  }, [basicInfoForm]);

  const handleCepChange = useCallback((value: string) => {
    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timer to fetch after 500ms of no typing
    debounceTimer.current = setTimeout(() => {
      fetchAddressFromCep(value);
    }, 500);
  }, [fetchAddressFromCep]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const handleNext = async () => {
    let isValid = false;

    switch (currentStep) {
      case 0:
        isValid = await basicInfoForm.trigger();
        if (isValid) {
          const values = basicInfoForm.getValues();
          setFormData({ ...formData, ...values });
          setCurrentStep(1);
        }
        break;
      case 1:
        isValid = await contactForm.trigger();
        if (isValid) {
          const values = contactForm.getValues();
          setFormData({ ...formData, ...values });
          setCurrentStep(2);
        }
        break;
      case 2:
        isValid = await electoralForm.trigger();
        if (isValid) {
          const values = electoralForm.getValues();
          setFormData({ ...formData, ...values });
          setCurrentStep(3);
        }
        break;
      case 3:
        isValid = await socialForm.trigger();
        if (isValid) {
          const values = socialForm.getValues();
          setFormData({ ...formData, ...values });
          setCurrentStep(4);
        }
        break;
    }
  };

  const handlePrevious = () => {
    setCurrentStep(Math.max(0, currentStep - 1));
  };

  const handleSubmit = async () => {
    const isValid = await politicalForm.trigger();
    if (!isValid) return;

    const values = politicalForm.getValues();
    const finalData = { ...formData, ...values };

    setIsSubmitting(true);
    try {
      if (mode === "edit" && voter) {
        await votersApi.update(voter.id, finalData as Partial<Voter>);
        toast.success("Eleitor atualizado com sucesso!");
      } else {
        await votersApi.create(finalData as Partial<Voter>);
        toast.success("Eleitor criado com sucesso!");
      }
      router.push("/voters");
      router.refresh();
    } catch (error) {
      toast.error("Erro ao salvar eleitor. Tente novamente.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps: FormStep[] = [
    {
      title: "Dados Obrigatórios",
      description: "Informações essenciais do eleitor",
      content: (
        <Form {...basicInfoForm}>
          <div className="space-y-4">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Informações Pessoais</h3>

              <FormField
                control={basicInfoForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo *</FormLabel>
                    <FormControl>
                      <Input placeholder="João da Silva" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={basicInfoForm.control}
                name="motherName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Mãe *</FormLabel>
                    <FormControl>
                      <Input placeholder="Maria da Silva" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={basicInfoForm.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF *</FormLabel>
                      <FormControl>
                        <Input placeholder="000.000.000-00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={basicInfoForm.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Nascimento *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={basicInfoForm.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gênero *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MASCULINO">Masculino</SelectItem>
                          <SelectItem value="FEMININO">Feminino</SelectItem>
                          <SelectItem value="OUTRO">Outro</SelectItem>
                          <SelectItem value="NAO_INFORMADO">Não Informado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-sm font-medium">Contato</h3>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={basicInfoForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="joao@exemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={basicInfoForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone/Celular *</FormLabel>
                      <FormControl>
                        <Input placeholder="(11) 99999-9999" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-sm font-medium">Endereço</h3>

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={basicInfoForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Logradouro *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Rua Example"
                          {...field}
                          disabled={isFetchingCep}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={basicInfoForm.control}
                  name="addressNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número *</FormLabel>
                      <FormControl>
                        <Input placeholder="123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={basicInfoForm.control}
                  name="addressComplement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Complemento</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Apt 101"
                          {...field}
                          disabled={isFetchingCep}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={basicInfoForm.control}
                  name="neighborhood"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bairro *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Centro"
                          {...field}
                          disabled={isFetchingCep}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={basicInfoForm.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="São Paulo"
                          {...field}
                          disabled={isFetchingCep}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={basicInfoForm.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isFetchingCep}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="UF" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {brazilianStates.map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={basicInfoForm.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="00000-000"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              handleCepChange(e.target.value);
                            }}
                            disabled={isFetchingCep}
                            maxLength={9}
                          />
                          {isFetchingCep && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormDescription>
                        Digite o CEP para preencher o endereço automaticamente
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </Form>
      ),
    },
    {
      title: "Contato Adicional",
      description: "WhatsApp e preferências de contato",
      content: (
        <Form {...contactForm}>
          <div className="space-y-4">
            <FormField
              control={contactForm.control}
              name="whatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp</FormLabel>
                  <FormControl>
                    <Input placeholder="(11) 99999-9999" {...field} />
                  </FormControl>
                  <FormDescription>
                    Número do WhatsApp (se diferente do telefone)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={contactForm.control}
              name="hasWhatsapp"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Possui WhatsApp
                    </FormLabel>
                    <FormDescription>
                      Marque se o eleitor possui WhatsApp
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={contactForm.control}
              name="preferredContact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meio de Contato Preferido</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          </div>
        </Form>
      ),
    },
    {
      title: "Informações Eleitorais",
      description: "Dados do título de eleitor e local de votação",
      content: (
        <Form {...electoralForm}>
          <div className="space-y-4">
            <FormField
              control={electoralForm.control}
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
                control={electoralForm.control}
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
                control={electoralForm.control}
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
              control={electoralForm.control}
              name="votingLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Local de Votação</FormLabel>
                  <FormControl>
                    <Input placeholder="Escola Municipal..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Nome do local onde o eleitor vota
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Form>
      ),
    },
    {
      title: "Informações Sociais",
      description: "Dados demográficos e redes sociais",
      content: (
        <Form {...socialForm}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={socialForm.control}
                name="educationLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Escolaridade</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="FUNDAMENTAL_INCOMPLETO">Fundamental Incompleto</SelectItem>
                        <SelectItem value="FUNDAMENTAL_COMPLETO">Fundamental Completo</SelectItem>
                        <SelectItem value="MEDIO_INCOMPLETO">Médio Incompleto</SelectItem>
                        <SelectItem value="MEDIO_COMPLETO">Médio Completo</SelectItem>
                        <SelectItem value="SUPERIOR_INCOMPLETO">Superior Incompleto</SelectItem>
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
                control={socialForm.control}
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
                control={socialForm.control}
                name="incomeLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Faixa de Renda</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ATE_1_SALARIO">Até 1 salário mínimo</SelectItem>
                        <SelectItem value="DE_1_A_2_SALARIOS">1 a 2 salários mínimos</SelectItem>
                        <SelectItem value="DE_2_A_5_SALARIOS">2 a 5 salários mínimos</SelectItem>
                        <SelectItem value="DE_5_A_10_SALARIOS">5 a 10 salários mínimos</SelectItem>
                        <SelectItem value="ACIMA_10_SALARIOS">Acima de 10 salários mínimos</SelectItem>
                        <SelectItem value="NAO_INFORMADO">Não Informado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={socialForm.control}
                name="maritalStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado Civil</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                control={socialForm.control}
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
                control={socialForm.control}
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
              control={socialForm.control}
              name="familyMembers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Membros da Família</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormDescription>
                    Número de pessoas no núcleo familiar
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Redes Sociais</FormLabel>
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={socialForm.control}
                  name="facebook"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Facebook" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={socialForm.control}
                  name="instagram"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Instagram" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={socialForm.control}
                  name="twitter"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Twitter/X" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </Form>
      ),
    },
    {
      title: "Informações Políticas",
      description: "Nível de apoio e observações",
      content: (
        <Form {...politicalForm}>
          <div className="space-y-4">
            <FormField
              control={politicalForm.control}
              name="supportLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nível de Apoio</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                      <SelectItem value="MUITO_DESFAVORAVEL">Muito Desfavorável</SelectItem>
                      <SelectItem value="NAO_DEFINIDO">Não Definido</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Nível estimado de apoio do eleitor
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={politicalForm.control}
              name="politicalParty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Partido Político</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: PT, PSDB, etc." {...field} />
                  </FormControl>
                  <FormDescription>
                    Partido político do eleitor (se houver)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={politicalForm.control}
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
                  <FormDescription>
                    Informações sobre votações anteriores
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={politicalForm.control}
              name="tags"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Tags</FormLabel>
                    <FormDescription>
                      Selecione as características do eleitor
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {availableTags.map((tag) => (
                      <FormField
                        key={tag}
                        control={politicalForm.control}
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
                              <FormLabel className="text-sm font-normal">
                                {tag}
                              </FormLabel>
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
              control={politicalForm.control}
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
                  <FormDescription>
                    Notas adicionais sobre o eleitor
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Form>
      ),
    },
  ];

  return (
    <MultiStepForm
      steps={steps}
      currentStep={currentStep}
      onNext={handleNext}
      onPrevious={handlePrevious}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  );
}

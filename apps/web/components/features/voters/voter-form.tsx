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
  voterEngagementSchema,
  type VoterBasicInfo,
  type VoterContact,
  type VoterElectoral,
  type VoterSocial,
  type VoterPolitical,
  type VoterEngagement,
} from "@/lib/validators/voters";
import { Voter } from "@/types/voters";
import { useVotersStore } from "@/store/voters-store";
import {
  MultiStepForm,
  FormStep,
} from "@/components/composed/forms/multi-step-form";
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
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
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
  const { createVoter, updateVoter } = useVotersStore();
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
    hasWhatsapp: voter?.hasWhatsapp === 'SIM',
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
    tags: typeof voter?.tags === 'string' ? JSON.parse(voter.tags || '[]') : voter?.tags || [],
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
      hasWhatsapp: typeof formData.hasWhatsapp === 'boolean' ? formData.hasWhatsapp : formData.hasWhatsapp === 'SIM',
      preferredContact: formData.preferredContact as "TELEFONE" | "WHATSAPP" | "EMAIL" | undefined,
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
      tags: Array.isArray(formData.tags) ? formData.tags : [],
      notes: formData.notes,
    },
  });

  // Step 6: Engagement & AI Data Form
  const engagementForm = useForm<VoterEngagement>({
    resolver: zodResolver(voterEngagementSchema),
    defaultValues: {
      ageGroup: voter?.ageGroup,
      householdType: voter?.householdType as any,
      employmentStatus: voter?.employmentStatus as any,
      vehicleOwnership: typeof voter?.vehicleOwnership === 'boolean' 
        ? voter.vehicleOwnership 
        : voter?.vehicleOwnership === 'SIM',
      internetAccess: voter?.internetAccess,
      communicationStyle: voter?.communicationStyle as any,
      contentPreference: typeof voter?.contentPreference === 'string' 
        ? JSON.parse(voter.contentPreference || '[]') 
        : Array.isArray(voter?.contentPreference) ? voter.contentPreference : [],
      bestContactTime: voter?.bestContactTime,
      bestContactDay: typeof voter?.bestContactDay === 'string'
        ? JSON.parse(voter.bestContactDay || '[]')
        : Array.isArray(voter?.bestContactDay) ? voter.bestContactDay : [],
      topIssues: typeof voter?.topIssues === 'string'
        ? JSON.parse(voter.topIssues || '[]')
        : Array.isArray(voter?.topIssues) ? voter.topIssues : [],
      previousCandidateSupport: voter?.previousCandidateSupport,
      influencerScore: voter?.influencerScore,
      persuadability: voter?.persuadability as any,
      turnoutLikelihood: voter?.turnoutLikelihood as any,
      socialMediaFollowers: voter?.socialMediaFollowers,
      communityRole: voter?.communityRole as any,
      referredVoters: voter?.referredVoters,
      networkSize: voter?.networkSize,
      influenceRadius: voter?.influenceRadius,
      contactFrequency: voter?.contactFrequency,
      responseRate: voter?.responseRate,
      volunteerStatus: voter?.volunteerStatus as any,
      engagementScore: voter?.engagementScore,
    },
  });

  // Debounce timer ref
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const fetchAddressFromCep = useCallback(
    async (cep: string) => {
      // Remove non-numeric characters
      const cleanCep = cep.replace(/\D/g, "");

      // Check if CEP has 8 digits
      if (cleanCep.length !== 8) {
        return;
      }

      setIsFetchingCep(true);

      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${cleanCep}/json/`
        );

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
        basicInfoForm.setValue("address", data.logradouro || "", {
          shouldValidate: true,
        });
        basicInfoForm.setValue("neighborhood", data.bairro || "", {
          shouldValidate: true,
        });
        basicInfoForm.setValue("city", data.localidade || "", {
          shouldValidate: true,
        });
        basicInfoForm.setValue("state", data.uf || "", {
          shouldValidate: true,
        });

        if (data.complemento) {
          basicInfoForm.setValue("addressComplement", data.complemento, {
            shouldValidate: true,
          });
        }

        toast.success("Endereço preenchido automaticamente!");
      } catch (error) {
        console.error("Error fetching CEP:", error);
        toast.error("Erro ao buscar CEP. Tente novamente.");
      } finally {
        setIsFetchingCep(false);
      }
    },
    [basicInfoForm]
  );

  const handleCepChange = useCallback(
    (value: string) => {
      // Clear previous timer
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      // Set new timer to fetch after 500ms of no typing
      debounceTimer.current = setTimeout(() => {
        fetchAddressFromCep(value);
      }, 500);
    },
    [fetchAddressFromCep]
  );

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
      case 4:
        isValid = await politicalForm.trigger();
        if (isValid) {
          const values = politicalForm.getValues();
          setFormData({ ...formData, ...values });
          setCurrentStep(5);
        }
        break;
    }
  };

  const handlePrevious = () => {
    setCurrentStep(Math.max(0, currentStep - 1));
  };

  const handleSubmit = async () => {
    const isValid = await engagementForm.trigger();
    if (!isValid) return;

    const values = engagementForm.getValues();
    const finalData = { ...formData, ...values };

    // Convert form data to backend format
    const backendData: any = { ...finalData };
    
    // Convert boolean fields to SIM/NAO strings for backend
    if (typeof finalData.hasWhatsapp === 'boolean') {
      backendData.hasWhatsapp = finalData.hasWhatsapp ? 'SIM' : 'NAO';
    }
    if (typeof finalData.vehicleOwnership === 'boolean') {
      backendData.vehicleOwnership = finalData.vehicleOwnership ? 'SIM' : 'NAO';
    }
    
    // Convert array fields to JSON strings for backend
    if (Array.isArray(finalData.tags)) {
      backendData.tags = JSON.stringify(finalData.tags);
    }
    if (Array.isArray(finalData.topIssues)) {
      backendData.topIssues = JSON.stringify(finalData.topIssues);
    }
    if (Array.isArray(finalData.contentPreference)) {
      backendData.contentPreference = JSON.stringify(finalData.contentPreference);
    }
    if (Array.isArray(finalData.bestContactDay)) {
      backendData.bestContactDay = JSON.stringify(finalData.bestContactDay);
    }

    setIsSubmitting(true);
    try {
      if (mode === "edit" && voter) {
        const updated = await updateVoter(
          voter.id,
          backendData as Partial<Voter>
        );
        if (updated) {
          toast.success("Eleitor atualizado com sucesso!");
          router.push("/voters");
        } else {
          toast.error("Erro ao atualizar eleitor. Tente novamente.");
        }
      } else {
        const created = await createVoter(backendData as Partial<Voter>);
        if (created) {
          toast.success("Eleitor criado com sucesso!");
          router.push("/voters");
        } else {
          toast.error("Erro ao criar eleitor. Tente novamente.");
        }
      }
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
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MASCULINO">Masculino</SelectItem>
                          <SelectItem value="FEMININO">Feminino</SelectItem>
                          <SelectItem value="OUTRO">Outro</SelectItem>
                          <SelectItem value="NAO_INFORMADO">
                            Não Informado
                          </SelectItem>
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
                        <Input
                          type="email"
                          placeholder="joao@exemplo.com"
                          {...field}
                        />
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
                    <FormLabel>Possui WhatsApp</FormLabel>
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
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
                        <SelectItem value="MEDIO_INCOMPLETO">
                          Médio Incompleto
                        </SelectItem>
                        <SelectItem value="MEDIO_COMPLETO">
                          Médio Completo
                        </SelectItem>
                        <SelectItem value="SUPERIOR_INCOMPLETO">
                          Superior Incompleto
                        </SelectItem>
                        <SelectItem value="SUPERIOR_COMPLETO">
                          Superior Completo
                        </SelectItem>
                        <SelectItem value="POS_GRADUACAO">
                          Pós-Graduação
                        </SelectItem>
                        <SelectItem value="NAO_INFORMADO">
                          Não Informado
                        </SelectItem>
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ATE_1_SALARIO">
                          Até 1 salário mínimo
                        </SelectItem>
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
                        <SelectItem value="NAO_INFORMADO">
                          Não Informado
                        </SelectItem>
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="SOLTEIRO">Solteiro(a)</SelectItem>
                        <SelectItem value="CASADO">Casado(a)</SelectItem>
                        <SelectItem value="DIVORCIADO">
                          Divorciado(a)
                        </SelectItem>
                        <SelectItem value="VIUVO">Viúvo(a)</SelectItem>
                        <SelectItem value="UNIAO_ESTAVEL">
                          União Estável
                        </SelectItem>
                        <SelectItem value="NAO_INFORMADO">
                          Não Informado
                        </SelectItem>
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
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? parseInt(e.target.value) : undefined
                        )
                      }
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o nível" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="MUITO_FAVORAVEL">
                        Muito Favorável
                      </SelectItem>
                      <SelectItem value="FAVORAVEL">Favorável</SelectItem>
                      <SelectItem value="NEUTRO">Neutro</SelectItem>
                      <SelectItem value="DESFAVORAVEL">Desfavorável</SelectItem>
                      <SelectItem value="MUITO_DESFAVORAVEL">
                        Muito Desfavorável
                      </SelectItem>
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
                                      ? field.onChange([
                                          ...(field.value || []),
                                          tag,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== tag
                                          )
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
    {
      title: "Engajamento & IA",
      description: "Dados para análises e insights com IA",
      content: (
        <Form {...engagementForm}>
          <div className="space-y-6">
            {/* Demographics Extended */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Demografia Estendida</h3>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={engagementForm.control}
                  name="ageGroup"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Faixa Etária</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="18-25">18-25 anos</SelectItem>
                          <SelectItem value="26-35">26-35 anos</SelectItem>
                          <SelectItem value="36-50">36-50 anos</SelectItem>
                          <SelectItem value="51-65">51-65 anos</SelectItem>
                          <SelectItem value="65+">65+ anos</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={engagementForm.control}
                  name="householdType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Domicílio</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="SOLTEIRO">Solteiro</SelectItem>
                          <SelectItem value="FAMILIA_COM_FILHOS">
                            Família com Filhos
                          </SelectItem>
                          <SelectItem value="FAMILIA_SEM_FILHOS">
                            Família sem Filhos
                          </SelectItem>
                          <SelectItem value="IDOSOS">Idosos</SelectItem>
                          <SelectItem value="ESTUDANTES">Estudantes</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={engagementForm.control}
                  name="employmentStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Situação Profissional</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="EMPREGADO">Empregado</SelectItem>
                          <SelectItem value="DESEMPREGADO">
                            Desempregado
                          </SelectItem>
                          <SelectItem value="APOSENTADO">Aposentado</SelectItem>
                          <SelectItem value="ESTUDANTE">Estudante</SelectItem>
                          <SelectItem value="AUTONOMO">Autônomo</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={engagementForm.control}
                  name="internetAccess"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Acesso à Internet</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Fibra">Fibra</SelectItem>
                          <SelectItem value="4G">4G</SelectItem>
                          <SelectItem value="3G">3G</SelectItem>
                          <SelectItem value="Limitado">Limitado</SelectItem>
                          <SelectItem value="Sem acesso">Sem acesso</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={engagementForm.control}
                name="vehicleOwnership"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Possui Veículo</FormLabel>
                      <FormDescription>
                        Importante para acessibilidade e perfil socioeconômico
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* Communication Preferences Extended */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-sm font-medium">
                Preferências de Comunicação
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={engagementForm.control}
                  name="communicationStyle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estilo de Comunicação</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="FORMAL">Formal</SelectItem>
                          <SelectItem value="INFORMAL">Informal</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={engagementForm.control}
                  name="bestContactTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Melhor Horário de Contato</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Manhã">Manhã</SelectItem>
                          <SelectItem value="Tarde">Tarde</SelectItem>
                          <SelectItem value="Noite">Noite</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Political Extended */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-sm font-medium">
                Informações Políticas Estendidas
              </h3>

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={engagementForm.control}
                  name="persuadability"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Persuasibilidade</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ALTO">Alta</SelectItem>
                          <SelectItem value="MEDIO">Média</SelectItem>
                          <SelectItem value="BAIXO">Baixa</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Probabilidade de mudar de voto
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={engagementForm.control}
                  name="turnoutLikelihood"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prob. de Comparecimento</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ALTO">Alta</SelectItem>
                          <SelectItem value="MEDIO">Média</SelectItem>
                          <SelectItem value="BAIXO">Baixa</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Probabilidade de votar</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={engagementForm.control}
                  name="influencerScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Score de Influência</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0-100"
                          min={0}
                          max={100}
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? parseInt(e.target.value)
                                : undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        0-100: Capacidade de influenciar
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={engagementForm.control}
                name="previousCandidateSupport"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Candidato Apoiado Anteriormente</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Candidato X - 2020" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Social Network & Influence */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-sm font-medium">Rede Social & Influência</h3>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={engagementForm.control}
                  name="communityRole"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Papel na Comunidade</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="LIDER">Líder</SelectItem>
                          <SelectItem value="MEMBRO_ATIVO">
                            Membro Ativo
                          </SelectItem>
                          <SelectItem value="ATIVISTA">Ativista</SelectItem>
                          <SelectItem value="MEMBRO">Membro</SelectItem>
                          <SelectItem value="NAO_PARTICIPANTE">
                            Não Participante
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={engagementForm.control}
                  name="volunteerStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status de Voluntário</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ATIVO">Ativo</SelectItem>
                          <SelectItem value="INATIVO">Inativo</SelectItem>
                          <SelectItem value="INTERESSADO">
                            Interessado
                          </SelectItem>
                          <SelectItem value="NAO_VOLUNTARIO">
                            Não Voluntário
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={engagementForm.control}
                  name="socialMediaFollowers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Seguidores nas Redes</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? parseInt(e.target.value)
                                : undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormDescription>Total estimado</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={engagementForm.control}
                  name="referredVoters"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Eleitores Referidos</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? parseInt(e.target.value)
                                : undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormDescription>Qtd. trazidos</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={engagementForm.control}
                  name="networkSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tamanho da Rede</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? parseInt(e.target.value)
                                : undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormDescription>Rede pessoal estimada</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={engagementForm.control}
                name="influenceRadius"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Raio de Influência (km)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="0.0"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              ? parseFloat(e.target.value)
                              : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Área geográfica de influência
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Engagement Tracking */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-sm font-medium">
                Rastreamento de Engajamento
              </h3>

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={engagementForm.control}
                  name="contactFrequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frequência de Contato</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? parseInt(e.target.value)
                                : undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormDescription>Vezes contatado</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={engagementForm.control}
                  name="responseRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Taxa de Resposta (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0-100"
                          min={0}
                          max={100}
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? parseInt(e.target.value)
                                : undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormDescription>% de respostas</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={engagementForm.control}
                  name="engagementScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Score de Engajamento</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0-100"
                          min={0}
                          max={100}
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? parseInt(e.target.value)
                                : undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormDescription>Score calculado (0-100)</FormDescription>
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

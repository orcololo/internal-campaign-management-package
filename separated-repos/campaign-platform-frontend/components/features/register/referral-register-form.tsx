"use client";

import { useState } from "react";
import { votersApi } from "@/lib/api/voters";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Check, Loader2, User, Phone, Mail, MapPin } from "lucide-react";

interface ReferralFormData {
    name: string;
    phone: string;
    whatsapp?: string;
    email?: string;
    zipCode?: string;
    addressNumber?: string;
    city?: string;
    state?: string;
}

interface ReferralRegisterFormProps {
    referralCode: string;
}

export function ReferralRegisterForm({ referralCode }: ReferralRegisterFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [referrerName, setReferrerName] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<ReferralFormData>();

    const zipCode = watch("zipCode");

    // Auto-fill address from CEP
    const handleCepBlur = async () => {
        if (!zipCode || zipCode.replace(/\D/g, "").length !== 8) return;

        try {
            const cleanCep = zipCode.replace(/\D/g, "");
            const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
            const data = await response.json();

            if (!data.erro) {
                setValue("city", data.localidade);
                setValue("state", data.uf);
            }
        } catch (error) {
            console.error("Erro ao buscar CEP:", error);
        }
    };

    const onSubmit = async (data: ReferralFormData) => {
        setIsSubmitting(true);

        try {
            const response = await votersApi.registerViaReferral({
                referralCode,
                name: data.name,
                phone: data.phone,
                whatsapp: data.whatsapp || data.phone,
                email: data.email,
                zipCode: data.zipCode,
                addressNumber: data.addressNumber,
                city: data.city,
                state: data.state,
            });

            const result = response.data;
            if (!result) {
                throw new Error("Erro ao cadastrar - Sem dados retornados");
            }

            setReferrerName(result.referrerName || "um apoiador");
            setIsSuccess(true);
            toast.success("Cadastro realizado com sucesso!");
        } catch (error: any) {
            console.error("Erro no cadastro:", error);
            toast.error(error.message || "Erro ao realizar cadastro");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="w-full max-w-lg">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 text-center">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                        Cadastro Realizado!
                    </h2>
                    <p className="text-slate-300 mb-4">
                        Obrigado por se cadastrar! Você foi indicado por{" "}
                        <span className="text-white font-semibold">{referrerName}</span>.
                    </p>
                    <p className="text-sm text-slate-400">
                        Em breve entraremos em contato.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-lg">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8">
                <div className="text-center mb-8">
                    <div className="text-5xl mb-4">👋</div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                        Faça Parte da Nossa Campanha
                    </h2>
                    <p className="text-slate-300">
                        Preencha seus dados para se cadastrar
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Nome */}
                    <div>
                        <label className="block text-sm font-medium text-slate-200 mb-2">
                            <User className="w-4 h-4 inline mr-2" />
                            Nome Completo *
                        </label>
                        <input
                            type="text"
                            {...register("name", {
                                required: "Nome é obrigatório",
                                minLength: { value: 3, message: "Nome deve ter pelo menos 3 caracteres" },
                            })}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Seu nome completo"
                        />
                        {errors.name && (
                            <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Telefone */}
                    <div>
                        <label className="block text-sm font-medium text-slate-200 mb-2">
                            <Phone className="w-4 h-4 inline mr-2" />
                            Telefone *
                        </label>
                        <input
                            type="tel"
                            {...register("phone", {
                                required: "Telefone é obrigatório",
                            })}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="(00) 00000-0000"
                        />
                        {errors.phone && (
                            <p className="text-red-400 text-sm mt-1">{errors.phone.message}</p>
                        )}
                    </div>

                    {/* WhatsApp (opcional) */}
                    <div>
                        <label className="block text-sm font-medium text-slate-200 mb-2">
                            <Phone className="w-4 h-4 inline mr-2" />
                            WhatsApp (se diferente)
                        </label>
                        <input
                            type="tel"
                            {...register("whatsapp")}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="(00) 00000-0000"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-slate-200 mb-2">
                            <Mail className="w-4 h-4 inline mr-2" />
                            Email
                        </label>
                        <input
                            type="email"
                            {...register("email")}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="seu@email.com"
                        />
                    </div>

                    {/* CEP e Número */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-200 mb-2">
                                <MapPin className="w-4 h-4 inline mr-2" />
                                CEP
                            </label>
                            <input
                                type="text"
                                {...register("zipCode")}
                                onBlur={handleCepBlur}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="00000-000"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-200 mb-2">
                                Número
                            </label>
                            <input
                                type="text"
                                {...register("addressNumber")}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="123"
                            />
                        </div>
                    </div>

                    {/* Cidade e Estado (auto-preenchidos) */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-200 mb-2">
                                Cidade
                            </label>
                            <input
                                type="text"
                                {...register("city")}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-300 placeholder-slate-500 focus:outline-none"
                                placeholder="Auto-preenchido"
                                readOnly
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-200 mb-2">
                                Estado
                            </label>
                            <input
                                type="text"
                                {...register("state")}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-300 placeholder-slate-500 focus:outline-none"
                                placeholder="UF"
                                readOnly
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Cadastrando...
                            </>
                        ) : (
                            "Cadastrar"
                        )}
                    </button>
                </form>

                <p className="text-center text-xs text-slate-400 mt-6">
                    Ao se cadastrar, você concorda em receber comunicações da nossa campanha.
                </p>
            </div>
        </div>
    );
}

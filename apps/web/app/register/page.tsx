"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ReferralRegisterForm } from "@/components/features/register/referral-register-form";

function RegisterContent() {
    const searchParams = useSearchParams();
    const referralCode = searchParams.get("ref");

    if (!referralCode) {
        return (
            <div className="w-full max-w-lg">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 text-center">
                    <div className="text-6xl mb-4">❌</div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                        Link Inválido
                    </h2>
                    <p className="text-slate-300">
                        Este link de cadastro não é válido. Verifique se você copiou o link corretamente.
                    </p>
                </div>
            </div>
        );
    }

    return <ReferralRegisterForm referralCode={referralCode} />;
}

export default function RegisterPage() {
    return (
        <Suspense
            fallback={
                <div className="w-full max-w-lg">
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 text-center">
                        <div className="animate-spin text-4xl mb-4">⏳</div>
                        <p className="text-slate-300">Carregando...</p>
                    </div>
                </div>
            }
        >
            <RegisterContent />
        </Suspense>
    );
}

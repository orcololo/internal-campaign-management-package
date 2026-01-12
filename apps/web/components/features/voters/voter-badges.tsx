import { SupportLevel } from "@/types/voters";
import { TrendingUp, Minus, TrendingDown, MessageSquare } from "lucide-react";

interface SupportLevelBadgeProps {
  level: SupportLevel;
}

export function SupportLevelBadge({ level }: SupportLevelBadgeProps) {
  const config: Record<
    SupportLevel,
    {
      icon: typeof TrendingUp;
      label: string;
      bgClass: string;
      textClass: string;
      borderClass: string;
    }
  > = {
    MUITO_FAVORAVEL: {
      icon: TrendingUp,
      label: "Muito Favorável",
      bgClass: "bg-emerald-500/10",
      textClass: "text-emerald-400",
      borderClass: "border-emerald-500/40",
    },
    FAVORAVEL: {
      icon: TrendingUp,
      label: "Favorável",
      bgClass: "bg-green-500/10",
      textClass: "text-green-400",
      borderClass: "border-green-500/40",
    },
    NEUTRO: {
      icon: Minus,
      label: "Neutro",
      bgClass: "bg-slate-500/10",
      textClass: "text-slate-400",
      borderClass: "border-slate-500/40",
    },
    DESFAVORAVEL: {
      icon: TrendingDown,
      label: "Desfavorável",
      bgClass: "bg-amber-500/10",
      textClass: "text-amber-400",
      borderClass: "border-amber-500/40",
    },
    MUITO_DESFAVORAVEL: {
      icon: TrendingDown,
      label: "Muito Desfavorável",
      bgClass: "bg-red-500/10",
      textClass: "text-red-400",
      borderClass: "border-red-500/40",
    },
    NAO_DEFINIDO: {
      icon: Minus,
      label: "Não Definido",
      bgClass: "bg-gray-500/10",
      textClass: "text-gray-400",
      borderClass: "border-gray-500/40",
    },
  };

  const { icon: Icon, label, bgClass, textClass, borderClass } = config[level];

  return (
    <div
      className={`flex items-center gap-1.5 px-2 py-1 rounded-md border w-fit ${bgClass} ${borderClass}`}
    >
      <Icon className={`size-3.5 ${textClass}`} />
      <span className={`text-xs font-medium ${textClass}`}>{label}</span>
    </div>
  );
}

interface WhatsAppBadgeProps {
  hasWhatsapp?: boolean;
}

export function WhatsAppBadge({ hasWhatsapp }: WhatsAppBadgeProps) {
  if (!hasWhatsapp) return null;

  return (
    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-green-500/10 border border-green-500/40">
      <MessageSquare className="size-3 text-green-400" />
      <span className="text-xs font-medium text-green-400">WhatsApp</span>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Copy, Check, QrCode, Share2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ReferralLinkGeneratorProps {
  referralCode: string;
  voterName: string;
}

export function ReferralLinkGenerator({ referralCode, voterName }: ReferralLinkGeneratorProps) {
  const [copied, setCopied] = useState(false);
  
  // In production, this would be your actual domain
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const referralLink = `${baseUrl}/register?ref=${referralCode}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast.success("Link copiado para área de transferência!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Erro ao copiar link");
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: "Cadastre-se na Campanha",
      text: `${voterName} convidou você para se cadastrar na nossa campanha!`,
      url: referralLink,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success("Link compartilhado!");
      } else {
        // Fallback to copy
        await handleCopy();
      }
    } catch (err) {
      console.error("Erro ao compartilhar:", err);
    }
  };

  const handleQRCode = () => {
    // In production, integrate with a QR code library
    toast.info("Recurso de QR Code em desenvolvimento");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="size-5" />
          Link de Referência
        </CardTitle>
        <CardDescription>
          Compartilhe este link único para indicar novos eleitores
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input 
            value={referralLink} 
            readOnly 
            className="font-mono text-sm"
          />
          <Button 
            onClick={handleCopy} 
            variant="outline"
            className="shrink-0"
          >
            {copied ? (
              <>
                <Check className="size-4 mr-2" />
                Copiado
              </>
            ) : (
              <>
                <Copy className="size-4 mr-2" />
                Copiar
              </>
            )}
          </Button>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={handleShare} 
            variant="default"
            className="flex-1"
          >
            <Share2 className="size-4 mr-2" />
            Compartilhar
          </Button>
          <Button 
            onClick={handleQRCode} 
            variant="outline"
            className="flex-1"
          >
            <QrCode className="size-4 mr-2" />
            Gerar QR Code
          </Button>
        </div>

        <div className="rounded-lg bg-muted p-4 space-y-2">
          <p className="text-sm font-medium">Código de Referência</p>
          <p className="text-xs text-muted-foreground font-mono">{referralCode}</p>
        </div>
      </CardContent>
    </Card>
  );
}

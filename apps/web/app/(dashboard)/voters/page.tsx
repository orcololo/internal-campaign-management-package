"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Download } from "lucide-react";
import { VotersTable } from "@/components/features/voters/voters-table";
import { useVotersStore } from "@/store/voters-store";
import { useRef } from "react";
import { toast } from "sonner";

export default function VotersPage() {
  const { importCsv, exportCsv, isLoading } = useVotersStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await importCsv(file, {
      skipDuplicates: true,
      autoGeocode: false,
    });

    if (result) {
      toast.success(
        `Importados ${result.success} eleitores. Falhas: ${result.failed}`
      );

      if (result.errors.length > 0) {
        console.error('Erros na importação:', result.errors);
        toast.error(`${result.errors.length} erros encontrados. Verifique o console.`);
      }
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleExport = async () => {
    await exportCsv();
    toast.success('Exportação iniciada');
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Eleitores</h1>
          <p className="text-muted-foreground">
            Gerencie sua base de eleitores e acompanhe o engajamento
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExport}
            disabled={isLoading}
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            <Upload className="mr-2 h-4 w-4" />
            Importar
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleImport}
          />
          <Link href="/voters/new">
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Novo Eleitor
            </Button>
          </Link>
        </div>
      </div>

      {/* Voters Table - now fetches from API via store */}
      <VotersTable />
    </div>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Download } from "lucide-react";
import { VotersTable } from "@/components/features/voters/voters-table";
import { votersApi } from "@/lib/api/endpoints/voters";

async function getVoters() {
  try {
    const response = await votersApi.list({ page: 1, perPage: 100 });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch voters:", error);
    return [];
  }
}

export default async function VotersPage() {
  const voters = await getVoters();

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
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Importar
          </Button>
          <Link href="/voters/new">
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Novo Eleitor
            </Button>
          </Link>
        </div>
      </div>

      {/* Voters Table */}
      <VotersTable data={voters} />
    </div>
  );
}

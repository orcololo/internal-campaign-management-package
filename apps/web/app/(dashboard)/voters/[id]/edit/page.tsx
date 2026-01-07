import { VoterForm } from "@/components/features/voters/voter-form";
import { votersApi } from "@/lib/api/endpoints/voters";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";

async function getVoter(id: string) {
  try {
    const response = await votersApi.get(id);
    return response.data;
  } catch (error) {
    return null;
  }
}

export default async function EditVoterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const voter = await getVoter(id);

  if (!voter) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link href={`/voters/${id}`}>
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editar Eleitor</h1>
          <p className="text-muted-foreground">
            Atualize as informações de {voter.name}
          </p>
        </div>
      </div>

      {/* Form */}
      <VoterForm voter={voter} mode="edit" />
    </div>
  );
}

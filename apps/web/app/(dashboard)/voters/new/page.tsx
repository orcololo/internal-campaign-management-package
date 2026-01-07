import { VoterForm } from "@/components/features/voters/voter-form";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NewVoterPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link href="/voters">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Novo Eleitor</h1>
          <p className="text-muted-foreground">
            Adicione um novo eleitor à sua base
          </p>
        </div>
      </div>

      {/* Form */}
      <VoterForm mode="create" />
    </div>
  );
}

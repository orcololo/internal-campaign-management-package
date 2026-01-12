import { notFound } from "next/navigation";
import { VoterDetail } from "@/components/features/voters/voter-detail";
import { voters } from "@/mock-data/voters";

interface VoterPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getVoter(id: string) {
  // Find voter from mock data
  const voter = voters.find((v) => v.id === id);
  return voter || null;
}

export default async function VoterPage({ params }: VoterPageProps) {
  const { id } = await params;
  const voter = await getVoter(id);

  if (!voter) {
    notFound();
  }

  return (
    <div className="p-4 md:p-6">
      <VoterDetail voter={voter} />
    </div>
  );
}

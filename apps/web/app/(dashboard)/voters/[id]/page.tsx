import { notFound } from "next/navigation";
import { VoterDetail } from "@/components/features/voters/voter-detail";
import { votersApi } from "@/lib/api/voters";

interface VoterPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getVoter(id: string) {
  try {
    const response = await votersApi.getById(id);
    return response.data;
  } catch (error) {
    console.error('Error fetching voter:', error);
    return null;
  }
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

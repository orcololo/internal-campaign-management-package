import { notFound } from "next/navigation";
import { VoterDetail } from "@/components/features/voters/voter-detail";
import { votersApi } from "@/lib/api/endpoints/voters";
import { DashboardHeader } from "@/components/dashboard/header";

interface VoterPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getVoter(id: string) {
  try {
    const response = await votersApi.get(id);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch voter:", error);
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
    <>
      <DashboardHeader />
      <div className="p-4 md:p-6">
        <VoterDetail voter={voter} />
      </div>
    </>
  );
}

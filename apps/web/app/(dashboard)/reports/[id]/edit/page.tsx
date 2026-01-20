import { ReportsBuilder } from "@/components/features/reports/reports-builder";

export default async function EditReportPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;

  return (
    <ReportsBuilder reportId={params.id} />
  );
}
import { ReportViewClient } from "@/components/features/reports/report-view-client";

export default async function ViewReportPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;

  return (
    <ReportViewClient reportId={params.id} />
  );
}
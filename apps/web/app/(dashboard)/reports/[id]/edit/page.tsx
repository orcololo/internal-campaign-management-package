import { notFound } from "next/navigation";
import { ReportsBuilder } from "@/components/features/reports/reports-builder";
import { savedReports } from "@/mock-data/reports";

export default function EditReportPage({ params }: { params: { id: string } }) {
  const report = savedReports.find((r) => r.id === params.id);

  if (!report) {
    notFound();
  }

  return (
    <ReportsBuilder
      initialFilters={report.filters}
      initialSorting={report.sorting}
      initialColumns={report.columns}
      initialName={report.name}
      initialDescription={report.description}
    />
  );
}

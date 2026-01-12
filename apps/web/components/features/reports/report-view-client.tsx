"use client";

import type { Report } from "@/types/reports";
import type { Voter } from "@/types/voters";
import { Card, CardContent } from "@/components/ui/card";
import { ReportPreview } from "./report-preview";
import { toast } from "sonner";

interface ReportViewClientProps {
  report: Report;
  voters: Voter[];
}

export function ReportViewClient({ report, voters }: ReportViewClientProps) {
  const handleExport = async (format: "pdf" | "csv" | "excel") => {
    toast.info(`Exportando relatório em formato ${format.toUpperCase()}...`);
    // TODO: Implement backend export
    console.log("Exporting:", format);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <ReportPreview
          data={voters}
          columns={report.columns}
          filters={report.filters}
          sorting={report.sorting}
          onExport={handleExport}
        />
      </CardContent>
    </Card>
  );
}

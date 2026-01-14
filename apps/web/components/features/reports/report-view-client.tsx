"use client";

import { useState } from "react";
import type { SavedReport } from "@/types/reports";
import type { Voter } from "@/types/voters";
import { Card, CardContent } from "@/components/ui/card";
import { ReportPreview } from "./report-preview";
import { useReportsStore } from "@/store/reports-store";
import { toast } from "sonner";

interface ReportViewClientProps {
  report: SavedReport;
  voters: Voter[];
}

export function ReportViewClient({ report, voters }: ReportViewClientProps) {
  const { exportReport } = useReportsStore();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: "pdf" | "csv" | "excel") => {
    setIsExporting(true);
    try {
      await exportReport(report.id, format);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <ReportPreview
          data={voters}
          columns={report.columns as (keyof Voter)[]}
          filters={report.filters}
          sorting={report.sorting}
          onExport={handleExport}
          isExporting={isExporting}
        />
      </CardContent>
    </Card>
  );
}

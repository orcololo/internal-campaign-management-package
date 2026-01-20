"use client";

// This component is deprecated and replaced by the dashboard page
// Keeping for backward compatibility if needed

import { StatsCards } from "./stats-cards";
import { LeadsChart } from "./leads-chart";
import { TopPerformers } from "./top-performers";
import { LeadsTable } from "./leads-table";

export function DashboardContent() {
  return (
    <main className="flex-1 overflow-auto p-4 sm:p-6 space-y-6 bg-background w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
            Bem-vindo de volta!
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Vamos começar o trabalho
          </p>
        </div>
      </div>
      <StatsCards />
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        <LeadsChart />
        <TopPerformers />
      </div>
      <LeadsTable />
    </main>
  );
}

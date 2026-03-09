import { createFileRoute } from "@tanstack/react-router";
import { UnderDevelopmentAdvice } from "./~components/-under-development-advice";
import { TransactionsOverview } from "./~components/analytics-information/-transactions-overview";

export const Route = createFileRoute("/admin/_overview/dashboard/")({
  component: DashboardPage,
  head: () => ({
    meta: [{ title: "Dashboard | Terra & Tallow" }],
  }),
});

function DashboardPage() {
  return (
    <main className="container space-y-8 px-4">
      <div className="flex items-center gap-4">
        <h1 className="font-semibold text-3xl">Overview</h1>

        <UnderDevelopmentAdvice />
      </div>

      <TransactionsOverview />
    </main>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { PaymentsTable } from "./~components/-payments-table";

export const Route = createFileRoute("/admin/_primary/payments/")({
  component: PaymentsPage,
  head: () => ({
    meta: [{ title: "Produtos | Terra & Tallow" }],
  }),
});

function PaymentsPage() {
  return (
    <main className="container space-y-8 p-4">
      {/* <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AnalyticsCard />
      </div> */}

      <PaymentsTable />
    </main>
  );
}

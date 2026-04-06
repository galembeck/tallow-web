import { createFileRoute } from "@tanstack/react-router";
import { CouponsTable } from "./~components/-coupons-table";

export const Route = createFileRoute("/admin/_primary/coupons/")({
  component: CouponsPage,
  head: () => ({
    meta: [{ title: "Cupons | Terra & Tallow" }],
  }),
});

function CouponsPage() {
  return (
    <main className="container space-y-8 p-4">
      <CouponsTable />
    </main>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { ClientsTable } from "./~components/-clients-table";

export const Route = createFileRoute("/admin/_primary/clients/")({
  component: ClientsPage,
  head: () => ({
    meta: [{ title: "Clientes | Terra & Tallow" }],
  }),
});

function ClientsPage() {
  return (
    <main className="container space-y-8 p-4">
      <ClientsTable />
    </main>
  );
}

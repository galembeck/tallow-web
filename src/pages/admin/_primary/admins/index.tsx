import { createFileRoute } from "@tanstack/react-router";
import { AdminsTable } from "./~components/-admins-table";

export const Route = createFileRoute("/admin/_primary/admins/")({
  component: AdminsPage,
  head: () => ({
    meta: [{ title: "Administradores | Terra & Tallow" }],
  }),
});

function AdminsPage() {
  return (
    <main className="container space-y-8 p-4">
      <AdminsTable />
    </main>
  );
}

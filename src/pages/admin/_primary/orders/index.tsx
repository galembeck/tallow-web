import { createFileRoute } from "@tanstack/react-router";
import { OrdersTable } from "./~components/-orders-table";

export const Route = createFileRoute("/admin/_primary/orders/")({
  component: OrdersPage,
  head: () => ({
    meta: [{ title: "Pedidos | Terra & Tallow" }],
  }),
});

function OrdersPage() {
  return (
    <main className="container space-y-8 p-4">
      <OrdersTable />
    </main>
  );
}

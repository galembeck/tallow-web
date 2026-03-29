import { createFileRoute } from "@tanstack/react-router";
import { ProductsTable } from "./~components/-products-table";

export const Route = createFileRoute("/admin/_primary/products/")({
  component: ProductsPage,
  head: () => ({
    meta: [{ title: "Produtos | Terra & Tallow" }],
  }),
});

function ProductsPage() {
  return (
    <main className="container space-y-8 p-4">
      {/* <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AnalyticsCard />
      </div> */}

      <ProductsTable />
    </main>
  );
}

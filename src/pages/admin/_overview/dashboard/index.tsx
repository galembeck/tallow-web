import { createFileRoute } from "@tanstack/react-router";
import { UnderDevelopmentAdvice } from "./~components/-under-development-advice";
import { TransactionsOverview } from "./~components/analytics-information/-transactions-overview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Box, Receipt, User } from "lucide-react";
import { ProductsTable } from "../../_primary/products/~components/-products-table";
import { PayedOrdersCard } from "./~components/-payed-orders-card";
import { ChartLineInteractive } from "./~components/-chart-area-interactive";

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

      <Tabs defaultValue="payments">
        <TabsList>
          <TabsTrigger value="payments">
            <Receipt />
            Pagamentos
          </TabsTrigger>

          <TabsTrigger value="clients">
            <User />
            Clientes
          </TabsTrigger>

          <TabsTrigger value="products">
            <Box />
            Produtos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="payments">
          {/*<PaymentsTable />*/}
          <h1>Tabela de Pagamentos</h1>
        </TabsContent>

        <TabsContent value="clients">
          {/*<ClientsTable />*/}
          <h1>Tabela de Clientes</h1>
        </TabsContent>

        <TabsContent value="products">
          <ProductsTable layout="summary" />
        </TabsContent>
      </Tabs>

      <div className="flex w-full flex-col gap-4 xl:flex-row">
        <PayedOrdersCard />

        <ChartLineInteractive />
      </div>
    </main>
  );
}

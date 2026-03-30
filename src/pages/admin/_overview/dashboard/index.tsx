import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createFileRoute } from "@tanstack/react-router";
import { Banknote, Box, ShoppingBag, User } from "lucide-react";
import { OrdersTable } from "../../_primary/orders/~components/-orders-table";
import { PaymentsTable } from "../../_primary/payments/~components/-payments-table";
import { ProductsTable } from "../../_primary/products/~components/-products-table";
import { ChartAreaInteractive } from "./~components/-chart-area-interactive";
import { PayedOrdersCard } from "./~components/-payed-orders-card";
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

      <Tabs defaultValue="payments">
        <TabsList>
          <TabsTrigger value="payments">
            <Banknote />
            Pagamentos
          </TabsTrigger>

          <TabsTrigger value="orders">
            <Box />
            Pedidos
          </TabsTrigger>

          <TabsTrigger value="clients">
            <User />
            Clientes
          </TabsTrigger>

          <TabsTrigger value="products">
            <ShoppingBag />
            Produtos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="payments">
          <PaymentsTable layout="summary" />
        </TabsContent>

        <TabsContent value="orders">
          <OrdersTable layout="summary" />
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

        <ChartAreaInteractive />
      </div>
    </main>
  );
}

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SECTION_META } from "@/constants/public/profile/section-meta";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { OrdersHistoryTable } from "./~components/-orders-history-table";
import { useOrder } from "@/hooks/services/use-order";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_public/profile/orders-history/")({
  component: ProfileOrdersHistoryPage,
  head: () => ({
    meta: [{ title: "Histórico de pedido | Terra & Tallow" }],
  }),
});

function ProfileOrdersHistoryPage() {
  const navigate = useNavigate();

  const { title, description } = SECTION_META.orders;

  const { userOrders, isUserOrdersLoading } = useOrder({
    enableUserOrdersQuery: true,
  });

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <Card>
        <CardHeader>
          <CardTitle className="font-bold text-xl text-amber-950">
            {title}
          </CardTitle>

          <CardDescription>{description}</CardDescription>
        </CardHeader>

        <Separator />

        <CardContent>
          {!userOrders || userOrders.length === 0 ? (
            <article className="flex flex-col items-center justify-center gap-4 py-16">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <ShoppingBag className="h-8 w-8 text-muted-foreground" />
              </div>

              <div className="text-center">
                <h3 className="font-semibold text-lg">
                  Nenhum pedido encontrado
                </h3>

                <p className="text-muted-foreground text-sm mt-1">
                  Você ainda não realizou nenhum pedido em nossa loja.
                </p>
              </div>

              <Button
                className="cursor- bg-amber-900 hover:bg-amber-900/90 text-white"
                onClick={() => navigate({ to: "/products" })}
              >
                Ver produtos
              </Button>
            </article>
          ) : (
            <OrdersHistoryTable
              userOrders={userOrders}
              isUserOrdersLoading={isUserOrdersLoading}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

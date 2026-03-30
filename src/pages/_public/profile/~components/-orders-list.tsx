import { OrderCard } from "@/components/order-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { OrderResponseDTO } from "@/types/services/order";
import { useNavigate } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";

interface OrdersListProps {
  orders: OrderResponseDTO[] | undefined;
  isLoading: boolean;
}

export function OrdersList({ orders, isLoading }: OrdersListProps) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        Carregando pedidos...
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-4 py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <ShoppingBag className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-lg">Nenhum pedido encontrado</h3>
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
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}

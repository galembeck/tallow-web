import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Package, Truck } from "lucide-react";

interface OrderHeaderProps {
  orderId: string;
  canPrepare: boolean;
  canShip: boolean;
  isPreparingOrder: boolean;
  isShippingOrder: boolean;
  paymentId?: string;
  onNavigateBack: () => void;
  onNavigatePayment: () => void;
  onPrepare: () => void;
  onShip: () => void;
}

export function OrderHeader({
  orderId,
  canPrepare,
  canShip,
  isPreparingOrder,
  isShippingOrder,
  paymentId,
  onNavigateBack,
  onNavigatePayment,
  onPrepare,
  onShip,
}: OrderHeaderProps) {
  return (
    <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
      <div className="flex gap-4">
        <Button variant="secondary" className="mt-1" onClick={onNavigateBack}>
          <ArrowLeft />
        </Button>

        <article>
          <h1 className="font-semibold text-2xl tracking-tight">
            Detalhes do pedido
          </h1>
          <p className="text-muted-foreground text-sm">
            Veja os detalhes do pedido realizado em nossa plataforma
          </p>

          <Badge variant="secondary" className="mt-4 font-mono text-xs">
            ID: {orderId}
          </Badge>
        </article>
      </div>

      <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
        {canPrepare && (
          <Button
            variant="outline"
            className="flex-1 md:flex-none cursor-pointer"
            onClick={onPrepare}
            disabled={isPreparingOrder}
          >
            <Package className="h-4 w-4" />
            {isPreparingOrder ? "Processando..." : "Marcar em preparação"}
          </Button>
        )}

        {canShip && (
          <Button
            className="flex-1 md:flex-none cursor-pointer"
            onClick={onShip}
            disabled={isShippingOrder}
          >
            <Truck className="h-4 w-4" />
            {isShippingOrder ? "Enviando..." : "Enviar pedido"}
          </Button>
        )}

        {paymentId && (
          <Button
            variant="outline"
            className="flex-1 md:flex-none cursor-pointer"
            onClick={onNavigatePayment}
          >
            <ExternalLink className="h-4 w-4" />
            Ver pagamento
          </Button>
        )}
      </div>
    </div>
  );
}

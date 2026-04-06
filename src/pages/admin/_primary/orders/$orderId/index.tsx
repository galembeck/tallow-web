import { API } from "@/api/connections/tallow";
import { Card, CardContent } from "@/components/ui/card";
import { useOrder } from "@/hooks/services/use-order";
import { normalizeOrderStatus } from "@/types/enums/order-status";
import { ShippingService } from "@/types/enums/shipping-service";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { OrderBuyerInfo } from "./~components/-order-buyer-info";
import { OrderHeader } from "./~components/-order-header";
import { OrderItems } from "./~components/-order-items";
import { OrderLoading } from "./~components/page-states/-order-loading";
import { OrderNotFound } from "./~components/page-states/-order-not-found";
import { OrderSummary } from "./~components/-order-summary";
import { ShippingResultCard } from "./~components/-shipping-result-card";

export const Route = createFileRoute("/admin/_primary/orders/$orderId/")({
  component: OrderDetailsPage,
  head: () => ({
    meta: [{ title: "Detalhes do pedido | Terra & Tallow" }],
  }),
});

function resolveServiceId(serviceName: string): number {
  const name = serviceName.toLowerCase();
  if (name.includes("sedex")) return ShippingService.SEDEX;
  if (name.includes("mini")) return ShippingService.MINI_ENVIOS;
  if (name.includes("jadlog")) return ShippingService.JADLOG;
  if (name.includes("loggi")) return ShippingService.LOGGI;
  return ShippingService.PAC;
}

function OrderDetailsPage() {
  const navigate = useNavigate();
  const { orderId } = Route.useParams();

  const [hasShipped, setHasShipped] = useState(false);

  const {
    adminOrder,
    isAdminOrderLoading,
    prepareOrder,
    isPreparingOrder,
    shipOrder,
    isShippingOrder,
    cancelShipment,
    isCancellingShipment,
    adminShippingStatus,
    isAdminShippingLoading,
  } = useOrder({
    orderId,
    enableAdminOrderQuery: true,
    enableAdminShippingQuery: true,
  });

  if (isAdminOrderLoading) return <OrderLoading />;
  if (!adminOrder) return <OrderNotFound />;

  const order = adminOrder;
  const normalizedStatus = normalizeOrderStatus(String(order.status));
  const isShipped = normalizedStatus === "SHIPPED";

  async function handlePrepare() {
    try {
      await prepareOrder(orderId);
      toast.success("Pedido marcado como em preparação.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erro ao preparar pedido.",
      );
    }
  }

  async function handleShip() {
    try {
      const serviceId = resolveServiceId(order.shippingInfo.shippingService);
      await shipOrder({ id: orderId, data: { serviceId } });
      setHasShipped(true);
      toast.success("Pedido enviado com sucesso!");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erro ao enviar pedido.",
      );
    }
  }

  async function handleCancelShipment() {
    try {
      await cancelShipment(orderId);
      setHasShipped(false);
      toast.success("Envio cancelado. Pedido voltou para preparação.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erro ao cancelar envio.",
      );
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8">
      <OrderHeader
        orderId={order.id}
        canPrepare={normalizedStatus === "PAYMENT_APPROVED"}
        canShip={normalizedStatus === "PROCESSING"}
        canCancelShipment={normalizedStatus === "SHIPPED"}
        isPreparingOrder={isPreparingOrder}
        isShippingOrder={isShippingOrder}
        isCancellingShipment={isCancellingShipment}
        paymentId={order.payment?.id}
        onNavigateBack={() => navigate({ to: "/admin/orders" })}
        onNavigatePayment={() =>
          navigate({
            to: "/admin/payments/$paymentId",
            params: { paymentId: order.payment!.id },
          })
        }
        onPrepare={handlePrepare}
        onShip={handleShip}
        onCancelShipment={handleCancelShipment}
      />

      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <OrderBuyerInfo
              buyerInfo={order.buyerInfo}
              shippingInfo={order.shippingInfo}
              shippingAmount={order.shippingAmount}
            />

            <div className="flex flex-col gap-6">
              <OrderSummary
                status={order.status}
                subTotalAmount={order.subTotalAmount}
                shippingAmount={order.shippingAmount}
                totalAmount={order.totalAmount}
                payment={order.payment}
              />

              <OrderItems items={order.items} />
            </div>
          </div>
        </CardContent>
      </Card>

      {(isShipped || hasShipped) && (
        <ShippingResultCard
          result={adminShippingStatus}
          onPrintLabel={() =>
            window.open(
              `${API.baseURL}/order/admin/${orderId}/label`,
              "_blank",
            )
          }
          isLoading={isAdminShippingLoading || !adminShippingStatus}
        />
      )}
    </main>
  );
}

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/services/use-cart";
import { useOrder } from "@/hooks/services/use-order";
import { cn } from "@/lib/utils";
import {
  getOrderStatusColor,
  normalizeOrderStatus,
  orderStatusLabel,
} from "@/types/enums/order-status";
import { formatDate } from "@/utils/format-date";
import { formatWhatsApp } from "@/utils/format-masks";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { paymentMethodLabel } from "@/types/enums/payment-method";
import { CreditCard, ShoppingCart, Tag, Truck } from "lucide-react";
import { OrderInformationCard } from "./~components/-order-information-card";
import { OrderTimeline } from "./~components/-order-status-timeline";
import { toast } from "sonner";
import { useState } from "react";
import { OrderCancellationModal } from "./~components/-order-cancellation-modal";
import { OrderItemCard } from "./~components/-order-item-card";
import { OrderDetailsSkeleton } from "./~components/_related/-order-details-skeleton";
import { OrderNotFound } from "./~components/_related/-order-not-found";

export const Route = createFileRoute(
  "/_public/profile/orders-history/$orderId/",
)({
  component: ProfileOrderHistoryDetailsPage,
  head: () => ({
    meta: [{ title: "Detalhes do pedido | Terra & Tallow" }],
  }),
});

function ProfileOrderHistoryDetailsPage() {
  const navigate = useNavigate();

  const { orderId } = Route.useParams();

  const { addItem } = useCart();
  const { order, isOrderLoading, cancelOrder, isCancellingOrder } = useOrder({
    orderId,
    enableUserOrdersQuery: true,
  });

  const [isReordering, setIsReordering] = useState(false);

  const [openCancellationModal, setOpenCancellationModal] = useState(false);

  if (isOrderLoading) {
    return <OrderDetailsSkeleton />;
  }

  if (!order) {
    return <OrderNotFound />;
  }

  const handleReorder = async () => {
    setIsReordering(true);
    try {
      const addPromises = order.items.map((item) =>
        addItem({
          productId: item.productId,
          quantity: item.quantity,
        }),
      );

      await Promise.all(addPromises);

      toast.success("Itens adicionados ao carrinho!", {
        description: "Acesse o carrinho para finalizar a nova compra.",
      });

      navigate({ to: "/cart" });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Erro ao adicionar os produtos!", {
        description:
          "Alguns itens podem estar indisponíveis no momento, tente novamente mais tarde.",
      });
    } finally {
      setIsReordering(false);
    }
  };

  const normalizedStatus = normalizeOrderStatus(String(order.status));
  const canCancel = !["SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"].includes(normalizedStatus);

  return (
    <Card>
      <CardHeader className="flex flex-col gap-8">
        <CardTitle className="font-bold text-xl text-amber-950 font-sagona">
          Pedido #{order.id.slice(0, 8).toUpperCase()}
        </CardTitle>

        <Separator />

        <article className="flex flex-wrap items-center justify-between gap-4 w-full">
          <div className="flex items-center gap-1">
            <p className="text-amber-950 font-semibold">Data:</p>

            <span>
              {formatDate(order.createdAt).slice(0, 10)} às{" "}
              {formatDate(order.createdAt).slice(11, 16)}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <p className="text-amber-950 font-semibold">Status:</p>

            <span
              className={cn(
                `text-${getOrderStatusColor(normalizedStatus)} hover:bg-white`,
              )}
            >
              {orderStatusLabel[normalizedStatus] ?? normalizedStatus}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <p className="text-amber-950 font-semibold">Previsão de entrega:</p>

            <span>{order.shippingInfo.shippingDeliveryTime}</span>
          </div>
        </article>
      </CardHeader>

      <CardContent className="flex flex-col gap-8">
        <OrderTimeline status={normalizedStatus} updatedAt={order.createdAt} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <OrderInformationCard title="Método de pagamento" className="flex flex-col gap-2">
            {order.payment ? (
              <>
                <div className="flex items-center gap-2 text-sm text-black/80">
                  <CreditCard className="w-4 h-4 shrink-0 text-amber-900" />
                  <span className="font-semibold">
                    {paymentMethodLabel[String(order.payment.paymentMethod)] ?? String(order.payment.paymentMethod)}
                  </span>
                </div>
                <p className="text-sm text-black/60">
                  Valor: R$ {Number(order.payment.transactionAmount).toFixed(2)}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Pagamento não encontrado.</p>
            )}
          </OrderInformationCard>

          <OrderInformationCard
            title="Endereço de entrega"
            className="flex flex-col gap-1"
          >
            <p className="text-sm text-black/80">
              {order.buyerInfo.name} |{" "}
              {formatWhatsApp(order.buyerInfo.cellphone ?? "")}
            </p>
            <p className="text-sm text-black/80">
              {order.shippingInfo.shippingAddress},{" "}
              {order.shippingInfo.shippingNumber} -{" "}
              {order.shippingInfo.shippingNeighborhood}
            </p>
            <p className="text-sm text-black/80">
              {order.shippingInfo.shippingCity},{" "}
              {order.shippingInfo.shippingState} -{" "}
              {order.shippingInfo.shippingZipcode}
            </p>
          </OrderInformationCard>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-amber-950 font-semibold text-xl">
              Detalhes do pedido
            </h1>

            <article className="flex items-center gap-2">
              {canCancel && (
                <Button
                  variant="ghost"
                  className="uppercase text-red-600/80 font-semibold hover:bg-inherit hover:text-red-600"
                  onClick={() => setOpenCancellationModal(true)}
                  disabled={isCancellingOrder}
                >
                  {isCancellingOrder ? "Cancelando..." : "Cancelar pedido"}
                </Button>
              )}

              <Button
                className="bg-lime-800/80 hover:bg-lime-800/90 font-medium"
                onClick={handleReorder}
                disabled={isReordering}
              >
                <ShoppingCart />
                {isReordering ? "Comprando..." : "Comprar novamente"}
              </Button>
            </article>
          </div>

          {order.items.map((item) => (
            <OrderItemCard
              key={item.productId}
              imageUrl={item.productImageUrl ?? ""}
              name={item.productName}
              unitPrice={item.unitPrice}
              quantity={item.quantity}
            />
          ))}

          <div className="bg-amber-900/10 rounded-lg p-4 min-w-60 flex flex-col gap-4">
            <h2 className="text-amber-950 font-semibold text-lg">
              Resumo do pedido
            </h2>

            <Separator className="bg-muted-foreground/30" />

            <div className="flex flex-col gap-4">
              <article className="flex items-center justify-between">
                <p className="flex items-center gap-2 text-amber-950 font-semibold">
                  <ShoppingCart className="w-4 h-4" />
                  Subtotal
                </p>

                <span className="text-amber-950 font-bold">
                  R$ {order.subTotalAmount}
                </span>
              </article>

              <article className="flex items-center justify-between">
                <p className="flex items-center gap-2 text-amber-950 font-semibold">
                  <Truck className="w-4 h-4" />
                  Frete
                </p>

                <span className="text-amber-950 font-bold">
                  R$ {order.shippingAmount}
                </span>
              </article>

              {order.discountAmount && order.discountAmount > 0 ? (
                <article className="flex items-center justify-between">
                  <p className="flex items-center gap-2 text-green-700 font-semibold">
                    <Tag className="w-4 h-4" />
                    Desconto{order.couponCode ? ` (${order.couponCode})` : ""}
                  </p>

                  <span className="text-green-700 font-bold">
                    - R$ {Number(order.discountAmount).toFixed(2)}
                  </span>
                </article>
              ) : null}
            </div>

            <Separator className="bg-muted-foreground/30" />

            <article className="flex items-center justify-between">
              <h2 className="text-amber-950 font-bold uppercase">
                Total do pedido
              </h2>

              <span className="text-amber-950 font-bold text-lg">
                R$ {order.totalAmount}
              </span>
            </article>
          </div>
        </div>
      </CardContent>

      <OrderCancellationModal
        onConfirm={async () => {
          try {
            await cancelOrder(order.id);
            setOpenCancellationModal(false);
            toast.success("Pedido cancelado com sucesso!");
          } catch {
            toast.error("Erro ao cancelar pedido. Tente novamente.");
          }
        }}
        onOpenChange={setOpenCancellationModal}
        open={openCancellationModal}
        orderId={order.id.slice(0, 8)}
      />
    </Card>
  );
}

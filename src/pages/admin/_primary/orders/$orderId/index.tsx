import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useOrder } from "@/hooks/services/use-order";
import { orderStatusLabel } from "@/types/enums/order-status";
import { paymentMethodLabel } from "@/types/enums/payment-method";
import { paymentStatusLabel } from "@/types/enums/payment-status";
import { formatCurrency } from "@/utils/format-currency";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { OrderLoading } from "./~components/-order-loading";
import { OrderNotFound } from "./~components/-order-not-found";

export const Route = createFileRoute("/admin/_primary/orders/$orderId/")({
  component: OrderDetailsPage,
  head: () => ({
    meta: [{ title: "Detalhes do pedido | Terra & Tallow" }],
  }),
});

function orderStatusVariant(
  status: string,
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "DELIVERED":
      return "default";
    case "CANCELLED":
    case "REFUNDED":
      return "destructive";
    case "SHIPPED":
      return "outline";
    default:
      return "secondary";
  }
}

function paymentStatusVariant(
  status: string,
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "APPROVED":
      return "default";
    case "REJECTED":
    case "CANCELLED":
    case "CHARGED_BACK":
      return "destructive";
    default:
      return "secondary";
  }
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
        {label}
      </span>
      <span className="text-sm font-medium">{value ?? "—"}</span>
    </div>
  );
}

function OrderDetailsPage() {
  const navigate = useNavigate();
  const { orderId } = Route.useParams();
  const { adminOrder, isAdminOrderLoading } = useOrder({
    orderId,
    enableAdminOrderQuery: true,
  });

  if (isAdminOrderLoading) {
    return <OrderLoading />;
  }

  if (!adminOrder) {
    return <OrderNotFound />;
  }

  const order = adminOrder;

  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex gap-4">
          <Button
            variant="secondary"
            className="mt-1"
            onClick={() => navigate({ to: "/admin/orders" })}
          >
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
              ID: {order.id}
            </Badge>
          </article>
        </div>

        {order.payment?.id && (
          <Button
            variant="outline"
            className="w-full md:w-fit cursor-pointer"
            onClick={() =>
              navigate({
                to: "/admin/payments/$paymentId",
                params: { paymentId: order.payment!.id },
              })
            }
          >
            <ExternalLink className="h-4 w-4" />
            Ver pagamento
          </Button>
        )}
      </div>

      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="flex flex-col gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-4">
                  Informações do comprador
                </h3>
                <Separator className="mb-4" />
                <div className="grid grid-cols-2 gap-4">
                  <InfoRow label="Nome" value={order.buyerInfo.name} />
                  <InfoRow label="Email" value={order.buyerInfo.email} />
                  <InfoRow label="Telefone" value={order.buyerInfo.cellphone} />
                  <InfoRow
                    label="CPF"
                    value={<span>{order.buyerInfo.document}</span>}
                  />
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-base mb-4">
                  Endereço de entrega
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <InfoRow
                    label="CEP"
                    value={<span>{order.shippingInfo.shippingZipcode}</span>}
                  />
                  <InfoRow
                    label="Bairro"
                    value={order.shippingInfo.shippingNeighborhood}
                  />
                  <div className="col-span-2">
                    <InfoRow
                      label="Endereço"
                      value={[
                        order.shippingInfo.shippingAddress,
                        order.shippingInfo.shippingNumber,
                        order.shippingInfo.shippingComplement,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    />
                  </div>
                  <InfoRow
                    label="Cidade/Estado"
                    value={`${order.shippingInfo.shippingCity}, ${order.shippingInfo.shippingState}`}
                  />
                  <InfoRow
                    label="Serviço de entrega"
                    value={order.shippingInfo.shippingService}
                  />
                  <InfoRow
                    label="Prazo estimado"
                    value={order.shippingInfo.shippingDeliveryTime}
                  />
                  <InfoRow
                    label="Valor do frete"
                    value={formatCurrency(order.shippingAmount)}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-4">Resumo do pedido</h3>
                <Separator className="mb-4" />

                <div className="mb-4">
                  <InfoRow
                    label="Status"
                    value={
                      <Badge
                        variant={orderStatusVariant(String(order.status))}
                        className="uppercase"
                      >
                        {orderStatusLabel[String(order.status)] ??
                          String(order.status)}
                      </Badge>
                    }
                  />
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                      Subtotal
                    </p>
                    <p className="mt-1 font-semibold text-sm">
                      {formatCurrency(order.subTotalAmount)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                      Frete
                    </p>
                    <p className="mt-1 font-semibold text-sm">
                      {formatCurrency(order.shippingAmount)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                      Total
                    </p>
                    <p className="mt-1 font-semibold text-amber-900 text-sm">
                      {formatCurrency(order.totalAmount)}
                    </p>
                  </div>
                </div>

                {order.payment && (
                  <div className="border rounded-lg p-4 mt-2">
                    <h4 className="font-semibold text-sm mb-3">Pagamento</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <InfoRow
                        label="Status"
                        value={
                          <Badge
                            variant={paymentStatusVariant(
                              String(order.payment.status),
                            )}
                            className="uppercase text-xs"
                          >
                            {paymentStatusLabel[String(order.payment.status)] ??
                              String(order.payment.status)}
                          </Badge>
                        }
                      />
                      <InfoRow
                        label="Método"
                        value={
                          paymentMethodLabel[
                            String(order.payment.paymentMethod)
                          ] ?? String(order.payment.paymentMethod)
                        }
                      />
                      <InfoRow
                        label="Valor"
                        value={formatCurrency(order.payment.transactionAmount)}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-4">Itens do pedido</h3>
                <Separator className="mb-4" />

                <div className="flex flex-col gap-3 max-h-96 overflow-y-auto pr-1">
                  {order.items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center gap-3 rounded-lg border p-3"
                    >
                      {item.productImageUrl ? (
                        <img
                          src={item.productImageUrl}
                          alt={item.productName}
                          className="h-10 w-10 rounded-md object-cover shrink-0"
                          loading="lazy"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-md bg-gray-100 shrink-0" />
                      )}

                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {item.productName}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {formatCurrency(item.unitPrice)} x {item.quantity}
                        </p>
                      </div>

                      <span className="font-semibold text-sm shrink-0">
                        {formatCurrency(item.subTotal)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

import {
  normalizeOrderStatus,
  orderStatusLabel,
} from "@/types/enums/order-status";
import type { OrderResponseDTO } from "@/types/services/order";
import { formatCurrency } from "@/utils/format-currency";
import { format } from "date-fns";
import { Box, Package, Truck } from "lucide-react";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";
import { InfoRow } from "./info-row";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

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

interface OrderCardProps {
  order: OrderResponseDTO;
}

export function OrderCard({ order }: OrderCardProps) {
  const status = normalizeOrderStatus(String(order.status));

  return (
    <Card>
      <CardContent className="pt-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between sm:justify-normal items-center gap-2 flex-wrap">
              <span className="font-mono font-semibold">
                PEDIDO #{order.id.slice(0, 8).toUpperCase()}
              </span>

              <Badge
                variant={orderStatusVariant(status)}
                className="uppercase font-semibold"
              >
                {orderStatusLabel[status] ?? status}
              </Badge>
            </div>

            <p className="text-muted-foreground text-xs">
              {format(new Date(order.createdAt), "dd/MM/yyyy 'às' HH:mm")}
            </p>
          </div>

          <div className="flex items-center gap-6 sm:text-right">
            <div className="flex flex-col gap-0.5">
              <span className="text-muted-foreground font-bold text-center text-sm uppercase tracking-wide">
                Itens
              </span>

              <span className="font-medium text-center">
                {order.items.length}
              </span>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-muted-foreground font-bold text-center text-sm uppercase tracking-wide">
                Total
              </span>

              <span className="font-semibold text-center">
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        <Separator className="mt-4" />

        <Accordion className="w-full" type="multiple">
          <AccordionItem className="py-2" value="shippingDetails">
            <AccordionTrigger className="cursor-pointer hover:no-underline">
              <h3 className="font-semibold flex items-center gap-2 text-base">
                <Truck className="text-amber-900 w-5 h-5" />
                Detalhes da entrega
              </h3>
            </AccordionTrigger>

            <AccordionContent className="grid grid-cols-2 gap-4 mt-4">
              <InfoRow
                label="Endereço"
                value={order.shippingInfo.shippingAddress}
              />

              <InfoRow
                label="Número"
                value={order.shippingInfo.shippingNumber}
              />

              <InfoRow
                label="Complemento"
                value={
                  order.shippingInfo.shippingComplement
                    ? order.shippingInfo.shippingComplement
                    : "—"
                }
              />

              <InfoRow
                label="Bairro"
                value={order.shippingInfo.shippingNeighborhood}
              />

              <InfoRow label="Cidade" value={order.shippingInfo.shippingCity} />

              <InfoRow
                label="Estado"
                value={order.shippingInfo.shippingState}
              />

              <InfoRow label="CEP" value={order.shippingInfo.shippingZipcode} />
            </AccordionContent>
          </AccordionItem>

          {order.items.length > 0 && (
            <>
              <Separator />

              <AccordionItem className="pt-2" value="orderDetails">
                <AccordionTrigger className="cursor-pointer hover:no-underline">
                  <h3 className="font-semibold flex items-center gap-2 text-base">
                    <Box className="text-amber-900 w-5 h-5" />
                    Detalhes do pedido
                  </h3>
                </AccordionTrigger>

                <AccordionContent>
                  {order.items.length > 0 && (
                    <>
                      <div className="flex gap-2 overflow-x-auto pb-1 mt-4">
                        {order.items.slice(0, 4).map((item) => (
                          <div
                            key={item.productId}
                            className="flex shrink-0 items-center gap-2 rounded-md border px-3 py-2"
                          >
                            {item.productImageUrl ? (
                              <img
                                src={item.productImageUrl}
                                alt={item.productName}
                                className="h-8 w-8 rounded object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                                <Package className="h-4 w-4 text-muted-foreground" />
                              </div>
                            )}

                            <div className="flex flex-col">
                              <span className="text-xs font-medium max-w-28 truncate">
                                {item.productName}
                              </span>

                              <span className="text-xs text-muted-foreground">
                                {item.quantity}x{" "}
                                {formatCurrency(item.unitPrice)}
                              </span>
                            </div>
                          </div>
                        ))}

                        {order.items.length > 4 && (
                          <div className="flex shrink-0 items-center rounded-md border px-3 py-2">
                            <span className="text-xs text-muted-foreground">
                              +{order.items.length - 4} itens
                            </span>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </AccordionContent>
              </AccordionItem>
            </>
          )}
        </Accordion>
      </CardContent>
    </Card>
  );
}

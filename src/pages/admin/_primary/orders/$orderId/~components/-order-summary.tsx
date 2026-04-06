import { Badge } from "@/components/ui/badge";
import { InfoRow } from "@/components/info-row";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/utils/format-currency";
import {
  normalizeOrderStatus,
  orderStatusLabel,
  type OrderStatus,
} from "@/types/enums/order-status";
import { paymentMethodLabel } from "@/types/enums/payment-method";
import { paymentStatusLabel } from "@/types/enums/payment-status";
import type { PaymentSummaryDTO } from "@/types/services/order";
import { Tag } from "lucide-react";

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

interface OrderSummaryProps {
  status: OrderStatus;
  subTotalAmount: number;
  shippingAmount: number;
  totalAmount: number;
  payment?: PaymentSummaryDTO | null;
  couponCode?: string | null;
  discountPercentage?: number | null;
  discountAmount?: number | null;
}

export function OrderSummary({
  status,
  subTotalAmount,
  shippingAmount,
  totalAmount,
  payment,
  couponCode,
  discountPercentage,
  discountAmount,
}: OrderSummaryProps) {
  const normalizedStatus = normalizeOrderStatus(String(status));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="font-semibold text-lg mb-4">Resumo do pedido</h3>
        <Separator className="mb-4" />

        <div className="mb-4">
          <InfoRow
            label="Status"
            value={
              <Badge
                variant={orderStatusVariant(normalizedStatus)}
                className="uppercase"
              >
                {orderStatusLabel[normalizedStatus] ?? normalizedStatus}
              </Badge>
            }
          />
        </div>

        <div className={`grid gap-4 mb-4 ${discountAmount ? "grid-cols-2" : "grid-cols-3"}`}>
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
              Subtotal
            </p>
            <p className="mt-1 font-semibold text-sm">
              {formatCurrency(subTotalAmount)}
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
              Frete
            </p>
            <p className="mt-1 font-semibold text-sm">
              {formatCurrency(shippingAmount)}
            </p>
          </div>
          {discountAmount ? (
            <div className="rounded-lg bg-green-50 border border-green-200 p-3">
              <p className="text-green-700 text-xs font-medium uppercase tracking-wide flex items-center gap-1">
                <Tag className="h-3 w-3" />
                Desconto
                {couponCode && (
                  <span className="font-mono lowercase normal-case">({couponCode})</span>
                )}
              </p>
              <p className="mt-1 font-semibold text-sm text-green-700">
                - {formatCurrency(discountAmount)}
                {discountPercentage && (
                  <span className="text-xs ml-1 font-normal">({discountPercentage}%)</span>
                )}
              </p>
            </div>
          ) : null}
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
              Total
            </p>
            <p className="mt-1 font-semibold text-amber-900 text-sm">
              {formatCurrency(totalAmount)}
            </p>
          </div>
        </div>

        {payment && (
          <div className="border rounded-lg p-4 mt-2">
            <h4 className="font-semibold text-sm mb-3">Pagamento</h4>
            <div className="grid grid-cols-2 gap-3">
              <InfoRow
                label="Status"
                value={
                  <Badge
                    variant={paymentStatusVariant(String(payment.status))}
                    className="uppercase text-xs"
                  >
                    {paymentStatusLabel[String(payment.status)] ??
                      String(payment.status)}
                  </Badge>
                }
              />
              <InfoRow
                label="Método"
                value={
                  paymentMethodLabel[String(payment.paymentMethod)] ??
                  String(payment.paymentMethod)
                }
              />
              <InfoRow
                label="Valor"
                value={formatCurrency(payment.transactionAmount)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

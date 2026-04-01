import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/utils/format-currency";
import type { OrderItemDTO } from "@/types/services/order";

interface OrderItemsProps {
  items: OrderItemDTO[];
}

export function OrderItems({ items }: OrderItemsProps) {
  return (
    <div>
      <h3 className="font-semibold text-lg mb-4">Itens do pedido</h3>
      <Separator className="mb-4" />

      <div className="flex flex-col gap-3 max-h-96 overflow-y-auto pr-1">
        {items.map((item) => (
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
              <p className="font-medium text-sm truncate">{item.productName}</p>
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
  );
}

import { formatCurrency } from "@/utils/format-currency";

interface OrderItemCardProps {
  imageUrl: string;
  name: string;
  unitPrice: number;
  quantity: number;
}

export function OrderItemCard({
  imageUrl,
  name,
  unitPrice,
  quantity,
}: OrderItemCardProps) {
  return (
    <div className="bg-white border border-muted-foreground/20 rounded-lg p-4 flex flex-col md:flex-row items-center gap-6">
      <div className="flex items-center gap-6">
        <div className="shrink-0 border border-muted-foreground/20 rounded-md p-2 flex items-center justify-center bg-gray-50">
          <img src={imageUrl} alt={name} className="w-16 h-16 object-contain" />
        </div>

        <div className="flex-1 text-center md:text-left">
          <h2 className="text-amber-950 font-semibold text-lg leading-tight">
            {name}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 md:gap-12 w-full md:w-auto border-t md:border-none pt-4 md:pt-0">
        <article className="flex flex-col items-center gap-1">
          <p className="text-sky-600 font-medium text-[10px] uppercase tracking-wider">
            Unitário (R$)
          </p>
          <span className="text-amber-950 font-bold text-base whitespace-nowrap">
            {formatCurrency(unitPrice)}
          </span>
        </article>

        <article className="flex flex-col items-center gap-1">
          <p className="text-sky-600 font-medium text-[10px] uppercase tracking-wider">
            Quantidade
          </p>
          <span className="text-amber-950 font-bold text-base text-center">
            {quantity}x
          </span>
        </article>

        <article className="flex flex-col items-center gap-1">
          <p className="text-sky-600 font-medium text-[10px] uppercase tracking-wider">
            Subtotal
          </p>
          <span className="text-amber-950 font-bold text-base whitespace-nowrap">
            {formatCurrency(unitPrice * quantity)}
          </span>
        </article>
      </div>
    </div>
  );
}

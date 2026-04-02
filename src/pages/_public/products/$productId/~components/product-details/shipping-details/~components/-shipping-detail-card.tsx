import { Zap } from "lucide-react";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { formatCurrency } from "@/utils/format-currency";

interface ShippingDetailCardProps {
  id: string;
  fastestOption?: boolean;
  carrierName: string;
  deliveryTimeLabel: string;
  price: number;

  selectable?: boolean;
}

export function ShippingDetailCard({
  id,
  fastestOption = false,
  carrierName,
  deliveryTimeLabel,
  price,
  selectable = false,
}: ShippingDetailCardProps) {
  if (fastestOption) {
    return (
      <label
        className="flex flex-1 cursor-pointer items-center justify-between rounded-lg bg-green-200/30 p-4"
        htmlFor={id}
      >
        <div className="flex items-center gap-2">
          {selectable && (
            <RadioGroupItem
              className="mt-1 cursor-pointer"
              id={id}
              value={id}
            />
          )}

          <h2 className="flex items-center gap-2 font-medium text-green-500">
            <Zap />
            Entrega rápida!
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <article className="flex flex-col items-center">
            <p className="font-medium">
              {carrierName.charAt(0).toUpperCase() + carrierName.slice(1)}
            </p>

            <p className="text-gray-600 text-sm">{deliveryTimeLabel}</p>
          </article>

          <p className="border-gray-300 border-l pl-4 font-semibold text-green-600 text-lg">
            {formatCurrency(price)}
          </p>
        </div>
      </label>
    );
  }

  return (
    <label
      className="flex flex-1 cursor-pointer items-center justify-between rounded-lg border border-gray-300 p-4 hover:border-amber-900 hover:bg-amber-50/30"
      htmlFor={id}
    >
      <div className="flex items-center gap-2">
        {selectable && (
          <RadioGroupItem className="mt-1 cursor-pointer" id={id} value={id} />
        )}

        <article className="flex flex-col items-start">
          <p className="font-medium">
            {carrierName.charAt(0).toUpperCase() + carrierName.slice(1)}
          </p>

          <p className="text-gray-600 text-sm">{deliveryTimeLabel}</p>
        </article>
      </div>

      <p className="font-semibold text-green-600 text-lg">
        {formatCurrency(price)}
      </p>
    </label>
  );
}

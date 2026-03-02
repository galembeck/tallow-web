import { Zap } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ShippingDetailCardProps {
  cheapestOption?: boolean;

  carrierName: string;
  deliveryTimeLabel: string;
  price: number;
}

export function ShippingDetailCard({
  cheapestOption = false,
  carrierName,
  deliveryTimeLabel,
  price,
}: ShippingDetailCardProps) {
  if (cheapestOption) {
    return (
      <article className="flex justify-between rounded-lg bg-green-200/30 p-4">
        <h2 className="flex items-center gap-2 font-medium text-green-500">
          <Zap />
          Entrega rápida!
        </h2>

        <div className="flex items-center gap-4">
          <article className="flex flex-col items-center">
            <p className="font-medium">
              {carrierName.charAt(0).toUpperCase() + carrierName.slice(1)}
            </p>

            <p className="text-gray-600 text-sm">{deliveryTimeLabel}</p>
          </article>

          <Separator orientation="vertical" />

          <p className="font-semibold text-green-600 text-lg">
            R$ {String(price).replace(".", ",")}
          </p>
        </div>
      </article>
    );
  }

  return (
    <article
      className="rounded-lg border border-gray-300 p-4"
      key={carrierName}
    >
      <div className="flex items-center justify-between">
        <article className="flex flex-col items-start">
          <p className="font-medium">
            {carrierName.charAt(0).toUpperCase() + carrierName.slice(1)}
          </p>

          <p className="text-gray-600 text-sm">{deliveryTimeLabel}</p>
        </article>

        <p className="font-semibold text-green-600 text-lg">
          R$ {String(price).replace(".", ",")}
        </p>
      </div>
    </article>
  );
}

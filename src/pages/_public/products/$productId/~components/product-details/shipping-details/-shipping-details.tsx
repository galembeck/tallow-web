import { Medal, Package, ShieldCheck, Truck } from "lucide-react";
import { useShipping } from "@/hooks/services/use-shipping";
import { ShippingDetailCard } from "./~components/-shipping-detail-card";
import { ShippingDetailsForm } from "./~components/-shipping-details-form";

interface ShippingDetailsProps {
  productId: string;
  quantity: number;
}

export function ShippingDetails({ productId, quantity }: ShippingDetailsProps) {
  const {
    calculateShipping,
    shippingOptions,
    calculateCheapest,
    cheapestShippingOption,
    isLoading,
  } = useShipping();

  return (
    <div className="flex flex-col gap-6 rounded-lg bg-white p-6 shadow-md">
      <div className="flex flex-col gap-6">
        <h1 className="flex items-center gap-2 font-semibold text-lg">
          <Truck className="text-amber-900" />
          Calcular frete e prazo de entrega
        </h1>

        <ShippingDetailsForm
          calculateCheapest={calculateCheapest}
          calculateShipping={calculateShipping}
          isLoading={isLoading}
          productId={productId}
          quantity={quantity}
        />
      </div>

      {shippingOptions &&
        shippingOptions.length > 0 &&
        cheapestShippingOption && (
          <div className="flex flex-col gap-4">
            <ShippingDetailCard
              carrierName={cheapestShippingOption.carrierName}
              cheapestOption
              deliveryTimeLabel={cheapestShippingOption.deliveryTimeLabel}
              price={cheapestShippingOption.price}
            />

            <div className="grid grid-cols-2 gap-4">
              {shippingOptions
                .filter(
                  (option) => option.price !== cheapestShippingOption.price,
                )
                .map((option) => (
                  <ShippingDetailCard
                    carrierName={option.carrierName}
                    deliveryTimeLabel={option.deliveryTimeLabel}
                    key={option.carrierName}
                    price={option.price}
                  />
                ))}
            </div>
          </div>
        )}

      <div className="mt-6 flex items-center justify-between">
        <article className="flex flex-col items-center justify-center gap-1">
          <Package className="text-amber-900" />
          <p>Envio seguro</p>
        </article>

        <article className="flex flex-col items-center justify-center gap-1">
          <ShieldCheck className="text-amber-900" />
          <p>Compra protegida</p>
        </article>

        <article className="flex flex-col items-center justify-center gap-1">
          <Medal className="text-amber-900" />
          <p>Qualidade garantida</p>
        </article>
      </div>
    </div>
  );
}

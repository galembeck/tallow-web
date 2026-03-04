import { Search, Truck } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup } from "@/components/ui/radio-group";
import { Spinner } from "@/components/ui/spinner";
import type { CheckoutFormData } from "@/constants/checkout";
import { useCart } from "@/hooks/services/use-cart";
import { useShipping } from "@/hooks/services/use-shipping";
import { ShippingDetailCard } from "@/pages/_public/products/$productId/~components/product-details/shipping-details/~components/-shipping-detail-card";
import type { ShippingInformation } from "@/types/services/shipping";
import { fetchAddressByZipcode } from "@/utils/fetch-address";
import { formatCEP, removeFormat } from "@/utils/format-masks";

interface ShippingFormStepProps {
  form: UseFormReturn<CheckoutFormData>;
  handleCreateOrder: (payload: {
    selectedPaymentMethod?: string;
    formData: unknown;
  }) => Promise<void>;
  onShippingSelect?: (option: ShippingInformation) => void;
}

export function ShippingFormStep({
  form,
  handleCreateOrder,
  onShippingSelect,
}: ShippingFormStepProps) {
  const { cart } = useCart({ enableCartQuery: true });
  const {
    calculateCartShipping,
    cartShippingOptions,
    calculateFastestCart,
    fastestCartShippingOption,
    isLoading,
  } = useShipping();

  const [selectedShippingId, setSelectedShippingId] = useState<string>("");

  const zipcode = form.watch("zipcode");
  const lastProcessedZipRef = useRef<string>("");

  const handleCalculateShipping = useCallback(
    async (zipcodeFromAuto?: string) => {
      const cleanZipCode =
        zipcodeFromAuto ?? removeFormat(form.getValues("zipcode"));

      if (cleanZipCode.length !== 8) {
        return;
      }

      const cartItems = cart?.items?.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      if (!cartItems || cartItems.length === 0) {
        toast.error("Carrinho vazio. Não foi possível calcular o frete.");
        return;
      }

      try {
        await calculateCartShipping({
          toZipCode: cleanZipCode,
          items: cartItems,
        });

        await calculateFastestCart({
          toZipCode: cleanZipCode,
          items: cartItems,
        });
      } catch {
        toast.error("Ocorreu um erro ao calcular as opções de entrega.");
      }
    },
    [form, cart, calculateCartShipping, calculateFastestCart],
  );

  const handleShippingChange = (shippingId: string) => {
    const allOptions = [
      fastestCartShippingOption,
      ...(cartShippingOptions?.filter(
        (opt) => opt.price !== fastestCartShippingOption?.price,
      ) ?? []),
    ].filter(Boolean) as ShippingInformation[];

    const option = allOptions.find(
      (opt) =>
        `${opt.carrierName}-${opt.serviceName}-${opt.price}` === shippingId,
    );

    if (option) {
      setSelectedShippingId(shippingId);
      onShippingSelect?.(option);
    }
  };

  useEffect(() => {
    const cleanZip = removeFormat(zipcode ?? "");

    if (cleanZip.length !== 8) {
      return;
    }

    if (cleanZip === lastProcessedZipRef.current) {
      return;
    }

    lastProcessedZipRef.current = cleanZip;

    const timeout = setTimeout(async () => {
      try {
        const cepData = await fetchAddressByZipcode(cleanZip);

        form.setValue("address", cepData.logradouro ?? "", {
          shouldValidate: true,
        });
        form.setValue("neighborhood", cepData.bairro ?? "", {
          shouldValidate: true,
        });
        form.setValue("city", cepData.localidade ?? "", {
          shouldValidate: true,
        });
        form.setValue("state", cepData.uf ?? "", { shouldValidate: true });

        if (!form.getValues("complement")) {
          form.setValue("complement", cepData.complemento ?? "");
        }
      } catch {
        toast.error("Não foi possível preencher o endereço automaticamente.");
      }

      await handleCalculateShipping(cleanZip);
    }, 300);

    return () => clearTimeout(timeout);
  }, [zipcode, form, handleCalculateShipping]);

  return (
    <div className="rounded-lg bg-white p-8 shadow-md">
      <div className="mb-6 flex items-center gap-3">
        <Truck className="h-6 w-6 text-amber-900" />
        <h2 className="text-2xl text-gray-900">Frete e dados de entrega</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <FormField
          control={form.control}
          name="zipcode"
          render={({ field }) => (
            <FormItem className="md:col-span-3">
              <FormLabel>CEP</FormLabel>

              <div className="flex items-start gap-2">
                <FormControl>
                  <Input
                    {...field}
                    onChange={(event) => {
                      field.onChange(formatCEP(event.target.value));
                    }}
                    placeholder="00000-000"
                  />
                </FormControl>

                <Button
                  className="shrink-0"
                  disabled={isLoading}
                  onClick={() => handleCalculateShipping()}
                  type="button"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Spinner />
                      <span>Calculando...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Search className="size-4" />
                      <span>Calcular</span>
                    </div>
                  )}
                </Button>
              </div>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 md:col-span-3 md:grid-cols-3">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Endereço</FormLabel>
                <FormControl>
                  <Input placeholder="Rua" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número</FormLabel>
                <FormControl>
                  <Input placeholder="123" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="complement"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Complemento (opcional)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 md:col-span-3 md:grid-cols-3">
          <FormField
            control={form.control}
            name="neighborhood"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bairro</FormLabel>
                <FormControl>
                  <Input placeholder="Bairro" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <FormControl>
                  <Input placeholder="UF" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cidade</FormLabel>
                <FormControl>
                  <Input placeholder="Cidade" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {cartShippingOptions &&
        cartShippingOptions.length > 0 &&
        fastestCartShippingOption && (
          <div className="mt-6">
            <h3 className="mb-4 font-semibold text-gray-900">
              Selecione uma opção de entrega
            </h3>

            <RadioGroup
              onValueChange={handleShippingChange}
              value={selectedShippingId}
            >
              <div className="flex flex-col gap-4">
                <ShippingDetailCard
                  carrierName={fastestCartShippingOption.carrierName}
                  deliveryTimeLabel={
                    fastestCartShippingOption.deliveryTimeLabel
                  }
                  fastestOption
                  id={`${fastestCartShippingOption.carrierName}-${fastestCartShippingOption.serviceName}-${fastestCartShippingOption.price}`}
                  price={fastestCartShippingOption.price}
                  selectable
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {cartShippingOptions
                    .filter(
                      (option) =>
                        option.price !== fastestCartShippingOption.price,
                    )
                    .map((option) => (
                      <ShippingDetailCard
                        carrierName={option.carrierName}
                        deliveryTimeLabel={option.deliveryTimeLabel}
                        id={`${option.carrierName}-${option.serviceName}-${option.price}`}
                        key={`${option.carrierName}-${option.serviceName}-${option.price}`}
                        price={option.price}
                        selectable
                      />
                    ))}
                </div>
              </div>
            </RadioGroup>

            <Button
              className="mt-8 w-full cursor-pointer bg-amber-900 py-5! font-semibold text-sm text-white uppercase hover:bg-amber-900/90 hover:text-white"
              onClick={() => {
                handleCreateOrder({ formData: form.getValues() });
              }}
              type="button"
            >
              Continuar para pagamento
            </Button>
          </div>
        )}
    </div>
  );
}

import { MapPin, Plus, Search, Truck } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import type { CheckoutFormData } from "@/constants/checkout";
import { useCart } from "@/hooks/services/use-cart";
import { useShipping } from "@/hooks/services/use-shipping";
import { useUser } from "@/hooks/services/use-user";
import { cn } from "@/lib/utils";
import { ShippingDetailCard } from "@/pages/_public/products/$productId/~components/product-details/shipping-details/~components/-shipping-detail-card";
import type { ShippingInformation } from "@/types/services/shipping";
import type { UserAddress } from "@/types/services/user";
import { fetchAddressByZipcode } from "@/utils/fetch-address";
import { formatCEP, formatWhatsApp, removeFormat } from "@/utils/format-masks";

interface ShippingFormStepProps {
  form: UseFormReturn<CheckoutFormData>;
  onCreateOrder: () => Promise<void>;
  onShippingSelect?: (option: ShippingInformation) => void;
}

export function ShippingFormStep({
  form,
  onCreateOrder,
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
  const { addresses, isAddressesLoading } = useUser({
    enableAddressesQuery: true,
  });

  const [selectedShippingId, setSelectedShippingId] = useState<string>("");
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [showManualForm, setShowManualForm] = useState(false);

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

  const handleSelectAddress = (address: UserAddress) => {
    setSelectedAddressId(address.id);
    setShowManualForm(false);

    const cleanZip = removeFormat(address.zipcode);
    form.setValue("zipcode", address.zipcode, { shouldValidate: true });
    form.setValue("address", address.address, { shouldValidate: true });
    form.setValue("number", address.number, { shouldValidate: true });
    form.setValue("complement", address.complement ?? "", {
      shouldValidate: true,
    });
    form.setValue("neighborhood", address.neighborhood, {
      shouldValidate: true,
    });
    form.setValue("city", address.city, { shouldValidate: true });
    form.setValue("state", address.state, { shouldValidate: true });

    handleCalculateShipping(cleanZip);
  };

  const handleUseManualAddress = () => {
    setSelectedAddressId(null);
    setShowManualForm(true);
    form.setValue("zipcode", "");
    form.setValue("address", "");
    form.setValue("number", "");
    form.setValue("complement", "");
    form.setValue("neighborhood", "");
    form.setValue("city", "");
    form.setValue("state", "");
    lastProcessedZipRef.current = "";
  };

  const handleBackToAddresses = () => {
    setShowManualForm(false);
    setSelectedAddressId(null);
    form.setValue("zipcode", "");
    form.setValue("address", "");
    form.setValue("number", "");
    form.setValue("complement", "");
    form.setValue("neighborhood", "");
    form.setValue("city", "");
    form.setValue("state", "");
    lastProcessedZipRef.current = "";
  };

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

  // Auto-fill from CEP in manual mode only
  useEffect(() => {
    if (!showManualForm) return;

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
  }, [zipcode, form, handleCalculateShipping, showManualForm]);

  const hasAddresses = !isAddressesLoading && addresses.length > 0;
  const showAddressList = hasAddresses && !showManualForm;

  return (
    <div className="rounded-lg bg-white p-8 shadow-md">
      <div className="mb-6 flex items-center gap-3">
        <Truck className="h-6 w-6 text-amber-900" />
        <h2 className="text-2xl text-gray-900">Frete e dados de entrega</h2>
      </div>

      {isAddressesLoading ? (
        <div className="flex items-center gap-2 py-4 text-gray-500 text-sm">
          <Spinner className="size-4" />
          <span>Carregando endereços salvos...</span>
        </div>
      ) : (
        <>
          {/* Saved address list */}
          {showAddressList && (
            <div className="mb-6">
              <p className="mb-3 text-sm font-medium text-gray-700">
                Selecione um endereço cadastrado
              </p>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {addresses.map((address) => (
                  <button
                    key={address.id}
                    type="button"
                    onClick={() => handleSelectAddress(address)}
                    className={cn(
                      "text-left rounded-lg border p-4 transition-colors cursor-pointer",
                      selectedAddressId === address.id
                        ? "border-amber-900 bg-amber-900/5 ring-1 ring-amber-900"
                        : "border-amber-900/30 hover:border-amber-900/60 bg-white",
                    )}
                  >
                    <p className="font-semibold text-sm text-amber-950 mb-2">
                      {address.addressTitle}
                    </p>
                    <p className="text-xs text-gray-600">
                      {address.receiverName} {address.receiverLastname} |{" "}
                      {formatWhatsApp(address.contactCellphone)}
                    </p>
                    <p className="text-xs text-gray-600">
                      {address.address}, {address.number}
                      {address.complement ? ` - ${address.complement}` : ""}
                    </p>
                    <p className="text-xs text-gray-600">
                      {address.neighborhood}
                    </p>
                    <p className="text-xs text-gray-600">
                      {address.city}, {address.state} — {address.zipcode}
                    </p>
                  </button>
                ))}

                {/* Use a different address */}
                <button
                  type="button"
                  onClick={handleUseManualAddress}
                  className="text-left rounded-lg border border-dashed border-amber-900/40 p-4 hover:border-amber-900/70 hover:bg-amber-900/5 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 min-h-[120px]"
                >
                  <Plus className="size-5 text-amber-900/60" />
                  <span className="text-sm font-medium text-amber-900/70">
                    Usar outro endereço
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Manual address form */}
          {(!hasAddresses || showManualForm) && (
            <>
              {hasAddresses && (
                <button
                  type="button"
                  onClick={handleBackToAddresses}
                  className="mb-4 flex items-center gap-1.5 text-sm text-amber-900 hover:underline"
                >
                  <MapPin className="size-4" />
                  Usar endereço cadastrado
                </button>
              )}

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
                          <Input placeholder="Rua" {...field} disabled />
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
                          <Input placeholder="Bairro" {...field} disabled />
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
                          <Input placeholder="UF" {...field} disabled />
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
                          <Input placeholder="Cidade" {...field} disabled />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* Shipping options — shown after a zipcode produces results */}
      {cartShippingOptions &&
        cartShippingOptions.length > 0 &&
        fastestCartShippingOption && (
          <>
            <Separator className="my-6" />

            <div>
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
                onClick={onCreateOrder}
                type="button"
              >
                Continuar para pagamento
              </Button>
            </div>
          </>
        )}
    </div>
  );
}

import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import type { CheckoutFormData } from "@/constants/checkout";
import type { ShippingInformation } from "@/types/services/shipping";
import { useCart } from "./services/use-cart";
import { useOrder } from "./services/use-order";

interface UseCheckoutOptions {
  onOrderCreated?: () => void;
}

export function useCheckout(
  form: UseFormReturn<CheckoutFormData>,
  { onOrderCreated }: UseCheckoutOptions = {},
) {
  const { cart, isClearingCart } = useCart({
    enableCartQuery: true,
  });
  const { createOrder, isCreatingOrder } = useOrder({
    enableOrderQuery: false,
  });

  const [orderId, setOrderId] = useState<string | null>(null);

  const buildOrderPayload = (
    selectedShippingOption: ShippingInformation,
  ): Parameters<typeof createOrder>[0] => {
    const values = form.getValues();

    return {
      // biome-ignore lint/style/noNonNullAssertion: cart is guaranteed to be loaded before reaching this point
      cartId: cart!.id,
      buyerInfo: {
        name: values.name,
        email: values.email,
        cellphone: values.cellphone,
        document: values.document,
      },
      shippingInfo: {
        shippingService: selectedShippingOption.serviceName,
        shippingDeliveryTime: selectedShippingOption.deliveryTimeLabel,
        shippingZipcode: values.zipcode.replace(/\D/g, ""),
        shippingAddress: values.address,
        shippingNumber: values.number,
        shippingComplement: values.complement,
        shippingNeighborhood: values.neighborhood,
        shippingCity: values.city,
        shippingState: values.state,
      },
    };
  };

  const handleCreateOrder = async (
    selectedShippingOption: ShippingInformation | null,
  ) => {
    try {
      if (!cart || cart.items.length === 0) {
        toast.error("O carrinho está vazio :(", {
          description:
            "Adicione produtos ao carrinho antes de finalizar a compra.",
        });

        return;
      }

      if (!selectedShippingOption) {
        toast.error("Por favor, selecione uma opção de frete.");
        return;
      }

      const createdOrders = await createOrder(
        buildOrderPayload(selectedShippingOption),
      );
      const createdOrder = createdOrders?.[0];

      if (!createdOrder?.id) {
        toast.error("Ocorreu um erro ao criar o pedido!", {
          description: "Por favor, entre em contato com nosso suporte.",
        });
        return;
      }

      setOrderId(createdOrder.id);
      onOrderCreated?.();
    } catch (_error) {
      toast.error("Ops! Ocorreu um erro ao registrar seu pedido.", {
        description:
          "Tente novamente mais tarde ou entre em contato com o suporte.",
      });
    }
  };

  return {
    cart,
    orderId,
    isProcessing: isCreatingOrder || isClearingCart,
    isCreatingOrder,
    handleCreateOrder,
  };
}

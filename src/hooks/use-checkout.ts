import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import type { CheckoutFormData } from "@/constants/checkout";
import type {
  PaymentBrickSubmitData,
  PaymentResponseDTO,
} from "@/types/services/payment";
import type { ShippingInformation } from "@/types/services/shipping";
import { useCart } from "./services/use-cart";
import { useOrder } from "./services/use-order";
import {
  buildBoletoPayload,
  buildCreditCardPayload,
  buildPixPayload,
  usePayment,
} from "./services/use-payment";

interface UseCheckoutOptions {
  onOrderCreated?: () => void;
  onPaymentSuccess?: (paymentId: string) => void;
  onPaymentPending?: (payment: PaymentResponseDTO) => void;
  shippingCost?: number;
}

export function useCheckout(
  form: UseFormReturn<CheckoutFormData>,
  {
    onOrderCreated,
    onPaymentSuccess,
    onPaymentPending,
    shippingCost = 0,
  }: UseCheckoutOptions = {},
) {
  const { cart, clearCart } = useCart({
    enableCartQuery: true,
  });
  const { createOrder, isCreatingOrder } = useOrder({
    enableOrderQuery: false,
  });
  const { processPayment, isProcessingPayment } = usePayment();

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
        shippingAmount: selectedShippingOption.price,
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

  const buildPayerFromForm = () => {
    const values = form.getValues();

    const [firstName, ...rest] = values.name.trim().split(" ");

    return {
      email: values.email,
      firstName: firstName ?? values.name,
      lastName: rest.join(" ") || null,
      identification: {
        type: "CPF" as const,
        number: values.document.replace(/\D/g, ""),
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

      const createdOrder = await createOrder(
        buildOrderPayload(selectedShippingOption),
      );

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

  const handleProcessPayment = async ({
    selectedPaymentMethod,
    formData,
  }: PaymentBrickSubmitData) => {
    try {
      if (!orderId) {
        toast.error("Pedido não encontrado :/", {
          description:
            "Por favor, crie um pedido antes de finalizar o pagamento.",
        });
        return;
      }

      if (!cart) {
        toast.error("Carrinho não encontrado :/", {
          description:
            "Adicione produtos ao carrinho antes de finalizar a compra.",
        });
        return;
      }

      const totalAmount =
        Math.round(((cart.totalAmount ?? 0) + shippingCost) * 100) / 100;
      const payer = buildPayerFromForm();

      let payload: Parameters<typeof processPayment>[0];

      if (selectedPaymentMethod === "credit_card") {
        payload = buildCreditCardPayload({ orderId, formData });
      } else if (selectedPaymentMethod === "bank_transfer") {
        payload = buildPixPayload({
          orderId,
          transactionAmount: totalAmount,
          payer,
        });
      } else if (selectedPaymentMethod === "ticket") {
        payload = buildBoletoPayload({
          orderId,
          transactionAmount: totalAmount,
          payer,
        });
      } else {
        toast.error("Forma de pagamento não suportada.", {
          description: "Tente selecionar outra forma de pagamento.",
        });
        return;
      }

      const payment = await processPayment(payload);

      if (!payment) {
        toast.error("Ops! Não foi possível confirmar o pagamento.", {
          description: "Tente novamente ou entre em contato com o suporte.",
        });
        return;
      }

      const isPending =
        selectedPaymentMethod === "bank_transfer" ||
        selectedPaymentMethod === "ticket";

      if (isPending) {
        onPaymentPending?.(payment);
        return;
      }

      onPaymentSuccess?.(payment.id);

      // await clearCart();

      toast.success("Parabéns! Pagamento realizado com sucesso.", {
        description:
          "Em breve você receberá um e-mail com os detalhes do seu pedido.",
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      toast.error("Ops! Ocorreu um erro ao processar seu pagamento.", {
        description:
          "Tente novamente mais tarde ou entre em contato com o suporte.",
      });
    }
  };

  return {
    cart,
    orderId,
    isProcessing: isCreatingOrder || isProcessingPayment,
    isCreatingOrder,
    isProcessingPayment,
    handleCreateOrder,
    handleProcessPayment,
    clearCart,
  };
}

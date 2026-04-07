import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { useGiftCard } from "@/hooks/services/use-gift-card";
import type { PayGiftCardDTO } from "@/types/services/gift-card";
import type { PaymentBrickSubmitData, PaymentResponseDTO } from "@/types/services/payment";

export interface GiftCardCheckoutFormData {
  name: string;
  email: string;
  document: string;
  cellphone: string;
}

interface UseGiftCardCheckoutOptions {
  amount: number;
  onSuccess?: (giftCardId: string) => void;
  onPending?: (payment: PaymentResponseDTO, giftCardId: string) => void;
}

export function useGiftCardCheckout(
  form: UseFormReturn<GiftCardCheckoutFormData>,
  { amount, onSuccess, onPending }: UseGiftCardCheckoutOptions,
) {
  const { initiateGiftCard, payGiftCard, isInitiating, isPaying } =
    useGiftCard();

  const [giftCardId, setGiftCardId] = useState<string | null>(null);

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

  const handleProcessPayment = async ({
    selectedPaymentMethod,
    formData,
  }: PaymentBrickSubmitData) => {
    try {
      // Step 1: create pending gift card
      const gc = await initiateGiftCard({ amount });
      setGiftCardId(gc.id);

      // Step 2: build payment payload
      const payer = buildPayerFromForm();
      let payload: PayGiftCardDTO;

      if (selectedPaymentMethod === "credit_card") {
        // convert snake_case keys from MP Brick to camelCase
        const toCamelCase = (str: string) =>
          str.replace(/_([a-z])/g, (_, l: string) => l.toUpperCase());
        // biome-ignore lint/suspicious/noExplicitAny: MP Brick data
        const convertToCamelCase = (obj: any): any => {
          if (Array.isArray(obj)) return obj.map(convertToCamelCase);
          if (obj !== null && typeof obj === "object") {
            return Object.keys(obj).reduce(
              // biome-ignore lint/suspicious/noExplicitAny: MP Brick data
              (acc: Record<string, any>, key) => {
                acc[toCamelCase(key)] = convertToCamelCase(obj[key]);
                return acc;
              },
              {},
            );
          }
          return obj;
        };
        const fd = convertToCamelCase(formData);
        payload = {
          paymentType: "CREDIT_CARD",
          token: fd.token,
          installments: fd.installments ?? 1,
          paymentMethodId: fd.paymentMethodId,
          issuerId: fd.issuerId ?? null,
          payer: {
            email: fd.payer?.email ?? payer.email,
            firstName: fd.payer?.firstName ?? payer.firstName,
            lastName: fd.payer?.lastName ?? payer.lastName,
            identification: fd.payer?.identification
              ? {
                  type: fd.payer.identification.type,
                  number: fd.payer.identification.number,
                }
              : payer.identification,
          },
        };
      } else if (selectedPaymentMethod === "bank_transfer") {
        payload = {
          paymentType: "PIX",
          payer,
        };
      } else if (selectedPaymentMethod === "ticket") {
        payload = {
          paymentType: "BOLETO",
          payer,
          dateOfExpiration: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        };
      } else {
        toast.error("Forma de pagamento não suportada.");
        return;
      }

      // Step 3: process payment linked to gift card
      const payment = await payGiftCard(gc.id, payload);

      if (!payment) {
        toast.error("Não foi possível confirmar o pagamento.", {
          description: "Tente novamente ou entre em contato com o suporte.",
        });
        return;
      }

      const isPending =
        selectedPaymentMethod === "bank_transfer" ||
        selectedPaymentMethod === "ticket";

      if (isPending) {
        onPending?.(payment, gc.id);
        return;
      }

      onSuccess?.(gc.id);

      toast.success("Parabéns! Pagamento realizado com sucesso.", {
        description: "Seu vale presente já está ativo e disponível.",
      });
    } catch (_error) {
      toast.error("Ocorreu um erro ao processar seu pagamento.", {
        description:
          "Tente novamente mais tarde ou entre em contato com o suporte.",
      });
    }
  };

  return {
    giftCardId,
    handleProcessPayment,
    isProcessing: isInitiating || isPaying,
  };
}

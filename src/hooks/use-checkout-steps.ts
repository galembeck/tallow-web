import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import {
  addressFields,
  type CheckoutFormData,
  personalFields,
} from "@/constants/checkout";
import type { ShippingInformation } from "@/types/services/shipping";

export type CheckoutFormStep = 1 | 2 | 3 | 4;

export function useCheckoutSteps(form: UseFormReturn<CheckoutFormData>) {
  const [step, setStep] = useState<CheckoutFormStep>(1);
  const [selectedShippingOption, setSelectedShippingOption] =
    useState<ShippingInformation | null>(null);

  const goToStep = (target: CheckoutFormStep) => setStep(target);

  const handleNextStep = async () => {
    if (step === 1) {
      const valid = await form.trigger(personalFields);

      if (valid) {
        setStep(2);
      }

      return;
    }

    if (step === 2) {
      if (!form.getValues("number")) {
        form.setError("number", {
          type: "manual",
          message: "O número é obrigatório.",
        });
        return;
      }

      if (!selectedShippingOption) {
        toast.error("Selecione uma opção de entrega antes de continuar.");
        return;
      }

      const valid = await form.trigger(addressFields);
      if (valid) {
        setStep(3);
      }
    }
  };

  return {
    step,
    goToStep,
    handleNextStep,
    selectedShippingOption,
    setSelectedShippingOption,
  };
}

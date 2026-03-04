import { useMutation } from "@tanstack/react-query";
import { paymentModule } from "@/api/http/routes/payment";

export function usePayment() {
  const createCardPaymentMutation = useMutation({
    mutationFn: paymentModule.createCardPayment,
  });

  return {
    createCardPayment: createCardPaymentMutation.mutateAsync,
    isCreatingPayment: createCardPaymentMutation.isPending,
    paymentError: createCardPaymentMutation.error,
  };
}

import { useMutation } from "@tanstack/react-query";
import { shippingModule } from "@/api/http/routes/shipping";
import type { CalculateShippingData } from "@/types/services/shipping";

export function useShipping() {
  const calculateShippingMutation = useMutation({
    mutationFn: async (shippingData: CalculateShippingData) => {
      const result = await shippingModule.calculate(shippingData);

      return result;
    },
  });

  const calculateCheapestMutation = useMutation({
    mutationFn: async (shippingData: CalculateShippingData) => {
      const result = await shippingModule.calculateCheapest(shippingData);

      return result;
    },
  });

  return {
    calculateShipping: calculateShippingMutation.mutateAsync,
    shippingOptions: calculateShippingMutation.data,

    calculateCheapest: calculateCheapestMutation.mutateAsync,
    cheapestShippingOption: calculateCheapestMutation.data,

    isLoading:
      calculateShippingMutation.isPending ||
      calculateCheapestMutation.isPending,
    error: calculateShippingMutation.error || calculateCheapestMutation.error,
  };
}

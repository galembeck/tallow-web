import { useMutation } from "@tanstack/react-query";
import { shippingModule } from "@/api/http/routes/shipping";
import type {
  CalculateCartShippingData,
  CalculateShippingData,
} from "@/types/services/shipping";

export function useShipping() {
  const calculateShippingMutation = useMutation({
    mutationFn: async (shippingData: CalculateShippingData) => {
      return await shippingModule.calculate(shippingData);
    },
  });

  const calculateFastestMutation = useMutation({
    mutationFn: async (shippingData: CalculateShippingData) => {
      return await shippingModule.calculateFastest(shippingData);
    },
  });

  const calculateCartShippingMutation = useMutation({
    mutationFn: async (shippingData: CalculateCartShippingData) => {
      return await shippingModule.calculateCart(shippingData);
    },
  });

  const calculateFastestCartMutation = useMutation({
    mutationFn: async (shippingData: CalculateCartShippingData) => {
      return await shippingModule.calculateFastestCart(shippingData);
    },
  });

  return {
    calculateShipping: calculateShippingMutation.mutateAsync,
    shippingOptions: calculateShippingMutation.data,

    calculateFastest: calculateFastestMutation.mutateAsync,
    fastestShippingOption: calculateFastestMutation.data,

    calculateCartShipping: calculateCartShippingMutation.mutateAsync,
    cartShippingOptions: calculateCartShippingMutation.data,

    calculateFastestCart: calculateFastestCartMutation.mutateAsync,
    fastestCartShippingOption: calculateFastestCartMutation.data,

    isLoading:
      calculateShippingMutation.isPending ||
      calculateFastestMutation.isPending ||
      calculateCartShippingMutation.isPending ||
      calculateFastestCartMutation.isPending,

    error:
      calculateShippingMutation.error ||
      calculateFastestMutation.error ||
      calculateCartShippingMutation.error ||
      calculateFastestCartMutation.error,
  };
}

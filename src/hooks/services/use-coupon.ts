import { couponModule } from "@/api/http/routes/coupon";
import type { CreateCouponDTO, UpdateCouponDTO } from "@/types/services/coupon";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useCoupon() {
  const queryClient = useQueryClient();

  const { data: coupons, isLoading } = useQuery({
    queryKey: ["coupons", "list"],
    queryFn: () => couponModule.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateCouponDTO) => couponModule.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCouponDTO }) =>
      couponModule.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => couponModule.toggle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
    },
  });

  const validateMutation = useMutation({
    mutationFn: (code: string) => couponModule.validate(code),
  });

  return {
    coupons,
    isLoading,
    createCoupon: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateCoupon: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    toggleCoupon: toggleMutation.mutateAsync,
    isToggling: toggleMutation.isPending,
    validateCoupon: validateMutation.mutateAsync,
    isValidating: validateMutation.isPending,
  };
}

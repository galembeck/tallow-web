import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orderModule } from "@/api/http/routes/order";
import type { CreateOrderDTO, OrderResponseDTO } from "@/types/services/order";

interface UseOrderOptions {
  orderId?: string;
  enableOrderQuery?: boolean;
  enableUserOrdersQuery?: boolean;
}

export function useOrder({
  orderId,
  enableOrderQuery = true,
  enableUserOrdersQuery = false,
}: UseOrderOptions = {}) {
  const queryClient = useQueryClient();

  const createOrderMutation = useMutation({
    mutationFn: (data: CreateOrderDTO) => orderModule.create(data),
    onSuccess: async (createdOrders) => {
      const order = createdOrders;

      if (order?.id) {
        queryClient.setQueryData<OrderResponseDTO>(
          ["orders", "details", order.id],
          order,
        );
      }

      await queryClient.invalidateQueries({ queryKey: ["orders", "user"] });
      await queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const orderQuery = useQuery({
    queryKey: ["orders", "details", orderId],
    queryFn: async () => {
      if (!orderId) {
        throw new Error("ID do pedido não encontrado!");
      }

      return await orderModule.getById(orderId);
    },
    enabled: enableOrderQuery && !!orderId,
    retry: 1,
  });

  const userOrdersQuery = useQuery({
    queryKey: ["orders", "user"],
    queryFn: () => orderModule.getUserOrders(),
    enabled: enableUserOrdersQuery,
    retry: 1,
    staleTime: 0,
  });

  return {
    createOrder: createOrderMutation.mutateAsync,
    createdOrders: createOrderMutation.data,
    isCreatingOrder: createOrderMutation.isPending,
    createOrderError: createOrderMutation.error,

    order:
      orderQuery.data ??
      (orderId
        ? queryClient.getQueryData<OrderResponseDTO>([
            "orders",
            "details",
            orderId,
          ])
        : undefined),
    isOrderLoading: orderQuery.isLoading,
    orderError: orderQuery.error,

    userOrders:
      userOrdersQuery.data ??
      queryClient.getQueryData<OrderResponseDTO[]>(["orders", "user"]),
    isUserOrdersLoading: userOrdersQuery.isLoading,
    userOrdersError: userOrdersQuery.error,

    refetchOrder: orderQuery.refetch,
    refetchUserOrders: userOrdersQuery.refetch,
  };
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orderModule } from "@/api/http/routes/order";
import type {
  CreateOrderDTO,
  OrderAdminSummaryDTO,
  OrderResponseDTO,
  OrderShippingRequestDTO,
  OrderShippingResponseDTO,
  OrderShippingStatusDTO,
} from "@/types/services/order";
import { normalizeOrderStatus } from "@/types/enums/order-status";

interface UseOrderOptions {
  orderId?: string;
  enableOrderQuery?: boolean;
  enableUserOrdersQuery?: boolean;
  enableAllOrdersQuery?: boolean;
  enableAdminOrderQuery?: boolean;
  enableAdminShippingQuery?: boolean;
}

export type { OrderShippingResponseDTO, OrderShippingStatusDTO };

export function useOrder({
  orderId,
  enableOrderQuery = true,
  enableUserOrdersQuery = false,
  enableAllOrdersQuery = false,
  enableAdminOrderQuery = false,
  enableAdminShippingQuery = false,
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

  const allOrdersQuery = useQuery<OrderAdminSummaryDTO[]>({
    queryKey: ["orders", "admin", "all"],
    queryFn: () => orderModule.getAllAdmin(),
    enabled: enableAllOrdersQuery,
    retry: 1,
    staleTime: 0,
  });

  const prepareOrderMutation = useMutation({
    mutationFn: (id: string) => orderModule.updateOrderStatus(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["orders", "admin", "details", orderId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["orders", "admin", "all"],
      });
    },
  });

  const shipOrderMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: OrderShippingRequestDTO }) =>
      orderModule.updateOrderShipping(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["orders", "admin", "details", orderId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["orders", "admin", "all"],
      });
      // Invalidate shipping status so it refetches as soon as the order flips to SHIPPED
      await queryClient.invalidateQueries({
        queryKey: ["orders", "admin", "shipping", orderId],
      });
    },
  });

  const adminOrderQuery = useQuery<OrderResponseDTO>({
    queryKey: ["orders", "admin", "details", orderId],
    queryFn: async () => {
      if (!orderId) throw new Error("ID do pedido não encontrado!");
      return await orderModule.getAdminById(orderId);
    },
    enabled: enableAdminOrderQuery && !!orderId,
    retry: false,
  });

  const adminOrderStatus = normalizeOrderStatus(
    String(adminOrderQuery.data?.status ?? ""),
  );

  const adminShippingQuery = useQuery<OrderShippingStatusDTO>({
    queryKey: ["orders", "admin", "shipping", orderId],
    queryFn: async () => {
      if (!orderId) throw new Error("ID do pedido não encontrado!");
      return await orderModule.getAdminShippingStatus(orderId);
    },
    enabled:
      enableAdminShippingQuery && !!orderId && adminOrderStatus === "SHIPPED",
    retry: false,
    staleTime: 0,
    // Poll every 6 s until SuperFrete assigns the tracking code.
    // Once a non-empty tracking code is present, polling stops automatically.
    refetchInterval: (query) => {
      const data = query.state.data;
      const hasTracking = !!data?.trackingCode || !!data?.live?.trackingCode;
      return hasTracking ? false : 6_000;
    },
  });

  const downloadLabelMutation = useMutation({
    mutationFn: (id: string) => orderModule.getAdminLabel(id),
    onSuccess: (blob, id) => {
      const url = URL.createObjectURL(blob);
      const tab = window.open(url, "_blank");
      if (!tab) {
        const a = document.createElement("a");
        a.href = url;
        a.download = `etiqueta-${id}.pdf`;
        a.click();
      }
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
    },
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

    allOrders: allOrdersQuery.data ?? [],
    isAllOrdersLoading: allOrdersQuery.isLoading,

    adminOrder: adminOrderQuery.data,
    isAdminOrderLoading: adminOrderQuery.isLoading,
    adminOrderError: adminOrderQuery.error,

    prepareOrder: prepareOrderMutation.mutateAsync,
    isPreparingOrder: prepareOrderMutation.isPending,
    prepareOrderError: prepareOrderMutation.error,

    shipOrder: shipOrderMutation.mutateAsync,
    isShippingOrder: shipOrderMutation.isPending,
    shipOrderError: shipOrderMutation.error,

    adminShippingStatus: adminShippingQuery.data,
    isAdminShippingLoading: adminShippingQuery.isLoading,

    downloadLabel: downloadLabelMutation.mutateAsync,
    isDownloadingLabel: downloadLabelMutation.isPending,
    downloadLabelError: downloadLabelMutation.error,

    refetchOrder: orderQuery.refetch,
    refetchUserOrders: userOrdersQuery.refetch,
  };
}

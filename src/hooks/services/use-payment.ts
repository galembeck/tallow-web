/** biome-ignore-all lint/suspicious/noExplicitAny: used for now... */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { paymentModule } from "@/api/http/routes/payment";
import type {
  BuildBoletoPaymentParams,
  BuildCreditCardPaymentParams,
  BuildPixPaymentParams,
  CreatePaymentDTO,
  PaymentAdminDTO,
  PaymentDetailDTO,
  PaymentResponseDTO,
} from "@/types/services/payment";

export function buildCreditCardPayload({
  orderId,
  formData,
}: BuildCreditCardPaymentParams): CreatePaymentDTO {
  const toCamelCase = (str: string) =>
    str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

  const convertObjectToCamelCase = (obj: any): any => {
    if (Array.isArray(obj)) {
      return obj.map(convertObjectToCamelCase);
    }
    if (obj !== null && typeof obj === "object") {
      return Object.keys(obj).reduce((result, key) => {
        const camelKey = toCamelCase(key);
        result[camelKey] = convertObjectToCamelCase(obj[key]);
        return result;
      }, {} as any);
    }
    return obj;
  };

  const normalizedFormData = convertObjectToCamelCase(formData);

  const payload: CreatePaymentDTO = {
    orderId,
    token: normalizedFormData.token,
    transactionAmount: normalizedFormData.transactionAmount,
    installments: normalizedFormData.installments || 1,
    paymentMethodId: normalizedFormData.paymentMethodId,
    issuerId: normalizedFormData.issuerId ?? null,
    payer: {
      email: normalizedFormData.payer.email,
      firstName: normalizedFormData.payer.firstName ?? null,
      lastName: normalizedFormData.payer.lastName ?? null,
      identification: normalizedFormData.payer.identification
        ? {
            type: normalizedFormData.payer.identification.type,
            number: normalizedFormData.payer.identification.number,
          }
        : null,
    },
    description: `Pedido #${orderId.substring(0, 8)}`,
  };

  return payload;
}

export function buildPixPayload({
  orderId,
  transactionAmount,
  payer,
}: BuildPixPaymentParams): CreatePaymentDTO {
  return {
    orderId,
    token: null,
    transactionAmount,
    installments: 1,
    paymentMethodId: "pix",
    issuerId: null,
    payer,
    description: `Pedido #${orderId.substring(0, 8)} - PIX`,
  };
}

export function buildBoletoPayload({
  orderId,
  transactionAmount,
  payer,
  dateOfExpiration,
}: BuildBoletoPaymentParams): CreatePaymentDTO {
  return {
    orderId,
    token: null,
    transactionAmount,
    installments: 1,
    paymentMethodId: "bolbradesco",
    issuerId: null,
    payer,
    description: `Pedido #${orderId.substring(0, 8)} - Boleto`,
    dateOfExpiration: dateOfExpiration ?? null,
  };
}

interface UsePaymentOptions {
  paymentId?: string;
  enablePaymentQuery?: boolean;
  enableUserPaymentsQuery?: boolean;
  enableAllPaymentsQuery?: boolean;
  enableAdminPaymentQuery?: boolean;
  pollingIntervalMs?: number | false;
}

export function usePayment({
  paymentId,
  enablePaymentQuery = false,
  enableUserPaymentsQuery = false,
  enableAllPaymentsQuery = false,
  enableAdminPaymentQuery = false,
  pollingIntervalMs = false,
}: UsePaymentOptions = {}) {
  const queryClient = useQueryClient();

  const processPaymentMutation = useMutation({
    mutationFn: async (data: CreatePaymentDTO) => {
      try {
        const result = await paymentModule.process(data);
        return result;
      } catch (_error) {
        // Error handling
      }
    },
    onSuccess: async (payment) => {
      queryClient.setQueryData<PaymentResponseDTO>(
        ["payments", "details", payment?.id],
        payment,
      );

      await queryClient.invalidateQueries({ queryKey: ["orders", "user"] });
      await queryClient.invalidateQueries({
        queryKey: ["orders", "details", payment?.orderId],
      });
    },
    onError: (_error) => {
      // Error handling
    },
  });

  const paymentQuery = useQuery({
    queryKey: ["payments", "details", paymentId],
    queryFn: async () => {
      if (!paymentId) {
        throw new Error("ID do pagamento não encontrado.");
      }
      return await paymentModule.getById(paymentId);
    },
    enabled: enablePaymentQuery && !!paymentId,
    retry: 1,
    refetchInterval: pollingIntervalMs,
    refetchIntervalInBackground: false,
  });

  const userPaymentsQuery = useQuery({
    queryKey: ["payments", "user"],
    queryFn: () => paymentModule.getUserPayments(),
    enabled: enableUserPaymentsQuery,
    retry: 1,
    staleTime: 0,
  });

  const allPaymentsQuery = useQuery<PaymentAdminDTO[]>({
    queryKey: ["payments", "all"],
    queryFn: () => paymentModule.getAll(),
    enabled: enableAllPaymentsQuery,
    retry: 1,
    staleTime: 0,
  });

  const adminPaymentQuery = useQuery<PaymentDetailDTO>({
    queryKey: ["payments", "admin", "details", paymentId],
    queryFn: async () => {
      if (!paymentId) throw new Error("ID do pagamento não encontrado.");
      return await paymentModule.getAdminById(paymentId);
    },
    enabled: enableAdminPaymentQuery && !!paymentId,
    retry: false,
  });

  return {
    processPayment: processPaymentMutation.mutateAsync,
    isProcessingPayment: processPaymentMutation.isPending,
    processPaymentError: processPaymentMutation.error,
    processedPayment: processPaymentMutation.data,

    payment:
      paymentQuery.data ??
      (paymentId
        ? queryClient.getQueryData<PaymentResponseDTO>([
            "payments",
            "details",
            paymentId,
          ])
        : undefined),
    isPaymentLoading: paymentQuery.isLoading,
    paymentError: paymentQuery.error,
    refetchPayment: paymentQuery.refetch,

    userPayments:
      userPaymentsQuery.data ??
      queryClient.getQueryData<PaymentResponseDTO[]>(["payments", "user"]),
    isUserPaymentsLoading: userPaymentsQuery.isLoading,
    userPaymentsError: userPaymentsQuery.error,
    refetchUserPayments: userPaymentsQuery.refetch,

    allPayments: allPaymentsQuery.data ?? [],
    isAllPaymentsLoading: allPaymentsQuery.isLoading,

    adminPayment: adminPaymentQuery.data,
    isAdminPaymentLoading: adminPaymentQuery.isLoading,

    buildCreditCardPayload,
    buildPixPayload,
    buildBoletoPayload,
  };
}

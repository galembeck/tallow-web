export interface OrderStatus {
  PENDING: "PENDING";
  PAYMENT_PENDING: "PAYMENT_PENDING";
  PAYMENT_APPROVED: "PAYMENT_APPROVED";
  PROCESSING: "PROCESSING";
  SHIPPED: "SHIPPED";
  DELIVERED: "DELIVERED";
  CANCELLED: "CANCELLED";
  REFUNDED: "REFUNDED";
}

// Backend OrderStatus enum starts at 1 (PENDING = 1 … REFUNDED = 8)
const numericToOrderStatus: Record<string, string> = {
  "1": "PENDING",
  "2": "PAYMENT_PENDING",
  "3": "PAYMENT_APPROVED",
  "4": "PROCESSING",
  "5": "SHIPPED",
  "6": "DELIVERED",
  "7": "CANCELLED",
  "8": "REFUNDED",
};

export function normalizeOrderStatus(status: string | number): string {
  const s = String(status);
  return numericToOrderStatus[s] ?? s;
}

export const orderStatusLabel: Record<string, string> = {
  PENDING: "Pendente",
  PAYMENT_PENDING: "Aguardando pagamento",
  PAYMENT_APPROVED: "Pagamento aprovado",
  PROCESSING: "Em processamento",
  SHIPPED: "Enviado",
  DELIVERED: "Entregue",
  CANCELLED: "Cancelado",
  REFUNDED: "Reembolsado",
};

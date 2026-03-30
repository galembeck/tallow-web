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

const numericToOrderStatus: Record<string, string> = {
  "0": "PENDING",
  "1": "PAYMENT_PENDING",
  "2": "PAYMENT_APPROVED",
  "3": "PROCESSING",
  "4": "SHIPPED",
  "5": "DELIVERED",
  "6": "CANCELLED",
  "7": "REFUNDED",
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

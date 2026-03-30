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

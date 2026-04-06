export interface OrderStatus {
  PENDING: "PENDING";
  PAYMENT_PENDING: "PAYMENT_PENDING";
  PAYMENT_APPROVED: "PAYMENT_APPROVED";
  PREPARING: "PREPARING";
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
  "4": "PREPARING",
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
  PREPARING: "Em preparação",
  SHIPPED: "Enviado",
  DELIVERED: "Entregue",
  CANCELLED: "Cancelado",
  REFUNDED: "Reembolsado",
};

export function getOrderStatusColor(status: string): string {
  switch (status) {
    case "PENDING":
      return "bg-red-100 text-red-700 hover:bg-red-200 border-transparent";
    case "PAYMENT_PENDING":
      return "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-transparent";
    case "PAYMENT_APPROVED":
      return "bg-sky-100 text-sky-700 hover:bg-sky-200 border-transparent";
    // case "PREPARING":
    // return "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-transparent";
    case "SHIPPED":
      return "bg-green-100 text-green-700 hover:bg-green-200 border-transparent";
    case "DELIVERED":
      return "bg-blue-100 text-blue-700 hover:bg-blue-200 border-transparent";
    case "CANCELLED":
    case "REFUNDED":
      return "bg-red-500/15 text-red-600 hover:bg-red-500/25 border-transparent";
    default:
      return "bg-gray-100 text-gray-700 hover:bg-gray-200 border-transparent";
  }
}

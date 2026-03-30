export interface PaymentStatus {
  PENDING: "PENDING";
  APPROVED: "APPROVED";
  REJECTED: "REJECTED";
  IN_PROCESS: "IN_PROCESS";
  CANCELLED: "CANCELLED";
  REFUNDED: "REFUNDED";
  CHARGED_BACK: "CHARGED_BACK";
}

export const paymentStatusLabel: Record<string, string> = {
  APPROVED: "Aprovado",
  PENDING: "Pendente",
  IN_PROCESS: "Em processamento",
  REJECTED: "Rejeitado",
  CANCELLED: "Cancelado",
  REFUNDED: "Reembolsado",
  CHARGED_BACK: "Estornado",
};

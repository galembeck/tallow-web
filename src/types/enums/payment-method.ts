export interface PaymentMethod {
  CREDIT_CARD: "CREDIT_CARD";
  PIX: "PIX";
  BOLETO: "BOLETO";
}

export const paymentMethodLabel: Record<string, string> = {
  CREDIT_CARD: "Cartão de Crédito",
  PIX: "PIX",
  BOLETO: "Boleto",
};

import type { PaymentMethod } from "../enums/payment-method";
import type { PaymentStatus } from "../enums/payment-status";

export type IdentificationType = "CPF" | "CNPJ" | "DNI" | "CI" | "RUT" | string;

export interface IdentificationDTO {
  type: IdentificationType;
  number: string;
}

export interface PayerDTO {
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  identification?: IdentificationDTO | null;
}

export interface CreatePaymentDTO {
  orderId: string;
  token?: string | null;
  transactionAmount: number;
  installments: number;

  /**
   * ID do método de pagamento (OBRIGATÓRIO)
   * Exemplos:
   * - 'pix' para PIX
   * - 'master' para Mastercard
   * - 'visa' para Visa
   * - 'elo' para Elo
   * - 'bolbradesco' para Boleto Bradesco
   */
  paymentMethodId: string;

  /**
   * ID do emissor do cartão (CONDICIONAL)
   * - OBRIGATÓRIO para cartões
   * - NULL para PIX/Boleto
   * - Exemplo: '25' para Mastercard
   */
  issuerId?: string | null;
  payer: PayerDTO;
  description?: string | null;
  dateOfExpiration?: string | null;
}

export interface PaymentResponseDTO {
  id: string;
  orderId?: string | null;
  mercadoPagoPaymentId?: number | null;
  status: PaymentStatus | string;
  statusDetail?: string | null;
  paymentMethod: PaymentMethod | string;
  paymentMethodId: string;
  transactionAmount: number;
  installments?: number | null;
  dateCreated: string;
  dateApproved?: string | null;
  dateOfExpiration?: string | null;
  pixQrCode?: string | null;
  pixQrCodeBase64?: string | null;
  pixCopyPaste?: string | null;
  boletoUrl?: string | null;
  boletoBarcode?: string | null;
}

export type PaymentListResponseDTO = PaymentResponseDTO[];

export interface PaymentBrickFormData {
  token?: string;
  paymentMethodId: string;
  issuerId?: string;
  payer: {
    email: string;
    firstName?: string;
    lastName?: string;
    identification?: {
      type: string;
      number: string;
    };
  };
  transactionAmount: number;
  installments: number;
  paymentTypeId?: string;
}

export interface PaymentBrickSubmitData {
  selectedPaymentMethod: "credit_card" | "bank_transfer" | "ticket";

  formData: PaymentBrickFormData;
}

export interface PaymentBrickConfig {
  initialization: {
    amount: number;
    payer?: {
      email?: string;
      firstName?: string;
      lastName?: string;
    };
  };
  customization?: {
    paymentMethods?: {
      creditCard?: "all" | string[];
      debitCard?: "all" | string[];
      ticket?: "all" | string[];
      bankTransfer?: "all" | string[];
      mercadoPago?: "all" | "wallet_purchase" | string[];
      maxInstallments?: number;
      minInstallments?: number;
    };
    visual?: {
      style?: {
        theme?: "default" | "dark" | "bootstrap" | "flat";
      };
      hidePaymentButton?: boolean;
    };
  };
  callbacks: {
    onReady?: () => void;
    onSubmit: (data: PaymentBrickSubmitData) => Promise<void> | void;
    // biome-ignore lint/suspicious/noExplicitAny: required by @mercadopago/sdk-react
    onError?: (error: any) => void;
  };
}

// export const PaymentTypeLabels: Record<string, string> = {
//   credit_card: 'Cartão de Crédito',
//   debit_card: 'Cartão de Débito',
//   bank_transfer: 'PIX',
//   ticket: 'Boleto',
//   wallet_purchase: 'Mercado Pago',
//   atm: 'Caixa Eletrônico',
// };

// export const PaymentStatusLabels: Record<PaymentStatus, string> = {
//   [PaymentStatus.PENDING]: 'Pendente',
//   [PaymentStatus.APPROVED]: 'Aprovado',
//   [PaymentStatus.REJECTED]: 'Rejeitado',
//   [PaymentStatus.IN_PROCESS]: 'Em Processamento',
//   [PaymentStatus.CANCELLED]: 'Cancelado',
//   [PaymentStatus.REFUNDED]: 'Reembolsado',
//   [PaymentStatus.CHARGED_BACK]: 'Estornado',
// };

// export function isPaymentApproved(payment: PaymentResponseDTO): boolean {
//   return payment.status === PaymentStatus.APPROVED || payment.status === 'APPROVED';
// }

// export function isPaymentPending(payment: PaymentResponseDTO): boolean {
//   return payment.status === PaymentStatus.PENDING ||
//          payment.status === PaymentStatus.IN_PROCESS ||
//          payment.status === 'PENDING' ||
//          payment.status === 'IN_PROCESS';
// }

// export function isPaymentRejected(payment: PaymentResponseDTO): boolean {
//   return payment.status === PaymentStatus.REJECTED || payment.status === 'REJECTED';
// }

// export function isPixPayment(payment: PaymentResponseDTO): boolean {
//   return payment.paymentMethodId === 'pix' && !!payment.pixQrCode;
// }

// export function isBoletoPayment(payment: PaymentResponseDTO): boolean {
//   return payment.paymentMethodId?.includes('bol') && !!payment.boletoUrl;
// }

// export function formatCurrency(value: number): string {
//   return new Intl.NumberFormat('pt-BR', {
//     style: 'currency',
//     currency: 'BRL'
//   }).format(value);
// }

// export function formatDate(dateString: string): string {
//   return new Intl.DateTimeFormat('pt-BR', {
//     day: '2-digit',
//     month: '2-digit',
//     year: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit'
//   }).format(new Date(dateString));
// }

/**
 * EXEMPLO 1: Criar pagamento PIX
 *
 * const pixPayment: CreatePaymentDTO = {
 *   orderId: 'order-id-123',
 *   transactionAmount: 150.00,
 *   installments: 1,
 *   paymentMethodId: 'pix',
 *   payer: {
 *     email: 'cliente@email.com',
 *     identification: {
 *       type: 'CPF',
 *       number: '12345678909'
 *     }
 *   }
 * };
 *
 * const response = await fetch('/payment/process', {
 *   method: 'POST',
 *   body: JSON.stringify(pixPayment)
 * });
 *
 * const payment: PaymentResponseDTO = await response.json();
 *
 * if (isPixPayment(payment)) {
 *   console.log('QR Code:', payment.pixCopyPaste);
 * }
 */

/**
 * EXEMPLO 2: Processar pagamento do Payment Brick
 *
 * const onSubmitPayment = async ({ formData }: PaymentBrickSubmitData) => {
 *   const paymentRequest: CreatePaymentDTO = {
 *     orderId: orderId,
 *     token: formData.token,
 *     transactionAmount: formData.transactionAmount,
 *     installments: formData.installments,
 *     paymentMethodId: formData.paymentMethodId,
 *     issuerId: formData.issuerId,
 *     payer: {
 *       email: formData.payer.email,
 *       firstName: formData.payer.firstName,
 *       lastName: formData.payer.lastName,
 *       identification: formData.payer.identification
 *     }
 *   };
 *
 *   const response = await fetch('/payment/process', {
 *     method: 'POST',
 *     headers: {
 *       'Content-Type': 'application/json',
 *       'Authorization': `Bearer ${token}`
 *     },
 *     body: JSON.stringify(paymentRequest)
 *   });
 *
 *   const payment: PaymentResponseDTO = await response.json();
 *
 *   if (isPaymentApproved(payment)) {
 *     window.location.href = `/success/${payment.id}`;
 *   } else if (isPixPayment(payment)) {
 *     window.location.href = `/pix/${payment.id}`;
 *   } else if (isPaymentRejected(payment)) {
 *     alert('Pagamento rejeitado: ' + payment.statusDetail);
 *   }
 * };
 */

/**
 * EXEMPLO 3: Buscar pagamento
 *
 * const fetchPayment = async (paymentId: string): Promise<PaymentResponseDTO> => {
 *   const response = await fetch(`/payment/${paymentId}`, {
 *     headers: {
 *       'Authorization': `Bearer ${token}`
 *     }
 *   });
 *
 *   return await response.json();
 * };
 */

/**
 * EXEMPLO 4: Listar meus pagamentos
 *
 * const fetchMyPayments = async (): Promise<PaymentListResponseDTO> => {
 *   const response = await fetch('/payment/user/me', {
 *     headers: {
 *       'Authorization': `Bearer ${token}`
 *     }
 *   });
 *
 *   return await response.json();
 * };
 */

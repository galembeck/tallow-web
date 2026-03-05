import type { PaymentMethod } from "../enums/payment-method";
import type { PaymentStatus } from "../enums/payment-status";

export type IdentificationType = "CPF" | "CNPJ";

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
  paymentTypeId?: string | null;
  transactionAmount: number;
  installments?: number | null;
  currencyId?: string | null;
  shippingAmount?: number | null;
  authorizationCode?: string | null; // Código de autorização da transação
  liveMode?: boolean | null; // true = produção, false = sandbox
  statementDescriptor?: string | null; // Nome que aparece na fatura do cartão
  externalReference?: string | null; // Referência externa (geralmente order_id)
  dateCreated: string;
  dateApproved?: string | null;
  dateLastUpdated?: string | null;
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
  payment_method_id: string;
  issuer_id?: string;
  transaction_amount: number;
  installments: number;
  payer: {
    email: string;
    firstName?: string;
    lastName?: string;
    identification?: {
      type: string;
      number: string;
    };
  };
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

export interface BuildCreditCardPaymentParams {
  orderId: string;
  formData: PaymentBrickFormData;
}

export interface BuildPixPaymentParams {
  orderId: string;
  transactionAmount: number;
  payer: CreatePaymentDTO["payer"];
}

export interface BuildBoletoPaymentParams {
  orderId: string;
  transactionAmount: number;
  payer: CreatePaymentDTO["payer"];
  dateOfExpiration?: string;
}

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
 *   console.log('Ambiente:', isProductionPayment(payment) ? 'Produção' : 'Teste');
 * }
 */

/**
 * EXEMPLO 2: Exibir informações completas do pagamento
 *
 * function PaymentDetails({ payment }: { payment: PaymentResponseDTO }) {
 *   return (
 *     <div>
 *       <h2>Pagamento #{payment.mercadoPagoPaymentId}</h2>
 *       <p>Status: {getPaymentStatusMessage(payment)}</p>
 *       <p>Valor: {formatCurrency(payment.transactionAmount, payment.currencyId)}</p>
 *       <p>Criado em: {formatDate(payment.dateCreated)}</p>
 *       {payment.dateApproved && (
 *         <p>Aprovado em: {formatDate(payment.dateApproved)}</p>
 *       )}
 *       {payment.authorizationCode && (
 *         <p>Código de Autorização: {payment.authorizationCode}</p>
 *       )}
 *       {payment.statementDescriptor && (
 *         <p>Aparece na fatura como: {payment.statementDescriptor}</p>
 *       )}
 *       <Badge color={getPaymentStatusColor(payment)}>
 *         {PaymentStatusLabels[payment.status]}
 *       </Badge>
 *     </div>
 *   );
 * }
 */

/**
 * EXEMPLO 3: Listar histórico de pagamentos
 *
 * function PaymentHistory({ payments }: { payments: PaymentListResponseDTO }) {
 *   return (
 *     <ul>
 *       {payments.map(payment => (
 *         <li key={payment.id}>
 *           <span>{formatDate(payment.dateCreated)}</span>
 *           <span>{formatCurrency(payment.transactionAmount)}</span>
 *           <span>{PaymentTypeLabels[payment.paymentTypeId || 'credit_card']}</span>
 *           <Badge color={getPaymentStatusColor(payment)}>
 *             {PaymentStatusLabels[payment.status]}
 *           </Badge>
 *         </li>
 *       ))}
 *     </ul>
 *   );
 * }
 */

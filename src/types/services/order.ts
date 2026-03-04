import type { OrderStatus } from "../enums/order-status";
import type { PaymentMethod } from "../enums/payment-method";
import type { PaymentStatus } from "../enums/payment-status";

export interface BuyerInfoDTO {
  name: string;
  email: string;
  cellphone: string;
  document: string;
}

export interface ShippingInfoDTO {
  shippingService: string;
  shippingDeliveryTime: string;
  shippingZipcode: string;
  shippingAddress: string;
  shippingNumber: string;
  shippingComplement?: string;
  shippingNeighborhood: string;
  shippingCity: string;
  shippingState: string;
}

export interface CreateOrderDTO {
  cartId: string;
  buyerInfo: BuyerInfoDTO;
  shippingInfo: ShippingInfoDTO;
}

export interface OrderItemDTO {
  productId: string;
  productName: string;
  productImageUrl?: string | null;
  unitPrice: number;
  quantity: number;
  subTotal: number;
}

export interface PaymentSummaryDTO {
  id: string;
  status: PaymentStatus | string;
  paymentMethod: PaymentMethod | string;
  transactionAmount: number;
}

export interface OrderResponseDTO {
  id: string;
  status: OrderStatus | string;
  subTotalAmount: number;
  shippingAmount: number;
  totalAmount: number;
  items: OrderItemDTO[];
  buyerInfo: BuyerInfoDTO;
  shippingInfo: ShippingInfoDTO;
  createdAt: string;
  payment?: PaymentSummaryDTO | null;
}

/**
 * Exemplo de como criar um pedido:
 *
 * const orderRequest: CreateOrderDTO = {
 *   cart_id: 'abc123'
 * };
 *
 * const response = await fetch('/order', {
 *   method: 'POST',
 *   body: JSON.stringify(orderRequest)
 * });
 *
 * const order: OrderResponseDTO = await response.json();
 */

/**
 * Exemplo de como criar um pagamento PIX:
 *
 * const paymentRequest: CreatePaymentDTO = {
 *   order_id: order.id,
 *   transaction_amount: order.total_amount,
 *   installments: 1,
 *   payment_method_id: 'pix',
 *   payer: {
 *     email: 'user@example.com',
 *     first_name: 'João',
 *     last_name: 'Silva',
 *     identification: {
 *       type: 'CPF',
 *       number: '12345678909'
 *     }
 *   },
 *   description: 'Compra na Tallow'
 * };
 *
 * const response = await fetch('/payment/process', {
 *   method: 'POST',
 *   body: JSON.stringify(paymentRequest)
 * });
 *
 * const payment: PaymentResponseDTO = await response.json();
 *
 * if (payment.pix_qr_code) {
 *   // Mostrar QR Code do PIX
 *   console.log('PIX:', payment.pix_copy_paste);
 * }
 */

/**
 * Exemplo de como criar um pagamento com cartão usando Payment Brick:
 *
 * const onSubmit = async ({ formData }: PaymentBrickSubmitData) => {
 *   const paymentRequest: CreatePaymentDTO = {
 *     order_id: orderId,
 *     ...formData, // Dados do Payment Brick
 *     description: 'Compra na Tallow'
 *   };
 *
 *   const response = await fetch('/payment/process', {
 *     method: 'POST',
 *     body: JSON.stringify(paymentRequest)
 *   });
 *
 *   const payment: PaymentResponseDTO = await response.json();
 * };
 */

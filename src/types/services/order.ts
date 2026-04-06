import type { CheckoutFormData } from "@/constants/checkout";
import type { OrderStatus } from "../enums/order-status";
import type { PaymentMethod } from "../enums/payment-method";
import type { PaymentStatus } from "../enums/payment-status";
import type { ShippingService } from "../enums/shipping-service";
import type { Cart } from "./cart";
import type { ShippingInformation } from "./shipping";

export interface BuyerInfoDTO {
  name: string;
  email: string;
  cellphone: string;
  document: string;
}

export interface ShippingInfoDTO {
  shippingService: string;
  shippingDeliveryTime: string;
  shippingAmount: number;
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
  couponCode?: string | null;
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
  couponCode?: string | null;
  discountPercentage?: number | null;
  discountAmount?: number | null;
}

export interface OrderAdminSummaryDTO {
  id: string;
  status: string;
  buyerName: string;
  buyerEmail: string;
  subTotalAmount: number;
  shippingAmount: number;
  totalAmount: number;
  itemsCount: number;
  shippingCity: string;
  shippingState: string;
  createdAt: string;
  paymentApprovedAt?: string | null;
  processingAt?: string | null;
  shippedAt?: string | null;
  deliveredAt?: string | null;
  cancelledAt?: string | null;
}

export interface OrderShippingRequestDTO {
  serviceId: ShippingService | number;
}

export interface OrderShippingResponseDTO {
  superFreteOrderId: string;
  trackingCode: string | null;
  labelUrl: string;
}

export interface LiveShippingDTO {
  superFreteStatus: string;
  trackingCode: string | null;
  carrier: number;
  deliveryDays: number;
  deliveryMin: number;
  deliveryMax: number;
  postedAt: string | null;
  generatedAt: string | null;
}

export interface OrderShippingStatusDTO {
  orderId: string;
  status: number;
  superFreteOrderId: string;
  trackingCode: string | null;
  labelUrl: string;
  shippedAt: string | null;
  deliveredAt: string | null;
  live: LiveShippingDTO | null;
}

export interface OrderSnapshot {
  orderNumber: string | null;
  userInformation: CheckoutFormData;
  cartSnapshot: Cart;
  shippingOption: ShippingInformation;
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

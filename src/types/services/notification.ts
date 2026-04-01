export type NotificationType =
  | "ORDER_CREATED"
  | "PAYMENT_APPROVED"
  | "PAYMENT_DECLINED"
  | "ORDER_SHIPPED";

export type NotificationCategory = "ORDER" | "PAYMENT" | "SHIPPING";

export interface AdminNotification {
  id: string;
  type: NotificationType;
  category: NotificationCategory;
  orderId: string | null;
  message: string;
  data: Record<string, unknown>;
  createdAt: string;
}

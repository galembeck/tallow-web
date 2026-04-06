import { API } from "@/api/connections/tallow";
import type {
  CreateOrderDTO,
  OrderAdminSummaryDTO,
  OrderResponseDTO,
  OrderShippingRequestDTO,
  OrderShippingResponseDTO,
  OrderShippingStatusDTO,
} from "@/types/services/order";

export const orderModule = {
  async create(data: CreateOrderDTO): Promise<OrderResponseDTO> {
    return await API.fetch("/order", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async getById(orderId: string): Promise<OrderResponseDTO> {
    return await API.fetch(`/order/${orderId}`, {
      method: "GET",
    });
  },

  async getUserOrders(): Promise<OrderResponseDTO[]> {
    return await API.fetch("/order/user/me", {
      method: "GET",
    });
  },

  async getAllAdmin(): Promise<OrderAdminSummaryDTO[]> {
    return await API.fetch("/order/admin/all", {
      method: "GET",
    });
  },

  async getAdminById(orderId: string): Promise<OrderResponseDTO> {
    return await API.fetch(`/order/admin/${orderId}`, {
      method: "GET",
    });
  },

  async updateOrderStatus(orderId: string): Promise<string> {
    return await API.fetch(`/order/admin/${orderId}/prepare`, {
      method: "PATCH",
    });
  },

  async updateOrderShipping(
    orderId: string,
    data: OrderShippingRequestDTO,
  ): Promise<OrderShippingResponseDTO> {
    return await API.fetch(`/order/admin/${orderId}/ship`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async getAdminShippingStatus(orderId: string): Promise<OrderShippingStatusDTO> {
    return await API.fetch(`/order/admin/${orderId}/shipping`, {
      method: "GET",
    });
  },

  async getAdminLabel(orderId: string): Promise<Blob> {
    const url = `${API.baseURL}/order/admin/${orderId}/label`;
    const res = await fetch(url, { credentials: "include" });
    if (!res.ok) throw new Error(`Erro ao buscar etiqueta: ${res.status}`);
    return res.blob();
  },

  async cancelOrder(orderId: string): Promise<void> {
    return await API.fetch(`/order/${orderId}/cancel`, {
      method: "PATCH",
    });
  },

  async cancelShipment(orderId: string): Promise<{ cancelled: boolean }> {
    return await API.fetch(`/shipping/admin/order/${orderId}/cancel`, {
      method: "POST",
      body: JSON.stringify({ description: "Cancelado pelo admin" }),
    });
  },
};

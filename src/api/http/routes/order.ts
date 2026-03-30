import { API } from "@/api/connections/tallow";
import type {
  CreateOrderDTO,
  OrderAdminSummaryDTO,
  OrderResponseDTO,
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
};

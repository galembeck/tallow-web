import { API } from "@/api/connections/tallow";
import type {
  CreatePaymentDTO,
  PaymentAdminDTO,
  PaymentDetailDTO,
  PaymentListResponseDTO,
  PaymentResponseDTO,
} from "@/types/services/payment";

export const paymentModule = {
  async process(data: CreatePaymentDTO): Promise<PaymentResponseDTO> {
    return await API.fetch("/payment/process", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async getById(paymentId: string): Promise<PaymentResponseDTO> {
    return await API.fetch(`/payment/${paymentId}`, {
      method: "GET",
    });
  },

  async getUserPayments(): Promise<PaymentListResponseDTO[]> {
    return await API.fetch("/payment/user/me", {
      method: "GET",
    });
  },

  async getAll(): Promise<PaymentAdminDTO[]> {
    return await API.fetch("/payment/admin/all", {
      method: "GET",
    });
  },

  async getAdminById(paymentId: string): Promise<PaymentDetailDTO> {
    return await API.fetch(`/payment/admin/${paymentId}`, {
      method: "GET",
    });
  },
};

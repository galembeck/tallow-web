import { API } from "@/api/connections/tallow";
import type {
  CreateCardPaymentRequest,
  CreateCardPaymentResponse,
} from "@/types/services/payment";

export const paymentModule = {
  async createCardPayment(
    data: CreateCardPaymentRequest,
  ): Promise<CreateCardPaymentResponse> {
    return await API.fetch("/payments/cards", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};

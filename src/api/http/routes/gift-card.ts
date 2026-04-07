import { API } from "@/api/connections/tallow";
import type { GiftCard, InitiateGiftCardDTO, PayGiftCardDTO, PurchaseGiftCardDTO } from "@/types/services/gift-card";
import type { PaymentResponseDTO } from "@/types/services/payment";

export const giftCardModule = {
  async getAll(): Promise<GiftCard[]> {
    return await API.fetch("/gift-card/admin/all", {
      method: "GET",
    });
  },

  async getMine(): Promise<GiftCard[]> {
    return await API.fetch("/gift-card/user/me", {
      method: "GET",
    });
  },

  async getById(id: string): Promise<GiftCard> {
    return await API.fetch(`/gift-card/${id}`, {
      method: "GET",
    });
  },

  async refresh(id: string): Promise<GiftCard> {
    return await API.fetch(`/gift-card/${id}/refresh`, {
      method: "GET",
    });
  },

  async purchase(data: PurchaseGiftCardDTO): Promise<GiftCard> {
    return await API.fetch("/gift-card/purchase", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async initiate(data: InitiateGiftCardDTO): Promise<GiftCard> {
    return await API.fetch("/gift-card/initiate", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async pay(id: string, data: PayGiftCardDTO): Promise<PaymentResponseDTO> {
    return await API.fetch(`/gift-card/${id}/pay`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};

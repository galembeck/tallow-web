import { API } from "@/api/connections/tallow";
import type {
  CalculateShippingData,
  ShippingInformation,
} from "@/types/services/shipping";

export const shippingModule = {
  async calculate(data: CalculateShippingData): Promise<ShippingInformation[]> {
    return await API.fetch("/shipping/calculate", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async calculateCheapest(
    data: CalculateShippingData,
  ): Promise<ShippingInformation> {
    return await API.fetch("/shipping/calculate/cheapest", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};

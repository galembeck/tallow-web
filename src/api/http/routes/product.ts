import { API } from "@/api/connections/tallow";
import type { Product } from "@/types/services/product";

export const productModule = {
  async list(): Promise<Product[]> {
    return await API.fetch("/product", {
      method: "GET",
    });
  },

  async getById(productId: string): Promise<Product> {
    return await API.fetch(`/product/${productId}`, {
      method: "GET",
    });
  },
};

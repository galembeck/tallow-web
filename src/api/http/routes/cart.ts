import { API } from "@/api/connections/tallow";
import type {
  AddToCartRequest,
  Cart,
  UpdateCartItemRequest,
} from "@/types/services/cart";

export const cartModule = {
  async getCart(): Promise<Cart> {
    return await API.fetch("/cart", {
      method: "GET",
    });
  },

  async addItem(data: AddToCartRequest): Promise<Cart> {
    return await API.fetch("/cart/items", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateItemQuantity(data: UpdateCartItemRequest): Promise<Cart> {
    return await API.fetch("/cart/items", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async removeItem(productId: string): Promise<Cart> {
    return await API.fetch(`/cart/items/${productId}`, {
      method: "DELETE",
    });
  },

  async clearCart(): Promise<Cart> {
    return await API.fetch("/cart", {
      method: "DELETE",
    });
  },
};

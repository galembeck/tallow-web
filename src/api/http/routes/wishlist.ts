import { API } from "@/api/connections/tallow";
import type { WishlistItemDTO } from "@/types/services/wishlist";

export const wishlistModule = {
  async getAll(): Promise<WishlistItemDTO[]> {
    return await API.fetch("/wishlist");
  },

  async add(productId: string): Promise<WishlistItemDTO> {
    return await API.fetch(`/wishlist/${productId}`, { method: "POST" });
  },

  async remove(productId: string): Promise<void> {
    return await API.fetch(`/wishlist/${productId}`, { method: "DELETE" });
  },

  async check(productId: string): Promise<{ isInWishlist: boolean }> {
    return await API.fetch(`/wishlist/${productId}/check`);
  },
};

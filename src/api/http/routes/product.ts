import { API } from "@/api/connections/tallow";
import type { Product, ProductFilterParams } from "@/types/services/product";

export const productModule = {
  async list(): Promise<Product[]> {
    return await API.fetch("/product", {
      method: "GET",
    });
  },

  async getByFilter(filters: ProductFilterParams): Promise<Product[]> {
    const params = new URLSearchParams();

    if (filters.category !== undefined) {
      params.append("category", filters.category.toString());
    }
    if (filters.minPrice !== undefined) {
      params.append("minPrice", filters.minPrice.toString());
    }
    if (filters.maxPrice !== undefined) {
      params.append("maxPrice", filters.maxPrice.toString());
    }
    if (filters.searchTerm) {
      params.append("searchTerm", filters.searchTerm);
    }
    if (filters.inStock !== undefined) {
      params.append("inStock", filters.inStock.toString());
    }

    return await API.fetch(`/product/filter?${params.toString()}`, {
      method: "GET",
    });
  },

  async getById(productId: string): Promise<Product> {
    return await API.fetch(`/product/${productId}`, {
      method: "GET",
    });
  },

  // async create(data: Omit<Product, "id">): Promise<Product> {
  //   return await API.fetch("/product", {
  //     method: "POST",
  //     body: JSON.stringify(data),
  //   });
  // },

  // async delete(productId: string): Promise<void> {
  //   return await API.fetch(`/product/${productId}`, {
  //     method: "DELETE",
  //   });
  // },
};

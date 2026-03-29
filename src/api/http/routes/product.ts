import { API } from "@/api/connections/tallow";
import type {
  CreateProductDTO,
  Product,
  ProductFilterParams,
  UpdateProductDTO,
} from "@/types/services/product";

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

  async create(data: CreateProductDTO): Promise<Product> {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("category", String(data.category));
    formData.append("price", String(data.price));
    formData.append("stockAmount", String(data.stockAmount));
    formData.append("weight", String(data.weight));
    formData.append("height", String(data.height));
    formData.append("width", String(data.width));
    formData.append("length", String(data.length));
    formData.append("image", data.image);
    data.ingredients.forEach((ingredient, i) => {
      formData.append(`ingredients[${i}]`, ingredient);
    });

    return await API.fetch("/product", {
      method: "POST",
      body: formData,
    });
  },

  async update(data: UpdateProductDTO): Promise<Product> {
    const formData = new FormData();
    if (data.name !== undefined) formData.append("name", data.name);
    if (data.description !== undefined)
      formData.append("description", data.description);
    if (data.category !== undefined)
      formData.append("category", String(data.category));
    if (data.price !== undefined)
      formData.append("price", data.price.toFixed(2));
    if (data.stockAmount !== undefined)
      formData.append("stockAmount", String(data.stockAmount));
    if (data.weight !== undefined)
      formData.append("weight", String(data.weight));
    if (data.height !== undefined)
      formData.append("height", String(data.height));
    if (data.width !== undefined) formData.append("width", String(data.width));
    if (data.length !== undefined)
      formData.append("length", String(data.length));
    if (data.image) formData.append("image", data.image);
    if (data.ingredients) {
      data.ingredients.forEach((ingredient, i) => {
        formData.append(`ingredients[${i}]`, ingredient);
      });
    }

    return await API.fetch(`/product/${data.id}`, {
      method: "PUT",
      body: formData,
    });
  },

  async delete(productId: string): Promise<void> {
    return await API.fetch(`/product/${productId}`, {
      method: "DELETE",
    });
  },
};

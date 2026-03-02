import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { productModule } from "@/api/http/routes/product";
import type { Product, ProductFilterParams } from "@/types/services/product";

export function useProduct(productId?: string, filters?: ProductFilterParams) {
  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 500);

    return () => clearTimeout(timer);
  }, [filters]);

  const { data: products, isLoading } = useQuery({
    queryKey: ["products", "list"],
    queryFn: async () => {
      return await productModule.list();
    },
  });

  const { data: productsByFilter, isLoading: isLoadingByFilter } = useQuery({
    queryKey: ["products", "filter", debouncedFilters],
    queryFn: async () => {
      if (!debouncedFilters) {
        return [];
      }

      const hasFilters = Object.values(debouncedFilters).some(
        (value) => value !== undefined && value !== null && value !== "",
      );

      if (hasFilters) {
        return await productModule.getByFilter(debouncedFilters);
      }

      return [];
    },
    enabled: !!debouncedFilters,
  });

  const {
    data: product,
    isLoading: isProductLoading,
    error,
  } = useQuery<Product>({
    queryKey: ["product", "details", productId],
    queryFn: async () => {
      if (!productId) {
        throw new Error("ID do produto não encontrado!");
      }

      const result = await productModule.getById(productId);

      if (!result?.id) {
        throw new Error("Produto não encontrado!");
      }

      return result;
    },
    enabled: !!productId,
    retry: false,
  });

  return {
    products,
    isLoading,

    productsByFilter,
    isLoadingByFilter,

    product,
    isProductLoading,
    error,
  };
}

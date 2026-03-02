import { useQuery } from "@tanstack/react-query";
import { productModule } from "@/api/http/routes/product";
import type { Product } from "@/types/services/product";

export function useProduct(productId?: string) {
  const { data: products, isLoading } = useQuery({
    queryKey: ["products", "list"],
    queryFn: async () => {
      return await productModule.list();
    },
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

    product,
    isProductLoading,
    error,
  };
}

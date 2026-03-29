import { productModule } from "@/api/http/routes/product";
import type {
  CreateProductDTO,
  Product,
  ProductFilterParams,
  UpdateProductDTO,
} from "@/types/services/product";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useProduct(productId?: string, filters?: ProductFilterParams) {
  const queryClient = useQueryClient();
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

  const createProductMutation = useMutation({
    mutationFn: (data: CreateProductDTO) => productModule.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", "list"] });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: (data: UpdateProductDTO) => productModule.update(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products", "list"] });
      queryClient.invalidateQueries({
        queryKey: ["product", "details", variables.id],
      });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: (productId: string) => productModule.delete(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", "list"] });

      toast.success("Produto excluído com sucesso!");
    },
  });

  return {
    products,
    isLoading,

    productsByFilter,
    isLoadingByFilter,

    product,
    isProductLoading,
    error,

    createProduct: createProductMutation.mutateAsync,
    isCreatingProduct: createProductMutation.isPending,

    updateProduct: updateProductMutation.mutateAsync,
    isUpdatingProduct: updateProductMutation.isPending,

    deleteProduct: deleteProductMutation.mutateAsync,
    isDeletingProduct: deleteProductMutation.isPending,
  };
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cartModule } from "@/api/http/routes/cart";
import type {
  AddToCartRequest,
  Cart,
  UpdateCartItemRequest,
} from "@/types/services/cart";

interface UseCartOptions {
  enableCartQuery?: boolean;
}

export function useCart({ enableCartQuery = false }: UseCartOptions = {}) {
  const queryClient = useQueryClient();

  const cartQuery = useQuery({
    queryKey: ["cart"],
    queryFn: () => cartModule.getCart(),
    enabled: enableCartQuery,
    retry: 1,
    staleTime: 0,
  });

  const addItemMutation = useMutation({
    mutationFn: (data: AddToCartRequest) => cartModule.addItem(data),
    onSuccess: (updatedCart) => {
      queryClient.setQueryData<Cart>(["cart"], updatedCart);
    },
    onError: (_error: Error) => {
      // Error handling...
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: (data: UpdateCartItemRequest) =>
      cartModule.updateItemQuantity(data),

    onSuccess: (updatedCart) => {
      queryClient.setQueryData<Cart>(["cart"], updatedCart);
      toast.success("Quantidade atualizada com sucesso!");
    },

    onError: (_error: Error) => {
      toast.error("Erro ao atualizar quantidade!", {
        description: "Tente atualizá-la novamente ou contate o suporte.",
      });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: (productId: string) => cartModule.removeItem(productId),

    onSuccess: async (updatedCart) => {
      queryClient.setQueryData<Cart>(["cart"], updatedCart);

      await queryClient.invalidateQueries({ queryKey: ["cart"] });

      toast.success("Produto removido do carrinho!");
    },

    onError: (_error: Error) => {
      toast.error("Erro ao remover produto!", {
        description: "Tente remover o produto novamente ou contate o suporte.",
      });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: () => cartModule.clearCart(),

    onSuccess: async (emptyCart) => {
      queryClient.setQueryData<Cart>(["cart"], emptyCart);

      await queryClient.invalidateQueries({ queryKey: ["cart"] });

      toast.success("Carrinho limpo!", {
        description: "Todos os produtos foram removidos do carrinho.",
      });
    },

    onError: (_error: Error) => {
      toast.error("Erro ao limpar carrinho!", {
        description:
          "Não foi possível limpar o carrinho, tente novamente ou contate o suporte.",
      });
    },
  });

  return {
    cart: cartQuery.data ?? queryClient.getQueryData<Cart>(["cart"]),
    isLoading: cartQuery.isLoading,
    error: cartQuery.error,

    addItem: addItemMutation.mutateAsync,
    updateQuantity: updateQuantityMutation.mutateAsync,
    removeItem: removeItemMutation.mutateAsync,
    clearCart: clearCartMutation.mutateAsync,

    isAddingItem: addItemMutation.isPending,
    isUpdatingQuantity: updateQuantityMutation.isPending,
    isRemovingItem: removeItemMutation.isPending,
    isClearingCart: clearCartMutation.isPending,
  };
}

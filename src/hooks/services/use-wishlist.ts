import { wishlistModule } from "@/api/http/routes/wishlist";
import type { WishlistItemDTO } from "@/types/services/wishlist";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface UseWishlistOptions {
  productId?: string;
  enableWishlistQuery?: boolean;
  enableCheckQuery?: boolean;
}

export function useWishlist({
  productId,
  enableWishlistQuery = false,
  enableCheckQuery = false,
}: UseWishlistOptions = {}) {
  const queryClient = useQueryClient();

  const wishlistQuery = useQuery<WishlistItemDTO[]>({
    queryKey: ["wishlist"],
    queryFn: () => wishlistModule.getAll(),
    enabled: enableWishlistQuery,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const checkQuery = useQuery<{ isInWishlist: boolean }>({
    queryKey: ["wishlist", "check", productId],
    queryFn: () => wishlistModule.check(productId!),
    enabled: enableCheckQuery && !!productId,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const addMutation = useMutation({
    mutationFn: (id: string) => wishlistModule.add(id),
    onSuccess: (item) => {
      queryClient.setQueryData<WishlistItemDTO[]>(["wishlist"], (old = []) => [
        ...old,
        item,
      ]);
      queryClient.setQueryData(["wishlist", "check", item.productId], {
        isInWishlist: true,
      });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => wishlistModule.remove(id),
    onSuccess: (_, removedProductId) => {
      queryClient.setQueryData<WishlistItemDTO[]>(["wishlist"], (old = []) =>
        old.filter((item) => item.productId !== removedProductId),
      );
      queryClient.setQueryData(["wishlist", "check", removedProductId], {
        isInWishlist: false,
      });
    },
  });

  return {
    wishlist: wishlistQuery.data ?? [],
    isWishlistLoading: wishlistQuery.isLoading,

    isInWishlist: checkQuery.data?.isInWishlist ?? false,
    isCheckLoading: checkQuery.isLoading,

    addToWishlist: addMutation.mutateAsync,
    isAdding: addMutation.isPending,

    removeFromWishlist: removeMutation.mutateAsync,
    isRemoving: removeMutation.isPending,
  };
}

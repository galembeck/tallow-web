import { giftCardModule } from "@/api/http/routes/gift-card";
import type { PurchaseGiftCardDTO } from "@/types/services/gift-card";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface UseGiftCardOptions {
  enableMyCardsQuery?: boolean;
  enableAllCardsQuery?: boolean;
  giftCardId?: string;
  enableGiftCardQuery?: boolean;
  pollingIntervalMs?: number;
}

export function useGiftCard(options: UseGiftCardOptions = {}) {
  const {
    enableMyCardsQuery = false,
    enableAllCardsQuery = false,
    giftCardId,
    enableGiftCardQuery = false,
    pollingIntervalMs,
  } = options;

  const queryClient = useQueryClient();

  const { data: giftCards, isLoading: isMyCardsLoading } = useQuery({
    queryKey: ["giftCards", "mine"],
    queryFn: () => giftCardModule.getMine(),
    enabled: enableMyCardsQuery,
  });

  const { data: allGiftCards, isLoading: isAllCardsLoading } = useQuery({
    queryKey: ["giftCards", "all"],
    queryFn: () => giftCardModule.getAll(),
    enabled: enableAllCardsQuery,
  });

  const { data: giftCard, isLoading: isGiftCardLoading } = useQuery({
    queryKey: ["giftCards", "detail", giftCardId],
    queryFn: () => giftCardModule.getById(giftCardId!),
    enabled: enableGiftCardQuery && !!giftCardId,
    refetchInterval: pollingIntervalMs,
  });

  const purchaseMutation = useMutation({
    mutationFn: (data: PurchaseGiftCardDTO) => giftCardModule.purchase(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["giftCards"] });
    },
  });

  async function refreshGiftCard(id: string) {
    const updated = await giftCardModule.refresh(id);
    queryClient.setQueryData(["giftCards", "detail", id], updated);
    queryClient.invalidateQueries({ queryKey: ["giftCards", "mine"] });
    return updated;
  }

  const isLoading = isMyCardsLoading || isAllCardsLoading || isGiftCardLoading;

  return {
    giftCards,
    isMyCardsLoading,
    allGiftCards,
    isAllCardsLoading,
    giftCard,
    isGiftCardLoading,
    isLoading,
    purchaseGiftCard: purchaseMutation.mutateAsync,
    isPurchasing: purchaseMutation.isPending,
    refreshGiftCard,
  };
}

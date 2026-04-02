import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/hooks/services/use-cart";
import type { WishlistItemDTO } from "@/types/services/wishlist";
import { formatCurrency } from "@/utils/format-currency";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface WishlistItemCardProps {
  item: WishlistItemDTO;
  onRemove: () => void;
  isRemoving: boolean;
}

export function WishlistItemCard({
  item,
  onRemove,
  isRemoving,
}: WishlistItemCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const stockAmount = item.productStock;

  const { addItem } = useCart();

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= stockAmount) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      await addItem({
        productId: item.productId,
        quantity,
      });

      toast.success("Item adicionado ao carrinho!");
    } catch {
      toast.error("Erro ao adicionar item ao carrinho.", {
        description:
          "Tente novamente mais tarde ou confira a página do produto.",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <Card className="relative overflow-hidden bg-white border-amber-900/30 rounded-xl">
      <CardContent>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex flex-col gap-1">
              <div className="shrink-0 border border-muted-foreground/20 rounded-lg p-2 flex items-center justify-center bg-gray-50 h-20 w-20">
                <img
                  src={item.productImageUrl}
                  alt={item.productName}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <button
                onClick={onRemove}
                disabled={isRemoving}
                className="text-xs text-red-600 hover:underline flex items-center gap-1 mt-1 disabled:opacity-50"
              >
                <Trash2 size={14} />
                {isRemoving ? "Removendo..." : "Remover"}
              </button>
            </div>

            <div className="flex flex-col">
              <h2 className="font-semibold text-amber-950 text-lg line-clamp-2">
                {item.productName}
              </h2>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto border-t md:border-none pt-4 md:pt-0">
            <div className="text-center md:text-right min-w-25">
              <p className="text-[10px] uppercase text-center tracking-wider text-muted-foreground font-medium">
                Preço unitário (R$)
              </p>

              <span className="text-amber-950 font-bold text-center text-base block">
                {formatCurrency(item.productPrice)}
              </span>
            </div>

            <div className="text-center min-w-25">
              <p className="text-[10px] uppercase text-center tracking-wider text-muted-foreground font-medium">
                Quantidade
              </p>

              <div className="flex items-center gap-4">
                <button
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-300 transition-colors hover:border-amber-900 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={quantity <= 1}
                  onClick={() => handleQuantityChange(-1)}
                  type="button"
                >
                  <Minus className="h-4 w-4" />
                </button>

                <input
                  className="w-12 rounded border border-gray-300 px-2 py-1 text-center text-lg"
                  readOnly
                  type="text"
                  value={quantity}
                />

                <button
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-300 transition-colors hover:border-amber-900 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={quantity >= stockAmount}
                  onClick={() => handleQuantityChange(1)}
                  type="button"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="w-full sm:w-auto">
              {item.productStock > 0 ? (
                <Button
                  className="w-full flex items-center gap-2 bg-lime-800 hover:bg-lime-900 text-white transition-colors"
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                >
                  <ShoppingCart size={18} />

                  <span className="whitespace-nowrap">
                    Adicionar ao carrinho
                  </span>
                </Button>
              ) : (
                <Button
                  variant="outline"
                  disabled
                  className="w-full whitespace-nowrap bg-red-100 text-red-500 disabled:opacity-100"
                >
                  Produto indisponível
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

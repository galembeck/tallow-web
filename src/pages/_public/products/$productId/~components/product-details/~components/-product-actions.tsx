import { WishlistButton } from "@/components/wishlist-button";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Minus, Plus, ShoppingCart } from "lucide-react";

interface ProductActionsProps {
  productId: string;
  price: number;
  stockAmount: number;
  quantity: number;
  setQuantity: (quantity: number) => void;
  handleAddToCart: () => void;
  isAddingItem: boolean;
}

export function ProductActions({
  productId,
  price,
  stockAmount,
  quantity,
  setQuantity,
  handleAddToCart,
  isAddingItem,
}: ProductActionsProps) {
  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= stockAmount) {
      setQuantity(newQuantity);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between gap-2 rounded-lg border border-amber-200 bg-linear-to-br from-amber-50 to-orange-50 p-4">
        <div className="flex flex-col items-center gap-2">
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

          <span className="text-gray-600">({stockAmount} disponíveis)</span>
        </div>

        <span className="mb-2 font-medium text-3xl text-amber-900">
          R$ {price.toFixed(2).replace(".", ",")}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <Button
          className="w-full cursor-pointer bg-amber-900 py-6 font-semibold text-base hover:bg-amber-900/90"
          disabled={isAddingItem || stockAmount === 0}
          onClick={handleAddToCart}
        >
          {isAddingItem ? (
            <span className="flex items-center gap-2">
              <Spinner />
              Adicionando ao carrinho...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <ShoppingCart />
              Adicionar ao carrinho
            </span>
          )}
        </Button>

        <WishlistButton
          productId={productId}
          showLabel
          className="w-full border-2 border-amber-900 bg-white py-6 text-base text-black hover:bg-amber-50"
        />
      </div>
    </>
  );
}

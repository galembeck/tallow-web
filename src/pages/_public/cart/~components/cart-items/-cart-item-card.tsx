import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CartItemCardProps {
  productId: string;
  productName: string;
  productDescription: string;
  productImageUrl: string;
  unitPrice: number;
  subTotal: number;
  quantity: number;
  stockAvailable: number;
  updateQuantity: (productId: string, newQuantity: number) => void;
  isUpdatingQuantity?: boolean;
  removeItem: (productId: string) => void;
  isRemovingItem?: boolean;
}

export function CartItemCard({
  productId,
  productName,
  productDescription,
  productImageUrl,
  unitPrice,
  subTotal,
  quantity,
  stockAvailable,
  updateQuantity,
  isUpdatingQuantity,
  removeItem,
  isRemovingItem,
}: CartItemCardProps) {
  return (
    <div className="rounded-lg bg-white p-4 shadow-md">
      <div className="flex gap-4">
        <div className="h-32 w-32 shrink-0 overflow-hidden rounded-lg">
          {/** biome-ignore lint/correctness/useImageSize: sized by @TailwindCSS */}
          <img
            alt={productName}
            className="h-full w-full object-cover"
            src={productImageUrl}
          />
        </div>

        <div className="flex-1">
          <div className="flex justify-between">
            <h3 className="font-semibold text-amber-950 text-xl">
              {productName}
            </h3>

            <Button
              className="cursor-pointer text-red-500 transition-colors hover:text-red-700"
              disabled={isRemovingItem}
              onClick={() => removeItem(productId)}
              variant="ghost"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>

          <p className="mb-4 line-clamp-2 text-gray-600">
            {productDescription}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-amber-900 text-amber-900 transition-colors hover:bg-amber-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-inherit disabled:hover:text-amber-900"
                disabled={quantity <= 1 || isUpdatingQuantity}
                onClick={() => updateQuantity(productId, quantity - 1)}
                type="button"
              >
                <Minus className="h-4 w-4" />
              </button>

              <span className="w-8 text-center">{quantity}</span>

              <button
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-amber-900 text-amber-900 transition-colors hover:bg-amber-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-inherit disabled:hover:text-amber-900"
                disabled={quantity >= stockAvailable || isUpdatingQuantity}
                onClick={() => updateQuantity(productId, quantity + 1)}
                type="button"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <div className="text-right">
              <p className="text-gray-500 text-sm">
                R$ {unitPrice.toFixed(2).replace(".", ",")} cada
              </p>
              <p className="text-amber-900 text-xl">
                R$ {subTotal.toFixed(2).replace(".", ",")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

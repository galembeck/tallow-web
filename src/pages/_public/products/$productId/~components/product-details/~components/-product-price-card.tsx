import { Minus, Plus } from "lucide-react";

interface ProductPriceCardProps {
  price: number;
  stockAmount: number;
  quantity: number;
  setQuantity: (quantity: number) => void;
}

export function ProductPriceCard({
  price,
  stockAmount,
  quantity,
  setQuantity,
}: ProductPriceCardProps) {
  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= stockAmount) {
      setQuantity(newQuantity);
    }
  };

  return (
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
  );
}

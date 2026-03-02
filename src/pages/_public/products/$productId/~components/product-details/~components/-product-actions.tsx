import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProductActions() {
  return (
    <div className="flex flex-col gap-2">
      <Button className="flex w-full cursor-pointer items-center bg-amber-900 py-6 font-semibold text-base hover:bg-amber-900/90">
        <ShoppingCart />
        Adicionar ao carrinho
      </Button>

      <Button
        className="flex w-full cursor-pointer items-center border-2 border-amber-900 bg-white py-6 text-base text-black"
        variant="outline"
      >
        <Heart />
        Adicionar aos favoritos
      </Button>
    </div>
  );
}

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { WishlistItemDTO } from "@/types/services/wishlist";
import { formatCurrency } from "@/utils/format-currency";
import { useNavigate } from "@tanstack/react-router";
import { Check, Trash2, X } from "lucide-react";

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
  const navigate = useNavigate();

  const isOutOfStock = item.productStock <= 0;

  return (
    <Card key={item.id} className="relative overflow-hidden">
      <CardContent className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-4">
          {!isOutOfStock ? (
            <Badge className="w-fit bg-lime-100 text-green-600 hover:bg-lime-100 uppercase font-bold border-none">
              <article className="flex items-center gap-1">
                <Check className="size-3" />

                <span>Em estoque</span>
              </article>
            </Badge>
          ) : (
            <Badge className="w-fit bg-red-100 text-red-600 hover:bg-red-100 uppercase font-bold border-none">
              <article className="flex items-center gap-1">
                <X className="size-3" />
                <span>Indisponível</span>
              </article>
            </Badge>
          )}

          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 shrink-0">
              <img
                src={item.productImageUrl}
                alt={item.productName}
                className={`h-full w-full rounded-md object-cover ${
                  isOutOfStock ? "grayscale opacity-50" : ""
                }`}
              />

              {isOutOfStock && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-destructive/90 text-destructive-foreground text-[10px] font-bold uppercase px-1 py-0.5 rounded shadow-sm rotate-[-15deg]">
                    Esgotado
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col gap-1 min-w-0">
              <span
                className={`font-semibold text-sm truncate ${isOutOfStock ? "text-muted-foreground" : ""}`}
              >
                {item.productName}
              </span>
              <span className="text-muted-foreground text-sm font-medium">
                {formatCurrency(item.productPrice)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              navigate({
                to: "/products/$productId",
                params: { productId: item.productId },
              })
            }
          >
            Ver produto
          </Button>

          <Button
            variant="ghost"
            size="icon"
            disabled={isRemoving}
            className="text-muted-foreground hover:text-destructive"
            onClick={onRemove}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

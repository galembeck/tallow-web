import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useWishlist } from "@/hooks/services/use-wishlist";
import type { WishlistItemDTO } from "@/types/services/wishlist";
import { formatCurrency } from "@/utils/format-currency";
import { useNavigate } from "@tanstack/react-router";
import { Check, Heart, Trash2, X } from "lucide-react";

export function WishlistSection() {
  const navigate = useNavigate();
  const { wishlist, isWishlistLoading, removeFromWishlist, isRemoving } =
    useWishlist({ enableWishlistQuery: true });

  if (isWishlistLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        Carregando lista de desejos...
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-4 py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Heart className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-lg">Lista de desejos vazia</h3>
            <p className="text-muted-foreground text-sm mt-1">
              Você ainda não salvou nenhum produto na sua lista de desejos.
            </p>
          </div>
          <Button
            className="cursor- bg-amber-900 hover:bg-amber-900/90 text-white"
            onClick={() => navigate({ to: "/products" })}
          >
            Ver produtos
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {wishlist.map((item: WishlistItemDTO) => {
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
                  onClick={() => removeFromWishlist(item.productId)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

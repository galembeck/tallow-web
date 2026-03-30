import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/services/use-auth";
import { useWishlist } from "@/hooks/services/use-wishlist";
import { useNavigate } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  productId: string;
  showLabel?: boolean;
  className?: string;
}

export function WishlistButton({
  productId,
  showLabel = false,
  className,
}: WishlistButtonProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    isInWishlist,
    isCheckLoading,
    addToWishlist,
    isAdding,
    removeFromWishlist,
    isRemoving,
  } = useWishlist({
    productId,
    enableCheckQuery: !!user,
  });

  const isPending = isAdding || isRemoving;

  const handleClick = async () => {
    if (!user) {
      navigate({ to: "/sign-in" });
      return;
    }

    if (isInWishlist) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size={showLabel ? "default" : "icon"}
      disabled={isPending || isCheckLoading}
      onClick={handleClick}
      aria-label={
        isInWishlist ? "Remover da lista de desejos" : "Adicionar à lista de desejos"
      }
      className={cn("cursor-pointer", className)}
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-colors",
          isInWishlist && "fill-current text-red-500",
        )}
      />
      {showLabel && (
        <span>{isInWishlist ? "Remover dos favoritos" : "Adicionar aos favoritos"}</span>
      )}
    </Button>
  );
}

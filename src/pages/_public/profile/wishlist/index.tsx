import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SECTION_META } from "@/constants/public/profile/section-meta";
import { useWishlist } from "@/hooks/services/use-wishlist";
import type { WishlistItemDTO } from "@/types/services/wishlist";
import { createFileRoute } from "@tanstack/react-router";
import { WishlistItemCard } from "./~components/-wishlist-item-card";
import { WishlistEmpty } from "./~components/_related/-wishlist-empty";
import { WishlistLoading } from "./~components/_related/-wishlist-loading";
import { toast } from "sonner";

export const Route = createFileRoute("/_public/profile/wishlist/")({
  component: ProfileWishlistPage,
  head: () => ({
    meta: [{ title: "Lista de favoritos | Terra & Tallow" }],
  }),
});

function ProfileWishlistPage() {
  const { title, description } = SECTION_META.wishlist;

  const { wishlist, isWishlistLoading, removeFromWishlist, isRemoving } =
    useWishlist({ enableWishlistQuery: true });

  if (isWishlistLoading) {
    return <WishlistLoading />;
  }

  if (wishlist.length === 0) {
    return <WishlistEmpty />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-bold text-xl text-amber-950 font-sagona">
          {title}
        </CardTitle>

        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <Separator />

      <CardContent>
        <div className="flex flex-col gap-4">
          {wishlist.map((item: WishlistItemDTO) => {
            return (
              <WishlistItemCard
                key={item.id}
                item={item}
                onRemove={() => {
                  removeFromWishlist(item.productId);
                  toast.success("Produto removido da sua lista de favoritos.");
                }}
                isRemoving={isRemoving}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

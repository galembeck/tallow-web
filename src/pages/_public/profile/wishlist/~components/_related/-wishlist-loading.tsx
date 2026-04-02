import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { SECTION_META } from "@/constants/public/profile/section-meta";

export function WishlistLoading() {
  const { title, description } = SECTION_META.wishlist;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-bold text-xl text-amber-950">
          {title}
        </CardTitle>

        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <Separator />

      <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Spinner />
        <p>Carregando lista de desejos...</p>
      </CardContent>
    </Card>
  );
}

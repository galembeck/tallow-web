import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import { Heart } from "lucide-react";

export function WishlistEmpty() {
  const navigate = useNavigate();

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

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import { Frown } from "lucide-react";

export function OrderNotFound() {
  const navigate = useNavigate();

  return (
    <Card>
      <CardContent>
        <article className="flex flex-col items-center justify-center gap-4 py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Frown className="h-8 w-8 text-muted-foreground" />
          </div>

          <div className="text-center">
            <h3 className="font-semibold text-lg">Pedido não encontrado :/</h3>

            <p className="text-muted-foreground text-sm mt-1">
              Esse pedido não foi encontrado em nossa plataforma.
            </p>
          </div>

          <Button
            className="cursor- bg-amber-900 hover:bg-amber-900/90 text-white"
            onClick={() => navigate({ to: "/profile/orders-history" })}
          >
            Ver pedidos
          </Button>
        </article>
      </CardContent>
    </Card>
  );
}

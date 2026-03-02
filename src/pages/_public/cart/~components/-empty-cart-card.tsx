import { useNavigate } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyCartCard() {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 px-4 py-12">
      <div className="container mx-auto max-w-4xl">
        <article className="rounded-lg bg-white p-12 text-center shadow-lg">
          <ShoppingBag className="mx-auto mb-4 h-20 w-20 text-gray-300" />

          <h2 className="mb-4 text-3xl text-gray-900">
            Seu carrinho está vazio :/
          </h2>

          <p className="mb-8 text-gray-600">
            Adicione produtos ao seu carrinho para começar a comprar.
            <br />
            Explore nossa seleção de produtos e encontre o ideal para você!
          </p>

          <Button
            className="cursor-pointer bg-amber-900 font-semibold text-white uppercase hover:bg-amber-900/90 hover:text-white"
            onClick={() => navigate({ to: "/products" })}
          >
            Explorar produtos
          </Button>
        </article>
      </div>
    </div>
  );
}

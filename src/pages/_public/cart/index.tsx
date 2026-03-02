import { createFileRoute, redirect } from "@tanstack/react-router";
import { Frown } from "lucide-react";
import { useCart } from "@/hooks/services/use-cart";
import { cookies } from "@/lib/cookies";
import { EmptyCartCard } from "./~components/-empty-cart-card";
import { OrderSummaryCard } from "./~components/-order-summary-card";
import { CartItems } from "./~components/cart-items/-cart-items";

export const Route = createFileRoute("/_public/cart/")({
  component: CartPage,
  head: () => ({
    meta: [{ title: "Carrinho | Terra & Tallow" }],
  }),
  beforeLoad: ({ location }) => {
    const token = cookies.get("AccessToken");

    if (!token) {
      throw redirect({
        to: "/sign-in",
        search: {
          redirect: location.href,
        },
      });
    }
  },
});

function CartPage() {
  const {
    cart,
    isLoading,
    error,
    updateQuantity,
    isUpdatingQuantity,
    removeItem,
    isRemovingItem,
  } = useCart({ enableCartQuery: true });

  if (isLoading) {
    return (
      <div className="flex h-80 cursor-pointer flex-col items-center justify-center gap-4 p-6">
        <div className="h-12 w-12 animate-spin rounded-full border-amber-900 border-b-2" />
        <p className="text-gray-500">Carregando carrinho...</p>
      </div>
    );
  }

  if (cart?.items?.length === 0) {
    return <EmptyCartCard />;
  }

  if (error || !cart) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-secondary-green-dark text-white">
        <div className="flex max-w-4xl flex-col items-center justify-center gap-10 text-center">
          <Frown className="size-40 text-amber-900" />

          <article className="flex flex-col gap-4">
            <h1 className="font-bold text-6xl text-black md:text-8xl">Ops!</h1>
            <p className="text-gray-300 text-lg md:text-xl">
              Carrinho não encontrados :/
            </p>
            <p className="text-gray-400 text-sm">
              Parece que não foi possível carregar seu carrinho no momento.
            </p>
          </article>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-8 font-semibold text-4xl text-amber-900">
          Meu carrinho
        </h1>

        <div className="grid gap-8 lg:grid-cols-3">
          <CartItems
            cartItems={cart.items}
            isRemovingItem={isRemovingItem}
            isUpdatingQuantity={isUpdatingQuantity}
            removeItem={removeItem}
            updateQuantity={(productId, newQuantity) =>
              updateQuantity({ productId, quantity: newQuantity })
            }
          />

          <OrderSummaryCard totalAmount={cart.totalAmount} />
        </div>
      </div>
    </main>
  );
}

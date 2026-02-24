import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/cart/")({
  component: CartPage,
});

function CartPage() {
  return <div>Hello "/_public/cart/"!</div>;
}

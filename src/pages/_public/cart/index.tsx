import { createFileRoute, redirect } from "@tanstack/react-router";
import { cookies } from "@/lib/cookies";

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
  return <div>Hello "/_public/cart/"!</div>;
}

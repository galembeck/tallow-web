import { createFileRoute, redirect } from "@tanstack/react-router";
import { cookies } from "@/lib/cookies";
import { CheckoutForm } from "./~components/checkout-form/-checkout-form";

export const Route = createFileRoute("/_public/checkout/")({
  component: CheckoutPage,
  head: () => ({
    meta: [{ title: "Checkout | Terra & Tallow" }],
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

function CheckoutPage() {
  return <CheckoutForm />;
}

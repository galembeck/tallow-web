import { createFileRoute, redirect } from "@tanstack/react-router";
import { cookies } from "@/lib/cookies";
import { SignUpForm } from "./~components/-sign-up-form";

export const Route = createFileRoute("/_auth/sign-up/")({
  component: SignUpPage,
  head: () => ({
    meta: [{ title: "Registrar | Terra & Tallow" }],
  }),
  beforeLoad: () => {
    const token = cookies.get("AccessToken");

    if (token) {
      throw redirect({
        to: "/cart",
      });
    }
  },
});

function SignUpPage() {
  return <SignUpForm />;
}

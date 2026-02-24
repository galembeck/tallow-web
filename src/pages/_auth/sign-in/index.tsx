import { createFileRoute, redirect } from "@tanstack/react-router";
import { cookies } from "@/lib/cookies";
import { SignInForm } from "./~components/-sign-in-form";

export const Route = createFileRoute("/_auth/sign-in/")({
  component: SignInPage,
  beforeLoad: () => {
    const token = cookies.get("AccessToken");

    if (token) {
      throw redirect({
        to: "/cart",
      });
    }
  },
});

function SignInPage() {
  return <SignInForm />;
}

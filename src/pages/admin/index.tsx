import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuth } from "@/hooks/services/use-auth";
import { cookies } from "@/lib/cookies";
import { ProfileType } from "@/types/enums/profile-type";

export const Route = createFileRoute("/admin/")({
  component: AdminPage,
  head: () => ({
    meta: [{ title: "Painel administrativo | Terra & Tallow" }],
  }),
  beforeLoad: ({ location }) => {
    const token = cookies.get("AccessToken");

    const { user } = useAuth();

    if (!token) {
      throw redirect({
        to: "/sign-in",
        search: {
          redirect: location.href,
        },
      });
    }
    if (user?.role !== ProfileType.ADMIN) {
      throw redirect({
        to: "/",
        search: {
          redirect: location.href,
        },
      });
    }
  },
});

function AdminPage() {
  return <div>Hello "/admin/"!</div>;
}

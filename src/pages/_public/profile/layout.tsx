import { useAuth } from "@/hooks/services/use-auth";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ProfileInformation } from "./~components/-profile-information";
import { navItems } from "@/constants/public/profile/nav-items";
import { ProfileSkeleton } from "./~components/-profile-skeleton";

export const Route = createFileRoute("/_public/profile")({
  component: ProfileLayout,
  pendingComponent: ProfileSkeleton,
  head: () => ({
    meta: [{ title: "Minha Conta | Terra & Tallow" }],
  }),
});

function ProfileLayout() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
        <aside>
          <ProfileInformation user={user} navItems={navItems} />
        </aside>

        <main className="flex flex-col gap-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

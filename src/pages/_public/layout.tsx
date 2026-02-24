import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export const Route = createFileRoute("/_public")({
  component: PublicLayout,
});

function PublicLayout() {
  return (
    <main className="min-h-screen w-full text-black dark:text-white">
      <Header />

      <div>
        <Outlet />
      </div>

      <Footer />
    </main>
  );
}

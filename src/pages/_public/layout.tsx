import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { TooltipProvider } from "@/components/ui/tooltip";

export const Route = createFileRoute("/_public")({
  component: PublicLayout,
});

function PublicLayout() {
  return (
    <main className="min-h-screen w-full text-black dark:text-white">
      <Header />

      <div>
        <TooltipProvider>
          <Outlet />
        </TooltipProvider>
      </div>

      <Footer />
    </main>
  );
}

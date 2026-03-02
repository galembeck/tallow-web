import { createRootRoute, HeadContent, Outlet } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { ThemeProvider } from "../providers/theme-provider";
import { NotFoundPage } from "./_error/not-found";

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => <NotFoundPage />,
});

function RootComponent() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="tallow-theme">
      <HeadContent />
      <Outlet />
      <Toaster />
    </ThemeProvider>
  );
}

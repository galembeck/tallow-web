import { createRootRoute, HeadContent, Outlet } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { ThemeProvider } from "../providers/theme-provider";

export const Route = createRootRoute({
  component: RootComponent,
  // notFoundComponent: () => <NotFound />,
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

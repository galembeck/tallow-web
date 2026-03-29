import { createRootRoute, HeadContent, Outlet } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { NotFoundPage } from "./_error/not-found";

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => <NotFoundPage />,
});

function RootComponent() {
  return (
    <>
      <HeadContent />
      <Outlet />
      <Toaster />
    </>
  );
}

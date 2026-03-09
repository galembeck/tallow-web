import {
  createFileRoute,
  Outlet,
  redirect,
  useLocation,
  useNavigate,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/services/use-auth";
import { cookies } from "@/lib/cookies";
import { ThemeProvider } from "@/providers/theme-provider";
import { NotificationDropdown } from "./~components/-notification-dropdown";
import { AdminSidebar } from "./~components/sidebar/-admin-sidebar";
import { SearchSection } from "./~components/sidebar/content-elements/-search-section";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
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

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useAuth();

  useEffect(() => {
    if (Number(user?.profileType) !== 1) {
      navigate({ to: "/", replace: true });
    }
  }, [user, navigate]);

  const pageLabels: Record<string, string> = {
    "/admin/dashboard": "Dashboard (Overview)",

    "/admin/profile": "Perfil",
    "/admin/settings": "Configurações de Conta",

    "/admin/products": "Produtos",
    "/admin/products/$productId": "Detalhes do Produto",
    "/admin/payments": "Pagamentos",

    "/admin/clients": "Clientes",
    "/admin/client-detail/$clientId": "Detalhes do Cliente",

    "/admin/roadmap": "Roadmap",
  };

  function derivativePaths(path: string) {
    if (path.startsWith("/admin/client-detail")) {
      return "/admin/client-detail/$clientId";
    }

    if (path.startsWith("/admin/products/")) {
      return "/admin/products/$productId";
    }

    return path;
  }

  const currentPageLabel =
    pageLabels[derivativePaths(location.pathname)] ||
    "Página não reconhecida...";

  return (
    <ThemeProvider defaultTheme="light" storageKey="tallow-theme">
      <div className="min-h-screen w-full">
        <SidebarProvider>
          <AdminSidebar />

          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center justify-between gap-2 pr-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator
                  className="mr-2 data-[orientation=vertical]:h-4"
                  orientation="vertical"
                />
                <Breadcrumb>
                  <BreadcrumbList>
                    {location.pathname !== "/app" && (
                      <>
                        <BreadcrumbItem>
                          <BreadcrumbLink href="/app/dashboard">
                            Painel Administrativo
                          </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                      </>
                    )}
                    <BreadcrumbItem>
                      <BreadcrumbPage>{currentPageLabel}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>

              <div className="flex items-center gap-2">
                <div className="hidden lg:block">
                  <SearchSection />
                </div>

                <NotificationDropdown />

                <ThemeToggle />
              </div>
            </header>

            <main className="container mx-auto space-y-8 p-4">
              <Outlet />
            </main>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </ThemeProvider>
  );
}

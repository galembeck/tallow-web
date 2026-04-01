import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import {
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function CompanyInformation() {
  const { state } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex flex-col items-center justify-center gap-3 py-6">
        <Link className="flex flex-col items-center gap-2" to="/">
          {/** biome-ignore lint/correctness/useImageSize: sized by @TailwindCSS */}
          <img
            alt="Terra & Tallow"
            className="size-15"
            src="/assets/icons/logo.svg"
          />

          <h1
            className={`font-semibold text-black text-xl lg:text-2xl dark:text-white ${state === "collapsed" ? "hidden" : "block"}`}
          >
            Terra & Tallow
          </h1>
        </Link>

        <Badge
          className={`text-center font-bold text-xs uppercase ${state === "collapsed" ? "hidden" : "block"}`}
          variant="outline"
        >
          Dashboard
        </Badge>
      </SidebarMenuItem>

      <SidebarMenuItem>
        {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
                size="lg"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary-green text-sidebar-primary-foreground">
                  <LayoutDashboard className="size-5" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {user?.companyInformation.companyName}
                  </span>
                  <span className="truncate text-muted-foreground text-xs">
                    {user?.companyInformation.businessDescription}
                  </span>
                </div>
                <ArrowRight className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-(--radix-dropdown-menu-trigger-width) min-w-fit rounded-lg"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel className="flex flex-col gap-2 items-center justify-center text-muted-foreground py-4">
                  <Building2 size={50} />
                  Informações do negócio
                </DropdownMenuLabel>

                <DropdownMenuItem>
                  <span className="font-bold flex items-center">
                    <Dot />
                    Nome:
                  </span>
                  <p className="dark:text-white/80">
                    {user.companyInformation.companyName}
                  </p>
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <span className="font-bold flex items-center">
                    <Dot />
                    CNPJ:
                  </span>
                  <p className="dark:text-white/80">
                    {formatCNPJ(user.companyInformation.companyDocument)}
                  </p>
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <span className="font-bold flex items-center">
                    <Dot />
                    Segmento:
                  </span>
                  <p className="dark:text-white/80">
                    {
                      BusinessSegmentLabels[
                        user.companyInformation
                          .businessSegment as BusinessSegment
                      ]
                    }
                  </p>
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <span className="font-bold flex items-center">
                    <Dot />
                    Faturamento:
                  </span>
                  <p className="dark:text-white/80">
                    {
                      MonthlyRevenueLabels[
                        user.companyInformation.monthlyRevenue as MonthlyRevenue
                      ]
                    }
                  </p>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => navigate({ to: "/app/settings" })}
              >
                <Pencil />
                Editar informações
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

import { useNavigate } from "@tanstack/react-router";
import { Settings2, SquareTerminal } from "lucide-react";
import type { ComponentProps } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { dashboardData } from "@/constants/admin/dashboard/sidebar";
import { CompanyInformation } from "./content-elements/-company-information";
import { NavigationContent } from "./content-elements/-navigation-content";
import { SearchSection } from "./content-elements/-search-section";
import { UserProfile } from "./content-elements/-user-profile";
import { Badge } from "@/components/ui/badge";

export function AdminSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <CompanyInformation />
        <SearchSection />
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenuItem className="h-12 p-2 pt-4">
          <SidebarMenuButton
            className="cursor-pointer"
            onClick={() => navigate({ to: "/admin" })}
            tooltip="Admin panel/dashboard (overview)"
          >
            <SquareTerminal />
            <span>Dashboard</span>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <NavigationContent items={dashboardData.primary} section="Principal" />

        <SidebarGroup>
          <SidebarGroupLabel>Sistema</SidebarGroupLabel>
          <SidebarMenuItem>
            <SidebarMenuButton
              // onClick={() => navigate({ to: "/admin/settings" })}
              tooltip="Configurações"
              className="cursor-not-allowed justify-between"
            >
              <p className="flex items-center gap-1">
                <Settings2 size="16" />
                Configurações
              </p>

              <Badge className="uppercase text-[10px]">Em breve</Badge>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <UserProfile />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

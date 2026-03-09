import type { LucideIcon } from "lucide-react";
import { dashboardData } from "./sidebar";

export interface NavigationItem {
  id: string;
  title: string;
  url: string;
  description: string;
  group: string;
  icon?: LucideIcon;
  keywords: string[];
}

export const searchNavigationItems: NavigationItem[] = [
  {
    id: "dashboard-overview",
    title: "Dashboard",
    url: "/admin/dashboard",
    description: "Visão geral (overview) do dashboard",
    group: "Consolidado",
    icon: dashboardData.consolidated.find((item) => item.title === "Dashboard")
      ?.icon,
    keywords: ["inicio", "home", "consolidado", "overview", "dashboard"],
  },

  {
    id: "profile",
    title: "Perfil",
    url: "/app/profile",
    description: "Gerenciar informações do perfil",
    group: "Conta",
    keywords: ["perfil", "usuario", "conta", "configuracoes pessoais", "dados"],
  },
  {
    id: "settings",
    title: "Configurações",
    url: "/app/settings",
    description: "Configurações do sistema",
    group: "Sistema",
    keywords: [
      "configuracoes",
      "settings",
      "opcoes",
      "preferencias",
      "sistema",
    ],
  },
];

export const getAllNavigationItems = (): NavigationItem[] => {
  const transactionItems: NavigationItem[] = dashboardData.primary.map(
    (item) => ({
      id: `item-${item.title}`,
      title: item.title,
      url: item.url === "#" ? "/app/dashboard" : item.url,
      description: item.description,
      group: "Transações",
      icon: item.icon,
      keywords: [
        "transações",
        "transactions",
        "produtos",
        "cobranças",
        "links de pagamento",
        "clientes",
        "cupons",
        "saques",
        "roadmap",
        "plugins",
        "disputas",
        item.title.toLowerCase(),
      ],
    }),
  );

  return [...searchNavigationItems, ...transactionItems];
};

export const groupNavigationItems = (items: NavigationItem[]) => {
  return items.reduce(
    (acc, item) => {
      const group = item.group;
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(item);
      return acc;
    },
    {} as Record<string, NavigationItem[]>,
  );
};

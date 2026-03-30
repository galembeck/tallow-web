import { Banknote, Package, ShoppingBag, SquareTerminal } from "lucide-react";

export const dashboardData = {
  consolidated: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: SquareTerminal,
      isActive: true,
    },
  ],

  primary: [
    {
      title: "Produtos",
      description: "Crie e gerencie os produtos disponvéis em sua loja",
      url: "/admin/products",
      icon: ShoppingBag,
    },
    {
      title: "Pedidos",
      description:
        "Visualize e gerencie todos os pedidos realizados na sua loja",
      url: "/admin/orders",
      icon: Package,
    },
    {
      title: "Pagamentos",
      description:
        "Crie e gerencie as cobranças/pagamentos através de nossa plataforma",
      url: "/admin/payments",
      icon: Banknote,
    },
  ],
};

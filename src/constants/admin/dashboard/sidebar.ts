import { Banknote, Package, ShieldCheck, ShoppingBag, SquareTerminal, Users } from "lucide-react";

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
    {
      title: "Clientes",
      description: "Visualize e gerencie todos os clientes cadastrados na loja",
      url: "/admin/clients",
      icon: Users,
    },
    {
      title: "Administradores",
      description: "Visualize e gerencie os administradores da plataforma",
      url: "/admin/admins",
      icon: ShieldCheck,
    },
  ],
};

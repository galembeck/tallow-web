import {
  Banknote,
  Package,
  ShieldCheck,
  ShoppingBag,
  SquareTerminal,
  Tag,
  User,
  Users,
} from "lucide-react";

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
      title: "Pagamentos",
      description:
        "Crie e gerencie as cobranças/pagamentos através de nossa plataforma",
      url: "/admin/payments",
      icon: Banknote,
    },
    {
      title: "Pedidos",
      description:
        "Visualize e gerencie todos os pedidos realizados na sua loja",
      url: "/admin/orders",
      icon: Package,
    },
    {
      title: "Cupons",
      description: "Crie e gerencie cupons de desconto para seus clientes",
      url: "/admin/coupons",
      icon: Tag,
    },
    {
      title: "Usuários",
      description: "Visualize e gerencie todos os usuários cadastrados na loja",
      url: "/admin/users",
      icon: Users,
      items: [
        {
          title: "Clientes",
          description:
            "Visualize e gerencie todos os clientes cadastrados na loja",
          url: "/admin/clients",
          icon: User,
        },
        {
          title: "Administradores",
          description:
            "Visualize e gerencie todos os administradores da plataforma",
          url: "/admin/admins",
          icon: ShieldCheck,
        },
      ],
    },
  ],
};

import {
  ArrowUpDown,
  Banknote,
  Box,
  Link,
  Menu,
  Percent,
  ShoppingBag,
  SquareTerminal,
  Swords,
  User2,
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
      title: "Links de Pagamento",
      description: "Crie e gerencie links de pagamento para seus clientes",
      url: "/admin/mamagement",
      icon: Link,
    },
    {
      title: "Clientes",
      description: "Crie e gerencie os clientes de sua loja",
      url: "/admin/clients",
      icon: User2,
    },
    {
      title: "Cupons",
      description: "Crie e gerencie cupons de desconto para seus clientes",
      url: "/admin/mamagement",
      icon: Percent,
    },
    {
      title: "Saques",
      description: "Realize saques para sua conta através de nossa plataforma",
      url: "/admin/mamagement",
      icon: ArrowUpDown,
    },
    {
      title: "Roadmap",
      description: "Visualize nosso roadmap e sugira novas funcionalidades",
      url: "/admin/roadmap",
      icon: Menu,
    },
    {
      title: "Plugins",
      description:
        "Adicione plugins/funcionalidades de nossa plataforma em sua loja",
      url: "/admin/plugins",
      icon: Box,
    },
    {
      title: "Disputas",
      description: "Visualize as disputas de pagamentos realizadas em sua loja",
      url: "/admin/mamagement",
      icon: Swords,
    },
  ],
};

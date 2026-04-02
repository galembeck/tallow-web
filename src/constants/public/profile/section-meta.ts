export const SECTION_META = {
  profile: {
    title: "Dados cadastrais",
    description: "Gerencie seus dados pessoais e/ou altere sua senha.",
    pages: {
      registrationData: {
        title: "Editar dados cadastrais",
        description:
          "Altere seus dados cadastrais para atualizá-los em nossa plataforma.",
      },
      changePassword: {
        title: "Alterar senha",
        description:
          "Altere sua senha para acessar sua conta de forma segura em nossa plataforma.",
      },
    },
  },
  orders: {
    title: "Histórico de pedidos",
    description: "Acompanhe o histórico e o status dos seus pedidos.",
    pages: {
      orderDetails: {
        title: "Detalhes do pedido",
        description:
          "Acompanhe os detalhes do seu pedido, incluindo produtos e status.",
      },
    },
  },
  wishlist: {
    title: "Lista de desejos",
    description:
      "Achou algum produto interessante para mais tarde? Adicione-o em sua lista de desejos!",
  },
  preferences: {
    title: "Configurações e preferências",
    description:
      "Configure suas preferências e opções de conta em nossa plataforma.",
  },
} as const;

export type ProfilePages = keyof typeof SECTION_META;

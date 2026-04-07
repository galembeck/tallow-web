import type { ProfileNavigationItem } from "@/pages/_public/profile/~components/-profile-navigation";
import { Gift, Heart, MapPin, Package, Settings, User } from "lucide-react";

export const navItems: ProfileNavigationItem[] = [
  {
    id: "profile",
    path: "/profile",
    aliases: ["/profile/registration", "/profile/password"],
    label: "Dados cadastrais",
    icon: User,
  },
  {
    id: "orders",
    path: "/profile/orders-history",
    aliases: ["/profile/orders-history/$orderId"],
    label: "Histórico de pedidos",
    icon: Package,
  },
  {
    id: "addresses",
    path: "/profile/registered-addresses",
    aliases: ["/profile/registered-addresses/$addressId"],
    label: "Meus endereços",
    icon: MapPin,
  },
  {
    id: "wishlist",
    path: "/profile/wishlist",
    label: "Lista de favoritos",
    icon: Heart,
  },
  {
    id: "gift-cards",
    path: "/profile/gift-cards",
    aliases: ["/profile/gift-cards/$giftCardId"],
    label: "Vales Presente",
    icon: Gift,
  },
  {
    id: "preferences",
    path: "/profile/preferences",
    label: "Preferências",
    icon: Settings,
    disabled: true,
  },
];

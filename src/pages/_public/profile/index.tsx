import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/services/use-auth";
import { useOrder } from "@/hooks/services/use-order";
import { useUser } from "@/hooks/services/use-user";
import { cookies } from "@/lib/cookies";
import { AvatarUpload } from "@/pages/_public/profile/~components/-avatar-upload";
import { OrdersList } from "@/pages/_public/profile/~components/-orders-list";
import { PasswordForm } from "@/pages/_public/profile/~components/-password-form";
import { PersonalForm } from "@/pages/_public/profile/~components/-personal-form";
import { PreferencesForm } from "@/pages/_public/profile/~components/-preferences-form";
import {
  ProfileNav,
  type ProfileNavItem,
} from "@/pages/_public/profile/~components/-profile-nav";
import { WishlistSection } from "@/pages/_public/profile/~components/-wishlist";
import { ProfileType } from "@/types/enums/profile-type";
import type { OrderResponseDTO } from "@/types/services/order";
import type { UpdateProfileData, UserPreferences } from "@/types/services/user";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Heart, Package, Settings, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_public/profile/")({
  beforeLoad: () => {
    const token = cookies.get("AccessToken");
    if (!token) {
      throw redirect({ to: "/sign-in" });
    }
  },
  component: ProfilePage,
  head: () => ({
    meta: [{ title: "Minha Conta | Terra & Tallow" }],
  }),
});

type ProfileSection = "profile" | "orders" | "wishlist";
// "preferences";

const DEFAULT_PREFERENCES: UserPreferences = {
  receiveEmailOffers: true,
  receiveWhatsappOffers: true,
};

const SECTION_META: Record<
  ProfileSection,
  { title: string; description: string }
> = {
  profile: {
    title: "Meu Perfil",
    description: "Gerencie suas informações pessoais e senha.",
  },
  orders: {
    title: "Meus Pedidos",
    description: "Acompanhe o histórico e o status dos seus pedidos.",
  },
  wishlist: {
    title: "Lista de Desejos",
    description: "Seus produtos favoritos salvos para comprar depois.",
  },
  // preferences: {
  //   title: "Preferências",
  //   description: "Controle como a Terra & Tallow se comunica com você.",
  // },
};

function ProfilePage() {
  const [activeSection, setActiveSection] = useState<ProfileSection>("profile");

  const { user } = useAuth();
  const { updateProfile, isUpdatingProfile } = useUser();

  const { userOrders, isUserOrdersLoading } = useOrder({
    enableUserOrdersQuery: true,
  });

  if (!user) return null;

  const navItems: ProfileNavItem[] = [
    { id: "profile", label: "Meu Perfil", icon: User },
    {
      id: "orders",
      label: "Meus Pedidos",
      icon: Package,
      badge: userOrders?.length ?? 0,
    },
    { id: "wishlist", label: "Lista de Desejos", icon: Heart },
    // { id: "preferences", label: "Preferências", icon: Settings },
  ];

  const handleUpdateProfile = async (data: UpdateProfileData) => {
    try {
      await updateProfile(data);
      toast.success("Informações atualizadas com sucesso!");
    } catch {
      toast.error("Erro ao atualizar as informações.");
    }
  };

  const handleUpdatePassword = async (
    data: Pick<UpdateProfileData, "password" | "passwordConfirmation">,
  ) => {
    try {
      await updateProfile(data);
      toast.success("Senha alterada com sucesso!");
    } catch {
      toast.error("Erro ao alterar a senha.");
    }
  };

  const handleUploadAvatar = async (file: File) => {
    try {
      await updateProfile({ avatar: file });
      toast.success("Foto de perfil atualizada!");
    } catch {
      toast.error("Erro ao enviar a foto.");
    }
  };

  // const handleUpdatePreferences = async (
  //   data: Pick<UpdateProfileData, "receiveEmailOffers" | "receiveWhatsappOffers">,
  // ) => {
  //   try {
  //     await updateProfile(data);
  //     toast.success("Preferências salvas com sucesso!");
  //   } catch {
  //     toast.error("Erro ao salvar as preferências.");
  //   }
  // };

  const { title, description } = SECTION_META[activeSection];

  return (
    <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
        <aside className="flex flex-col gap-4">
          <Card>
            <CardContent className="flex flex-col items-center gap-3 pb-5 pt-6 text-center">
              <AvatarUpload
                user={user}
                onUpload={handleUploadAvatar}
                isUploading={isUpdatingProfile}
                size="lg"
              />
              <div>
                <h2 className="font-semibold text-lg leading-tight">
                  {user.name}
                </h2>
                <p className="text-muted-foreground text-sm">{user.email}</p>
              </div>
              <Badge
                variant={
                  user.profileType === ProfileType.ADMIN
                    ? "default"
                    : "secondary"
                }
                className="text-xs bg-amber-900 text-white uppercase font-semibold"
              >
                {user.profileType === ProfileType.ADMIN
                  ? "Administrador"
                  : "Cliente"}
              </Badge>
            </CardContent>
          </Card>

          <ProfileNav
            items={navItems}
            activeItem={activeSection}
            onSelect={(id) => setActiveSection(id as ProfileSection)}
          />
        </aside>

        <main className="flex flex-col gap-6">
          <div>
            <h1 className="font-semibold text-2xl tracking-tight">{title}</h1>
            <p className="text-muted-foreground text-sm mt-1">{description}</p>
          </div>

          {activeSection === "profile" && (
            <>
              <PersonalForm
                user={user}
                onSubmit={handleUpdateProfile}
                isSubmitting={isUpdatingProfile}
              />
              <PasswordForm
                onSubmit={handleUpdatePassword}
                isSubmitting={isUpdatingProfile}
              />
            </>
          )}

          {activeSection === "orders" && (
            <OrdersList
              orders={userOrders as OrderResponseDTO[] | undefined}
              isLoading={isUserOrdersLoading}
            />
          )}

          {activeSection === "wishlist" && <WishlistSection />}

          {/*{activeSection === "preferences" && (
            <PreferencesForm
              preferences={user.preferences ?? DEFAULT_PREFERENCES}
              onSubmit={handleUpdatePreferences}
              isSubmitting={isUpdatingProfile}
            />
          )}*/}
        </main>
      </div>
    </div>
  );
}

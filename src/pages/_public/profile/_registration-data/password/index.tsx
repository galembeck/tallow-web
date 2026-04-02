import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SECTION_META } from "@/constants/public/profile/section-meta";
import { useAuth } from "@/hooks/services/use-auth";
import { useUser } from "@/hooks/services/use-user";
import type { UpdateProfileData } from "@/types/services/user";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { ProfilePasswordForm } from "./~components/-profile-password-form";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute(
  "/_public/profile/_registration-data/password/",
)({
  component: ProfilePasswordPage,
  head: () => ({
    meta: [{ title: "Alterar senha | Terra & Tallow" }],
  }),
});

function ProfilePasswordPage() {
  const { changePassword } = SECTION_META.profile.pages;

  const { user } = useAuth();
  const { updateProfile, isUpdatingProfile } = useUser();

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

  if (!user) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-bold text-xl text-amber-950">
          {changePassword.title}
        </CardTitle>

        <CardDescription>{changePassword.description}</CardDescription>
      </CardHeader>

      <Separator />

      <CardContent>
        <ProfilePasswordForm
          onSubmit={handleUpdatePassword}
          isSubmitting={isUpdatingProfile}
        />
      </CardContent>
    </Card>
  );
}

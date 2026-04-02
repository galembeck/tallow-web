import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SECTION_META } from "@/constants/public/profile/section-meta";
import { createFileRoute } from "@tanstack/react-router";
import { RegistrationDataForm } from "./~components/-registration-data-form";
import { useAuth } from "@/hooks/services/use-auth";
import { useUser } from "@/hooks/services/use-user";
import { toast } from "sonner";
import type { UpdateProfileData } from "@/types/services/user";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute(
  "/_public/profile/_registration-data/registration/",
)({
  component: ProfileRegistrationPage,
  head: () => ({
    meta: [{ title: "Editar dados cadastrais | Terra & Tallow" }],
  }),
});

function ProfileRegistrationPage() {
  const { registrationData } = SECTION_META.profile.pages;

  const { user } = useAuth();
  const { updateProfile, isUpdatingProfile } = useUser();

  const handleUpdateProfile = async (data: UpdateProfileData) => {
    try {
      await updateProfile(data);
      toast.success("Informações atualizadas com sucesso!");
    } catch {
      toast.error("Erro ao atualizar as informações.");
    }
  };

  if (!user) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-bold text-xl text-amber-950 font-sagona">
          {registrationData.title}
        </CardTitle>

        <CardDescription>{registrationData.description}</CardDescription>
      </CardHeader>

      <Separator />

      <CardContent>
        <RegistrationDataForm
          user={user}
          onSubmit={handleUpdateProfile}
          isSubmitting={isUpdatingProfile}
        />
      </CardContent>
    </Card>
  );
}

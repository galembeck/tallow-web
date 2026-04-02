import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useUser } from "@/hooks/services/use-user";
import { ProfileType } from "@/types/enums/profile-type";
import type { User } from "@/types/services/user";
import { toast } from "sonner";
import { AvatarUpload } from "../../../../components/-avatar-upload";
import {
  ProfileNavigation,
  type ProfileNavigationItem,
} from "./-profile-navigation";

interface ProfileInformationProps {
  user: User;
  navItems: ProfileNavigationItem[];
}

export function ProfileInformation({
  user,
  navItems,
}: ProfileInformationProps) {
  const { updateProfile, isUpdatingProfile } = useUser();

  const handleUploadAvatar = async (file: File) => {
    try {
      await updateProfile({ avatar: file });
      toast.success("Foto de perfil atualizada!");
    } catch {
      toast.error("Erro ao enviar sua foto, tente novamente mais tarde.");
    }
  };

  return (
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
            <h2 className="font-semibold text-lg leading-tight">{user.name}</h2>
            <p className="text-muted-foreground text-sm">{user.email}</p>
          </div>

          <Badge
            variant={
              user.profileType === ProfileType.ADMIN ? "default" : "secondary"
            }
            className="text-xs bg-amber-900 text-white uppercase font-semibold"
          >
            {user.profileType === ProfileType.ADMIN
              ? "Administrador"
              : "Cliente"}
          </Badge>
        </CardContent>
      </Card>

      <ProfileNavigation items={navItems} />
    </aside>
  );
}

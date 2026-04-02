import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SECTION_META } from "@/constants/public/profile/section-meta";
import { useAuth } from "@/hooks/services/use-auth";
import { createFileRoute } from "@tanstack/react-router";
import { Lock, UserCircle } from "lucide-react";
import { ProfileOptionCard } from "./~components/-profile-option-card";
import { ProfileSkeleton } from "./~components/-profile-skeleton";

export const Route = createFileRoute("/_public/profile/")({
  component: ProfilePage,
  pendingComponent: ProfileSkeleton,
});

function ProfilePage() {
  const { user } = useAuth();

  const { title, description } = SECTION_META.profile;

  if (!user) return null;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <Card>
        <CardHeader>
          <CardTitle className="font-bold text-xl text-amber-950">
            {title}
          </CardTitle>

          <CardDescription>{description}</CardDescription>
        </CardHeader>

        <Separator />

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-center">
            <ProfileOptionCard
              to="/profile/registration"
              icon={UserCircle}
              title="Editar dados pessoais"
            />

            <ProfileOptionCard
              to="/profile/password"
              icon={Lock}
              title="Alterar senha"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

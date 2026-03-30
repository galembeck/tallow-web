import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/hooks/services/use-user";
import { ProfileType } from "@/types/enums/profile-type";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AdminLoading } from "./~components/-admin-loading";
import { AdminNotFound } from "./~components/-admin-not-found";
import { InfoRow } from "@/components/info-row";

export const Route = createFileRoute("/admin/_primary/admins/$adminId/")({
  component: AdminDetailsPage,
  head: () => ({
    meta: [{ title: "Detalhes do administrador | Terra & Tallow" }],
  }),
});

function AdminDetailsPage() {
  const navigate = useNavigate();
  const { adminId } = Route.useParams();

  const { admin, isAdminLoading, updateProfileType, isUpdatingProfileType } =
    useUser({
      adminId,
      enableAdminQuery: true,
    });

  const [selectedProfileType, setSelectedProfileType] = useState<string>("");

  const handleProfileTypeChange = async (value: string) => {
    setSelectedProfileType(value);
    try {
      await updateProfileType({
        id: adminId,
        profileType: Number(value) as ProfileType,
      });
      toast.success("Tipo de perfil atualizado com sucesso!");
    } catch {
      toast.error("Erro ao atualizar o tipo de perfil.");
      setSelectedProfileType("");
    }
  };

  if (isAdminLoading) {
    return <AdminLoading />;
  }

  if (!admin) {
    return <AdminNotFound />;
  }

  const currentProfileType = String(selectedProfileType || admin.profileType);

  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8">
      <div className="flex gap-4">
        <Button
          variant="secondary"
          className="mt-1"
          onClick={() => navigate({ to: "/admin/admins" })}
        >
          <ArrowLeft />
        </Button>

        <article>
          <h1 className="font-semibold text-2xl tracking-tight">
            Detalhes do administrador
          </h1>
          <p className="text-muted-foreground text-sm">
            Veja as informações e gerencie o perfil deste usuário
          </p>

          <Badge variant="secondary" className="mt-4 font-mono text-xs">
            ID: {admin.id}
          </Badge>
        </article>
      </div>

      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div>
              <h3 className="font-semibold text-lg mb-4">
                Informações pessoais
              </h3>
              <Separator className="mb-4" />
              <div className="grid grid-cols-2 gap-4">
                <InfoRow label="Nome" value={admin.name} />
                <InfoRow label="E-mail" value={admin.email} />
                <InfoRow label="Telefone" value={admin.cellphone} />
                <InfoRow label="CPF" value={admin.document} />
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Conta</h3>
              <Separator className="mb-4" />
              <div className="grid grid-cols-2 gap-4">
                <InfoRow
                  label="Cadastrado em"
                  value={
                    admin.createdAt
                      ? format(new Date(admin.createdAt), "dd/MM/yyyy")
                      : "—"
                  }
                />
                <InfoRow
                  label="Último acesso"
                  value={
                    admin.lastAccessAt
                      ? format(new Date(admin.lastAccessAt), "dd/MM/yyyy")
                      : "—"
                  }
                />

                <div className="col-span-2 flex flex-col gap-2 mt-2">
                  <Label className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                    Tipo de perfil
                  </Label>
                  <Select
                    value={currentProfileType}
                    onValueChange={handleProfileTypeChange}
                    disabled={isUpdatingProfileType}
                  >
                    <SelectTrigger className="w-full cursor-pointer">
                      <SelectValue placeholder="Selecionar perfil" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={String(ProfileType.ADMIN)}>
                        Administrador
                      </SelectItem>
                      <SelectItem value={String(ProfileType.CLIENT)}>
                        Cliente
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {isUpdatingProfileType && (
                    <p className="text-muted-foreground text-xs">
                      Atualizando perfil...
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

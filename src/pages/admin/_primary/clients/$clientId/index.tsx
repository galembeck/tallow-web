import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/hooks/services/use-user";
import { ProfileType } from "@/types/enums/profile-type";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { ArrowLeft, Pencil, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ClientLoading } from "./~components/-client-loading";
import { ClientNotFound } from "./~components/-client-not-found";
import { InfoRow } from "@/components/info-row";

export const Route = createFileRoute("/admin/_primary/clients/$clientId/")({
  component: ClientDetailsPage,
  head: () => ({
    meta: [{ title: "Detalhes do cliente | Terra & Tallow" }],
  }),
});

interface UpdateFormValues {
  name: string;
  email: string;
}

function ClientDetailsPage() {
  const navigate = useNavigate();
  const { clientId } = Route.useParams();
  const [isEditing, setIsEditing] = useState(false);

  const { client, isClientLoading, updateClient, isUpdatingClient } = useUser({
    clientId,
    enableClientQuery: true,
  });

  const { register, handleSubmit, reset } = useForm<UpdateFormValues>();

  const handleEdit = () => {
    if (client) {
      reset({ name: client.name, email: client.email });
    }
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const onSubmit = async (values: UpdateFormValues) => {
    try {
      await updateClient({ id: clientId, data: values });
      toast.success("Informações do cliente atualizadas com sucesso!");
      setIsEditing(false);
    } catch {
      toast.error("Erro ao atualizar as informações do cliente.");
    }
  };

  if (isClientLoading) {
    return <ClientLoading />;
  }

  if (!client) {
    return <ClientNotFound />;
  }

  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex gap-4">
          <Button
            variant="secondary"
            className="mt-1"
            onClick={() => navigate({ to: "/admin/clients" })}
          >
            <ArrowLeft />
          </Button>

          <article>
            <h1 className="font-semibold text-2xl tracking-tight">
              Detalhes do cliente
            </h1>
            <p className="text-muted-foreground text-sm">
              Veja e gerencie as informações do cliente cadastrado
            </p>

            <Badge variant="secondary" className="mt-4 font-mono text-xs">
              ID: {client.id}
            </Badge>
          </article>
        </div>

        {!isEditing && (
          <Button
            variant="outline"
            className="w-full md:w-fit cursor-pointer"
            onClick={handleEdit}
          >
            <Pencil className="h-4 w-4" />
            Editar informações
          </Button>
        )}
      </div>

      <Card className="w-full">
        <CardContent className="pt-6">
          {isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-4">
                  Editar informações
                </h3>
                <Separator className="mb-6" />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      {...register("name", { required: true })}
                      placeholder="Nome do cliente"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email", { required: true })}
                      placeholder="email@exemplo.com"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="cursor-pointer"
                >
                  <X className="h-4 w-4" />
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isUpdatingClient}
                  className="cursor-pointer"
                >
                  {isUpdatingClient ? "Salvando..." : "Salvar alterações"}
                </Button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div>
                <h3 className="font-semibold text-lg mb-4">
                  Informações pessoais
                </h3>
                <Separator className="mb-4" />
                <div className="grid grid-cols-2 gap-4">
                  <InfoRow label="Nome" value={client.name} />
                  <InfoRow label="E-mail" value={client.email} />
                  <InfoRow label="Telefone" value={client.cellphone} />
                  <InfoRow label="CPF" value={client.document} />
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-4">Conta</h3>
                <Separator className="mb-4" />
                <div className="grid grid-cols-2 gap-4">
                  <InfoRow
                    label="Perfil"
                    value={
                      <Badge
                        variant={
                          client.profileType === ProfileType.ADMIN
                            ? "default"
                            : "secondary"
                        }
                      >
                        {client.profileType === ProfileType.ADMIN
                          ? "Admin"
                          : "Cliente"}
                      </Badge>
                    }
                  />
                  <InfoRow
                    label="Cadastrado em"
                    value={
                      client.createdAt
                        ? format(new Date(client.createdAt), "dd/MM/yyyy")
                        : "—"
                    }
                  />
                  <InfoRow
                    label="Último acesso"
                    value={
                      client.lastAccessAt
                        ? format(new Date(client.lastAccessAt), "dd/MM/yyyy")
                        : "—"
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

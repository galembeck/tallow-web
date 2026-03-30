import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { UpdateProfileData, User } from "@/types/services/user";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type PersonalFormValues = Pick<
  UpdateProfileData,
  "name" | "email" | "cellphone" | "document"
>;

interface PersonalFormProps {
  user: User;
  onSubmit: (data: PersonalFormValues) => Promise<void>;
  isSubmitting: boolean;
}

export function PersonalForm({
  user,
  onSubmit,
  isSubmitting,
}: PersonalFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<PersonalFormValues>({
    defaultValues: {
      name: user.name,
      email: user.email,
      cellphone: user.cellphone,
      document: user.document,
    },
  });

  useEffect(() => {
    reset({
      name: user.name,
      email: user.email,
      cellphone: user.cellphone,
      document: user.document,
    });
  }, [user, reset]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações pessoais</CardTitle>
        <CardDescription>
          Atualize seus dados cadastrais na plataforma.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Nome completo</Label>

              <Input
                id="name"
                {...register("name")}
                placeholder="Seu nome completo"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="email">E-mail</Label>

              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="seu@email.com"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="document">CPF</Label>

              <Input
                id="document"
                {...register("document")}
                placeholder="000.000.000-00"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="cellphone">Telefone</Label>

              <Input
                id="cellphone"
                type="tel"
                {...register("cellphone")}
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={isSubmitting || !isDirty}
              className="cursor-pointer bg-amber-900 hover:bg-amber-900/90 text-white"
            >
              {isSubmitting ? "Salvando..." : "Salvar alterações"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

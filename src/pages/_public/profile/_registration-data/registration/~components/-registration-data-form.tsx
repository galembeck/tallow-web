import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { UpdateProfileData, User } from "@/types/services/user";
import { formatCPF, formatWhatsApp, removeFormat } from "@/utils/format-masks";
import { useForm } from "react-hook-form";

type RegistrationDataFormValues = Pick<
  UpdateProfileData,
  "name" | "email" | "cellphone" | "document"
>;

interface RegistrationDataFormProps {
  user: User;
  onSubmit: (data: RegistrationDataFormValues) => Promise<void>;
  isSubmitting: boolean;
}

export function RegistrationDataForm({
  user,
  onSubmit,
  isSubmitting,
}: RegistrationDataFormProps) {
  const {
    register,
    handleSubmit,
    formState: { isDirty },
  } = useForm<RegistrationDataFormValues>({
    values: {
      name: user.name,
      email: user.email,
      cellphone: formatWhatsApp(user.cellphone || ""),
      document: formatCPF(user.document || ""),
    },
  });

  const handleFormSubmit = (data: RegistrationDataFormValues) => {
    onSubmit({
      ...data,
      cellphone: removeFormat(data.cellphone || ""),
      document: removeFormat(data.document || ""),
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
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
            disabled
            placeholder="000.000.000-00"
            {...register("document", {
              onChange: (e) => {
                e.target.value = formatCPF(e.target.value);
              },
            })}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="cellphone">Telefone</Label>

          <Input
            id="cellphone"
            type="tel"
            placeholder="(00) 00000-0000"
            {...register("cellphone", {
              onChange: (e) => {
                e.target.value = formatWhatsApp(e.target.value);
              },
            })}
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
  );
}

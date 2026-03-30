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
import type { UpdateProfileData } from "@/types/services/user";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

type PasswordSubmitData = Pick<
  UpdateProfileData,
  "password" | "passwordConfirmation"
>;

interface PasswordFormProps {
  onSubmit: (data: PasswordSubmitData) => Promise<void>;
  isSubmitting: boolean;
}

interface PasswordFormValues {
  password: string;
  confirmPassword: string;
}

export function PasswordForm({ onSubmit, isSubmitting }: PasswordFormProps) {
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<PasswordFormValues>();

  const password = watch("password");

  const onFormSubmit = async (values: PasswordFormValues) => {
    await onSubmit({
      password: values.password,
      passwordConfirmation: values.confirmPassword,
    });
    reset();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alterar senha</CardTitle>

        <CardDescription>
          Mantenha sua conta segura com uma senha forte.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Nova senha</Label>

              <div className="relative">
                <Input
                  id="password"
                  type={showNew ? "text" : "password"}
                  {...register("password", {
                    required: "Campo obrigatório",
                    minLength: {
                      value: 8,
                      message: "Mínimo de 8 caracteres",
                    },
                  })}
                  placeholder="Nova senha"
                  className="pr-10"
                />

                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowNew((v) => !v)}
                >
                  {showNew ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="text-destructive text-xs">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="confirmPassword">Confirmar nova senha</Label>

              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  {...register("confirmPassword", {
                    required: "Campo obrigatório",
                    validate: (val) =>
                      val === password || "As senhas não coincidem",
                  })}
                  placeholder="Confirme a nova senha"
                  className="pr-10"
                />

                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowConfirm((v) => !v)}
                >
                  {showConfirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {errors.confirmPassword && (
                <p className="text-destructive text-xs">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer bg-amber-900 hover:bg-amber-900/90 text-white"
            >
              {isSubmitting ? "Alterando..." : "Alterar senha"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

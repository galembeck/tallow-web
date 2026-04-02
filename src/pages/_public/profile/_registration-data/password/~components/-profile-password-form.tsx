import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { UpdateProfileData } from "@/types/services/user";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

type PasswordSubmitData = Pick<
  UpdateProfileData,
  "password" | "passwordConfirmation"
>;

interface ProfilePasswordFormProps {
  onSubmit: (data: PasswordSubmitData) => Promise<void>;
  isSubmitting: boolean;
}

interface ProfilePasswordFormValues {
  password: string;
  confirmPassword: string;
}

export function ProfilePasswordForm({
  onSubmit,
  isSubmitting,
}: ProfilePasswordFormProps) {
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<ProfilePasswordFormValues>({
    mode: "onChange",
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const password = watch("password", "");
  const confirmPassword = watch("confirmPassword", "");

  const validations = {
    minLength: password.length >= 8,
    hasLowercase: /[a-z]/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    hasNumber: /[0-9]/.test(password),
    passwordsMatch: password === confirmPassword && confirmPassword.length > 0,
  };

  const validationList = [
    { label: "Mínimo de 8 caracteres", met: validations.minLength },
    { label: "Pelo menos 1 letra minúscula", met: validations.hasLowercase },
    { label: "Pelo menos 1 letra maiúscula", met: validations.hasUppercase },
    { label: "Pelo menos 1 número", met: validations.hasNumber },
    {
      label: "Pelo menos 1 caractere especial",
      met: validations.hasSpecialChar,
    },
    { label: "As senhas coincidem", met: validations.passwordsMatch },
  ];

  const onFormSubmit = async (values: ProfilePasswordFormValues) => {
    try {
      await onSubmit({
        password: values.password,
        passwordConfirmation: values.confirmPassword,
      });
      reset();
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
    }
  };

  const toggleVisibility = (
    setter: React.Dispatch<React.SetStateAction<boolean>>,
  ) => setter((prev) => !prev);

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Nova senha</Label>

          <div className="relative">
            <Input
              id="password"
              type={showNew ? "text" : "password"}
              {...register("password", {
                required: "Campo obrigatório",
                validate: {
                  hasLowercase: (v) =>
                    /[a-z]/.test(v) ||
                    "A senha deve conter pelo menos uma letra minúscula",
                  hasUppercase: (v) =>
                    /[A-Z]/.test(v) ||
                    "A senha deve conter pelo menos uma letra maiúscula",
                  hasSpecialChar: (v) =>
                    /[!@#$%^&*(),.?":{}|<>]/.test(v) ||
                    "A senha deve conter pelo menos um caractere especial",
                  hasNumber: (v) =>
                    /[0-9]/.test(v) ||
                    "A senha deve conter pelo menos um número",
                  minLength: (v) =>
                    v.length >= 8 || "A senha deve ter no mínimo 8 caracteres",
                },
              })}
              placeholder="Nova senha"
              className="pr-10"
            />

            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => toggleVisibility(setShowNew)}
              aria-label={showNew ? "Ocultar senha" : "Mostrar senha"}
              title={showNew ? "Ocultar senha" : "Mostrar senha"}
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
              onClick={() => toggleVisibility(setShowConfirm)}
              aria-label={showConfirm ? "Ocultar senha" : "Mostrar senha"}
              title={showConfirm ? "Ocultar senha" : "Mostrar senha"}
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

      <article>
        <h6 className="font-semibold text-amber-950">Sua senha deve conter:</h6>

        <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2 md:gap-x-6 md:gap-y-2 py-2 rounded-md">
          {validationList.map((item, index) => (
            <div
              key={index}
              className={`flex items-center gap-2 transition-colors ${
                item.met ? "text-emerald-600" : "text-muted-foreground"
              }`}
            >
              {item.met ? (
                <Check className="h-4 w-4" />
              ) : (
                <X className="h-4 w-4 text-destructive/70" />
              )}
              <span className={item.met ? "font-medium" : ""}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </article>

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          disabled={isSubmitting || !isDirty || !isValid}
          className="cursor-pointer bg-amber-900 hover:bg-amber-900/90 text-white"
        >
          {isSubmitting ? "Alterando..." : "Alterar senha"}
        </Button>
      </div>
    </form>
  );
}

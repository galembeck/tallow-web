import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { useAuth } from "@/hooks/services/use-auth";
import { cookies } from "@/lib/cookies";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const searchSchema = z.object({
  email: z.string().email(),
  token: z.string().min(6),
});

export const Route = createFileRoute("/_auth/password-recovery/reset/")({
  component: PasswordResetPage,
  validateSearch: searchSchema,
  head: () => ({
    meta: [{ title: "Recuperação de senha | Terra & Tallow" }],
  }),
  beforeLoad: ({ search }) => {
    const token = cookies.get("AccessToken");
    if (token) throw redirect({ to: "/cart" });

    if (!search.email || !search.token) {
      throw redirect({ to: "/password-recovery" });
    }
  },
});

const formSchema = z
  .object({
    password: z.string().min(8, {
      message: "A senha deve ter pelo menos 8 caracteres.",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas devem ser iguais.",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof formSchema>;

function PasswordResetPage() {
  const navigate = useNavigate();

  const { email, token } = Route.useSearch();

  const { resetPassword, isResettingPassword } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  async function onSubmit(data: FormData) {
    try {
      await resetPassword({ email, token, newPassword: data.password });

      toast.success("Senha redefinida com sucesso!");

      navigate({ to: "/sign-in" });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error(
        "Não foi possível redefinir a senha, tente novamente mais tarde.",
      );
    }
  }

  return (
    <main className="flex flex-col min-h-screen">
      <Header />

      <div className="flex-1 container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">
              Recuperação de senha
            </CardTitle>
            <CardDescription>
              Para concluir com a recuperação de sua senha, informe abaixo a
              nova senha e confirme-a.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              id="password-reset-form"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FieldGroup>
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        htmlFor="password-reset-form-password"
                        className="text-base"
                      >
                        Nova senha
                      </FieldLabel>

                      <div className="relative">
                        <Lock className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />

                        <input
                          {...field}
                          id="password-reset-form-password"
                          aria-invalid={fieldState.invalid}
                          placeholder="Sua nova senha"
                          type={showPassword ? "text" : "password"}
                          className="w-full rounded-lg border-2 border-gray-200 py-3 pr-4 pl-12 transition-colors focus:border-amber-900 focus:outline-none"
                        />

                        <button
                          type="button"
                          className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => setShowPassword((v) => !v)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="confirmPassword"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        htmlFor="password-reset-form-confirm-password"
                        className="text-base"
                      >
                        Confirmar senha
                      </FieldLabel>

                      <div className="relative">
                        <Lock className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />

                        <input
                          {...field}
                          id="password-reset-form-confirm-password"
                          aria-invalid={fieldState.invalid}
                          placeholder="Confirmar sua nova senha"
                          type={showPasswordConfirmation ? "text" : "password"}
                          className="w-full rounded-lg border-2 border-gray-200 py-3 pr-4 pl-12 transition-colors focus:border-amber-900 focus:outline-none"
                        />

                        <button
                          type="button"
                          className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => setShowPasswordConfirmation((v) => !v)}
                        >
                          {showPasswordConfirmation ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </form>

            <div className="flex justify-end mt-4">
              <Button
                type="submit"
                form="password-reset-form"
                disabled={isResettingPassword}
                className="bg-amber-900 hover:bg-amber-900/90 text-white"
              >
                {isResettingPassword ? "Salvando..." : "Confirmar"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </main>
  );
}

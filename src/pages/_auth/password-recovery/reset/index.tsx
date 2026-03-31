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
import { Input } from "@/components/ui/input";
import { cookies } from "@/lib/cookies";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

export const Route = createFileRoute("/_auth/password-recovery/reset/")({
  component: PasswordResetPage,
  head: () => ({
    meta: [{ title: "Recuperação de senha | Terra & Tallow" }],
  }),
  beforeLoad: () => {
    const token = cookies.get("AccessToken");

    if (token) {
      throw redirect({
        to: "/cart",
      });
    }
  },
});

const passwordResetFormSchema = z
  .object({
    password: z.string().min(8, {
      message: "A senha deve ter pelo menos 8 caracteres",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas devem ser iguais.",
    path: ["confirmPassword"],
  });

type PasswordResetFormData = z.infer<typeof passwordResetFormSchema>;

function PasswordResetPage() {
  const form = useForm<PasswordResetFormData>({
    resolver: zodResolver(passwordResetFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(data: PasswordResetFormData) {
    // TODO: Implement password reset logic

    console.log(data);
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
                      <FieldLabel htmlFor="password-reset-form-password">
                        Nova senha
                      </FieldLabel>

                      <Input
                        {...field}
                        id="password-reset-form-password"
                        aria-invalid={fieldState.invalid}
                        placeholder="Sua nova senha"
                        type="password"
                      />

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
                      <FieldLabel htmlFor="password-reset-form-confirm-password">
                        Confirmar senha
                      </FieldLabel>

                      <Input
                        {...field}
                        id="password-reset-form-confirm-password"
                        aria-invalid={fieldState.invalid}
                        placeholder="Confirmar sua nova senha"
                        type="password"
                      />

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
                className="bg-amber-900 hover:bg-amber-900/90 text-white"
              >
                Continuar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </main>
  );
}

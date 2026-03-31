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
import { RecoveryTokenModal } from "./~components/-recovery-token-modal";

export const Route = createFileRoute("/_auth/password-recovery/")({
  component: PasswordRecoveryPage,
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

const passwordRecoveryFormSchema = z.object({
  email: z.string().email({
    message: "O endereço de e-mail deve ter um formato válido.",
  }),
});

type PasswordRecoveryFormData = z.infer<typeof passwordRecoveryFormSchema>;

function PasswordRecoveryPage() {
  const form = useForm<PasswordRecoveryFormData>({
    resolver: zodResolver(passwordRecoveryFormSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(data: PasswordRecoveryFormData) {
    // TODO: Implement password recovery logic

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
              Para prosseguir com a recuperação de sua senha, informe abaixo o
              seu e-mail para receber o código de verificação.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              id="password-recovery-form"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FieldGroup>
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="password-recovery-form-email">
                        E-mail
                      </FieldLabel>

                      <Input
                        {...field}
                        id="password-recovery-form-email"
                        aria-invalid={fieldState.invalid}
                        placeholder="seu@email.com"
                        type="email"
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
              <RecoveryTokenModal>
                <Button
                  type="submit"
                  form="password-recovery-form"
                  className="bg-amber-900 hover:bg-amber-900/90 text-white"
                >
                  Continuar
                </Button>
              </RecoveryTokenModal>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </main>
  );
}

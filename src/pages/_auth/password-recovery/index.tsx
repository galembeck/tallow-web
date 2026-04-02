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
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { RecoveryTokenModal } from "./~components/-recovery-token-modal";

export const Route = createFileRoute("/_auth/password-recovery/")({
  component: PasswordRecoveryPage,
  head: () => ({
    meta: [{ title: "Recuperação de senha | Terra & Tallow" }],
  }),
  beforeLoad: () => {
    const token = cookies.get("AccessToken");
    if (token) throw redirect({ to: "/cart" });
  },
});

const schema = z.object({
  email: z.string().email({
    message: "O endereço de e-mail deve ter um formato válido.",
  }),
});

type FormData = z.infer<typeof schema>;

function PasswordRecoveryPage() {
  const { requestPasswordRecovery, isRequestingRecovery } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmedEmail, setConfirmedEmail] = useState("");

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  async function onSubmit(data: FormData) {
    try {
      await requestPasswordRecovery(data.email);

      toast.success("Código de verificação enviado com sucesso!");

      setConfirmedEmail(data.email);
      setModalOpen(true);
    } catch {
      toast.error("Não foi possível enviar o código, tente novamente.");
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
                      <FieldLabel
                        htmlFor="password-recovery-form-email"
                        className="text-base"
                      >
                        E-mail
                      </FieldLabel>

                      <div className="relative">
                        <Mail className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />

                        <input
                          {...field}
                          id="password-recovery-form-email"
                          aria-invalid={fieldState.invalid}
                          placeholder="seu@email.com"
                          type="email"
                          className="w-full rounded-lg border-2 border-gray-200 py-3 pl-12 transition-colors focus:border-amber-900 focus:outline-none"
                        />
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
                form="password-recovery-form"
                disabled={isRequestingRecovery}
                className="bg-amber-900 hover:bg-amber-900/90 text-white"
              >
                {isRequestingRecovery ? "Enviando..." : "Continuar"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <RecoveryTokenModal
        open={modalOpen}
        email={confirmedEmail}
        onOpenChange={setModalOpen}
      />

      <Footer />
    </main>
  );
}

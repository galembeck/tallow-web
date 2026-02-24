import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { AlertCircle, Lock, Mail, Sparkles } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useAuth } from "@/hooks/services/use-auth";

const signInSchema = z.object({
  email: z.string().email({
    message: "E-mail inválido",
  }),
  password: z.string().min(1, {
    message: "Senha é obrigatória",
  }),
});

type SignInFormData = z.infer<typeof signInSchema>;

export function SignInForm() {
  const navigate = useNavigate();
  const { login, isLoggingIn } = useAuth();

  const [serverError, setServerError] = useState("");

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleSubmit(values: SignInFormData) {
    try {
      setServerError("");

      await login({
        email: values.email,
        password: values.password,
      });

      toast.success("Login realizado com sucesso!", {
        description: "Bem-vindo de volta!",
      });

      navigate({ to: "/cart" });
    } catch {
      setServerError("E-mail ou senha incorretos");

      toast.error("Erro ao fazer login", {
        description: "Verifique suas credenciais e tente novamente.",
      });
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden bg-amber-900 lg:block lg:w-1/2">
        <div className="absolute inset-0">
          {/** biome-ignore lint/correctness/useImageSize: sized by @TailwindCSS */}
          <img
            alt="Organic beauty products"
            className="h-full w-full object-cover opacity-90"
            src="https://images.unsplash.com/photo-1760621393386-3906922b0b78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwYmVhdXR5JTIwcHJvZHVjdHMlMjBlbGVnYW50fGVufDF8fHx8MTc3MTk0MjE2OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          />
        </div>

        <div className="absolute inset-0 bg-linear-to-br from-amber-900/40 to-orange-900/60" />

        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white">
          <Sparkles className="mb-6 h-16 w-16" />

          <h2 className="mb-6 text-center text-5xl">Bem-vindo de volta!</h2>

          <p className="max-w-lg text-center text-xl opacity-90">
            Continue sua jornada de cuidados naturais com a pele.
            <br />
            <br />
            Sua beleza natural nos aguarda.
          </p>
        </div>
      </div>

      <div className="flex w-full items-center justify-center bg-linear-to-br from-amber-50 to-orange-50 p-8 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="rounded-2xl bg-white p-8 shadow-2xl lg:p-12">
            <div className="mb-8 text-center">
              <Link
                className="mb-4 inline-block font-medium text-3xl text-amber-900"
                to="/"
              >
                Terra & Tallow
              </Link>

              <h1 className="mb-2 text-3xl text-gray-900">Entrar</h1>

              <p className="text-gray-600">Acesse sua conta</p>
            </div>

            {serverError && (
              <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
                <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />

                <p className="text-red-700 text-sm">{serverError}</p>
              </div>
            )}

            <form
              className="space-y-5"
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              <div>
                <label
                  className="mb-2 block text-gray-700 text-sm"
                  htmlFor="email"
                >
                  E-mail
                </label>

                <div className="relative">
                  <Mail className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />

                  <input
                    {...form.register("email")}
                    className="w-full rounded-lg border-2 border-gray-200 py-3 pr-4 pl-12 transition-colors focus:border-amber-900 focus:outline-none"
                    placeholder="seu@email.com"
                    type="email"
                  />
                </div>

                {form.formState.errors.email && (
                  <p className="mt-1 text-red-500 text-sm">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="mb-2 block text-gray-700 text-sm"
                  htmlFor="password"
                >
                  Senha
                </label>

                <div className="relative">
                  <Lock className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />

                  <input
                    {...form.register("password")}
                    className="w-full rounded-lg border-2 border-gray-200 py-3 pr-4 pl-12 transition-colors focus:border-amber-900 focus:outline-none"
                    placeholder="••••••••"
                    type="password"
                  />
                </div>

                {form.formState.errors.password && (
                  <p className="mt-1 text-red-500 text-sm">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              <button
                className="w-full rounded-lg bg-amber-900 py-3.5 text-lg text-white shadow-lg transition-colors hover:bg-amber-800 hover:shadow-xl disabled:opacity-70"
                disabled={isLoggingIn}
                type="submit"
              >
                {isLoggingIn ? "Entrando..." : "Entrar"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Não tem uma conta?{" "}
                <Link className="text-amber-900 hover:underline" to="/sign-up">
                  Criar conta
                </Link>
              </p>
            </div>

            <div className="mt-6 border-t pt-6 text-center">
              <Link
                className="text-gray-600 text-sm transition-colors hover:text-amber-900"
                to="/"
              >
                ← Voltar para home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { AlertCircle, ArrowLeft, Leaf, Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useAuth } from "@/hooks/services/use-auth";
import { formatCPF, formatWhatsApp, removeFormat } from "@/utils/format-masks";

const signUpSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Nome deve ter no mínimo 2 caracteres" }),

    email: z.string().email({
      message: "E-mail inválido",
    }),

    cellphone: z.string().min(11, {
      message: "Telefone deve ter 11 dígitos",
    }),

    document: z.string().min(11, {
      message: "Documento inválido",
    }),

    password: z.string().min(8, {
      message: "A senha deve ter pelo menos 8 caracteres",
    }),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

export function SignUpForm() {
  const navigate = useNavigate();

  const { register, isRegistering, login } = useAuth();

  const [serverError, setServerError] = useState("");

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      cellphone: "",
      document: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: SignUpFormData) {
    try {
      const cleanCellphone = removeFormat(values.cellphone);
      const cleanDocument = removeFormat(values.document);

      setServerError("");

      await register({
        name: values.name,
        email: values.email,
        password: values.password,
        cellphone: cleanCellphone,
        document: cleanDocument,
        role: 2, // Cliente
      });

      await login({
        email: values.email,
        password: values.password,
      });

      toast.success("Cadastro realizado com sucesso!", {
        description: "Bem-vindo! Pronto para sua jornada de beleza natural?",
      });

      navigate({ to: "/cart" });
    } catch {
      setServerError(
        "Ocorreu um erro ao registrar, tente novamente mais tarde!",
      );

      toast.error("Erro ao registrar", {
        description:
          "Tente novamente mais tarde ou entre em contato com o suporte.",
      });
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden bg-amber-900 lg:block lg:w-1/2">
        <div className="absolute inset-0">
          {/** biome-ignore lint/correctness/useImageSize: sized by @TailwindCSS */}
          <img
            alt="Terra & Tallow"
            className="h-full w-full object-cover opacity-90"
            src="https://images.unsplash.com/photo-1643379855889-850035817d24"
          />
        </div>

        <div className="absolute inset-0 bg-linear-to-br from-amber-900/40 to-orange-900/60" />

        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white md:bottom-50">
          <Leaf className="mb-6 h-16 w-16" />

          <h2 className="mb-6 text-center text-5xl">Terra & Tallow</h2>
          <p className="max-w-md text-center text-xl opacity-90">
            Descubra o poder dos produtos naturais e transforme sua rotina de
            cuidados com a pele
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

              <h1 className="mb-2 text-2xl text-gray-900">Registre-se</h1>
              <p className="text-gray-600">
                Comece sua jornada natural agora mesmo!
              </p>

              {/* <div className="mt-4 flex items-center justify-center gap-2">
                <div
                  className={`h-2 w-16 rounded-full ${step === 1 ? "bg-amber-900" : "bg-amber-300"}`}
                />
                <div
                  className={`h-2 w-16 rounded-full ${step === 2 ? "bg-amber-900" : "bg-gray-300"}`}
                />
              </div> */}
            </div>

            {serverError && (
              <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
                <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />

                <p className="text-red-700 text-sm">{serverError}</p>
              </div>
            )}

            <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
              <div>
                <label
                  className="mb-2 block text-gray-700 text-sm"
                  htmlFor="name"
                >
                  Nome completo
                </label>

                <div className="relative">
                  <User className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />

                  <input
                    {...form.register("name")}
                    className="w-full rounded-lg border-2 border-gray-200 py-3 pr-4 pl-12 focus:border-amber-900 focus:outline-none"
                    placeholder="Seu nome"
                  />
                </div>

                {form.formState.errors.name && (
                  <p className="mt-1 text-red-500 text-sm">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

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
                    className="w-full rounded-lg border-2 border-gray-200 py-3 pr-4 pl-12 focus:border-amber-900 focus:outline-none"
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
                  htmlFor="cellphone"
                >
                  Telefone
                </label>

                <input
                  {...form.register("cellphone")}
                  className="w-full rounded-lg border-2 border-gray-200 px-4 py-3 focus:border-amber-900 focus:outline-none"
                  onChange={(e) => {
                    const formatted = formatWhatsApp(e.target.value);
                    e.target.value = formatted;
                  }}
                  placeholder="(11) 99999-9999"
                />

                {form.formState.errors.cellphone && (
                  <p className="mt-1 text-red-500 text-sm">
                    {form.formState.errors.cellphone.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="mb-2 block text-gray-700 text-sm"
                  htmlFor="document"
                >
                  Documento
                </label>

                <input
                  {...form.register("document")}
                  className="w-full rounded-lg border-2 border-gray-200 px-4 py-3 focus:border-amber-900 focus:outline-none"
                  onChange={(e) => {
                    const formatted = formatCPF(e.target.value);
                    e.target.value = formatted;
                  }}
                  placeholder="CPF"
                />

                {form.formState.errors.document && (
                  <p className="mt-1 text-red-500 text-sm">
                    {form.formState.errors.document.message}
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
                    className="w-full rounded-lg border-2 border-gray-200 py-3 pr-4 pl-12 focus:border-amber-900 focus:outline-none"
                    placeholder="Mínimo 8 caracteres"
                    type="password"
                  />
                </div>

                {form.formState.errors.password && (
                  <p className="mt-1 text-red-500 text-sm">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="mb-2 block text-gray-700 text-sm"
                  htmlFor="confirmPassword"
                >
                  Confirmar senha
                </label>

                <div className="relative">
                  <Lock className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />

                  <input
                    {...form.register("confirmPassword")}
                    className="w-full rounded-lg border-2 border-gray-200 py-3 pr-4 pl-12 focus:border-amber-900 focus:outline-none"
                    placeholder="Digite a senha novamente"
                    type="password"
                  />
                </div>

                {form.formState.errors.confirmPassword && (
                  <p className="mt-1 text-red-500 text-sm">
                    {form.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  className="w-full rounded-lg bg-amber-900 py-3.5 font-semibold text-white uppercase shadow-lg transition-colors hover:bg-amber-800 disabled:opacity-70"
                  disabled={isRegistering}
                  type="submit"
                >
                  {isRegistering ? "Criando conta..." : "Criar conta"}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Já tem uma conta?{" "}
                <Link className="text-amber-900 hover:underline" to="/sign-in">
                  Entrar
                </Link>
              </p>
            </div>

            <div className="mt-6 border-t pt-6 text-center">
              <Link
                className="flex items-center justify-center gap-2 text-gray-600 text-sm hover:text-amber-900"
                to="/"
              >
                <ArrowLeft className="size-4" />
                Voltar para home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

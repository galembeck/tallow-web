import { User } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { CheckoutFormData } from "@/constants/checkout";
import { formatCPF, formatWhatsApp, removeFormat } from "@/utils/format-masks";
import { isValidCPF } from "@/utils/is-valid-masks";

interface PersonalFormStepProps {
  form: UseFormReturn<CheckoutFormData>;
  onNext: () => void;
}

export function PersonalFormStep({ form, onNext }: PersonalFormStepProps) {
  const documentDigits = form.watch("document") ?? "";

  const documentValidation = {
    isValid:
      removeFormat(documentDigits).length === 11 && isValidCPF(documentDigits),
    hasMinLength: removeFormat(documentDigits).length === 11,
  };

  return (
    <div className="rounded-lg bg-white p-8 shadow-md">
      <div className="mb-6 flex items-center gap-3">
        <User className="h-6 w-6 text-amber-900" />
        <h2 className="text-2xl text-gray-900">Dados pessoais</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome completo</FormLabel>

              <FormControl>
                <Input placeholder="Seu nome" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>

              <FormControl>
                <Input placeholder="seu@email.com" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="document"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className={`${
                    documentDigits &&
                    documentValidation.hasMinLength &&
                    !documentValidation.isValid
                      ? "border-2 border-red-500 focus:border-red-500"
                      : ""
                  }`}
                  onChange={(e) => {
                    const digits = removeFormat(e.target.value).slice(0, 11);
                    field.onChange(digits);
                  }}
                  placeholder="000.000.000-00"
                  value={formatCPF(field.value ?? "")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cellphone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => {
                    const digits = removeFormat(e.target.value).slice(0, 11);
                    field.onChange(digits);
                  }}
                  placeholder="(00) 00000-0000"
                  value={formatWhatsApp(field.value ?? "")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <p className="mt-6 text-gray-400 text-xs">
        * Utilizamos o cadastro em nossa plataforma para agilizar o processo de
        checkout preenchendo automaticamente informações como nome e e-mail.
        <br />
        <br />* Caso alguma informação esteja incorreta, corrija nos campos do
        formulário acima antes de prosseguir.
      </p>

      <Button
        className="mt-8 w-full cursor-pointer bg-amber-900 py-5! font-semibold text-sm text-white uppercase hover:bg-amber-900/90 hover:text-white"
        onClick={onNext}
        type="button"
      >
        Continuar para entrega
      </Button>
    </div>
  );
}

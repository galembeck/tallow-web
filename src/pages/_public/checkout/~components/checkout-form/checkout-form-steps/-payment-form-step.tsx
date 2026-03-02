import { CreditCard } from "lucide-react";
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

interface PaymentStepProps {
  form: UseFormReturn<CheckoutFormData>;
  isClearingCart: boolean;
  onBack: () => void;
}

export function PaymentStep({
  form,
  isClearingCart,
  onBack,
}: PaymentStepProps) {
  return (
    <div className="rounded-lg bg-white p-8 shadow-md">
      <div className="mb-6 flex items-center gap-3">
        <CreditCard className="h-6 w-6 text-amber-900" />
        <h2 className="text-2xl text-gray-900">Dados de Pagamento</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="cardNumber"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Número do cartão</FormLabel>
              <FormControl>
                <Input placeholder="1234 5678 9012 3456" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cardHolderName"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Nome no cartão</FormLabel>
              <FormControl>
                <Input placeholder="Nome impresso" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cardExpirationDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Validade</FormLabel>
              <FormControl>
                <Input placeholder="MM/AA" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cardCvv"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CVV</FormLabel>
              <FormControl>
                <Input placeholder="123" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="mt-8 flex gap-4">
        <Button onClick={onBack} type="button" variant="outline">
          Voltar
        </Button>
        <Button disabled={isClearingCart} type="submit">
          Finalizar pedido
        </Button>
      </div>
    </div>
  );
}

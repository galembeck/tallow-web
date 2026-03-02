import { Truck } from "lucide-react";
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

interface ShippingFormStepProps {
  form: UseFormReturn<CheckoutFormData>;
  onNext: () => void;
}

export function ShippingFormStep({ form, onNext }: ShippingFormStepProps) {
  return (
    <div className="rounded-lg bg-white p-8 shadow-md">
      <div className="mb-6 flex items-center gap-3">
        <Truck className="h-6 w-6 text-amber-900" />
        <h2 className="text-2xl text-gray-900">Dados de Entrega</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
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
                <Input placeholder="voce@email.com" {...field} />
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
                <Input placeholder="(00) 00000-0000" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="zipcode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CEP</FormLabel>

              <FormControl>
                <Input placeholder="00000-000" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Endereço</FormLabel>

              <FormControl>
                <Input placeholder="Rua / Avenida" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número</FormLabel>

              <FormControl>
                <Input placeholder="123" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="complement"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Complemento</FormLabel>

              <FormControl>
                <Input placeholder="Opcional" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="neighborhood"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bairro</FormLabel>

              <FormControl>
                <Input placeholder="Seu bairro" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cidade</FormLabel>

              <FormControl>
                <Input placeholder="Sua cidade" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado</FormLabel>

              <FormControl>
                <Input placeholder="UF" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <Button className="mt-8 w-full" onClick={onNext} type="button">
        Continuar para pagamento
      </Button>
    </div>
  );
}

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import type { CalculateShippingData } from "@/types/services/shipping";
import { formatCEP, removeFormat } from "@/utils/format-masks";

export const shippingOptionsSchema = z.object({
  zipcode: z
    .string()
    .min(8, {
      message: "CEP deve ter 8 dígitos",
    })
    .refine(
      (value) => {
        const cleanCEP = removeFormat(value);
        return cleanCEP.length === 8;
      },
      {
        message: "CEP inválido",
      },
    ),
});

interface ShippingDetailsFormProps {
  isLoading: boolean;

  calculateShipping: (params: CalculateShippingData) => void;
  calculateCheapest: (params: CalculateShippingData) => void;

  productId: string;
  quantity: number;
}

export function ShippingDetailsForm({
  isLoading,
  calculateShipping,
  calculateCheapest,
  productId,
  quantity,
}: ShippingDetailsFormProps) {
  const form = useForm<z.infer<typeof shippingOptionsSchema>>({
    resolver: zodResolver(shippingOptionsSchema),
    mode: "onSubmit",
    defaultValues: {
      zipcode: "",
    },
  });

  async function onSubmit(values: z.infer<typeof shippingOptionsSchema>) {
    try {
      const cleanZipCode = removeFormat(values.zipcode);

      await calculateShipping({
        toZipCode: cleanZipCode,
        productId,
        quantity,
      });

      await calculateCheapest({
        toZipCode: cleanZipCode,
        productId,
        quantity,
      });

      // biome-ignore lint/suspicious/noExplicitAny: error handling...
    } catch (_error: any) {
      toast.error("Ocorreu um erro ao calcular as informações de envio.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Field orientation="horizontal">
          <FormField
            control={form.control}
            name="zipcode"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    className="py-5 placeholder:text-base focus:text-base"
                    {...field}
                    onChange={(e) => {
                      const formatted = formatCEP(e.target.value);
                      field.onChange(formatted);
                    }}
                    placeholder="Informe seu CEP"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            className={`${Object.keys(form.formState.errors).length > 0 && "mb-6.5"} cursor-pointer bg-amber-900 px-8 py-5 font-semibold text-base hover:bg-amber-900/90`}
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Spinner />
                <span>Calculando...</span>
              </div>
            ) : (
              "OK"
            )}
          </Button>
        </Field>
      </form>
    </Form>
  );
}

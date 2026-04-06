import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { useCoupon } from "@/hooks/services/use-coupon";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const createCouponSchema = z.object({
  code: z
    .string()
    .min(2, { message: "O código deve ter no mínimo 2 caracteres." })
    .max(50, { message: "O código deve ter no máximo 50 caracteres." })
    .nonempty({ message: "O código é obrigatório." }),
  discountPercentage: z
    .number({
      required_error: "A porcentagem de desconto é obrigatória.",
      invalid_type_error: "Digite um número válido.",
    })
    .min(1, { message: "O desconto mínimo é 1%." })
    .max(100, { message: "O desconto máximo é 100%." }),
});

type CreateCouponFormData = z.infer<typeof createCouponSchema>;

export function CreateCouponModal() {
  const { createCoupon, isCreating } = useCoupon();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<CreateCouponFormData>({
    resolver: zodResolver(createCouponSchema),
    mode: "onChange",
    defaultValues: {
      code: "",
      discountPercentage: undefined,
    },
  });

  const handleClose = () => {
    setIsOpen(false);
    form.reset();
  };

  const onSubmit = async (values: CreateCouponFormData) => {
    try {
      await createCoupon({
        code: values.code.toUpperCase().trim(),
        discountPercentage: values.discountPercentage,
      });

      toast.success("Cupom criado com sucesso!");
      handleClose();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao criar cupom.",
      );
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
        else setIsOpen(true);
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-amber-900 hover:bg-amber-900/90 text-white hover:text-white">
          <Plus />
          Criar cupom
        </Button>
      </DialogTrigger>

      <DialogContent aria-describedby="Create a new discount coupon">
        <DialogHeader>
          <DialogTitle className="text-amber-950 font-bold">
            Criar cupom de desconto
          </DialogTitle>
        </DialogHeader>

        <Separator />

        <Form {...form}>
          <form
            className="flex flex-col gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Código do cupom</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.value.toUpperCase())
                      }
                      placeholder="Ex: PROMO10"
                      className="font-mono"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discountPercentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">
                    Porcentagem de desconto (%)
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min={1}
                      max={100}
                      placeholder="Ex: 10"
                      onChange={(e) =>
                        field.onChange(Number(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <DialogFooter className="flex gap-4">
              <Button
                className="bg-inherit hover:bg-inherit text-amber-900 hover:text-amber-900/80 border border-amber-900"
                onClick={handleClose}
                type="reset"
                variant="outline"
              >
                Cancelar
              </Button>

              <Button
                className="bg-amber-900 hover:bg-amber-900/90 text-white hover:text-white"
                type="submit"
                disabled={isCreating}
              >
                {isCreating ? (
                  <p className="flex items-center gap-2">
                    <Spinner />
                    Criando...
                  </p>
                ) : (
                  <p className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Criar cupom
                  </p>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

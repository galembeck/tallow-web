/** biome-ignore-all lint/suspicious/noExplicitAny: required by webhook operations */
/** biome-ignore-all lint/correctness/noUnusedVariables: required by webhook operations */

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Info, Plus, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatCurrency } from "@/utils/format-currency";

const createFormSchema = z.object({
  id: z.string().nonempty({
    message: "O ID do produto é obrigatório",
  }),
  name: z.string().min(2).max(100).nonempty({
    message: "O nome do produto é obrigatório",
  }),
  description: z.string().min(2).max(1000).nonempty({
    message: "A descrição do produto deve ser válida",
  }),
  price: z.number().min(1, {
    message: "O preço do produto deve ser maior ou igual a R$ 1,00",
  }),
});

export function CreateProduct() {
  // const { createProduct } = useProduct();

  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof createFormSchema>>({
    resolver: zodResolver(createFormSchema),
    defaultValues: {
      id: "",
      name: "",
      description: "",
      price: 0.0,
    },
  });

  // async function onSubmit(values: z.infer<typeof createFormSchema>) {
  //   try {
  //     await createProduct({
  //       data: {
  //         id: values.id,
  //         name: values.name,
  //         description: values.description,
  //         price: values.price,
  //       },
  //     });

  //     toast.success("Produto criado com sucesso!");
  //     setOpen(false);
  //     form.reset();
  //   } catch (error: any) {
  //     toast.error("Erro ao criar produto", {
  //       description: "Tente novamente mais tarde...",
  //     });
  //   }
  // }

  return (
    <Dialog
      onOpenChange={(isOpen) => {
        setOpen(isOpen);

        if (isOpen) {
          form.setValue("id", crypto.randomUUID());
        }
      }}
      open={open}
    >
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          <Plus />
          Criar produto
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby="Create product">
        <DialogHeader>
          <DialogTitle>Criar produto</DialogTitle>
        </DialogHeader>

        <Separator orientation="horizontal" />

        <Form {...form}>
          <form
            className="space-y-6"
            // onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    ID do Produto
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4" stroke="blue" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          O ID do produto é utilizado para identificar o produto
                          na sua plataforma
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="border-none dark:bg-input-gray"
                      disabled
                      placeholder="ID do produto..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do produto</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="border-none dark:bg-input-gray"
                      placeholder="Nome do produto..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="border-none dark:bg-input-gray"
                      placeholder="Descrição do produto..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço/valor</FormLabel>
                  <FormControl>
                    <Input
                      className="border-none dark:bg-input-gray"
                      onChange={(e) => {
                        const digits = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 12);
                        const cents =
                          digits === "" ? 0 : Number.parseInt(digits, 10);

                        const numberValue = cents / 100;

                        field.onChange(numberValue);
                      }}
                      placeholder="R$ 0,00"
                      type="text"
                      value={formatCurrency(field.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-4 flex gap-4">
              <Button
                onClick={() => setOpen(false)}
                type="reset"
                variant="outline"
              >
                <div className="flex gap-4">
                  <p>Voltar</p>
                  <X className="h-4 w-4" />
                </div>
              </Button>
              <Button type="submit">
                <div className="flex gap-4">
                  <p>Salvar</p>
                  <Check className="h-4 w-4" />
                </div>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

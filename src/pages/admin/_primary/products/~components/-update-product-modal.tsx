/** biome-ignore-all lint/suspicious/noExplicitAny: required by webhook operations */
/** biome-ignore-all lint/correctness/noUnusedVariables: required by webhook operations */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useProduct } from "@/hooks/services/use-product";
import {
  ProductCategory,
  ProductCategoryLabel,
} from "@/types/enums/product-category";
import type { Product } from "@/types/services/product";
import { formatCurrency } from "@/utils/format-currency";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { Check, ImagePlus, Plus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const updateFormSchema = z.object({
  name: z.string().min(2).max(100).nonempty({
    message: "O nome do produto é obrigatório.",
  }),
  description: z.string().min(2).max(1000).nonempty({
    message: "A descrição do produto deve ser válida.",
  }),
  category: z.nativeEnum(ProductCategory, {
    error: () => ({ message: "A categoria do produto é obrigatória." }),
  }),
  price: z.number().min(1, {
    message: "O preço do produto deve ser maior ou igual a R$ 1,00.",
  }),
  ingredients: z.array(z.string()).min(1, {
    message: "Adicione pelo menos um ingrediente ao produto.",
  }),
  stockAmount: z.number().min(0, {
    message:
      "A quantidade em estoque do produto deve ser igual ou maior que 0.",
  }),
  weight: z.number().min(0.1, {
    message: "O peso do produto deve ser igual ou maior que 0.1 kg.",
  }),
  height: z.number().min(0.1, {
    message: "A altura do produto deve ser igual ou maior que 0.1 m.",
  }),
  width: z.number().min(0.1, {
    message: "A largura do produto deve ser igual ou maior que 0.1 m.",
  }),
  length: z.number().min(0.1, {
    message: "O comprimento do produto deve ser igual ou maior que 0.1 m.",
  }),
  image: z.file().optional(),
});

type UpdateFormValues = z.infer<typeof updateFormSchema>;

interface UpdateProductModalProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpdateProductModal({
  product,
  open,
  onOpenChange,
}: UpdateProductModalProps) {
  const { updateProduct, isUpdatingProduct } = useProduct();

  const [ingredientInput, setIngredientInput] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(
    product.imageUrl ?? null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<UpdateFormValues>({
    resolver: zodResolver(updateFormSchema),
    defaultValues: {
      name: product.name,
      description: product.description,
      category: product.category,
      ingredients: product.ingredients,
      stockAmount: product.stockAmount,
      price: product.price,
      weight: product.weight,
      height: product.height,
      width: product.width,
      length: product.length,
      image: undefined,
    },
  });

  useEffect(() => {
    form.reset({
      name: product.name,
      description: product.description,
      category: product.category,
      ingredients: product.ingredients,
      stockAmount: product.stockAmount,
      price: product.price,
      weight: product.weight,
      height: product.height,
      width: product.width,
      length: product.length,
      image: undefined,
    });
    setImagePreview(product.imageUrl ?? null);
    setIngredientInput("");
  }, [product, form]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const ingredients = form.watch("ingredients");

  const addIngredient = () => {
    const trimmed = ingredientInput.trim();
    if (!trimmed) return;
    form.setValue(
      "ingredients",
      [...(form.getValues("ingredients") ?? []), trimmed],
      { shouldValidate: true },
    );
    setIngredientInput("");
  };

  const removeIngredient = (index: number) => {
    form.setValue(
      "ingredients",
      (form.getValues("ingredients") ?? []).filter((_, i) => i !== index),
      { shouldValidate: true },
    );
  };

  const handleClose = () => {
    onOpenChange(false);
    form.reset();
    setIngredientInput("");
    setImagePreview(product.imageUrl ?? null);
  };

  async function onSubmit(values: UpdateFormValues) {
    try {
      await updateProduct({
        id: product.id,
        name: values.name,
        description: values.description,
        category: values.category,
        price: values.price,
        ingredients: values.ingredients,
        stockAmount: values.stockAmount,
        weight: values.weight,
        height: values.height,
        width: values.width,
        length: values.length,
        image: values.image,
      });

      toast.success("Produto atualizado com sucesso!");
      handleClose();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      toast.error("Erro ao atualizar produto", {
        description:
          "Tente atualizar novamente as informações do produto mais tarde...",
      });
    }
  }

  return (
    <Dialog
      onOpenChange={(isOpen) => {
        if (!isOpen) handleClose();
        else onOpenChange(true);
      }}
      open={open}
    >
      <DialogContent aria-describedby="Update product" className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar produto</DialogTitle>
        </DialogHeader>

        <Separator orientation="horizontal" />

        <Form {...form}>
          <form
            className="flex flex-col gap-0"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <ScrollArea className="max-h-[65vh] pr-4">
              <div className="space-y-6 pb-2">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Imagem do produto</FormLabel>
                      <FormControl>
                        <div
                          className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-200 p-6 transition-colors hover:border-gray-300 hover:bg-gray-50"
                          onClick={() => fileInputRef.current?.click()}
                          onKeyDown={(e) =>
                            e.key === "Enter" && fileInputRef.current?.click()
                          }
                        >
                          {imagePreview ? (
                            <div className="relative">
                              <img
                                alt="Preview"
                                className="max-h-40 rounded-md object-contain"
                                src={imagePreview}
                              />
                              <button
                                className="absolute -right-2 -top-2 rounded-full bg-white p-0.5 shadow"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  field.onChange(undefined);
                                  setImagePreview(null);
                                  if (fileInputRef.current)
                                    fileInputRef.current.value = "";
                                }}
                                type="button"
                              >
                                <X className="size-3.5 text-gray-500" />
                              </button>
                            </div>
                          ) : (
                            <>
                              <ImagePlus className="size-8 text-gray-400" />
                              <p className="text-center text-gray-500 text-sm">
                                Clique para selecionar uma nova imagem
                              </p>
                            </>
                          )}
                          <input
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              field.onChange(file);
                              setImagePreview(URL.createObjectURL(file));
                            }}
                            ref={fileInputRef}
                            type="file"
                          />
                        </div>
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
                        <Input {...field} placeholder="Ex: Manteiga Corporal" />
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
                          placeholder="Descrição do produto..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(v) => field.onChange(Number(v))}
                          value={field.value != null ? String(field.value) : ""}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione..." />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(ProductCategoryLabel).map(
                              ([key, label]) => (
                                <SelectItem key={key} value={key}>
                                  {label}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preço</FormLabel>
                        <FormControl>
                          <Input
                            onChange={(e) => {
                              const digits = e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 12);
                              const cents =
                                digits === "" ? 0 : Number.parseInt(digits, 10);
                              field.onChange(cents / 100);
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

                  <FormField
                    control={form.control}
                    name="stockAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estoque (un.)</FormLabel>
                        <FormControl>
                          <Input
                            min={0}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === ""
                                  ? 0
                                  : Number.parseInt(e.target.value, 10),
                              )
                            }
                            placeholder="0"
                            type="number"
                            value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="ingredients"
                  render={() => (
                    <FormItem>
                      <FormLabel>Ingredientes</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addIngredient();
                              }
                            }}
                            onChange={(e) => setIngredientInput(e.target.value)}
                            placeholder="Ex: Manteiga de karité"
                            value={ingredientInput}
                          />
                          <Button
                            className="shrink-0 cursor-pointer"
                            onClick={addIngredient}
                            size="sm"
                            type="button"
                            variant="outline"
                          >
                            <Plus className="size-4" />
                            Adicionar
                          </Button>
                        </div>
                      </FormControl>
                      {ingredients.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {ingredients.map((ingredient, index) => (
                            <Badge
                              className="gap-1 pr-1"
                              key={`${ingredient}-${index}`}
                              variant="secondary"
                            >
                              {ingredient}
                              <button
                                className="cursor-pointer rounded-full opacity-60 hover:opacity-100"
                                onClick={() => removeIngredient(index)}
                                type="button"
                              >
                                <X className="size-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-3">
                  <p className="font-medium text-sm">Dimensões para envio</p>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Peso (kg)</FormLabel>
                          <FormControl>
                            <Input
                              min={0.1}
                              onChange={(e) =>
                                field.onChange(
                                  Number.parseFloat(e.target.value) || 0.1,
                                )
                              }
                              step={0.1}
                              type="number"
                              value={field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="height"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Altura (m)</FormLabel>
                          <FormControl>
                            <Input
                              min={0.1}
                              onChange={(e) =>
                                field.onChange(
                                  Number.parseFloat(e.target.value) || 0.1,
                                )
                              }
                              step={0.1}
                              type="number"
                              value={field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="width"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Largura (m)</FormLabel>
                          <FormControl>
                            <Input
                              min={0.1}
                              onChange={(e) =>
                                field.onChange(
                                  Number.parseFloat(e.target.value) || 0.1,
                                )
                              }
                              step={0.1}
                              type="number"
                              value={field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="length"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Comprimento (m)</FormLabel>
                          <FormControl>
                            <Input
                              min={0.1}
                              onChange={(e) =>
                                field.onChange(
                                  Number.parseFloat(e.target.value) || 0.1,
                                )
                              }
                              step={0.1}
                              type="number"
                              value={field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </ScrollArea>

            <Separator className="my-4" />

            <DialogFooter className="flex gap-4">
              <Button
                className="flex cursor-pointer items-center gap-2"
                onClick={handleClose}
                type="reset"
                variant="outline"
              >
                Cancelar
                <X className="h-4 w-4" />
              </Button>

              <Button
                className="flex cursor-pointer items-center gap-2"
                disabled={isUpdatingProduct}
                type="submit"
              >
                {isUpdatingProduct ? "Salvando..." : "Salvar alterações"}
                <Check className="h-4 w-4" />
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

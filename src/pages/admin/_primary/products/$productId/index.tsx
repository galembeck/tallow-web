import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useProduct } from "@/hooks/services/use-product";
import {
  ProductCategoryLabel,
  type ProductCategory,
} from "@/types/enums/product-category";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Box, Ruler, Scale } from "lucide-react";
import { useState } from "react";
import { UpdateProductModal } from "../~components/-update-product-modal";
import { ProductLoading } from "./~components/-product-loading";
import { ProductNotFound } from "./~components/-product-not-found";

export const Route = createFileRoute("/admin/_primary/products/$productId/")({
  component: ProductDetailsPage,
  head: () => ({
    meta: [{ title: "Detalhes do produto | Terra & Tallow" }],
  }),
});

function ProductDetailsPage() {
  const navigate = useNavigate();

  const { productId } = Route.useParams();
  const { product, isProductLoading } = useProduct(productId);

  const [openEdition, setOpenEdition] = useState(false);

  if (isProductLoading) {
    return <ProductLoading />;
  }

  if (!product) {
    return <ProductNotFound />;
  }

  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex gap-4">
          <Button
            variant="secondary"
            className="mt-1"
            onClick={() => navigate({ to: "/admin/products" })}
          >
            <ArrowLeft />
          </Button>

          <article>
            <h1 className="font-semibold text-2xl tracking-tight">
              Detalhes do produto
            </h1>
            <p className="text-muted-foreground text-sm">
              Veja os detalhes do seu produto cadastrado em nossa plataforma
            </p>

            <Badge variant="secondary" className="mt-4">
              ID: {product?.id}
            </Badge>
          </article>
        </div>

        <Button
          className="w-full md:w-fit"
          onClick={() => setOpenEdition(true)}
        >
          Editar
        </Button>
      </div>

      <Card className="w-full">
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex flex-col gap-y-4 lg:pr-4 pr-0">
              <h3 className="font-semibold text-lg">Informações do produto</h3>

              <p className="text-sm text-muted-foreground">
                Consulte e atualize as informações do produto. Para editar
                alguma informação, clique no botão "editar" ao lado.
              </p>

              <Separator />

              <article>
                <Label
                  className="mb-2 block font-medium text-sm"
                  htmlFor="name"
                >
                  Nome
                </Label>

                <Input
                  disabled
                  id="name"
                  value={product.name}
                  className="disabled:opacity-80"
                />
              </article>

              <article>
                <Label
                  className="mb-2 block font-medium text-sm"
                  htmlFor="description"
                >
                  Descrição
                </Label>

                <Textarea
                  disabled
                  id="description"
                  value={product.description}
                  className="h-20 disabled:opacity-80"
                />
              </article>

              <article>
                <Label
                  className="mb-2 block font-medium text-sm"
                  htmlFor="category"
                >
                  Categoria
                </Label>

                <Select>
                  <SelectTrigger
                    className="w-full disabled:opacity-100"
                    disabled
                  >
                    <SelectValue
                      placeholder={
                        ProductCategoryLabel[
                          product.category as ProductCategory
                        ]
                      }
                    />
                  </SelectTrigger>
                </Select>
              </article>

              <div className="grid grid-cols-2 gap-x-4">
                <article>
                  <Label
                    className="mb-2 block font-medium text-sm"
                    htmlFor="price"
                  >
                    Preço
                  </Label>
                  <Input
                    disabled
                    id="price"
                    value={product.price.toFixed(2)}
                    className="disabled:opacity-80"
                  />
                </article>

                <article>
                  <Label
                    className="mb-2 block font-medium text-sm"
                    htmlFor="stockAmount"
                  >
                    Estoque (un.)
                  </Label>

                  <Input
                    disabled
                    id="stockAmount"
                    value={product?.stockAmount}
                    className="disabled:opacity-80"
                  />
                </article>
              </div>

              <div className="border p-4 mt-4 rounded-lg col-span-2 w-full">
                <Label className="mb-4 font-semibold flex items-center gap-2">
                  <Box className="size-4 text-amber-900" />
                  Dimensões para envio
                </Label>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="flex items-center gap-1 text-muted-foreground text-xs">
                      <Scale className="size-3" />
                      Peso
                    </p>

                    <p className="mt-1 font-semibold text-sm">
                      {product.weight} kg
                    </p>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="flex items-center gap-1 text-muted-foreground text-xs">
                      <Ruler className="size-3" />
                      Altura
                    </p>

                    <p className="mt-1 font-semibold text-sm">
                      {product.height} m
                    </p>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="flex items-center gap-1 text-muted-foreground text-xs">
                      <Ruler className="size-3" />
                      Largura
                    </p>

                    <p className="mt-1 font-semibold text-sm">
                      {product.width} m
                    </p>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="flex items-center gap-1 text-muted-foreground text-xs">
                      <Ruler className="size-3" />
                      Comprimento
                    </p>

                    <p className="mt-1 font-semibold text-sm">
                      {product.length} m
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-y-4 lg:pl-4 pl-0">
              <img
                src={product.imageUrl}
                loading="lazy"
                alt={product.name}
                className="rounded-lg mt-4 order-2 lg:order-1"
              />

              <article className="order-1 lg:order-2">
                <Label
                  className="mb-2 block font-medium text-sm"
                  htmlFor="ingredients"
                >
                  Ingredientes
                </Label>

                <ScrollArea className="w-full rounded-lg border whitespace-nowrap">
                  <div className="flex w-max space-x-1 p-4">
                    {product.ingredients.map((ingredient, index) => (
                      <Badge className="bg-zinc-600 text-sm" key={index}>
                        {ingredient}
                      </Badge>
                    ))}
                  </div>

                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </article>
            </div>
          </div>
        </CardContent>
      </Card>

      <UpdateProductModal
        onOpenChange={setOpenEdition}
        open={openEdition}
        product={product}
      />
    </main>
  );
}

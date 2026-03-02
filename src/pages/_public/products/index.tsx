/** biome-ignore-all lint/suspicious/noExplicitAny: required for filtering... */
import { createFileRoute, useSearch } from "@tanstack/react-router";
import z from "zod";
import { useProduct } from "@/hooks/services/use-product";
import type { ProductCategory } from "@/types/enums/product-category";
import { ProductCard } from "./~components/-product-card";
import { ProductsFilters } from "./~components/-products-filters";
import { ProductsSkeleton } from "./~components/-products-skeleton";

export const Route = createFileRoute("/_public/products/")({
  component: ProductsPage,
  head: () => ({
    meta: [{ title: "Produtos | Terra & Tallow" }],
  }),
  validateSearch: z.object({
    category: z.coerce.number().optional(),
    search: z.string().optional(),
  }),
});

function ProductsPage() {
  const search = useSearch({ from: Route.id });

  const selectedCategory = search.category as ProductCategory | undefined;
  const searchTerm = search.search ?? "";

  const { products, productsByFilter, isLoading, isLoadingByFilter } =
    useProduct(undefined, {
      category: selectedCategory,
      searchTerm: searchTerm.trim() || undefined,
      inStock: true,
    });

  const displayProducts =
    selectedCategory !== undefined || searchTerm.trim()
      ? productsByFilter
      : products;

  const isLoadingProducts = isLoading || isLoadingByFilter;

  if (isLoadingProducts) {
    return <ProductsSkeleton />;
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 text-center">
          <h1 className="mb-4 font-semibold text-5xl text-amber-900 uppercase">
            Produtos
          </h1>

          <p className="text-gray-600 text-lg">
            Descubra nossa linha completa de produtos e cuidados naturais para
            sua pele
          </p>
        </div>

        <ProductsFilters
          products={products ?? []}
          search={{
            category: search.category,
            search: search.search,
          }}
        />

        {displayProducts && displayProducts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {displayProducts.map((product) => (
              <ProductCard
                description={product.description}
                imageUrl={product.imageUrl}
                key={product.id}
                name={product.name}
                price={product.price}
                productId={product.id}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-gray-500 text-xl">
              Não há produtos disponíveis no momento.
              <br />
              <br />
              Por favor, volte mais tarde ou explore outras categorias.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

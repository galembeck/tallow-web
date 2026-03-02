/** biome-ignore-all lint/suspicious/noExplicitAny: required for filtering... */

import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { Frown } from "lucide-react";
import { useState } from "react";
import z from "zod";
import { useProduct } from "@/hooks/services/use-product";
import type { ProductCategory } from "@/types/enums/product-category";
import { ProductCard } from "./~components/-product-card";
import { ProductsSkeleton } from "./~components/-products-skeleton";
import { ProductsFilters } from "./~components/products-filters/-products-filters";
import { ProductSearchInput } from "./~components/products-filters/~components/-product-search-input";

const productsFiltersSchema = z.object({
  search: z.string().optional(),
  category: z.coerce.number().optional(),
});

export const Route = createFileRoute("/_public/products/")({
  component: ProductsPage,
  head: () => ({
    meta: [{ title: "Produtos | Terra & Tallow" }],
  }),
  validateSearch: productsFiltersSchema,
});

function ProductsPage() {
  const navigate = useNavigate({ from: Route.fullPath });
  const search = useSearch({ from: Route.id });

  const selectedCategory = search.category as ProductCategory | undefined;
  const searchTerm = search.search ?? "";

  const [inputValue, setInputValue] = useState(searchTerm);

  const { products, productsByFilter, isLoading, isLoadingByFilter, error } =
    useProduct(undefined, {
      category: selectedCategory,
      searchTerm: searchTerm.trim() || undefined,
      inStock: true,
    });

  const displayProducts =
    selectedCategory !== undefined || searchTerm.trim()
      ? productsByFilter
      : products;

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const toggleFilters = () => {
    setIsFiltersOpen(!isFiltersOpen);
  };

  const handleSearch = () => {
    navigate({
      search: (prev) => ({
        ...prev,
        search: inputValue.trim() || undefined,
      }),
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleCategoryChange = (category: ProductCategory | null) => {
    navigate({
      search: (prev) => ({
        ...prev,
        category:
          category === null || prev.category === category
            ? undefined
            : Number(category),
      }),
    });
  };

  const clearAllFilters = () => {
    setInputValue("");
    navigate({
      search: (prev) => ({
        ...prev,
        search: undefined,
        category: undefined,
      }),
    });
  };

  const clearSearch = () => {
    setInputValue("");
    navigate({
      search: (prev) => ({
        ...prev,
        search: undefined,
      }),
    });
  };

  const clearCategory = () => {
    navigate({
      search: (prev) => ({
        ...prev,
        category: undefined,
      }),
    });
  };

  if (isLoading) {
    return <ProductsSkeleton />;
  }

  if (isLoadingByFilter) {
    return (
      <div className="flex h-80 cursor-pointer flex-col items-center justify-center gap-4 p-6">
        <div className="h-12 w-12 animate-spin rounded-full border-amber-900 border-b-2" />
        <p className="text-gray-500">Carregando artigos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-secondary-green-dark text-white">
        <div className="flex max-w-4xl flex-col items-center justify-center gap-10 text-center">
          <Frown className="size-40 text-amber-900" />

          <article className="flex flex-col gap-4">
            <h1 className="font-bold text-6xl text-black md:text-8xl">Ops!</h1>
            <p className="text-gray-300 text-lg md:text-xl">
              Produtos não encontrados :/
            </p>
            <p className="text-gray-400 text-sm">
              Parece que não foi possível carregar os produtos no momento.
            </p>
          </article>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <article className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="flex flex-col gap-3">
            <h1 className="font-semibold text-4xl text-amber-900 lg:text-5xl">
              Produtos
            </h1>

            <p className="text-base text-gray-600">
              Descubra nossa linha completa de produtos e cuidados naturais para
              sua pele.
            </p>
          </div>

          <div className="flex w-full flex-col gap-4 md:w-auto">
            <ProductSearchInput
              handleKeyDown={handleKeyDown}
              handleSearch={handleSearch}
              inputValue={inputValue}
              setInputValue={setInputValue}
              toggleFilters={toggleFilters}
            />
          </div>
        </article>

        <ProductsFilters
          clearAllFilters={clearAllFilters}
          clearCategory={clearCategory}
          clearSearch={clearSearch}
          handleCategoryChange={handleCategoryChange}
          isFiltersOpen={isFiltersOpen}
          products={products ?? []}
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
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

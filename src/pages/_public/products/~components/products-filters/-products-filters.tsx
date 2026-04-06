import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  type ProductCategory,
  ProductCategoryLabel,
} from "@/types/enums/product-category";
import type { Product } from "@/types/services/product";
import { ProductsCategoriesFilter } from "./~components/-products-categories-filter";

interface ProductsFilterProps {
  products: Product[];

  selectedCategory?: ProductCategory;
  searchTerm?: string;

  isFiltersOpen?: boolean;

  handleCategoryChange: (category: ProductCategory | null) => void;

  clearSearch: () => void;
  clearCategory: () => void;
  clearAllFilters: () => void;
}

export function ProductsFilters({
  products,
  selectedCategory,
  searchTerm,
  isFiltersOpen = false,
  handleCategoryChange,
  clearSearch,
  clearCategory,
  clearAllFilters,
}: ProductsFilterProps) {
  const hasSearch = Boolean(searchTerm?.trim());
  const hasCategory = selectedCategory !== undefined;
  const hasActiveFilters = hasSearch || hasCategory;

  const selectedCategoryLabel = hasCategory
    ? ProductCategoryLabel[selectedCategory]
    : undefined;

  return (
    <>
      <div
        className={`mb-8 overflow-hidden transition-all duration-300 ease-in-out ${
          isFiltersOpen
            ? "mt-5 max-h-150 opacity-100"
            : "mt-0 max-h-0 opacity-0"
        }`}
      >
        <div className="rounded-md border border-input bg-secondary-white dark:bg-primary-dark">
          <ProductsCategoriesFilter
            onCategoryChange={handleCategoryChange}
            products={products ?? []}
            selectedCategory={selectedCategory}
          />
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-gray-600 text-sm dark:text-gray-400">
              Filtros ativos:
            </span>

            {hasSearch && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-blue-800 text-sm">
                Pesquisa: "{searchTerm}"
                <Button
                  className="h-4 w-4 cursor-pointer p-0 hover:bg-blue-200"
                  onClick={clearSearch}
                  size="sm"
                  variant="ghost"
                >
                  <X className="h-3 w-3" />
                </Button>
              </span>
            )}

            {hasCategory && (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-green-800 text-sm">
                Categoria: {selectedCategoryLabel}
                <Button
                  className="h-4 w-4 cursor-pointer p-0 hover:bg-green-200"
                  onClick={clearCategory}
                  size="sm"
                  variant="ghost"
                >
                  <X className="h-3 w-3" />
                </Button>
              </span>
            )}
          </div>

          <Button
            className="w-full cursor-pointer self-start text-xs md:w-fit md:self-auto"
            onClick={clearAllFilters}
            size="sm"
            variant="outline"
          >
            Limpar tudo
          </Button>
        </div>
      )}
    </>
  );
}

/** biome-ignore-all lint/suspicious/noExplicitAny: required for filtering... */

import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  type ProductCategory,
  ProductCategoryLabel,
} from "@/types/enums/product-category";
import type { Product } from "@/types/services/product";

interface ProductsFiltersProps {
  search: {
    category?: number;
    search?: string;
  };
  products: Product[];
}

export function ProductsFilters({ search, products }: ProductsFiltersProps) {
  const navigate = useNavigate();

  const selectedCategory = search.category as ProductCategory | undefined;
  const searchTerm = search.search ?? "";

  const [inputValue, setInputValue] = useState(searchTerm);

  const uniqueCategories = Array.from(
    new Set((products ?? []).map((p) => p.category)),
  );

  const handleCategoryClick = (category: ProductCategory) => {
    navigate({
      search: (prev: { category?: number }) => ({
        ...prev,
        category: prev.category === category ? undefined : (category as number),
      }),
    } as any);
  };

  const handleSearch = () => {
    navigate({
      search: (prev: { category?: number; search?: string }) => ({
        ...prev,
        search: inputValue.trim() || undefined,
      }),
    } as any);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClearFilters = () => {
    setInputValue("");
    navigate({
      search: (prev: { category?: number; search?: string }) => ({
        ...prev,
        category: undefined,
        search: undefined,
      }),
    } as any);
  };

  return (
    <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap justify-center gap-4 lg:justify-start">
        {uniqueCategories.map((category) => (
          <Button
            className={`cursor-pointer rounded-xl border-2 border-amber-900 px-5! py-5! font-semibold text-base uppercase transition-colors duration-100 ${
              selectedCategory === category
                ? "bg-amber-900 text-white hover:bg-amber-900/90"
                : "bg-inherit text-amber-900 hover:bg-amber-900 hover:text-white"
            }`}
            key={category}
            onClick={() => handleCategoryClick(category)}
          >
            {
              Object.entries(ProductCategoryLabel).find(
                ([k]) => Number(k) === category,
              )?.[1]
            }
          </Button>
        ))}

        {(selectedCategory !== undefined || searchTerm.trim()) && (
          <Button
            className="cursor-pointer rounded-xl border-2 border-red-600 bg-inherit px-5! py-5! font-semibold text-base text-red-600 uppercase transition-colors duration-100 hover:bg-red-600 hover:text-white"
            onClick={handleClearFilters}
          >
            Limpar Filtros
          </Button>
        )}
      </div>

      <div className="w-full lg:w-auto">
        <Field orientation="horizontal">
          <Input
            className="h-12 min-w-60 rounded-lg border-2 border-gray-300 px-4 text-base focus:border-amber-900"
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Buscar produtos..."
            type="search"
            value={inputValue}
          />

          <Button
            className="h-12 cursor-pointer bg-amber-900 px-4! hover:bg-amber-900/90"
            onClick={handleSearch}
          >
            <Search />
          </Button>
        </Field>
      </div>
    </div>
  );
}

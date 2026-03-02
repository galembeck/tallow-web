import { Button } from "@/components/ui/button";
import {
  type ProductCategory,
  ProductCategoryLabel,
} from "@/types/enums/product-category";
import type { Product } from "@/types/services/product";

interface ProductsCategoriesFilterProps {
  products: Product[];

  selectedCategory?: ProductCategory | null;
  onCategoryChange?: (category: ProductCategory | null) => void;
}

export function ProductsCategoriesFilter({
  products,
  selectedCategory,
  onCategoryChange,
}: ProductsCategoriesFilterProps) {
  const uniqueCategories = Array.from(
    new Set((products ?? []).map((p) => p.category)),
  );

  const handleCategoryClick = (category: ProductCategory) => {
    if (Number(selectedCategory) === category) {
      onCategoryChange?.(null);
    } else {
      onCategoryChange?.(category);
    }
  };

  return (
    <div className="w-full shrink-0 rounded-lg bg-white p-5 shadow-lg">
      <div>
        <h3 className="mb-4 font-medium text-amber-900 text-sm">Categorias</h3>

        <div className="grid grid-cols-3 gap-2 space-y-2 xl:grid-cols-4">
          <Button
            className={`w-full cursor-pointer justify-start px-3 font-normal text-sm ${
              selectedCategory
                ? "text-gray-500 hover:text-gray-900"
                : "bg-amber-900 text-white hover:bg-amber-900/90 hover:text-white"
            }`}
            onClick={() => onCategoryChange?.(null)}
            variant="ghost"
          >
            Todas as categorias
          </Button>

          {uniqueCategories.map((category) => (
            <Button
              className={`w-full cursor-pointer justify-start px-3 font-normal text-sm ${
                selectedCategory === category
                  ? "bg-amber-900 text-white hover:bg-amber-900/90 hover:text-white"
                  : "text-gray-500 hover:text-gray-900"
              }`}
              key={category}
              onClick={() => handleCategoryClick(category)}
              variant="ghost"
            >
              {
                Object.entries(ProductCategoryLabel).find(
                  ([k]) => Number(k) === category,
                )?.[1]
              }
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProductCategoryLabel } from "@/types/enums/product-category";

interface ProductDetailsProps {
  id: string;
  name: string;
  category: number;
  stockAmount: number;
}

export function ProductDetails({
  id,
  name,
  category,
  stockAmount,
}: ProductDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Badge className="inline-block rounded-full bg-amber-100 px-3 py-1 font-bold text-amber-900 text-sm uppercase">
          {
            Object.entries(ProductCategoryLabel).find(
              ([k]) => Number(k) === category,
            )?.[1]
          }
        </Badge>

        {stockAmount != null && stockAmount >= 1 ? (
          <Badge className="bg-lime-100 text-green-500 text-sm">
            <article className="flex items-center gap-1">
              <Check className="size-4" />
              <span>Em estoque</span>
            </article>
          </Badge>
        ) : (
          <Badge className="bg-red-100 text-red-500 text-sm">
            <article className="flex items-center gap-1">
              <X className="size-4" />
              <span>Indisponível</span>
            </article>
          </Badge>
        )}
      </div>

      <article className="flex flex-col gap-2">
        <h1 className="font-semibold text-4xl text-gray-900">{name}</h1>

        <p className="text-muted-foreground opacity-80">ID: {id}</p>
      </article>

      {/* <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < Math.floor(product.averageRating)
                  ? 'fill-amber-500 text-amber-500'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="text-gray-600">
          {product.averageRating} ({product.reviewCount} avaliações)
        </span>
      </div> */}
    </div>
  );
}

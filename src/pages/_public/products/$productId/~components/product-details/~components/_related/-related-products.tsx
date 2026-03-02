import type { Product } from "@/types/services/product";
import { RelatedProductCard } from "./-related-product-card";

interface RelatedProductsProps {
  products: Product[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  return (
    <div className="mt-12 flex flex-col gap-8 rounded-lg bg-white p-8 shadow-lg">
      <h1 className="font-medium text-3xl text-amber-900">
        Você tambem pode gostar
      </h1>

      <article className="flex flex-col gap-4 lg:grid lg:grid-cols-3">
        {products.slice(0, 3).map((product) => (
          <RelatedProductCard
            description={product.description}
            imageUrl={product.imageUrl}
            key={product.id}
            name={product.name}
            price={product.price}
            productId={product.id}
          />
        ))}
      </article>
    </div>
  );
}

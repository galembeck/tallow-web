import { createFileRoute } from "@tanstack/react-router";

import { useProduct } from "@/hooks/services/use-product";
import { ProductCard } from "./~components/-product-card";

export const Route = createFileRoute("/_public/products/")({
  component: ProductsPage,
});

function ProductsPage() {
  const { products } = useProduct();

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h1 className="mb-4 font-semibold text-5xl text-amber-900 uppercase">
            Produtos
          </h1>

          <p className="text-gray-600 text-lg">
            Descubra nossa linha completa de produtos e cuidados naturais para
            sua pele
          </p>
        </div>

        {/* <div className="flex flex-wrap gap-4 justify-center mb-12"></div> */}

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {products?.map((product) => (
            <ProductCard
              description={product.description}
              key={product.id}
              name={product.name}
              price={product.price}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

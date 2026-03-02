import { ProductCardSkeleton } from "./-product-card-skeleton";

export function ProductsSkeleton() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="mb-4 font-semibold text-5xl text-amber-900 uppercase">
            Produtos
          </h1>

          <p className="text-gray-600 text-lg">
            Descubra nossa linha completa de produtos e cuidados naturais para
            sua pele
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: no mapping index provided...
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </main>
  );
}

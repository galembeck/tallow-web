import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { QuestionsAccordion } from "@/components/questions-accordion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useProduct } from "@/hooks/services/use-product";
import { AboutCompany } from "./~components/-about-company";
import { ProductDetails } from "./~components/product-details/-product-details";
import { ProductDetailsSkeleton } from "./~components/product-details/-product-details-skeleton";
import { ProductDetailsBreadcrumb } from "./~components/product-details/~components/_related/-product-details-breadcrumb";
import { ProductSpeciality } from "./~components/product-details/~components/_related/-product-speciality";
import { RelatedProducts } from "./~components/product-details/~components/_related/-related-products";
import { ProductActions } from "./~components/product-details/~components/-product-actions";
import { ProductCarousel } from "./~components/product-details/~components/-product-carousel";
import { ProductIngredientsCard } from "./~components/product-details/~components/-product-ingredients-card";
import { ProductPriceCard } from "./~components/product-details/~components/-product-price-card";
import { ShippingDetails } from "./~components/product-details/shipping-details/-shipping-details";

export const Route = createFileRoute("/_public/products/$productId/")({
  component: ProductDetailsPage,
  head: () => ({
    meta: [{ title: "Detalhes do produto | Terra & Tallow" }],
  }),
});

function ProductDetailsPage() {
  const navigate = useNavigate();

  const { productId } = Route.useParams();
  const { products, product, isLoading, error } = useProduct(productId);

  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (error || !(isLoading || product)) {
      navigate({
        to: "/products",
        replace: true,
      });
    }
  }, [error, isLoading, product, navigate]);

  if (isLoading) {
    return <ProductDetailsSkeleton />;
  }

  if (!product) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Button
            className="cursor-pointer bg-amber-900 hover:bg-amber-900/90"
            onClick={() => navigate({ to: "/products" })}
          >
            <ArrowLeft />
          </Button>

          <ProductDetailsBreadcrumb productName={product.name} />
        </div>

        <div className="mt-6 mb-12 space-y-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <ProductCarousel isLoading={isLoading} product={product} />

            <div className="space-y-6">
              <ProductDetails
                category={product.category}
                id={product.id}
                name={product.name}
                stockAmount={product.stockAmount}
              />

              <ProductPriceCard
                price={product.price}
                quantity={quantity}
                setQuantity={setQuantity}
                stockAmount={product.stockAmount}
              />

              <ProductActions />
            </div>
          </div>

          <Separator />

          <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
            <div className="flex flex-col gap-4">
              <ProductIngredientsCard ingredients={product.ingredients} />

              <ProductSpeciality />
            </div>

            <ShippingDetails productId={product.id} quantity={quantity} />
          </div>
        </div>

        <AboutCompany />

        <QuestionsAccordion layout="product-details" />

        {(products ?? []).length >= 1 && (
          <RelatedProducts products={products ?? []} />
        )}
      </div>
    </main>
  );
}

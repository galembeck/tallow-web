/** biome-ignore-all lint/correctness/useImageSize: sized by @TailwindCSS */
/** biome-ignore-all lint/complexity/noUselessLoneBlockStatements: may be used in the future... */

import { Skeleton } from "@/components/ui/skeleton";

interface ProductCarouselProps {
  product: {
    name: string;
    imageUrl: string;
    additionalImagesUrls?: string[];
  };
  isLoading?: boolean;
}

export function ProductCarousel({ product, isLoading }: ProductCarouselProps) {
  // const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // const nextImage = () => {
  //   setSelectedImageIndex(
  //     (prev) => (prev + 1) % (product?.additionalImagesUrls?.length ?? 1),
  //   );
  // };

  // const prevImage = () => {
  //   const length = product?.additionalImagesUrls?.length ?? 1;
  //   setSelectedImageIndex((prev) => (prev - 1 + length) % length);
  // };

  return (
    <div className="group relative overflow-hidden rounded-lg bg-white">
      <div className="relative h-full">
        {isLoading ? (
          <Skeleton className="h-full w-full" />
        ) : (
          <img
            alt={product?.name}
            className="h-full w-full object-cover"
            src={product?.imageUrl}
          />
        )}

        {/* {(product?.additionalImagesUrls?.length ?? 0) > 1 && (
            <>
              <button
                className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-white/90 p-2 opacity-0 shadow-lg transition-opacity hover:bg-white group-hover:opacity-100"
                onClick={prevImage}
                type="button"
              >
                <ChevronLeft className="h-6 w-6 text-gray-700" />
              </button>

              <button
                className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-white/90 p-2 opacity-0 shadow-lg transition-opacity hover:bg-white group-hover:opacity-100"
                onClick={nextImage}
                type="button"
              >
                <ChevronRight className="h-6 w-6 text-gray-700" />
              </button>
            </>
          )} */}
      </div>
    </div>
  );
}

{
  /* {(product?.additionalImagesUrls?.length ?? 0) > 1 && (
  <div className="grid grid-cols-4 gap-3">
    {product?.additionalImagesUrls?.map((image, index) => (
      <button
        className={`aspect-square overflow-hidden rounded-lg border-2 bg-white transition-all ${
          selectedImageIndex === index
            ? "border-amber-900"
            : "border-transparent hover:border-gray-300"
        }`}
        key={image}
        onClick={() => setSelectedImageIndex(index)}
        type="button"
      >
        <img
          alt={`${product.name} - ${index + 1}`}
          className="h-full w-full object-cover"
          src={image}
        />
      </button>
    ))}
  </div>
)} */
}

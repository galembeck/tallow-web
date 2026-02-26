import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

interface ProductCardProps {
  name: string;
  description: string;
  price: number;
}

export function ProductCard({ name, description, price }: ProductCardProps) {
  return (
    <Link
      className="group overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-xl"
      // to={`/products/${id}`}
      to="/products"
    >
      {/* <div className="relative h-80 overflow-hidden">
        <img
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          src=""
        />
      </div> */}

      <div className="p-6">
        <h3 className="mb-2 font-medium text-gray-900 text-xl">{name}</h3>

        <p className="mb-4 line-clamp-2 text-gray-600">{description}</p>

        <div className="flex items-center justify-between">
          <span className="text-2xl text-amber-900">
            R$ {price.toFixed(2).replace(".", ",")}
          </span>

          <span className="flex items-center gap-1 text-amber-900 text-sm group-hover:underline">
            Ver detalhes
            <ArrowRight className="size-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

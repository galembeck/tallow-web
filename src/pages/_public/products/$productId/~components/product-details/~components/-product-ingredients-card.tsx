import { CirclePile } from "lucide-react";

interface ProductIngredientsCardProps {
  ingredients: string[];
}

export function ProductIngredientsCard({
  ingredients,
}: ProductIngredientsCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-lg bg-white p-6 shadow-md">
      <h1 className="flex items-center gap-2 font-semibold text-lg">
        <CirclePile className="text-amber-900" />
        Ingredientes do produto
      </h1>

      <article className="flex flex-col gap-2 pl-6">
        {ingredients.map((ingredient) => (
          <p className="list-item flex-row items-center gap-2" key={ingredient}>
            {/** biome-ignore lint/suspicious/noSuspiciousSemicolonInJsx: necessary for this list... */}
            {ingredient};
          </p>
        ))}
      </article>
    </div>
  );
}

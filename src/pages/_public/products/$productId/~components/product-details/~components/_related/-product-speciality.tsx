import { Check } from "lucide-react";

export function ProductSpeciality() {
  return (
    <div className="flex flex-col gap-4 rounded-lg bg-white p-6 shadow-md">
      <h1 className="font-semibold text-lg">
        O que torna nossos produtos especiais?
      </h1>

      <article className="flex flex-col gap-2">
        <p className="flex flex-row items-center gap-2">
          <Check className="size-5 text-green-500" />
          Rico em vitaminas A, D, E e K naturais
        </p>

        <p className="flex flex-row items-center gap-2">
          <Check className="size-5 text-green-500" />
          Absorção profunda e rápida para a pele
        </p>

        <p className="flex flex-row items-center gap-2">
          <Check className="size-5 text-green-500" />
          Ingredientes biocompatíves com sua pele
        </p>

        <p className="flex flex-row items-center gap-2">
          <Check className="size-5 text-green-500" />
          Produzido em pequenos lotes totalmente artesanais
        </p>
      </article>
    </div>
  );
}

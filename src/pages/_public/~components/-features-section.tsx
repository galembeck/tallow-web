import { Heart, Leaf, Sparkles } from "lucide-react";

export function FeaturesSection() {
  return (
    <section className="px-4 py-20" id="features">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-16 text-center font-medium text-3xl text-amber-900 uppercase">
          Por Que Escolher Tallow?
        </h2>

        <div className="grid gap-12 md:grid-cols-3">
          <div className="text-center">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
              <Leaf className="h-8 w-8 text-amber-900" />
            </div>

            <h3 className="mb-4 font-medium text-2xl text-gray-900">
              100% Natural
            </h3>

            <p className="text-gray-600">
              Todos os nossos produtos são feitos com ingredientes naturais e
              orgânicos, sem químicos agressivos ou conservantes artificiais.
            </p>
          </div>

          <div className="text-center">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
              <Heart className="h-8 w-8 text-amber-900" />
            </div>

            <h3 className="mb-4 font-medium text-2xl text-gray-900">
              Feito com Amor
            </h3>

            <p className="text-gray-600">
              Cada produto é cuidadosamente preparado à mão em pequenos lotes
              para garantir a mais alta qualidade e frescor.
            </p>
          </div>

          <div className="text-center">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
              <Sparkles className="h-8 w-8 text-amber-900" />
            </div>

            <h3 className="mb-4 font-medium text-2xl text-gray-900">
              Resultados Visíveis
            </h3>

            <p className="text-gray-600">
              Rico em vitaminas A, D, E e K, o tallow nutre profundamente a
              pele, promovendo elasticidade e radiância natural.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

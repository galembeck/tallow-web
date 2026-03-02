import { Separator } from "@/components/ui/separator";

export function AboutCompany() {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-lg">
      <div className="flex flex-col-reverse md:grid md:grid-cols-2">
        <div className="relative h-64 md:h-auto">
          {/** biome-ignore lint/correctness/useImageSize: sized by @TailwindCSS */}
          <img
            alt="Tallow"
            className="h-full w-full object-cover"
            src="https://static.vecteezy.com/system/resources/thumbnails/055/969/174/small/peanut-butter-in-a-jar-free-photo.jpeg"
          />
        </div>

        <div className="p-8">
          <h2 className="mb-4 font-medium text-3xl text-amber-900">
            Sobre a Terra & Tallow
          </h2>

          <p className="mb-4 text-gray-700 leading-relaxed">
            A Terra & Tallow nasceu do desejo de resgatar os cuidados ancestrais
            com a pele, utilizando ingredientes naturais e tradicionais que
            foram esquecidos pela indústria moderna.
          </p>

          <p className="mb-4 text-gray-700 leading-relaxed">
            Cada produto é feito artesanalmente em pequenos lotes, garantindo
            frescor e qualidade excepcional. Utilizamos apenas sebo bovino de
            animais criados organicamente, livre de hormônios e antibióticos.
          </p>

          <p className="mb-4 text-gray-700 leading-relaxed">
            Nossa missão é proporcionar produtos que realmente funcionam,
            respeitando a natureza e o bem-estar animal.
          </p>

          <Separator />

          <div className="mt-6 flex items-center justify-between">
            <article className="flex flex-col gap-1 text-center">
              <h3 className="text-3xl text-amber-900">+1</h3>
              <p className="text-gray-600 text-sm">anos no mercado</p>
            </article>

            <hr className="h-12 w-px bg-gray-300" />

            <article className="flex flex-col gap-1 text-center">
              <h3 className="text-3xl text-amber-900">+5K</h3>
              <p className="text-gray-600 text-sm">clientes satisfeitos</p>
            </article>

            <hr className="h-12 w-px bg-gray-300" />

            <article className="flex flex-col gap-1 text-center">
              <h3 className="text-3xl text-amber-900">98%</h3>
              <p className="text-gray-600 text-sm">aprovação</p>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
}

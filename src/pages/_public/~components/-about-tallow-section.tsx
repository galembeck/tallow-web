export function AboutTallowSection() {
  return (
    <section className="bg-amber-50 px-4 py-20" id="about-tallow">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <h2 className="mb-6 text-center font-medium text-3xl text-amber-900 uppercase md:text-left">
              O que é o Tallow?
            </h2>

            <p className="mb-4 text-gray-700 text-lg">
              Tallow é o sebo bovino purificado, usado há séculos como
              ingrediente principal em cuidados com a pele. Rico em ácidos
              graxos biocompatíveis com a nossa pele, ele penetra profundamente
              nas camadas dérmicas, proporcionando hidratação duradoura.
            </p>

            <p className="mb-4 text-gray-700 text-lg">
              Ao contrário de muitos produtos modernos que ficam na superfície
              da pele, o tallow trabalha em harmonia com a biologia natural do
              seu corpo, nutrindo e restaurando.
            </p>

            <p className="text-gray-700 text-lg">
              Nosso tallow vem de animais criados organicamente, garantindo
              pureza e qualidade em cada produto.
            </p>
          </div>

          <div className="relative h-96 overflow-hidden rounded-lg shadow-xl">
            {/** biome-ignore lint/correctness/useImageSize: not required in this case */}
            <img
              alt="Tallow"
              className="h-full w-full object-cover"
              src="https://static.vecteezy.com/system/resources/thumbnails/055/969/174/small/peanut-butter-in-a-jar-free-photo.jpeg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

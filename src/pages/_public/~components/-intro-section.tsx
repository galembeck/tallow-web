import { ArrowRight } from "lucide-react";
import { scrollToSection } from "@/utils/scroll-to-section";

export function IntroSection() {
  return (
    <section
      className="relative flex min-h-screen items-center justify-center bg-linear-to-r from-amber-50 to-orange-50"
      id="intro"
    >
      <div className="absolute inset-0 opacity-20">
        <img
          alt="Terra & Tallow"
          className="h-full w-full object-cover"
          height={600}
          src="https://images.unsplash.com/photo-1577467014570-02e2cb105b7b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDF8fHxlbnwwfHx8fHw%3D"
          width={1080}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h1 className="mb-6 text-5xl text-amber-900 leading-20 md:text-7xl">
          Da pureza do pasto à naturalidade da pele
        </h1>

        <p className="mx-auto mb-8 max-w-2xl text-base text-gray-700 md:text-lg">
          Conectamos a pureza rural à rotina urbana com produtos de tallow
          orgânico, trazendo o poder da ancestralidade para o dia a dia, com
          produtos 100% artesanais, sem corantes, disruptores endócrinos,
          parabenos ou petrolatos
        </p>

        <button
          className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-amber-900 px-8 py-4 font-semibold text-white uppercase transition-colors hover:bg-amber-800"
          onClick={() => scrollToSection("features")}
          type="button"
        >
          Descrubra nossos produtos
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}

import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="bg-amber-900 px-4 py-20 text-white" id="call-to-action">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="mb-6 font-medium text-2xl uppercase">
          Pronto para transformar sua pele?
        </h2>

        <p className="mb-8 text-xl opacity-80">
          Experimente a diferença dos produtos naturais Tallow e descubra uma
          pele mais saudável e radiante.
        </p>

        <Link
          className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-semibold text-amber-900 uppercase transition-colors hover:bg-amber-50"
          to="/products"
        >
          Explorar produtos
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </section>
  );
}

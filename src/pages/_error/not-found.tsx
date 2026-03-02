import { createFileRoute, Link } from "@tanstack/react-router";
import { Frown, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_error/not-found")({
  component: NotFoundPage,
});

export function NotFoundPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-white">
      <div className="flex max-w-4xl flex-col items-center justify-center gap-10 px-4 py-8 text-center sm:px-6 lg:px-8">
        <Frown className="size-40 text-amber-900" />

        <article className="flex flex-col gap-4">
          <h1 className="font-bold text-6xl text-amber-900 md:text-8xl">
            4 0 4
          </h1>
          <p className="text-gray-700 text-xl md:text-2xl">
            Página não encontrada :/
          </p>
          <p className="text-gray-400 text-lg">
            A página que você está procurando não existe ou foi movida.
          </p>

          <Button
            asChild
            className="mt-4 bg-amber-900 py-6! font-semibold text-base text-white uppercase hover:bg-amber-900/90 hover:text-white"
          >
            <Link to="/">
              <Home className="mr-2 size-4" />
              Voltar ao início
            </Link>
          </Button>
        </article>
      </div>
    </div>
  );
}

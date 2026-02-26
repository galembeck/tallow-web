import { Link } from "@tanstack/react-router";
import { Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-amber-50">
      <div className="container mx-auto max-w-6xl px-4 pt-10 sm:px-6 lg:px-8 lg:pt-12">
        <div className="mb-10 flex flex-col justify-between gap-10 md:flex-row">
          <div>
            <Link
              className="flex cursor-default items-center justify-center gap-2 sm:justify-start"
              to="/"
            >
              {/** biome-ignore lint/correctness/useImageSize: not required in this case */}
              <img
                alt="Terra & Tallow"
                className="size-7"
                src="/assets/icons/logo.svg"
              />

              <h1 className="font-semibold text-2xl text-black md:text-2xl dark:text-white">
                Terra & Tallow
              </h1>
            </Link>

            <p className="mt-6 text-center text-muted-foreground leading-relaxed sm:max-w-lg sm:text-left">
              Conectamos a pureza rural à rotina urbana com produtos de tallow
              orgânico, trazendo o poder da ancestralidade para o dia a dia, com
              produtos 100% artesanais, sem corantes, disruptores endócrinos,
              parabenos ou petrolatos.
            </p>

            <ul className="mt-8 flex justify-center gap-6 sm:justify-start md:gap-8">
              <li>
                <a
                  className="flex items-center gap-2"
                  href="https://www.instagram.com/terraetallow?igsh=MWc1MGhwYzR1aWZ6NQ=="
                  rel="noreferrer"
                  target="_blank"
                >
                  <span className="sr-only">Instagram</span>
                  <Instagram />
                  @terraetallow
                </a>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-2">
            <div className="text-center sm:text-left">
              <p className="font-medium text-lg">Sobre</p>

              <ul className="mt-8 space-y-4 text-sm">
                <li>
                  <Link
                    className="text-muted-foreground transition hover:text-muted-foreground/75 dark:text-secondary-gray dark:hover:text-secondary-gray/75"
                    to="/"
                  >
                    Contato
                  </Link>
                </li>
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="font-medium text-lg">Compliance</p>

              <ul className="mt-8 space-y-4 text-sm">
                <li>
                  <Link
                    className="text-muted-foreground transition hover:text-muted-foreground/75 dark:text-secondary-gray dark:hover:text-secondary-gray/75"
                    to="/"
                  >
                    Termos de Uso
                  </Link>
                </li>

                <li>
                  <Link
                    className="text-muted-foreground transition hover:text-muted-foreground/75 dark:text-secondary-gray dark:hover:text-secondary-gray/75"
                    to="/"
                  >
                    Políticas de Privacidade
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-black border-t py-6 dark:border-gray-100">
          <p className="truncate text-center text-base sm:order-first sm:mt-0">
            &copy; {new Date().getFullYear()} Todos os direitos reservados.
            Terra & Tallow | CNPJ 56.079.549/0001-78
          </p>
        </div>
      </div>
    </footer>
  );
}

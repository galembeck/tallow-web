import { useLocation, useNavigate } from "@tanstack/react-router";
import { Menu, ShoppingCart, X } from "lucide-react";
import { useState } from "react";
import { scrollToSection } from "@/utils/scroll-to-section";
import { Button } from "./ui/button";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 right-0 left-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Button
            className="no-underline! cursor-pointer px-0! text-amber-900 text-lg"
            onClick={
              location.pathname === "/"
                ? () => scrollToSection("intro")
                : () => navigate({ to: "/" })
            }
            variant="link"
          >
            {/** biome-ignore lint/correctness/useImageSize: sized by @TailwindCSS */}
            <img
              alt="Terra & Tallow"
              className="size-7"
              src="/assets/icons/logo.svg"
            />
            Terra & Tallow
          </Button>

          <nav className="hidden items-center md:flex">
            <Button
              className="cursor-pointer text-base text-gray-700 transition-colors hover:text-amber-900"
              onClick={() => scrollToSection("intro")}
              variant="link"
            >
              Início
            </Button>

            <Button
              className="cursor-pointer text-base text-gray-700 transition-colors hover:text-amber-900"
              onClick={() => scrollToSection("features")}
              variant="link"
            >
              Vantagens
            </Button>

            <Button
              className="cursor-pointer text-base text-gray-700 transition-colors hover:text-amber-900"
              onClick={() => scrollToSection("about-tallow")}
              variant="link"
            >
              Sobre o Tallow
            </Button>

            <Button
              className="cursor-pointer text-base text-gray-700 transition-colors hover:text-amber-900"
              onClick={() => navigate({ to: "/" })}
              variant="link"
            >
              Produtos
            </Button>

            <Button
              className="relative cursor-pointer text-base text-gray-700 transition-colors hover:text-amber-900"
              onClick={() => navigate({ to: "/cart" })}
              variant="link"
            >
              <ShoppingCart className="h-6 w-6" />
              {/* {getTotalItems() > 0 && ( */}
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-amber-900 text-white text-xs">
                {/* {getTotalItems()} */}0
              </span>
              {/* )} */}
            </Button>
          </nav>

          <button
            className="text-gray-700 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 cursor-pointer" />
            ) : (
              <Menu className="h-6 w-6 cursor-pointer" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <nav className="border-t py-4 md:hidden">
            <div className="flex flex-col items-start gap-4">
              <Button
                className="cursor-pointer text-base text-gray-700 transition-colors hover:text-amber-900"
                onClick={() => scrollToSection("intro")}
                variant="link"
              >
                Início
              </Button>

              <Button
                className="cursor-pointer text-base text-gray-700 transition-colors hover:text-amber-900"
                onClick={() => scrollToSection("features")}
                variant="link"
              >
                Vantagens
              </Button>

              <Button
                className="cursor-pointer text-base text-gray-700 transition-colors hover:text-amber-900"
                onClick={() => scrollToSection("about-tallow")}
                variant="link"
              >
                Sobre o Tallow
              </Button>

              <Button
                className="cursor-pointer text-base text-gray-700 transition-colors hover:text-amber-900"
                onClick={() => navigate({ to: "/" })}
                variant="link"
              >
                Produtos
              </Button>

              <Button
                className="flex cursor-pointer items-center gap-2 text-base text-gray-700 transition-colors hover:text-amber-900"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate({ to: "/cart" });
                }}
                variant="link"
              >
                <ShoppingCart className="h-5 w-5" />
                Carrinho
                {/* {getTotalItems() > 0 && ( */}
                <span className="rounded-full bg-amber-900 px-2 py-1 text-white text-xs">
                  {/* {getTotalItems()} */}0
                </span>
                {/* )} */}
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

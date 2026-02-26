import { useLocation, useNavigate } from "@tanstack/react-router";
import { LogIn, LogOut, Menu, ShoppingCart, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/services/use-auth";
import { scrollToSection } from "@/utils/scroll-to-section";
import { ProfileDropdown } from "./profile-dropdown";
import { Button } from "./ui/button";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout } = useAuth();

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
              onClick={
                location.pathname === "/"
                  ? () => scrollToSection("intro")
                  : () => navigate({ to: "/" })
              }
              variant="link"
            >
              Início
            </Button>

            <Button
              className="cursor-pointer text-base text-gray-700 transition-colors hover:text-amber-900"
              onClick={
                location.pathname === "/"
                  ? () => scrollToSection("features")
                  : () => navigate({ to: "/", hash: "features" })
              }
              variant="link"
            >
              Vantagens
            </Button>

            <Button
              className="cursor-pointer text-base text-gray-700 transition-colors hover:text-amber-900"
              onClick={
                location.pathname === "/"
                  ? () => scrollToSection("about-tallow")
                  : () => navigate({ to: "/", hash: "about-tallow" })
              }
              variant="link"
            >
              Sobre o Tallow
            </Button>

            <Button
              className="cursor-pointer text-base text-gray-700 transition-colors hover:text-amber-900"
              onClick={() => navigate({ to: "/products" })}
              variant="link"
            >
              Produtos
            </Button>

            <ProfileDropdown />
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
                onClick={
                  location.pathname === "/"
                    ? () => scrollToSection("intro")
                    : () => navigate({ to: "/" })
                }
                variant="link"
              >
                Início
              </Button>

              <Button
                className="cursor-pointer text-base text-gray-700 transition-colors hover:text-amber-900"
                onClick={
                  location.pathname === "/"
                    ? () => scrollToSection("features")
                    : () => navigate({ to: "/", hash: "features" })
                }
                variant="link"
              >
                Vantagens
              </Button>

              <Button
                className="cursor-pointer text-base text-gray-700 transition-colors hover:text-amber-900"
                onClick={
                  location.pathname === "/"
                    ? () => scrollToSection("about-tallow")
                    : () => navigate({ to: "/", hash: "about-tallow" })
                }
                variant="link"
              >
                Sobre o Tallow
              </Button>

              <Button
                className="cursor-pointer text-base text-gray-700 transition-colors hover:text-amber-900"
                onClick={() => navigate({ to: "/products" })}
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

              {user ? (
                <Button
                  className="flex w-full cursor-pointer items-center gap-2 bg-amber-900 py-4! text-base text-white transition-colors hover:bg-amber-900/90"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                >
                  <LogOut className="h-5 w-5" />
                  Sair
                </Button>
              ) : (
                <Button
                  className="flex w-full cursor-pointer items-center gap-2 bg-amber-900 py-4! text-base text-white transition-colors hover:bg-amber-900/90"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate({ to: "/sign-in" });
                  }}
                >
                  Entrar
                  <LogIn className="h-5 w-5" />
                </Button>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

import { Link } from "@tanstack/react-router";
import { Menu, ShoppingCart, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 right-0 left-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link className="text-2xl text-amber-900" to="/">
            Terra & Tallow
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link
              className="text-gray-700 transition-colors hover:text-amber-900"
              to="/"
            >
              Início
            </Link>
            <Link
              className="text-gray-700 transition-colors hover:text-amber-900"
              to="/"
            >
              Produtos
            </Link>
            <Link
              className="relative text-gray-700 transition-colors hover:text-amber-900"
              to="/"
            >
              <ShoppingCart className="h-6 w-6" />
              {/* {getTotalItems() > 0 && ( */}
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-amber-900 text-white text-xs">
                {/* {getTotalItems()} */}0
              </span>
              {/* )} */}
            </Link>
          </nav>

          <button
            className="text-gray-700 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <nav className="border-t py-4 md:hidden">
            <div className="flex flex-col gap-4">
              <Link
                className="text-gray-700 transition-colors hover:text-amber-900"
                onClick={() => setMobileMenuOpen(false)}
                to="/"
              >
                Início
              </Link>
              <Link
                className="text-gray-700 transition-colors hover:text-amber-900"
                onClick={() => setMobileMenuOpen(false)}
                to="/"
              >
                Produtos
              </Link>
              <Link
                className="flex items-center gap-2 text-gray-700 transition-colors hover:text-amber-900"
                onClick={() => setMobileMenuOpen(false)}
                to="/"
              >
                <ShoppingCart className="h-5 w-5" />
                Carrinho
                {/* {getTotalItems() > 0 && ( */}
                <span className="rounded-full bg-amber-900 px-2 py-1 text-white text-xs">
                  {/* {getTotalItems()} */}0
                </span>
                {/* )} */}
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

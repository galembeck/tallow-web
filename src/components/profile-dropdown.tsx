import { useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  LogIn,
  LogOut,
  ShoppingCart,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/services/use-auth";
import { useCart } from "@/hooks/services/use-cart";
import { Button } from "./ui/button";

export function ProfileDropdown() {
  const { user, logout } = useAuth();

  const { cart } = useCart();
  const cartItemsCount = cart?.totalItems ?? 0;

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate({ to: "/sign-in" });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="relative cursor-pointer text-base text-gray-700 transition-colors hover:text-amber-900"
          variant="link"
        >
          <ShoppingCart className="h-6 w-6" />
          {user && cartItemsCount > 0 && (
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-amber-900 text-white text-xs">
              {cartItemsCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel className="text-muted-foreground">
          Painel de usuário
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          {user && (
            <DropdownMenuItem onClick={() => navigate({ to: "/profile" })}>
              <User />
              Perfil
            </DropdownMenuItem>
          )}

          <DropdownMenuItem onClick={() => navigate({ to: "/cart" })}>
            <ShoppingCart />
            Carrinho
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {user ? (
          <>
            {user.profileType === 1 && (
              <>
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-muted-foreground">
                    Painel administrativo
                  </DropdownMenuLabel>

                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => navigate({ to: "/admin/dashboard" })}
                    >
                      <LayoutDashboard />
                      Dashboard
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />
              </>
            )}

            <DropdownMenuItem
              className="group focus:text-red-400"
              onClick={handleLogout}
            >
              <LogOut className="group-focus:text-red-400" />
              Sair
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem
              className="group text-gray-700 transition-colors focus:text-amber-900"
              onClick={() => navigate({ to: "/sign-in" })}
            >
              <User className="group-focus:text-amber-900" />
              Entrar
            </DropdownMenuItem>

            <DropdownMenuItem
              className="bg-amber-900 text-white focus:bg-amber-900/90 focus:text-white"
              onClick={() => navigate({ to: "/sign-up" })}
            >
              <LogIn className="text-white" />
              Criar conta
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

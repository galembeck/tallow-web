import { Link } from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ListItem } from "@/components/ui/list-item";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useProduct } from "@/hooks/services/use-product";

interface ProductDetailsBreadcrumbProps {
  productName?: string;
}

export function ProductDetailsBreadcrumb({
  productName,
}: ProductDetailsBreadcrumbProps) {
  const { products, isLoading } = useProduct();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild className="font-medium! text-base!">
            <Link to="/">Início</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator />

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild className="text-base!">
                    <Link to="/products">Produtos</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-100 gap-2 md:w-125 md:grid-cols-2 lg:w-150">
                  {products?.map((product) => (
                    <ListItem
                      imageUrl={product.imageUrl}
                      key={product.id}
                      productId={product.id}
                      title={product.name}
                      to="/products/$productId"
                    >
                      {product.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <BreadcrumbSeparator />

        <BreadcrumbItem>
          <BreadcrumbPage className="font-semibold! text-amber-900 text-base!">
            {isLoading ? "Carregando..." : productName}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

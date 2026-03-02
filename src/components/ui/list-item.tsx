import { Link } from "@tanstack/react-router";
import { NavigationMenuLink } from "./navigation-menu";

export function ListItem({
  title,
  children,
  to,
  imageUrl,
  productId,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & {
  to: string;
  imageUrl: string;
  productId: string;
}) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link params={{ productId }} to={to}>
          <div className="flex flex-row items-center gap-2">
            {/** biome-ignore lint/correctness/useImageSize: sized by @TailwindCSS */}
            <img
              alt={title}
              className="h-12 w-12 rounded-md object-cover"
              src={imageUrl}
            />

            <div className="flex flex-col gap-1 text-sm">
              <div className="font-medium leading-none">{title}</div>
              <div className="line-clamp-2 text-muted-foreground">
                {children}
              </div>
            </div>
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

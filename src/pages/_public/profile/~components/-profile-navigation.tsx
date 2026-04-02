import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";

export interface ProfileNavigationItem {
  id: string;
  path: string;
  aliases?: string[];
  label: string;
  icon: LucideIcon;
  badge?: number;
  disabled?: boolean;
}

interface ProfileNavigationProps {
  items: ProfileNavigationItem[];
}

export function ProfileNavigation({ items }: ProfileNavigationProps) {
  const pathname = useLocation({ select: (loc) => loc.pathname });

  const checkIsActive = (item: ProfileNavigationItem) => {
    const isRoot = item.path === "/profile";

    if (isRoot) {
      return (
        pathname === "/profile" ||
        pathname === "/profile/" ||
        item.aliases?.some(
          (alias) => pathname === alias || pathname.startsWith(alias),
        )
      );
    }

    return (
      pathname.startsWith(item.path) ||
      item.aliases?.some((alias) => pathname.startsWith(alias))
    );
  };

  return (
    <Card className="p-0!">
      <CardContent className="p-4">
        <nav className="flex-col gap-0.5 hidden md:flex">
          {items.map((item) => {
            const isActive = checkIsActive(item);

            return (
              <Link
                key={item.id}
                to={item.path}
                disabled={item.disabled}
                className={cn(
                  "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors text-left",
                  isActive
                    ? "bg-amber-900 text-primary-foreground font-medium hover:bg-amber-900 hover:text-primary-foreground"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground",
                  item.disabled && "cursor-not-allowed opacity-50",
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span className="flex-1">{item.label}</span>

                {item.badge !== undefined && item.badge > 0 && (
                  <Badge
                    variant="secondary"
                    className="text-xs bg-black/10 text-current"
                  >
                    {item.badge}
                  </Badge>
                )}

                {item.disabled && (
                  <span className="text-xs text-muted-foreground">
                    em breve
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <Accordion className="w-full md:hidden block" collapsible type="single">
          <AccordionItem value="profile-navigation">
            <AccordionTrigger className="text-lg font-bold font-sagona text-amber-950 p-0!">
              Minha conta
            </AccordionTrigger>

            <AccordionContent>
              <nav className="flex flex-col gap-0.5">
                {items.map((item) => {
                  const isActive = checkIsActive(item);

                  return (
                    <Link
                      key={item.id}
                      to={item.path}
                      disabled={item.disabled}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors text-left",
                        isActive
                          ? "bg-amber-900 text-primary-foreground font-medium hover:bg-amber-900 hover:text-primary-foreground"
                          : "text-foreground hover:bg-accent hover:text-accent-foreground",
                        item.disabled && "cursor-not-allowed opacity-50",
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span className="flex-1">{item.label}</span>

                      {item.badge !== undefined && item.badge > 0 && (
                        <Badge
                          variant="secondary"
                          className="text-xs bg-black/10 text-current"
                        >
                          {item.badge}
                        </Badge>
                      )}

                      {item.disabled && (
                        <span className="text-xs text-muted-foreground">
                          em breve
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}

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

  return (
    <Card>
      <CardContent className="p-2">
        <nav className="flex flex-col gap-0.5">
          {items.map((item) => {
            const isRoot = item.path === "/profile";

            const isActive = isRoot
              ? pathname === "/profile" || pathname === "/profile/"
              : pathname.startsWith(item.path) ||
                item.aliases?.some((alias) => pathname.startsWith(alias));

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
      </CardContent>
    </Card>
  );
}

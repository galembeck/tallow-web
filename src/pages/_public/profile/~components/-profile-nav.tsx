import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

export interface ProfileNavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
  disabled?: boolean;
}

interface ProfileNavProps {
  items: ProfileNavItem[];
  activeItem: string;
  onSelect: (id: string) => void;
}

export function ProfileNav({ items, activeItem, onSelect }: ProfileNavProps) {
  return (
    <Card>
      <CardContent className="p-2">
        <nav className="flex flex-col gap-0.5">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              disabled={item.disabled}
              onClick={() => onSelect(item.id)}
              className={cn(
                "flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors text-left",
                activeItem === item.id
                  ? "bg-amber-900 text-primary-foreground font-medium"
                  : "text-foreground hover:bg-accent hover:text-accent-foreground",
                item.disabled && "cursor-not-allowed opacity-50",
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <Badge
                  variant={activeItem === item.id ? "outline" : "secondary"}
                  className={`text-xs ${activeItem === item.id ? "text-primary-foreground" : ""}`}
                >
                  {item.badge}
                </Badge>
              )}
              {item.disabled && (
                <span className="text-xs text-muted-foreground">em breve</span>
              )}
            </button>
          ))}
        </nav>
      </CardContent>
    </Card>
  );
}

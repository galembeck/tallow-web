import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications } from "@/hooks/use-notifications";
import { cn } from "@/lib/utils";
import type { AdminNotification } from "@/types/services/notification";
import { formatDate } from "@/utils/format-date";
import { useNavigate } from "@tanstack/react-router";
import {
  Bell,
  CreditCard,
  ExternalLink,
  Package,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { useState } from "react";

function notificationIcon(notification: AdminNotification) {
  switch (notification.category) {
    case "ORDER":
      return <ShoppingCart className="h-4 w-4 shrink-0 text-amber-600" />;
    case "PAYMENT":
      return <CreditCard className="h-4 w-4 shrink-0 text-blue-600" />;
    case "SHIPPING":
      return <Truck className="h-4 w-4 shrink-0 text-green-600" />;
    default:
      return <Package className="h-4 w-4 shrink-0 text-muted-foreground" />;
  }
}

export function NotificationDropdown() {
  const navigate = useNavigate();

  const { notifications, clearAll, dismissMany } = useNotifications();
  const unreadCount = notifications.length;

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleMarkSelectedRead = () => {
    dismissMany(Array.from(selectedIds));
    setSelectedIds(new Set());
  };

  const handleClearAll = () => {
    clearAll();
    setSelectedIds(new Set());
  };

  const selectedCount = selectedIds.size;

  return (
    <DropdownMenu onOpenChange={(open) => { if (!open) setSelectedIds(new Set()); }}>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className={cn("w-100 p-0", unreadCount === 0 && "w-64")}
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <p className="font-semibold text-sm">Notificações</p>

          {unreadCount > 0 && (
            <div className="flex items-center gap-3">
              {selectedCount > 0 && (
                <button
                  onClick={handleMarkSelectedRead}
                  className="text-xs font-medium text-amber-700 hover:text-amber-900 transition-colors cursor-pointer"
                >
                  Marcar como lida{selectedCount > 1 ? "s" : ""} ({selectedCount})
                </button>
              )}
              <button
                onClick={handleClearAll}
                className="text-muted-foreground text-xs hover:text-foreground transition-colors cursor-pointer"
              >
                Limpar tudo
              </button>
            </div>
          )}
        </div>

        {unreadCount === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-muted-foreground">
            <Bell className="h-6 w-6" />
            <p className="text-xs">Nenhuma notificação</p>
          </div>
        ) : (
          <ul className="max-h-80 overflow-y-auto divide-y">
            <ScrollArea>
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className={cn(
                    "flex items-start gap-3 px-4 py-3 hover:bg-muted/50 transition-colors",
                    selectedIds.has(n.id) && "bg-amber-50",
                  )}
                >
                  <div className="mt-0.5 shrink-0">
                    <Checkbox
                      checked={selectedIds.has(n.id)}
                      onCheckedChange={() => toggleSelect(n.id)}
                      className="border-amber-900/40 data-[state=checked]:bg-amber-900 data-[state=checked]:border-amber-900"
                    />
                  </div>

                  <article className="flex flex-1 items-start justify-between gap-3 min-w-0">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="mt-0.5">{notificationIcon(n)}</div>

                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm leading-snug"
                          dangerouslySetInnerHTML={{ __html: n.message }}
                        />
                        <p className="text-muted-foreground text-xs mt-1">
                          {formatDate(n.createdAt)}
                        </p>
                      </div>
                    </div>

                    {n.orderId && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="shrink-0"
                        onClick={() =>
                          navigate({
                            to: "/admin/orders/$orderId",
                            params: { orderId: n.orderId ?? "" },
                          })
                        }
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                  </article>
                </li>
              ))}
            </ScrollArea>
          </ul>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

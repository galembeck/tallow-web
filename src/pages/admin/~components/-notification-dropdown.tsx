import { Button } from "@/components/ui/button";
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

  const { notifications, clearAll } = useNotifications();
  const unreadCount = notifications.length;

  return (
    <DropdownMenu>
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
            <button
              onClick={clearAll}
              className="text-muted-foreground text-xs hover:text-foreground transition-colors cursor-pointer"
            >
              Limpar tudo
            </button>
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
                  className="flex items-start justify-between gap-3 px-4 py-3 hover:bg-muted/50 transition-colors"
                >
                  <article className="flex items-start gap-3">
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
                  </article>

                  {n.orderId && (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() =>
                        navigate({
                          to: "/admin/orders/$orderId",
                          params: {
                            orderId: n.orderId ?? "",
                          },
                        })
                      }
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </li>
              ))}
            </ScrollArea>
          </ul>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

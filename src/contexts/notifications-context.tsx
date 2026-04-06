import * as signalR from "@microsoft/signalr";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { API } from "@/api/connections/tallow";
import type { AdminNotification } from "@/types/services/notification";

const HUB_URL = `${API.baseURL}/hubs/notifications`;

interface NotificationsContextValue {
  notifications: AdminNotification[];
  isConnected: boolean;
  clearAll: () => void;
  dismiss: (id: string) => void;
  dismissMany: (ids: string[]) => void;
}

const NotificationsContext = createContext<NotificationsContextValue>({
  notifications: [],
  isConnected: false,
  clearAll: () => {},
  dismiss: () => {},
  dismissMany: () => {},
});

export function useNotificationsContext() {
  return useContext(NotificationsContext);
}

export function NotificationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, { withCredentials: true })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    connectionRef.current = connection;

    const handleNotification = (notification: AdminNotification) => {
      setNotifications((prev) => {
        if (prev.some((n) => n.id === notification.id)) return prev;
        return [notification, ...prev];
      });
    };

    connection.on("notification", handleNotification);
    connection.on("ReceiveNotification", handleNotification);

    connection.onreconnected(() => setIsConnected(true));
    connection.onclose(() => setIsConnected(false));

    connection
      .start()
      .then(() => setIsConnected(true))
      .catch(() => setIsConnected(false));

    return () => {
      connection.stop();
    };
  }, []);

  const clearAll = useCallback(() => setNotifications([]), []);

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const dismissMany = useCallback((ids: string[]) => {
    const idSet = new Set(ids);
    setNotifications((prev) => prev.filter((n) => !idSet.has(n.id)));
  }, []);

  return (
    <NotificationsContext.Provider
      value={{ notifications, isConnected, clearAll, dismiss, dismissMany }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

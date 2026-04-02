import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Spinner } from "@/components/ui/spinner";
import { useOrder } from "@/hooks/services/use-order";
import { cn } from "@/lib/utils";
import {
  getOrderStatusColor,
  normalizeOrderStatus,
  orderStatusLabel,
} from "@/types/enums/order-status";
import type { OrderItemDTO, OrderResponseDTO } from "@/types/services/order";
import { Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const ordersHistoryTableColumns: ColumnDef<OrderResponseDTO>[] = [
  {
    accessorKey: "id",
    header: () => <span>Nº do pedido</span>,
    cell: ({ row }) => {
      const id = row.getValue("id") as string;

      const shortId = id ? id.split("-")[0] : "-";

      return <span className="uppercase font-semibold">#{shortId}</span>;
    },
  },
  {
    accessorKey: "createdAt",
    header: () => <span>Data</span>,
    cell: ({ row }) => {
      const raw = row.getValue("createdAt") as string | null;

      if (!raw) return <div className="flex justify-center">-</div>;

      return <span>{format(new Date(raw), "dd/MM/yyyy")}</span>;
    },
  },
  {
    accessorKey: "items",
    header: () => <span>Nº de itens</span>,
    cell: ({ row }) => {
      const items = row.getValue("items") as OrderItemDTO[];

      const count = items?.length ?? 0;

      return (
        <div className="flex ml-7.5">
          <span className="font-semibold">{count}x</span>
        </div>
      );
    },
  },
  {
    accessorKey: "totalAmount",
    header: () => <span>Valor</span>,
    cell: ({ row }) => (
      <span className="text-gray-600 font-semibold">
        R$ {row.getValue("totalAmount")}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: () => <span>Status</span>,
    cell: ({ row }) => {
      const rawStatus = row.getValue("status") as string | number;
      const currentStatus = normalizeOrderStatus(rawStatus);

      return (
        <Badge
          variant="outline"
          className={cn(
            "uppercase font-semibold",
            getOrderStatusColor(currentStatus),
          )}
        >
          {orderStatusLabel[currentStatus] ?? currentStatus}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const order = row.original;

      return (
        <Button
          asChild
          size="sm"
          className="bg-inherit text-amber-900 border border-amber-900 hover:bg-inherit/90 hover:text-amber-900/80 hover:underline"
        >
          <Link
            to="/profile/orders-history/$orderId"
            params={{ orderId: order.id }}
          >
            Detalhes
          </Link>
        </Button>
      );
    },
  },
];

interface OrdersHistoryTableProps {
  userOrders: Awaited<ReturnType<typeof useOrder>>["userOrders"];
  isUserOrdersLoading: boolean;
}

export function OrdersHistoryTable({
  userOrders,
  isUserOrdersLoading,
}: OrdersHistoryTableProps) {
  if (isUserOrdersLoading) {
    return (
      <div className="flex justify-center items-center gap-2 text-muted-foreground">
        <Spinner />
        <span>Carregando histórico de pedidos...</span>
      </div>
    );
  }

  return (
    <DataTable columns={ordersHistoryTableColumns} data={userOrders ?? []} />
  );
}

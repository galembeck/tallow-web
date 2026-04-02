/* eslint-disable react-hooks/rules-of-hooks */
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { DataTableColumnSearch } from "@/components/data-table-column-search";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useOrder } from "@/hooks/services/use-order";
import type { OrderAdminSummaryDTO } from "@/types/services/order";
import {
  getOrderStatusColor,
  normalizeOrderStatus,
  orderStatusLabel,
} from "@/types/enums/order-status";
import { formatCurrency } from "@/utils/format-currency";
import { useNavigate } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Copy, Eye, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const ordersTableColumns: ColumnDef<OrderAdminSummaryDTO>[] = [
  {
    accessorKey: "id",
    header: ({ table, column }) => (
      <div className="flex items-center gap-4">
        <Checkbox
          aria-label="Selecionar todas"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />

        <DataTableColumnSearch
          column={column}
          placeholder="Buscar por ID..."
          title="ID"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Checkbox
          aria-label="Selecionar linha"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />

        <span className="max-w-30 truncate text-xs">{row.getValue("id")}</span>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnSearch
        column={column}
        placeholder="Buscar por status..."
        title="Status"
      />
    ),
    cell: ({ row }) => {
      const rawStatus = row.getValue("status") as string | number;
      const currentStatus = normalizeOrderStatus(rawStatus);

      return (
        <div className="flex justify-center">
          <Badge
            variant="outline"
            className={cn(
              "uppercase font-semibold",
              getOrderStatusColor(currentStatus),
            )}
          >
            {orderStatusLabel[currentStatus] ?? currentStatus}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "buyerName",
    header: ({ column }) => (
      <DataTableColumnSearch
        column={column}
        placeholder="Buscar por nome..."
        title="Comprador"
      />
    ),
    cell: ({ row }) => {
      const order = row.original;
      return (
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-sm">{order.buyerName}</span>
          <span className="text-muted-foreground text-xs">
            {order.buyerEmail}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "totalAmount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total" />
    ),
    cell: ({ row }) => {
      const amount = Number(row.getValue("totalAmount"));
      return <span className="font-medium">{formatCurrency(amount)}</span>;
    },
  },
  {
    accessorKey: "itemsCount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Itens" />
    ),
    cell: ({ row }) => {
      const count = row.getValue("itemsCount") as number;
      return (
        <div className="text-center">
          <span>{count}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "shippingCity",
    header: () => <span>Localidade</span>,
    cell: ({ row }) => {
      const order = row.original;
      return (
        <span className="text-sm">
          {order.shippingCity}, {order.shippingState}
        </span>
      );
    },
  },
  {
    accessorKey: "dateCreated",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filterFn: "dateRange" as any,
    header: () => <span className="flex justify-center">Data do pedido</span>,
    cell: ({ row }) => {
      const raw = row.getValue("dateCreated") as string | null;
      if (!raw) return <div className="flex justify-center">—</div>;
      return (
        <div className="flex justify-center">
          <span>{format(new Date(raw), "dd/MM/yyyy")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "shippedAt",
    header: () => <span className="flex justify-center">Enviado em</span>,
    cell: ({ row }) => {
      const raw = row.getValue("shippedAt") as string | null;
      if (!raw) return <div className="flex justify-center">—</div>;
      return (
        <div className="flex justify-center">
          <span>{format(new Date(raw), "dd/MM/yyyy")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "deliveredAt",
    header: () => <span className="flex justify-center">Entregue em</span>,
    cell: ({ row }) => {
      const raw = row.getValue("deliveredAt") as string | null;
      if (!raw) return <div className="flex justify-center">—</div>;
      return (
        <div className="flex justify-center">
          <span>{format(new Date(raw), "dd/MM/yyyy")}</span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <span className="flex justify-center">Ações</span>,
    cell: ({ row }) => {
      const navigate = useNavigate();
      const order = row.original;

      const handleCopyId = () => {
        navigator.clipboard.writeText(order.id);
        toast.success("ID do pedido copiado para a área de transferência!");
      };

      return (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="flex h-8 w-8 cursor-pointer items-center justify-center p-0"
                variant="ghost"
              >
                <span className="sr-only">Abrir menu de opções</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Opções</DropdownMenuLabel>

              <DropdownMenuItem
                onClick={() =>
                  navigate({
                    to: "/admin/orders/$orderId",
                    params: { orderId: order.id },
                  })
                }
              >
                <Eye />
                Ver detalhes
              </DropdownMenuItem>

              <DropdownMenuItem onClick={handleCopyId}>
                <Copy />
                Copiar ID
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

interface OrdersTableProps {
  layout?: "default" | "summary";
}

export function OrdersTable({ layout = "default" }: OrdersTableProps) {
  const navigate = useNavigate();

  const { allOrders, isAllOrdersLoading } = useOrder({
    enableAllOrdersQuery: true,
  });

  return (
    <Card>
      <CardHeader className="flex flex-col items-center gap-3 md:flex-row md:justify-between">
        <article className="flex flex-col gap-2">
          <CardTitle className="text-2xl">Pedidos</CardTitle>
          <CardDescription className="text-base">
            Visualize e acompanhe todos os pedidos realizados na sua loja.
          </CardDescription>
        </article>

        {layout === "summary" && (
          <CardAction className="w-full md:w-fit">
            <Button onClick={() => navigate({ to: "/admin/orders" })}>
              Ver todos
            </Button>
          </CardAction>
        )}
      </CardHeader>

      <CardContent>
        {isAllOrdersLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-muted-foreground">Carregando...</div>
          </div>
        ) : (
          <DataTable
            columns={ordersTableColumns}
            data={allOrders as OrderAdminSummaryDTO[]}
            filterableColumns={[
              {
                columnKey: "createdAt",
                title: "Data",
                type: "date",
              },
              {
                columnKey: "status",
                title: "Status",
                type: "select",
                options: Object.entries(orderStatusLabel).map(
                  ([key, label]) => ({ label, value: key }),
                ),
              },
            ]}
            searchableColumn={{
              key: "buyerName",
              placeholder: "Buscar por nome...",
            }}
          />
        )}
      </CardContent>
    </Card>
  );
}

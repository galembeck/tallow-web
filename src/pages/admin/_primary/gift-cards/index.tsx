import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { useGiftCard } from "@/hooks/services/use-gift-card";
import type { GiftCard, GiftCardStatus } from "@/types/services/gift-card";
import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const Route = createFileRoute("/admin/_primary/gift-cards/")({
  component: AdminGiftCardsPage,
  head: () => ({
    meta: [{ title: "Vales Presente | Terra & Tallow Admin" }],
  }),
});

function statusLabel(status: GiftCardStatus): string {
  const labels: Record<GiftCardStatus, string> = {
    PENDING: "Pendente",
    ACTIVE: "Ativo",
    USED: "Usado",
    EXPIRED: "Expirado",
    CANCELLED: "Cancelado",
  };
  return labels[status] ?? status;
}

function statusBadgeClass(status: GiftCardStatus): string {
  const classes: Record<GiftCardStatus, string> = {
    PENDING: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    ACTIVE: "bg-green-100 text-green-800 hover:bg-green-100",
    USED: "bg-gray-100 text-gray-600 hover:bg-gray-100",
    EXPIRED: "bg-red-100 text-red-700 hover:bg-red-100",
    CANCELLED: "bg-red-100 text-red-700 hover:bg-red-100",
  };
  return `uppercase font-bold ${classes[status] ?? ""}`;
}

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export const giftCardsTableColumns: ColumnDef<GiftCard>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => (
      <span className="font-mono text-xs text-amber-900 font-semibold">
        {(row.getValue("id") as string).slice(0, 8).toUpperCase()}
      </span>
    ),
  },
  {
    id: "buyer",
    header: () => <span>Comprador</span>,
    cell: ({ row }) => {
      const card = row.original;
      if (!card.buyerName && !card.buyerEmail) {
        return <span className="text-muted-foreground text-xs">—</span>;
      }
      return (
        <div className="flex flex-col">
          {card.buyerName && (
            <span className="font-medium text-sm">{card.buyerName}</span>
          )}
          {card.buyerEmail && (
            <span className="text-muted-foreground text-xs">
              {card.buyerEmail}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Valor" />
    ),
    cell: ({ row }) => (
      <span className="font-semibold text-amber-900">
        {formatBRL(row.getValue("amount"))}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: () => <span className="flex justify-center">Status</span>,
    cell: ({ row }) => {
      const status = row.getValue("status") as GiftCardStatus;
      return (
        <div className="flex justify-center">
          <Badge className={statusBadgeClass(status)}>
            {statusLabel(status)}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "purchasedAt",
    header: () => <span className="flex justify-center">Comprado em</span>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <span className="text-xs">
          {format(new Date(row.getValue("purchasedAt")), "dd/MM/yyyy")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "expiresAt",
    header: () => <span className="flex justify-center">Expira em</span>,
    cell: ({ row }) => {
      const expiresAt = row.getValue("expiresAt") as string;
      const date = new Date(expiresAt);
      const isExpired = date <= new Date();
      return (
        <div className="flex justify-center">
          <span
            className={`text-xs ${isExpired ? "text-red-500 font-semibold" : ""}`}
          >
            {format(date, "dd/MM/yyyy")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "usedAt",
    header: () => <span className="flex justify-center">Usado em</span>,
    cell: ({ row }) => {
      const usedAt = row.getValue("usedAt") as string | null | undefined;
      return (
        <div className="flex justify-center">
          {usedAt ? (
            <span className="text-xs">
              {format(new Date(usedAt), "dd/MM/yyyy")}
            </span>
          ) : (
            <span className="text-muted-foreground text-xs">—</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "usedOnOrderId",
    header: () => <span className="flex justify-center">Pedido vinculado</span>,
    cell: ({ row }) => {
      const orderId = row.getValue("usedOnOrderId") as string | null | undefined;
      return (
        <div className="flex justify-center">
          {orderId ? (
            <span className="font-mono text-xs text-amber-900">
              {orderId.slice(0, 8).toUpperCase()}...
            </span>
          ) : (
            <span className="text-muted-foreground text-xs">—</span>
          )}
        </div>
      );
    },
  },
];

function AdminGiftCardsPage() {
  const { allGiftCards, isAllCardsLoading } = useGiftCard({
    enableAllCardsQuery: true,
  });

  return (
    <main className="container space-y-8 p-4">
      <Card>
        <CardHeader className="flex flex-col items-center gap-3 md:flex-row md:justify-between">
          <article className="flex flex-col gap-2">
            <CardTitle className="text-2xl">Vales Presente</CardTitle>
            <CardDescription className="text-base">
              Gerencie todos os vales presentes emitidos.
            </CardDescription>
          </article>
        </CardHeader>

        <CardContent>
          {isAllCardsLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-muted-foreground">Carregando...</div>
            </div>
          ) : (
            <DataTable
              columns={giftCardsTableColumns}
              data={(allGiftCards ?? []) as GiftCard[]}
            />
          )}
        </CardContent>
      </Card>
    </main>
  );
}

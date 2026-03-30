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
import { usePayment } from "@/hooks/services/use-payment";
import { paymentMethodLabel } from "@/types/enums/payment-method";
import { paymentStatusLabel } from "@/types/enums/payment-status";
import type { PaymentAdminDTO } from "@/types/services/payment";
import { formatCurrency } from "@/utils/format-currency";
import { useNavigate } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Copy, ExternalLink, Eye, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

function paymentStatusVariant(
  status: string,
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "APPROVED":
      return "default";
    case "REJECTED":
    case "CANCELLED":
    case "CHARGED_BACK":
      return "destructive";
    default:
      return "secondary";
  }
}

export const paymentsTableColumns: ColumnDef<PaymentAdminDTO>[] = [
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
    accessorKey: "mercadoPagoPaymentId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID Mercado Pago" />
    ),
    cell: ({ row }) => (
      <span className="text-sm">
        {row.getValue("mercadoPagoPaymentId") ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "orderId",
    header: () => <span>Pedido</span>,
    cell: ({ row }) => {
      const navigate = useNavigate();
      const orderId = row.getValue("orderId") as string | null;
      if (!orderId) return <span>—</span>;
      return (
        <div className="flex items-center gap-1">
          <span className="max-w-24 truncate text-xs">{orderId}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 cursor-pointer"
            onClick={() =>
              navigate({ to: "/admin/orders/$orderId", params: { orderId } })
            }
          >
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      );
    },
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
      const status = row.getValue("status") as string;
      return (
        <div className="flex justify-center">
          <Badge variant={paymentStatusVariant(status)} className="uppercase">
            {paymentStatusLabel[status] ?? status}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "statusDetail",
    header: () => <span>Detalhe do status</span>,
    cell: ({ row }) => {
      const detail = row.getValue("statusDetail") as string | null;
      return <span className="text-sm uppercase">{detail ?? "—"}</span>;
    },
  },
  {
    accessorKey: "paymentMethod",
    header: ({ column }) => (
      <DataTableColumnSearch
        column={column}
        placeholder="Buscar por método..."
        title="Método"
      />
    ),
    cell: ({ row }) => {
      const method = row.getValue("paymentMethod") as string;
      return <span>{paymentMethodLabel[method] ?? method}</span>;
    },
  },
  {
    accessorKey: "transactionAmount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Valor" />
    ),
    cell: ({ row }) => {
      const amount = Number(row.getValue("transactionAmount"));
      return <span>{formatCurrency(amount)}</span>;
    },
  },
  {
    accessorKey: "installments",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Parcelas" />
    ),
    cell: ({ row }) => {
      const installments = row.getValue("installments") as number | null;
      return (
        <span>
          {installments && installments > 1 ? `${installments}x` : "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "payerName",
    header: ({ column }) => (
      <DataTableColumnSearch
        column={column}
        placeholder="Buscar por pagador..."
        title="Pagador"
      />
    ),
    cell: ({ row }) => {
      const name = row.getValue("payerName") as string | null;
      return <span>{name ?? "—"}</span>;
    },
  },
  {
    accessorKey: "payerDocument",
    header: ({ column }) => (
      <DataTableColumnSearch
        column={column}
        placeholder="Buscar por documento..."
        title="Documento"
      />
    ),
    cell: ({ row }) => {
      const doc = row.getValue("payerDocument") as string | null;
      return <span className="text-xs">{doc ?? "—"}</span>;
    },
  },
  {
    accessorKey: "dateCreated",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filterFn: "dateRange" as any,
    header: () => <span className="flex justify-center">Data de criação</span>,
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
    accessorKey: "dateApproved",
    header: () => (
      <span className="flex justify-center">Data de aprovação</span>
    ),
    cell: ({ row }) => {
      const raw = row.getValue("dateApproved") as string | null;
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
      const payment = row.original;

      const handleCopyId = () => {
        navigator.clipboard.writeText(payment.id);
        toast.success("ID do pagamento copiado para a área de transferência!");
      };

      const handleCopyMpId = () => {
        if (!payment.mercadoPagoPaymentId) return;
        navigator.clipboard.writeText(String(payment.mercadoPagoPaymentId));
        toast.success(
          "ID do Mercado Pago copiado para a área de transferência!",
        );
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
                    to: "/admin/payments/$paymentId",
                    params: { paymentId: payment.id },
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

              {payment.mercadoPagoPaymentId && (
                <DropdownMenuItem onClick={handleCopyMpId}>
                  <Copy />
                  Copiar ID (Mercado Pago)
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

interface PaymentsTableProps {
  layout?: "default" | "summary";
}

export function PaymentsTable({ layout = "default" }: PaymentsTableProps) {
  const navigate = useNavigate();

  const { allPayments, isAllPaymentsLoading } = usePayment({
    enableAllPaymentsQuery: true,
  });

  return (
    <Card>
      <CardHeader className="flex flex-col items-center gap-3 md:flex-row md:justify-between">
        <article className="flex flex-col gap-2">
          <CardTitle className="text-2xl">Pagamentos</CardTitle>
          <CardDescription className="text-base">
            Visualize e acompanhe todos os pagamentos processados na sua loja.
          </CardDescription>
        </article>

        {layout === "summary" && (
          <CardAction className="w-full md:w-fit">
            <Button onClick={() => navigate({ to: "/admin/payments" })}>
              Ver todos
            </Button>
          </CardAction>
        )}
      </CardHeader>

      <CardContent>
        {isAllPaymentsLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-muted-foreground">Carregando...</div>
          </div>
        ) : (
          <DataTable
            columns={paymentsTableColumns}
            data={allPayments as PaymentAdminDTO[]}
            filterableColumns={[
              {
                columnKey: "dateCreated",
                title: "Data",
                type: "date",
              },
              {
                columnKey: "status",
                title: "Status",
                type: "select",
                options: Object.entries(paymentStatusLabel).map(
                  ([key, label]) => ({ label, value: key }),
                ),
              },
              {
                columnKey: "paymentMethod",
                title: "Método",
                type: "select",
                options: Object.entries(paymentMethodLabel).map(
                  ([key, label]) => ({ label, value: key }),
                ),
              },
            ]}
            searchableColumn={{
              key: "id",
              placeholder: "Buscar por ID...",
            }}
          />
        )}
      </CardContent>
    </Card>
  );
}

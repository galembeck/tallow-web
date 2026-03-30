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
import { useUser } from "@/hooks/services/use-user";
import { ProfileType } from "@/types/enums/profile-type";
import type { User } from "@/types/services/user";
import { useNavigate } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Copy, ExternalLink, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

function profileTypeVariant(
  profileType: number,
): "default" | "secondary" | "outline" {
  return profileType === ProfileType.ADMIN ? "default" : "secondary";
}

function profileTypeLabel(profileType: number): string {
  return profileType === ProfileType.ADMIN ? "Admin" : "Cliente";
}

export const clientsTableColumns: ColumnDef<User>[] = [
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
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnSearch
        column={column}
        placeholder="Buscar por nome..."
        title="Cliente"
      />
    ),
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-sm">{user.name}</span>
          <span className="text-muted-foreground text-xs">{user.email}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "document",
    header: ({ column }) => (
      <DataTableColumnSearch
        column={column}
        placeholder="Buscar por CPF..."
        title="CPF"
      />
    ),
    cell: ({ row }) => (
      <span className="text-xs">{row.getValue("document") ?? "—"}</span>
    ),
  },
  {
    accessorKey: "cellphone",
    header: () => <span>Telefone</span>,
    cell: ({ row }) => (
      <span className="text-sm">{row.getValue("cellphone") ?? "—"}</span>
    ),
  },
  {
    accessorKey: "profileType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Perfil" />
    ),
    cell: ({ row }) => {
      const type = row.getValue("profileType") as number;
      return (
        <div className="flex justify-center">
          <Badge variant={profileTypeVariant(type)}>
            {profileTypeLabel(type)}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filterFn: "dateRange" as any,
    header: () => <span className="flex justify-center">Cadastrado em</span>,
    cell: ({ row }) => {
      const raw = row.getValue("createdAt") as string | null;
      if (!raw) return <div className="flex justify-center">—</div>;
      return (
        <div className="flex justify-center">
          <span>{format(new Date(raw), "dd/MM/yyyy")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "lastAccessAt",
    header: () => <span className="flex justify-center">Último acesso</span>,
    cell: ({ row }) => {
      const raw = row.getValue("lastAccessAt") as string | null;
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
      const user = row.original;
      const navigate = useNavigate();

      const handleCopyId = () => {
        navigator.clipboard.writeText(user.id);
        toast.success("ID do cliente copiado para a área de transferência!");
      };

      const handleCopyEmail = () => {
        navigator.clipboard.writeText(user.email);
        toast.success(
          "E-mail do cliente copiado para a área de transferência!",
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
                    to: "/admin/clients/$clientId",
                    params: { clientId: user.id },
                  })
                }
              >
                <ExternalLink />
                Ver detalhes
              </DropdownMenuItem>

              <DropdownMenuItem onClick={handleCopyId}>
                <Copy />
                Copiar ID
              </DropdownMenuItem>

              <DropdownMenuItem onClick={handleCopyEmail}>
                <Copy />
                Copiar e-mail
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

interface ClientsTableProps {
  layout?: "default" | "summary";
}

export function ClientsTable({ layout = "default" }: ClientsTableProps) {
  const navigate = useNavigate();

  const { clients, isClientsLoading: isAllUsersLoading } = useUser({
    enableClientsQuery: true,
  });
  const allUsers = clients;

  return (
    <Card>
      <CardHeader className="flex flex-col items-center gap-3 md:flex-row md:justify-between">
        <article className="flex flex-col gap-2">
          <CardTitle className="text-2xl">Clientes</CardTitle>
          <CardDescription className="text-base">
            Visualize e acompanhe todos os clientes cadastrados na sua loja.
          </CardDescription>
        </article>

        {layout === "summary" && (
          <CardAction className="w-full md:w-fit">
            <Button onClick={() => navigate({ to: "/admin/clients" })}>
              Ver todos
            </Button>
          </CardAction>
        )}
      </CardHeader>

      <CardContent>
        {isAllUsersLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-muted-foreground">Carregando...</div>
          </div>
        ) : (
          <DataTable
            columns={clientsTableColumns}
            data={allUsers as User[]}
            filterableColumns={[
              {
                columnKey: "createdAt",
                title: "Cadastro",
                type: "date",
              },
            ]}
            searchableColumn={{
              key: "name",
              placeholder: "Buscar por nome...",
            }}
          />
        )}
      </CardContent>
    </Card>
  );
}

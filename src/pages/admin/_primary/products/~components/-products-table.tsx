/* eslint-disable react-hooks/rules-of-hooks */

import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { DataTableColumnSearch } from "@/components/data-table-column-search";
import { DeleteConfirmation } from "@/components/delete-confirmation";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProduct } from "@/hooks/services/use-product";
import { ProductCategoryLabel } from "@/types/enums/product-category";
import type { Product } from "@/types/services/product";
import { useNavigate } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Copy, Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CreateProductModal } from "./-create-product-modal";
import { UpdateProductModal } from "./-update-product-modal";

export const productsTableColumns: ColumnDef<Product>[] = [
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

        <span>{row.getValue("id")}</span>
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
        title="Nome"
      />
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnSearch
        column={column}
        placeholder="Buscar por descrição..."
        title="Descrição"
      />
    ),
    cell: ({ row }) => {
      const description = (row.getValue("description") as string) || "";
      const truncated =
        description.length > 30
          ? `${description.slice(0, 30)}...`
          : description;
      return <div>{truncated}</div>;
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnSearch
        column={column}
        placeholder="Buscar por categoria..."
        title="Categoria"
      />
    ),
    cell: ({ row }) => {
      const category = row.getValue(
        "category",
      ) as unknown as keyof typeof ProductCategoryLabel;
      return (
        <div className="flex justify-center">
          <Badge className="font-semibold uppercase">
            {ProductCategoryLabel[category]}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Preço" />
    ),
    cell: ({ row }) => {
      const price = Number.parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(price);

      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "stockAmount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estoque" />
    ),
  },
  {
    accessorKey: "createdAt",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filterFn: "dateRange" as any,
    header: () => <span className="flex justify-center">Data de criação</span>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <span>
          {format(
            row.getValue("createdAt")
              ? new Date(
                  (row.getValue("createdAt") as string)
                    .split("/")
                    .reverse()
                    .join("-"),
                )
              : "",
            "dd/MM/yyyy",
          )}
        </span>
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <span className="flex justify-center">Ações</span>,
    cell: ({ row }) => {
      const product = row.original;

      const { deleteProduct } = useProduct();

      const [openConfirm, setOpenConfirm] = useState(false);
      const [openEdition, setOpenEdition] = useState(false);

      const handleCopyProductId = () => {
        navigator.clipboard.writeText(product.id);
        toast.success("ID do produto copiado para a área de transferência!");
      };

      const navigate = useNavigate();

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

              <DropdownMenuItem onClick={handleCopyProductId}>
                <Copy />
                Copiar ID
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() =>
                  navigate({
                    to: `/admin/products/$productId`,
                    params: { productId: product.id },
                  })
                }
              >
                <Eye />
                Exibir detalhes
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpenEdition(true);
                }}
              >
                <Edit />
                <p>Editar informações</p>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpenConfirm(true);
                }}
              >
                <Trash2 className="text-red-500" />
                <p className="text-red-500 hover:text-red-500/80">Excluir</p>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <UpdateProductModal
            onOpenChange={setOpenEdition}
            open={openEdition}
            product={product}
          />

          <DeleteConfirmation
            onClick={() => deleteProduct(product.id)}
            onOpenChange={setOpenConfirm}
            open={openConfirm}
            title="Deseja excluir o produto?"
            description="Ao confirmar, o produto será removido do seu catálogo e todas as cobranças que utilizam esse produto serão canceladas. Tem certeza que deseja continuar?"
          />
        </div>
      );
    },
  },
];

interface ProductsTableProps {
  layout?: "default" | "summary";
}

export function ProductsTable({ layout = "default" }: ProductsTableProps) {
  const navigate = useNavigate();

  const { products, isLoading } = useProduct();

  return (
    <Card>
      <CardHeader className="flex flex-col items-center gap-3 md:flex-row md:justify-between">
        <article className="flex flex-col gap-2">
          <CardTitle className="text-2xl">Produtos</CardTitle>
          <CardDescription className="text-base">
            Crie, visualize e gerencie os produtos de sua loja através do botão
            ao lado e a tabela abaixo, respectivamente.
          </CardDescription>
        </article>

        <CardAction className="w-full md:w-fit">
          {layout === "summary" ? (
            <Button onClick={() => navigate({ to: "/admin/products" })}>
              Ver todos
            </Button>
          ) : (
            <CreateProductModal />
          )}
        </CardAction>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-muted-foreground">Carregando...</div>
          </div>
        ) : (
          <DataTable
            columns={productsTableColumns}
            data={(products || []) as Product[]}
            filterableColumns={[
              {
                columnKey: "createdAt",
                title: "Data",
                type: "date",
              },
              {
                columnKey: "category",
                title: "Categoria",
                type: "select",
                options: Object.entries(ProductCategoryLabel).map(
                  ([key, label]) => ({
                    label,
                    value: key,
                  }),
                ),
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

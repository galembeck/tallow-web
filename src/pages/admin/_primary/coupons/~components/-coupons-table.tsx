/* eslint-disable react-hooks/rules-of-hooks */

import { DataTableColumnHeader } from "@/components/data-table-column-header";
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
import { DataTable } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCoupon } from "@/hooks/services/use-coupon";
import type { Coupon } from "@/types/services/coupon";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Copy, Edit, MoreHorizontal, ToggleLeft, ToggleRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CreateCouponModal } from "./-create-coupon-modal";
import { UpdateCouponModal } from "./-update-coupon-modal";

export const couponsTableColumns: ColumnDef<Coupon>[] = [
  {
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Código" />
    ),
    cell: ({ row }) => (
      <span className="font-mono font-semibold text-amber-900">
        {row.getValue("code")}
      </span>
    ),
  },
  {
    accessorKey: "discountPercentage",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Desconto" />
    ),
    cell: ({ row }) => (
      <span className="font-semibold">
        {Number(row.getValue("discountPercentage")).toFixed(0)}%
      </span>
    ),
  },
  {
    accessorKey: "isActive",
    header: () => <span className="flex justify-center">Status</span>,
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean;
      return (
        <div className="flex justify-center">
          <Badge
            className={
              isActive
                ? "bg-green-100 text-green-800 hover:bg-green-100"
                : "bg-gray-100 text-gray-600 hover:bg-gray-100"
            }
          >
            {isActive ? "Ativo" : "Inativo"}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: () => <span className="flex justify-center">Criado em</span>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <span>
          {format(new Date(row.getValue("createdAt")), "dd/MM/yyyy")}
        </span>
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <span className="flex justify-center">Ações</span>,
    cell: ({ row }) => {
      const coupon = row.original;

      const { toggleCoupon, isToggling } = useCoupon();

      const [openEdition, setOpenEdition] = useState(false);

      const handleCopyCode = () => {
        navigator.clipboard.writeText(coupon.code);
        toast.success("Código copiado para a área de transferência!");
      };

      const handleToggle = async () => {
        try {
          await toggleCoupon(coupon.id);
          toast.success(
            coupon.isActive
              ? "Cupom desativado com sucesso!"
              : "Cupom ativado com sucesso!",
          );
        } catch {
          toast.error("Erro ao alterar status do cupom.");
        }
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

              <DropdownMenuItem onClick={handleCopyCode}>
                <Copy />
                Copiar código
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpenEdition(true);
                }}
              >
                <Edit />
                Editar cupom
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleToggle}
                disabled={isToggling}
              >
                {coupon.isActive ? (
                  <>
                    <ToggleLeft className="text-orange-500" />
                    <p className="text-orange-500">Desativar</p>
                  </>
                ) : (
                  <>
                    <ToggleRight className="text-green-600" />
                    <p className="text-green-600">Ativar</p>
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <UpdateCouponModal
            coupon={coupon}
            onOpenChange={setOpenEdition}
            open={openEdition}
          />
        </div>
      );
    },
  },
];

export function CouponsTable() {
  const { coupons, isLoading } = useCoupon();

  return (
    <Card>
      <CardHeader className="flex flex-col items-center gap-3 md:flex-row md:justify-between">
        <article className="flex flex-col gap-2">
          <CardTitle className="text-2xl">Cupons de Desconto</CardTitle>
          <CardDescription className="text-base">
            Crie e gerencie cupons de desconto para seus clientes.
          </CardDescription>
        </article>

        <CardAction className="w-full md:w-fit">
          <CreateCouponModal />
        </CardAction>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-muted-foreground">Carregando...</div>
          </div>
        ) : (
          <DataTable
            columns={couponsTableColumns}
            data={(coupons || []) as Coupon[]}
            searchableColumn={{
              key: "code",
              placeholder: "Buscar por código...",
            }}
          />
        )}
      </CardContent>
    </Card>
  );
}

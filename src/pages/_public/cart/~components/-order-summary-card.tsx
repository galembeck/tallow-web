import { useNavigate } from "@tanstack/react-router";
import { Info, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCart } from "@/hooks/services/use-cart";
import { toast } from "sonner";
import { useState } from "react";
import { ClearConfirmationModal } from "./-clear-confirmation-modal";

interface OrderSummaryCardProps {
  totalAmount: number;
}

export function OrderSummaryCard({ totalAmount }: OrderSummaryCardProps) {
  const navigate = useNavigate();

  const { clearCart } = useCart();

  const [isClearingModalOpen, setIsClearingModalOpen] = useState(false);

  const handleClearCart = async () => {
    try {
      await clearCart();

      setIsClearingModalOpen(false);

      toast.success("Carrinho esvaziado com sucesso!");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error(
        "Ocorreu um erro ao esvaziar o carrinho, tente novamente mais tarde.",
      );
    }
  };

  return (
    <div className="lg:col-span-1">
      <div className="sticky top-24 rounded-lg bg-white p-4 shadow-lg flex flex-col justify-center">
        <h2 className="mb-6 font-semibold text-2xl text-gray-900">
          Resumo do pedido
        </h2>

        <div className="mb-6 space-y-3 border-b pb-6">
          <div className="flex justify-between text-gray-600">
            <span className="font-medium">Subtotal</span>
            <span>R$ {totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span className="flex items-center gap-1.5 font-medium">
              Frete
              <Tooltip>
                <TooltipTrigger asChild className="cursor-help">
                  <Info className="size-4" />
                </TooltipTrigger>

                <TooltipContent>
                  <p>
                    O valor do frete é calculado durante o checkout de sua
                    compra.
                    <br />
                    Ele é baseado no endereço de entrega e nas opções de envio
                    disponíveis.
                  </p>
                </TooltipContent>
              </Tooltip>
            </span>
            <span>Calculado no checkout</span>
          </div>
        </div>

        <div className="mb-6 flex justify-between text-xl">
          <span className="font-medium text-gray-900">Total</span>
          <span className="text-amber-900">R$ {totalAmount.toFixed(2)}</span>
        </div>

        <Button
          className="mb-4 w-full cursor-pointer rounded-lg bg-amber-900 py-5! text-base text-white transition-colors hover:bg-amber-800"
          onClick={() => navigate({ to: "/checkout" })}
        >
          Finalizar compra
        </Button>

        <Button
          className="w-full cursor-pointer py-5! text-center text-amber-900 text-base"
          onClick={() => navigate({ to: "/products" })}
          variant="secondary"
        >
          Continuar comprando
        </Button>

        <Button
          variant="link"
          className="text-red-500 hover:underline mt-2"
          onClick={() => setIsClearingModalOpen(true)}
        >
          <Trash2 className="size-4" />
          Esvaziar carrinho
        </Button>
      </div>

      <ClearConfirmationModal
        open={isClearingModalOpen}
        onOpenChange={setIsClearingModalOpen}
        onConfirm={handleClearCart}
      />
    </div>
  );
}

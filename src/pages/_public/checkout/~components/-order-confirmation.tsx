import { useNavigate } from "@tanstack/react-router";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderConfirmationProps {
  orderNumber: string | null;
}

export function OrderConfirmation({ orderNumber }: OrderConfirmationProps) {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-2xl rounded-lg bg-white p-12 text-center shadow-lg">
        <CheckCircle className="mx-auto mb-6 h-20 w-20 text-green-500" />

        <h2 className="mb-4 font-semibold text-4xl text-amber-900 uppercase">
          Pedido confirmado!
        </h2>

        <p className="mb-8 text-gray-600 text-xl">
          Obrigado pela sua compra! Você receberá os detalhes de seu pedido em
          breve.
        </p>

        <div className="mb-8 rounded-lg bg-amber-50 p-6">
          <p className="mb-2 text-gray-700">Nº do pedido:</p>
          <p className="font-semibold text-2xl text-amber-900">{orderNumber}</p>
        </div>

        <Button
          className="cursor-pointer bg-amber-900 font-medium text-white uppercase hover:bg-amber-900/90 hover:text-white"
          onClick={() => navigate({ to: "/products" })}
          // TODO: Navegar para página de "meus pedidos" quando concluída
          size="lg"
        >
          Continuar comprando
        </Button>
      </div>
    </div>
  );
}

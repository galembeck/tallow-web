import { LeaveConfirmation } from "@/components/leave-confirmation";
import { Button } from "@/components/ui/button";
import type { Cart } from "@/types/services/cart";
import { ArrowLeft } from "lucide-react";

interface OrderSummaryProps {
  cart?: Cart;
  shippingCost: number;
}

export function OrderSummary({ cart, shippingCost }: OrderSummaryProps) {
  const subtotal = cart?.totalAmount ?? 0;
  const total = subtotal + shippingCost;

  return (
    <aside className="lg:col-span-1">
      <div className="sticky top-24 rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-6 font-medium text-2xl text-gray-900">
          Resumo do pedido
        </h2>

        <div className="mb-6 space-y-4 border-b pb-6">
          {cart?.items.map((item) => (
            <div className="flex gap-3" key={item.id}>
              {/** biome-ignore lint/correctness/useImageSize: sized by @TailwindCSS */}
              <img
                alt={item.productName}
                className="h-16 w-16 rounded bg-gray-100 object-cover"
                src={item.productImageUrl}
              />

              <div className="flex-1">
                <p className="font-medium text-gray-900 text-sm">
                  {item.productName}
                </p>

                <p className="text-gray-500 text-sm">
                  Quantidade: {item.quantity}
                </p>

                <p className="font-medium text-amber-900 text-sm">
                  R$ {(item.unitPrice * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-6 space-y-3">
          <div className="flex justify-between font-medium text-gray-600">
            <span>Subtotal</span>
            <span>R$ {subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between font-medium text-gray-600">
            <span>Frete</span>
            <span>R$ {shippingCost.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex justify-between border-t py-6 text-xl">
          <span className="font-medium">Total</span>
          <span className="font-semibold text-amber-900">
            R$ {total.toFixed(2)}
          </span>
        </div>

        <LeaveConfirmation navigateTo="/cart">
          <Button className="w-full cursor-pointer" variant="outline">
            <ArrowLeft />
            Voltar
          </Button>
        </LeaveConfirmation>
      </div>
    </aside>
  );
}

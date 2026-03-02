import type { Cart } from "@/types/services/cart";

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
        <h2 className="mb-6 text-2xl text-gray-900">Resumo do Pedido</h2>

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
                <p className="text-gray-900 text-sm">{item.productName}</p>
                <p className="text-gray-500 text-sm">Qtd: {item.quantity}</p>
                <p className="text-amber-900 text-sm">
                  R$ {(item.unitPrice * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-6 space-y-3">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>R$ {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Frete</span>
            <span>R$ {shippingCost.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex justify-between border-t pt-6 text-xl">
          <span>Total</span>
          <span className="text-amber-900">R$ {total.toFixed(2)}</span>
        </div>
      </div>
    </aside>
  );
}

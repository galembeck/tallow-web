import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Cart } from "@/types/services/cart";
import type { ShippingInformation } from "@/types/services/shipping";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle, MapPin, ShoppingCart, Truck } from "lucide-react";

interface OrderConfirmationProps {
  orderNumber: string | null;
  userInformation?: {
    name?: string;
    email?: string;
    cellphone?: string;
    address?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    zipcode?: string;
  };
  cart?: Cart;
  shippingOption?: ShippingInformation;
}

export function OrderConfirmation({
  orderNumber,
  userInformation,
  cart,
  shippingOption,
}: OrderConfirmationProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center bg-gray-50 px-4 py-10">
      <article className="flex flex-col gap-4">
        <h1 className="font-semibold text-3xl text-amber-900">
          Obrigado pelo seu pedido!
        </h1>

        <p className="text-gray-600">
          Você receberá uma confirmação por e-mail em breve em{" "}
          <strong>{userInformation?.email}</strong>
        </p>
      </article>

      <div className="max-w-2xl rounded-xl bg-white p-12 text-center shadow-xl mt-6 flex flex-col gap-10">
        <div className="flex flex-col">
          <CheckCircle className="mx-auto mb-6 h-20 w-20 text-green-500" />

          <h2 className="mb-4 font-semibold text-4xl text-amber-900 uppercase">
            Pedido confirmado!
          </h2>

          <p className="text-lg font-semibold text-gray-800">
            Seu pedido já está sendo processado e, em breve, você receberá um
            e-mail com a confirmação da compra e os detalhes de seu pedido.
          </p>
        </div>

        <Separator />

        <article className="flex flex-col gap-1">
          <p className="text-lg">
            Nº do pedido: <strong className="text-xl">{orderNumber}</strong>
          </p>

          <p className="text-lg">
            Data do pedido: {new Date().toLocaleDateString()}
          </p>
        </article>

        <div className="flex flex-col bg-white rounded-lg border border-muted-foreground/30">
          {cart?.items.map((item) => (
            <div
              className="bg-gray-light flex items-center justify-between text-sm p-3 first:rounded-t-lg"
              key={item.id}
            >
              <img
                src={item.productImageUrl}
                alt={item.productName}
                className="w-8 h-8 object-cover"
              />

              <p>{item.quantity}x</p>

              <p>{item.productName}</p>

              <p className="text-amber-900/80">
                R$ {item.unitPrice.toFixed(2)}
              </p>
            </div>
          ))}

          <div className="px-2 py-4 border-y border-muted-foreground/20">
            <article className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-gray-600/80" />
                <p className="text-xs font-semibold text-gray-600/80">
                  {cart?.totalItems}x PRODUTO(S) - SUBTOTAL
                </p>
              </div>

              <span className="text-amber-900/80 font-semibold text-sm">
                R$ {cart?.totalAmount.toFixed(2)}
              </span>
            </article>
          </div>

          <div className="px-2 py-4 border-y border-muted-foreground/20">
            <article className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-gray-600/80" />
                <p className="text-xs font-semibold text-gray-600/80">FRETE</p>
              </div>

              <span className="text-gray-600/80 font-semibold text-sm">
                R$ {shippingOption?.price.toFixed(2)}
              </span>
            </article>
          </div>

          <div className="bg-gray-light px-2 py-4 text-sm p-3 rounded-b-lg">
            <article className="flex items-center justify-between">
              <p className="font-bold text-amber-900">TOTAL A PAGAR</p>

              <span className="text-amber-900 font-bold text-xl">
                R${" "}
                {(
                  (cart?.totalAmount ?? 0) + (shippingOption?.price ?? 0)
                ).toFixed(2)}
              </span>
            </article>
          </div>
        </div>

        <div className="bg-white border border-muted-foreground/30 p-4 flex items-center gap-4">
          <MapPin className="w-8 h-8" />

          <div className="flex flex-col gap-4 text-left">
            <p className="text-xl font-semibold">
              Previsão de Entrega: {shippingOption?.deliveryTimeLabel}
            </p>

            <article className="flex flex-col">
              <p>
                <strong>{userInformation?.name}</strong> | +55
                {userInformation?.cellphone}
              </p>

              <p>
                {userInformation?.address}, {userInformation?.number}{" "}
                {userInformation?.complement !== null
                  ? ` - ${userInformation?.complement}`
                  : null}
              </p>

              <p>{userInformation?.neighborhood}</p>

              <p>
                {userInformation?.city} - {userInformation?.state},{" "}
                {userInformation?.zipcode}
              </p>
            </article>
          </div>
        </div>

        <Button
          className="cursor-pointer bg-amber-900 font-medium text-white uppercase hover:bg-amber-900/90 hover:text-white"
          onClick={() => navigate({ to: "/products" })}
          size="lg"
        >
          Continuar comprando
        </Button>
      </div>
    </div>
  );
}

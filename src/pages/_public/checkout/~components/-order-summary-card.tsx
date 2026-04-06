import { LeaveConfirmation } from "@/components/leave-confirmation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useCoupon } from "@/hooks/services/use-coupon";
import type { Cart } from "@/types/services/cart";
import type { CouponValidateResponse } from "@/types/services/coupon";
import { ArrowLeft, Check, Tag, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface OrderSummaryProps {
  cart?: Cart;
  shippingCost: number;
  onCouponApplied?: (coupon: CouponValidateResponse | null) => void;
  appliedCoupon?: CouponValidateResponse | null;
}

export function OrderSummary({
  cart,
  shippingCost,
  onCouponApplied,
  appliedCoupon,
}: OrderSummaryProps) {
  const subtotal = cart?.totalAmount ?? 0;
  const { validateCoupon, isValidating } = useCoupon();

  const [couponInput, setCouponInput] = useState("");

  const discountAmount =
    appliedCoupon?.isValid && appliedCoupon.discountPercentage
      ? Math.round(subtotal * (appliedCoupon.discountPercentage / 100) * 100) /
        100
      : 0;

  const total = subtotal + shippingCost - discountAmount;

  const handleApplyCoupon = async () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    try {
      const result = await validateCoupon(code);
      if (result.isValid) {
        onCouponApplied?.(result);
        toast.success(
          `Cupom "${result.code}" aplicado! ${result.discountPercentage}% de desconto.`,
        );
      } else {
        toast.error(result.message ?? "Cupom inválido ou inativo.");
        onCouponApplied?.(null);
      }
    } catch {
      toast.error("Erro ao validar o cupom.");
    }
  };

  const handleRemoveCoupon = () => {
    setCouponInput("");
    onCouponApplied?.(null);
  };

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

        {/* Coupon input */}
        <div className="mb-4">
          {appliedCoupon?.isValid ? (
            <div className="flex items-center justify-between rounded-lg bg-green-50 border border-green-200 px-3 py-2">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-green-700" />
                <div>
                  <p className="text-sm font-semibold text-green-800">
                    {appliedCoupon.code}
                  </p>
                  <p className="text-xs text-green-600">
                    {appliedCoupon.discountPercentage}% de desconto aplicado
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveCoupon}
                className="text-green-700 hover:text-green-900 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                placeholder="Código do cupom"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleApplyCoupon();
                  }
                }}
                className="text-sm"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleApplyCoupon}
                disabled={isValidating || !couponInput.trim()}
                className="shrink-0 border-amber-900/40 text-amber-900 hover:bg-amber-900/5 hover:text-amber-900"
              >
                {isValidating ? (
                  <Spinner className="size-4" />
                ) : (
                  <Check className="size-4" />
                )}
              </Button>
            </div>
          )}
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

          {discountAmount > 0 && (
            <div className="flex justify-between font-medium text-green-700">
              <span className="flex items-center gap-1">
                <Tag className="h-3.5 w-3.5" />
                Desconto
              </span>
              <span>- R$ {discountAmount.toFixed(2)}</span>
            </div>
          )}
        </div>

        <div className="flex justify-between border-t py-6 text-xl">
          <span className="font-medium">Total</span>
          <div className="flex flex-col items-end">
            {discountAmount > 0 && (
              <span className="text-sm line-through text-gray-400">
                R$ {(subtotal + shippingCost).toFixed(2)}
              </span>
            )}
            <span
              className={`font-semibold ${discountAmount > 0 ? "text-green-700" : "text-amber-900"}`}
            >
              R$ {total.toFixed(2)}
            </span>
          </div>
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

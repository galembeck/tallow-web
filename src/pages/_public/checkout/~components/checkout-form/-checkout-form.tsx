import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import {
  type CheckoutFormData,
  checkoutFormSchema,
  shippingFields,
} from "@/constants/checkout";
import { useCart } from "@/hooks/services/use-cart";
import { OrderSummary } from "../-order-summary-card";
import { PaymentStep } from "./checkout-form-steps/-payment-form-step";
import { ShippingFormStep } from "./checkout-form-steps/-shipping-form-step";

export function CheckoutForm() {
  const navigate = useNavigate();
  const { cart, isLoading, clearCart, isClearingCart } = useCart({
    enableCartQuery: true,
  });

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [orderNumber, setOrderNumber] = useState("");

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      cellphone: "",
      zipcode: "",
      address: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      cardNumber: "",
      cardHolderName: "",
      cardExpirationDate: "",
      cardCvv: "",
    },
  });

  useEffect(() => {
    if (!isLoading && step !== 3 && (!cart || cart.items.length === 0)) {
      navigate({ to: "/products", replace: true });
    }
  }, [isLoading, step, cart, navigate]);

  const handleNextStep = async () => {
    const valid = await form.trigger(shippingFields);
    if (!valid) {
      return;
    }
    setStep(2);
  };

  const onSubmit = async (_values: CheckoutFormData) => {
    setOrderNumber(`TW-${Math.floor(Math.random() * 1_000_000)}`);
    setStep(3);
    await clearCart();
  };

  if (isLoading) {
    return <div className="p-8">Carregando checkout...</div>;
  }

  if (step === 3) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
        <div className="max-w-2xl rounded-lg bg-white p-12 text-center shadow-lg">
          <CheckCircle className="mx-auto mb-6 h-20 w-20 text-green-500" />
          <h2 className="mb-4 text-4xl text-amber-900">Pedido Confirmado!</h2>
          <p className="mb-8 text-gray-600 text-xl">
            Obrigado pela sua compra! Você receberá os detalhes em breve.
          </p>
          <div className="mb-8 rounded-lg bg-amber-50 p-6">
            <p className="mb-2 text-gray-700">Número do Pedido:</p>
            <p className="text-2xl text-amber-900">#{orderNumber}</p>
          </div>
          <Button onClick={() => navigate({ to: "/products" })}>
            Continuar comprando
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="container mx-auto max-w-6xl">
        <h1 className="mb-8 text-4xl text-amber-900">Finalizar Compra</h1>

        <Progress className="mb-10" value={(step / 3) * 100} />

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Form {...form}>
              <form
                className="space-y-6"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                {step === 1 && (
                  <ShippingFormStep form={form} onNext={handleNextStep} />
                )}

                {step === 2 && (
                  <PaymentStep
                    form={form}
                    isClearingCart={isClearingCart}
                    onBack={() => setStep(1)}
                  />
                )}
              </form>
            </Form>
          </div>

          <OrderSummary cart={cart} shippingCost={15} />
        </div>
      </div>
    </main>
  );
}

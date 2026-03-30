import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import {
  type CheckoutFormData,
  checkoutFormSchema,
} from "@/constants/checkout";
import { useAuth } from "@/hooks/services/use-auth";
import { useCart } from "@/hooks/services/use-cart";
import { useCheckout } from "@/hooks/use-checkout";
import { useCheckoutSteps } from "@/hooks/use-checkout-steps";
import type { PaymentResponseDTO } from "@/types/services/payment";
import { OrderConfirmation } from "../-order-confirmation";
import { OrderSummary } from "../-order-summary-card";
import { PaymentPending } from "../-payment-pending";
import { PaymentFormStep } from "./checkout-form-steps/-payment-form-step";
import { PersonalFormStep } from "./checkout-form-steps/-personal-form-step";
import { ShippingFormStep } from "./checkout-form-steps/-shipping-form-step";

export function CheckoutForm() {
  const navigate = useNavigate();

  const { user } = useAuth();
  const { cart, isLoading } = useCart({
    enableCartQuery: true,
  });

  const [pendingPayment, setPendingPayment] =
    useState<PaymentResponseDTO | null>(null);

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      document: "",
      cellphone: "",
      zipcode: "",
      address: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
    },
  });

  const {
    step,
    goToStep,
    handleNextStep,
    selectedShippingOption,
    setSelectedShippingOption,
  } = useCheckoutSteps(form);

  const shippingCost = selectedShippingOption?.price ?? 0;

  const { isProcessing, handleCreateOrder, handleProcessPayment, orderId, clearCart } =
    useCheckout(form, {
      shippingCost,
      onOrderCreated: () => goToStep(3),
      onPaymentSuccess: () => goToStep(4),
      onPaymentPending: (payment) => setPendingPayment(payment),
    });

  useEffect(() => {
    if (!user) {
      return;
    }

    form.setValue("name", user.name, { shouldValidate: true });
    form.setValue("email", user.email, { shouldValidate: true });
    form.setValue("document", user.document ?? "", { shouldValidate: true });
    form.setValue("cellphone", user.cellphone ?? "", { shouldValidate: true });
  }, [user, form]);

  useEffect(() => {
    if (!isLoading && step !== 4 && (!cart || cart.items.length === 0)) {
      navigate({ to: "/products", replace: true });
    }
  }, [isLoading, step, cart, navigate]);

  if (isLoading) {
    return (
      <div className="flex h-80 cursor-pointer flex-col items-center justify-center gap-4 p-6">
        <div className="h-12 w-12 animate-spin rounded-full border-amber-900 border-b-2" />
        <p className="text-gray-500">Carregando checkout...</p>
      </div>
    );
  }

  if (pendingPayment) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="container mx-auto max-w-2xl">
          <h1 className="mb-8 font-semibold text-4xl text-amber-900">
            Finalizar compra
          </h1>
          <PaymentPending
            payment={pendingPayment}
            onApproved={async () => {
              await clearCart();
              setPendingPayment(null);
              goToStep(4);
            }}
          />
        </div>
      </main>
    );
  }

  if (step === 4) {
    return <OrderConfirmation orderNumber={orderId} />;
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="container mx-auto max-w-6xl">
        <h1 className="mb-8 font-semibold text-4xl text-amber-900">
          Finalizar compra
        </h1>

        <Progress className="mb-10" value={(step / 3) * 100} />

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Form {...form}>
              <form
                className="space-y-6"
                onSubmit={(event) => event.preventDefault()}
              >
                {step === 1 && (
                  <PersonalFormStep form={form} onNext={handleNextStep} />
                )}

                {step === 2 && (
                  <ShippingFormStep
                    form={form}
                    onCreateOrder={() =>
                      handleCreateOrder(selectedShippingOption)
                    }
                    onShippingSelect={setSelectedShippingOption}
                  />
                )}

                {step === 3 && (
                  <PaymentFormStep
                    amount={Math.round(((cart?.totalAmount ?? 0) + shippingCost) * 100) / 100}
                    onSubmitPayment={handleProcessPayment}
                  />
                )}

                {isProcessing && (
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Spinner className="size-4" />
                    <span>
                      {isProcessing ? "Processando..." : "Criando pedido..."}
                    </span>
                  </div>
                )}
              </form>
            </Form>
          </div>

          <OrderSummary cart={cart} shippingCost={shippingCost} />
        </div>
      </div>
    </main>
  );
}

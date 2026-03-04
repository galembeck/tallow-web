import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
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
import { OrderSummary } from "../-order-summary-card";
import { PaymentFormStep } from "./checkout-form-steps/-payment-form-step";
import { PersonalFormStep } from "./checkout-form-steps/-personal-form-step";
import { ShippingFormStep } from "./checkout-form-steps/-shipping-form-step";

export function CheckoutForm() {
  const navigate = useNavigate();

  const { user } = useAuth();
  const { cart, isLoading } = useCart({
    enableCartQuery: true,
  });

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

  const { isProcessing, isCreatingOrder, handleCreateOrder } = useCheckout(
    form,
    { onOrderCreated: () => goToStep(3) },
  );
  const {
    step,
    goToStep,
    handleNextStep,
    selectedShippingOption,
    setSelectedShippingOption,
  } = useCheckoutSteps(form);

  const shippingCost = selectedShippingOption?.price ?? 0;

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

  if (step === 4) {
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
            {/* <p className="text-2xl text-amber-900">#{orderNumber}</p> */}
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
        <h1 className="mb-8 font-semibold text-4xl text-amber-900">
          Finalizar compra
        </h1>

        <Progress className="mb-10" value={(step / 4) * 100} />

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
                    handleCreateOrder={() =>
                      handleCreateOrder(selectedShippingOption)
                    }
                    onShippingSelect={setSelectedShippingOption}
                  />
                )}

                {step === 3 && (
                  <PaymentFormStep
                    amount={(cart?.totalAmount ?? 0) + shippingCost}
                    onSubmitPayment={async () => {
                      // TODO: passa onSubmitPayment real quando pagamento for implementado
                    }}
                  />
                )}

                {isProcessing && (
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Spinner className="size-4" />
                    <span>
                      {isCreatingOrder ? "Criando pedido..." : "Processando..."}
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

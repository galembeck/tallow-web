import { Payment } from "@mercadopago/sdk-react";
import { CreditCard } from "lucide-react";
import { toast } from "sonner";

interface PaymentFormStepProps {
  amount: number;
  preferenceId?: string;
  onSubmitPayment: (payload: {
    selectedPaymentMethod?: string;
    formData: unknown;
  }) => Promise<void>;
}

export function PaymentFormStep({
  amount,
  preferenceId,
  onSubmitPayment,
}: PaymentFormStepProps) {
  return (
    <div className="rounded-lg bg-white px-6 pt-6 shadow-md">
      <h2 className="flex items-center gap-2 font-medium text-2xl text-gray-900">
        <CreditCard className="size-6 text-amber-900" />
        Dados de pagamento
      </h2>

      <Payment
        customization={{
          visual: {
            hideFormTitle: true,
            style: { theme: "default" },
          },
          paymentMethods: {
            creditCard: "all",
            ticket: "all",
            bankTransfer: "all",
            maxInstallments: 6,
          },
        }}
        initialization={{
          amount,
          preferenceId,
          payer: {
            firstName: "",
            lastName: "",
            email: "",
          },
        }}
        onError={(_error) => {
          toast.error(
            "Ops! Ocorreu um erro ao carregar o formulário de pagamento.",
            {
              description:
                "Tente novamente mais tarde ou entre em contato com o suporte.",
            },
          );
        }}
        // biome-ignore lint/suspicious/noEmptyBlockStatements: required by @mercadopago/sdk-react
        onReady={() => {}}
        onSubmit={async ({ selectedPaymentMethod, formData }) => {
          await onSubmitPayment({ selectedPaymentMethod, formData });
        }}
      />
    </div>
  );
}

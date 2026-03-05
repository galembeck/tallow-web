// -payment-form-step.tsx

import { Payment } from "@mercadopago/sdk-react";
import { CreditCard } from "lucide-react";
import { toast } from "sonner";
import type { PaymentBrickSubmitData } from "@/types/services/payment";

interface PaymentFormStepProps {
  amount: number;
  preferenceId?: string;
  onSubmitPayment: (data: PaymentBrickSubmitData) => Promise<void>;
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
        onError={(error) => {
          console.error("❌ Erro no Payment Brick:", error);
          toast.error(
            "Ops! Ocorreu um erro ao carregar o formulário de pagamento.",
            {
              description:
                "Tente novamente mais tarde ou entre em contato com o suporte.",
            },
          );
        }}
        onReady={() => {
          console.log("✅ Payment Brick carregado com sucesso!");
        }}
        onSubmit={async (data) => {
          console.log("🎯 Payment Brick onSubmit disparado!");
          console.log("📦 Dados brutos do Payment Brick:", data);

          // ✅ Validação antes de enviar
          const submitData = data as unknown as PaymentBrickSubmitData;

          console.log("📦 Dados convertidos:", {
            selectedPaymentMethod: submitData.selectedPaymentMethod,
            formData: submitData.formData,
          });

          // ✅ Validação adicional
          if (!submitData.formData) {
            console.error("❌ formData está undefined!");
            toast.error("Erro ao processar dados do pagamento", {
              description: "Por favor, tente preencher o formulário novamente.",
            });
            return;
          }

          await onSubmitPayment(submitData);
        }}
      />
    </div>
  );
}

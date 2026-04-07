import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/services/use-auth";
import { usePayment } from "@/hooks/services/use-payment";
import {
  type GiftCardCheckoutFormData,
  useGiftCardCheckout,
} from "@/hooks/use-gift-card-checkout";
import { cookies } from "@/lib/cookies";
import { PaymentFormStep } from "@/pages/_public/checkout/~components/checkout-form/checkout-form-steps/-payment-form-step";
import type { PaymentResponseDTO } from "@/types/services/payment";
import { formatCPF, formatWhatsApp, removeFormat } from "@/utils/format-masks";
import { isValidCPF } from "@/utils/is-valid-masks";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { CheckCircle2, Copy, ExternalLink, Gift, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

// ─── Route ──────────────────────────────────────────────────────────────────

const searchSchema = z.object({
  amount: z.number().positive(),
});

export const Route = createFileRoute("/_public/gift-card-checkout/")({
  component: GiftCardCheckoutPage,
  validateSearch: searchSchema,
  head: () => ({
    meta: [{ title: "Comprar Vale Presente | Terra & Tallow" }],
  }),
  beforeLoad: ({ location }) => {
    const token = cookies.get("AccessToken");
    if (!token) {
      throw redirect({ to: "/sign-in", search: { redirect: location.href } });
    }
  },
});

// ─── Form schema (personal info only — no address for virtual product) ───────

const giftCardFormSchema = z.object({
  name: z.string({ message: "O nome é obrigatório." }).min(2, {
    message: "O nome deve conter pelo menos 2 caracteres.",
  }),
  email: z
    .string({ message: "O e-mail é obrigatório." })
    .email({ message: "O e-mail deve ter um formato válido." }),
  document: z
    .string({ message: "O CPF é obrigatório." })
    .min(11, { message: "O CPF deve ter 11 dígitos." })
    .refine(
      (v) => removeFormat(v).length === 11 && isValidCPF(v),
      { message: "O CPF deve ser válido." },
    ),
  cellphone: z
    .string({ message: "O telefone é obrigatório." })
    .min(11, { message: "O número de telefone deve ter 11 dígitos." }),
});

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// ─── Order summary sidebar ───────────────────────────────────────────────────

function GiftCardSummary({ amount }: { amount: number }) {
  return (
    <aside className="rounded-xl bg-white p-6 shadow-md space-y-4 h-fit sticky top-6">
      <h2 className="font-semibold text-lg text-amber-950">Resumo</h2>

      <div className="rounded-lg border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
          <Gift className="h-5 w-5 text-amber-700" />
        </div>
        <div>
          <p className="text-xs text-amber-700 font-medium uppercase tracking-wide">
            Vale Presente
          </p>
          <p className="text-xl font-bold text-amber-900">{formatBRL(amount)}</p>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-medium text-gray-900">{formatBRL(amount)}</span>
        </div>
        <div className="flex justify-between">
          <span>Frete</span>
          <span className="font-medium text-green-600">Grátis</span>
        </div>
        <div className="border-t pt-2 flex justify-between font-semibold text-gray-900">
          <span>Total</span>
          <span>{formatBRL(amount)}</span>
        </div>
      </div>

      <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md p-3 leading-relaxed">
        🎁 Válido por <strong>6 meses</strong> a partir da confirmação do
        pagamento. Pode ser usado em qualquer compra no site.
      </p>
    </aside>
  );
}

// ─── Personal step ───────────────────────────────────────────────────────────

interface PersonalStepProps {
  form: ReturnType<typeof useForm<GiftCardCheckoutFormData>>;
  onNext: () => void;
}

function PersonalStep({ form, onNext }: PersonalStepProps) {
  const documentDigits = form.watch("document") ?? "";
  const documentValidation = {
    isValid:
      removeFormat(documentDigits).length === 11 && isValidCPF(documentDigits),
    hasMinLength: removeFormat(documentDigits).length === 11,
  };

  return (
    <div className="rounded-lg bg-white p-8 shadow-md">
      <div className="mb-6 flex items-center gap-3">
        <User className="h-6 w-6 text-amber-900" />
        <h2 className="text-2xl text-gray-900">Dados pessoais</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome completo</FormLabel>
              <FormControl>
                <Input placeholder="Seu nome" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input placeholder="seu@email.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="document"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className={
                    documentDigits &&
                    documentValidation.hasMinLength &&
                    !documentValidation.isValid
                      ? "border-2 border-red-500 focus:border-red-500"
                      : ""
                  }
                  onChange={(e) => {
                    const digits = removeFormat(e.target.value).slice(0, 11);
                    field.onChange(digits);
                  }}
                  placeholder="000.000.000-00"
                  value={formatCPF(field.value ?? "")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cellphone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => {
                    const digits = removeFormat(e.target.value).slice(0, 11);
                    field.onChange(digits);
                  }}
                  placeholder="(00) 00000-0000"
                  value={formatWhatsApp(field.value ?? "")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <p className="mt-6 text-gray-400 text-xs">
        * Utilizamos o cadastro em nossa plataforma para agilizar o processo de
        checkout preenchendo automaticamente informações como nome e e-mail.
      </p>

      <Button
        className="mt-8 w-full cursor-pointer bg-amber-900 py-5! font-semibold text-sm text-white uppercase hover:bg-amber-900/90"
        onClick={onNext}
        type="button"
      >
        Continuar para pagamento
      </Button>
    </div>
  );
}

// ─── Payment pending screen ──────────────────────────────────────────────────

interface GiftCardPaymentPendingProps {
  payment: PaymentResponseDTO;
  giftCardId: string;
  onApproved: () => void;
}

function GiftCardPaymentPending({
  payment,
  giftCardId,
  onApproved,
}: GiftCardPaymentPendingProps) {
  const { payment: polled } = usePayment({
    paymentId: payment.id,
    enablePaymentQuery: true,
    pollingIntervalMs: 5000,
  });

  const status = polled?.status ?? payment.status;

  useEffect(() => {
    if (status === "APPROVED") onApproved();
  }, [status, onApproved]);

  const isPix = payment.paymentMethod === "PIX";
  const isBoleto = payment.paymentMethod === "BOLETO";

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado!`);
  };

  return (
    <div className="rounded-lg bg-white p-8 shadow-md space-y-6">
      <div>
        <h2 className="font-medium text-2xl text-gray-900">
          Aguardando pagamento
        </h2>
        <p className="mt-1 text-gray-500 text-sm">
          {isPix
            ? "Escaneie o QR Code ou copie o código para pagar via PIX."
            : "Abra o boleto para realizar o pagamento."}
        </p>
      </div>

      <div className="flex items-center gap-2 text-gray-400 text-sm">
        <Spinner className="size-4" />
        <span>Verificando pagamento automaticamente...</span>
      </div>

      {isPix && (
        <div className="space-y-4">
          {payment.pixQrCodeBase64 && (
            <div className="flex justify-center">
              <img
                alt="QR Code PIX"
                className="size-52 rounded-md border border-gray-100"
                src={`data:image/png;base64,${payment.pixQrCodeBase64}`}
              />
            </div>
          )}

          {payment.pixCopyPaste && (
            <div className="space-y-2">
              <p className="text-gray-500 text-xs uppercase tracking-wide">
                Código PIX (copia e cola)
              </p>
              <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 p-3">
                <p className="flex-1 break-all font-mono text-gray-700 text-xs">
                  {payment.pixCopyPaste}
                </p>
                <Button
                  className="shrink-0 cursor-pointer"
                  onClick={() =>
                    copyToClipboard(payment.pixCopyPaste!, "Código PIX")
                  }
                  size="sm"
                  variant="outline"
                >
                  <Copy className="mr-1.5 size-3.5" />
                  Copiar
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {isBoleto && (
        <div className="space-y-4">
          {payment.boletoUrl && (
            <a href={payment.boletoUrl} rel="noopener noreferrer" target="_blank">
              <Button className="w-full cursor-pointer bg-amber-900 text-white hover:bg-amber-900/90">
                <ExternalLink className="mr-2 size-4" />
                Abrir / Imprimir boleto
              </Button>
            </a>
          )}

          {payment.boletoBarcode && (
            <div className="space-y-2">
              <p className="text-gray-500 text-xs uppercase tracking-wide">
                Linha digitável
              </p>
              <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 p-3">
                <p className="flex-1 break-all font-mono text-gray-700 text-xs">
                  {payment.boletoBarcode}
                </p>
                <Button
                  className="shrink-0 cursor-pointer"
                  onClick={() =>
                    copyToClipboard(payment.boletoBarcode!, "Linha digitável")
                  }
                  size="sm"
                  variant="outline"
                >
                  <Copy className="mr-1.5 size-3.5" />
                  Copiar
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {payment.dateOfExpiration && (
        <p className="text-center text-gray-400 text-xs">
          Válido até{" "}
          {new Date(payment.dateOfExpiration).toLocaleString("pt-BR", {
            dateStyle: "short",
            timeStyle: "short",
          })}
        </p>
      )}

      <div className="pt-2 border-t text-center">
        <p className="text-xs text-gray-400">
          Após a confirmação, seu vale presente será ativado automaticamente.
        </p>
        <Link
          to="/profile/gift-cards/$giftCardId"
          params={{ giftCardId }}
          className="mt-2 inline-block text-xs text-amber-700 hover:underline"
        >
          Ver meu vale presente →
        </Link>
      </div>
    </div>
  );
}

// ─── Confirmation screen ─────────────────────────────────────────────────────

interface ConfirmationProps {
  giftCardId: string;
  amount: number;
}

function Confirmation({ giftCardId, amount }: ConfirmationProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-sagona">
            Vale Presente ativado!
          </h1>
          <p className="mt-2 text-gray-500">
            Seu vale de{" "}
            <span className="font-semibold text-amber-700">
              {formatBRL(amount)}
            </span>{" "}
            foi criado e já está ativo.
          </p>
        </div>

        <div className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6 space-y-2">
          <p className="text-xs text-amber-700 font-medium uppercase tracking-wider">
            Vale Presente Terra & Tallow
          </p>
          <p className="text-3xl font-bold text-amber-900">{formatBRL(amount)}</p>
          <p className="font-mono text-xs text-amber-800/50">
            {giftCardId.slice(0, 8).toUpperCase()}...
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link to="/profile/gift-cards/$giftCardId" params={{ giftCardId }}>
            <Button className="w-full cursor-pointer bg-amber-900 hover:bg-amber-900/90 text-white">
              <Gift className="mr-2 size-4" />
              Ver meu vale presente
            </Button>
          </Link>
          <Link to="/products">
            <Button
              className="w-full cursor-pointer"
              variant="outline"
            >
              Continuar comprando
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

function GiftCardCheckoutPage() {
  const { amount } = Route.useSearch();
  const { user } = useAuth();

  const [step, setStep] = useState<1 | 2>(1);
  const [confirmedGcId, setConfirmedGcId] = useState<string | null>(null);
  const [pendingState, setPendingState] = useState<{
    payment: PaymentResponseDTO;
    giftCardId: string;
  } | null>(null);

  const form = useForm<GiftCardCheckoutFormData>({
    resolver: zodResolver(giftCardFormSchema),
    mode: "onChange",
    defaultValues: { name: "", email: "", document: "", cellphone: "" },
  });

  // Pre-fill from logged-in user
  useEffect(() => {
    if (!user) return;
    form.setValue("name", user.name, { shouldValidate: true });
    form.setValue("email", user.email, { shouldValidate: true });
    form.setValue("document", user.document ?? "", { shouldValidate: true });
    form.setValue("cellphone", user.cellphone ?? "", { shouldValidate: true });
  }, [user, form]);

  const { handleProcessPayment, isProcessing } = useGiftCardCheckout(form, {
    amount,
    onSuccess: (gcId) => setConfirmedGcId(gcId),
    onPending: (payment, gcId) => setPendingState({ payment, giftCardId: gcId }),
  });

  // Validate personal fields before advancing to payment step
  const handleNextStep = async () => {
    const valid = await form.trigger(["name", "email", "document", "cellphone"]);
    if (valid) setStep(2);
  };

  // ── Confirmed ────────────────────────────────────────────────────────────
  if (confirmedGcId) {
    return <Confirmation giftCardId={confirmedGcId} amount={amount} />;
  }

  // ── Pending payment (PIX / Boleto) ───────────────────────────────────────
  if (pendingState) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="container mx-auto max-w-2xl">
          <h1 className="mb-8 font-semibold text-4xl text-amber-900">
            Vale Presente
          </h1>
          <GiftCardPaymentPending
            payment={pendingState.payment}
            giftCardId={pendingState.giftCardId}
            onApproved={() => {
              setConfirmedGcId(pendingState.giftCardId);
              setPendingState(null);
            }}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="container mx-auto max-w-6xl">
        <h1 className="mb-2 font-semibold text-4xl text-amber-900">
          Vale Presente
        </h1>
        <p className="mb-8 text-gray-500">
          Presenteie alguém especial com um vale Terra &amp; Tallow.
        </p>

        <Progress className="mb-10" value={step === 1 ? 50 : 100} />

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Form {...form}>
              <form
                className="space-y-6"
                onSubmit={(e) => e.preventDefault()}
              >
                {step === 1 && (
                  <PersonalStep form={form} onNext={handleNextStep} />
                )}

                {step === 2 && (
                  <PaymentFormStep
                    amount={amount}
                    onSubmitPayment={handleProcessPayment}
                  />
                )}

                {isProcessing && (
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Spinner className="size-4" />
                    <span>Processando pagamento...</span>
                  </div>
                )}
              </form>
            </Form>
          </div>

          <GiftCardSummary amount={amount} />
        </div>
      </div>
    </main>
  );
}

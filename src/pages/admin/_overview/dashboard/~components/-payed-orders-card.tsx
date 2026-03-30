import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { usePayment } from "@/hooks/services/use-payment";
import type { PaymentAdminDTO } from "@/types/services/payment";

function brl(amount: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);
}

function stats(payments: PaymentAdminDTO[], method: string) {
  const filtered = payments.filter(
    (p) => p.status === "APPROVED" && p.paymentMethod === method,
  );
  return {
    count: filtered.length,
    total: filtered.reduce((sum, p) => sum + p.transactionAmount, 0),
  };
}

export function PayedOrdersCard() {
  const { allPayments } = usePayment({ enableAllPaymentsQuery: true });

  const payments = (allPayments as PaymentAdminDTO[]) ?? [];

  const pix = stats(payments, "PIX");
  const card = stats(payments, "CREDIT_CARD");
  const boleto = stats(payments, "BOLETO");

  return (
    <Card className="flex w-full p-0 xl:w-1/2">
      <CardContent className="relative w-full p-0">
        <article className="relative flex h-32 items-center overflow-hidden rounded-t-2xl px-6">
          <div className="relative mt-16 h-40 w-24 shrink-0">
            <img
              alt="Greece Statue"
              className="pointer-events-none absolute bottom-0 h-full w-full object-contain"
              src="/assets/images/greece-statue.svg"
            />
          </div>

          <div className="ml-auto flex flex-col items-end">
            <span className="font-semibold text-2xl">{brl(pix.total)}</span>
            <p className="text-muted-foreground text-sm">
              <span className="font-bold">{pix.count}</span> pedidos pagos no
              PIX
            </p>
          </div>
        </article>

        <Separator />

        <article className="relative flex h-34 items-center overflow-hidden bg-muted/30 px-6">
          <div className="flex flex-col">
            <span className="font-semibold text-2xl">{brl(card.total)}</span>
            <p className="text-muted-foreground text-sm">
              <span className="font-bold">{card.count}</span> pedidos pagos no
              CARTÃO
            </p>
          </div>

          <div className="ml-auto h-28 w-28 shrink-0">
            <img
              alt="Cards"
              className="pointer-events-none h-full w-full object-contain"
              src="/assets/images/cards-wallet.svg"
            />
          </div>
        </article>

        <Separator />

        <article className="relative flex h-32 items-center overflow-hidden px-6">
          <div className="relative h-16 w-16 shrink-0">
            <img
              alt="Bar Code"
              className="pointer-events-none absolute bottom-0 h-full w-full object-contain"
              src="/assets/images/bar-code.svg"
            />
          </div>

          <div className="ml-auto flex flex-col items-end">
            <span className="font-semibold text-2xl">{brl(boleto.total)}</span>
            <p className="text-muted-foreground text-sm">
              <span className="font-bold">{boleto.count}</span> pedidos pagos no
              BOLETO
            </p>
          </div>
        </article>
      </CardContent>
    </Card>
  );
}

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { usePayment } from "@/hooks/services/use-payment";
import { paymentMethodLabel } from "@/types/enums/payment-method";
import { paymentStatusLabel } from "@/types/enums/payment-status";
import { formatCurrency } from "@/utils/format-currency";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { PaymentLoading } from "./~components/-payment-loading";
import { PaymentNotFound } from "./~components/-payment-not-found";
import { InfoRow } from "@/components/info-row";
import { formatDate } from "@/utils/format-date";

export const Route = createFileRoute("/admin/_primary/payments/$paymentId/")({
  component: PaymentDetailsPage,
  head: () => ({
    meta: [{ title: "Detalhes do pagamento | Terra & Tallow" }],
  }),
});

function paymentStatusVariant(
  status: string,
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "APPROVED":
      return "default";
    case "REJECTED":
    case "CANCELLED":
    case "CHARGED_BACK":
      return "destructive";
    default:
      return "secondary";
  }
}

function PaymentDetailsPage() {
  const navigate = useNavigate();
  const { paymentId } = Route.useParams();
  const { adminPayment, isAdminPaymentLoading } = usePayment({
    paymentId,
    enableAdminPaymentQuery: true,
  });

  if (isAdminPaymentLoading) {
    return <PaymentLoading />;
  }

  if (!adminPayment) {
    return <PaymentNotFound />;
  }

  const payment = adminPayment;

  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex gap-4">
          <Button
            variant="secondary"
            className="mt-1"
            onClick={() => navigate({ to: "/admin/payments" })}
          >
            <ArrowLeft />
          </Button>

          <article>
            <h1 className="font-semibold text-2xl tracking-tight">
              Detalhes do pagamento
            </h1>
            <p className="text-muted-foreground text-sm">
              Veja os detalhes do pagamento processado em nossa plataforma
            </p>

            <Badge variant="secondary" className="mt-4 font-mono text-xs">
              ID: {payment.id}
            </Badge>
          </article>
        </div>

        {payment.orderId && (
          <Button
            variant="outline"
            className="w-full md:w-fit cursor-pointer"
            onClick={() =>
              navigate({
                to: "/admin/orders/$orderId",
                params: { orderId: payment.orderId! },
              })
            }
          >
            <ExternalLink className="h-4 w-4" />
            Ver pedido
          </Button>
        )}
      </div>

      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="flex flex-col gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-4">
                  Informações do pagamento
                </h3>
                <Separator className="mb-4" />
                <div className="grid grid-cols-2 gap-4">
                  <InfoRow
                    label="Status"
                    value={
                      <Badge
                        variant={paymentStatusVariant(payment.status)}
                        className="uppercase"
                      >
                        {paymentStatusLabel[payment.status] ?? payment.status}
                      </Badge>
                    }
                  />
                  <InfoRow
                    label="Detalhe do status"
                    value={payment.statusDetail ?? "—"}
                  />
                  <InfoRow
                    label="Método"
                    value={
                      paymentMethodLabel[payment.paymentMethod] ??
                      payment.paymentMethod
                    }
                  />
                  <InfoRow
                    label="ID Mercado Pago"
                    value={<span>{payment.mercadoPagoPaymentId ?? "—"}</span>}
                  />
                  <InfoRow
                    label="Código de autorização"
                    value={<span>{payment.authorizationCode ?? "—"}</span>}
                  />
                  <InfoRow
                    label="Ambiente"
                    value={
                      payment.liveMode === true
                        ? "Produção"
                        : payment.liveMode === false
                          ? "Sandbox"
                          : "—"
                    }
                  />
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-4">Datas</h3>
                <Separator className="mb-4" />
                <div className="grid grid-cols-3 gap-4">
                  <InfoRow
                    label="Criado em"
                    value={formatDate(payment.dateCreated)}
                  />
                  <InfoRow
                    label="Aprovado em"
                    value={formatDate(payment.dateApproved)}
                  />
                  <InfoRow
                    label="Última atualização"
                    value={formatDate(payment.dateLastUpdated)}
                  />
                </div>
              </div>

              {(payment.pixQrCodeBase64 || payment.boletoBarcode) && (
                <div>
                  <h3 className="font-semibold text-lg mb-4">PIX / Boleto</h3>
                  <Separator className="mb-4" />

                  {payment.pixQrCodeBase64 && (
                    <div className="flex flex-col gap-4">
                      <img
                        src={`data:image/png;base64,${payment.pixQrCodeBase64}`}
                        alt="QR Code PIX"
                        className="w-48 h-48 rounded-lg border"
                      />
                      {payment.pixCopyPaste && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-fit cursor-pointer"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              payment.pixCopyPaste!,
                            );
                            toast.success("Código PIX copiado!");
                          }}
                        >
                          <Copy className="h-4 w-4" />
                          Copiar código PIX
                        </Button>
                      )}
                    </div>
                  )}

                  {payment.boletoBarcode && (
                    <div className="flex flex-col gap-3">
                      {payment.boletoUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-fit cursor-pointer"
                          onClick={() =>
                            window.open(payment.boletoUrl!, "_blank")
                          }
                        >
                          <ExternalLink className="h-4 w-4" />
                          Abrir boleto
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-fit cursor-pointer"
                        onClick={() => {
                          navigator.clipboard.writeText(payment.boletoBarcode!);
                          toast.success("Código de barras copiado!");
                        }}
                      >
                        <Copy className="h-4 w-4" />
                        Copiar código de barras
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-4">Valores</h3>
                <Separator className="mb-4" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                      Valor da transação
                    </p>
                    <p className="mt-1 font-semibold text-sm">
                      {formatCurrency(payment.transactionAmount)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                      Frete
                    </p>
                    <p className="mt-1 font-semibold text-sm">
                      {payment.shippingAmount != null
                        ? formatCurrency(payment.shippingAmount)
                        : "—"}
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                      Subtotal do pedido
                    </p>
                    <p className="mt-1 font-semibold text-sm">
                      {payment.orderSubTotal != null
                        ? formatCurrency(payment.orderSubTotal)
                        : "—"}
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                      Total do pedido
                    </p>
                    <p className="mt-1 font-semibold text-sm">
                      {payment.orderTotal != null
                        ? formatCurrency(payment.orderTotal)
                        : "—"}
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                      Parcelas
                    </p>
                    <p className="mt-1 font-semibold text-sm">
                      {payment.installments && payment.installments > 1
                        ? `${payment.installments}x`
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-4">Comprador</h3>
                <Separator className="mb-4" />
                <div className="grid grid-cols-1 gap-4">
                  <InfoRow label="Nome" value={payment.payerName ?? "—"} />
                  <InfoRow label="Email" value={payment.payerEmail ?? "—"} />
                  <InfoRow
                    label="CPF/Documento"
                    value={<span>{payment.payerDocument ?? "—"}</span>}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

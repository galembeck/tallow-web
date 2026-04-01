import { Copy, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { usePayment } from "@/hooks/services/use-payment";
import type { PaymentResponseDTO } from "@/types/services/payment";

interface PaymentPendingProps {
  payment: PaymentResponseDTO;
  onApproved: () => void;
}

export function PaymentPending({ payment, onApproved }: PaymentPendingProps) {
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);

  const { payment: polledPayment } = usePayment({
    paymentId: payment.id,
    enablePaymentQuery: true,
    pollingIntervalMs: 5000,
  });

  const status = polledPayment?.status ?? payment.status;

  useEffect(() => {
    if (status === "APPROVED") {
      onApproved();
    } else if (status === "REJECTED" || status === "CANCELLED") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRejectionReason(
        polledPayment?.statusDetail ?? "Pagamento recusado ou cancelado.",
      );
    }
  }, [status, onApproved, polledPayment?.statusDetail]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado!`);
  };

  const isPix = payment.paymentMethod === "PIX";
  const isBoleto = payment.paymentMethod === "BOLETO";

  return (
    <div className="rounded-lg bg-white p-8 shadow-md space-y-6">
      <div>
        <h2 className="font-medium text-2xl text-gray-900">
          {rejectionReason
            ? "Pagamento não confirmado"
            : "Aguardando pagamento"}
        </h2>
        <p className="mt-1 text-gray-500 text-sm">
          {rejectionReason
            ? "Ocorreu um problema com o seu pagamento."
            : isPix
              ? "Escaneie o QR Code ou copie o código para pagar via PIX."
              : "Abra o boleto para realizar o pagamento."}
        </p>
      </div>

      {rejectionReason ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-700 text-sm">
          {rejectionReason}
        </div>
      ) : (
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Spinner className="size-4" />
          <span>Verificando pagamento automaticamente...</span>
        </div>
      )}

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
            <a
              href={payment.boletoUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
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
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { OrderShippingStatusDTO } from "@/hooks/services/use-order";
import {
  ShippingService,
  ShippingServiceLabel,
} from "@/types/enums/shipping-service";
import { Printer } from "lucide-react";

const superFreteStatusLabel: Record<string, string> = {
  pending: "Pendente",
  posted: "Postado",
  in_transit: "Em trânsito",
  delivered: "Entregue",
  waiting_pickup: "Aguardando retirada",
  cancelled: "Cancelado",
};

interface ShippingResultCardProps {
  result: OrderShippingStatusDTO | null | undefined;
  onPrintLabel: () => void;
  isLoading?: boolean;
}

function ShippingResultSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-5 w-36" />
        </div>
      ))}
    </div>
  );
}

export function ShippingResultCard({
  result,
  onPrintLabel,
  isLoading,
}: ShippingResultCardProps) {
  const ready = !isLoading && result != null;

  const trackingCode = ready
    ? (result.trackingCode ?? result.live?.trackingCode)
    : null;

  const carrierLabel =
    ready && result.live?.carrier !== undefined
      ? (ShippingServiceLabel[
          result.live
            .carrier as (typeof ShippingService)[keyof typeof ShippingService]
        ] ?? String(result.live.carrier))
      : null;

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Informações de envio</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={onPrintLabel}
            disabled={!ready}
            className="cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            Imprimir etiqueta
          </Button>
        </div>

        <Separator className="mb-6" />

        {!ready ? (
          <ShippingResultSkeleton />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                  Código de rastreio
                </p>
                {trackingCode ? (
                  <p className="font-mono font-semibold text-base">
                    {trackingCode}
                  </p>
                ) : (
                  <p className="text-muted-foreground text-sm italic">
                    Código não dispoível, aguarde...
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                  ID SuperFrete
                </p>
                <p className="text-sm font-semibold">
                  {result.superFreteOrderId}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                  Status
                </p>
                <p className="text-sm uppercase font-semibold">
                  {result.live
                    ? (superFreteStatusLabel[result.live.superFreteStatus] ??
                      result.live.superFreteStatus)
                    : "—"}
                </p>
              </div>
            </div>

            {result.live && (
              <>
                <Separator className="my-5" />

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
                  {carrierLabel && (
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                        Transportadora
                      </p>
                      <p className="text-sm font-semibold">{carrierLabel}</p>
                    </div>
                  )}

                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                      Prazo estimado
                    </p>
                    <p className="text-sm font-semibold">
                      {result.live.deliveryDays > 0
                        ? `De ${result.live.deliveryMin} a ${result.live.deliveryMax} dias úteis`
                        : "—"}
                    </p>
                  </div>

                  {result.live.postedAt && (
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                        Postado em
                      </p>
                      <p className="text-sm font-semibold">
                        {new Date(result.live.postedAt).toLocaleDateString(
                          "pt-BR",
                        )}
                      </p>
                    </div>
                  )}

                  {result.deliveredAt && (
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                        Entregue em
                      </p>
                      <p className="text-sm font-semibold">
                        {new Date(result.deliveredAt).toLocaleDateString(
                          "pt-BR",
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGiftCard } from "@/hooks/services/use-gift-card";
import type { GiftCardStatus } from "@/types/services/gift-card";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ArrowLeft,
  Copy,
  Loader2,
  Printer,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute(
  "/_public/profile/gift-cards/$giftCardId/",
)({
  component: GiftCardDetailPage,
  head: () => ({
    meta: [{ title: "Vale Presente | Terra & Tallow" }],
  }),
});

function statusLabel(status: GiftCardStatus): string {
  const labels: Record<GiftCardStatus, string> = {
    PENDING: "Pendente",
    ACTIVE: "Ativo",
    USED: "Usado",
    EXPIRED: "Expirado",
    CANCELLED: "Cancelado",
  };
  return labels[status] ?? status;
}

function statusBadgeClass(status: GiftCardStatus): string {
  const classes: Record<GiftCardStatus, string> = {
    PENDING: "bg-yellow-400/20 text-yellow-200 border-yellow-400/30",
    ACTIVE: "bg-green-400/20 text-green-200 border-green-400/30",
    USED: "bg-white/10 text-white/60 border-white/20",
    EXPIRED: "bg-red-400/20 text-red-200 border-red-400/30",
    CANCELLED: "bg-red-400/20 text-red-200 border-red-400/30",
  };
  return `uppercase font-bold border ${classes[status] ?? ""}`;
}

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/** Renders a CSS barcode simulation from a string ID */
function BarcodeDisplay({ id }: { id: string }) {
  // Generate ~40 bars from character codes
  const bars: { width: number; opacity: number }[] = [];
  const chars = id.replace(/-/g, "");

  for (let i = 0; i < 40; i++) {
    const charCode = chars.charCodeAt(i % chars.length);
    const isThin = charCode % 3 !== 0;
    bars.push({
      width: isThin ? 2 : 4,
      opacity: charCode % 5 === 0 ? 0.5 : 1,
    });
  }

  return (
    <div className="flex items-end gap-[2px] h-12 justify-center">
      {bars.map((bar, idx) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: deterministic barcode bars
          key={idx}
          className="bg-white rounded-sm"
          style={{
            width: `${bar.width}px`,
            height: `${32 + (idx % 4) * 4}px`,
            opacity: bar.opacity,
          }}
        />
      ))}
    </div>
  );
}

/** Format ID into groups of 4 chars (first 16 chars) */
function formatCardCode(id: string): string {
  const clean = id.replace(/-/g, "").toUpperCase().slice(0, 16);
  return clean.match(/.{1,4}/g)?.join("-") ?? clean;
}

function GiftCardDetailPage() {
  const navigate = useNavigate();
  const { giftCardId } = Route.useParams();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { giftCard, isGiftCardLoading, refreshGiftCard } = useGiftCard({
    giftCardId,
    enableGiftCardQuery: true,
  });

  async function handleRefresh() {
    setIsRefreshing(true);
    try {
      await refreshGiftCard(giftCardId);
      toast.success("Status atualizado!");
    } catch {
      toast.error("Erro ao atualizar status.");
    } finally {
      setIsRefreshing(false);
    }
  }

  if (isGiftCardLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="size-8 animate-spin text-amber-700" />
      </div>
    );
  }

  if (!giftCard) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-muted-foreground">Vale presente não encontrado.</p>
        <Button
          variant="outline"
          onClick={() => navigate({ to: "/profile/gift-cards" })}
        >
          <ArrowLeft className="mr-2 size-4" />
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Action bar */}
      <div className="flex items-center justify-between print:hidden">
        <Button
          variant="ghost"
          className="cursor-pointer text-amber-900 hover:text-amber-800 hover:bg-amber-50 -ml-2"
          onClick={() => navigate({ to: "/profile/gift-cards" })}
        >
          <ArrowLeft className="mr-2 size-4" />
          Voltar
        </Button>

        <div className="flex gap-2">
          {giftCard.status === "PENDING" && (
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`mr-2 size-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Atualizar
            </Button>
          )}

          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => window.print()}
          >
            <Printer className="mr-2 size-4" />
            Imprimir
          </Button>
        </div>
      </div>

      {/* Physical gift card */}
      <div className="w-full max-w-lg mx-auto">
        <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-amber-900 via-amber-800 to-amber-700 p-8 text-white aspect-[1.6/1] flex flex-col justify-between min-h-[280px]">
          {/* Decorative circles */}
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/5" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/5" />
          <div className="absolute top-1/2 right-4 w-20 h-20 rounded-full bg-white/[0.03]" />

          {/* Top section */}
          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-amber-200 text-xs font-medium tracking-[0.2em] uppercase">
                Terra &amp; Tallow
              </p>
              <p className="text-white/60 text-xs tracking-widest mt-0.5">
                Vale Presente
              </p>
            </div>
            <Badge className={statusBadgeClass(giftCard.status)}>
              {statusLabel(giftCard.status)}
            </Badge>
          </div>

          {/* Center — amount */}
          <div className="relative flex flex-col items-center justify-center flex-1 py-4">
            <p className="text-5xl font-bold tracking-tight text-white drop-shadow-sm">
              {formatBRL(giftCard.amount)}
            </p>
          </div>

          {/* Bottom section — barcode */}
          <div className="relative space-y-3">
            <BarcodeDisplay id={giftCard.id} />
            <p className="text-center font-mono text-[11px] text-white/50 tracking-[0.15em]">
              {formatCardCode(giftCard.id)}
            </p>
          </div>
        </div>
      </div>

      {/* Info card */}
      <div className="w-full max-w-lg mx-auto rounded-xl border border-amber-100 bg-amber-50/50 p-5 space-y-3">
        <h2 className="font-semibold text-amber-950 text-sm">
          Informações do vale
        </h2>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Comprado em</p>
            <p className="font-medium text-amber-900">
              {format(new Date(giftCard.purchasedAt), "dd/MM/yyyy", {
                locale: ptBR,
              })}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Expira em</p>
            <p className="font-medium text-amber-900">
              {format(new Date(giftCard.expiresAt), "dd/MM/yyyy", {
                locale: ptBR,
              })}
            </p>
          </div>

          {giftCard.usedAt && (
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Usado em</p>
              <p className="font-medium text-gray-600">
                {format(new Date(giftCard.usedAt), "dd/MM/yyyy", {
                  locale: ptBR,
                })}
              </p>
            </div>
          )}

          {giftCard.usedOnOrderId && (
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">
                Pedido vinculado
              </p>
              <p className="font-mono text-xs text-amber-900 truncate">
                {giftCard.usedOnOrderId.slice(0, 8).toUpperCase()}...
              </p>
            </div>
          )}
        </div>
      </div>

      {/* PIX pending section */}
      {giftCard.status === "PENDING" && (
        <div className="w-full max-w-lg mx-auto rounded-xl border border-yellow-200 bg-yellow-50 p-5 space-y-4 print:hidden">
          <div>
            <h2 className="font-semibold text-yellow-900">
              Aguardando pagamento
            </h2>
            <p className="text-sm text-yellow-700 mt-1">
              Realize o pagamento via PIX para ativar seu vale presente.
            </p>
          </div>

          {giftCard.pixQrCodeBase64 && (
            <div className="flex justify-center">
              <img
                alt="QR Code PIX"
                className="size-52 rounded-md border border-yellow-100"
                src={`data:image/png;base64,${giftCard.pixQrCodeBase64}`}
              />
            </div>
          )}

          {giftCard.pixCopyPaste && (
            <div className="space-y-2">
              <p className="text-yellow-700 text-xs uppercase tracking-wide">
                Código PIX (copia e cola)
              </p>
              <div className="flex items-center gap-2 rounded-md border border-yellow-200 bg-white p-3">
                <p className="flex-1 break-all font-mono text-gray-700 text-xs">
                  {giftCard.pixCopyPaste}
                </p>
                <Button
                  className="shrink-0 cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(giftCard.pixCopyPaste!);
                    toast.success("Código PIX copiado!");
                  }}
                  size="sm"
                  variant="outline"
                >
                  <Copy className="mr-1.5 size-3.5" />
                  Copiar
                </Button>
              </div>
            </div>
          )}

          {giftCard.paymentExpiresAt && (
            <p className="text-center text-yellow-600 text-xs">
              PIX válido até{" "}
              {new Date(giftCard.paymentExpiresAt).toLocaleString("pt-BR", {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

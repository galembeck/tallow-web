import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useGiftCard } from "@/hooks/services/use-gift-card";
import type { GiftCard, GiftCardStatus } from "@/types/services/gift-card";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Gift, Loader2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_public/profile/gift-cards/")({
  component: ProfileGiftCardsPage,
  head: () => ({
    meta: [{ title: "Vales Presente | Terra & Tallow" }],
  }),
});

const AMOUNT_PRESETS = [50, 100, 150, 200, 300, 500];

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
    PENDING: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    ACTIVE: "bg-green-100 text-green-800 hover:bg-green-100",
    USED: "bg-gray-100 text-gray-600 hover:bg-gray-100",
    EXPIRED: "bg-red-100 text-red-700 hover:bg-red-100",
    CANCELLED: "bg-red-100 text-red-700 hover:bg-red-100",
  };
  return `uppercase font-bold ${classes[status] ?? ""}`;
}

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

interface GiftCardItemProps {
  card: GiftCard;
}

function GiftCardItem({ card }: GiftCardItemProps) {
  return (
    <Link to="/profile/gift-cards/$giftCardId" params={{ giftCardId: card.id }}>
      <div className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-xs text-amber-700 font-medium uppercase tracking-wider">
              Vale Presente
            </p>
            <p className="text-2xl font-bold text-amber-900 mt-0.5">
              {formatBRL(card.amount)}
            </p>
          </div>
          <Badge className={statusBadgeClass(card.status)}>
            {statusLabel(card.status)}
          </Badge>
        </div>

        <div className="space-y-1 text-xs text-muted-foreground">
          <p>
            Expira em:{" "}
            <span className="text-amber-900 font-medium">
              {format(new Date(card.expiresAt), "dd/MM/yyyy", { locale: ptBR })}
            </span>
          </p>
          {card.usedAt && (
            <p>
              Usado em:{" "}
              <span className="text-gray-600 font-medium">
                {format(new Date(card.usedAt), "dd/MM/yyyy", { locale: ptBR })}
              </span>
            </p>
          )}
        </div>

        <p className="mt-3 font-mono text-[10px] text-amber-800/50 truncate">
          {card.id.slice(0, 8).toUpperCase()}...
        </p>
      </div>
    </Link>
  );
}

interface AmountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function AmountModal({ open, onOpenChange }: AmountModalProps) {
  const navigate = useNavigate();
  const [selectedAmount, setSelectedAmount] = useState(100);

  function handleContinue() {
    onOpenChange(false);
    navigate({ to: "/gift-card-checkout", search: { amount: selectedAmount } });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-sagona text-amber-950">
            Comprar Vale Presente
          </DialogTitle>
          <DialogDescription>
            Escolha o valor do seu vale presente. Você escolherá a forma de
            pagamento na próxima etapa.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="grid grid-cols-3 gap-2">
            {AMOUNT_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setSelectedAmount(preset)}
                className={`rounded-lg border px-3 py-2.5 text-sm font-semibold transition-colors cursor-pointer ${
                  selectedAmount === preset
                    ? "border-amber-700 bg-amber-700 text-white"
                    : "border-gray-200 bg-white text-gray-700 hover:border-amber-400"
                }`}
              >
                {formatBRL(preset)}
              </button>
            ))}
          </div>

          <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-center">
            <p className="text-xs text-amber-700">
              Válido por <span className="font-semibold">6 meses</span> a partir
              da confirmação do pagamento.
            </p>
          </div>

          <Button
            type="button"
            className="w-full cursor-pointer bg-amber-900 hover:bg-amber-900/90 text-white"
            onClick={handleContinue}
          >
            <Gift className="mr-2 size-4" />
            Continuar — {formatBRL(selectedAmount)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ProfileGiftCardsPage() {
  const [purchaseOpen, setPurchaseOpen] = useState(false);

  const { giftCards, isMyCardsLoading } = useGiftCard({
    enableMyCardsQuery: true,
  });

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <Card>
        <CardHeader className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="font-bold text-xl text-amber-950 font-sagona">
              Vales Presente
            </CardTitle>
            <CardDescription>
              Gerencie seus vales presentes e compre novos.
            </CardDescription>
          </div>

          <Button
            className="cursor-pointer bg-amber-900 hover:bg-amber-900/90 text-white"
            onClick={() => setPurchaseOpen(true)}
          >
            <Gift className="mr-2 size-4" />
            Comprar Vale Presente
          </Button>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6">
          {isMyCardsLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : !giftCards || giftCards.length === 0 ? (
            <article className="flex flex-col items-center justify-center gap-4 py-16">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Gift className="h-8 w-8 text-muted-foreground" />
              </div>

              <div className="text-center">
                <h3 className="font-semibold text-lg">
                  Nenhum vale presente encontrado
                </h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Você ainda não possui vales presentes. Compre um agora!
                </p>
              </div>

              <Button
                className="cursor-pointer bg-amber-900 hover:bg-amber-900/90 text-white"
                onClick={() => setPurchaseOpen(true)}
              >
                <Gift className="mr-2 size-4" />
                Comprar Vale Presente
              </Button>
            </article>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {giftCards.map((card) => (
                <GiftCardItem key={card.id} card={card} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AmountModal open={purchaseOpen} onOpenChange={setPurchaseOpen} />
    </div>
  );
}

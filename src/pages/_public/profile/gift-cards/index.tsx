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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useGiftCard } from "@/hooks/services/use-gift-card";
import type { GiftCard, GiftCardStatus } from "@/types/services/gift-card";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Copy, Gift, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/_public/profile/gift-cards/")({
  component: ProfileGiftCardsPage,
  head: () => ({
    meta: [{ title: "Vales Presente | Terra & Tallow" }],
  }),
});

const AMOUNT_PRESETS = [50, 100, 150, 200, 300, 500];

const purchaseSchema = z.object({
  amount: z.number({ required_error: "Selecione um valor" }).positive(),
  email: z.string().email("E-mail inválido"),
});

type PurchaseFormValues = z.infer<typeof purchaseSchema>;

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

interface PixSectionProps {
  giftCardId: string;
  pixQrCodeBase64?: string | null;
  pixCopyPaste?: string | null;
}

function PixSection({ giftCardId, pixQrCodeBase64, pixCopyPaste }: PixSectionProps) {
  const { refreshGiftCard } = useGiftCard();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [currentStatus, setCurrentStatus] = useState<GiftCardStatus>("PENDING");

  useEffect(() => {
    intervalRef.current = setInterval(async () => {
      try {
        const updated = await refreshGiftCard(giftCardId);
        setCurrentStatus(updated.status);
        if (updated.status !== "PENDING") {
          if (intervalRef.current) clearInterval(intervalRef.current);
          if (updated.status === "ACTIVE") {
            toast.success("Vale presente ativado com sucesso!");
          }
        }
      } catch {
        // silently ignore refresh errors
      }
    }, 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [giftCardId, refreshGiftCard]);

  if (currentStatus !== "PENDING") return null;

  return (
    <div className="space-y-4 mt-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        <span>Verificando pagamento automaticamente...</span>
      </div>

      {pixQrCodeBase64 && (
        <div className="flex justify-center">
          <img
            alt="QR Code PIX"
            className="size-52 rounded-md border border-gray-100"
            src={`data:image/png;base64,${pixQrCodeBase64}`}
          />
        </div>
      )}

      {pixCopyPaste && (
        <div className="space-y-2">
          <p className="text-gray-500 text-xs uppercase tracking-wide">
            Código PIX (copia e cola)
          </p>
          <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 p-3">
            <p className="flex-1 break-all font-mono text-gray-700 text-xs">
              {pixCopyPaste}
            </p>
            <Button
              className="shrink-0 cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(pixCopyPaste);
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
    </div>
  );
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

interface PurchaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function PurchaseModal({ open, onOpenChange }: PurchaseModalProps) {
  const { purchaseGiftCard, isPurchasing } = useGiftCard();
  const [purchasedCard, setPurchasedCard] = useState<GiftCard | null>(null);

  const form = useForm<PurchaseFormValues>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      amount: 100,
      email: "",
    },
  });

  const selectedAmount = form.watch("amount");

  async function onSubmit(values: PurchaseFormValues) {
    try {
      const result = await purchaseGiftCard({
        amount: values.amount,
        paymentType: "PIX",
        payer: {
          email: values.email,
        },
      });
      setPurchasedCard(result);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erro ao comprar vale presente.",
      );
    }
  }

  function handleClose(open: boolean) {
    if (!open) {
      setPurchasedCard(null);
      form.reset();
    }
    onOpenChange(open);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-sagona text-amber-950">
            Comprar Vale Presente
          </DialogTitle>
          <DialogDescription>
            Escolha o valor e pague via PIX. O vale será ativado automaticamente
            após a confirmação.
          </DialogDescription>
        </DialogHeader>

        {purchasedCard ? (
          <div className="space-y-4">
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-center">
              <p className="text-sm text-amber-700 font-medium">
                Vale de {formatBRL(purchasedCard.amount)} criado!
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Realize o pagamento via PIX para ativá-lo.
              </p>
            </div>

            {purchasedCard.status === "PENDING" && (
              <PixSection
                giftCardId={purchasedCard.id}
                pixQrCodeBase64={purchasedCard.pixQrCodeBase64}
                pixCopyPaste={purchasedCard.pixCopyPaste}
              />
            )}

            <Button
              className="w-full cursor-pointer"
              variant="outline"
              onClick={() => handleClose(false)}
            >
              Fechar
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor do vale</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-3 gap-2">
                        {AMOUNT_PRESETS.map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => field.onChange(preset)}
                            className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-colors cursor-pointer ${
                              selectedAmount === preset
                                ? "border-amber-700 bg-amber-700 text-white"
                                : "border-gray-200 bg-white text-gray-700 hover:border-amber-400"
                            }`}
                          >
                            {formatBRL(preset)}
                          </button>
                        ))}
                      </div>
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
                    <FormLabel>Seu e-mail (para o PIX)</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="seu@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full cursor-pointer bg-amber-900 hover:bg-amber-900/90 text-white"
                disabled={isPurchasing}
              >
                {isPurchasing ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Gerando PIX...
                  </>
                ) : (
                  `Pagar ${formatBRL(selectedAmount)} via PIX`
                )}
              </Button>
            </form>
          </Form>
        )}
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

      <PurchaseModal open={purchaseOpen} onOpenChange={setPurchaseOpen} />
    </div>
  );
}

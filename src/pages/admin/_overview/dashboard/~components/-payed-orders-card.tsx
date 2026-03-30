import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function PayedOrdersCard() {
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
            <span className="font-semibold text-2xl">R$ 0,00</span>
            <p className="text-muted-foreground text-sm">
              <span className="font-bold">0</span> pedidos pagos no PIX
            </p>
          </div>
        </article>

        <article className="relative flex h-34 items-center overflow-hidden bg-muted/30 px-6">
          <div className="flex flex-col">
            <span className="font-semibold text-2xl">R$ 0,00</span>
            <p className="text-muted-foreground text-sm">
              <span className="font-bold">0</span> pedidos pagos no CARTÃO
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

        <article className="relative flex h-32 items-center overflow-hidden rounded-t-2xl px-6 blur-xs">
          <div className="relative h-16 w-16 shrink-0">
            <img
              alt="Bar Code"
              className="pointer-events-none absolute bottom-0 h-full w-full object-contain"
              src="/assets/images/bar-code.svg"
            />
          </div>

          <div className="ml-auto flex flex-col items-end">
            <span className="font-semibold text-2xl">R$ 0,00</span>
            <p className="text-muted-foreground text-sm">
              <span className="font-bold">0</span> pedidos pagos no BOLETO
            </p>
          </div>
        </article>

        <Badge className="-translate-x-1/2 absolute bottom-10 left-1/2 transform blur-none">
          Em breve...
        </Badge>
      </CardContent>
    </Card>
  );
}

import { Bug, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export function UnderDevelopmentAdvice() {
  return (
    <HoverCard>
      <HoverCardTrigger>
        <Badge className="flex cursor-pointer items-center gap-2 bg-amber-900 font-semibold uppercase dark:bg-white">
          <Info />
          Aviso importante
        </Badge>
      </HoverCardTrigger>

      <HoverCardContent className="w-80">
        <div className="flex items-center gap-4">
          <Bug size="120" />

          <article className="flex flex-col gap-2 text-sm">
            <p>
              Nossa plataforma está em constante{" "}
              <span className="font-bold text-amber-900">desenvolvimento</span>!
            </p>

            <p className="text-muted-foreground">
              Caso perceba algum erro, por favor reporte à nossa equipe.
            </p>
          </article>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

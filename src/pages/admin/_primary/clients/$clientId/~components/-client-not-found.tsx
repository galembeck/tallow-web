import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export function ClientNotFound() {
  const navigate = useNavigate();

  return (
    <main className="flex h-3/4 flex-col items-center justify-center gap-6">
      <h1 className="font-bold text-3xl">Cliente não encontrado :(</h1>
      <p className="text-muted-foreground">
        O cliente não existe ou foi removido. Tente novamente com outro ID.
      </p>
      <Button
        className="cursor-pointer"
        onClick={() => navigate({ to: "/admin/clients" })}
        variant="outline"
      >
        <ArrowLeft />
        Voltar
      </Button>
    </main>
  );
}

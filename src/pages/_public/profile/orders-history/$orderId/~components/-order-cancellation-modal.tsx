import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ArrowRight, XCircle } from "lucide-react";

interface OrderCancellationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  orderId: string;
}

export function OrderCancellationModal({
  open,
  onOpenChange,
  onConfirm,
  orderId,
}: OrderCancellationModalProps) {
  return (
    <AlertDialog onOpenChange={onOpenChange} open={open}>
      <AlertDialogContent className="flex flex-col items-center justify-center rounded-lg border-0">
        <AlertDialogHeader className="py-4">
          <AlertDialogTitle className="flex flex-col justify-center w-full items-center gap-4 font-bold text-black text-2xl">
            <XCircle stroke="red" className="w-12 h-12" />
            Deseja realmente cancelar seu pedido?
          </AlertDialogTitle>

          <AlertDialogDescription className="text-center text-base text-gray-600/80">
            Caso queira continuar, seu pedido{" "}
            <strong className="uppercase">#{orderId}</strong> será cancelado
            permanentemente e seu pagamento será reembolsado em até 30 dias.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex flex-row items-center justify-center">
          <AlertDialogCancel
            className="border border-muted-foreground/30 bg-inherit cursor-pointer text-black hover:bg-inherit hover:text-black/90"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </AlertDialogCancel>

          <AlertDialogAction
            className="gap-2 bg-red-500 text-black hover:bg-red-500/90 cursor-pointer"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            Confirmar
            <ArrowRight />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

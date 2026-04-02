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

interface ClearConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function ClearConfirmationModal({
  open,
  onOpenChange,
  onConfirm,
}: ClearConfirmationModalProps) {
  return (
    <AlertDialog onOpenChange={onOpenChange} open={open}>
      <AlertDialogContent className="flex flex-col items-center justify-center rounded-lg border-0">
        <AlertDialogHeader className="py-4">
          <AlertDialogTitle className="flex flex-col text-center w-full items-center gap-4 font-bold text-black text-2xl">
            <XCircle stroke="red" className="w-12 h-12" />
            Deseja realmente esvaziar seu carrinho?
          </AlertDialogTitle>

          <AlertDialogDescription className="text-center text-base text-gray-600/80">
            Caso queira continuar, seu carrinho será esvaziado e todos os itens
            adicionados anteriormente serão removidos, não podendo ser
            recuperados.
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

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
import { Trash2 } from "lucide-react";

interface DeleteConfirmationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClick: () => void;
  title: string;
  description: string;
}

export function DeleteConfirmation({
  open,
  onOpenChange,
  onClick,
  title,
  description,
}: DeleteConfirmationProps) {
  return (
    <AlertDialog onOpenChange={onOpenChange} open={open}>
      <AlertDialogContent className="flex flex-col items-center justify-center rounded-lg border-0">
        <AlertDialogHeader className="py-4">
          <AlertDialogTitle className="flex flex-col justify-center w-full items-center gap-4 font-bold text-black text-xl">
            <Trash2 stroke="red" />
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-base text-muted-foreground">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-row items-center justify-center py-4">
          <AlertDialogCancel
            className="border border-muted-foreground/30 bg-inherit cursor-pointer text-black hover:bg-inherit hover:text-black/90"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            className="gap-2 bg-red-500 text-black hover:bg-red-500/90 cursor-pointer"
            onClick={() => {
              onClick();
              onOpenChange(false);
            }}
          >
            <Trash2 />
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

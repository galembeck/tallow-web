import { useNavigate } from "@tanstack/react-router";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { CircleX } from "lucide-react";
import type { ReactNode } from "react";

interface LeaveConfirmationProps {
  navigateTo: string;
  children: ReactNode;
}

export function LeaveConfirmation({
  navigateTo,
  children,
}: LeaveConfirmationProps) {
  const navigate = useNavigate();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          className="flex w-full items-center gap-4 bg-transparent hover:bg-transparent hover:text-white"
          variant="ghost"
        >
          {children}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="flex flex-col items-center justify-center border-0 shadow-xl">
        <AlertDialogHeader className="flex flex-col py-4">
          <AlertDialogTitle className="flex flex-col justify-center w-full items-center gap-4 font-bold text-black">
            <CircleX stroke="red" className="size-8" />
            Tem certeza que deseja sair?
          </AlertDialogTitle>

          <AlertDialogDescription className="text-muted-foreground text-center">
            Ao sair desta tela, todas as informações preenchidas até o momento
            serão perdidas e não poderão ser recuperadas. Deseja realmente sair?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex flex-row items-center justify-center py-4">
          <AlertDialogCancel className="border border-muted-foreground/30 cursor-pointer! bg-inherit text-black hover:bg-inherithover:text-black/90">
            Cancelar
          </AlertDialogCancel>

          <AlertDialogAction
            className="gap-2 bg-red-500 cursor-pointer! text-black hover:bg-red-500/90"
            onClick={() => navigate({ to: navigateTo })}
          >
            <CircleX />
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

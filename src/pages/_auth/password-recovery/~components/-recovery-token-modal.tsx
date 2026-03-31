import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

const recoveryTokenFormSchema = z.object({
  token: z.string().min(1, "Informe o token de verificação."),
});

type RecoveryTokenFormData = z.infer<typeof recoveryTokenFormSchema>;

interface RecoveryTokenModal {
  children: ReactNode;
}

export function RecoveryTokenModal({ children }: RecoveryTokenModal) {
  const navigate = useNavigate();

  const form = useForm<RecoveryTokenFormData>({
    resolver: zodResolver(recoveryTokenFormSchema),
    defaultValues: {
      token: "",
    },
  });

  function onSubmit(data: RecoveryTokenFormData) {
    // TODO: Implementar verificação de token de recuperação

    console.log(data);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader className="font-bold text-xl">
          Token de verificação
        </DialogHeader>

        <DialogDescription>
          Um token de verificação foi enviado para o seu e-mail informado no
          campo anterior.
        </DialogDescription>

        <form id="recovery-token-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="token"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="recovery-token-form-token">
                    <h6>Token</h6>
                  </FieldLabel>

                  <Input
                    {...field}
                    id="recovery-token-form-token"
                    aria-invalid={fieldState.invalid}
                    placeholder="XXXXXX"
                    type="text"
                  />

                  <FieldDescription>
                    Informe-o no campo acima para continuar com a recuperação.
                  </FieldDescription>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>

          <Button
            type="submit"
            form="recovery-token-form"
            className="bg-amber-900 hover:bg-amber-900/90 text-white"
            onClick={() => navigate({ to: "/password-recovery/reset" })}
          >
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

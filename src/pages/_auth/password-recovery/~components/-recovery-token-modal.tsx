import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAuth } from "@/hooks/services/use-auth";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const RESEND_COOLDOWN_SECONDS = 120;

interface RecoveryTokenModalProps {
  open: boolean;
  email: string;
  onOpenChange: (open: boolean) => void;
}

function formatCountdown(seconds: number): string {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

export function RecoveryTokenModal({
  open,
  email,
  onOpenChange,
}: RecoveryTokenModalProps) {
  const navigate = useNavigate();
  const { verifyRecoveryToken, isVerifyingToken, requestPasswordRecovery } =
    useAuth();

  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN_SECONDS);
  const [isResending, setIsResending] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!open) return;

    setCountdown(RESEND_COOLDOWN_SECONDS);

    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current!);
  }, [open]);

  function resetCountdown() {
    clearInterval(intervalRef.current!);
    setCountdown(RESEND_COOLDOWN_SECONDS);

    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  async function handleResend() {
    setIsResending(true);
    try {
      await requestPasswordRecovery(email);
      setOtp("");
      resetCountdown();
      toast.success("Código reenviado para o seu e-mail.");
    } catch {
      toast.error("Não foi possível reenviar o código. Tente novamente.");
    } finally {
      setIsResending(false);
    }
  }

  async function handleConfirm() {
    if (otp.length < 6) return;

    try {
      await verifyRecoveryToken({ email, token: otp });

      toast.success("Token verificado com sucesso!");

      onOpenChange(false);

      navigate({
        to: "/password-recovery/reset",
        search: { email, token: otp },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("O código informado é inválido ou está expirado.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-bold text-xl">
            Token de verificação
          </DialogTitle>
        </DialogHeader>

        <DialogDescription>
          Um código de 6 caracteres foi enviado para{" "}
          <span className="font-medium text-foreground">{email}</span>. Informe
          abaixo para continuar.
        </DialogDescription>

        <div className="flex flex-col items-center gap-4 py-2">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(value) => setOtp(value.toUpperCase())}
          >
            <InputOTPGroup>
              {Array.from({ length: 6 }).map((_, i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  className="uppercase h-12 w-12 text-base font-semibold"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>

          <Button
            variant="link"
            size="sm"
            className="text-blue-500 h-auto p-0"
            disabled={countdown > 0 || isResending}
            onClick={handleResend}
          >
            {isResending
              ? "Reenviando..."
              : countdown > 0
                ? `Reenviar código (${formatCountdown(countdown)})`
                : "Reenviar código"}
          </Button>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>

          <Button
            className="bg-amber-900 hover:bg-amber-900/90 text-white"
            disabled={otp.length < 6 || isVerifyingToken}
            onClick={handleConfirm}
          >
            {isVerifyingToken ? "Verificando..." : "Confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

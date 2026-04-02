import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/format-date";
import React from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface OrderTimelineProps {
  status: string;
  updatedAt?: string;
}

const TIMELINE_STEPS = [
  { id: 0, label: "Pedido\nrealizado" },
  { id: 1, label: "Pedido\nconfirmado" },
  { id: 2, label: "Pedido em\nseparação" },
  { id: 3, label: "Pedido em\ntrânsito" },
  { id: 4, label: "Pedido\nentregue" },
];

function getStatusIndex(status: string): number {
  switch (status) {
    case "PENDING":
    case "PAYMENT_PENDING":
      return 0;
    case "PAYMENT_APPROVED":
      return 1;
    case "PROCESSING":
      return 2;
    case "SHIPPED":
      return 3;
    case "DELIVERED":
      return 4;
    default:
      return -1;
  }
}

export function OrderTimeline({ status, updatedAt }: OrderTimelineProps) {
  const currentIndex = getStatusIndex(status);

  if (currentIndex === -1) {
    return (
      <div className="w-full rounded-md border border-red-200 bg-red-50 p-4 text-center">
        <p className="text-sm font-medium text-red-600">
          Este pedido foi {status === "CANCELLED" ? "cancelado" : "reembolsado"}{" "}
          e a linha do tempo foi interrompida.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="w-full">
      <div className="flex min-w-150 w-full items-center px-10 pb-12 pt-16">
        {TIMELINE_STEPS.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;
          const isLast = index === TIMELINE_STEPS.length - 1;

          return (
            <React.Fragment key={step.id}>
              <div className="relative flex flex-col items-center justify-center">
                <span
                  className={cn(
                    "absolute bottom-6 w-32 whitespace-pre-line text-center text-[13px] leading-tight transition-colors duration-300",
                    isCurrent
                      ? "font-bold text-emerald-700"
                      : isCompleted
                        ? "font-medium text-foreground"
                        : "font-medium text-muted-foreground",
                  )}
                >
                  {step.label}
                </span>

                <div
                  className={cn(
                    "z-10 h-4 w-4 rounded-full ring-4 ring-background transition-colors duration-500",
                    isCompleted ? "bg-emerald-600" : "bg-muted",
                  )}
                />

                {isCurrent && updatedAt && (
                  <span className="absolute top-6 w-32 text-center text-xs text-muted-foreground">
                    {formatDate(updatedAt).slice(0, 10)}{" "}
                    {formatDate(updatedAt).slice(11, 16)}
                  </span>
                )}
              </div>

              {!isLast && (
                <div
                  className={cn(
                    "h-1 flex-1 transition-colors duration-500",
                    index < currentIndex ? "bg-emerald-600" : "bg-muted",
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

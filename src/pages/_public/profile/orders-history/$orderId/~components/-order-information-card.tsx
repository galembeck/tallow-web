import type { ReactNode } from "react";

interface OrderInformationCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function OrderInformationCard({
  title,
  children,
  className,
}: OrderInformationCardProps) {
  return (
    <div className="bg-amber-900/10 rounded-lg p-4 flex flex-col gap-2">
      <h2 className="font-semibold text-amber-950">{title}</h2>

      <div className={className}>{children}</div>
    </div>
  );
}

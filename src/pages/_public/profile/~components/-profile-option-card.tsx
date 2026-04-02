import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";

interface ProfileOptionCardProps {
  to: string;
  icon: LucideIcon;
  title: string;
}

export function ProfileOptionCard({
  to,
  icon: Icon,
  title,
}: ProfileOptionCardProps) {
  const navigate = useNavigate();

  return (
    <Button
      className="w-full min-h-48 bg-amber-900/10 hover:bg-amber-900/15 hover:border-b-4 hover:border-amber-900 transition-colors duration-300 flex flex-col items-center justify-center gap-2 text-amber-900"
      onClick={() => navigate({ to })}
    >
      <Icon className="w-10! h-10!" />

      <span className="text-lg font-medium">{title}</span>
    </Button>
  );
}

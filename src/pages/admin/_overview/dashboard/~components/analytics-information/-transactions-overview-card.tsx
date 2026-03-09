import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TransactionsOverviewCardProps {
  title: number | string;
  description: string;
  icon: LucideIcon;
  badge: LucideIcon;
  type: "currency" | "number";
  rate?: {
    percentage: string;
    type: "increase" | "decrease";
  };
}

export function TransactionsOverviewCard({
  badge: BadgeIcon,
  type = "currency",
  title,
  rate,
  description,
  icon: Icon,
}: TransactionsOverviewCardProps) {
  return (
    <Card className="flex flex-row items-center justify-between">
      <article className="flex flex-col gap-2 px-2">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="flex items-center justify-between gap-4 font-medium text-muted-foreground text-sm">
            <div className="rounded-2xl border bg-white p-3 dark:bg-card">
              <BadgeIcon />
            </div>

            {rate !== undefined && (
              <Badge
                className={`${
                  rate.type === "increase"
                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                    : "bg-red-100 text-red-800 hover:bg-red-100"
                } flex flex-row items-center`}
                variant={rate.type === "increase" ? "default" : "secondary"}
              >
                {rate.type === "increase" ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}
                {rate.type === "increase" ? "+" : "-"}
                {rate.percentage}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <article className="flex flex-col">
            <div className="font-bold font-dm-sans text-2xl">
              {type === "currency" ? "R$ " : ""}
              {title}
            </div>

            <div className="mt-2 flex flex-col text-sm">
              <span className="flex items-center gap-1 font-medium text-muted-foreground">
                {description}
              </span>
            </div>
          </article>
        </CardContent>
      </article>

      <Icon className="mr-6 text-muted-foreground" size="70" />
    </Card>
  );
}

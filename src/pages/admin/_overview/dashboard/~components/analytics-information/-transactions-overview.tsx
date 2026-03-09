import {
  ArrowRightLeft,
  BanknoteArrowUp,
  RefreshCcw,
  ShoppingBag,
  TicketCheck,
  Upload,
} from "lucide-react";
import { TransactionsOverviewCard } from "./-transactions-overview-card";

export function TransactionsOverview() {
  return (
    <article className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <TransactionsOverviewCard
        badge={TicketCheck}
        description="Total faturado em vendas"
        icon={BanknoteArrowUp}
        rate={{ percentage: "15%", type: "increase" }}
        title="1250,45"
        type="currency"
      />

      <TransactionsOverviewCard
        badge={RefreshCcw}
        description="Transações completas"
        icon={ArrowRightLeft}
        rate={{
          percentage: "27%",
          type: "increase",
        }}
        title="126"
        type="number"
      />

      <TransactionsOverviewCard
        badge={Upload}
        description="Produtos vendidos"
        icon={ShoppingBag}
        rate={{
          percentage: "9%",
          type: "decrease",
        }}
        title="187"
        type="number"
      />
    </article>
  );
}

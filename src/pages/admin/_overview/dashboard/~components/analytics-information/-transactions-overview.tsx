import {
  ArrowRightLeft,
  BanknoteArrowUp,
  RefreshCcw,
  ShoppingBag,
  TicketCheck,
  Upload,
} from "lucide-react";
import { usePayment } from "@/hooks/services/use-payment";
import { useOrder } from "@/hooks/services/use-order";
import type { PaymentAdminDTO } from "@/types/services/payment";
import type { OrderAdminSummaryDTO } from "@/types/services/order";
import { TransactionsOverviewCard } from "./-transactions-overview-card";
import { computeRate } from "@/utils/compute-rate";

function monthOf(dateStr: string) {
  const d = new Date(dateStr);
  return { month: d.getMonth(), year: d.getFullYear() };
}

export function TransactionsOverview() {
  const { allPayments } = usePayment({ enableAllPaymentsQuery: true });
  const { allOrders } = useOrder({ enableAllOrdersQuery: true });

  const payments = (allPayments as PaymentAdminDTO[]) ?? [];
  const orders = (allOrders as OrderAdminSummaryDTO[]) ?? [];

  const now = new Date();
  const curMonth = now.getMonth();
  const curYear = now.getFullYear();
  const prevMonth = curMonth === 0 ? 11 : curMonth - 1;
  const prevYear = curMonth === 0 ? curYear - 1 : curYear;

  const approved = payments.filter((p) => p.status === "APPROVED");

  const curRevenue = approved
    .filter((p) => {
      const { month, year } = monthOf(p.dateCreated);
      return month === curMonth && year === curYear;
    })
    .reduce((sum, p) => sum + p.transactionAmount, 0);

  const prevRevenue = approved
    .filter((p) => {
      const { month, year } = monthOf(p.dateCreated);
      return month === prevMonth && year === prevYear;
    })
    .reduce((sum, p) => sum + p.transactionAmount, 0);

  const totalRevenue = approved.reduce(
    (sum, p) => sum + p.transactionAmount,
    0,
  );

  const curTransactions = approved.filter((p) => {
    const { month, year } = monthOf(p.dateCreated);
    return month === curMonth && year === curYear;
  }).length;

  const prevTransactions = approved.filter((p) => {
    const { month, year } = monthOf(p.dateCreated);
    return month === prevMonth && year === prevYear;
  }).length;

  const totalTransactions = approved.length;

  const curItems = orders
    .filter((o) => {
      const { month, year } = monthOf(o.createdAt);
      return (
        month === curMonth &&
        year === curYear &&
        o.status !== "CANCELLED" &&
        o.status !== "REFUNDED"
      );
    })
    .reduce((sum, o) => sum + o.itemsCount, 0);

  const prevItems = orders
    .filter((o) => {
      const { month, year } = monthOf(o.createdAt);
      return (
        month === prevMonth &&
        year === prevYear &&
        o.status !== "CANCELLED" &&
        o.status !== "REFUNDED"
      );
    })
    .reduce((sum, o) => sum + o.itemsCount, 0);

  const totalItems = orders
    .filter((o) => o.status !== "CANCELLED" && o.status !== "REFUNDED")
    .reduce((sum, o) => sum + o.itemsCount, 0);

  const revenueFormatted = new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(totalRevenue);

  return (
    <article className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <TransactionsOverviewCard
        badge={TicketCheck}
        description="Total faturado em vendas"
        icon={BanknoteArrowUp}
        rate={computeRate(curRevenue, prevRevenue) ?? undefined}
        title={revenueFormatted}
        type="currency"
      />

      <TransactionsOverviewCard
        badge={RefreshCcw}
        description="Transações completas"
        icon={ArrowRightLeft}
        rate={computeRate(curTransactions, prevTransactions) ?? undefined}
        title={totalTransactions}
        type="number"
      />

      <TransactionsOverviewCard
        badge={Upload}
        description="Produtos vendidos"
        icon={ShoppingBag}
        rate={computeRate(curItems, prevItems) ?? undefined}
        title={totalItems}
        type="number"
      />
    </article>
  );
}

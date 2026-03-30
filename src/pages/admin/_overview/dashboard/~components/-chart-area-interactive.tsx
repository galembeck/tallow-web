import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePayment } from "@/hooks/services/use-payment";
import type { PaymentAdminDTO } from "@/types/services/payment";

const chartConfig = {
  pix: {
    label: "PIX",
    color: "var(--chart-1)",
  },
  creditCard: {
    label: "Cartão de Crédito",
    color: "var(--chart-2)",
  },
  boleto: {
    label: "Boleto",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

function toDateKey(dateStr: string) {
  return dateStr.slice(0, 10);
}

function buildChartData(payments: PaymentAdminDTO[], days: number) {
  const approved = payments.filter((p) => p.status === "APPROVED");

  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  const map = new Map<
    string,
    { pix: number; creditCard: number; boleto: number }
  >();

  for (const p of approved) {
    const date = new Date(p.dateCreated);
    if (date < startDate) continue;
    const key = toDateKey(p.dateCreated);
    if (!map.has(key)) map.set(key, { pix: 0, creditCard: 0, boleto: 0 });
    const entry = map.get(key)!;
    if (p.paymentMethod === "PIX") entry.pix += p.transactionAmount;
    else if (p.paymentMethod === "CREDIT_CARD")
      entry.creditCard += p.transactionAmount;
    else if (p.paymentMethod === "BOLETO") entry.boleto += p.transactionAmount;
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, values]) => ({ date, ...values }));
}

export function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = React.useState("90d");

  const { allPayments } = usePayment({ enableAllPaymentsQuery: true });
  const payments = (allPayments as PaymentAdminDTO[]) ?? [];

  const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
  const chartData = buildChartData(payments, days);

  return (
    <Card className="pt-0 w-full">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Vendas por método de pagamento</CardTitle>
          <CardDescription>
            Receita aprovada por PIX, Cartão de Crédito e Boleto
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-44 rounded-lg sm:ml-auto sm:flex"
            aria-label="Selecionar período"
          >
            <SelectValue placeholder="Últimos 3 meses" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Últimos 3 meses
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Últimos 30 dias
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Últimos 7 dias
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-62.5 w-full"
        >
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillPix" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-pix)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-pix)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillCreditCard" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-creditCard)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-creditCard)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillBoleto" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-boleto)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-boleto)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("pt-BR", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={80}
              tickFormatter={(value) =>
                new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                  notation: "compact",
                }).format(value)
              }
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("pt-BR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  }
                  formatter={(value) =>
                    new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(Number(value))
                  }
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="boleto"
              type="natural"
              fill="url(#fillBoleto)"
              stroke="var(--color-boleto)"
              stackId="a"
            />
            <Area
              dataKey="creditCard"
              type="natural"
              fill="url(#fillCreditCard)"
              stroke="var(--color-creditCard)"
              stackId="a"
            />
            <Area
              dataKey="pix"
              type="natural"
              fill="url(#fillPix)"
              stroke="var(--color-pix)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

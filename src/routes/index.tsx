import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowDownRight, ArrowUpRight, Sparkles, PackageSearch } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { ProductDialog, StockBadge, stockLevel } from "@/components/product-dialog";
import { useT } from "@/lib/i18n";
import { convert, formatMoney, useApp } from "@/lib/store";
import {
  CATEGORY_REVENUE,
  INSIGHTS,
  KPI,
  PRODUCTS,
  REVENUE_SERIES,
  type Product,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Executive Dashboard — AGAS seller" },
      {
        name: "description",
        content:
          "Revenue, profit, logistics and inventory analytics for the SGK tenant on the AGAS seller B2B platform.",
      },
      { property: "og:title", content: "Executive Dashboard — AGAS seller" },
      {
        property: "og:description",
        content: "Multi-tenant B2B seller analytics: revenue, profit, orders and stock alerts.",
      },
    ],
  }),
  component: Dashboard,
});

function Kpi({
  label,
  value,
  delta,
  invert,
}: {
  label: string;
  value: string;
  delta: number;
  invert?: boolean;
}) {
  const good = invert ? delta < 0 : delta > 0;
  return (
    <div className="glass rounded-2xl p-5">
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="num mt-2 text-[26px] font-semibold">{value}</p>
      <p
        className={cn(
          "num mt-1 inline-flex items-center gap-1 text-xs font-medium",
          good ? "text-success" : "text-destructive",
        )}
      >
        {delta > 0 ? (
          <ArrowUpRight className="h-3.5 w-3.5" />
        ) : (
          <ArrowDownRight className="h-3.5 w-3.5" />
        )}
        {Math.abs(delta).toFixed(1)}% vs prior period
      </p>
    </div>
  );
}

function Dashboard() {
  const t = useT();
  const { currency, lang } = useApp();
  const [selected, setSelected] = useState<Product | null>(null);

  const revenueData = REVENUE_SERIES.map((d) => ({
    month: d.month,
    revenue: convert(d.revenue, currency),
    profit: convert(d.profit, currency),
  }));
  const categoryData = CATEGORY_REVENUE.map((d) => ({
    category: d.category,
    revenue: convert(d.revenue, currency),
  }));
  const alerts = PRODUCTS.filter((p) => stockLevel(p) !== "ok");
  const symbol = currency === "USD" ? "$" : "₸";

  return (
    <AppShell>
      <PageHeader title={t("dashboard_title")} subtitle={t("dashboard_sub")} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi
          label={t("kpi_revenue")}
          value={formatMoney(KPI.revenue, currency, { compact: true })}
          delta={KPI.revenueDelta}
        />
        <Kpi
          label={t("kpi_profit")}
          value={formatMoney(KPI.profit, currency, { compact: true })}
          delta={KPI.profitDelta}
        />
        <Kpi
          label={t("kpi_orders")}
          value={KPI.orders.toLocaleString("en-US")}
          delta={KPI.ordersDelta}
        />
        <Kpi
          label={t("kpi_disputes")}
          value={String(KPI.disputes)}
          delta={KPI.disputesDelta}
          invert
        />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <section className="glass rounded-2xl p-5 xl:col-span-2">
          <div className="flex items-baseline justify-between">
            <h2 className="text-base font-semibold">{t("chart_rev_profit")}</h2>
            <span className="text-xs text-muted-foreground">{t("chart_rev_profit_sub")}</span>
          </div>
          <div className="mt-4 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ left: -8, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gPro" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  fontSize={11}
                  stroke="var(--muted-foreground)"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  fontSize={11}
                  stroke="var(--muted-foreground)"
                  width={64}
                  tickFormatter={(v: number) =>
                    `${symbol}${v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M` : `${Math.round(v / 1000)}K`}`
                  }
                />
                <Tooltip
                  formatter={(v: number) =>
                    `${symbol}${v.toLocaleString("en-US", { maximumFractionDigits: 0 })}`
                  }
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--border)",
                    fontSize: 12,
                  }}
                />
                <Legend iconType="plainline" wrapperStyle={{ fontSize: 12 }} />
                <Area
                  type="monotone"
                  name={lang === "en" ? "Revenue" : "Выручка"}
                  dataKey="revenue"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  fill="url(#gRev)"
                />
                <Area
                  type="monotone"
                  name={lang === "en" ? "Profit" : "Прибыль"}
                  dataKey="profit"
                  stroke="var(--chart-2)"
                  strokeWidth={2}
                  fill="url(#gPro)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="glass rounded-2xl p-5">
          <h2 className="text-base font-semibold">{t("chart_by_category")}</h2>
          <div className="mt-4 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ left: 24, right: 16 }}>
                <CartesianGrid stroke="var(--border)" horizontal={false} />
                <XAxis
                  type="number"
                  tickLine={false}
                  axisLine={false}
                  fontSize={11}
                  stroke="var(--muted-foreground)"
                  tickFormatter={(v: number) => `${symbol}${(v / 1_000_000).toFixed(1)}M`}
                />
                <YAxis
                  type="category"
                  dataKey="category"
                  tickLine={false}
                  axisLine={false}
                  fontSize={11}
                  width={86}
                  stroke="var(--muted-foreground)"
                />
                <Tooltip
                  cursor={{ fill: "var(--secondary)" }}
                  formatter={(v: number) =>
                    `${symbol}${v.toLocaleString("en-US", { maximumFractionDigits: 0 })}`
                  }
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--border)",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="revenue" radius={[0, 6, 6, 0]} barSize={26}>
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={`var(--chart-${i + 1})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <section className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2">
            <PackageSearch className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-base font-semibold">{t("stock_alerts")}</h2>
          </div>
          <ul className="mt-3 divide-y divide-border">
            {alerts.map((p) => (
              <li key={p.id}>
                <button
                  onClick={() => setSelected(p)}
                  className="flex w-full items-center justify-between gap-3 py-3 text-left transition-opacity hover:opacity-70"
                >
                  <span>
                    <span className="block text-sm font-medium">{p.name}</span>
                    <span className="num block text-xs text-muted-foreground">
                      {p.sku} · {p.stock.toLocaleString("en-US")} {t("units")}
                    </span>
                  </span>
                  <StockBadge product={p} />
                </button>
              </li>
            ))}
          </ul>
          <Link
            to="/catalog"
            className="mt-3 inline-block text-xs font-medium text-primary hover:underline"
          >
            {t("nav_catalog")} →
          </Link>
        </section>

        <section className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h2 className="text-base font-semibold">{t("ai_insights")}</h2>
          </div>
          <ul className="mt-3 space-y-3">
            {INSIGHTS.map((i) => (
              <li
                key={i.en}
                className="rounded-xl border border-border bg-secondary/50 p-3.5 text-[13px] leading-relaxed text-foreground"
              >
                {i[lang]}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <ProductDialog product={selected} onOpenChange={(o) => !o && setSelected(null)} />
    </AppShell>
  );
}

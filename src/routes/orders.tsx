import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, LayoutGrid, Rows3 } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { useT } from "@/lib/i18n";
import { formatMoney, useApp } from "@/lib/store";
import { ORDERS, ORDER_STATUSES, type Order, type OrderStatus } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "Logistics & Current Sales — AGAS seller" },
      {
        name: "description",
        content:
          "Track live B2B orders across processing, transit, customs, delivery and dispute stages.",
      },
      { property: "og:title", content: "Logistics & Current Sales — AGAS seller" },
      {
        property: "og:description",
        content: "Live order tracking with shipping deadlines and warehouse locations.",
      },
    ],
  }),
  component: OrdersPage,
});

const STATUS_STYLE: Record<OrderStatus, string> = {
  Processing: "bg-secondary text-secondary-foreground border-border",
  "In Transit": "bg-primary/10 text-primary border-primary/20",
  Customs: "bg-warning/15 text-warning border-warning/25",
  Delivered: "bg-success/12 text-success border-success/25",
  "Return/Dispute": "bg-destructive/10 text-destructive border-destructive/20",
};

function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
        STATUS_STYLE[status],
      )}
    >
      {status}
    </span>
  );
}

function Deadline({ order }: { order: Order }) {
  const t = useT();
  if (order.status === "Delivered")
    return <span className="text-xs text-muted-foreground">—</span>;
  if (order.daysLeft < 0)
    return <span className="text-xs font-medium text-destructive">{t("overdue")}</span>;
  return (
    <span
      className={cn(
        "num text-xs font-medium",
        order.daysLeft <= 2 ? "text-destructive" : order.daysLeft <= 5 ? "text-warning" : "text-muted-foreground",
      )}
    >
      {order.daysLeft} {t("days_left")}
    </span>
  );
}

function OrdersPage() {
  const t = useT();
  const currency = useApp((s) => s.currency);
  const [view, setView] = useState<"table" | "kanban">("table");

  return (
    <AppShell>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader title={t("orders_title")} subtitle={t("orders_sub")} />
        <div className="flex items-center rounded-full border border-border bg-secondary/70 p-0.5">
          {(
            [
              ["table", t("view_table"), Rows3],
              ["kanban", t("view_kanban"), LayoutGrid],
            ] as const
          ).map(([v, label, Icon]) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                view === v ? "bg-card shadow-sm" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {view === "table" ? (
        <div className="glass overflow-hidden rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3 font-medium">{t("order_id")}</th>
                  <th className="px-5 py-3 font-medium">{t("customer")}</th>
                  <th className="px-5 py-3 font-medium">{t("product")}</th>
                  <th className="px-5 py-3 text-right font-medium">{t("qty")}</th>
                  <th className="px-5 py-3 text-right font-medium">{t("total")}</th>
                  <th className="px-5 py-3 font-medium">{t("status")}</th>
                  <th className="px-5 py-3 font-medium">{t("deadline")}</th>
                  <th className="px-5 py-3 font-medium">{t("warehouse")}</th>
                </tr>
              </thead>
              <tbody>
                {ORDERS.map((o) => (
                  <tr key={o.id} className="border-b border-border/70 last:border-0 hover:bg-secondary/40">
                    <td className="num px-5 py-3.5 font-medium">{o.id}</td>
                    <td className="px-5 py-3.5">{o.customer}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{o.product}</td>
                    <td className="num px-5 py-3.5 text-right">{o.qty}</td>
                    <td className="num px-5 py-3.5 text-right font-medium">
                      {formatMoney(o.total, currency)}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      <Deadline order={o} />
                    </td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{o.warehouse}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-5">
          {ORDER_STATUSES.map((status) => {
            const items = ORDERS.filter((o) => o.status === status);
            return (
              <div key={status} className="glass rounded-2xl p-3">
                <div className="mb-3 flex items-center justify-between px-1">
                  <StatusBadge status={status} />
                  <span className="num text-xs text-muted-foreground">{items.length}</span>
                </div>
                <div className="space-y-2.5">
                  {items.map((o) => (
                    <article key={o.id} className="rounded-xl border border-border bg-card p-3">
                      <div className="flex items-center justify-between">
                        <span className="num text-xs font-medium">{o.id}</span>
                        <Deadline order={o} />
                      </div>
                      <p className="mt-1.5 text-[13px] font-medium">{o.customer}</p>
                      <p className="text-xs text-muted-foreground">{o.product}</p>
                      <p className="num mt-2 text-sm font-semibold">
                        {formatMoney(o.total, currency)}{" "}
                        <span className="text-xs font-normal text-muted-foreground">
                          × {o.qty}
                        </span>
                      </p>
                      <p className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {o.warehouse}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
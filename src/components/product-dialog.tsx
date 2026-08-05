import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Star } from "lucide-react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useT } from "@/lib/i18n";
import { formatMoney, useApp } from "@/lib/store";
import type { Product } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function stockLevel(p: Product) {
  if (p.stock === 0) return "out" as const;
  if (p.stock <= p.reorderPoint) return "low" as const;
  return "ok" as const;
}

export function StockBadge({ product }: { product: Product }) {
  const t = useT();
  const level = stockLevel(product);
  const map = {
    ok: { dot: "bg-success", label: t("in_stock"), cls: "text-success" },
    low: { dot: "bg-warning", label: t("low_stock"), cls: "text-warning" },
    out: { dot: "bg-destructive", label: t("out_stock"), cls: "text-destructive" },
  }[level];
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium", map.cls)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", map.dot)} />
      {map.label}
    </span>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            "h-3.5 w-3.5",
            i <= Math.round(rating) ? "fill-warning text-warning" : "text-border",
          )}
        />
      ))}
    </span>
  );
}

export function ProductDialog({
  product,
  onOpenChange,
}: {
  product: Product | null;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useT();
  const currency = useApp((s) => s.currency);
  if (!product) return null;
  const margin = ((product.price - product.cogs) / product.price) * 100;

  return (
    <Dialog open={!!product} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{product.name}</DialogTitle>
          <DialogDescription>
            {product.sku} · {product.category} · {product.description}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: t("final_price"), value: formatMoney(product.price, currency) },
            { label: t("effective_margin"), value: `${margin.toFixed(1)}%` },
            { label: t("units"), value: product.unitsSold.toLocaleString("en-US") },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-secondary/50 p-3.5">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{s.label}</p>
              <p className="num mt-1 text-lg font-semibold">{s.value}</p>
            </div>
          ))}
        </div>

        <section className="rounded-xl border border-border p-4">
          <p className="text-sm font-semibold">{t("sales_trend")}</p>
          <div className="mt-3 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={product.monthly} margin={{ left: -18, right: 8, top: 8 }}>
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
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--border)",
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="units"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-xl border border-border p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">{t("inventory")}</p>
            <StockBadge product={product} />
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
            <div
              className={cn(
                "h-full rounded-full",
                stockLevel(product) === "ok"
                  ? "bg-success"
                  : stockLevel(product) === "low"
                    ? "bg-warning"
                    : "bg-destructive",
              )}
              style={{
                width: `${Math.min(100, (product.stock / (product.reorderPoint * 3 || 1)) * 100)}%`,
              }}
            />
          </div>
          <p className="num mt-2 text-xs text-muted-foreground">
            {product.stock.toLocaleString("en-US")} {t("units")} · reorder point{" "}
            {product.reorderPoint.toLocaleString("en-US")}
          </p>
        </section>

        <section className="rounded-xl border border-border p-4">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold">{t("reviews")}</p>
            <Stars rating={product.rating} />
            <span className="num text-xs text-muted-foreground">{product.rating.toFixed(1)}</span>
          </div>
          <ul className="mt-3 space-y-3">
            {product.reviews.map((r) => (
              <li key={r.author + r.date} className="rounded-lg bg-secondary/60 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[13px] font-medium">{r.author}</span>
                  <span className="text-[11px] text-muted-foreground">{r.date}</span>
                </div>
                <Stars rating={r.rating} />
                <p className="mt-1.5 text-[13px] text-muted-foreground">{r.text}</p>
              </li>
            ))}
          </ul>
        </section>
      </DialogContent>
    </Dialog>
  );
}
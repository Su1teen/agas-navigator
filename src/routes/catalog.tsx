import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { ProductDialog, StockBadge } from "@/components/product-dialog";
import { useT } from "@/lib/i18n";
import { formatMoney, useApp } from "@/lib/store";
import { CATEGORIES, PRODUCTS, type Product } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/catalog")({
  head: () => ({
    meta: [
      { title: "Product Catalog — AGAS seller" },
      {
        name: "description",
        content:
          "Browse every SKU published by SGK: pricing, margins, inventory health and buyer feedback.",
      },
      { property: "og:title", content: "Product Catalog — AGAS seller" },
      {
        property: "og:description",
        content: "Every SKU with pricing, margin, stock health and buyer reviews.",
      },
    ],
  }),
  component: CatalogPage,
});

function CatalogPage() {
  const t = useT();
  const currency = useApp((s) => s.currency);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [selected, setSelected] = useState<Product | null>(null);

  const items = useMemo(
    () =>
      PRODUCTS.filter(
        (p) =>
          (category === "all" || p.category === category) &&
          (p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.sku.toLowerCase().includes(query.toLowerCase())),
      ),
    [query, category],
  );

  return (
    <AppShell>
      <PageHeader title={t("catalog_title")} subtitle={t("catalog_sub")} />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="glass flex min-w-64 flex-1 items-center gap-2 rounded-full px-4 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("search")}
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["all", ...CATEGORIES].map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                category === c
                  ? "border-transparent bg-foreground text-background"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {c === "all" ? t("all_categories") : c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((p) => {
          const margin = ((p.price - p.cogs) / p.price) * 100;
          return (
            <button
              key={p.id}
              onClick={() => setSelected(p)}
              className="glass group rounded-2xl p-4 text-left transition-transform duration-300 hover:-translate-y-0.5"
            >
              <div className="flex aspect-4/3 items-center justify-center rounded-xl bg-gradient-to-br from-secondary to-accent">
                <span className="text-3xl font-semibold text-muted-foreground/40">
                  {p.name.slice(0, 1)}
                </span>
              </div>
              <p className="mt-3 text-[11px] uppercase tracking-wide text-muted-foreground">
                {p.category}
              </p>
              <p className="mt-0.5 line-clamp-2 text-sm font-medium">{p.name}</p>
              <p className="num mt-2 text-lg font-semibold">{formatMoney(p.price, currency)}</p>
              <div className="mt-2 flex items-center justify-between">
                <StockBadge product={p} />
                <span className="num text-xs text-muted-foreground">
                  {margin.toFixed(0)}% margin
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <ProductDialog product={selected} onOpenChange={(o) => !o && setSelected(null)} />
    </AppShell>
  );
}
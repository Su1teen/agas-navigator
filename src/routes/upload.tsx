import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  UploadCloud,
  ImagePlus,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertTriangle,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/app-shell";
import { useT } from "@/lib/i18n";
import { formatMoney, useApp } from "@/lib/store";
import { CATEGORIES, HASHTAGS, STAGED_ROWS, UPLOAD_HISTORY, type StagedRow } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/upload")({
  head: () => ({
    meta: [
      { title: "Product Onboarding & Pricing Engine — AGAS seller" },
      {
        name: "description",
        content:
          "Publish a single SKU with a live profitability calculator, or validate and import an entire Excel catalog.",
      },
      { property: "og:title", content: "Product Onboarding & Pricing Engine — AGAS seller" },
      {
        property: "og:description",
        content: "Live pricing breakdown, discount modelling and validated bulk Excel import.",
      },
    ],
  }),
  component: UploadPage,
});

const SHIPPING_RATE = 0.2;
const TAX_RATE = 0.21;

function UploadPage() {
  const t = useT();
  const [tab, setTab] = useState<"single" | "bulk">("single");

  return (
    <AppShell>
      <PageHeader title={t("upload_title")} subtitle={t("upload_sub")} />

      <div className="mb-6 inline-flex items-center rounded-full border border-border bg-secondary/70 p-0.5">
        {(
          [
            ["single", t("tab_single")],
            ["bulk", t("tab_bulk")],
          ] as const
        ).map(([v, label]) => (
          <button
            key={v}
            onClick={() => setTab(v)}
            className={cn(
              "rounded-full px-4 py-1.5 text-[13px] font-medium transition-all",
              tab === v ? "bg-card shadow-sm" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "single" ? <SingleProduct /> : <BulkImport />}
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium">{label}</span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40";

function SingleProduct() {
  const t = useT();
  const currency = useApp((s) => s.currency);

  const [name, setName] = useState("Aeris Presence Sensor Mini");
  const [description, setDescription] = useState(
    "Ceiling-mounted mmWave presence sensor for meeting rooms. Sub-second detection, Zigbee 3.0, 3-year commercial warranty.",
  );
  const [category, setCategory] = useState<string>("Smart Home");
  const [tags, setTags] = useState<string[]>(["#new", "#zigbee"]);
  const [images, setImages] = useState<string[]>(["front-view.png"]);
  const [cogs, setCogs] = useState(24);
  const [margin, setMargin] = useState(45);
  const [discountOn, setDiscountOn] = useState(false);
  const [discount, setDiscount] = useState(10);

  const calc = useMemo(() => {
    const safeMargin = Math.min(Math.max(margin, 0), 95);
    const base = safeMargin >= 100 ? cogs : cogs / (1 - safeMargin / 100);
    const shipping = base * SHIPPING_RATE;
    const tax = base * TAX_RATE;
    const listPrice = base + shipping + tax;
    const discountValue = discountOn ? listPrice * (discount / 100) : 0;
    const finalPrice = listPrice - discountValue;
    const netToSeller = finalPrice - shipping - tax;
    const profit = netToSeller - cogs;
    const effMargin = finalPrice > 0 ? (profit / netToSeller) * 100 : 0;
    return { base, shipping, tax, listPrice, discountValue, finalPrice, profit, effMargin };
  }, [cogs, margin, discountOn, discount]);

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <section className="glass space-y-5 rounded-2xl p-5">
        <Field label={t("product_name")}>
          <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
        </Field>

        <Field label={t("description")}>
          <div className="rounded-xl border border-border bg-card">
            <div className="flex items-center gap-1 border-b border-border px-2 py-1.5">
              {["B", "I", "U", "•", "H2"].map((b) => (
                <button
                  key={b}
                  type="button"
                  className="rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  {b}
                </button>
              ))}
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full resize-none bg-transparent px-3.5 py-2.5 text-sm outline-none"
            />
          </div>
        </Field>

        <Field label={t("images")}>
          <button
            type="button"
            onClick={() => setImages((i) => [...i, `image-${i.length + 1}.png`])}
            className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-secondary/40 py-8 text-sm text-muted-foreground transition-colors hover:bg-secondary"
          >
            <ImagePlus className="h-5 w-5" />
            {t("dropzone")}
          </button>
          {images.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {images.map((img) => (
                <span
                  key={img}
                  className="rounded-lg border border-border bg-card px-2.5 py-1 text-[11px] text-muted-foreground"
                >
                  {img}
                </span>
              ))}
            </div>
          )}
        </Field>

        <Field label={t("category")}>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  category === c
                    ? "border-transparent bg-foreground text-background"
                    : "border-border text-muted-foreground hover:text-foreground",
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </Field>

        <Field label={t("hashtags")}>
          <div className="flex flex-wrap gap-1.5">
            {HASHTAGS.map((h) => {
              const active = tags.includes(h);
              return (
                <button
                  key={h}
                  type="button"
                  onClick={() =>
                    setTags((s) => (active ? s.filter((x) => x !== h) : [...s, h]))
                  }
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-[11px] transition-colors",
                    active
                      ? "border-primary/25 bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {h}
                </button>
              );
            })}
          </div>
        </Field>

        <div className="grid gap-4 rounded-xl border border-border bg-secondary/40 p-4 sm:grid-cols-2">
          <p className="sm:col-span-2 text-[13px] font-semibold">{t("pricing")}</p>
          <Field label={t("cogs")}>
            <input
              type="number"
              min={0}
              value={cogs}
              onChange={(e) => setCogs(Number(e.target.value) || 0)}
              className={inputCls}
            />
          </Field>
          <Field label={`${t("margin")} — ${margin}%`}>
            <input
              type="range"
              min={0}
              max={90}
              value={margin}
              onChange={(e) => setMargin(Number(e.target.value))}
              className="mt-3 w-full accent-[var(--primary)]"
            />
          </Field>

          <div className="sm:col-span-2 flex items-center justify-between gap-4 rounded-lg border border-border bg-card px-3.5 py-2.5">
            <span className="text-[13px] font-medium">{t("apply_discount")}</span>
            <div className="flex items-center gap-3">
              {discountOn && (
                <input
                  type="number"
                  min={0}
                  max={80}
                  value={discount}
                  onChange={(e) =>
                    setDiscount(Math.min(80, Math.max(0, Number(e.target.value) || 0)))
                  }
                  className="num w-16 rounded-lg border border-border px-2 py-1 text-sm outline-none"
                />
              )}
              <button
                type="button"
                onClick={() => setDiscountOn((v) => !v)}
                className={cn(
                  "relative h-6 w-11 rounded-full transition-colors",
                  discountOn ? "bg-primary" : "bg-border",
                )}
                aria-pressed={discountOn}
              >
                <span
                  className={cn(
                    "absolute top-0.5 h-5 w-5 rounded-full bg-card shadow-sm transition-transform",
                    discountOn ? "translate-x-5.5" : "translate-x-0.5",
                  )}
                />
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="space-y-5">
        <section className="glass sticky top-24 rounded-2xl p-5">
          <h2 className="text-base font-semibold">{t("breakdown")}</h2>
          <dl className="mt-4 space-y-2.5 text-sm">
            <Row label={t("cogs")} value={formatMoney(cogs, currency)} muted />
            <Row label={t("base_price")} value={formatMoney(calc.base, currency)} />
            <Row label={t("shipping")} value={`+ ${formatMoney(calc.shipping, currency)}`} muted />
            <Row label={t("tax")} value={`+ ${formatMoney(calc.tax, currency)}`} muted />
            {discountOn && (
              <Row
                label={`${t("apply_discount")} (${discount}%)`}
                value={`− ${formatMoney(calc.discountValue, currency)}`}
                tone="destructive"
              />
            )}
            <div className="my-2 border-t border-dashed border-border" />
            <div className="flex items-center justify-between">
              <dt className="text-[13px] font-semibold">{t("final_price")}</dt>
              <dd className="num text-2xl font-semibold">
                {formatMoney(calc.finalPrice, currency)}
              </dd>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border bg-secondary/50 p-3">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  {t("effective_margin")}
                </p>
                <p
                  className={cn(
                    "num mt-1 text-lg font-semibold",
                    calc.effMargin < 15 ? "text-destructive" : "text-success",
                  )}
                >
                  {calc.effMargin.toFixed(1)}%
                </p>
              </div>
              <div className="rounded-xl border border-border bg-secondary/50 p-3">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  {t("profit_per_unit")}
                </p>
                <p className="num mt-1 text-lg font-semibold">
                  {formatMoney(calc.profit, currency)}
                </p>
              </div>
            </div>
          </dl>
          <button
            onClick={() => toast.success(`${name} — ${t("publish_product")} ✓`)}
            className="mt-4 w-full rounded-xl bg-foreground py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            {t("publish_product")}
          </button>
        </section>

        <section className="glass rounded-2xl p-5">
          <h2 className="text-sm font-semibold">{t("live_preview")}</h2>
          <div className="mt-3 max-w-64 rounded-2xl border border-border bg-card p-4">
            <div className="flex aspect-4/3 items-center justify-center rounded-xl bg-gradient-to-br from-secondary to-accent">
              <span className="text-3xl font-semibold text-muted-foreground/40">
                {name.slice(0, 1)}
              </span>
            </div>
            <p className="mt-3 text-[11px] uppercase tracking-wide text-muted-foreground">
              {category}
            </p>
            <p className="mt-0.5 line-clamp-2 text-sm font-medium">{name}</p>
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{description}</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="num text-lg font-semibold">
                {formatMoney(calc.finalPrice, currency)}
              </span>
              {discountOn && (
                <span className="num text-xs text-muted-foreground line-through">
                  {formatMoney(calc.listPrice, currency)}
                </span>
              )}
            </div>
            <div className="mt-1.5 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={cn("h-3 w-3", i <= 4 ? "fill-warning text-warning" : "text-border")}
                />
              ))}
              <span className="text-[11px] text-muted-foreground">(new)</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {tags.map((tag) => (
                <span key={tag} className="text-[10px] text-primary">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  muted,
  tone,
}: {
  label: string;
  value: string;
  muted?: boolean;
  tone?: "destructive";
}) {
  return (
    <div className="flex items-center justify-between">
      <dt className={cn("text-[13px]", muted ? "text-muted-foreground" : "text-foreground")}>
        {label}
      </dt>
      <dd className={cn("num text-[13px] font-medium", tone === "destructive" && "text-destructive")}>
        {value}
      </dd>
    </div>
  );
}

const VALID_CATEGORIES = CATEGORIES as readonly string[];

function rowErrors(row: StagedRow) {
  const errs: string[] = [];
  if (row.price === "" || Number(row.price) <= 0) errs.push("price");
  if (row.cogs === "" || Number(row.cogs) <= 0) errs.push("cogs");
  if (row.stock === "") errs.push("stock");
  if (!VALID_CATEGORIES.includes(row.category)) errs.push("category");
  if (row.price !== "" && row.cogs !== "" && Number(row.price) <= Number(row.cogs))
    errs.push("price");
  return errs;
}

function BulkImport() {
  const t = useT();
  const currency = useApp((s) => s.currency);
  const [uploaded, setUploaded] = useState(true);
  const [rows, setRows] = useState<StagedRow[]>(STAGED_ROWS);

  const invalid = rows.filter((r) => rowErrors(r).length > 0).length;

  const update = (id: number, patch: Partial<StagedRow>) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-3">
        <section className="glass rounded-2xl p-5">
          <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
          <h2 className="mt-3 text-base font-semibold">Master template</h2>
          <p className="mt-1 text-[13px] text-muted-foreground">
            22 columns · SKU, category, COGS, margin, stock, hashtags.
          </p>
          <button
            onClick={() => toast.success("agas_master_template.xlsx")}
            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2 text-[13px] font-medium transition-colors hover:bg-secondary"
          >
            <Download className="h-4 w-4" />
            {t("download_template")}
          </button>
        </section>

        <section className="glass rounded-2xl p-5 lg:col-span-2">
          <button
            onClick={() => {
              setUploaded(true);
              setRows(STAGED_ROWS);
              toast.success("sgk_catalog_august.xlsx — 6 rows staged");
            }}
            className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-secondary/40 py-10 text-sm text-muted-foreground transition-colors hover:bg-secondary"
          >
            <UploadCloud className="h-6 w-6" />
            {t("upload_excel")}
            <span className="text-[11px]">.xlsx · .xls · max 20 MB</span>
          </button>
        </section>
      </div>

      {uploaded && (
        <section className="glass rounded-2xl p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold">{t("validation")}</h2>
              <p className="mt-0.5 flex items-center gap-1.5 text-[13px]">
                {invalid > 0 ? (
                  <>
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <span className="text-destructive">
                      {invalid} {t("errors_found")}
                    </span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span className="text-success">{t("all_valid")}</span>
                  </>
                )}
              </p>
            </div>
            <button
              disabled={invalid > 0}
              onClick={() => toast.success(`${rows.length} products published`)}
              className="rounded-xl bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t("publish_catalog")}
            </button>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[820px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-muted-foreground">
                  <th className="px-3 py-2 font-medium">{t("product_name")}</th>
                  <th className="px-3 py-2 font-medium">SKU</th>
                  <th className="px-3 py-2 font-medium">{t("category")}</th>
                  <th className="px-3 py-2 font-medium">COGS</th>
                  <th className="px-3 py-2 font-medium">{t("final_price")}</th>
                  <th className="px-3 py-2 font-medium">Stock</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const errs = rowErrors(r);
                  const bad = (f: string) => errs.includes(f);
                  return (
                    <tr
                      key={r.id}
                      className={cn(
                        "border-b border-border/70 last:border-0",
                        errs.length > 0 && "bg-destructive/5",
                      )}
                    >
                      <td className="px-3 py-2">{r.name}</td>
                      <td className="num px-3 py-2 text-muted-foreground">{r.sku}</td>
                      <td className="px-3 py-2">
                        <select
                          value={r.category}
                          onChange={(e) => update(r.id, { category: e.target.value })}
                          className={cn(
                            "rounded-lg border bg-card px-2 py-1 text-xs outline-none",
                            bad("category") ? "border-destructive text-destructive" : "border-border",
                          )}
                        >
                          {!VALID_CATEGORIES.includes(r.category) && (
                            <option value={r.category}>{r.category}</option>
                          )}
                          {CATEGORIES.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-2">
                        <CellInput
                          value={r.cogs}
                          invalid={bad("cogs")}
                          onChange={(v) => update(r.id, { cogs: v })}
                        />
                      </td>
                      <td className="px-3 py-2">
                        <CellInput
                          value={r.price}
                          invalid={bad("price")}
                          onChange={(v) => update(r.id, { price: v })}
                        />
                        <span className="num ml-2 text-[11px] text-muted-foreground">
                          {r.price === "" ? "—" : formatMoney(Number(r.price), currency)}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <CellInput
                          value={r.stock}
                          invalid={bad("stock")}
                          onChange={(v) => update(r.id, { stock: v })}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className="glass rounded-2xl p-5">
        <h2 className="text-base font-semibold">{t("upload_history")}</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-muted-foreground">
                <th className="px-3 py-2 font-medium">{t("date")}</th>
                <th className="px-3 py-2 font-medium">{t("file_name")}</th>
                <th className="px-3 py-2 text-right font-medium">{t("items_processed")}</th>
                <th className="px-3 py-2 font-medium">{t("status")}</th>
              </tr>
            </thead>
            <tbody>
              {UPLOAD_HISTORY.map((b) => (
                <tr key={b.file} className="border-b border-border/70 last:border-0">
                  <td className="num px-3 py-2.5">{b.date}</td>
                  <td className="px-3 py-2.5">{b.file}</td>
                  <td className="num px-3 py-2.5 text-right">{b.items.toLocaleString("en-US")}</td>
                  <td className="px-3 py-2.5">
                    <span
                      className={cn(
                        "rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
                        b.status === "Completed"
                          ? "border-success/25 bg-success/12 text-success"
                          : b.status === "Failed"
                            ? "border-destructive/20 bg-destructive/10 text-destructive"
                            : "border-warning/25 bg-warning/15 text-warning",
                      )}
                    >
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function CellInput({
  value,
  invalid,
  onChange,
}: {
  value: number | "";
  invalid: boolean;
  onChange: (v: number | "") => void;
}) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
      className={cn(
        "num w-24 rounded-lg border bg-card px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-ring/40",
        invalid ? "border-destructive text-destructive" : "border-border",
      )}
    />
  );
}
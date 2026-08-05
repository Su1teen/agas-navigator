import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, UserPlus } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { useT } from "@/lib/i18n";
import { useApp, FX_RATE } from "@/lib/store";
import { ROLE_PERMISSIONS, TEAM } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings & Team — AGAS seller" },
      {
        name: "description",
        content:
          "Manage SGK workspace preferences and role-based access for owners, catalog editors and financial analysts.",
      },
      { property: "og:title", content: "Settings & Team — AGAS seller" },
      {
        property: "og:description",
        content: "Role-based access control and workspace preferences for the SGK tenant.",
      },
    ],
  }),
  component: SettingsPage,
});

const ROLE_STYLE: Record<string, string> = {
  Owner: "bg-primary/10 text-primary border-primary/20",
  "Catalog Editor": "bg-success/12 text-success border-success/25",
  "Financial Analyst": "bg-warning/15 text-warning border-warning/25",
};

function SettingsPage() {
  const t = useT();
  const { lang, currency } = useApp();

  return (
    <AppShell>
      <PageHeader title={t("settings_title")} subtitle={t("settings_sub")} />

      <div className="grid gap-5 lg:grid-cols-3">
        <section className="glass rounded-2xl p-5">
          <h2 className="text-base font-semibold">Workspace</h2>
          <dl className="mt-4 space-y-3 text-sm">
            {[
              ["Tenant", t("tenant")],
              ["Plan", "Enterprise · 250 seats"],
              ["Default language", lang === "en" ? "English (EN)" : "Русский (RU)"],
              ["Reporting currency", currency === "USD" ? "USD ($)" : "KZT (₸)"],
              ["FX rate", `1 USD = ${FX_RATE} KZT`],
              ["Data residency", "Kazakhstan (Almaty region)"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-start justify-between gap-4 border-b border-border pb-3 last:border-0">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="text-right font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="glass rounded-2xl p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-base font-semibold">{t("members")}</h2>
            </div>
            <button className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3.5 py-1.5 text-xs font-medium text-background transition-opacity hover:opacity-90">
              <UserPlus className="h-3.5 w-3.5" />
              {t("invite")}
            </button>
          </div>

          <ul className="mt-4 divide-y divide-border">
            {TEAM.map((m) => (
              <li key={m.email} className="flex flex-wrap items-center gap-4 py-3.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-xs font-semibold">
                  {m.initials}
                </span>
                <span className="min-w-40 flex-1">
                  <span className="block text-sm font-medium">{m.name}</span>
                  <span className="block text-xs text-muted-foreground">{m.email}</span>
                </span>
                <span
                  className={cn(
                    "rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
                    ROLE_STYLE[m.role],
                  )}
                >
                  {m.role}
                </span>
                <span className="w-24 text-right text-xs text-muted-foreground">
                  {m.lastActive}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {(Object.keys(ROLE_PERMISSIONS) as (keyof typeof ROLE_PERMISSIONS)[]).map((role) => (
              <div key={role} className="rounded-xl border border-border bg-secondary/40 p-3.5">
                <p className="text-[13px] font-semibold">{role}</p>
                <p className="mt-0.5 text-[11px] uppercase tracking-wide text-muted-foreground">
                  {t("permissions")}
                </p>
                <ul className="mt-2 space-y-1">
                  {ROLE_PERMISSIONS[role].map((p) => (
                    <li key={p} className="text-xs text-muted-foreground">
                      · {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}